const headerMap = {
  word: ["word", "term", "vocab"],
  description: ["desc", "description", "meaning", "definition"],
  example: ["example", "usage", "sentence"]
};

export function normalizeHeaders(headers: string[]): Record<string, number> {
  const map: { [key: string]: number } = {};

  for (let i = 0; i < headers.length; i++) {
    const header = headers[i].toLowerCase().trim();
    for (const key in headerMap) {
      if (headerMap[key as keyof typeof headerMap].includes(header)) {
        map[key] = i;
      }
    }
  }

  // Check all required columns exist
  if (!("word" in map) || !("description" in map)) {
    throw new Error("Missing required columns: word or description");
  }

  return map;
}

export function isStructuredFile(file: Express.Multer.File): boolean {
    //detect keyword from first line in headermap
    const content = file.buffer.toString("utf-8");
    const records = content.split("\n").map((line: string) => line.split(",").map((col: string) => col.trim()));
    const headers = records[0];
    const headerIndexes = normalizeHeaders(headers);
    return Object.keys(headerIndexes).length > 0 && headerIndexes.word !== undefined && headerIndexes.description !== undefined;
}