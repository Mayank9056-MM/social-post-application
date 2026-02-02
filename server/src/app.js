import logger from './logger.js';
import morgan from 'morgan';
import express from 'express';
import hpp from 'hpp';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

// Global rate limiting
import { rateLimit } from 'express-rate-limit';

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    message: 'Too many request from this IP, please try later',
    standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
    // store: ... , // Redis, Memcached, etc. See below.
});

// security middleware
app.use(helmet());
app.use('/api', limiter);
app.use(hpp());

// logger setup
if (process.env.NODE_ENV === 'development') {
    const morganFormat = ':method :url :status :response-time ms';

    app.use(
        morgan(morganFormat, {
            stream: {
                write: (message) => {
                    const logObject = {
                        method: message.split(' ')[0],
                        url: message.split(' ')[1],
                        status: message.split(' ')[2],
                        responseTime: message.split(' ')[3],
                    };
                    logger.info(JSON.stringify(logObject));
                },
            },
        })
    );
}

// Body parser middleware
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());

// CORS configuration
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
        methods: ['GET', 'POST', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'X-Requested-With',
            'device-remember-token',
            'Access-Control-Allow-Origin',
            'Origin',
            'Access',
        ],
    })
);

// Global Error Handler
app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(err.status || 500).json({
        status: 'error',
        message: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
});

// import routes
import router from './routes/index.js';

// routes
app.use('/api/v1', router);

// It should be always at bottom
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Route not found ❌',
    });
});

export default app;
