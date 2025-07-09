import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import extractText from '../utils/extractText.js';
import embedAndIndex from '../utils/embedding.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '..', 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage });

// Route upload
router.post('/', upload.single('document'), async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const mimeType = file.mimetype;
        const filePath = file.path;
        const fileName = file.originalname;
        const namespace = path.parse(fileName).name;

        // B1: Trích xuất nội dung từ file
        const text = await extractText(filePath, mimeType);
        if (!text || text.trim().length === 0) {
            return res.status(400).json({ error: 'Không extract được nội dung từ file' });
        }

        // B2: Gửi nội dung đi embed + index lên Pinecone
        await embedAndIndex(text, namespace);

        res.status(200).json({
            message: 'Upload và xử lý thành công',
            filename: fileName,
            namespace,
        });
    } catch (error) {
        console.error('Error in upload:', error);
        res.status(500).json({ error: 'Lỗi xử lý file upload' });
    }
});

export default router;
