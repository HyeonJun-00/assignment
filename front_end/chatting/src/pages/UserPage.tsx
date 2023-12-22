import './sass/UserPage.scss';
import { useState, useEffect } from 'react';
import axios from 'axios';

const UserListContent = (props: any) => {
    const { userList, userNo, setUserList } = props;

    const friendRequest = async (userOneNo:number, userTwoNo:number) => {
        try {
            const response = await axios.post('http://kkms4001.iptime.org:10098/friend', {
                params: {
                    userOneNo,
                    userTwoNo,
                }
            });
            const resData:boolean = response.data;
            if (resData) {
                setUserList([]);
                alert("친구 신청에 성공하였습니다!");
            }
        } catch (e) {
            console.error(e);
        }
    };
    const cancelRequest = async (userOneNo:number, userTwoNo:number) => {
        try {
            const response = await axios.delete('http://kkms4001.iptime.org:10098/friend', {
                params: {
                    userOneNo,
                    userTwoNo,
                }
            });
            const resData:boolean = response.data;
            if (resData) {
                setUserList([]);
                alert("친구 신청 취소에 성공하였습니다.");
            }
        } catch (e) {
            console.error(e);
        }
    };


    return userList.map((user: any) => {
        const creationDate = new Date(user.creation_date);
        let friendButton = <></>;

        if (user.userRelationship === 'notFriends') {
            friendButton = (
                <div className="buttonBox">
                    <button onClick={(e) => friendRequest(userNo, user.no)}>친구 신청</button>
                </div>);
        } else if (user.userRelationship === "" || user.userRelationship === "friend") {
            friendButton = (<div className="buttonBox"></div>);
        } else {
            friendButton = (
                <div className="buttonBox cancelRequest">
                    <button onClick={(e) => cancelRequest(userNo, user.no)}>요청 취소</button>
                </div>);
        }
        return (
            <div className="userBox" key={Math.random()}>
                <div className="userName">
                    <p>ID: </p>
                    <p>{user.id}</p>
                </div>
                <div className="userCreationDate">
                    <p>가입날짜: </p>
                    <p>{creationDate.getFullYear()}-{`0${creationDate.getMonth()}`.slice(-2)}-{`0${creationDate.getDate()}`.slice(-2)}</p>
                </div>
                <div className="friendsNumber">
                    <p>친구수:</p>
                    <p>{user.friendsNumber}</p>
                </div>
                {friendButton}
            </div>);
    })
}

const UserPage = (props: any) => {
    const { userID, userNo } = props;
    const [selectFlag, setSelectFlag] = useState<string>("sortDate");
    const [userList, setUserList] = useState<any>([]);

    useEffect(() => {
        if (userList.length === 0) {
            (async () => {
                try {
                    const response = await axios.get('http://kkms4001.iptime.org:10098/users', {
                        params: {
                            userID,
                            userNo
                        }
                    });
                    const resData: any = response.data;
                    setUserList(resData);
                } catch (e) {
                    console.error(e);
                }
            })();
        }
    }, [userList]);

    return (
        <div className='UserPage' id="usersBox">
            <div id="chooseSortBox">
                <button className={`${selectFlag === "sortDate" ? "selectFlag" : ""} sortDate`}
                    onClick={() => {
                        const sortList = userList.sort((a: any, b: any) => a.no - b.no);
                        setUserList(sortList);
                        setSelectFlag("sortDate");
                    }}
                >날짜순</button>
                <button className={`${selectFlag === "sortName" ? "selectFlag" : ""} sortName`}
                    onClick={() => {
                        const sortList = userList.sort((a: any, b: any) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
                        console.log(sortList, userList);
                        setUserList(sortList);
                        setSelectFlag("sortName");
                    }}
                >이름순</button>
                <button className={`${selectFlag === "sortFriend" ? "selectFlag" : ""} sortFriend`}
                    onClick={() => {
                        const sortList = userList.sort((a: any, b: any) => b.friendsNumber - a.friendsNumber);
                        setUserList(sortList);
                        setSelectFlag("sortFriend");
                    }}
                >친구순</button>
            </div>
            <div id="userList">
                <UserListContent setUserList={setUserList} userNo={userNo} userList={userList}></UserListContent>
            </div>
        </div>
    );
}

export default UserPage;