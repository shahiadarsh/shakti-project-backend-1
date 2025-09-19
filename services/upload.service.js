import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";
import dotenv from 'dotenv';
dotenv.config({
    path:"./.env"
})

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
});

const uploadFile = async (localFilePath) => {
    if (!localFilePath) throw new Error("Local file path is required.");

    try {
        console.log(`Uploading ${localFilePath} to AWS S3...`);
        const fileStream = fs.createReadStream(localFilePath);
        const fileName = `${Date.now()}-${path.basename(localFilePath)}`;

        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileName,
            Body: fileStream,
            // ACL: 'public-read',
        };

        await s3Client.send(new PutObjectCommand(params));

        const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
        console.log("File uploaded successfully to S3.", fileUrl);
        
        return {
            url: fileUrl,
            key: fileName,
        };

    } catch (error) {
        console.error("Error during S3 upload:", error);
        throw new Error("Failed to upload file to S3.");
    } finally {
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
    }
};

const deleteFile = async (key) => {
    if (!key) throw new Error("File key is required for deletion.");

    try {
        console.log(`Deleting file from S3: ${key}`);
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
        };
        await s3Client.send(new DeleteObjectCommand(params));
        console.log("File deleted successfully from S3.");
        return { success: true };
    } catch (error) {
        console.error("Error during S3 file deletion:", error);
        throw new Error("Failed to delete file from S3.");
    }
};

export const uploadService = {
    uploadFile,
    deleteFile,
};