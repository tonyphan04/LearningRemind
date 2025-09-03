import cron from 'node-cron';
import { getAllDueCollections } from './src/services/spacedRepetition';
import { sendDailyReviewEmail } from './src/services/reviewEmail';

// Replace with your desired timezone
const USER_TIMEZONE = 'Australia/Sydney';

cron.schedule('0 9 * * *', async () => {
  try {
    // Get all collections due for review today
    const allDueCollections = await getAllDueCollections();
    
    // Filter out collections without review tasks
    const dueCollections = allDueCollections.filter(
      collection => collection.reviewTask !== null
    ) as any; // Type assertion to resolve typing issue
    
    // Send emails to users with collections due for review
    await sendDailyReviewEmail(dueCollections);
    
    console.log(`Review emails sent for ${dueCollections.length} collections at 9am in user timezone`);
  } catch (error) {
    console.error('Error sending review emails:', error);
  }
}, {
  timezone: USER_TIMEZONE
});
