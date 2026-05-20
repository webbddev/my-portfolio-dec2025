import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { db } from '@/lib/db-config';
import { documents } from '@/lib/db-schema';
import { generateEmbeddings } from '@/lib/embeddings';
import { chunkContent } from '@/lib/chunking';
import { PDFParse } from 'pdf-parse';
import { eq } from 'drizzle-orm';

export const maxDuration = 60; // Allow 60 seconds for processing

export async function GET() {
  try {
    console.log('Starting PDF processing for CV...');
    
    // Scan public folder for a CV PDF dynamically
    const publicDir = path.join(process.cwd(), 'public');
    let files: string[] = [];
    try {
      files = await fs.readdir(publicDir);
    } catch (err) {
      console.error('Failed to read public directory:', err);
      return NextResponse.json(
        { success: false, error: 'Failed to access public directory.' },
        { status: 500 }
      );
    }

    const cvFile = files.find(file => {
      const lower = file.toLowerCase();
      return lower.endsWith('.pdf') && (lower.includes('cv') || lower.includes('resume'));
    });

    if (!cvFile) {
      console.error('No CV or Resume PDF found in public folder');
      return NextResponse.json(
        { success: false, error: 'No CV/Resume PDF file (containing "cv" or "resume" in its name) found in public folder.' },
        { status: 404 }
      );
    }

    const filePath = path.join(publicDir, cvFile);
    console.log(`Detected CV file: ${cvFile}`);

    const buffer = await fs.readFile(filePath);
    console.log('CV PDF file read successfully.');

    // Initialize modern PDFParse class as per next-intl tutorial/upload actions
    const parser = new PDFParse({ data: buffer });
    const data = await parser.getText();

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
