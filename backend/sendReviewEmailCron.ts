import cron from 'node-cron';
import { getTodayReviewTasks } from './src/services/reviewTasks';
import { sendReviewEmail } from './src/services/email';

// Replace with your desired timezone
const USER_TIMEZONE = 'Australia/Sydney';

cron.schedule('0 9 * * *', async () => {
  const todayTasks = await getTodayReviewTasks();
  const items = todayTasks.map(task => task.item);
  await sendReviewEmail(items);
  console.log('Review email sent at 9am in user timezone');
}, {
  timezone: USER_TIMEZONE
});
