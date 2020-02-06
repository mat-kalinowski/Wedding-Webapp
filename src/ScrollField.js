import React from 'react'

export class ScrollField {

  render(){
    let Component = this.props.component;

    scrollComponent(){

    }

    return(<>
      <div onMouseDown=this.scrollComponent></div>
      </>);
  }
}
