const puppeteer = require("puppeteer");
const userAgent = require("user-agents");

async function callWebScrapers(name, url) {
  if (name === "Amazon") {
    const data = await scrapeAmazon(url);
    //console.log(data);
    return data;
  } else if (name === "Nike") {
    const data = await scrapeNike(url);
    return data;
  } else if (name === "H&M") {
    const data = await scrapeHandM(url);
    return data;
  } else if (name === "Aeropostale") {
    const data = await scrapeAeropostale(url);
    return data;
  } else if (name === "North Face") {
    const data = await scrapeNorthFace(url);
    return data;
  } else if (name === "Adidas") {
    const data = await scrapeAdidas(url);
    return data;
  } else if (name === "Zara") {
    const data = await scrapeZara(url);
    return data;
  } else {
    return {};
  }
}

async function scrapeNike(url) {
  const browser = await puppeteer.launch({ headless: false });
  try {
    const page = await browser.newPage();
    await page.setUserAgent(userAgent.toString());
    await page.setViewport({ width: 1300, height: 1000 });
    await page.setUserAgent(
      "Mozilla/5.0 (iPhone; CPU iPhone OS 9_0_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13A404 Safari/601.1"
    );
    await page.goto(url, { waitUntil: "networkidle2" });
    await page.waitForTimeout(5000);

    const link = url;
    let color, title, price;

    const [el] = await page.$x('//*[@id="pdp_product_title"]');
    const text = await el.getProperty("textContent");
    title = await text.jsonValue();

    const [el2] = await page.$x(
      '//*[@id="RightRail"]/div/span/div/div/ul/li[1]'
    );
    const hue = await el2.getProperty("textContent");
    const shade = await hue.jsonValue();
    color = shade.substring(7);

    try {
      const [el3] = await page.$x(
        '//*[@id="RightRail"]/div/div[1]/div/div[1]/div[2]/div/div'
      );
      const text2 = await el3.getProperty("textContent");
      price = await text2.jsonValue();
    } catch {
      const [el3] = await page.$x(
        '//*[@id="RightRail"]/div/div[1]/div/div[1]/div[2]/div/div[1]'
      );
      const text2 = await el3.getProperty("textContent");
      price = await text2.jsonValue();
    }

    const cost = parseFloat(Number(price.replace(/[^0-9.-]+/g, "")));

    //await browser.waitForTarget(()=>false);
    await browser.close();
    return { title, color, cost, link };
  } catch (err) {
    console.error(err.message);
    await browser.close();
    return {};
  }
}

//callWebScrapers("Nike","https://www.nike.com/t/dri-fit-mens-swoosh-training-t-shirt-LwDhZh/CZ9724-672");

async function scrapeAmazon(url) {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--start-maximized"],
  }); //puppeteer launches a browser
  const page = await browser.newPage();
  await page.setUserAgent(userAgent.toString());
  await page.goto(url);

  //const [botAlert] = await page.$x('/html/body/div/div[1]/div[2]/div/p');
  //if(botAlert != null && botAlert != undefined){

  //}

  const link = url;
  let price;

  const [el] = await page.$x('//*[@id="productTitle"]'); //uses xpath to select an element on the open page and destructures the array returned to get the first element
  //to get the xpath of an element on a page go to page, right click on element you want the path to, click inspect, right click on the highlighted code and select copy->copy xpath
  //can also try copy->full xpath if the regular xpath doesnt work
  const text = await el.getProperty("textContent"); //getting source since it's an image
  const item = await text.jsonValue();
  const title = item.replace(/(\r\n|\n|\r)/gm, "");

  try {
    const [el3] = await page.$x('//*[@id="price_inside_buybox"]');
    const text2 = await el3.getProperty("textContent");
    price = await text2.jsonValue();
  } catch {}
  const cost = parseFloat(Number(price.replace(/[^0-9.-]+/g, "")));

  await browser.close();
  return { title, cost, link };
}

//callWebScrapers('Amazon','https://www.amazon.com/dp/B0937HD7G4/ref=cm_sw_r_cp_api_glt_fabc_QGCPQE1EG0Z0MVY3GCMK');

async function scrapeHandM(url) {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--start-maximized"],
  });
  try {
    const page = await browser.newPage();
    //await page.setViewport({ width: 1280, height: 800 });
    await page.setUserAgent(userAgent.toString());
    await page.goto(url, { waitUntil: "networkidle2" });

    const link = url;
    let color, title, price;

    const [el] = await page.$x(
      '//*[@id="main-content"]/div[2]/div[2]/div[1]/div[1]/div/section/h1'
    );
    const text = await el.getProperty("textContent");
    const item = await text.jsonValue();
    title = item.substring(10);

    const [el2] = await page.$x(
      '//*[@id="main-content"]/div[2]/div[2]/div[1]/div[1]/div/div[1]/h3'
    );
    const hue = await el2.getProperty("textContent");
    color = await hue.jsonValue();

    try {
      const [el3] = await page.$x('//*[@id="product-price"]/div/div/span');
      const text2 = await el3.getProperty("textContent");
      price = await text2.jsonValue();
    } catch {
      const [el3] = await page.$x('//*[@id="product-price"]/div/span');
      const text2 = await el3.getProperty("textContent");
      price = await text2.jsonValue();
    }
    const cost = parseFloat(Number(price.replace(/[^0-9.-]+/g, "")));

    await browser.close();
    return { title, color, cost, link };
  } catch (err) {
    console.error(err.message);
    await browser.close();
    return {};
  }
}

//callWebScrapers("H&M","https://www2.hm.com/en_us/productpage.0944940016.html");

async function scrapeAeropostale(url) {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--start-maximized"],
  });
  try {
    const page = await browser.newPage();
    await page.setUserAgent(userAgent.toString());
    //await page.setViewport({ width: 1900, height: 784 });
    await page.setUserAgent(
      "Mozilla/5.0 (iPhone; CPU iPhone OS 9_0_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13A404 Safari/601.1"
    );
    await page.goto(url, { waitUntil: "networkidle2" });
    await page.waitForTimeout(10000);

    try {
      const [close] = await page.$x(
        '//*[@id="bx-element-1403043-2s3tWdt"]/button'
      );
      await close.evaluate((close) => close.click());
      await page.waitForTimeout(5000);
    } catch {}

    const link = url;
    let color, title, price;

    const [el] = await page.$x('//*[@id="product-content"]/h1');
    const text = await el.getProperty("textContent");
    title = await text.jsonValue();

    const [el2] = await page.$x(
      '//*[@id="product-content"]/div[7]/div/ul/li[1]/div[1]/div/span'
    );
    const hue = await el2.getProperty("textContent");
    color = await hue.jsonValue();

    try {
      const [el3] = await page.$x(
        '//*[@id="product-content"]/div[3]/div[1]/span[2]'
      );
      const text2 = await el3.getProperty("textContent");
      price = await text2.jsonValue();
    } catch {
      const [el3] = await page.$x(
        '//*[@id="product-content"]/div[3]/div[1]/span'
      );
      const text2 = await el3.getProperty("textContent");
      price = await text2.jsonValue();
    }
    const cost = parseFloat(Number(price.replace(/[^0-9.-]+/g, "")));

    //await browser.waitForTarget(()=>false);
    await browser.close();
    return { title, color, cost, link };
  } catch (err) {
    console.error(err.message);
    await browser.close();
    return {};
  }
}

//callWebScrapers("Aeropostale","https://www.aeropostale.com/aeropostale-international-graphic-tee/60018796.html?dwvar_60018796_color=52&cgid=whats-new-guys-new-arrivals#uuid=7cfdb2c34306ff82edfec000ba");

async function scrapeNorthFace(url) {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--start-maximized"],
  });
  try {
    const page = await browser.newPage();
    await page.setUserAgent(userAgent.toString());
    //await page.setViewport({ width: 1900, height: 784 });
    await page.setUserAgent(
      "Mozilla/5.0 (iPhone; CPU iPhone OS 9_0_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13A404 Safari/601.1"
    );
    await page.goto(url, { waitUntil: "networkidle2" });
    await page.waitForTimeout(10000);

    //const [close] = await page.$x('//*[@id="bx-element-1403043-2s3tWdt"]/button');
    //await close.evaluate(close=>close.click());
    //await page.waitForTimeout(5000);

    const link = url;
    let color, title, price;

    const [el] = await page.$x('//*[@id="product-info"]/h1');
    const text = await el.getProperty("textContent");
    title = await text.jsonValue();

    const [el2] = await page.$x(
      '//*[@id="product-attr-form"]/section[2]/div[1]/div[1]/span[2]'
    );
    const hue = await el2.getProperty("textContent");
    color = await hue.jsonValue();
    if (color === "") {
      const [el2] = await page.$x(
        '//*[@id="product-attr-form"]/section[1]/div[1]/div[1]/span[2]'
      );
      const hue = await el2.getProperty("textContent");
      color = await hue.jsonValue();
    }

    const [el3] = await page.$x('//*[@id="product-info"]/div[1]/span[1]');
    const text2 = await el3.getProperty("textContent");
    price = await text2.jsonValue();
    const cost = parseFloat(Number(price.replace(/[^0-9.-]+/g, "")));

    await browser.close();
    return { title, color, cost, link };
  } catch (err) {
    console.error(err.message);
    await browser.close();
    return {};
  }
}

//callWebScrapers("North Face","https://www.thenorthface.com/shop/mens-shirts-tops-hoodies-sweatshirts/mens-walls-pullover-hoodie-nf0a7r7u?variationId=RG1");

async function scrapeAdidas(url) {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--start-maximized"],
  });
  try {
    const page = await browser.newPage();
    await page.setUserAgent(userAgent.toString());
    //await page.setViewport({ width: 1900, height: 784 });
    await page.setUserAgent(
      "Mozilla/5.0 (iPhone; CPU iPhone OS 9_0_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13A404 Safari/601.1"
    );
    await page.goto(url, { waitUntil: "networkidle2" });
    await page.waitForTimeout(10000);

    //const [close] = await page.$x('//*[@id="bx-element-1403043-2s3tWdt"]/button');
    //await close.evaluate(close=>close.click());
    //await page.waitForTimeout(5000);

    const link = url;
    let color, title, price;

    const [el] = await page.$x(
      '//*[@id="app"]/div/div[1]/div/div/div/div[2]/div/div[1]/h1/span'
    );
    const text = await el.getProperty("textContent");
    title = await text.jsonValue();

    const [el2] = await page.$x(
      '//*[@id="app"]/div/div[1]/div/div/div/div[2]/div/div[1]/div[2]/h5/span'
    );
    const hue = await el2.getProperty("textContent");
    color = await hue.jsonValue();

    const [el3] = await page.$x(
      '//*[@id="app"]/div/div[1]/div/div/div/div[2]/div/div[1]/div[2]/div/div/div'
    );
    const text2 = await el3.getProperty("textContent");
    price = await text2.jsonValue();
    const cost = parseFloat(Number(price.replace(/[^0-9.-]+/g, "")));

    //await browser.waitForTarget(()=>false);
    await browser.close();
    return { title, color, cost, link };
  } catch (err) {
    console.error(err.message);
    await browser.close();
    return {};
  }
}

//callWebScrapers("Adidas","https://www.adidas.com/us/adilette-cork-slides/BA7211.html");

async function scrapeZara(url) {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--start-maximized"],
  });
  try {
    const page = await browser.newPage();
    await page.setUserAgent(userAgent.toString());
    //await page.setViewport({ width: 1900, height: 784 });
    await page.setUserAgent(
      "Mozilla/5.0 (iPhone; CPU iPhone OS 9_0_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13A404 Safari/601.1"
    );
    await page.goto(url, { waitUntil: "networkidle2" });
    await page.waitForTimeout(10000);

    //const [close] = await page.$x('//*[@id="bx-element-1403043-2s3tWdt"]/button');
    //await close.evaluate(close=>close.click());
    //await page.waitForTimeout(5000);

    const link = url;
    let hue, title, price;
    try {
      const [el] = await page.$x(
        '//*[@id="main"]/article/div[2]/div[3]/div[1]/h1'
      );
      const text = await el.getProperty("textContent");
      title = await text.jsonValue();
    } catch {
      const [el] = await page.$x(
        '//*[@id="main"]/article/div[1]/div[2]/div[1]/h1'
      );
      const text = await el.getProperty("textContent");
      title = await text.jsonValue();
    }
    try {
      const [el2] = await page.$x(
        '//*[@id="main"]/article/div[2]/div[3]/div[1]/p'
      );
      const clr = await el2.getProperty("textContent");
      hue = await clr.jsonValue();
    } catch {
      const [el2] = await page.$x(
        '//*[@id="main"]/article/div[2]/div[3]/div[1]/div[3]/p'
      );
      const clr = await el2.getProperty("textContent");
      hue = await clr.jsonValue();
    }

    try {
      const [el3] = await page.$x(
        '//*[@id="main"]/article/div[2]/div[3]/div[1]/div[2]/div/span/span/span/span'
      );
      const text2 = await el3.getProperty("textContent");
      price = await text2.jsonValue();
    } catch {
      const [el4] = await page.$x(
        '//*[@id="main"]/article/div[2]/div[2]/div[1]/div[3]/div/span/span[2]/span[1]/span'
      );
      const text3 = await el4.getProperty("textContent");
      price = await text3.jsonValue();
    }
    const cost = parseFloat(Number(price.replace(/[^0-9.-]+/g, "")));

    let color = hue.substring(5);
    //await browser.waitForTarget(()=>false);
    await browser.close();
    return { title, color, cost, link };
  } catch (err) {
    console.error(err.message);
    await browser.close();
    return {};
  }
}

//callWebScrapers("Zara","https://www.zara.com/us/en/combination-text-detail-shirt-p00962325.html?v1=106606326&v2=1862469");


module.exports = {callWebScrapers}