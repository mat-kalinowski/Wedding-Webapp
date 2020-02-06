import React from 'react';
import ReactDOM from 'react-dom';
import {
  Route,
  NavLink,
  HashRouter
} from "react-router-dom";

import {Home} from './Home.js'

import './css/menu.css'
import './css/main.css'
import './css/pane.css'

export class MenuBrick extends React.Component {
  render() {
    var opt = this.props.children
    console.log(opt.name)
    return(<NavLink to={opt.id}>
              <div class="menuBrick">
                {opt.name}
              </div>
            </NavLink>);
  }
}

export class MenuContainer extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount(...args) {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount(...args) {
    window.removeEventListener('scroll', this.handleScroll);
  }

  render() {
    return(<div id="menu" class="menuContainer">
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
  render(){
    var obj = this.props.menuList[0]

    return(
        <div className="mainPane">
          {this.props.menuList.map(object => <Route path={object.id} component={object.class} />)}
        </div>
      );
  }
}
