import puppeteer from 'puppeteer';
import fsp from 'fs/promises';
import fs from 'fs';
import { regions } from './regions.js';

async function parseData(url, region, directoryPath) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(`${url}`);
  await page.setViewport({ width: 2048, height: 1080 });

  // уведомления
  await page.locator('.Tooltip_closeIcon__skwl0').click(); // "Войдите в X5ID и получите карту лояльности"
  await page.locator('.CookiesAlert_agreeButton__cJOTA').click(); // cookies0

  const regionButton = await page
    .locator('.Region_region__6OUBn > span:nth-child(2)')
    .waitHandle();
  const regionButtonText = await regionButton?.evaluate((el) => el.textContent);

  // выбор региона
  if (regionButtonText !== region) {
    await page.locator('.Region_region__6OUBn').click(); // список регионов
    const buttonRegion = await page.waitForSelector(`text=${region}`);
    await buttonRegion.click();
    // для скриншота
    await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
  }

  // скриншот
  await page.screenshot({
    path: `${directoryPath}/screenshot.jpg`,
    fullPage: true,
  });

  let productData = '';

  // цена
  try {
    const pricesSelector = await page
      .locator('.PriceInfo_root__GX9Xp')
      .waitHandle();
    const pricesData = await pricesSelector?.evaluate((el) => el.textContent);
    const prices = pricesData.split(' ');
    switch (prices.length) {
      case 5:
        productData += `price=${prices[3]}\npriceOld=${prices[0]}\n`;
        break;
      default:
        productData += `price=${prices[0]}\n`;
        break;
    }
  } catch (err) {
    const msgSelector = await page
      .locator('.OutOfStockInformer_informer__NCD7v')
      .waitHandle();
    const msg = await msgSelector?.evaluate((el) => el.textContent);

    if (msg === 'Распродано') {
      productData += `price=${null}\n`;
    } else {
      console.error(err.message);
    }
  }

  // рейтинг товара
  const ratingSelector = await page
    .locator('.ActionsRow_stars__EKt42')
    .waitHandle();
  const rating = await ratingSelector?.evaluate((el) => el.textContent);

  // количество отзывов на товар
  const reviewSelector = await page
    .locator('.ActionsRow_reviews__AfSj_')
    .waitHandle();
  const reviewCountData = await reviewSelector?.evaluate(
    (el) => el.textContent,
  );
  const reviewCount = reviewCountData.split(' ')[0];

  productData += `rating=${rating}\nreviewCount=${reviewCount}`;

  const clearProductData = productData.replace(' ', '');
  try {
    await fsp.writeFile(
      `${directoryPath}/product.txt`,
      clearProductData,
      'utf-8',
    );
  } catch (err) {
    console.error(err.message);
  }

  await browser.close();

  return `Данные сохранены в каталоге: ${directoryPath}`;
}

export async function Parser(url, region) {
  // проверка данных
  if (!regions.includes(region)) {
    console.error('Ошибка региона');
    process.exit();
  }
  const regexp = new RegExp('^https://www.vprok.ru/product');
  if (!regexp.test(url)) {
    console.error('Ошибка url');
    process.exit();
  }

  // директории / каталоги
  const reg = region.replace(/ /g, '_').replace('.', '');
  let directoryPath = `./archive/${reg}/`;
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath);
  }
  const productArticle = url.split('/').pop().split('--').pop();
  directoryPath += productArticle;
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath);
  }

  // данные
  parseData(url, region, directoryPath).then((text) => {
    console.log(text);
  });
}
