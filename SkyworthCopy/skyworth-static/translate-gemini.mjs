#!/usr/bin/env node
/**
 * translate-gemini.mjs
 * Usage: node translate-gemini.mjs <input.html> <language> <suffix>
 * Example: node translate-gemini.mjs pages/sola-mate.html Chinese cn
 *
 * Reads the HTML file, sends the body content to Gemini for translation,
 * and writes the result to <basename>-<suffix>.html
 *
 * Requires GEMINI_API_KEY environment variable.
 */

import fs from 'fs';
import path from 'path';
import https from 'https';

const [,, inputFile, targetLang, suffix] = process.argv;

if (!inputFile || !targetLang || !suffix) {
  console.error('Usage: node translate-gemini.mjs <input.html> <language> <suffix>');
  console.error('Example: node translate-gemini.mjs pages/sola-mate.html Chinese cn');
  process.exit(1);
}

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('Error: GEMINI_API_KEY environment variable is not set.');
  process.exit(1);
}

const inputPath = path.resolve(inputFile);
if (!fs.existsSync(inputPath)) {
  console.error(`Error: File not found: ${inputPath}`);
  process.exit(1);
}

const html = fs.readFileSync(inputPath, 'utf8');

// Build output path: pages/sola-mate.html -> pages/sola-mate-cn.html
const dir = path.dirname(inputPath);
const ext = path.extname(inputPath);
const base = path.basename(inputPath, ext);
const outputPath = path.join(dir, `${base}-${suffix}${ext}`);

// Split HTML into head (style/meta) and body for translation
// We'll translate the entire file but instruct Gemini to only translate visible text
const prompt = `You are a professional HTML translator. Translate ALL visible English text content in the following HTML page into ${targetLang}.

CRITICAL RULES:
1. Translate ONLY the visible text that users see on the page (headings, paragraphs, button labels, list items, table headers, alt text, title attributes, meta description, meta keywords, page title).
2. DO NOT translate or modify:
   - HTML tags, attributes names, CSS class names, CSS styles, inline styles
   - JavaScript code
   - File paths (src, href values — keep them exactly as-is)
   - Technical model numbers (SWM800-R, SWM1600-S, etc.)
   - Brand names: SolaMate, SolaWard, Solavita, SKYWORTH, Skyworth
   - CSS variable names (--colorbj, --radius20, etc.)
   - Units: W, Wp, kWh, THB
   - Numeric values
   - Emoji characters
3. Change <html lang="en-US"> to <html lang="zh-CN"> (or appropriate lang tag).
4. Keep the components.js reference as components.js (not components-cn.js).
5. Return ONLY the complete translated HTML — no markdown fences, no explanations.
6. Preserve ALL original formatting, indentation, and line breaks exactly.

Here is the HTML to translate:

${html}`;

console.log(`Translating ${inputFile} to ${targetLang}...`);
console.log(`Output: ${outputPath}`);
console.log(`Sending to Gemini API (this may take a minute)...`);

// Use Gemini API via HTTPS
function callGemini(promptText) {
  return new Promise((resolve, reject) => {
    const model = 'gemini-2.0-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const parsedUrl = new URL(url);

    const body = JSON.stringify({
      contents: [{
        parts: [{ text: promptText }]
      }],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 65536,
      }
    });

    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(new Error(`Gemini API error ${res.statusCode}: ${data}`));
          return;
        }
        try {
          const json = JSON.parse(data);
          const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
          if (!text) {
            reject(new Error(`Unexpected API response: ${data.substring(0, 500)}`));
            return;
          }
          resolve(text);
        } catch (e) {
          reject(new Error(`Failed to parse response: ${e.message}`));
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

try {
  let result = await callGemini(prompt);

  // Strip markdown fences if Gemini wraps the output
  result = result.replace(/^```html\s*\n?/, '').replace(/\n?```\s*$/, '');

  // Ensure it starts with <!DOCTYPE
  if (!result.trim().startsWith('<!DOCTYPE') && !result.trim().startsWith('<html')) {
    console.error('Warning: Response does not look like HTML. First 200 chars:');
    console.error(result.substring(0, 200));
  }

  fs.writeFileSync(outputPath, result, 'utf8');
  console.log(`\nDone! Translated file written to: ${outputPath}`);
  console.log(`File size: ${result.length} characters`);
} catch (err) {
  console.error(`\nTranslation failed: ${err.message}`);
  process.exit(1);
}
