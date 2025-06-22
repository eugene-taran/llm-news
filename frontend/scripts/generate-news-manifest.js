import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const newsDir = path.join(__dirname, '../../news');
const manifest = {};

function safeReadJson(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    console.warn('Failed to read/parse', filePath, e);
    return null;
  }
}

for (const dateDir of fs.readdirSync(newsDir)) {
  const datePath = path.join(newsDir, dateDir);
  if (!fs.statSync(datePath).isDirectory()) continue;

  for (const modelDir of fs.readdirSync(datePath)) {
    const outputPath = path.join(datePath, modelDir, 'model-output.json');
    if (!fs.existsSync(outputPath)) continue;

    const json = safeReadJson(outputPath);
    if (!json) continue;

    if (!manifest[modelDir]) manifest[modelDir] = [];
    manifest[modelDir].push({
      date: dateDir,
      path: `news/${dateDir}/${modelDir}/model-output.json`,
      articles: json.articles || []
    });
  }
}

const priorityModel = 'gemini-2.5-pro';
const lastModel = 'gemini-2.0-flash';

const sortedManifest = {};

if (manifest[priorityModel]) {
  sortedManifest[priorityModel] = manifest[priorityModel];
}

Object.keys(manifest)
    .filter(m => m !== priorityModel && m !== lastModel)
    .sort()
    .forEach(m => { sortedManifest[m] = manifest[m]; });

if (manifest[lastModel]) {
  sortedManifest[lastModel] = manifest[lastModel];
}

fs.writeFileSync(
    path.join(__dirname, '../public/news-manifest.json'),
    JSON.stringify(sortedManifest, null, 2)
);