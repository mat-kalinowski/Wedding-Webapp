import React, {useRef, useEffect, useState,
     useCallback, useReducer} from 'react'

import './css/chat.css'

const { Map } = require('immutable');

var _ = require('lodash');

function conversationReducer(state, action){
    var convMap = _.cloneDeep(state)
    var conv = convMap.get(action.sender)

    switch(action.type){
        case 'message':
            if(conv){
                conv.messages.push({sender: action.sender, content: action.content})
                convMap = state.set(action.sender, conv)
            }
            else{
                convMap = state.set(action.sender, {state: "open",
                                                    messages: [{sender: action.sender, content: action.content}]})
            }
            break;
        case 'disconnect':
            if(conv){
                convMap = state.set(action.sender, {state: "history", messages: conv.messages})
            }
            break;
        default:
            console.log("unknown message type\n")
    }

    console.log(convMap.get(action.sender))

    return convMap
}

function Chat(props){
    var ws = useRef(null)

    const wsEp = "ws://127.0.0.1:8000/admin/ws?auth_token=" + localStorage.getItem("auth-token")

    const [convCurrent, changeConversation] = useReducer(conversationReducer, Map({}))
    const [activeSender, changeActiveSender] = useState("")

    useEffect(() => {
        ws.current = new WebSocket(wsEp)
        ws.current.onmessage = (msg) => {
            changeConversation(JSON.parse(msg.data))
        }
    }, [])

    const submitMessage = useCallback((msg) => {
        var message = {recipient: "mama", sender:"admin", content: msg}

        ws.current.send(message)
    })

    return <div className="chatContainer">
            <ContactList convMap={convCurrent} swapActive={changeActiveSender}/>
            <ConversationPane submit={submitMessage} convMap={convCurrent} sender={activeSender} />
           </div>
}

function ConversationPane(props) {
    const [message, setMessage] = useState("")

    const textTypingHandler = useCallback((e) => {
        setMessage(e.target.value)
    })

   const keyDownHandler = useCallback((e) => {
        if(e.keyCode === 13){
            props.submit(message)
            setMessage("")
        }
   })

   var conversation = props.convMap.get(props.sender)

    return (<div style={{width: "100%"}}>
                <div className="conversationPane">{conversation && 
                    conversation.messages.map(o =>
                        <div className="messageBox">{o.content.slice(1, -1)}</div>
                    )}
                </div>

                <textarea onChange={textTypingHandler} value={message} 
                            onKeyDown={keyDownHandler} className="messageInput"></textarea>
            </div>)
}

function ContactList(props){

    const getConversationsHistory = useCallback((e) => {})

    const filterContacts = useCallback((filter) =>
        [...props.convMap].map((entry) => {
            if(entry[1].state === filter){

                return (<div onClick={() => {props.swapActive(entry[0])}} className="contactListItem" key={entry[0]}>
                            {entry[0]}
                        </div>)
            }
        }))

    return ( 
        <div className="contactList">
            <div className="listBreak">Obecne rozmowy</div>
            {filterContacts("open")}
            <div className="listBreak">Historia</div>
            {filterContacts("history")}
        </div>)
}

export default Chat;