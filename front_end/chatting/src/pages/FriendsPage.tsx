import './sass/FriendsPage.scss';
import { useState, useEffect } from 'react';
import axios from 'axios';
import $ from "jquery";

const AddFriendInboxList = (props:any) => {
    const {userList, flags, userNo, setUserListFlag} = props;

    const friendRequestAccept = async (userOneNo:number, userTwoNo:number) => {
        try {
            const response = await axios.put('http://kkms4001.iptime.org:10098/friend/request', {
                params: {
                    userOneNo, 
                    userTwoNo
                }
            });
            const resData:boolean = response.data;
            if (resData) {
                setUserListFlag(Math.random());
                alert("요청을 수락하였습니다.");
            }
        } catch (e) {
            console.error(e);
        }
    };
    const declineFriendRequest = async (userOneNo:number, userTwoNo:number) => {
        try {
            const response = await axios.delete('http://kkms4001.iptime.org:10098/friend/request', {
                params: {
                    userOneNo, 
                    userTwoNo
                }
            });
            const resData:boolean = response.data;
            if (resData) {
                setUserListFlag(Math.random());
                alert("요청을 거절하였습니다.");
            }
        } catch (e) {
            console.error(e);
        }
    };

    const makeUserBox = userList.map((v:{no:number, id:string, creationDate:string}) => {
        const creationDate = new Date(v.creationDate);
        return (
            <div className="userBox" key={Math.random()}>
                <div className="userName">
                    <p>ID: </p>
                    <p>{v.id}</p>
                </div>
                <div className="userCreationDate">
                    <p>가입날짜: </p>
                    <p>{creationDate.getFullYear()}-{`0${creationDate.getMonth()}`.slice(-2)}-{`0${creationDate.getDate()}`.slice(-2)}</p>
                </div>
                <div className="buttonBox">
                    <button onClick={() => friendRequestAccept(v.no, userNo)}>수락</button>
                    <button onClick={() => declineFriendRequest(v.no, userNo)}>거절</button>
                </div>
            </div>
        )
    });

    return (
        <div className="addFriendInboxList">
            {makeUserBox}
        </div>
    );
}

const FriendsList = (props: any) => {
    const { setOnChatting, friendsList, setUserListFlag, userNo, setFriend, setFriendName, ws, nowFriend } = props;
    const deleteFriend = async (userOneNo:number, userTwoNo:number) => {
        try {
            const response = await axios.delete('http://kkms4001.iptime.org:10098/friend', {
                params: {
                    userOneNo, 
                    userTwoNo
                }
            });
            const resData:boolean = response.data;
            if (resData) {
                setUserListFlag(Math.random());
                alert("친구를 삭제 하였습니다.");
            }
        } catch (e) {
            console.error(e);
        }
    };
    const submitChatting = (reNo:number) => {
        const submitData = {type:"friendChatOpen", sender:userNo, recipient:reNo, time:new Date()};
        ws.send(JSON.stringify(submitData));
    };

    const makeUserBox = friendsList.map((v:{no:number, id:string, creationDate:string}) => {
        const creationDate = new Date(v.creationDate);
        return (
            <div className="userBox" key={Math.random()}>
                <div className="userName">
                    <p>ID: </p>
                    <p>{v.id}</p>
                </div>
                <div className="userCreationDate">
                    <p>가입날짜: </p>
                    <p>{creationDate.getFullYear()}-{`0${creationDate.getMonth()}`.slice(-2)}-{`0${creationDate.getDate()}`.slice(-2)}</p>
                </div>
                <div className="buttonBox">
                    <button onClick={() => deleteFriend(userNo, v.no)} >친구 삭제</button>
                    <button onClick={() => {submitChatting(v.no); setOnChatting(true); setFriend(v.no); setFriendName(v.id);}}>DM</button>
                </div>
            </div>
        )
    });

    return (
        <div className="friendsList">
            {makeUserBox}
        </div>
    );
}

const ChattingModal = (props:any) => {
    const { setOnChatting, nowFriend, nowFriendName, ws, chatting, userNo} = props;
    const [chatList, setChatList] = chatting;
    const [submitText, setSubmitText] = useState("");

    const submitChatting = () => {
        const submitData = {type:"friendChat", sender:userNo, recipient:nowFriend, text:submitText, time:new Date()};
        ws.send(JSON.stringify(submitData));
        setSubmitText("");
    };

    useEffect(() => {
        const scrollToBottom = $(".chattingBottomBox")[0].scrollHeight;
        $(".chattingBottomBox").scrollTop(scrollToBottom === undefined ? 0 : scrollToBottom);
    }, [chatList]);

    return (
        <div className='ChattingModal'>
            <section>
                <article className='chattingArticle'>
                    <div className='chattingTopBox'>
                        <p>{nowFriendName}</p>
                        <button onClick={() => setOnChatting(false)}>나가기</button>
                    </div>
                    <div className='chattingBottomBox'>
                        {chatList.map((chat:any) => {
                            if (chat.type === "friendChatOpen") { return ;}
                            if (chat.sender === userNo) {
                                return <div className='myChat' key={Math.random()}>
                                    <p className='text'>{chat.text}</p>
                                    <p className='time'>{`${("0"+new Date(chat.time).getHours()).slice(-2)}:${
                                        ("0"+new Date(chat.time).getMinutes()).slice(-2)}`}</p>
                                </div>
                            } else if (chat.recipient === userNo) {
                                return <div className='chat' key={Math.random()}>
                                    <p className='userID'>{nowFriendName}</p>
                                    <p className='text'>{chat.text}</p>
                                    <p className='time'>{`${("0"+new Date(chat.time).getHours()).slice(-2)}:${
                                        ("0"+new Date(chat.time).getMinutes()).slice(-2)}`}</p>
                                </div>
                            }
                        })}

                    </div>
                </article>
                <article className='submitArticle'>
                    <textarea id="submitText" onChange={(e) => setSubmitText(e.target.value)}
                    placeholder="채팅 내용을 입력해 주세요." value={submitText}></textarea>
                    <button id="submitButton" onClick={submitChatting}>전송</button>
                </article>
            </section>
        </div>
    );
}

const FriendsPage = (props:any) => {
    const {userNo, ws, chatting} = props;
    const [userListFlag, setUserListFlag] = useState(Math.random());
    const [onChatting, setOnChatting] = useState(false);
    const [selectFlag, setSelectFlag] = useState("addFriendInbox");
    const [nowFriend, setFriend] = useState(0);
    const [nowFriendName, setFriendName] = useState("");
    const [userList, setUserList] = useState<{no:number, id:string, creationDate:string}[]>([]);
    const [friendsList, setFriendsList] = useState<{no:number, id:string, creationDate:string}[]>([]);

    useEffect(() => {
            (async () => {
                try {
                    const response = await axios.get('http://kkms4001.iptime.org:10098/friend/request', {
                        params: {
                            userNo
                        }
                    });
                    const resData: any = response.data;
                    setUserList(resData);
                } catch (e) {
                    console.error(e);
                }
            })();
    }, [userListFlag]);
    useEffect(() => {
            (async () => {
                try {
                    const response = await axios.get('http://kkms4001.iptime.org:10098/friend', {
                        params: {
                            userNo
                        }
                    });
                    const resData: any = response.data;
                    setFriendsList(resData);
                } catch (e) {
                    console.error(e);
                }
            })();
    }, [userListFlag]);
    return (
        <div className='FriendsPage'>
            <div id="chooseSortBox">
                <button className={`${selectFlag === "addFriendInbox" ? "selectFlag" : ""} addFriendInbox`}
                        onClick={() => {
                            setSelectFlag("addFriendInbox");
                        }}>수신함</button>
                <button className={`${selectFlag === "friendsList" ? "selectFlag" : ""} friendsList`}
                        onClick={() => {
                            setSelectFlag("friendsList");
                        }}>목록</button>
            </div>
            {selectFlag === "addFriendInbox" ? 
                <AddFriendInboxList userNo={userNo} setUserListFlag={setUserListFlag} userList={userList}/> :
                <FriendsList ws={ws} nowFriend={nowFriend} setFriendName={setFriendName} setFriend={setFriend} userNo={userNo} setUserListFlag={setUserListFlag} friendsList={friendsList} setOnChatting={setOnChatting}/>
            }
            {onChatting ? <ChattingModal userNo={userNo} ws={ws} chatting={chatting} nowFriend={nowFriend} nowFriendName={nowFriendName} setOnChatting={setOnChatting}/> : <></>}
        </div>
  );
}

export default FriendsPage;