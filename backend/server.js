//const bodyParser = require("body-parser");
const express = require("express");
//const http = require("http");
const cors = require("cors");
const cron = require("node-cron");
const twilio = require("twilio");
//const Pool = require("pg").Pool;
const { Item, sequelize } = require("./models");
const { callWebScrapers } = require("./automation/scrapers");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

/*
const pool = new Pool({
    user: "postgres",
    password: "BSaki@1230",
    host: "localhost",
    port: 5432,
    database: "perntodo",
});
*/

const app = express();
app.use(cors()); //for some reason cors was messing up the api requests???
app.use(express.json());

const client = new twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/*
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const db = require('')

const server = http.createServer(app);

var PORT = process.env.PORT || 5000;
*/

// if development mode, allow self-signed ssl
/*
if (app.get("env") === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}
*/

//routes:

//create an item in database
app.post("/items", async (req, res) => {
  const { itemName, itemPrice, itemURL, itemColor } = req.body;
  try {
    const item = await Item.create({ itemName, itemPrice, itemURL });
    return res.json(item);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

//gets all items that are tracked
app.get("/items", async (req, res) => {
  try {
    const items = await Item.findAll();
    return res.json(items);
  } catch (err) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

//gets item by uuid
app.get("/items/:uuid", async (req, res) => {
  const uuid = req.params.uuid;
  try {
    const item = await Item.findOne({
      where: { uuid },
    });
    return res.json(item);
  } catch (err) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

//deletes item by uuid
app.delete("/items/:uuid", async (req, res) => {
  const uuid = req.params.uuid;
  try {
    const item = await Item.destroy({
      where: { uuid },
    });
    return res.status(200).send();
  } catch (err) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

//calls web scraper with url to send data back
app.post("/urls", async (req, res) => {
  const { storeName, itemURL } = req.body;
  try {
    const url = await Item.findOne({
      where: { itemURL },
    });
    if (url === null) {
      const data = await callWebScrapers(storeName, itemURL);
      if (Object.keys(data).length !== 0) {
        const item = await Item.create({
          itemName: data.title,
          itemPrice: data.cost,
          itemURL: data.link,
          storeName: storeName,
        });
        res.json(item);
      } else {
        alert("An error occurred, please use a different URL.");
        res.json({});
      }
    } else {
      res.json({});
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

cron.schedule("0 7 * * *", async () => {
    try {
      const objects = await Item.findAll();
      const strings = await JSON.stringify(objects);
      const items = await JSON.parse(strings);
  for(var item of items) {
    const data = await callWebScrapers(item.storeName, item.itemURL);
    if(data.cost !== item.itemPrice) {
      if(data.cost < item.itemPrice){
        //notify the user with twilio
        client.messages.create({
          to: '+15103046384',
          from: '+12679301703',
          body: `${item.itemName} is on sale!`
        });
      }
      await Item.update({itemPrice: data.cost}, {
        where: {
          itemURL: item.itemURL,
        }
      });
    }
  }
    } catch (err) {
      console.error(err.message);
    }
  },
  {
    timezone: "America/Los_Angeles",
  }
);

app.listen(5000, async () => {
  console.log("server is listening on port 5000");
  await sequelize.sync();
  //await sequelize.sync({force: true});
  //await sequelize.authenticate(); //connects to the db rather than writing over it
  console.log("Database synced");
});
