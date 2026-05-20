import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { db } from '@/lib/db-config';
import { documents } from '@/lib/db-schema';
import { generateEmbeddings } from '@/lib/embeddings';
import { chunkContent } from '@/lib/chunking';
import pdf from 'pdf-parse';
import { eq } from 'drizzle-orm'; // Import the 'eq' operator

export const maxDuration = 60; // Allow 60 seconds for processing

export async function GET() {
  try {
    console.log('Starting PDF processing for CV...');
    const filePath = path.join(
      process.cwd(),
      'public',
      'Alevtina-Gordienko-CV-RU.pdf'
    );

    const buffer = await fs.readFile(filePath);
    console.log('CV PDF file read successfully.');

    const data = await pdf(buffer);

    if (!data.text || data.text.trim().length === 0) {
      console.error('No text found in CV PDF');
      return NextResponse.json(
        { success: false, error: 'No text found in CV PDF' },
        { status: 400 }
      );
    }
    console.log(`Extracted ${data.text.length} characters from CV PDF.`);

    const chunks = await chunkContent(data.text);
    console.log(`Created ${chunks.length} CV chunks.`);

    const embeddings = await generateEmbeddings(chunks);
    console.log('Generated embeddings for all CV chunks.');

    // Prepare records with the new 'source' tag
    const records = chunks.map((chunk, index) => ({
      content: chunk,
      embedding: embeddings[index],
      source: 'cv', // Tag each chunk with 'cv'
    }));

    // --- SAFER DELETE ---
    // Only delete documents tagged as 'cv'
    console.log("Clearing existing 'cv' documents from the database...");
    await db.delete(documents).where(eq(documents.source, 'cv'));
    console.log("Old 'cv' documents cleared.");

    // Insert the new records
    console.log(`Inserting ${records.length} new 'cv' records...`);
    await db.insert(documents).values(records);
    console.log("Successfully inserted new 'cv' records.");

    return NextResponse.json({
      success: true,
      message: `Created and stored ${records.length} searchable chunks from CV.`,
    });
  } catch (error) {
    console.error('CV PDF processing error:', error);
    let errorMessage = 'Failed to process CV PDF';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
