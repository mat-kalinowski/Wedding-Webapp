import React from 'react'
import M from 'materialize-css';

import GroupIcon from '@material-ui/icons/Group';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import InstagramIcon from '@material-ui/icons/Instagram';
import FacebookIcon from '@material-ui/icons/Facebook';
import PinterestIcon from '@material-ui/icons/Pinterest';

import './css/home/home.css'
import './css/shared/main.css'

var backend_news_ep = "http://127.0.0.1:8000/news"

var default_style = {fontSize: 40, color:'grey', margin:4}

var social_media = [
  {component:InstagramIcon, style: default_style, hoverStyle:{margin:4, fontSize: 40, color:'pink'}},
  {component:FacebookIcon, style: default_style, hoverStyle:{margin:4, fontSize: 40, color:'blue'}},
  {component:PinterestIcon, style: default_style, hoverStyle:{margin:4, fontSize: 40, color:'red'}}
]

export class Home extends React.Component {
  render(){
    return(<>
            <div className="headerPane"><MenuBookIcon className="materialReset" style={{ fontSize: 50}} /> Co nowego ?</div>
            <NewsContainer></NewsContainer>
            <div className="headerPane"><GroupIcon className="materialReset" style={{ fontSize: 50 }}/> Serwisy społecznościowe</div>

            {social_media.map(object =>
              <SocialMediaButton name={object.component} style={object.style} hoverStyle={object.hoverStyle}>
              </SocialMediaButton>)}
          </>);
  }
}

export class SocialMediaButton extends React.Component {
  constructor(props){
    super(props)
    this.state = {hover: false}
    this.hoverState = this.hoverState.bind(this)
  }

  hoverState(){
    this.setState({hover: !this.state.hover})
  }

  render() {
    let Component = this.props.name;
    let style={};

    if(this.state.hover)
      style=this.props.hoverStyle;
    else
      style=this.props.style;

    return(<Component style={style} onMouseEnter={this.hoverState} onMouseLeave={this.hoverState}/>);
  }
}

export class NewsContainer extends React.Component {
  constructor(props){
    super(props)
    this.state = {news_list : []}
  }

  componentDidMount(...args){
    fetch(backend_news_ep)
    .then(res => res.json())
    .then(data => { if(data){this.setState({news_list: data})}})
    .catch(msg => console.log("Fetching news error !"))
  }

  render(){
    return(
      <div className="scrollContainer">
        <div className="newsContainer">{this.state.news_list.map(object => <NewsPane>{object}</NewsPane>)}
        </div>
      </div>);
  }
}

export class NewsPane extends React.Component {
  render(){
    return(
          <div className="newsPane">
            <div className="newsHeader">
              <div className="newsHeaderText">{this.props.children.title}</div>
              <div className="newsHeaderDate">dodano: {this.props.children.creation_date}</div>
            </div>
            <div className="newsContent"><hr></hr>{this.props.children.content}</div>
          </div>);
  }
}
