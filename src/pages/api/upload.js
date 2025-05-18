import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.CLOUDFLARE_REGION,
  endpoint: 'https://9e746a1cc42c9a47a6af4c8d929289ee.r2.cloudflarestorage.com',
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY,
  },
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { file } = req.body; // Assume file is sent in the request body
    const params = {
      Bucket: process.env.CLOUDFLARE_BUCKET_NAME,
      Key: file.name,
      Body: file.data,
    };

    try {
      await s3.send(new PutObjectCommand(params));
      res.status(200).json({ message: 'File uploaded successfully' });
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({ error: 'Error uploading file' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}