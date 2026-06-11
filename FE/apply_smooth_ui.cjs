const fs = require('fs');
const path = require('path');
const dir = 'd:/THUCTAP/ZYRO/intern_2026_Fashion_Shop/FE/src/pages/admin';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

files.forEach(f => {
  const filePath = path.join(dir, f);
  let content = fs.readFileSync(filePath, 'utf8');

  // Containers
  content = content.split('className="border border-[#D1C4B9] bg-white p-5"').join('className="rounded-2xl border border-[#D1C4B9] bg-white p-5 shadow-sm"');
  content = content.split('className="border border-[#D1C4B9] bg-white overflow-x-auto"').join('className="rounded-2xl border border-[#D1C4B9] bg-white overflow-hidden shadow-sm overflow-x-auto"');

  // Add rounded-xl to inputs/selects (they usually have "border border-[#D1C4B9] bg-white px-4 py-2.5" or similar)
  content = content.replace(/border border-\[\#D1C4B9\] px-4 py-2\.5/g, 'rounded-xl border border-[#D1C4B9] px-4 py-2.5 transition-all duration-300 focus:border-[#1B1C19]');
  content = content.replace(/border border-\[\#D1C4B9\] bg-white px-4 py-2\.5/g, 'rounded-xl border border-[#D1C4B9] bg-white px-4 py-2.5 transition-all duration-300 focus:border-[#1B1C19]');

  // Dark buttons - using simpler string replace
  content = content.split('bg-[#1B1C19] px-5 py-2.5').join('rounded-xl bg-[#1B1C19] px-5 py-2.5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5');
  
  // Icon buttons
  content = content.split('h-9 w-9 items-center').join('h-9 w-9 rounded-xl transition-all duration-300 hover:-translate-y-0.5 items-center');
  content = content.split('h-8 w-8 items-center').join('h-8 w-8 rounded-xl transition-all duration-300 hover:-translate-y-0.5 items-center');

  // Thumbnails
  content = content.split('shrink-0 overflow-hidden border border-[#E8E0D8]').join('shrink-0 overflow-hidden rounded-xl border border-[#E8E0D8]');

  // Table rows
  content = content.split('hover:bg-[#FAFAF8] transition-colors').join('hover:bg-[#FAFAF8] transition-all duration-300');

  // Search input specifically
  content = content.split('min-w-[240px] items-center gap-2 border border-[#D1C4B9]').join('min-w-[240px] items-center gap-2 rounded-xl border border-[#D1C4B9] transition-all duration-300 focus-within:border-[#1B1C19] focus-within:shadow-sm');

  fs.writeFileSync(filePath, content);
  console.log('Updated ' + f);
});
