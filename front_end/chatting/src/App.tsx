import './App.scss';
import LoginPage from './pages/LoginPage';
import ContentsPage from './pages/ContentsPage';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useEffect } from 'react';

const App = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['chattingID', "userNo"]);
  const locationPathname = useLocation().pathname;
  const navigate = useNavigate();

  
  useEffect(() => {
    if (cookies["chattingID"] === undefined && locationPathname !== "/") {
      navigate("/", { replace: true });
    } else if (cookies["chattingID"] !== undefined && locationPathname === "/"){
      navigate("/Main", { replace: true });
    }
  }, [locationPathname]);


  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<LoginPage setCookie={setCookie}/>}></Route>
        <Route path='/Main' element={<ContentsPage userNo={cookies["userNo"]} userID={cookies["chattingID"]} removeCookie={removeCookie}/>}></Route>
      </Routes>
    </div>
  );
}

export default App;
