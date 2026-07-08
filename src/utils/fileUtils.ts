import fs from 'fs';
import path from 'path';

export function readJsonFile<T>(relativePath: string): T {
  const fullPath = path.resolve(process.cwd(), relativePath);
  const raw = fs.readFileSync(fullPath, 'utf-8');
  return JSON.parse(raw) as T;
}

export function getTestDataFilePath(fileName: string): string {
  return path.resolve(process.cwd(), 'test-data', 'files', fileName);
}

export function getDownloadFilePath(fileName: string): string {
  return path.resolve(process.cwd(), 'reports', 'downloads', fileName);
}

export function getScreenshotFilePath(fileName: string): string {
  return path.resolve(process.cwd(), 'reports', 'screenshots', fileName);
}
