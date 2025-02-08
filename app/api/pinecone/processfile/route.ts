import { NextResponse, NextRequest } from 'next/server';
// import Papa from 'papaparse';
// import mammoth from 'mammoth';
// import pdfParse from 'pdf-parse';
// import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
// // import { processFile } from '@/app/api/pinecone/processfile/processfile';

// export async function POST(req: NextRequest) {
//     // return NextResponse.json({message: "hello world"})

//   try {
//     const formData = await req.formData();
//     const file = formData.get('file') as File;
    
//     if (!file) {
//       return NextResponse.json(
//         { error: 'No file provided' },
//         { status: 400 }
//       );
//     }

//     const result = await processFile(file);
//     return NextResponse.json({ result });
    
//   } catch (error) {
//     console.error('Error processing file:', error);
//     return NextResponse.json(
//       { error: 'Error processing file' },
//       { status: 500 }
//     );
//   }
// }



// async function processFile(file: File): Promise<string[]> {
//     const buffer = await file.arrayBuffer();
//     let text: string;

//     switch (file.type) {
//         case 'text/csv':
//             text = await parseCSV(file);
//             break;

//         case 'application/pdf':
//             text = await parsePDF(buffer);
//             break;

//         case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
//             text = await parseDOCX(buffer);
//             break;

//         default:
//             // Fallback for plain text files
//             text = await file.text();
//             break;
//     }

//     const splitter = new RecursiveCharacterTextSplitter({
//         chunkSize: 1000,
//         chunkOverlap: 200,
//     });

//     return await splitter.splitText(text);
// }

// /**
//  * Parses CSV files and converts them into a readable text format.
//  * @param file - The CSV file to be parsed.
//  * @returns A promise that resolves to the extracted text.
//  */
// function parseCSV(file: File): Promise<string> {
//     return new Promise((resolve, reject) => {
//         Papa.parse(file, {
//             header: true,
//             complete: (results) => {
//                 const text = results.data.map((row: any) => {
//                     return Object.entries(row)
//                         .map(([key, value]) => `${key}: ${value}`)
//                         .join('. ');
//                 }).join('\n');
//                 resolve(text);
//             },
//             error: (error) => reject(error)
//         });
//     });
// }

// /**
//  * Parses PDF files and extracts text.
//  * @param buffer - The array buffer of the PDF file.
//  * @returns A promise that resolves to the extracted text.
//  */
// async function parsePDF(buffer: ArrayBuffer): Promise<string> {
//     const pdfData = await pdfParse(Buffer.from(buffer));
//     return pdfData.text; 
// }

// /**
//  * Parses DOCX files and extracts raw text.
//  * @param buffer - The array buffer of the DOCX file.
//  * @returns A promise that resolves to the extracted text.
//  */
// async function parseDOCX(buffer: ArrayBuffer): Promise<string> {
//     const result = await mammoth.extractRawText({ arrayBuffer: buffer });
//     return result.value;
// }

export async function POST(req: NextRequest) {
    return NextResponse.json({message: "hello world"})
}
