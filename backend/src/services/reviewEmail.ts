import nodemailer from 'nodemailer';
import { Collection, ReviewTask, User, Word } from '@prisma/client';

// Define collection with related data
type CollectionWithRelations = Collection & {
  words: Word[];
  reviewTask: ReviewTask;
  user: {
    id: number;
    email: string;
  };
};

export async function sendDailyReviewEmail(collections: CollectionWithRelations[]) {
  // Group collections by user email
  const collectionsByUser: Record<string, CollectionWithRelations[]> = {};
  
  collections.forEach(collection => {
    const userEmail = collection.user.email;
    if (!collectionsByUser[userEmail]) {
      collectionsByUser[userEmail] = [];
    }
    collectionsByUser[userEmail].push(collection);
  });
  
  // Configure email transport
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  
  // Send an email to each user with their collections due for review
  for (const [email, userCollections] of Object.entries(collectionsByUser)) {
    await sendUserReviewEmail(transporter, email, userCollections);
  }
}

async function sendUserReviewEmail(
  transporter: nodemailer.Transporter,
  email: string, 
  collections: CollectionWithRelations[]
) {
  // Create HTML for collections
  const collectionsHtml = collections.map((collection, index) => {
    // Format the review interval in a human-readable way
    const reviewTask = collection.reviewTask;
    const words = collection.words;
    const wordCount = words.length;
    const wordPreview = words.slice(0, 3).map(w => w.word).join(', ') + 
      (wordCount > 3 ? ` and ${wordCount - 3} more` : '');
    
    return `
      <div style="margin-bottom: 25px; padding: 20px; border-radius: 10px; background-color: #f9f9f9; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
        <h3 style="margin-top: 0; color: #333; font-size: 18px;">${collection.name}</h3>
        ${collection.description ? `<p style="color: #666; font-size: 14px; margin-bottom: 15px;">${collection.description}</p>` : ''}
        
        <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 15px;">
          <span style="background-color: #e3f2fd; color: #1565c0; font-size: 13px; padding: 5px 10px; border-radius: 20px;">
            ${wordCount} word${wordCount !== 1 ? 's' : ''}
          </span>
          <span style="background-color: #fff8e1; color: #ff8f00; font-size: 13px; padding: 5px 10px; border-radius: 20px;">
            Review #${reviewTask.reviewCount + 1}
          </span>
        </div>
        
        <p style="color: #555; margin-bottom: 15px; font-size: 15px;">
          <strong>Words to review:</strong> ${wordPreview}
        </p>
        
        <a href="${process.env.FRONTEND_URL}/review/${collection.id}" style="display: inline-block; background-color: #4a6cf7; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: 500;">
          Start Review
        </a>
      </div>
    `;
  }).join('');
  
  // Create email HTML
  const emailHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Daily Learning Review</title>
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #4a6cf7 0%, #6c7bfa 100%); padding: 30px 20px; text-align: center; color: white; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 24px; font-weight: 600;">🧠 Time to Review Your Learning!</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">
          ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>
      
      <div style="background: white; padding: 25px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <p style="font-size: 16px; margin-bottom: 25px;">
          Hi there! You have <strong>${collections.length}</strong> collection${collections.length !== 1 ? 's' : ''} 
          due for review today. Consistent review helps solidify your learning!
        </p>
        
        ${collectionsHtml}
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px; text-align: center;">
          <p>
            Keep up the great work with your learning journey!<br>
            The LearningRemind Team
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  // Send the email
  await transporter.sendMail({
    from: `"LearningRemind" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `🧠 Your Daily Learning Review - ${new Date().toLocaleDateString()}`,
    html: emailHtml,
  });
}
