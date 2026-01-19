import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// Define the data directory path
const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'app-data.json');

export async function GET() {
  try {
    // Check if file exists
    if (!existsSync(DATA_FILE)) {
      // Return empty data structure if file doesn't exist
      return NextResponse.json({
        modules: [],
        questions: {},
        answers: {},
        lastUpdated: null,
      });
    }

    // Read file
    const fileContent = await readFile(DATA_FILE, 'utf-8');
    const data = JSON.parse(fileContent);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error loading data:', error);
    // Return empty data structure on error
    return NextResponse.json({
      modules: [],
      questions: {},
      answers: {},
      lastUpdated: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
