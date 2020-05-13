import React from 'react'

import {
    Route,
    NavLink,
  } from "react-router-dom";
  

import './css/menu.css'
import './css/header.css'
import './css/main.css'

function Header(props){
    return <div className="headerContainer">4events - panel administratora</div>
}

function ContentPane(props){
    return <div className="contentContainer">Tutaj bedzie tresc strony administratora</div>
}

function Menu(props){
    return <div className="menuContainer"> 
            {props.menuList.map(o => <MenuBrick>{o}</MenuBrick>)}
          </div>
}

function MenuBrick(props){
    var opt = props.children

    console.log(opt)

    return (<NavLink to={opt.id}>
              <a className="menuBrick">{opt.name}</a>
            </NavLink>);
}

function News(props){
    return <h1>News</h1>
}

function Chat(props){
    return <h1>Chat</h1>
}


export {Menu, Header, ContentPane, News, Chat}