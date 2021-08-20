//const bodyParser = require("body-parser");
const express = require("express");
//const http = require("http");
const cors = require("cors");
const cron = require("node-cron");
const twilio = require("twilio");
//const Pool = require("pg").Pool;
const { User, Item, sequelize } = require("./models");
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
app.use(cors());
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

//create an user in database
app.post("/users", async (req, res) => {
  const { userEmail } = req.body;
  try {
    const user = await User.create({ userEmail });
    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

//get user by email
app.get("/users/:email", async (req, res) => {
  const email = req.params.email;
  try {
    const user = await User.findOne({
      where: { userEmail: email },
    });
    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});


app.get("/users", async (req, res) => {
  try {
    const users = await User.findAll();
    return res.json(users);
  } catch (err) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});



//create an item in database
app.post("/items", async (req, res) => {
  const { itemName, itemPrice, itemURL, userId, storeName } = req.body;
  try {
    const item = await Item.create({ itemName, itemPrice, itemURL, userId, storeName });
    return res.json(item);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});


/*
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
*/

//gets all items from a user
app.get("/items/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const items = await Item.findAll({
      where: { userId: id },
    });
    return res.json(items);
  } catch (err) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

/*
//gets item by uuid
app.get("/items/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const item = await Item.findOne({
      where: { id },
    });
    return res.json(item);
  } catch (err) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});
*/

//deletes item by id
app.delete("/items/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const item = await Item.destroy({
      where: { id: id },
    });
    return res.status(200).send();
  } catch (err) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

//calls web scraper with url to send data back
app.post("/urls", async (req, res) => {
  const { storeName, itemURL, userId } = req.body;
  try {
    const url = await Item.findOne({
      where: { itemURL: itemURL, userId: userId},
    });
    if (url === null) {
      const data = await callWebScrapers(storeName, itemURL);
      if (Object.keys(data).length !== 0) {
        const item = await Item.create({
          itemName: data.title,
          itemPrice: data.cost,
          itemURL: data.link,
          storeName: storeName,
          userId: userId,
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
