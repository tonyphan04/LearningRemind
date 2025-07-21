import nodemailer from 'nodemailer'
import { prisma } from "./prisma";


interface LearningItem {
  id: number;
  topic: string;
  goal: string[];
  resources: string[];
  startDay: Date;
  createdAt: Date;
  reviews: ReviewTask[];
  // add other fields if needed
}
interface ReviewTask {
  id: number;
  intervalDay: number;
  itemId: number;
  item?: LearningItem; // Optional since it might be included depending on the query
  // add other fields if needed
}

export async function sendReviewEmail(items: {
  id: number;
  topic: string;
  goal: string[];
  resources: string[];
  startDay: Date;
  createdAt: Date;
}[]) {
  // Configure your email transport
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })

  // Create a beautiful text version
  const taskList = items.map((item, index) => {
    const dateStr = item.startDay ? new Date(item.startDay).toLocaleDateString() : 'Not specified';
    return `${index + 1}. ${item.topic}
   📅 Started: ${dateStr}
   🎯 Goals: ${item.goal.join(' • ')}
   📚 Resources: ${item.resources.join(' • ')}`;
  }).join('\n\n');

  // Create a beautiful HTML version
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Learning Review Tasks</title>
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; background-color: #f8f9fa;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; color: white; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 28px; font-weight: 600;">📚 Learning Review Time!</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your spaced repetition tasks for ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>
      
      <div style="background: white; padding: 30px 20px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        ${items.length === 0 ? `
          <div style="text-align: center; padding: 40px 20px;">
            <div style="font-size: 48px; margin-bottom: 20px;">🎉</div>
            <h2 style="color: #28a745; margin-bottom: 10px;">All caught up!</h2>
            <p style="color: #6c757d;">No review tasks for today. Great job staying on track!</p>
          </div>
        ` : `
          <p style="font-size: 16px; margin-bottom: 30px; color: #6c757d;">
            You have <strong style="color: #667eea;">${items.length}</strong> topic${items.length > 1 ? 's' : ''} to review today. Let's reinforce your learning! 🚀
          </p>
          
          <div style="space-y: 20px;">
            ${items.map((item, index) => {
              const dateStr = item.startDay ? new Date(item.startDay).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Not specified';
              return `
                <div style="border: 2px solid #e9ecef; border-radius: 12px; padding: 24px; margin-bottom: 20px; background: linear-gradient(45deg, #f8f9fa 0%, #ffffff 100%); transition: transform 0.2s ease;">
                  <div style="display: flex; align-items: center; margin-bottom: 16px;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 12px; font-size: 14px;">${index + 1}</div>
                    <h3 style="margin: 0; font-size: 20px; font-weight: 600; color: #2d3436;">${item.topic}</h3>
                  </div>
                  
                  <div style="margin-bottom: 16px;">
                    <div style="display: flex; align-items: center; margin-bottom: 12px;">
                      <span style="font-size: 18px; margin-right: 8px;">📅</span>
                      <span style="font-weight: 500; color: #495057; margin-right: 8px;">Started:</span>
                      <span style="color: #6c757d; background: #e9ecef; padding: 4px 8px; border-radius: 6px; font-size: 14px;">${dateStr}</span>
                    </div>
                    
                    <div style="margin-bottom: 12px;">
                      <div style="display: flex; align-items: flex-start; margin-bottom: 8px;">
                        <span style="font-size: 18px; margin-right: 8px; margin-top: 2px;">🎯</span>
                        <span style="font-weight: 500; color: #495057; margin-right: 8px; margin-top: 2px;">Goals:</span>
                      </div>
                      <div style="margin-left: 26px;">
                        ${item.goal.map(goal => `
                          <span style="display: inline-block; background: linear-gradient(135deg, #28a745, #20c997); color: white; padding: 6px 12px; border-radius: 20px; margin: 2px 4px 2px 0; font-size: 13px; font-weight: 500;">${goal}</span>
                        `).join('')}
                      </div>
                    </div>
                    
                    <div>
                      <div style="display: flex; align-items: flex-start; margin-bottom: 8px;">
                        <span style="font-size: 18px; margin-right: 8px; margin-top: 2px;">📚</span>
                        <span style="font-weight: 500; color: #495057; margin-right: 8px; margin-top: 2px;">Resources:</span>
                      </div>
                      <div style="margin-left: 26px;">
                        ${item.resources.map(resource => `
                          <span style="display: inline-block; background: linear-gradient(135deg, #6f42c1, #e83e8c); color: white; padding: 6px 12px; border-radius: 20px; margin: 2px 4px 2px 0; font-size: 13px; font-weight: 500;">${resource}</span>
                        `).join('')}
                      </div>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
          
          <div style="background: linear-gradient(135deg, #17a2b8, #6610f2); color: white; padding: 20px; border-radius: 10px; text-align: center; margin-top: 30px;">
            <h3 style="margin: 0 0 10px 0; font-size: 18px;">💡 Pro Tip</h3>
            <p style="margin: 0; font-size: 14px; opacity: 0.9;">Spaced repetition works best when you actively recall information before checking the answer. Try to remember what you learned before reviewing your resources!</p>
          </div>
        `}
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef;">
          <p style="color: #6c757d; font-size: 14px; margin: 0;">
            Happy learning! 🌟 Keep up the great work with your studies.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_TO,
    subject: `📚 Learning Review - ${items.length} topic${items.length !== 1 ? 's' : ''} for ${new Date().toLocaleDateString()}`,
    text: `🎓 Your Learning Review Tasks for ${new Date().toLocaleDateString()}\n\n${items.length === 0 ? 'All caught up! No review tasks for today.' : taskList}\n\nHappy learning! 🌟`,
    html: htmlContent
  };

  await transporter.sendMail(mailOptions)
}


