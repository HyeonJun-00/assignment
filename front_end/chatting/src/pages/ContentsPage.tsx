import './sass/ContentsPage.scss';
import RoomsPage from './RoomsPage';
import UserPage from './UserPage';
import FriendsPage from './FriendsPage';
import { Link } from 'react-router-dom';
import { useState } from 'react';


const ContentsPage = () => {
    const [nowContentPage, setContentPage] = useState(<RoomsPage/>);
    const [selectFlag, setSelectFlag] = useState("Rooms");

    return (
      <section className="ContentsPage">
        <article id="classificationArticle">
          <div>
            <button className={selectFlag === "Rooms" ? "selectFlag" : ""} 
                    onClick={() => {
                      setContentPage(<RoomsPage/>);
                      setSelectFlag("Rooms");
                    }}>Rooms</button>
            <button className={selectFlag === "Users" ? "selectFlag" : ""} 
                    onClick={() => {
                      setContentPage(<UserPage/>);
                      setSelectFlag("Users");
                    }}>Users</button>
            <button className={selectFlag === "Friends" ? "selectFlag" : ""} 
                    onClick={() => {
                      setContentPage(<FriendsPage/>);
                      setSelectFlag("Friends");
                    }}>Friends</button>
            <Link to={"/"}><button>Logout</button></Link>
          </div>
        </article>
        <article id="contentsArticle">
            {nowContentPage}
        </article>
      </section>
    );
}

export default ContentsPage;