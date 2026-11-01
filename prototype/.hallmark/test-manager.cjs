const { createRequire } = require('node:module');
const requireGlobal = createRequire('F:/ProgrammingEnvironment/nvm/v22.17.0/node_modules/');
const puppeteer = requireGlobal('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH, headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('file:///F:/Projects/chromeProjects/xsh-mark/prototype/manager.html');
  const visibleCount = () => page.$$eval('[data-note-owner]', elements => elements.filter(element => !element.hidden).length);
  const initial = await visibleCount();

  await page.click('[data-select][data-name="白玉小铺"]');
  const account = {
    title: await page.$eval('[data-notes-title]', element => element.textContent),
    profile: await page.$eval('[data-account-name]', element => element.textContent),
    visible: await visibleCount()
  };
  await page.click('[data-select][data-name="串珠领域"]');
  const domain = {
    title: await page.$eval('[data-notes-title]', element => element.textContent),
    accountPanelHidden: await page.$eval('[data-account-panel]', element => element.hidden),
    visible: await visibleCount()
  };
  await page.click('[data-collapse-all]');
  const collapsed = await page.$$eval('.navigator .node__twisty', elements => elements.every(element => element.getAttribute('aria-expanded') === 'false'));
  await page.click('[data-collapse-all]');
  const expanded = await page.$$eval('.navigator .node__twisty', elements => elements.every(element => element.getAttribute('aria-expanded') === 'true'));
  const filterButtons = await page.$$('.workbench__notes .seg__btn');
  await filterButtons[1].click();
  const annotated = await visibleCount();
  await filterButtons[2].click();
  const all = await visibleCount();

  const sizes = [];
  for (const [width, height] of [[1920, 1080], [1440, 900], [1280, 800], [960, 900], [375, 812]]) {
    await page.setViewport({ width, height });
    await page.reload();
    sizes.push(await page.evaluate(() => ({
      width: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      treeWidth: Math.round(document.querySelector('.workbench__tree').getBoundingClientRect().width),
      accountHidden: document.querySelector('[data-account-panel]').hidden
    })));
  }
  console.log(JSON.stringify({ initial, account, domain, collapsed, expanded, annotated, all, sizes, errors }, null, 2));
  await browser.close();
  if (errors.length || initial !== 6 || account.visible !== 3 || domain.visible !== 10 || !collapsed || !expanded || annotated !== 5 || all !== 10 || sizes.some(size => size.scrollWidth > size.width)) process.exitCode = 1;
})().catch(error => { console.error(error); process.exitCode = 1; });
