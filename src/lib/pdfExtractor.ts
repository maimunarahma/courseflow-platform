import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export const extractPdfText = async (file: File | ArrayBuffer) => {
  const data =
    file instanceof File ? await file.arrayBuffer() : (file as ArrayBuffer);

  const pdf = await pdfjsLib.getDocument({ data }).promise;

  let fullText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();

    // Join items with proper spacing and preserve structure
    const pageText = content.items.map((item: any) => {
      const str = item.str;
      // Add newline if the item has a significant Y position change
      return str;
    }).join(" ");
    fullText += pageText + "\n";
  }

  return fullText;
};


// Helper function to extract field value after a label
const extractFieldValue = (text: string, fieldName: string): string | null => {
  // Use regex to find the field and capture everything until the next field
  const fieldLabels = ["Title", "Description", "CourseLevel", "CourseDuration", "courseOverview", "Category", "Price", "Thumbnail"];
  const otherFields = fieldLabels.filter(f => f.toLowerCase() !== fieldName.toLowerCase()).join("|");
  
  const regex = new RegExp(`${fieldName}[\\s:]*([^]*?)(?=${otherFields}|$)`, "i");
  const match = text.match(regex);
  
  if (!match || !match[1]) return null;
  
  return match[1].trim();
};

export const extractTitleFromText = (text: string) => {
  return extractFieldValue(text, "Title");
};

export const extractDescriptionFromText = (text: string) => {
  return extractFieldValue(text, "Description");
};

export const extractCategoryFromText = (text: string) => {
  return extractFieldValue(text, "Category");
};

export const extractCourseLevelFromText = (text: string) => {
  return extractFieldValue(text, "CourseLevel");
};

export const extractCourseDurationFromText = (text: string) => {
  return extractFieldValue(text, "CourseDuration");
};

export const extractPriceFromText = (text: string) => {
  return extractFieldValue(text, "Price");
};

export const extractThumbnailFromText = (text: string) => {
  return extractFieldValue(text, "Thumbnail");
};