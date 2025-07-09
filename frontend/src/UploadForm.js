import React, { useState } from 'react';
import axios from 'axios';

export default function UploadAndProcessLater() {
    const [fileList, setFileList] = useState([]);
    const [selectedText, setSelectedText] = useState('');
    const [loading, setLoading] = useState(false);

    // B1: Chọn file, lưu vào danh sách (chưa upload)
    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        setFileList((prev) => [...prev, ...files]);
    };

    // B2: Khi user click vào 1 file trong danh sách, mới upload và xử lý
    const handleProcessFile = async (file) => {
        const formData = new FormData();
        formData.append('document', file);

        try {
            setLoading(true);
            const res = await axios.post('http://localhost:8080/upload', formData);
            setSelectedText(`Đã xử lý file: ${file.name}\n\n---\n\nNamespace: ${res.data.namespace}`);
        } catch (err) {
            setSelectedText(`Lỗi xử lý file: ${err.response?.data?.error || err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Upload tài liệu (xử lý khi click)</h2>
            <input type="file" multiple onChange={handleFileSelect} />

            <h3>Danh sách file đã chọn:</h3>
            <ul>
                {fileList.map((file, index) => (
                    <li key={index}>
                        <button onClick={() => handleProcessFile(file)} disabled={loading}>
                            {file.name}
                        </button>
                    </li>
                ))}
            </ul>

            {loading && <p>Đang xử lý...</p>}

            {selectedText && (
                <div style={{ whiteSpace: 'pre-wrap', marginTop: '20px', border: '1px solid #ccc', padding: '10px' }}>
                    <h3>Kết quả:</h3>
                    {selectedText}
                </div>
            )}
        </div>
    );
}
