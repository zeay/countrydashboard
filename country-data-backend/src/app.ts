import express from 'express';
import cors from 'cors';
import countriesRouter from './routes/countries';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/countries', countriesRouter);

export default app;