import './sass/FriendsPage.scss';
import { useState } from 'react';

const FriendsPage = () => {
    const [selectFlag, setSelectFlag] = useState("addFriendInbox");
    
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
            <div className="addFriendInboxList">
                <div className="userBox">
                    <div className="userName">
                        <p>ID: </p>
                        <p>Game </p>
                    </div>
                    <div className="userCreationDate">
                        <p>가입날짜: </p>
                        <p>2019-10-02</p>
                    </div>
                    <div className="buttonBox">
                        <button>수락</button>
                        <button>거절</button>
                    </div>
                </div>
                <div className="userBox">
                    <div className="userName">
                        <p>ID: </p>
                        <p>Game </p>
                    </div>
                    <div className="userCreationDate">
                        <p>가입날짜: </p>
                        <p>2019-10-02</p>
                    </div>
                    <div className="buttonBox">
                        <button>수락</button>
                        <button>거절</button>
                    </div>
                </div>
                <div className="userBox">
                    <div className="userName">
                        <p>ID: </p>
                        <p>Game </p>
                    </div>
                    <div className="userCreationDate">
                        <p>가입날짜: </p>
                        <p>2019-10-02</p>
                    </div>
                    <div className="buttonBox">
                        <button>수락</button>
                        <button>거절</button>
                    </div>
                </div>
            </div>
        </div>
  );
}

export default FriendsPage;