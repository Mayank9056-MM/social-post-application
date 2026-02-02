import { getDBStatus } from "../db/db.js";

/**
 * This function performs a health check on the server by checking the status of the database and server.
 * It returns a JSON object containing the health status, timestamp, and service information.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Promise<void>} - A promise that resolves when the health check is completed.
 */
export const healthCheck = async (req, res) => {
  try {
    const healthStatus = {
      status: "ok",
      timeStamp: new Date().toISOString(),
      services: {
        database: {
          status:
            getReadyStateText(getDBStatus()) === "connected"
              ? "healthy"
              : "unhealthy",
        },
        server: {
          status: "healthy",
          uptime: process.uptime(),
          memoryUsage: process.memoryUsage(),
        },
      },
    };
    const httpStatusCode =
      healthStatus.services.database.status === "healthy" ? 200 : 503;

    res.status(httpStatusCode).json(healthStatus);
  } catch (error) {
    console.error("Health check failed", error);
    res.status(500).json({
      status: "ERROR",
      timestamp: new Date().toISOString(),
      error: error.message,
    });
  }
};

/**
 * Returns the ready state text based on the given state value.
 *
 * @param {number} state - The state value representing the ready state.
 * @return {string} The corresponding ready state text.
 */
function getReadyStateText(state) {
  switch (state) {
    case 0:
      return "disconnected";
    case 1:
      return "connected";
    case 2:
      return "connecting";
    case 3:
      return "disconnecting";

    default:
      return "unknown";
  }
}
