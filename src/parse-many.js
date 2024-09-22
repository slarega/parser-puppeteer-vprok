import { Parser } from './parser.js';

let data = {
  'Москва и область': [
    'https://www.vprok.ru/product/domik-v-derevne-dom-v-der-moloko-ster-2-5-950g--310778',
    'https://www.vprok.ru/product/makfa-makfa-izd-mak-spirali-450g--306739',
  ],
  'Владимирская обл.': [
    'https://www.vprok.ru/product/greenfield-greenf-chay-gold-ceyl-bl-pak-100h2g--307403',
    'https://www.vprok.ru/product/chaykofskiy-chaykofskiy-sahar-pesok-krist-900g--308737',
  ],
  'Калужская обл.': [
    'https://www.vprok.ru/product/lavazza-kofe-lavazza-1kg-oro-zerno--450647',
    'https://www.vprok.ru/product/parmalat-parmal-moloko-pit-ulster-3-5-1l--306634',
  ],
};

async function parseMany() {
  let promises = [];

  for (let [region, urls] of Object.entries(data)) {
    for (const url of urls) {
      promises.push(await Parser(url, region));
    }
  }

  return Promise.all(promises);
}

await parseMany();
