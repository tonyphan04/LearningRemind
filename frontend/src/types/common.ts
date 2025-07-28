// Common types for the app
// No need to import Word here, it's defined below
export interface Folder {
  id: number;
  name: string;
  description?: string;
  words?: Word[];
}

export interface Word {
  id: number;
  word: string;
  description?: string;
  example?: string;
}

export interface User {
  id: number;
  email: string;
  // Add more fields as needed
}
