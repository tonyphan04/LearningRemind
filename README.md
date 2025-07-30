# LearningRemind

LearningRemind is a full-stack vocabulary app designed to help users efficiently learn and review words using proven memory techniques. The project features a modern React frontend and a robust Node.js/Express backend with PostgreSQL and Prisma ORM.

## Features

- User authentication (JWT-based)
- Create, edit, and delete vocabulary collections (folders)
- Add, edit, and delete words in collections
- Import vocabulary via file upload (CSV, TXT, XLSX, DOCX, PDF)
- Spaced repetition review system
- Quiz/flashcard mode for active recall
- RESTful API with Swagger/OpenAPI documentation
- Modular, maintainable codebase

## Tech Stack

- **Frontend:** React, Vite, Material UI
- **Backend:** Node.js, Express, Prisma ORM, PostgreSQL
- **Other:** Multer (file upload), JWT, Swagger (API docs)

## Getting Started

1. Clone the repository
2. Install dependencies in both `frontend` and `backend` folders
3. Set up your `.env` files (see `.env.example` if available)
4. Run database migrations and seed data (see backend README)
5. Start the backend and frontend servers

## API Documentation

Interactive API docs are available at `/api/docs` when the backend is running.

## File Upload Format

- **Structured:** CSV/TXT with headers: `word,description,example`
- **Unstructured:** TXT with free-form lines (may not be parsed)

## Possible Improvements

- Add user roles and permissions (admin, regular user)
- Add support for audio pronunciation uploads and playback
- Add spaced repetition algorithm customization per user
- Add statistics dashboard (review streaks, accuracy, progress)
- Add export to CSV/XLSX and backup/restore features
- Add notifications/reminders (email, push)
- Add collaborative/shared collections
- Add integration with external dictionary APIs for word definitions/examples

## License

MIT
