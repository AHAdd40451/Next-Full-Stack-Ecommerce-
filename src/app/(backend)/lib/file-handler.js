import { writeFile } from 'fs/promises';
import path from 'path';

export async function saveFile(file, directory = 'uploads') {
    try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create unique filename
        const filename = `${Date.now()}-${file.name}`;
        const filepath = path.join(process.cwd(), 'public', directory, filename);

        // Save file
        await writeFile(filepath, buffer);

        return {
            success: true,
            filename,
            path: `/uploads/${filename}`
        };
    } catch (error) {
        console.error('File save error:', error);
        throw new Error('Failed to save file');
    }
}
export function validateFile(file, options = {}) {
    const {
        maxSize = 10 * 1024 * 1024,
        allowedTypes = /image\/(jpeg|jpg|png|gif|webp)|video\/(mp4|mkv|webm|avi)/
    } = options;

    if (!file.type.match(allowedTypes)) {
        throw new Error('File type not supported');
    }

    if (file.size > maxSize) {
        throw new Error('File size too large');
    }

    return true;
}