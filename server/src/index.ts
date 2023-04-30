import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import news from './routes/news';
import weather from './routes/weather';
import logger from './modules/logger';
import { connectToDatabase } from './services/database.service';
import bodyParser = require('body-parser');

dotenv.config(); 
const app: Express = express();
app.use(bodyParser.json());
const port = process.env.PORT || 3000;

try {
  connectToDatabase();
} catch (error: any) {
  logger.error('Error while connecting to database', { RespErrMsg: error.message, success: false });
}

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.use('/news', news);
app.use('/weather', weather);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

export default app;