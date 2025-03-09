import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import connectDB from './config/db.js';
import authRouter from './routes/routes.js';
import userRouter from './routes/userRoutes.js';

const app = express();
const port = process.env.PORT || 4000;

connectDB();

// Allow only specific origins
const allowedOrigins = [
    'http://localhost:5173', 
    'https://mern-auth-app-inky.vercel.app'
];

app.use(express.json());
app.use(cookieParser());

// Set up CORS properly
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, origin); // Allow the request
        } else {
            callback(new Error('Not allowed by CORS')); // Block other origins
        }
    },
    credentials: true, // Allow credentials (cookies, auth headers)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests
app.options('*', (req, res) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    res.sendStatus(200);
});

// API endpoints
app.get('/', (req, res) => {
    res.send('Hello Priyanshu');
});
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
