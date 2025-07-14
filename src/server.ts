import express, {Request, Response} from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();
const app = express();
const PORT = process.env.PORT;

mongoose.connect(process.env.DB_URI as string, {})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

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
