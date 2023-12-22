import './sass/LoginPage.scss';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = (props: any) => {
    const navigate = useNavigate();
    const { setCookie } = props;
    const [userID, setUserID] = useState<string>("");
    const [userPassword, setUserPassword] = useState<string>("");
    const [loginPageState, setLoginPageState] = useState<string>("sign in");
    const [existsID, setExistsID] = useState<boolean>(true);

    const checkID = async () => {
        try {
            const response = await axios.get('http://kkms4001.iptime.org:10098/id/check', {
                params: {
                    userID,
                }
            });
            const resData = response.data;
            setExistsID(resData);
            if (resData) {
                alert("중복된 아이디입니다.");
            } else {
                alert("사용 가능한 아이디입니다.");
            }
        } catch (e) {
            console.error(e);
        }
    };

    const createID = async () => {
        if (existsID) {
            alert("ID 중복 확인을 해주세요.");
            return ;
        }
        try {
            const response = await axios.post('http://kkms4001.iptime.org:10098/signUp', {
                params: {
                    userID,
                    userPassword,
                }
            });
            const resData = response.data;
            setExistsID(true);
            setUserID("");
            setUserPassword("");
            alert("가입에 성공하였습니다!");
            setLoginPageState("sign in")
        } catch (e) {
            console.error(e);
        }
    };

    const userLogin = async () => {
        try {
            const response = await axios.post('http://kkms4001.iptime.org:10098/signIn', {
                params: {
                    userID,
                    userPassword,
                }
            });
            const resData = response.data;
            if (resData.loginPossible) {
                console.log(resData.userNo);
                setCookie("chattingID", userID);
                setCookie("userNo", resData.userNo);
                navigate("/Main", { replace: true });
            } else {
                alert("id, password를 다시 확인 해주세요.");
            }
            console.log(resData);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <section className="LoginPage" id="loginPage">
            {(() => {
                return loginPageState === "sign in" ? (
                    <>
                        <div id="idBox">
                            <input type="text" placeholder="ID" value={userID} onChange={(e) => {
                                if (e.target.value.length > 15) {return; }
                                setUserID(e.target.value)
                            }}/>
                            <input type="password" placeholder="Password" value={userPassword} onChange={(e) => {
                                if (e.target.value.length > 15) {return; }
                                setUserPassword(e.target.value);
                            }}/>
                        </div>
                        <div id="buttonBox">
                            <button onClick={userLogin}> Sign in </button>
                            <button onClick={() => {
                                setUserID("");
                                setUserPassword("");
                                setLoginPageState("sign up");
                            }}>Sign up</button>
                        </div>
                    </>
                ) : (<>
                    <div id="idBox">
                        <div>
                            <input type="text" placeholder="ID" value={userID} onChange={(e) => {
                                if (e.target.value.length > 15) {return; }
                                setUserID(e.target.value);
                                setExistsID(true);
                            }}/>
                            <button onClick={checkID}>중복 확인</button>
                        </div>
                        <input type="password" placeholder="Password" value={userPassword} onChange={(e) => {
                            if (e.target.value.length > 15) {return; }
                            setUserPassword(e.target.value)
                        }}/>
                    </div>
                    <div id="buttonBox">
                        <button onClick={createID}>Sign up</button>
                    </div>
                </>);
            })()}
        </section>
    );
}

export default LoginPage;