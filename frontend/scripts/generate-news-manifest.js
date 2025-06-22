import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const newsDir = path.join(__dirname, '../../news');
const manifest = {};


fs.readdirSync(newsDir).forEach(dateDir => {
  const datePath = path.join(newsDir, dateDir);
  if (fs.statSync(datePath).isDirectory()) {
    fs.readdirSync(datePath).forEach(modelDir => {
      const modelPath = path.join(datePath, modelDir);
      const outputPath = path.join(modelPath, 'model-output.json');
      if (fs.existsSync(outputPath)) {
        let articles = [];
        try {
          const fileData = fs.readFileSync(outputPath, 'utf-8');
          articles = JSON.parse(fileData).articles || [];
        } catch (e) {
          console.warn('Failed to read/parse', outputPath, e);
        }
        if (!manifest[modelDir]) manifest[modelDir] = [];
        manifest[modelDir].push({
          date: dateDir,
          path: `news/${dateDir}/${modelDir}/model-output.json`,
          articles
        });
      }
    });
  }
});


const sortedManifest = {};
const priorityModel = 'gemini-2.5-pro';


if (manifest[priorityModel]) {
  sortedManifest[priorityModel] = manifest[priorityModel];
}


Object.keys(manifest)
  .filter(model => model !== priorityModel)
  .sort()
  .forEach(model => {
    sortedManifest[model] = manifest[model];
  });

fs.writeFileSync(
    path.join(__dirname, '../public/news-manifest.json'),
    JSON.stringify(sortedManifest, null, 2)
);