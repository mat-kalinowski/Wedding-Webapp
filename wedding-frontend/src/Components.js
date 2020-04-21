import React from 'react';
import ReactDOM from 'react-dom';
import {
  Route,
  NavLink,
  HashRouter
} from "react-router-dom";

import {Home} from './Home.js'

import './css/shared/menu.css'
import './css/shared/main.css'
import './css/shared/pane.css'
import './css/shared/chat.css'

export class MenuBrick extends React.Component {
  render() {
    var opt = this.props.children
    
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

  constructor(props){
    super(props)
    this.state = {height: window.innerHeight,
                  width: window.innerWidth,
                  borderWidth: 0}

  }

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
              <ChatBox>hejj</ChatBox>
             </div>
             <div className="navbarLowerPane">
                <div className="aboutTitlePane">
                  <div className="aboutHeaderPane">O Mnie |</div>
                  <div className="aboutPhotoPane"></div>
                </div>
                <div className="aboutContentPane">Nazywam sie Jaroslaw Kalinowski i na codzien zajmuje sie proawdzeniem imprez muzycznych.</div>
             </div>
           </div>
        </div>
      </div>
      );
  }
}

export class ChatBox extends React.Component {
  render() {
    
    return(<div className="chatContainer">
              <div className="chatHeader">Bezposredni kontakt</div>
              <div className="chatConversationPane"></div>
              <div className="chatInputField">Masz pytania ? Zadaj je teraz za pomoca czatu</div>
           </div>);
  }
}