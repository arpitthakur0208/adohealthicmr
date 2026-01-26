/**
 * Migration script to import existing JSON data into MongoDB
 * Run this with: npx tsx src/scripts/migrate-data.ts
 * Or: ts-node src/scripts/migrate-data.ts
 */

import { readFile } from 'fs/promises';
import path from 'path';
import connectDB from '../lib/db';
import Module from '../models/Module';
import Question from '../models/Question';

const DATA_FILE = path.join(process.cwd(), 'data', 'app-data.json');

async function migrateData() {
  try {
    console.log('🔄 Starting data migration...');
    
    // Connect to database
    await connectDB();
    console.log('✅ Connected to database');

    // Read existing JSON file
    const fileContent = await readFile(DATA_FILE, 'utf-8');
    const data = JSON.parse(fileContent);
    console.log('✅ Loaded JSON data file');

    // Migrate modules
    if (data.modules && Array.isArray(data.modules)) {
      console.log(`📦 Migrating ${data.modules.length} modules...`);
      for (const moduleData of data.modules) {
        await Module.findOneAndUpdate(
          { id: moduleData.id },
          {
            id: moduleData.id,
            title: moduleData.title,
            description: moduleData.description,
            color: moduleData.color,
          },
          { upsert: true, new: true }
        );
      }
      console.log('✅ Modules migrated successfully');
    }

    // Migrate questions
    if (data.questions && typeof data.questions === 'object') {
      let totalQuestions = 0;
      console.log('📝 Migrating questions...');
      
      for (const [moduleIdStr, questions] of Object.entries(data.questions)) {
        const moduleId = parseInt(moduleIdStr);
        if (!isNaN(moduleId) && Array.isArray(questions)) {
          for (const questionData of questions) {
            await Question.findOneAndUpdate(
              { id: questionData.id, moduleId },
              {
                id: questionData.id,
                moduleId,
                question: questionData.question,
                options: questionData.options,
                correctAnswer: questionData.correctAnswer,
              },
              { upsert: true, new: true }
            );
            totalQuestions++;
          }
        }
      }
      console.log(`✅ ${totalQuestions} questions migrated successfully`);
    }

    console.log('🎉 Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrateData();
