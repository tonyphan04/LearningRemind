import { PrismaClient } from '@prisma/client';
import { getAllDueCollections } from '../../src/services/spacedRepetition';

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
 * Test the email notification system
 */
async function testEmailNotifications() {
  console.log('🚀 Starting Email Notification Test');
  console.log('=================================');

  try {
    // 1. Ensure we have a test collection due today
    console.log('📝 Finding collections due today...');
    const dueCollections = await getAllDueCollections();
    
    if (dueCollections.length === 0) {
      console.log('❌ No collections due today, please run test-due-collections.ts first');
      return;
    }
    
    console.log(`✅ Found ${dueCollections.length} collections due today`);

    // 2. Mock sending emails
    mockSendReviewEmail(dueCollections);

    console.log('\n🎉 Email notification test completed successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testEmailNotifications()
  .catch(e => {
    console.error('Error during test:', e);
    process.exit(1);
  });
