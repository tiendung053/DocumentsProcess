
import { Pinecone } from '@pinecone-database/pinecone';
import dotenv from 'dotenv';
dotenv.config();

const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
    controllerHostUrl: `https://test.${process.env.PINECONE_ENVIRONMENT}.pinecone.io`,
});

export { pinecone };
