import "dotenv/config";
import app from "./app.js";
import logger from "./logger.js";
import connectDB from "./db/db.js";

const PORT = process.env.PORT || 3000;

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection:", reason);
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error);
  process.exit(1);
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(
        `App is listening on port ${PORT} in ${process.env.NODE_ENV} mode`,
      );
    });
  })
  .catch((err) => {
    logger.error("MongoDB connection error", err);
  });
