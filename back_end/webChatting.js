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
const cors = require('cors');
const app = (0, express_1.default)();
const port = 10098;
app.use(cors({
    origin: true,
    credentials: true,
}));
//-- sign up start
app.get(`/id/check`, (req, res) => {
    const { userID } = req.query;
    const connection = mysql.createConnection(process.env.DATABASE_URL);
    const sqlGetID = `SELECT * FROM User WHERE user_id = '${userID}';`;
    let existsID = true;
    connection.query(sqlGetID, (err, result) => {
        existsID = result.length !== 0;
        res.send(existsID);
        res.end();
    });
    connection.end();
});
app.post(`/user`, (req, res) => {
    const { userID, userPassword } = req.query;
    const sqlCreateUser = `INSERT INTO User (user_id, user_password) VALUES ('${userID}', '${userPassword}');`;
    const connection = mysql.createConnection(process.env.DATABASE_URL);
    connection.query(sqlCreateUser, (err, result) => { });
    connection.end();
    res.status(200);
    res.end();
});
//-- sign up end
//-- sign in start
//-- sign in end
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
