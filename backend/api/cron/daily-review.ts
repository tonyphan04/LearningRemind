import { Request, Response } from 'express';
import { getTodayReviewTasks } from '../../src/services/reviewTasks';
import { sendReviewEmail } from '../../src/services/email';

export default async function handler(req: Request, res: Response) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify this is called from Vercel Cron (optional security measure)
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const todayTasks = await getTodayReviewTasks();
    await sendReviewEmail(todayTasks);
    
    return res.status(200).json({ 
      success: true, 
      sent: true, 
      count: todayTasks.length,
      message: 'Review email sent successfully' 
    });
  } catch (error: any) {
    console.error('Cron job error:', error);
    return res.status(500).json({ error: error.message });
  }
}
