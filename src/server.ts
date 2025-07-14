import express, {Request, Response} from 'express';
import dotenv from 'dotenv';
import mongoose, { connect } from 'mongoose';
import { ConnectDatabase } from './config/db.config';

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

//create a schema and model for data depending on what the project is.

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
