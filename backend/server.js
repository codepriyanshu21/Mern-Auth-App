import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import 'dotenv/config'
import connectDB from './config/db.js';
import authRouter from './routes/routes.js';
import userRouter from './routes/userRoutes.js';

const app=express();
const port=process.env.PORT || 4000

connectDB();

const allowedOrigins=[
    'http://localhost:5173',
    'https://mern-auth-app-inky.vercel.app'

]

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:allowedOrigins,
    credentials:true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests
app.use((req, res, next) => {
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Origin", allowedOrigins.join(", "));
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.header("Access-Control-Allow-Credentials", "true");
        return res.sendStatus(200);
    }
    next();
});


// API end points
app.get('/',(req,res)=>{
    res.send('Hello Priyanshu');
})
app.use('/api/auth',authRouter)
app.use('/api/user',userRouter)

app.listen(port,()=>{
    console.log(`Server is running on port: ${port}`)
})