// const DBConnect = require(`./config/DBConnect`);
// const con = mysql.createConnection(DBConnect);
// const mysql = require(`mysql`);

import express, { Express, Request, Response } from 'express';
require('dotenv').config();
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const app:Express = express();
const port:number = 10098;

app.use(cors({ 
    origin: true,
    credentials: true,
}));
app.use(bodyParser.json()) // parse application/json
app.use(bodyParser.urlencoded({extended: false}))

//--> sign up start
app.get(`/id/check`, (req:Request, res:Response) => {       // id 중복 체크
    const {userID} = req.query; 
    const connection = mysql.createConnection(process.env.DATABASE_URL);
    const sqlGetID = `SELECT * FROM User WHERE user_id = '${userID}';`;
    let existsID = true;

    connection.query(sqlGetID, (err: any, result: any) => {
        existsID = result.length !== 0;
        res.send(existsID);
        res.end();
    });
    connection.end();
});

app.post(`/signUp`, (req:Request, res:Response) => {          // 회원 가입
    const {userID, userPassword} = req.body.params;
    const sqlCreateUser = `INSERT INTO User (user_id, user_password) VALUES ('${userID}', '${userPassword}');`;
    const connection = mysql.createConnection(process.env.DATABASE_URL)
    connection.query(sqlCreateUser, (err: any, result: any) => {});
    connection.end();
    res.status(200);
    res.end();
});
//--< sign up end


//--> sign in start
 app.post(`/signIn`, (req:Request, res:Response) => {          // 회원 로그인
    const {userID, userPassword} = req.body.params;
    const sqlCreateUser = `SELECT * FROM User WHERE user_id = '${userID}' AND user_password = '${userPassword}';`;
    const connection = mysql.createConnection(process.env.DATABASE_URL);
    let loginPossible = false;

    connection.query(sqlCreateUser, (err: any, result: any) => {
        loginPossible = result.length > 0;
        res.send(loginPossible);
        res.end();
    });
    connection.end();
});
//--< sign in end


app.get(`/`, (req: Request, res: Response) => {
    res.send("im get");
    res.end();
});
app.patch(`/`, (req: Request, res:Response) => {
    res.send("im path");
    res.end();
});

app.delete(`/`, (req: Request, res:Response) => {
    res.send("im delete");
    res.end();
});

app.post(`/`, (req: Request, res:Response) => {
    res.send("im post");
    res.end();
});

app.listen( port, () => {
    console.log( `connected ${ port } port!` );
});