import fs from "fs/promises";
import path from "path";
import { Lexer } from "./jsonlexer.js";
import { Parser } from "./jsonparser.js";

const testDir = "./test";

async function runTests() {
  try {
    const files = await fs.readdir(testDir);

    for (const file of files) {
      if (path.extname(file) !== ".json") continue;

      const filePath = path.join(testDir, file);
      const content = await fs.readFile(filePath, "utf-8");

      const lex = new Lexer();
      const tokens = lex.tokenize(content);
      const parser = new Parser();
      console.log(`\n=== Testing ${file} ===`);
      try {
        const result = parser.parse(tokens);
        console.log("✅ Parsed successfully:", result);
      } catch (err) {
        console.error("❌ Parsing failed:", err.message);
      }
    }
  } catch (err) {
    console.error("Error reading test directory:", err);
  }
}

runTests();
