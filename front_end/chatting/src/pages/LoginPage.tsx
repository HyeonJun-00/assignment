import './sass/LoginPage.scss';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const LoginPage = () => {
    const [loginPageState, setLoginPageState] = useState<string>("sign in");
    const initContent = loginPageState === "sign in" ? (
        <>
            <div id="idBox">
                <input type="text" placeholder="ID" />
                <input type="password" placeholder="Password" />
            </div>
            <div id="buttonBox">
                <Link to={"/Main"}><button> Sign in </button></Link>
                <button onClick={() => setLoginPageState("sign up")}>Sign up</button>
            </div>
        </>
    ) : (<>
            <div id="idBox">
                <div>
                    <input type="text" placeholder="ID" />
                    <button>중복 확인</button>
                </div>
                <input type="password" placeholder="Password" />
            </div>
            <div id="buttonBox">
                <button onClick={() => setLoginPageState("sign in")}>Sign up</button>
            </div>
        </>)
    
    return (
        <section className="LoginPage" id="loginPage">
            {initContent}
        </section>
  );
}

export default LoginPage;