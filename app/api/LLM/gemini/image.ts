import { GoogleGenerativeAI } from "@google/generative-ai"
import * as fs from 'fs';
import { NextResponse } from 'next/server';
import * as admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';
import OpenAI from 'openai';

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    storageBucket: "sulta-ai.appspot.com"
  });
}

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  

const bucket = admin.storage().bucket("sulta-ai.firebasestorage.app");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const generateImage = async (prompt: string, base64String: string | null) => {
    try {
         // Call DALL-E API to generate image
    const response = await openai.images.generate({
        model: "dall-e-3", // or use "dall-e-2" if you prefer faster, less detailed images
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        response_format: "b64_json" // Request base64 format directly
      });
  
      // Extract image data
      if (!response.data || response.data.length === 0) {
        throw new Error('No image data returned from DALL-E');
      }
  
      const imageData = response.data[0];
      
      // If using b64_json response format
      const imageBuffer = Buffer.from(imageData.b64_json!, 'base64');
      
      
          // Generate a unique file name
          const fileName = `generated_images/${uuidv4()}.png`;
          
          // Create a file in the bucket
          const file = bucket.file(fileName);
          
          // Upload the image buffer to Firebase Storage
          await file.save(imageBuffer, {
            metadata: {
              contentType: 'image/png',
            },
          });

          if (!file) {
            throw new Error('Failed to save image to Firebase Storage');
          }
          
          // Make the file publicly accessible
          await file.makePublic();
          
          
          // Get the public URL
          const publicUrl = file.publicUrl();
          console.log('Public URL:', publicUrl);
        
          return { imageUrl: publicUrl };
        } 
       catch (error) {
        console.error('Error generating image:', error);
        throw new Error('Failed to generate image');
      }
}