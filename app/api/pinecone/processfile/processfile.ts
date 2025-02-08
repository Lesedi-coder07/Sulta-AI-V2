import Papa from 'papaparse';
import mammoth from 'mammoth';
import pdfParse from 'pdf-parse';

/**
 * Processes different types of files (CSV, PDF, DOCX, and plain text) and converts them into text.
 * @param file - The file to be processed.
 * @returns The extracted text from the file.
 */



async function processFile(file: File): Promise<string[]> {
    const buffer = await file.arrayBuffer();
    let text: string;

    switch (file.type) {
        case 'text/csv':
            text = await parseCSV(file);
            break;

        case 'application/pdf':
            text = await parsePDF(buffer);
            break;

        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            text = await parseDOCX(buffer);
            break;

        default:
            // Fallback for plain text files
            text = await file.text();
            break;
    }

    return chunkerizeText(text);
}

/**
 * Parses CSV files and converts them into a readable text format.
 * @param file - The CSV file to be parsed.
 * @returns A promise that resolves to the extracted text.
 */
function parseCSV(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            complete: (results) => {
                const text = results.data.map((row: any) => {
                    return Object.entries(row)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join('. ');
                }).join('\n');
                resolve(text);
            },
            error: (error) => reject(error)
        });
    });
}

/**
 * Parses PDF files and extracts text.
 * @param buffer - The array buffer of the PDF file.
 * @returns A promise that resolves to the extracted text.
 */
async function parsePDF(buffer: ArrayBuffer): Promise<string> {
    const pdfData = await pdfParse(Buffer.from(buffer));
    return pdfData.text;
}

/**
 * Parses DOCX files and extracts raw text.
 * @param buffer - The array buffer of the DOCX file.
 * @returns A promise that resolves to the extracted text.
 */
async function parseDOCX(buffer: ArrayBuffer): Promise<string> {
    const result = await mammoth.extractRawText({ arrayBuffer: buffer });
    return result.value;
}

/**
 * Splits text into chunks without breaking sentences or words.
 * @param text - The text to be chunked.
 * @param maxChunkSize - The maximum size of each chunk (default is 1000 characters).
 * @returns An array of text chunks.
 */


function chunkerizeText(text: string, maxChunkSize: number = 1000): string[] {
    const paragraphs = text.split(/\n\s*\n/);
    const chunks: string[] = [];
    let currentChunk = '';

    for (const paragraph of paragraphs) {
        const sentences = paragraph.split(/(?<=[.!?])\s+/);

        for (const sentence of sentences) {
            // Check if adding the sentence exceeds the max chunk size

            
            if ((currentChunk + ' ' + sentence).length > maxChunkSize) {
                if (currentChunk.length > 0) {
                    chunks.push(currentChunk.trim());
                    currentChunk = '';
                }
            }

            // Handle very long sentences
            if (sentence.length > maxChunkSize) {
                const words = sentence.split(' ');
                let longSentenceChunk = '';

                for (const word of words) {
                    if ((longSentenceChunk + ' ' + word).length > maxChunkSize) {
                        if (longSentenceChunk.length > 0) {
                            chunks.push(longSentenceChunk.trim());
                            longSentenceChunk = '';
                        }
                    }
                    longSentenceChunk += ' ' + word;
                }

                if (longSentenceChunk.length > 0) {
                    currentChunk = longSentenceChunk.trim();
                }
                continue;
            }

            currentChunk += ' ' + sentence;
        }
    }

    // Add any remaining text as the last chunk
    if (currentChunk.length > 0) {
        chunks.push(currentChunk.trim());
    }

    return chunks;
}

export { processFile };