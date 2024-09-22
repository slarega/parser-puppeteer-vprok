# Парсер товаров с сайта www.vprok.ru с помощью библиотеки puppeteer 

---
## Описание
JS-скрипт принимает два аргумента: `url товара` и `регион`. Всего на сайте 7 регионов.

Скрипт возвращает:
- `screenshot.jpg` - скриншот страницы товара на сайте
- `product.txt`:
  * `price` - цена товара
    * если товар распродан `=null`
    * если действует скидка, то также возвращает `priceOld` - цену без скидки
  * `rating` - рейтинг товара 
  * `reviewCount` - количество отзывов на товар

Собранные данные сохраняются в архив со следующей структурой:
```
.
├── archive
│   ├── регион
│   │    ├── артикул товара
│   │    │    ├── screenshot.jpg
│   │    │    ├── product.txt
```

---
## Команды
|       Команда        |                       Действие                        |
|:--------------------:|:-----------------------------------------------------:|
|   `npm run format`   |        Автоформатирование  с помощью Prettier         |
|    `npm run lint`    |         Исправление ошибок с помощью  ESLint          |
| `npm run parse-many` | Скрип для парсинга данных 6 товаров (подробнее далее) |

---
## Get started
1. Установить пакеты
   ```bash
   $ npm install
   ```
2. Запуск скрипта
   ```bash
   $ node index.js https://www.vprok.ru/product/domik-v-derevne-dom-v-der-moloko-ster-3-2-950g--309202 "Санкт-Петербург и область"
   ```
3. Результат:
   * Вывод в консоль:
       ```
       Данные сохранены в каталоге: ./archive/Санкт-Петербург_и_область/309202
       ```
   * [screenshot.jpg](./archive/Санкт-Петербург_и_область/309202/screenshot.jpg)
       <style>
       .custom-image {
           display: block;
           margin-left: auto;
           margin-right: auto;
           width: 50%;
       }
       </style>
       <img src="/archive/Санкт-Петербург_и_область/309202/screenshot.jpg" alt="image" class="custom-image">
   
   * [product.txt](./archive/Санкт-Петербург_и_область/309202/product.txt)
      ```
      price=116,9
      priceOld=159
      rating=4.8
      reviewCount=938
      ```
     
---
## parse-many
Пример использования скрипта для 6 товаров в разных регионах
*p.s. не более 6 ссылок одновременно*
1. [parse-many.js:](./src/parse-many.js)
   ```javascript
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
   ```
2. Запуск
   ```bash
   $ npm run parse-many
   ```
3. Вывод в консоль:
   ```
   Данные сохранены в каталоге: ./archive/Москва_и_область/310778
   Данные сохранены в каталоге: ./archive/Москва_и_область/306739
   Данные сохранены в каталоге: ./archive/Калужская_обл/306634
   Данные сохранены в каталоге: ./archive/Владимирская_обл/308737
   Данные сохранены в каталоге: ./archive/Калужская_обл/450647
   Данные сохранены в каталоге: ./archive/Владимирская_обл/307403
   ```

---   
## Остальные товары из примера ссылок
1. Рязанская обл.
   ```bash
   $ node index.js https://www.vprok.ru/product/perekrestok-spmi-svinina-duhovaya-1kg--1131362 "Рязанская обл."
   ```
   ```bash
   $ node index.js https://www.vprok.ru/product/vinograd-kish-mish-1-kg--314623 "Рязанская обл."
   ```

2. Тверская обл. - оба товара распроданы
   ```bash
   $ node index.js https://www.vprok.ru/product/eko-kultura-tomaty-cherri-konfetto-250g--946756 "Тверская обл."
   ```
   ```bash
   $ node index.js https://www.vprok.ru/product/bio-perets-ramiro-1kg--476548 "Тверская обл."
   ```

3. Тульская обл.
   ```bash
   $ node index.js https://www.vprok.ru/product/korkunov-kollektsiya-shokoladnyh-konfet-korkunov-iz-molochnogo-shokolada-s-fundukom-karamelizirovannym-gretskim-orehom-vafley-svetloy-orehovoy--1295690 "Тульская обл."
   ```
   ```bash
   $ node index.js https://www.vprok.ru/product/picnic-picnic-batonchik-big-76g--311996 "Тульская обл."
   ```
   ```bash
   $ node index.js https://www.vprok.ru/product/ritter-sport-rit-sport-shokol-tsel-les-oreh-mol-100g--305088 "Тульская обл."
   ```
   ```bash
   $ node index.js https://www.vprok.ru/product/lays-chipsy-kartofelnye-lays-smetana-luk-140g--1197579  "Тульская обл."
   ```
