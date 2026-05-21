import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { db } from '@/lib/db-config';
import { documents } from '@/lib/db-schema';
import { generateEmbeddings } from '@/lib/embeddings';
import { chunkContent } from '@/lib/chunking';
import { eq } from 'drizzle-orm';

export const maxDuration = 60; // Allow 60 seconds for processing

/**
 * This route handler processes a local projects.txt file, creates embeddings,
 * and stores them in the database.
 * To trigger it, send a GET request to /api/embed-projects.
 */
export async function GET() {
  try {
    console.log('Starting processing for projects.txt...');
    // Assumes your file is in /src/data/projects.txt
    const filePath = path.join(process.cwd(), 'src', 'data', 'projects.txt');

    // Read the text file
    const textContent = await fs.readFile(filePath, 'utf-8');
    console.log('projects.txt file read successfully.');

    if (!textContent || textContent.trim().length === 0) {
      console.error('No text found in projects.txt');
      return NextResponse.json(
        { success: false, error: 'No text found in projects.txt' },
        { status: 400 }
      );
    }
    console.log(
      `Extracted ${textContent.length} characters from projects.txt.`
    );

    // Chunk the text
    const chunks = await chunkContent(textContent);
    console.log(`Created ${chunks.length} project chunks.`);

    // Generate embeddings
    const embeddings = await generateEmbeddings(chunks);
    console.log('Generated embeddings for all project chunks.');

    // Prepare records with the 'source' tag
    const records = chunks.map((chunk, index) => ({
      content: chunk,
      embedding: embeddings[index],
      source: 'projects', // Tag each chunk with 'projects'
    }));

    // --- SAFER DELETE ---
    // Only delete documents tagged as 'projects'
    console.log("Clearing existing 'projects' documents from the database...");
    await db.delete(documents).where(eq(documents.source, 'projects'));
    console.log("Old 'projects' documents cleared.");

    // Insert the new records
    console.log(`Inserting ${records.length} new 'projects' records...`);
    await db.insert(documents).values(records);
    console.log("Successfully inserted new 'projects' records.");

    return NextResponse.json({
      success: true,
      message: `Created and stored ${records.length} searchable chunks from projects.txt.`,
    });
  } catch (error) {
    console.error('projects.txt processing error:', error);
    let errorMessage = 'Failed to process projects.txt';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
