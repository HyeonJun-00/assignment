// const DBConnect = require(`./config/DBConnect`);
// const con = mysql.createConnection(DBConnect);
// const mysql = require(`mysql`);

import express, { Express, Request, Response } from 'express';
require('dotenv').config()
const mysql = require('mysql2')
const connection = mysql.createConnection(process.env.DATABASE_URL)
console.log('Connected to PlanetScale!')
connection.end()

const cors = require('cors');
const app:Express = express();
const port:number = 10098;

app.use(cors({ 
    origin: true,
    credentials: true,
}));

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