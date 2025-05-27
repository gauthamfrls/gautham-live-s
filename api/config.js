import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), 'storage', 'config.json');
  const jsonData = fs.readFileSync(filePath, 'utf-8');
  const config = JSON.parse(jsonData);
  res.status(200).json(config);
}
