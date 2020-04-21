import React from 'react'

class Node {
  constructor(left, right, value){
    this.left = left;
    this.right = right;
    this.value = value;
  }

  setLeft(left){
    this.left = left;
  }

  getLeft(){
    return this.left;
  }

  setRight(right){
    this.right = right;
  }

  getRight(){
    return this.right;
  }

  setValue(value){
      this.value = value;
  }

  getValue(){
    return this.value;
  }
}

class LinkedList {
  constructor(){
    this.head = null;
    this.tail = null;
  }

  addNode(val){
    var newNode = null;

    if(this.head == null){
      newNode(null,null,val)
      this.head = newNode;
      this.tail = newNode;
    }
    else {
      newNode = Node(this.tail, this.head, val);
      this.tail.setRight(newNode);
      this.head.setLeft(newNode);
    }
  }
}


// list of objects of data -> props.list
// html building component -> props.component
// displayed elements -> props.limit
// 100px diff - one element scrolled

export class ScrollField extends React.Component {

  constructor(props){
    super(props)
    this.lList = new LinkedList();

    for(var i = 0; i < props.list.size; i++){
      this.lList.addNode(props.list[i]);
    }
  }

  startDragging(){
    console.log("started dragging")

  }

  scrollComponent(){
    console.log("scrolling")

  }

  stopDragging(){
    console.log("stopped dragging")

  }

  render(){
    let Component = this.props.component;
    console.log(Component);
    
    return(<>
      <div onTouchStart={this.scrollComponent} onTouchMove={this.scrollComponent} onTouchEnd={this.stopDragging}>
        {this.props.list.map(object => <Component>{object}</Component>)}
      </div>
      </>);
  }
}
