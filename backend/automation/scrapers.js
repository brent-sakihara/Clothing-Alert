const puppeteer = require("puppeteer");
const userAgent = require("user-agents");

async function callWebScrapers(name, url) {
  if (name === "Amazon") {
    const data = await scrapeAmazon(url);
    //console.log(data);
    return data;
  } else if (name === "Nike") {
    const data = await scrapeNike(url);
    //console.log(data);
    return data;
  } else if (name === "H&M") {
    const data = await scrapeHandM(url);
    //console.log(data);
    return data;
  } else if (name === "Aeropostale") {
    const data = await scrapeAeropostale(url);
    //console.log(data);
    return data;
  } else if (name === "North Face") {
    const data = await scrapeNorthFace(url);
    //console.log(data);
    return data;
  } else if (name === "Adidas") {
    const data = await scrapeAdidas(url);
    //console.log(data);
    return data;
  } else if (name === "Zara") {
    const data = await scrapeZara(url);
    //console.log(data);
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
    await page.setDefaultNavigationTimeout(0); 
    await page.goto(url, { waitUntil: "networkidle2" });
    //await page.waitForTimeout(500);

    const link = url;
    let color, title, price;

    const [el] = await page.$x('//*[@id="pdp_product_title"]');
    const text = await el.getProperty("textContent");
    title = await text.jsonValue();

    /*
    try{
      const [el2] = await page.$x(
      '//*[@id="RightRail"]/div/span/div/div/ul/li[1]'
    );
    const hue = await el2.getProperty("textContent");
    const shade = await hue.jsonValue();
    color = shade.substring(7);
  }
  catch{
    const [el2] = await page.$x(
      '//*[@id="RightRail"]/div/div[7]/div/ul/li[1]'
    );
    const hue = await el2.getProperty("textContent");
    const shade = await hue.jsonValue();
    color = shade.substring(7);
  }
    */

    try {
      const [el2] = await page.$x(
        '//*[@id="RightRail"]/div/div[1]/div/div[1]/div[2]/div/div'
      );
      const text2 = await el2.getProperty("textContent");
      price = await text2.jsonValue();
    } catch {
      const [el2] = await page.$x(
        '//*[@id="RightRail"]/div/div[1]/div/div[1]/div[2]/div/div[1]'
      );
      const text2 = await el2.getProperty("textContent");
      price = await text2.jsonValue();
    }

    const cost = parseFloat(Number(price.replace(/[^0-9.-]+/g, "")));

    //await browser.waitForTarget(()=>false);
    await browser.close();
    return { title, cost, link };
  } catch (err) {
    console.error(err.message);
    await browser.close();
    return {};
  }
}

//callWebScrapers("Nike","https://www.nike.com/u/custom-nike-air-force-1-high-by-you-10000790/3418295064");

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
    const [el2] = await page.$x('//*[@id="price_inside_buybox"]');
    const text2 = await el2.getProperty("textContent");
    price = await text2.jsonValue();
  } catch {}
  const cost = parseFloat(Number(price.replace(/[^0-9.-]+/g, "")));

  await browser.close();
  return { title, cost, link };
}

//callWebScrapers('Amazon','https://smile.amazon.com/iPhone-Japan-Anime-Cartoon-Silicone/dp/B08NHPKPWT/?_encoding=UTF8&pd_rd_w=TkQV4&pf_rd_p=38316967-9a6c-4cf3-acd3-6269fd389669&pf_rd_r=GVHAA8CMBF3WK7WYN9TB&pd_rd_r=37fbdf99-bcfe-4ef8-bf75-391e7104218c&pd_rd_wg=sYOU3&ref_=pd_gw_ci_mcx_mr_hp_d&th=1');

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

//callWebScrapers("H&M","https://www2.hm.com/en_us/productpage.0964269004.html");

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
    await page.waitForTimeout(5000);

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

//callWebScrapers("Aeropostale","https://www.aeropostale.com/premium-air-athletic-skinny-jean/64138244.html?dwvar_64138244_color=962&cgid=whats-new-guys-new-arrivals#uuid=859a176e65d9c96d5ddd090ec7");

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
    //await page.waitForTimeout(10000);

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

//callWebScrapers("North Face","https://www.thenorthface.com/shop/kids-boys-jackets-vests-fleece/boys-forrest-full-zip-hooded-fleece-jacket-nf0a5aaz?variationId=7D6");

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
    //await page.waitForTimeout(10000);

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

//callWebScrapers("Adidas","https://www.adidas.com/us/face-covers-3-pack-m-l/H32391.html");

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
    //await page.waitForTimeout(10000);

    //const [close] = await page.$x('//*[@id="bx-element-1403043-2s3tWdt"]/button');
    //await close.evaluate(close=>close.click());
    //await page.waitForTimeout(5000);

    const link = url;
    let hue, title, price;
    try {
      const [el] = await page.$x(
        '//*[@id="main"]/article/div[2]/div[2]/div[1]/h1'
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
    /*
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
    let color = hue.substring(5);
    */
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

    //await browser.waitForTarget(()=>false);
    await browser.close();
    return { title, cost, link };
  } catch (err) {
    console.error(err.message);
    await browser.close();
    return {};
  }
}

//callWebScrapers("Zara","https://www.zara.com/us/en/striped-polo-shirt-p03057620.html?v1=104755455&v2=1862469");
//note: zara keeps changing website element xpaths so may have to delete

module.exports = {callWebScrapers}