import React from 'react';
import ReactDOM from 'react-dom';

import './css/menu.css'
import './css/main.css'
import './css/pane.css'

export class MenuBrick extends React.Component {
  render() {
    return(<div class="menuBrick">{this.props.children}</div>);
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
    console.log(this.val)
    return(<div id="menu" class="menuContainer">
            {this.props.menuList.map(name => <MenuBrick>{name}</MenuBrick>)}
          </div>);
  }

  handleScroll(){
    var menuContainer = document.getElementById("menu");

    if (window.pageYOffset > menuContainer.offsetTop) {
      menuContainer.classList.add("menuContainerSticky");
    } else {
      menuContainer.classList.remove("menuContainerSticky");
    }
  }
}

export class Header extends React.Component {
  render() {
    return(
      <div className="header">
        {this.props.children}
      </div>
    );
  }
}

export class MainPane extends React.Component {
  render(){
    return(<div className="mainPane">
            {this.props.children}
          </div>);
  }
}

export class HeaderPane extends React.Component {
  render(){
    return(<header className="headerPane">{this.props.children}</header>);
  }
}

export class SubPane extends React.Component {
  render(){
    return(<article></article>);
  }
}
