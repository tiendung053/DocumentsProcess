import fs from 'fs';
import pdfParse from 'pdf-parse';
import Tesseract from 'tesseract.js';
import csv from 'csv-parser';

async function extractText(filePath, mimeType) {
    if (mimeType === 'application/pdf') {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdfParse(dataBuffer);
        return data.text;
    }

    if (mimeType.startsWith('image/')) {
        const result = await Tesseract.recognize(filePath, 'eng');
        return result.data.text;
    }

    if (mimeType === 'text/csv') {
        return new Promise((resolve, reject) => {
            let text = '';
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (row) => {
                    text += Object.values(row).join(' ') + '\n';
                })
                .on('end', () => resolve(text))
                .on('error', reject);
        });
    }

    if (mimeType === 'text/plain') {
        return fs.readFileSync(filePath, 'utf-8');
    }

    throw new Error(`Unsupported file type: ${mimeType}`);
}

export default extractText;
