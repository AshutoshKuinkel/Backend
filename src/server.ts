import express, {Request, Response} from 'express';
import dotenv from 'dotenv';
import mongoose, { connect } from 'mongoose';
import { ConnectDatabase } from './config/db.config';
import { errorHandler } from './middlewares/error-handler.middleware';
import CustomError from './middlewares/error-handler.middleware';

//importing routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes'
import brandRoutes from './routes/brand.routes'

dotenv.config();
const app = express();
const PORT = process.env.PORT;
const DB_URI = process.env.DB_URI ?? '';

ConnectDatabase(DB_URI);

//using middlewares
app.use(express.json());
app.use(express.urlencoded({limit: '50mb', extended: true}));

app.get('/',(req:Request, res:Response) => {

  res.status(200).json({
    message: 'Server is up and running',
  });
});

//using routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/brand', brandRoutes);


app.all('/{*all}',(req: Request, res: Response) => {
  const message = `Cannot ${req.method} @ ${req.originalUrl}`;
  throw new CustomError(message, 404);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


//using error handler middleware
app.use(errorHandler)