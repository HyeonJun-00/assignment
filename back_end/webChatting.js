"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require('dotenv').config();
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const app = (0, express_1.default)();
const port = 10098;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({
    origin: true,
    credentials: true,
}));
//--> sign up page start
app.get(`/id/check`, (req, res) => {
    const { userID } = req.query;
    const connection = mysql.createConnection({ uri: process.env.DATABASE_URL });
    const sqlGetID = `SELECT * FROM User WHERE user_id = ?;`;
    let existsID = true;
    connection.query(sqlGetID, [userID], (err, result) => {
        existsID = result.length !== 0;
        res.send(existsID);
        res.end();
    });
    connection.end();
});
app.post(`/signUp`, (req, res) => {
    const { userID, userPassword } = req.body.params;
    const sqlCreateUser = `INSERT INTO User (user_id, user_password, user_creation_date) VALUES
     ( ?, ?, ?);`;
    const connection = mysql.createConnection(process.env.DATABASE_URL);
    const nowKst = new Date(new Date().setHours(new Date().getHours() + 9)).toISOString().slice(0, 19).replace('T', ' ');
    connection.query(sqlCreateUser, [userID, userPassword, nowKst], (err, result) => { });
    connection.end();
    res.status(200);
    res.end();
});
//--< sign up page end
//--> sign in page start
app.post(`/signIn`, (req, res) => {
    const { userID, userPassword } = req.body.params;
    const sqlCreateUser = `SELECT * FROM User WHERE user_id = ? AND user_password = ?;`;
    const connection = mysql.createConnection(process.env.DATABASE_URL);
    let loginPossible = false;
    let userNo = 0;
    connection.query(sqlCreateUser, [userID, userPassword], (err, result) => {
        loginPossible = result.length > 0;
        userNo = loginPossible ? result[0].id : 0;
        res.send({ loginPossible, userNo });
        res.end();
    });
    connection.end();
});
//--< sign in page end
//--> Users page start
app.get(`/users`, (req, res) => {
    const { userID, userNo } = req.query;
    const connection = mysql.createConnection({ uri: process.env.DATABASE_URL, multipleStatements: true });
    const sqlGetUser = `SELECT * FROM User;`;
    const sqlGetFriend = `SELECT * FROM Friend where acceptance = TRUE;`;
    const sqlUserFriend = `SELECT * FROM Friend WHERE sender_user_id = ? OR recipient_user_id = ?;`;
    connection.query(sqlGetUser + sqlGetFriend + sqlUserFriend, [userNo, userNo], (err, result) => {
        const userFriend = result[2];
        console.log(userFriend, userID);
        let userList = result[0]
            .filter((user) => userID !== user.user_id)
            .map((user) => {
            let userRelationship = "notFriends";
            const friendsNumber = result[1].reduce((count, friend) => {
                return count + (friend.sender_user_id === user.id || friend.recipient_user_id === user.id ? 1 : 0);
            }, 0);
            let i = 0;
            while (userFriend.length > i) {
                const friend = userFriend[i];
                console.log(friend);
                if (friend.sender_user_id === user.id) {
                    userRelationship = friend.acceptance === 1 ? "friend" : "";
                    break;
                }
                if (friend.recipient_user_id === user.id) {
                    userRelationship = friend.acceptance === 1 ? "friend" : "friendRequestReceived";
                    break;
                }
                i++;
            }
            return { no: user.id, id: user.user_id, creation_date: user.user_creation_date, friendsNumber, userRelationship };
        });
        res.send(userList);
        res.end();
    });
    connection.end();
});
app.post(`/friend`, (req, res) => {
    const { userOneNo, userTwoNo } = req.body.params;
    const connection = mysql.createConnection(process.env.DATABASE_URL);
    const sqlGetID = `
        INSERT INTO Friend (sender_user_id, recipient_user_id)
        VALUES (?, ?);`;
    connection.query(sqlGetID, [userOneNo, userTwoNo]);
    connection.end();
    res.send(true);
    res.end();
});
app.delete(`/friend`, (req, res) => {
    const { userOneNo, userTwoNo } = req.query;
    const connection = mysql.createConnection(process.env.DATABASE_URL);
    const sqlGetID = `
        DELETE FROM Friend
        WHERE sender_user_id = ? AND recipient_user_id = ?;
    `;
    connection.query(sqlGetID, [userOneNo, userTwoNo]);
    connection.end();
    res.send(true);
    res.end();
});
//--< Users page end
//--> Friends page start
app.get(`/friend/request`, (req, res) => {
    const { userOneNo } = req.query;
    const connection = mysql.createConnection(process.env.DATABASE_URL);
    const sqlGetID = `
        SELECT * FROM User
        WHERE id IN (
          SELECT DISTINCT sender_user_id
          FROM Friend
          WHERE recipient_user_id = ?
        );
    `;
    connection.query(sqlGetID, [userOneNo], (err, result) => {
        console.log(result);
        res.send(result);
        res.end();
    });
    connection.end();
});
app.put(`/friend/request`, (req, res) => {
    const { userOneNo, userTwoNo } = req.body.params;
    const connection = mysql.createConnection(process.env.DATABASE_URL);
    const sqlGetID = `
        UPDATE Friend
        SET acceptance = TRUE
        WHERE sender_user_id = ? AND recipient_user_id = ?;
    `;
    connection.query(sqlGetID, [userOneNo, userTwoNo]);
    connection.end();
    res.send(true);
    res.end();
});
//--< Friends page end
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
