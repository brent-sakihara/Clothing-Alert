//const bodyParser = require("body-parser");
const express = require("express");
//const http = require("http");
const cors = require("cors");
//const Pool = require("pg").Pool;
const {Item, sequelize} = require('./models');

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
//app.use(cors);  //for some reason cors was messing up the api requests???
app.use(express.json());

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

//create an item to be tracked
app.post('/items', async (req, res) => {
  const {itemName, itemPrice, itemURL} = req.body;
  try {
    const item = await Item.create({itemName, itemPrice, itemURL})
    return res.json(item);
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: error.message })
  }
})

//gets all items that are tracked
app.get('/items', async (req, res) => {
  try {
    const items = await Item.findAll();
    return res.json(items);
  } catch (err) {
    console.error(error)
    return res.status(500).json({ error: error.message })
  }
})

//gets item by uuid
app.get('/items/:uuid', async (req, res) => {
  const uuid = req.params.uuid;
  try {
    const item = await Item.findOne({ 
        where: {uuid},
     });
    return res.json(item);
  } catch (err) {
    console.error(error)
    return res.status(500).json({ error: error.message })
  }
})

//deletes item by uuid
app.delete('/items/:uuid', async (req, res) => {
  const uuid = req.params.uuid;
  try {
    const item = await Item.destroy({ 
        where: {uuid},
     });
    return res.status(200).send();
  } catch (err) {
    console.error(error)
    return res.status(500).json({ error: error.message })
  }
})


app.listen(5000, async ()=>{
  console.log("server is listening on port 5000");
  await sequelize.sync({force: true});
  //await sequelize.authenticate(); //connects to the db rather than writing over it
  console.log("Database synced")
})
