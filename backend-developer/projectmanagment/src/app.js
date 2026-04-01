import express from 'express';
import cors from 'cors';
import healthcheckRouter from './routes/healthcheck.router.js';
import authRouter from './routes/auth.routers.js';
import cookie from 'cookie-parser';
import { Apierror } from './utils/api-error.js';
const app = express();





app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true,limit:"16kb"}));
app.use(express.static('public'));
app.use(cookie());


app.use(cors(
    {
        origin:"http://localhost:5173",
        credentials:true,
        methods:["GET","POST","PUT","DELETE"],
        allowedHeaders:["Content-Type","Authorization"],
    } 
));


app.use("/api/v1/healthcheck",healthcheckRouter)
app.use("/api/v1/auth",authRouter)

app.get('/',(req,res)=>{
    res.send('hello world');
})

app.get('/instargam',(req,res)=>{
    res.send('hello jeel instragram');
})

// Global error handler - send structured JSON for Apierror and generic errors
app.use((err, req, res, next) => {
    if (err instanceof Apierror) {
        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || 'Error',
            errors: err.errors || [],
        });
    }

    // Log unexpected errors and return generic response
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
});

export default app;