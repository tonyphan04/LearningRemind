import { PrismaClient } from '@prisma/client';
import { 
  createInitialReviewTask, 
  getNextReviewDate, 
  getTodayDueCollections, 
  completeReview,
  resetReviewProgress,
  REVIEW_INTERVALS
} from './src/services/spacedRepetition';

const prisma = new PrismaClient();

/**
 * Test the spaced repetition functionality
 */
async function testSpacedRepetition() {
  console.log('🚀 Starting Spaced Repetition Test');
  console.log('===================================');

  try {
    // 1. Create a test user
    console.log('📝 Creating test user...');
    const testUser = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        email: 'test@example.com',
        passwordHash: 'testpassword123'
      }
    });
    console.log(`✅ Test user created with ID: ${testUser.id}`);

    // 2. Create a test collection
    console.log('\n📝 Creating test collection...');
    const testCollection = await prisma.collection.create({
      data: {
        name: 'Test Spaced Repetition',
        description: 'A test collection for spaced repetition',
        userId: testUser.id,
        words: {
          create: [
            {
              word: 'Hello',
              description: 'A greeting',
              example: 'Hello, how are you?'
            },
            {
              word: 'World',
              description: 'The planet we live on',
              example: 'The world is round.'
            }
          ]
        }
      }
    });
    console.log(`✅ Test collection created with ID: ${testCollection.id}`);

    // 3. Create initial review task
    console.log('\n📝 Creating initial review task...');
    const initialTask = await createInitialReviewTask(testCollection.id);
    console.log(`✅ Initial review task created:`);
    console.log(`   Next review: ${initialTask.nextReview.toDateString()}`);
    console.log(`   Interval Index: ${initialTask.intervalIndex}`);
    console.log(`   Review Count: ${initialTask.reviewCount}`);

    // 4. Simulate review completion multiple times
    console.log('\n📊 Simulating review completions...');
    console.log('   Review Intervals:', REVIEW_INTERVALS);
    
    let task = initialTask;
    // Simulate 5 reviews
    for (let i = 0; i < 5; i++) {
      console.log(`\n📝 Completing review #${i + 1}...`);
      task = await completeReview(task.id);
      
      // Show the next review date
      const daysUntilNextReview = Math.round(
        (task.nextReview.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );
      console.log(`✅ Review completed:`);
      console.log(`   Next review: ${task.nextReview.toDateString()} (in ~${daysUntilNextReview} days)`);
      console.log(`   Interval Index: ${task.intervalIndex}`);
      console.log(`   Current interval: ${REVIEW_INTERVALS[task.intervalIndex]} days`);
      console.log(`   Review Count: ${task.reviewCount}`);
    }

    // 5. Reset the review progress
    console.log('\n📝 Resetting review progress...');
    const resetTask = await resetReviewProgress(task.id);
    console.log(`✅ Review progress reset:`);
    console.log(`   Next review: ${resetTask.nextReview.toDateString()}`);
    console.log(`   Interval Index: ${resetTask.intervalIndex}`);
    console.log(`   Review Count: ${resetTask.reviewCount}`);

    // 6. Check due collections
    console.log('\n📝 Getting collections due today...');
    const dueCollections = await getTodayDueCollections(testUser.id);
    console.log(`✅ Found ${dueCollections.length} collections due today`);
    if (dueCollections.length > 0) {
      console.log('   Collections:');
      dueCollections.forEach(collection => {
        console.log(`   - ${collection.name} (ID: ${collection.id})`);
      });
    }

    console.log('\n🎉 Test completed successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    // Clean up test data (optional - comment out to keep test data)
    /*
    console.log('\n🧹 Cleaning up test data...');
    await prisma.reviewTask.deleteMany({ 
      where: { collection: { name: 'Test Spaced Repetition' } } 
    });
    await prisma.word.deleteMany({
      where: { collection: { name: 'Test Spaced Repetition' } }
    });
    await prisma.collection.deleteMany({ 
      where: { name: 'Test Spaced Repetition' } 
    });
    console.log('✅ Test data cleaned up');
    */

    await prisma.$disconnect();
  }
}

// Run the test
testSpacedRepetition()
  .catch(e => {
    console.error('Error during test:', e);
    process.exit(1);
  });
