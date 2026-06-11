const fs = require('fs');

function applyDarkMode(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  const replacements = [
    { search: /bg-\[\#FBF9F4\]/g, replace: 'bg-[#FBF9F4] dark:bg-gray-950' },
    { search: /text-\[\#231916\]/g, replace: 'text-[#231916] dark:text-gray-100' },
    { search: /bg-\[\#EAE2D4\]/g, replace: 'bg-[#EAE2D4] dark:bg-gray-900' },
    { search: /border-\[\#DDC0B8\]/g, replace: 'border-[#DDC0B8] dark:border-gray-800' },
    { search: /text-\[\#695D4B\]/g, replace: 'text-[#695D4B] dark:text-gray-400' },
    { search: /text-\[\#4A4A4A\]/g, replace: 'text-[#4A4A4A] dark:text-gray-300' },
    { search: /text-\[\#9A8C80\]/g, replace: 'text-[#9A8C80] dark:text-gray-500' },
    { search: /bg-\[\#F4EFEA\]/g, replace: 'bg-[#F4EFEA] dark:bg-gray-800' }
  ];

  replacements.forEach(({ search, replace }) => {
    // Avoid double replacements
    const cleanReplace = replace.split(' ')[1];
    if (content.includes(cleanReplace)) {
        // already replaced, skipping
    } else {
        content = content.replace(search, replace);
    }
  });

  // Fix up specific cases
  content = content.replace(/dark:bg-gray-950 dark:bg-gray-950/g, 'dark:bg-gray-950');
  content = content.replace(/dark:text-gray-100 dark:text-gray-100/g, 'dark:text-gray-100');

  fs.writeFileSync(filePath, content);
  console.log(`Updated ${filePath}`);
}

applyDarkMode('d:/THUCTAP/ZYRO/intern_2026_Fashion_Shop/FE/src/pages/Design.jsx');
applyDarkMode('d:/THUCTAP/ZYRO/intern_2026_Fashion_Shop/FE/src/pages/Collection.jsx');
