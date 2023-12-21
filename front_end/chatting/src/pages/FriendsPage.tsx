import './sass/FriendsPage.scss';
import { useState } from 'react';


const AddFriendInboxList = () => {
    const textJsonList = [
        { id: "Game", creationDate: "2019-10-02" },
        { id: "짬뽕", creationDate: "2019-10-11" },
    ];
    const makeUserBox = textJsonList.map(v => {
        return (
            <div className="userBox" key={Math.random()}>
                <div className="userName">
                    <p>ID: </p>
                    <p>{v.id}</p>
                </div>
                <div className="userCreationDate">
                    <p>가입날짜: </p>
                    <p>{v.creationDate}</p>
                </div>
                <div className="buttonBox">
                    <button>수락</button>
                    <button>거절</button>
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
    const { setOnChatting } = props;
    const textJsonList = [
        { id: "짜장면", creationDate: "2019-10-03" },
    ];

    const makeUserBox = textJsonList.map(v => {
        return (
            <div className="userBox" key={Math.random()}>
                <div className="userName">
                    <p>ID: </p>
                    <p>{v.id}</p>
                </div>
                <div className="userCreationDate">
                    <p>가입날짜: </p>
                    <p>{v.creationDate}</p>
                </div>
                <div className="buttonBox">
                    <button>친구 삭제</button>
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

const FriendsPage = () => {
    const [onChatting, setOnChatting] = useState(false);
    const [selectFlag, setSelectFlag] = useState("addFriendInbox");
    const [nowContentPage, setContentPage] = useState(<AddFriendInboxList />);
    const friendChatting = onChatting ? <ChattingModal setOnChatting={setOnChatting}/> : <></>;

    return (
        <div className='FriendsPage'>
            <div id="chooseSortBox">
                <button className={`${selectFlag === "addFriendInbox" ? "selectFlag" : ""} addFriendInbox`}
                        onClick={() => {
                            setContentPage(<AddFriendInboxList/>);
                            setSelectFlag("addFriendInbox");
                        }}>수신함</button>
                <button className={`${selectFlag === "friendsList" ? "selectFlag" : ""} friendsList`}
                        onClick={() => {
                            setContentPage(<FriendsList setOnChatting={setOnChatting}/>);
                            setSelectFlag("friendsList");
                        }}>목록</button>
            </div>
            {nowContentPage}
            {friendChatting}
        </div>
  );
}

export default FriendsPage;