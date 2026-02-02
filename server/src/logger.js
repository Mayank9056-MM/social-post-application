import { createLogger, format, transports } from "winston";

const { combine, timestamp, printf, colorize, errors, json } = format;

// Console log format (human-readable)
const consoleLogFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`;
});

const logger = createLogger({
  level: "info",

  // Important: capture error stack traces
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true })
  ),

  transports: [
    // Console transport (colored)
    new transports.Console({
      format: combine(
        colorize(),
        consoleLogFormat
      ),
    }),

    // File transport (structured JSON for debugging)
    new transports.File({
      filename: "app.log",
      format: combine(timestamp(), json()),
    }),
  ],
});

export default logger;
