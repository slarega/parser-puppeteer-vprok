import { Parser } from './src/parser.js';
const url = process.argv[2],
  region = process.argv[3];

await Parser(url, region);
