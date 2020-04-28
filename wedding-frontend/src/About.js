import React from 'react'

import PersonIcon from '@material-ui/icons/Person';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import SpeakerIcon from '@material-ui/icons/Speaker';

import Logo from "./images/wedding.jpg";
import PinkFloyd from "./images/pink_floyd.jpg";
import KingCrimson from "./images/king_crimson.jpg";
import DeepPurple from "./images/deep_purple.jpg";

import './css/shared/main.css'
import './css/about.css'
import './css/inspirations.css'

var music_bands = [
  {photo:PinkFloyd, name:"Pink Floyd", description:"Kultowy zespół należący do kręgu moich ulubionych. Albumem, do którego najczęściej wracam jest The Dark side of the moon"},
  {photo:KingCrimson, name:"King Crimson", description:"Jeden z pierwszych zespołów którego słuchałem. W pamięć najbardziej zapada kultowy utwór Frame by frame"},
  {photo:DeepPurple, name:"Deep Purple", description:"Jeden z pierwszych zespołów którego słuchałem. W pamięć najbardziej zapada kultowy utwór Frame by frame"}

]

export class About extends React.Component {
  render(){
    return(<>
            <div className="headerPane">
              <PersonIcon style={{ fontSize: 50 }}/> O mnie</div>
            <IntroPane/>
            <div className="headerPane">
              <MusicNoteIcon style={{ fontSize: 50 }}/> Moje inspiracje</div>
              <div className="inspirationsContainer">
                <div className="introContentPane"> Muzyka jest w moim życiu praktycznie od zawsze. Ta, która będzie tworzyła klimat na Twojej
                imprezie jest dowolna. Jeśli jednak będziesz chciał żebym współtworzył playlistę, chciałbym przedstawić
                Ci kilka płyt, do których mam największy sentyment.</div>
              </div>
            <div className="headerPane">
              <SpeakerIcon style={{ fontSize: 50 }}/> Sprzęt</div>
          </>);
  }
}

export class IntroPane extends React.Component {

  render(){
    return(
      <>
        <div className="introPane">
          <div className="introHeaderPane">
            <div className="introHeaderContent">
              <img src={Logo} className="shadow"/>
              <div className="imagePane">
                <div className="headerText">Nazywam się Jarosław Kalinowski.</div>
                <div className="smallText">Moją pasją i głównym zajęciem jest organizacja oprawy muzycznej na różnego rodzaju imprezach. Zajmuję się wszystkim od wesel po eventy firmowe.</div>
              </div>
            </div>
          </div>
          <div className="introContentPane">
            Mam na własność sprzęt muzyczny świetnej jakośći, szczegóły dostępne dwie sekcje niżej w obecnej zakładce. Zajmuje się oprawą muzyczną eventów na terenie województw: Wielkopolskiego, Dolnośląskiego oraz Lubuskiego.
            Dokładny cennik jest dostępny w zakładce 'Cennik'. Koszty dojazdu są ponoszone przeze mnie i nie są wliczane w całkowitą cenę. Do natychmiastowego kontaktu skorzystaj z czatu znajdującego się pod przyciskiem po prawej stronie.
          </div>
        </div>
      </>
    );
  }
}

export class Brick extends React.Component {
  render(){
    return(
      <div className="musicBrick">
          <div className="musicPhotoContainer">
          <img src={this.props.children.photo} className="shadow" style={{width:80, height:"auto"}}></img>
          </div>
          <div className="musicTextContainer">
          <div className="musicTitle">{this.props.children.name}</div>
          <div className="musicDescription">{this.props.children.description}</div>
          </div>
      </div>);
  }
}
