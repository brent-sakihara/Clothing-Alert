const { Sequelize, DataTypes, Model, Op } = require("sequelize");

const sequelize = new Sequelize(
  "clothing_prices_db",
  "postgres",
  "BSaki@1230",
  {
    host: "localhost",
    port: 5432,
    dialect: "postgres",
    omitNull: true,
    /*pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },*/
  }
);

const Item = sequelize.define(
  "items",
  {
    //model for clothing items
    // Model attributes are defined here
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    itemName: {
      //attributes are the columns of the table
      type: DataTypes.STRING,
      allowNull: false,
    },
    itemPrice: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    itemURL: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
);

/*
async function storeItem(url) {
  const numberofInstances = await Item.count({
    where: {
      ItemURL: {
        [Op.eq]: url,
      },
    },
  });
  console.log(
    `There are ${numberofInstances} items with the url passed into this function`
  );
  if (numberofInstances == 30) {
    const oldestInstance = await findOne({ where: { itemURL: url } });
    await Item.destroy(oldestInstance);
  }
  const newItem = await Item.create({
    itemName: "example",
    itemPrice: "$100",
    itemURL: url,
  });
  console.log("Item stored!");
}

async function createItem() {
  const shirt = await Item.create({
    itemName: "grey shirt",
    itemPrice: "$5.99",
    itemURL: "https:://shirts.com",
  });
  console.log("The shirt's auto-generated ID:", shirt.id);
}

async function deleteItem() {
  await Item.destroy({ where: { itemName: "grey shirt" } });
  console.log("Deleted all grey shirts from table");
}
*/

/*
//authentification test
sequelize.authenticate()
.then(() => console.log('Database connected'))
.catch(err => console.log(err));
*/


module.exports = {Item, sequelize}