import React from 'react'

/*import SubmitButton from "./images/chat/submit_btn.png";
import SubmitButtonHover from "./images/chat/submit_btn_hover.png"
*/
import './css/shared/chat.css'

var chat_endpoint = "ws://127.0.0.1:8000/ws" 

export class ChatBox extends React.Component {
    ws = new WebSocket(chat_endpoint);
    state = { messages: [] }
  
    componentDidMount(){
      this.ws.onopen = () => { console.log("websocket connection established")}
  
      this.ws.onerror = () => { console.log("error occured during websocket connection")}

      this.ws.onclose = (e) => { console.log("websocket connection closed")}
  
      this.ws.onmessage = (e) => {
        var msg = JSON.parse(e.data)
        this.setState({messages: this.state.messages.concat(msg)})
      }
    }

    sendMessage = (msg) => {
        this.ws.send(JSON.stringify(msg))
    }
  
    render() {
      return(<div className="chatContainer">
                <div className="chatHeader">Bezposredni kontakt</div>
                <ChatConversationPane messages={this.state.messages} />
                <ChatMessageBox msgSend={this.sendMessage} />
             </div>);
    }
}
  
export class ChatConversationPane extends React.Component {  
    render() {
        const { messages } = this.props
        return (<>
            <div className="chatConversationPane">
                { messages.map( msg => <div className="messageBox" >{msg}</div> ) }
            </div>
        </>)
    }
}

export class ChatMessageBox extends React.Component {
    constructor(props){
        super(props)

        this.defaultText = "Masz pytanie ? Zadaj je za pomoca czatu"
        this.state = {text: this.defaultText} 
    }


    sendMessage = () => {
        const { text } = this.state

        if(text !== this.defaultText && text !== ""){
            this.props.msgSend(text)
            this.setState({text: ""})
        }
    }

    textChangeHandler = (e) => {
        this.setState({text: e.target.value})
    }

    keyDownHandler = (e) => {
        if(e.keyCode === 13){
            this.sendMessage()
        }
    }

    startTypeHandler = (e) => {
        if(this.state.text === this.defaultText){
            this.setState({text: ""})
        }
    }

    render(){

        return(
            <div className="chatMessageBox">
                <input className="chatInputField" onChange={this.textChangeHandler} onClick={this.startTypeHandler}
                       onKeyDown={this.keyDownHandler} value={this.state.text}></input>
                <button type="submit" onClick={this.sendMessage} className="sendMessageButton"></button>
            </div>)
    }
}