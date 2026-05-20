import { embed, embedMany } from 'ai';

// const embeddingModel = 'openai/text-embedding-3-small';
const embeddingModel = 'google/text-multilingual-embedding-002';

export async function generateEmbedding(text: string): Promise<number[]> {
  const input = text.replaceAll('\n', ' ');

  const { embedding } = await embed({
    model: embeddingModel,
    value: input,
  });

  return embedding;
}
 
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const inputs = texts.map((text) => text.replaceAll('\n', ' '));

  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: inputs,
  });

  return embeddings;
}