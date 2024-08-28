import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

// Helper functions
export const spaceToPlus = (str: string) => str.replace(/\s/g, '+').toLowerCase();
export const spaceToDash = (str: string) => str.replace(/\s/g, '-').toLowerCase();

// Function to save images as a PDF
export const pdfMaker = async (imagesPath: string, title: string, chapter: string) => {
    const pdfDoc = await PDFDocument.create();
    const pages = fs.readdirSync(imagesPath);

    for (const page of pages) {
        const img = await pdfDoc.embedPng(fs.readFileSync(path.join(imagesPath, page)));
        const { width, height } = img.scale(0.5);
        const pdfPage = pdfDoc.addPage([width, height]);
        pdfPage.drawImage(img, {
            x: 0,
            y: 0,
            width: width,
            height: height,
        });
    }

    const pdfBytes = await pdfDoc.save();

    // Get the user's Downloads folder path
    const downloadsPath = path.join(process.env.HOME || '', 'Downloads');

    // Create the final file path
    const filePath = path.join(downloadsPath, `${title}-${chapter}.pdf`);

    // Save the PDF file to the Downloads folder
    fs.writeFileSync(filePath, pdfBytes);

    console.log(`PDF saved to ${filePath}`);

    return filePath;
};

// Function to save pages as images
// Function to save pages as images
export const pagesSave = async (title: string, pages: string[], chapter: string) => {
    try {
        const baseDir = path.join(__dirname, '..', 'Downloads');
        if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir);
        const titleDir = path.join(baseDir, title);
        if (!fs.existsSync(titleDir)) fs.mkdirSync(titleDir);
        const chapterDir = path.join(titleDir, chapter);
        if (!fs.existsSync(chapterDir)) fs.mkdirSync(chapterDir);

      
        return chapterDir; 

    } catch (error) {
        console.error("Error setting up directories or saving pages:", error);
        return false;
    }
};
