import './sass/ContentsPage.scss';
import RoomsPage from './RoomsPage';
import UserPage from './UserPage';
import FriendsPage from './FriendsPage';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';


const ContentsPage = (props: any) => {
  const { removeCookie, userID, userNo} = props;
  const [selectFlag, setSelectFlag] = useState("Rooms");
  const [numberParticipants, setParticipants] = useState({room1:0, room2:0});
  const [ws,] = useState(new WebSocket("ws://kkms4001.iptime.org:10097"));
  const [userList, setUserList] = useState([]);
  const [chatList, setChatList] = useState<any>([]);
  const [chattingModal, setChattingModal] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    ws.onopen = () => {
        const submitData = {type: "open", user: userID};
        ws.send(JSON.stringify(submitData));
    }
    ws.onmessage = (e:any) => {
      const chat = JSON.parse(e.data);

      switch (chat.type) {
        case "personnel":
          setParticipants(chat.data);
          break;
        case "userList":
          setUserList(chat.data);
          break;
        case "chatList":
          setChatList(chat.data);
          break;
      }
    }
    ws.onerror = (err: any) => {
      console.log("Server error message: ", err.data);
    }
  }, []);

  return (
    <section className="ContentsPage">
      <article id="classificationArticle">
        <div>
          <button className={selectFlag === "Rooms" ? "selectFlag" : ""}
            onClick={() => {
              setSelectFlag("Rooms");
            }}>Rooms</button>
          <button className={selectFlag === "Users" ? "selectFlag" : ""}
            onClick={() => {
              if (chattingModal === "") {
                setSelectFlag("Users");
              }
            }}>Users</button>
          <button className={selectFlag === "Friends" ? "selectFlag" : ""}
            onClick={() => {
              if (chattingModal === "") {
                setSelectFlag("Friends");
              }
            }}>Friends</button>
          <button onClick={() => {
            if (chattingModal === "") {
              navigate("/", { replace: true });
              removeCookie("chattingID");
              removeCookie("userNo");
            }
          }}>Logout</button>
        </div>
      </article>
      <article id="contentsArticle">
        {
          {
            "Rooms": <RoomsPage chatting={[chatList, setChatList]} userList={userList} userID={userID} 
              ws={ws} numberParticipants={numberParticipants} chattingModalObj={[chattingModal, setChattingModal]} />,
            "Users": <UserPage userID={userID} userNo={userNo} />,
            "Friends": <FriendsPage ws={ws} chatting={[chatList, setChatList]} userID={userID} userNo={userNo} />,
          }[selectFlag]
        }
      </article>
    </section>
  );
}

export default ContentsPage;