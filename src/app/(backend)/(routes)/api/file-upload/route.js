import { NextResponse } from "next/server";
import { bucket } from '@/app/(backend)/config/firebase-admin';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const files = formData.getAll('files');

        if (!files || files.length === 0) {
            return NextResponse.json(
                { error: "No files uploaded" },
                { status: 400 }
            );
        }

        const uploadPromises = files.map(async (file) => {
            // Convert File to Buffer
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Create unique filename
            const filename = `${Date.now()}-${file.name}`;
            const blob = bucket.file(filename);

            // Upload to Firebase
            return new Promise((resolve, reject) => {
                const blobStream = blob.createWriteStream({
                    metadata: {
                        contentType: file.type,
                    },
                });

                blobStream.on("error", (error) => {
                    reject(error);
                });

                blobStream.on("finish", async () => {
                    // Make file public
                    await blob.makePublic();
                    
                    // Get public URL
                    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
                    
                    resolve({
                        fileName: filename,
                        fileUrl: publicUrl
                    });
                });

                blobStream.end(buffer);
            });
        });

        const uploadedFiles = await Promise.all(uploadPromises);

        return NextResponse.json({ 
            success: true,
            files: uploadedFiles 
        });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: error.message || "Upload failed" },
            { status: 500 }
        );
    }
}