import React from 'react';
import {
  Route,
  NavLink,
} from "react-router-dom";

import {ChatBox} from './ChatBox.js'
import M from 'materialize-css';

import './css/shared/menu.css'
import './css/shared/main.css'
import './css/shared/pane.css'
import './css/shared/chat.css'

const logo = require('./images/jarek.jpg');

export class MenuBrick extends React.Component {
  render() {
    var opt = this.props.children
    
    return(<NavLink to={opt.id}>
              <div className="menuBrick">
                {opt.name}
              </div>
           </NavLink>);
  }
}

export class MenuContainer extends React.Component {

  componentDidMount(...args) {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount(...args) {
    window.removeEventListener('scroll', this.handleScroll);
  }

  render() {
    return(<div id="menu" className="menuContainer">
            {this.props.menuList.map(object => <MenuBrick>{object}</MenuBrick>)}
          </div>);
  }

  handleScroll(){
    var header = document.getElementById("header");
    var menuContainer = document.getElementById("menu");

    if (window.pageYOffset >= header.offsetHeight) {
      menuContainer.classList.add("menuContainerSticky");
    } else {
      menuContainer.classList.remove("menuContainerSticky");
    }
  }
}

export class Header extends React.Component {
  componentDidMount(...args) {
    M.AutoInit();
    console.log("initialised companent with materialize");
  }

  render() {
    return(
      <div className="header" id="header">
        <div className="headerLogo">
          {this.props.children}
        </div>
        <div className="headerSubText">
          Wesela | Imprezy Firmowe | Imprezy Okolicznościowe
        </div>
      </div>
    );
  }
}

export class MainPane extends React.Component {

  state = { height: window.innerHeight,
            width: window.innerWidth,
            borderWidth: 0 }

  render(){

    return(
      <div className="mainPane row">
            <div className="colorFillLeft col l1"/>
            <div className="contentPane col l6 m12">{this.props.menuList.map(object => <Route path={object.id} component={object.class} />)}
            </div>
            <div className="navbarPane col l4 m12">
              <div className="navbarUpperPane">
                <ChatBox />
              </div>
              <div className="navbarLowerPane">
                  <div className="aboutHeaderPane">O Mnie</div>
                  <div className="aboutContentPane row textBox">
                    <div className="col l4 s2 " style={{margin: 'auto'}}>
                      <img src={logo} alt="" class="circle responsive-img z-depth-4"/>
                    </div>
                    <div className="verticalBreak col l8 s10">
                      Nazywam sie Jaroslaw Kalinowski, zajmuje sie prowadzeniem eventow. Zapraszamy do skontaktowania sie ze mna.
                    </div>
                  </div>
              </div>
            </div>
            <div className="colorFillRight col l1"/>
      </div>
      
      );
  }
}