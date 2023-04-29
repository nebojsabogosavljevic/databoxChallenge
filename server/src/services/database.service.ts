import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";
import { resolve } from "path";
import logger from "../modules/logger";

export const collections: { 
    LoggingData?: mongoDB.Collection 
} = {}

export async function connectToDatabase () {
    dotenv.config({ path: resolve(__dirname, "../.env") });
    const connectionString: string = process.env.MONGO_DB_CONN_STRING || '';
    const dbName: string = process.env.MONGO_DB_NAME || '';
    const collectionName: string = process.env.MONGO_DB_COLLECTION || '';

    const client: mongoDB.MongoClient = new mongoDB.MongoClient(connectionString);
    await client.connect();
    const db: mongoDB.Db = client.db(dbName);
    const loggingData: mongoDB.Collection = db.collection(collectionName);
    collections.LoggingData = loggingData;
    logger.info('Successfully connected to database');
 }
 