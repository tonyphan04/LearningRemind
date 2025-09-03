# Spaced Repetition System for Learning Remind

This document explains the implementation of the spaced repetition system in Learning Remind.

## Overview

The spaced repetition system is designed to help users remember vocabulary by scheduling reviews at increasing intervals. When a folder (collection) is created, it is automatically scheduled for review based on a predefined interval sequence.

## How It Works

### Review Intervals

The system uses a sequence of increasing intervals between reviews:

- 1 day after first exposure
- 3 days after the first review
- 7 days after the second review
- 14 days after the third review
- 30 days (1 month) after the fourth review
- 60 days (2 months) after the fifth review
- 90 days (3 months) after the sixth review
- 180 days (6 months) after the seventh review
- 365 days (1 year) after the eighth review

Each time a user successfully reviews a collection, the next interval is chosen from this sequence.

### Database Schema

The system uses the following tables:

1. `Collection` - Represents a folder of vocabulary words
2. `ReviewTask` - Stores the review schedule and history for each collection
3. `Word` - Stores individual vocabulary items within a collection

The `ReviewTask` model has:
- `intervalIndex` - Current position in the interval sequence
- `nextReview` - Date of the next scheduled review
- `lastReviewed` - Date of the last completed review
- `reviewCount` - Number of times the collection has been reviewed

### Workflow

1. **Collection Creation**:
   - When a user creates a new collection, a `ReviewTask` is automatically created
   - The first review is scheduled for the next day

2. **Daily Review**:
   - A daily cron job checks for collections due for review
   - Emails are sent to users with collections due for review
   - Users can see which collections need review in the application

3. **Review Completion**:
   - When a user completes a review, the `intervalIndex` is incremented
   - The next review is scheduled based on the new interval
   - The `reviewCount` is incremented

4. **Review Reset**:
   - If a user wants to start the review sequence over, they can reset a review task
   - This sets `intervalIndex` back to 0 and schedules the next review for tomorrow

## API Endpoints

The system provides the following endpoints:

- `GET /api/review/today` - Get all collections due for review today
- `POST /api/review/complete/:taskId` - Mark a review as completed and schedule the next one
- `POST /api/review/reset/:taskId` - Reset a review task to start from the beginning

## Email Notifications

The system sends daily email notifications to users with:
- A list of collections due for review
- Preview of words in each collection
- Links to start the review process

## Implementation Details

1. **Automatic Review Task Creation**:
   - `createFolder` function in `folder.controller.ts` automatically creates a review task

2. **Review Scheduling**:
   - `spacedRepetition.ts` service handles the logic for scheduling reviews

3. **Daily Review Job**:
   - A cron job runs daily to check for due collections and send emails

4. **Review API**:
   - `review.controller.ts` handles review-related endpoints
