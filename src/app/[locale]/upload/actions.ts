'use server'

import { PDFParse } from 'pdf-parse';
import { db } from '@/lib/db-config';
import { documents } from '@/lib/db-schema';
import { generateEmbedding, generateEmbeddings } from '@/lib/embeddings';
import { chunkContent } from '@/lib/chunking'; 

export async function processPDFFile(formData: FormData) {
  try {
    const file = formData.get('pdf') as File;
    if (!file) {
      return { success: false, error: 'No file uploaded.' };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Initialize the modern PDFParse class
    const parser = new PDFParse({ data: buffer });
    const data = await parser.getText();

    if (!data.text || data.text.trim().length === 0) {
      return { success: false, error: 'No readable text found in the PDF.' };
    }

    // Split text into chunks
    const chunks = await chunkContent(data.text);
    
    // Generate embeddings for all chunks in a batch
    const embeddings = await generateEmbeddings(chunks);

    // Map to db schema records, specifying the required 'source' column
    const records = chunks.map((chunk, index) => ({
      content: chunk,
      embedding: embeddings[index],
      source: file.name || 'pdf-upload', 
    }));

    // Insert records into Neon DB
    await db.insert(documents).values(records);

    return { 
      success: true, 
      message: `Successfully processed PDF and created ${chunks.length} searchable chunks.` 
    };
  } catch (error) {
    console.error('PDF processing error:', error);
    return { success: false, error: 'Failed to process the PDF document.' };
  }
} 