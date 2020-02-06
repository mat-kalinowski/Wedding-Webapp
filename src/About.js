import React from 'react'

import PersonIcon from '@material-ui/icons/Person';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import SpeakerIcon from '@material-ui/icons/Speaker';
import Logo from "./images/holiday.jpg";

import './css/main.css'
import './css/about.css'



export class About extends React.Component {
  render(){
    return(<>
            <div className="headerPane">
              <PersonIcon style={{ fontSize: 50 }}/> O mnie</div>
            <IntroPane/>
            <div className="headerPane">
              <MusicNoteIcon style={{ fontSize: 50 }}/> Moje inspiracje</div>
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
            <img src={Logo} width="45%" className="shadow"/>
            <div className="introHeaderContent">
              <div className="headerText">Nazywam się Jarosław Kalinowski.</div>
              <div className="smallText">Moją pasją i głównym zajęciem jest organizacja oprawy muzycznej na różnego rodzaju imprezach. Zajmuję się wszystkim od wesel po eventy firmowe.</div>
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
