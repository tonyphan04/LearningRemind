import { Request, Response } from 'express';
import { getAllDueCollections } from '../../src/services/spacedRepetition';
import { sendDailyReviewEmail } from '../../src/services/reviewEmail';

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

    // Get all collections due for review today
    const allDueCollections = await getAllDueCollections();
    
    // Filter out collections without review tasks
    const dueCollections = allDueCollections.filter(
      collection => collection.reviewTask !== null
    ) as any; // Type assertion to resolve typing issue
    
    // Send emails to users with collections due for review
    await sendDailyReviewEmail(dueCollections);
    
    return res.status(200).json({ 
      success: true, 
      sent: true, 
      count: dueCollections.length,
      message: 'Review emails sent successfully' 
    });
  } catch (error: any) {
    console.error('Cron job error:', error);
    return res.status(500).json({ error: error.message });
  }
}
