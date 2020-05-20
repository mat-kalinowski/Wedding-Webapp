import React from 'react'
import { HashRouter } from "react-router-dom"

import {Header,
        Menu,
        ContentPane,
        News } from './Shared.js'

import Chat from './Chat.js'

var menuList = [{name: "News", id: "/news", class: News},
                {name: "Chat", id: "/chat", class: Chat}];

function App(){
  return(<HashRouter>
          <Header/>
          <Menu menuList={menuList} />
          <ContentPane menuList={menuList} />
        </HashRouter>)
}

export default App;