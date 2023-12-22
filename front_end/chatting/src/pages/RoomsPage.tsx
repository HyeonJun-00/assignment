import "./sass/RoomsPage.scss"
import { useEffect, useState } from 'react';
import $ from "jquery";

const RoomChattingModal = (props:any) => {
    const {setDisplay:[chattingModal, setChattingModal], chatting,  
        ws, userID, nowRoom, numberParticipants, userList} = props;
    const [chatList, setChatList] = chatting;
    const [submitText, setSubmitText] =useState("");
    
    const submitChatting = (text:string, ws:WebSocket) => {
        const submitData = {type: "chat", room: nowRoom, data : {user: userID, chat: text, time: new Date()}};
        ws.send(JSON.stringify(submitData));
        setSubmitText("");
    };

    const userExitRoom = (roomNumber:number, ws:WebSocket) => {
        const submitData = {type: "userOut", room: roomNumber, user: userID};
        ws.send(JSON.stringify(submitData));
        setChattingModal("");
    };

    useEffect(() => {
        const scrollToBottom = $("#chattingWrapBox")[0].scrollHeight;
        $("#chattingWrapBox").scrollTop(scrollToBottom === undefined ? 0 : scrollToBottom);
    }, [chatList])

    return (
        <div className={chattingModal} id="roomChattingModal">
            <section className="roomChattingLeftSection">
                <article>
                    <div className="roomNumberBox">
                        <p>방 번호:</p>
                        <p>{nowRoom}</p>
                    </div>
                    <div id="chattingWrapBox">
                        {chatList.map((v:any) => {
                            if (v.type === 'userIn') {
                                return <div className='userIn' key={Math.random()}>
                                    <p className='userID'>{v.user}</p>
                                </div>
                            } else if (v.type === "userOut") {
                                return <div className='userOut' key={Math.random()}>
                                    <p className='userID'>{v.user}</p>
                                </div>
                            } else if (v.type === "chat" && v.data.user === userID) {
                                return <div className='myChat' key={Math.random()}>
                                    <p className='text'>{v.data.chat}</p>
                                    <p className='time'>15:11</p>
                                </div>
                            } else {
                                return <div className='chat' key={Math.random()}>
                                    <p className='userID'>{v.user}</p>
                                    <p className='text'> {v.data.chat}</p>
                                    <p className='time'>15:12</p>
                                </div>
                            }
                        })}
                    </div>
                </article>
                <article>
                    <textarea id="submitText" placeholder="채팅 내용을 입력해 주세요." 
                        onKeyDown={(e) => {
                           if (e.key === "Enter") {
                               submitChatting(submitText, ws);
                                e.preventDefault();
                           }
                        }}
                        onChange={(e) => setSubmitText(e.target.value)} value={submitText}></textarea>
                    <button id="submitButton" onClick={() => submitChatting(submitText, ws)}>전송</button>
                </article>
            </section>
            <section className="roomChattingRightSection">
                <article>
                    <div className="peopleNumberBox">
                        <p>참여인원: </p>
                        <p className="peopleNumber">{numberParticipants[`room${nowRoom}`]}</p>
                    </div>
                    <div className="peopleListBox">
                        {userList.map((user:string) => <p key={Math.random()}>{user}</p>)}
                    </div>
                </article>
                <article>
                    <button onClick={() => userExitRoom(nowRoom, ws)}>나가기</button>
                </article>
            </section>
        </div>);
}

const RoomsPage = (props:any) => {
    const {numberParticipants, ws, userID, userList, chatting} = props;
    const [chattingModal, setChattingModal] = useState("");
    const [nowRoom, setRoom] = useState(1);

    const userEntersRoom = (roomNumber:number, ws:WebSocket) => {
        const submitData = {type: "userIn", room: roomNumber, user: userID};
        ws.send(JSON.stringify(submitData));
        setRoom(roomNumber);
        setChattingModal("displayFlag");
    }

    return (
        <div className='RoomsPage' id="roomsBox">
            <RoomChattingModal chatting={chatting} userList={userList} numberParticipants={numberParticipants} nowRoom={nowRoom} userID={userID} ws={ws} setDisplay={[chattingModal, setChattingModal]} ></RoomChattingModal>
            <div id="roomList">
                <div className="room">
                    <div className="peopleNumberBox">
                        <p>참여인원 수: </p>
                        <p>{numberParticipants.room1}</p>
                    </div>
                    <div className="roomNumberBox">
                        <p>방 번호: </p>
                        <p>1</p>
                    </div>
                    <div className="buttonBox">
                        <button onClick={() => userEntersRoom(1, ws)}>입장</button>
                    </div>
                </div>
                <div className="room">
                    <div className="peopleNumberBox">
                        <p>참여인원 수: </p>
                        <p>{numberParticipants.room2}</p>
                    </div>
                    <div className="roomNumberBox">
                        <p>방 번호: </p>
                        <p>2</p>
                    </div>
                    <div className="buttonBox">
                        <button onClick={() => userEntersRoom(2, ws)}>입장</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RoomsPage;