const fs = require('fs');
const path = require('path');

const markdown = fs.readFileSync('compass_artifact_wf-0164ce48-1ea0-4097-9128-7bc24d3ec9d9_text_markdown.md', 'utf-8');

const regex = /### (\d+)\. ([^\n]+)\n\n\| Field \| Details \|\n\|-------\|---------\|\n\| \*\*Name.*? \| (.*?)\s*\|\n\| \*\*Download link.*?\*\* \| (.*?)\s*\|\n\| \*\*Format.*?\| (.*?)\s*\|\n\| \*\*Source.*?\| (.*?)\s*\|\n\| \*\*Description.*?\| (.*?)\s*\|/g;

const additionalRegex = /### (\d+)\. ([^\n]+)\n\n\| Field \| Details \|\n\|-------\|---------\|\n\| \*\*Name.*? \| (.*?)\s*\|\n\| \*\*Source\*\* \| (.*?)\s*\|\n\| \*\*Format.*?\| (.*?)\s*\|\n\| \*\*Source.*?\| (.*?)\s*\|\n\| \*\*Description.*?\| (.*?)\s*\|/g;


const templates = [];
let category = "Сотқа арыздар";

const lines = markdown.split('\n');
let currentItem = {};

for(let i=0; i<lines.length; i++) {
  const line = lines[i];
  if(line.startsWith('## ') && !line.startsWith('## Source')) {
    category = line.replace('## ', '').split(' /')[0].trim();
  }
  
  if (line.startsWith('### ')) {
    currentItem = { title: line.split('. ')[1].split(' /')[0].trim(), category };
  }
  
  if (line.includes('**Download link** | ') || line.includes('**Download link (court)** |') || line.includes('**Download link (DOCX)** |') || line.includes('**Download link (paid leave)** |') || line.includes('**Download link (absence)** |') || line.includes('**Source** | https://egov.kz')) {
     let link = line.split('|')[2].trim();
     currentItem.link = link;
  }
  if (line.includes('**Description** |')) {
    currentItem.description = line.split('|')[2].trim();
    // avoid duplicates
    if (!templates.find(t => t.title === currentItem.title)) {
        templates.push({...currentItem});
    }
  }
}

// manual fallback if some missing
console.log(`Found ${templates.length} templates`);

const tsContent = `export interface DocumentTemplate {
  id: number;
  title: string;
  category: string;
  link?: string;
  description?: string;
}

export const documentTemplates: DocumentTemplate[] = ${JSON.stringify(templates.map((t, idx) => ({id: idx + 1, ...t})), null, 2)};
`;

fs.writeFileSync('src/data/templates.ts', tsContent);
console.log('Saved to src/data/templates.ts');
