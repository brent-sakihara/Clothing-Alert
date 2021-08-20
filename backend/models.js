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

const User = sequelize.define(
  "users",
  {
    //model for users
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userEmail: {
      //attributes are the columns of the table
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
);

const Item = sequelize.define(
  "items",
  {
    //model for clothing items
    // Model attributes are defined here
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    itemName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    itemPrice: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    itemURL: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    storeName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
);

User.hasMany(Item, {
  foreignKey: {
    type: DataTypes.UUID,
    allowNull: false
  }
});
Item.belongsTo(User);


/*
//authentification test
sequelize.authenticate()
.then(() => console.log('Database connected'))
.catch(err => console.log(err));
*/

module.exports = {User, Item, sequelize}