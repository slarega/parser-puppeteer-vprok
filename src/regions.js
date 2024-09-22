import fs from 'fs';

export let regions = [
  'Москва и область',
  'Санкт-Петербург и область',
  'Владимирская обл.',
  'Калужская обл.',
  'Рязанская обл.',
  'Тверская обл.',
  'Тульская обл.',
];

export function CreateDir(path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
}
