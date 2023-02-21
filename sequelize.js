"use strict";

const path = require("path");
const { Sequelize, DataTypes, ValidationError } = require("sequelize");

const sequelize = new Sequelize({
	dialect: "sqlite",
	storage: path.join(__dirname, "db.sqlite"),
});

const Restaurant = sequelize.define("Restaurant", {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
});

module.exports = exports = { sequelize, Restaurant, ValidationError };
