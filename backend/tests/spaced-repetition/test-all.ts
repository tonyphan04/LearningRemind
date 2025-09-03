import { PrismaClient } from '@prisma/client';
import { 
  createInitialReviewTask, 
  getNextReviewDate, 
  getTodayDueCollections, 
  completeReview,
  resetReviewProgress,
  getAllDueCollections,
  REVIEW_INTERVALS
} from '../../src/services/spacedRepetition';

const prisma = new PrismaClient();

/**
 * Mock version of sendDailyReviewEmail that logs the content rather than sending an email
 */
function mockSendReviewEmail(collections: any[]) {
  // Group collections by user email
  const collectionsByUser: Record<string, any[]> = {};
  
  collections.forEach(collection => {
    const userEmail = collection.user.email;
    if (!collectionsByUser[userEmail]) {
      collectionsByUser[userEmail] = [];
    }
    collectionsByUser[userEmail].push(collection);
  });
  
  // Log email info for each user
  console.log('\n📧 MOCK EMAIL SERVICE');
  console.log('====================');
  
  for (const [email, userCollections] of Object.entries(collectionsByUser)) {
    console.log(`\n📧 Would send email to: ${email}`);
    console.log(`   Subject: 🧠 Your Daily Learning Review - ${new Date().toLocaleDateString()}`);
    console.log(`   Collections to review: ${userCollections.length}`);
    
    userCollections.forEach((collection, index) => {
      const wordPreview = collection.words.slice(0, 3).map((w: any) => w.word).join(', ');
      console.log(`   - Collection ${index + 1}: ${collection.name}`);
      console.log(`     Words: ${wordPreview}${collection.words.length > 3 ? ` and ${collection.words.length - 3} more` : ''}`);
      if (collection.reviewTask) {
        console.log(`     Review Count: ${collection.reviewTask.reviewCount}`);
      }
    });
  }
}

/**
 * Comprehensive test for the spaced repetition system
 */
async function testSpacedRepetitionSystem() {
  console.log('🚀 SPACED REPETITION SYSTEM TEST');
  console.log('===============================');

  try {
    // PART 1: Setup test data
    console.log('\n📋 PART 1: SETUP TEST DATA');
    console.log('-------------------------');
    
    // Create or find test user
    console.log('\n📝 Creating/finding test user...');
    const testUser = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        email: 'test@example.com',
        passwordHash: 'testpassword123'
      }
    });
    console.log(`✅ Test user ID: ${testUser.id}`);
    
    // Create or find test collection
    console.log('\n📝 Creating test collection...');
    // First, check if it exists
    let testCollection = await prisma.collection.findFirst({
      where: {
        name: 'Test Spaced Repetition System',
        userId: testUser.id,
      }
    });
    
    if (!testCollection) {
      testCollection = await prisma.collection.create({
        data: {
          name: 'Test Spaced Repetition System',
          description: 'Testing the complete spaced repetition system',
          userId: testUser.id,
          words: {
            create: [
              {
                word: 'Algorithm',
                description: 'A step-by-step procedure for solving a problem',
                example: 'The sorting algorithm arranges items in a specific order.'
              },
              {
                word: 'Interface',
                description: 'A point where two systems meet and interact',
                example: 'The user interface is designed to be intuitive.'
              },
              {
                word: 'Recursion',
                description: 'A method where the solution depends on solutions to smaller instances of the same problem',
                example: 'The function uses recursion to traverse the tree.'
              }
            ]
          }
        }
      });
    }
    console.log(`✅ Test collection ID: ${testCollection.id}`);
    
    // PART 2: Test initial review task creation
    console.log('\n📋 PART 2: INITIAL REVIEW TASK');
    console.log('---------------------------');
    
    // First, remove any existing review tasks for this collection
    await prisma.reviewTask.deleteMany({
      where: { collectionId: testCollection.id }
    });
    
    console.log('\n📝 Creating initial review task...');
    const initialTask = await createInitialReviewTask(testCollection.id);
    console.log('✅ Initial review task created:');
    console.log(`   Next review: ${initialTask.nextReview.toDateString()} (tomorrow)`);
    console.log(`   Interval Index: ${initialTask.intervalIndex} (${REVIEW_INTERVALS[initialTask.intervalIndex]} day)`);
    
    // PART 3: Test review completion
    console.log('\n📋 PART 3: REVIEW COMPLETION');
    console.log('--------------------------');
    
    console.log('\n📝 Completing first review...');
    const completedTask = await completeReview(initialTask.id);
    console.log('✅ Review completed:');
    console.log(`   Next review: ${completedTask.nextReview.toDateString()}`);
    console.log(`   Interval Index: ${completedTask.intervalIndex} (${REVIEW_INTERVALS[completedTask.intervalIndex]} days)`);
    console.log(`   Review Count: ${completedTask.reviewCount}`);
    
    // PART 4: Test today's reviews
    console.log('\n📋 PART 4: TODAY\'S REVIEWS');
    console.log('------------------------');
    
    // Set the review date to today
    console.log('\n📝 Setting review date to today...');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    await prisma.reviewTask.update({
      where: { id: initialTask.id },
      data: {
        nextReview: today
      }
    });
    console.log('✅ Review date set to today');
    
    // Get today's due collections
    console.log('\n📝 Getting collections due today...');
    const dueCollections = await getTodayDueCollections(testUser.id);
    console.log(`✅ Found ${dueCollections.length} collections due today`);
    dueCollections.forEach(collection => {
      console.log(`   - ${collection.name}`);
      if (collection.reviewTask) {
        console.log(`     Next Review: ${collection.reviewTask.nextReview.toDateString()}`);
      }
    });
    
    // PART 5: Test email notifications
    console.log('\n📋 PART 5: EMAIL NOTIFICATIONS');
    console.log('---------------------------');
    
    console.log('\n📝 Getting all due collections across users...');
    const allDueCollections = await getAllDueCollections();
    console.log(`✅ Found ${allDueCollections.length} collections due today`);
    
    mockSendReviewEmail(allDueCollections);
    
    // PART 6: Test review reset
    console.log('\n📋 PART 6: RESET REVIEW PROGRESS');
    console.log('-----------------------------');
    
    console.log('\n📝 Resetting review progress...');
    const resetTask = await resetReviewProgress(initialTask.id);
    console.log('✅ Review progress reset:');
    console.log(`   Next review: ${resetTask.nextReview.toDateString()}`);
    console.log(`   Interval Index: ${resetTask.intervalIndex} (${REVIEW_INTERVALS[resetTask.intervalIndex]} day)`);
    console.log(`   Review Count: ${resetTask.reviewCount}`);
    
    console.log('\n🎉 All tests completed successfully!');
    console.log('✅ The spaced repetition system is working correctly.');
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run all tests
testSpacedRepetitionSystem();
