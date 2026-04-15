// Updated CccdInfo interface
export interface CccdInfo {
  fullName: string;
  dob: string; // Date of Birth
  gender: string; // Gender
  // other fields...
}

// Initial cccdInfo object with new fields
export const cccdInfo: CccdInfo = {
  fullName: '',
  dob: '',
  gender: '',
  // other fields...
};

// Reset function to include new fields
export function resetCccdInfo(): void {
  Object.assign(cccdInfo, { fullName: '', dob: '', gender: '' });
  // reset other fields...
}

// Function to check if info has been extracted
export function hasExtractedInfo(): boolean {
  return !!(cccdInfo.dob && cccdInfo.gender);
}

// Function to extract information including new fields
export function extractCccdInfo(text: string): void {
  cccdInfo.dob = extractDob(text);
  cccdInfo.gender = extractGender(text);
  // other extractions...
}

// Extraction functions with specified rules
function extractDob(text: string): string {
  const dobMatch = text.match(/(?:ngày sinh|sinh ngày|date of birth)(?:(?::|\s+)?(\d{1,2}[/-]\d{1,2}[/-]\d{2,4}))/i);
  if (dobMatch) return dobMatch[1].replace(/[-]/g, '/').toUpperCase(); // Normalize date
  return '';
}

function extractGender(text: string): string {
  const genderMatch = text.match(/(nam|nữ|nu)/i);
  return genderMatch ? genderMatch[0].toUpperCase() : '';
}