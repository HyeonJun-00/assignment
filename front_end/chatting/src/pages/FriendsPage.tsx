import './sass/FriendsPage.scss';
import { useState, useEffect } from 'react';
import axios from 'axios';

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
    const { setOnChatting, friendsList, setUserListFlag, userNo } = props;
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
                    <button onClick={() => setOnChatting(true)}>DM</button>
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
    const { setOnChatting } = props;
    
    return (
        <div className='ChattingModal'>
            <section>
                <article className='chattingArticle'>
                    <div className='chattingTopBox'>
                        <p>짜장면</p>
                        <button onClick={() => setOnChatting(false)}>나가기</button>
                    </div>
                    <div className='chattingBottomBox'>
                        <div className='myChat'>
                            <p className='text'> 머하고 있어??</p>
                            <p className='time'>15:11</p>
                        </div>
                        <div className='chat'>
                            <p className='userID'>짜장면</p>
                            <p className='text'> 1번 채팅방에 있음 ㅋㅋ</p>
                            <p className='time'>15:12</p>
                        </div>
                        <div className='myChat'>
                            <p className='text'>ㅇㅋ 걸로갈게</p>
                            <p className='time'>15:14</p>
                        </div>
                    </div>
                </article>
                <article className='submitArticle'>
                    <textarea id="submitText" placeholder="채팅 내용을 입력해 주세요."></textarea>
                    <button id="submitButton">전송</button>
                </article>
            </section>
        </div>
    );
}

const FriendsPage = (props:any) => {
    const {userNo} = props;
    const [userListFlag, setUserListFlag] = useState(Math.random());
    const [onChatting, setOnChatting] = useState(false);
    const [selectFlag, setSelectFlag] = useState("addFriendInbox");
    const [userList, setUserList] = useState<{id:string, creationDate:string}[]>([]);
    const [friendsList, setFriendsList] = useState<{id:string, creationDate:string}[]>([]);
    const friendChatting = onChatting ? <ChattingModal setOnChatting={setOnChatting}/> : <></>;

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
            <FriendsList userNo={userNo} setUserListFlag={setUserListFlag} friendsList={friendsList} setOnChatting={setOnChatting}/>
            }
            {friendChatting}
        </div>
  );
}

export default FriendsPage;