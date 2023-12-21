import './sass/UserPage.scss';
import { useState } from 'react';

const UserPage = () => {
    const [selectFlag, setSelectFlag] = useState("sortName");

    return (
        <div className='UserPage' id="usersBox">
            <div id="chooseSortBox">
                <button className={`${selectFlag === "sortName" ? "selectFlag" : ""} sortName`}
                        onClick={() => {
                            setSelectFlag("sortName");
                        }}
                    >이름순</button>
                <button className={`${selectFlag === "sortDate" ? "selectFlag" : ""} sortDate`}
                        onClick={() => {
                            setSelectFlag("sortDate");
                        }}               
                >날짜순</button>
                <button className={`${selectFlag === "sortFriend" ? "selectFlag" : ""} sortFriend`}
                        onClick={() => {
                            setSelectFlag("sortFriend");
                        }}
                >친구순</button>
            </div>
            <div id="userList">
                <div className="userBox">
                    <div className="userName">
                        <p>ID: </p>
                        <p>Game </p>
                    </div>
                    <div className="userCreationDate">
                        <p>가입날짜: </p>
                        <p>2019-10-02</p>
                    </div>
                    <div className="friendsNumber">
                        <p>친구수:</p>
                        <p>12</p>
                    </div>
                    <div className="buttonBox">
                        <button>친구 요청</button>
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
                    <div className="friendsNumber">
                        <p>친구수:</p>
                        <p>12</p>
                    </div>
                    <div className="buttonBox cancelRequest">
                        <button>요청 취소</button>
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
                    <div className="friendsNumber">
                        <p>친구수:</p>
                        <p>12</p>
                    </div>
                    <div className="buttonBox"></div>
                </div>
            </div>
        </div>
    );
}

export default UserPage;