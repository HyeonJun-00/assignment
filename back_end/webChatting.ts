import express, { Express, Request, Response } from 'express';
import { Connection } from 'mysql2/typings/mysql/lib/Connection';
require('dotenv').config();

const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const app:Express = express();
const port:number = 10098;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors({ 
    origin: true,
    credentials: true,
}));

//--> sign up page start
app.get(`/id/check`, (req:Request, res:Response) => {       // id 중복 체크
    const {userID}:any = req.query; 
    const connection:Connection = mysql.createConnection({uri:process.env.DATABASE_URL});
    const sqlGetID:string = `SELECT * FROM User WHERE user_id = ?;`;
    let existsID:boolean = true;

    connection.query(sqlGetID, [userID], (err: any, result: any) => {
        existsID = result.length !== 0;
        res.send(existsID);
        res.end();
    });
    connection.end();
});

app.post(`/signUp`, (req:Request, res:Response) => {          // 회원 가입
    const {userID, userPassword}:any = req.body.params;
    const sqlCreateUser:string = `INSERT INTO User (user_id, user_password, user_creation_date) VALUES
     ( ?, ?, ?);`;
    const connection:Connection = mysql.createConnection(process.env.DATABASE_URL)
    const nowKst = new Date(new Date().setHours(new Date().getHours() + 9)).toISOString().slice(0, 19).replace('T', ' ');

    connection.query(sqlCreateUser, [userID, userPassword, nowKst], (err: any, result: any) => {});
    connection.end();
    res.status(200);
    res.end();
});
//--< sign up page end


//--> sign in page start
app.post(`/signIn`, (req:Request, res:Response) => {          // 회원 로그인
    const {userID, userPassword}:any = req.body.params;
    const sqlCreateUser:string = `SELECT * FROM User WHERE user_id = ? AND user_password = ?;`;
    const connection:Connection = mysql.createConnection(process.env.DATABASE_URL);
    let loginPossible:boolean = false;
    let userNo:number = 0;

    connection.query(sqlCreateUser, [userID, userPassword], (err: any, result: any) => {
        loginPossible = result.length > 0;
        userNo = loginPossible ? result[0].id : 0;
        res.send({loginPossible, userNo});
        res.end();
    });
    connection.end();
});
//--< sign in page end


//--> Users page start
app.get(`/users`, (req: Request, res: Response) => {        // 전체 유저와 친구관계 조회
    type UserRelationship = 'friend' | 'friendRequestReceived' | 'notFriends' | "";
    const { userID, userNo }: any = req.query;
    const connection: Connection = mysql.createConnection({ uri: process.env.DATABASE_URL, multipleStatements: true });
    const sqlGetUser: string = `SELECT * FROM User;`;
    const sqlGetFriend = `SELECT * FROM Friend where acceptance = TRUE;`;
    const sqlUserFriend = `SELECT * FROM Friend WHERE sender_user_id = ? OR recipient_user_id = ?;`;

    connection.query(sqlGetUser + sqlGetFriend + sqlUserFriend, [userNo, userNo], (err: any, result: any) => {
        const userFriend = result[2]
        console.log(userFriend, userID);
        let userList: any = result[0]
            .filter((user: any) => userID !== user.user_id)
            .map((user: any) => {
                let userRelationship:UserRelationship = "notFriends";
                const friendsNumber:number = result[1].reduce((count:number, friend:any) => {
                    return count + (friend.sender_user_id === user.id || friend.recipient_user_id === user.id ? 1 : 0);
                }, 0);
                let i = 0;
                while (userFriend.length > i) {
                    const friend = userFriend[i];
                    console.log(friend);
                    if (friend.sender_user_id === user.id) {
                        userRelationship = friend.acceptance === 1 ? "friend" : "";
                        break ;
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

app.post(`/friend`, (req: Request, res: Response) => {          // 친구 추가
    const {userOneNo, userTwoNo} = req.body.params;
    const connection:Connection = mysql.createConnection(process.env.DATABASE_URL);
    const sqlGetID:string = `
        INSERT INTO Friend (sender_user_id, recipient_user_id)
        VALUES (?, ?);`;

    connection.query(sqlGetID,[userOneNo, userTwoNo]);
    connection.end();
    res.send(true);
    res.end();
});

app.delete(`/friend`, (req: Request, res: Response) => {        // 친구 추가 취소
    const {userOneNo, userTwoNo} = req.query;
    const connection: Connection = mysql.createConnection(process.env.DATABASE_URL);
    const sqlGetID: string = `
        DELETE FROM Friend
        WHERE sender_user_id = ? AND recipient_user_id = ?;
    `;

    connection.query(sqlGetID,[userOneNo, userTwoNo]);
    connection.end();
    res.send(true);
    res.end();
});

//--< Users page end




//--> Friends page start

app.get(`/friend/request`, (req: Request, res: Response) => {   // 친구 요청 확인
    const {userOneNo} = req.query;
    const connection: Connection = mysql.createConnection(process.env.DATABASE_URL);
    const sqlGetID: string = `
        SELECT * FROM User
        WHERE id IN (
          SELECT DISTINCT sender_user_id
          FROM Friend
          WHERE recipient_user_id = ?
        );
    `;

    connection.query(sqlGetID,[userOneNo], (err: any, result: any) => {
        console.log(result);
        res.send(result);
        res.end();
    });
    connection.end();
});

app.put(`/friend/request`, (req: Request, res: Response) => {   // 친구 요청 수락
    const {userOneNo, userTwoNo} = req.body.params;
    const connection: Connection = mysql.createConnection(process.env.DATABASE_URL);
    const sqlGetID: string = `
        UPDATE Friend
        SET acceptance = TRUE
        WHERE sender_user_id = ? AND recipient_user_id = ?;
    `;

    connection.query(sqlGetID,[userOneNo, userTwoNo]);
    connection.end();
    res.send(true);
    res.end();
});


//--< Friends page end


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