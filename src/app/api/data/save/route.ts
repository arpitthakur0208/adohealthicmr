import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// Define the data directory path
const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'app-data.json');

export async function POST(request: NextRequest) {
  try {
    // Ensure data directory exists
    if (!existsSync(DATA_DIR)) {
      await mkdir(DATA_DIR, { recursive: true });
    }

    // Get the data from request body
    const data = await request.json();

    // Validate data structure
    if (!data || typeof data !== 'object') {
      return NextResponse.json(
        { error: 'Invalid data format' },
        { status: 400 }
      );
    }

    // Add timestamp
    const dataToSave = {
      ...data,
      lastUpdated: new Date().toISOString(),
      savedAt: new Date().toISOString(),
    };

    // Write to file
    await writeFile(DATA_FILE, JSON.stringify(dataToSave, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      message: 'Data saved successfully',
      savedAt: dataToSave.savedAt,
    });
  } catch (error) {
    console.error('Error saving data:', error);
    return NextResponse.json(
      { error: 'Failed to save data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
