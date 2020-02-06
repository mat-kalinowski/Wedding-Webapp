import React from 'react'

import GroupIcon from '@material-ui/icons/Group';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import InstagramIcon from '@material-ui/icons/Instagram';
import FacebookIcon from '@material-ui/icons/Facebook';
import PinterestIcon from '@material-ui/icons/Pinterest';

import './css/home.css'
import './css/main.css'

var mock_art = [
  {title: "Nowy sprzęt ", date:"27.01.2020", content:"Zakup najnowszego sprzętu najwyższej klasy. Pozwala to na niezapomniane wrażenia z prowadzonych imprez, co za tym idzie wyjątkowe wspomnienia. Dokładny opis znajduję się w sekcji 'O mnie'."},
  {title: "Nowy samochód", date:"10.01.2020", content:"Zakup nowego samochodu dostawczego, który jest w stanie pomieścić cały sprzęt niezbędny na imprezie. Pozwala to na dojazd w dowolne miejsce w województwie Wielkopolskim. Więcej w sekcji 'Cennik.'"},
  {title: "Rozbudowa strony", date:"07.01.2020" , content:"Strona internetowa, na której przebywasz jest w przebudowie, przepraszamy za utrudnienia. Niedługo na stronie zostanie dodany shoutbox z możliwością bezpośredniego i szybkiego kontaktu w celu omówienia usług i dojścia do porozumienia. W celu skorzystania z shoutboxa naciśnij przycisk po prawej stronie znajdujący się pod strzałką... "},
  {title: "Rozbudowa strony", date:"08.01.2020", content:"Strona internetowa, na której przebywasz jest w przebudowie, przepraszamy za utrudnienia. Niedługo na stronie zostanie dodany shoutbox z możliwością bezpośredniego i szybkiego kontaktu w celu omówienia usług i dojścia do porozumienia. W celu skorzystania z shoutboxa naciśnij przycisk po prawej stronie znajdujący się pod strzałką... "}];

var default_style = {fontSize: 40, color:'grey', margin:4}

var social_media = [
  {component:InstagramIcon, style: default_style, hoverStyle:{margin:4, fontSize: 40, color:'pink'}},
  {component:FacebookIcon, style: default_style, hoverStyle:{margin:4, fontSize: 40, color:'blue'}},
  {component:PinterestIcon, style: default_style, hoverStyle:{margin:4, fontSize: 40, color:'red'}}
]

export class Home extends React.Component {
  render(){
    return(<>
            <div className="headerPane"><MenuBookIcon style={{ fontSize: 50}} /> Co nowego ?</div>
            <NewsContainer></NewsContainer>
            <div className="headerPane"><GroupIcon  style={{ fontSize: 50 }}/> Serwisy społecznościowe</div>

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
  render(){
    return(
      <div className="scrollContainer">
      <div className="newsContainer">{mock_art.map(object => <NewsPane>{object}</NewsPane>)}</div>
      </div>);
  }
}

export class NewsPane extends React.Component {
  render(){
    console.log(this.props.children)
    return(
          <div className="newsPane">
            <div className="newsHeader">
              <div className="newsHeaderText">{this.props.children.title}</div>
              <div className="newsHeaderDate">dodano: {this.props.children.date}</div>
            </div>
            <div className="newsContent"><hr></hr>{this.props.children.content}</div>
          </div>);
  }
}
