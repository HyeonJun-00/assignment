import express, { Express, Request, Response } from 'express';
import { Connection } from 'mysql2/typings/mysql/lib/Connection';
require('dotenv').config();

const WebSocketServer = require("ws").Server;
const wss = new WebSocketServer({ port: 10097 });
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

class ChatClass {
    private _chattingRoomName: number;
    private _chatSaveList: any[];
    private _wsDictionary: {[key:string]:any};

    constructor(initNumber:number) {
        this._chattingRoomName = initNumber;
        this._chatSaveList = [];
        this._wsDictionary = {};
    }
    get roomNumber() {
        return this._chattingRoomName;
    }
    get chatlist() {
        return this._chatSaveList;
    }
    get users() {
        return Object.keys(this._wsDictionary);
    }
    submitChat(chat:any) {
        this._chatSaveList.push(chat);
        console.log(JSON.stringify(chat));
        if (this._chatSaveList.length > 100) {
            this._chatSaveList.shift();
        }
        for (const user in this._wsDictionary) {
            const chatList = {type:"chatList", data:this._chatSaveList};

            this._wsDictionary[user].send(JSON.stringify(chatList));
        }
    }
    sendUserList() {
        for (const user in this._wsDictionary) {
            this._wsDictionary[user].send(JSON.stringify({type:"userList", room:this._chattingRoomName, data:Object.keys(this._wsDictionary)}));
        }       
    }
    userIn(userName:string, userWs:WebSocket) {
        const chatList = {type:"chatList", data:this._chatSaveList};

        userWs.send(JSON.stringify(chatList));
        this._wsDictionary[userName] = userWs;
        this.sendUserList();
    }
    userOut(userName:string) {
        delete this._wsDictionary[userName];
        this.sendUserList();
    }
}

const chattingRoom = [new ChatClass(1), new ChatClass(2)];
const allUser:{[key:string]:WebSocket} = {};

wss.on("connection", (ws: any, req: any) => {
    const sendPersonnel = () => {
        const personnel = {type:"personnel", data: {room1: chattingRoom[0].users.length, room2: chattingRoom[1].users.length}};
        
        for (const user in allUser) {
            console.log(user);
            allUser[user].send(JSON.stringify(personnel));
        }
    };
    let userName = "";

    ws.on("message", (message: any) => {
        const chatData = JSON.parse(message);
        
        switch (chatData.type) {
            case "open":
                userName = chatData.user;
                allUser[userName] = ws;
                sendPersonnel();
                break ;
            case "userIn":
                userName = chatData.user;
                chattingRoom[chatData.room - 1].userIn(chatData.user, ws);
                chattingRoom[chatData.room - 1].submitChat(chatData);
                sendPersonnel();
                break;
            case "userOut":
                chattingRoom[chatData.room - 1].userOut(chatData.user);
                chattingRoom[chatData.room - 1].submitChat(chatData);
                sendPersonnel();
                break;
            case "chat":
                chattingRoom[chatData.room - 1].submitChat(chatData);
                break ;
            default:
                break;
        }

    });
    ws.addEventListener("close", () => {
        if (userName !== "") {
            chattingRoom.forEach((chat:ChatClass, i:number) => {
                chat.userOut(userName);
                chat.submitChat({type: "userOut", room: i - 1, user: userName});
            });
            delete allUser[userName];
            sendPersonnel();
        }
    });
});
//--> chatting room start
app.get(`/chatting/room`, (req:Request, res:Response) => {       // id 중복 체크
    const {roomNumber} = req.query; 

    res.send();
    res.end();
});

//--< chatting room end

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
    const sqlCheckIdPw:string = `SELECT * FROM User WHERE user_id = ? AND user_password = ?;`;
    const connection:Connection = mysql.createConnection(process.env.DATABASE_URL);
    let loginPossible:boolean = false;
    let userNo:number = 0;

    connection.query(sqlCheckIdPw, [userID, userPassword], (err: any, result: any) => {
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
    const sqlGetFriend:string = `SELECT * FROM Friend where acceptance = TRUE;`;
    const sqlUserFriend:string = `SELECT * FROM Friend WHERE sender_user_id = ? OR recipient_user_id = ?;`;

    connection.query(sqlGetUser + sqlGetFriend + sqlUserFriend, [userNo, userNo], (err: any, result: any) => {
        const userFriend:any = result[2]
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
    const sqlAddFriend:string = `
        INSERT INTO Friend (sender_user_id, recipient_user_id)
        VALUES (?, ?);`;

    connection.query(sqlAddFriend,[userOneNo, userTwoNo]);
    connection.end();
    res.send(true);
    res.end();
});

app.delete(`/friend/request`, (req: Request, res: Response) => { // 친구 추가 취소, 거절
    const {userOneNo, userTwoNo} = req.query;
    const connection: Connection = mysql.createConnection(process.env.DATABASE_URL);
    const sqlDeleteFriend: string = `
        DELETE FROM Friend
        WHERE sender_user_id = ? AND recipient_user_id = ?;
    `;

    connection.query(sqlDeleteFriend,[userOneNo, userTwoNo]);
    connection.end();
    res.send(true);
    res.end();
});

//--< Users page end


//--> Friends page start

app.get(`/friend/request`, (req: Request, res: Response) => {   // 친구 요청 조회
    const {userNo} = req.query;
    const connection: Connection = mysql.createConnection(process.env.DATABASE_URL);
    const sqlGetFriendRequest: string = `
        SELECT * FROM User
        WHERE id IN (
          SELECT DISTINCT sender_user_id
          FROM Friend
          WHERE recipient_user_id = ? AND acceptance = FALSE
        );
    `;

    connection.query(sqlGetFriendRequest, [userNo], (err: any, result: any) => {
        const requestList = result.map((user:any) => ({no:user.id, id:user.user_id, creationDate: user.user_creation_date}));

        res.send(requestList);
        res.end();
    });
    connection.end();
});

app.get(`/friend`, (req: Request, res: Response) => {           // 친구 목록 조회
    const {userNo} = req.query;
    const connection: Connection = mysql.createConnection(process.env.DATABASE_URL);
    const sqlGetFriendList: string = `
        SELECT * FROM User
        WHERE id IN (
          SELECT DISTINCT sender_user_id
          FROM Friend
          WHERE recipient_user_id = ? AND acceptance = TRUE
        
          UNION
        
          SELECT DISTINCT recipient_user_id
          FROM Friend
          WHERE sender_user_id = ? AND acceptance = TRUE
        );
    `;

    connection.query(sqlGetFriendList, [userNo, userNo], (err: any, result: any) => {
        const requestList:any = result.map((user:any) => ({no:user.id, id:user.user_id, creationDate: user.user_creation_date}));

        res.send(requestList);
        res.end();
    });
    connection.end();
});

app.put(`/friend/request`, (req: Request, res: Response) => {   // 친구 요청 수락
    const {userOneNo, userTwoNo} = req.body.params;
    const connection: Connection = mysql.createConnection(process.env.DATABASE_URL);
    const sqlAcceptRequest: string = `
        UPDATE Friend
        SET acceptance = TRUE
        WHERE sender_user_id = ? AND recipient_user_id = ?;
    `;

    connection.query(sqlAcceptRequest,[userOneNo, userTwoNo]);
    connection.end();
    res.send(true);
    res.end();
});

app.delete(`/friend`, (req: Request, res: Response) => {        // 친구 삭제
    const {userOneNo, userTwoNo} = req.query;
    const connection: Connection = mysql.createConnection(process.env.DATABASE_URL);
    const sqlDeleteFriend: string = `
        DELETE FROM Friend
        WHERE (sender_user_id = ? AND recipient_user_id = ?) OR (sender_user_id = ? AND recipient_user_id = ?);
    `;

    connection.query(sqlDeleteFriend,[userOneNo, userTwoNo, userTwoNo, userOneNo]);
    connection.end();
    res.send(true);
    res.end();
});


//--< Friends page end


app.listen( port, () => {
    console.log( `connected ${ port } port!` );
});