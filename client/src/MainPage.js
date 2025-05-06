import React from "react";
import ShowPlayers from "./ShowPlayers";
import ReadyHandler from "./ReadyHandler";
import StartGame from "./StartGame";
import PopUp from "./PopUp";
import './MainPage.css'; 


const MainPage = ({ socket, onGameStart }) => {
    

    return (
        <div className="containerMainPage">
            <PopUp />
            <ShowPlayers socket={socket} />
            <ReadyHandler socket={socket} />
            <StartGame socket={socket} onGameStart={onGameStart}/>
        </div>
    )
};

export default MainPage;