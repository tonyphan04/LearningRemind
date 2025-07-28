// Automatically start the scheduled review email cron job (only in production)
if (process.env.NODE_ENV === 'production') {
  import("./sendReviewEmailCron");
}
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import router from "./src/routes/index";

dotenv.config();

const app = express();
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(morgan("dev"));

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "LearningRemind API",
      version: "1.0.0",
      description: "API documentation for LearningRemind backend"
    },
    servers: [
      { url: "http://localhost:" + (process.env.PORT || 3000) }
    ]
  },
  apis: ["./src/routes/*.ts", "./src/controller/*.ts"]
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Health check endpoint
app.get("/api/health", (_req, res) => res.status(200).json({ status: "ok" }));

// Use the main router for all API routes under /api
app.use("/api", router);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
