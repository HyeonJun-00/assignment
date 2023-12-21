"use strict";
// const DBConnect = require(`./config/DBConnect`);
// const con = mysql.createConnection(DBConnect);
// const mysql = require(`mysql`);
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require('dotenv').config();
const mysql = require('mysql2');
const connection = mysql.createConnection(process.env.DATABASE_URL);
console.log('Connected to PlanetScale!');
connection.end();
const cors = require('cors');
const app = (0, express_1.default)();
const port = 10098;
app.use(cors({
    origin: true,
    credentials: true,
}));
app.get(`/`, (req, res) => {
    res.send("im get");
    res.end();
});
app.patch(`/`, (req, res) => {
    res.send("im path");
    res.end();
});
app.delete(`/`, (req, res) => {
    res.send("im delete");
    res.end();
});
app.post(`/`, (req, res) => {
    res.send("im post");
    res.end();
});
app.listen(port, () => {
    console.log(`connected ${port} port!`);
});
