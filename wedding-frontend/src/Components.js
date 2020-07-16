import React from 'react';
import {
  Route,
  NavLink,
} from "react-router-dom";

import {ChatBox} from './ChatBox.js'

import './css/shared/menu.css'
import './css/shared/main.css'
import './css/shared/pane.css'
import './css/shared/chat.css'

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

  updateDimensions(){
    var menuElement = document.getElementById("menu")

    var newHeight = window.innerHeight - menuElement.offsetHeight - 140
    var newWidth = window.innerHeight *1.618

    var fillWidth = newWidth + (window.innerWidth - newWidth) / 2;

   this.setState({height: newHeight, width: newWidth, borderWidth: fillWidth})
  }

  componentWillMount(){

    window.addEventListener('resize', this.updateDimensions.bind(this))
  }

  componentWillUnmount(){
    window.removeEventListener('resize', this.updateDimensions.bind(this))
  }

  render(){

    return(
      <div style={{"width": this.state.borderWidth}} className="colorFill">
        <div style={{"height": this.state.height, "width": this.state.width}} className="mainPane">
           <div className="contentPane">{this.props.menuList.map(object => <Route path={object.id} component={object.class} />)}
           </div>
           <div className="navbarPane">
             <div className="navbarUpperPane">
              <ChatBox />
             </div>
             <div className="navbarLowerPane">
                <div className="aboutHeaderPane">Kontakt</div>
                <div className="aboutContentPane">
                  <div className="textBox">
                    Zapraszamy do korzystania z dowolnej formy kontaktu i zadawanie dowolnej liczby pytan :)
                    <li><b>Numer telefonu:</b> 692078731</li>
                    <li><b>Email:</b> kontakt@4events.com</li>
                  </div>
                </div>
             </div>
           </div>
        </div>
      </div>
      );
  }
}