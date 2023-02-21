"use strict";

const express = require("express");
const { sequelize, Restaurant, ValidationError } = require("./sequelize");

const app = express();
app.set("json spaces", "\t");

app.use(express.json());

app.get("/restaurants", async (_req, res, next) => {
	try {
		const restaurants = await Restaurant.findAll();
		res.send(restaurants);
	} catch (err) {
		next(err);
		res.status(500).send();
	}
});

app.post("/restaurants", async (req, res, next) => {
	const { name } = req.body;

	try {
		const restaurant = await Restaurant.create({ name });
		res.status(201).send(restaurant);
	} catch (err) {
		next(err);
		const statusCode = err instanceof ValidationError ? 400 : 500;
		res.status(statusCode).send();
	}
});

app.all("/restaurants/:id", async (req, res, next) => {
	const { id } = req.params;

	try {
		const restaurant = await Restaurant.findByPk(id);
		req.restaurant = restaurant;
		next();
	} catch (err) {
		next(err);
		res.status(500).send();
	}
});

app.get("/restaurants/:id", async (req, res) => {
	if (req.restaurant) {
		res.send(req.restaurant);
	} else {
		res.status(404).send();
	}
});

app.put("/restaurants/:id", async (req, res, next) => {
	const { name } = req.body;

	try {
		if (req.restaurant) {
			req.restaurant = await req.restaurant.update({ name });
			res.send(req.restaurant);
		} else {
			req.restaurant = await Restaurant.create({ name });
			res.status(201).send(req.restaurant);
		}
	} catch (err) {
		next(err);
		const statusCode = err instanceof ValidationError ? 400 : 500;
		res.status(statusCode).send();
	}
});

app.delete("/restaurants/:id", async (req, res, next) => {
	if (!req.restaurant) {
		res.status(404).send();
		return;
	}

	try {
		req.restaurant = await req.restaurant.destroy();
		res.status(204).send();
	} catch (err) {
		next(err);
		res.status(500).send();
	}
});

const port = 3000;

app.listen(port, async () => {
	try {
		await sequelize.authenticate();
		console.log(`Listening at http://localhost:${port}`);
	} catch (err) {
		console.error(err);
	}
});
