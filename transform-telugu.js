const fs = require("fs");
const path = require("path");

function transformFolder(folderPath, outputFile) {
  const files = fs.readdirSync(folderPath);
  const result = {};

  files.forEach(file => {
    if (!file.endsWith(".json")) return;

    const filePath = path.join(folderPath, file);
    const raw = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    // 🔥 Use English book name as key
    const bookName = raw.book.english;

    result[bookName] = {};

    raw.chapters.forEach(ch => {
      const chapterNumber = String(ch.chapter);
      result[bookName][chapterNumber] = {};

      ch.verses.forEach(v => {
        result[bookName][chapterNumber][String(v.verse)] = v.text;
      });
    });
  });

  console.log("Books merged:", Object.keys(result).length);
  fs.writeFileSync(outputFile, JSON.stringify(result));
  console.log("Created", outputFile);
}

// Adjust paths if needed
transformFolder("./public/bibles/telugu-ot", "./telugu-ot.json");
transformFolder("./public/bibles/telugu-nt", "./telugu-nt.json");