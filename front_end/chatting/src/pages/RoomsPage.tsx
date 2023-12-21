import "./sass/RoomsPage.scss"
import { useState } from 'react';

const RoomsPage = () => {
    const [chattingModal, setChattingModal] = useState("");

    return (
        <div className='RoomsPage' id="roomsBox">
            <div className={chattingModal} id="roomChattingModal">
                <section className="roomChattingLeftSection">
                    <article>
                        <div className="roomNumberBox">
                            <p>방 번호:</p>
                            <p>2</p>
                        </div>
                        <div id="chattingWrapBox">
                        </div>
                    </article>
                    <article>
                        <textarea id="submitText" placeholder="채팅 내용을 입력해 주세요."></textarea>
                        <button id="submitButton">전송</button>
                    </article>
                </section>
                <section className="roomChattingRightSection">
                    <article>
                        <div className="peopleNumberBox">
                            <p>참여인원: </p>
                            <p className="peopleNumber">3</p>
                        </div>
                        <div className="peopleListBox">
                            <p>짜장면</p>
                            <p>내 이름</p>
                        </div>
                    </article>
                    <article>
                        <button onClick={() => setChattingModal("")}>나가기</button>
                    </article>
                </section>
            </div>
            <div id="roomList">
                <div className="room">
                    <div className="peopleNumberBox">
                        <p>참여인원 수: </p>
                        <p>3</p>
                    </div>
                    <div className="roomNumberBox">
                        <p>방 번호: </p>
                        <p>2</p>
                    </div>
                    <div className="buttonBox">
                        <button onClick={() => setChattingModal("displayFlag")}>입장</button>
                    </div>
                </div>
                <div className="room">
                    <div className="peopleNumberBox">
                        <p>참여인원 수: </p>
                        <p>3</p>
                    </div>
                    <div className="roomNumberBox">
                        <p>방 번호: </p>
                        <p>2</p>
                    </div>
                    <div className="buttonBox">
                        <button onClick={() => setChattingModal("displayFlag")}>입장</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RoomsPage;