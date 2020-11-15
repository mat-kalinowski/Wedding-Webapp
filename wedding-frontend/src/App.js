import React from 'react';
import { HashRouter } from "react-router-dom"

import './css/shared/main.css'

import {MenuContainer,
        Header,
        MainPane} from './Components.js'
import {Home} from './Home.js'
import {About} from './About.js'
import {Opinions} from './Opinions.js'
import {Prices} from './Prices.js'

var menuList = [{name: "Aktualności", id: "/home", class: Home},
                {name: "Sprzet", id: "/about", class: About},
                {name: "Oferta", id: "/prices", class: Prices},
                {name: "Opinie", id:"/opinions", class: Opinions}];

function App() {
  document.title = "4events"
  return (
    <HashRouter>
      <div className="app">
       <Header>4events.</Header>
       <MenuContainer menuList={menuList} />
       <MainPane menuList={menuList} />
      </div>
    </HashRouter>
  );
}

export default App;
