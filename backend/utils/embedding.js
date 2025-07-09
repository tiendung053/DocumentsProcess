// utils/embedding.js
import { OpenAIEmbeddings } from '@langchain/openai';
import { PineconeStore } from '@langchain/community/vectorstores/pinecone';
import { pinecone } from '../vectorstore/pinecone.js';
import dotenv from 'dotenv';

dotenv.config();

const embedAndIndex = async (text, namespace) => {
    const embeddings = new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);

    await PineconeStore.fromTexts(
        [text],
        [{ source: namespace }],
        embeddings,
        {
            pineconeIndex,
            namespace,
        }
    );

    return true;
};

export default embedAndIndex;
