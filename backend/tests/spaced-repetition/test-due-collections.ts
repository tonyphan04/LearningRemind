import { PrismaClient } from '@prisma/client';
import { 
  getTodayDueCollections,
  getAllDueCollections
} from '../../src/services/spacedRepetition';

const prisma = new PrismaClient();

/**
 * Test retrieving today's due collections
 */
async function testTodayReviews() {
  console.log('🚀 Starting Today\'s Reviews Test');
  console.log('================================');

  try {
    // 1. Get a test user (using the one created in the previous test)
    console.log('📝 Finding test user...');
    const testUser = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    });
    
    if (!testUser) {
      console.log('❌ Test user not found, run the first test script first');
      return;
    }
    
    console.log(`✅ Found test user with ID: ${testUser.id}`);

    // 2. Find our test collection
    console.log('\n📝 Finding test collection...');
    const testCollection = await prisma.collection.findFirst({
      where: {
        name: 'Test Spaced Repetition',
        userId: testUser.id,
      }
    });

    if (!testCollection) {
      console.log('❌ Test collection not found, run the first test script first');
      return;
    }

    console.log(`✅ Found test collection with ID: ${testCollection.id}`);

    // 3. Set the nextReview date to today to make it appear in today's reviews
    console.log('\n📝 Setting review date to today...');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    await prisma.reviewTask.updateMany({
      where: { collectionId: testCollection.id },
      data: {
        nextReview: today
      }
    });
    console.log('✅ Review date set to today');

    // 4. Get today's due reviews for the user
    console.log('\n📝 Getting today\'s due reviews for the user...');
    const userDueCollections = await getTodayDueCollections(testUser.id);
    
    console.log(`✅ Found ${userDueCollections.length} collections due today for the user`);
    userDueCollections.forEach(collection => {
      console.log(`   - ${collection.name} (ID: ${collection.id})`);
      if (collection.reviewTask) {
        console.log(`     Review Task ID: ${collection.reviewTask.id}`);
        console.log(`     Next Review: ${collection.reviewTask.nextReview.toDateString()}`);
      }
      console.log(`     Words: ${collection.words.length}`);
    });

    // 5. Get all due collections (across all users)
    console.log('\n📝 Getting all due collections...');
    const allDueCollections = await getAllDueCollections();
    
    console.log(`✅ Found ${allDueCollections.length} collections due today across all users`);
    allDueCollections.forEach(collection => {
      console.log(`   - ${collection.name} (ID: ${collection.id}, User: ${collection.user.email})`);
      if (collection.reviewTask) {
        console.log(`     Review Task ID: ${collection.reviewTask.id}`);
        console.log(`     Next Review: ${collection.reviewTask.nextReview.toDateString()}`);
      }
    });

    console.log('\n🎉 Test completed successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testTodayReviews()
  .catch(e => {
    console.error('Error during test:', e);
    process.exit(1);
  });
