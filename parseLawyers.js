import fs from 'fs';

const markdown = fs.readFileSync('compass_artifact_wf-c7ac7a13-8798-46db-b080-6b23a59602c3_text_markdown.md', 'utf-8');
const lines = markdown.split('\n');

const lawyers = [];
let id = 1;

for (const line of lines) {
  if (line.trim().startsWith('|') && !line.trim().startsWith('| # |') && !line.trim().startsWith('|---|')) {
    const parts = line.split('|').map(s => s.trim());
    if (parts.length >= 8 && parts[1] && !isNaN(parseInt(parts[1], 10))) {
      // It's a lawyer row
      // Array indices: | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
      // 0 is empty (before first |)
      // 1 is ID
      // 2 is Name
      // 3 is Phone
      // 4 is Email
      // 5 is Specialization
      // 6 is City/Region
      // 7 is Address
      // 8 is Website
      
      const name = parts[2];
      const phone = parts[3] === 'Н/Д' ? '' : parts[3];
      const email = parts[4] === 'Н/Д' || parts[4].includes('Н/Д') || !parts[4].includes('@') ? '' : parts[4];
      const specialization = parts[5];
      const city = parts[6];
      const address = parts[7];
      const website = parts[8] === 'Н/Д' ? '' : parts[8];
      
      // Attempt to clean email if it has extra text
      let cleanEmail = email;
      if (email.includes('(')) {
        cleanEmail = email.split('(')[0].trim();
      }

      lawyers.push({
        id: id++,
        name,
        phone,
        email: cleanEmail,
        specialization,
        city,
        address,
        website
      });
    }
  }
}

// Write the output to a typescript file
const fileContent = `export interface Lawyer {
  id: number;
  name: string;
  phone: string;
  email: string;
  specialization: string;
  city: string;
  address: string;
  website: string;
}

export const lawyersData: Lawyer[] = ${JSON.stringify(lawyers, null, 2)};
`;

if (!fs.existsSync('./src/data')) {
  fs.mkdirSync('./src/data');
}
fs.writeFileSync('./src/data/lawyers.ts', fileContent);
console.log(`Successfully generated ${lawyers.length} lawyers.`);
