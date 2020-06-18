import React, {useRef, useEffect, useState,
     useCallback, useReducer} from 'react'

import './css/chat.css'

const { Map } = require('immutable');

var _ = require('lodash');

const actionTypes = {
    clientMessage: "CLIENT_MESSAGE",
    adminMessage: "ADMIN_MESSAGE",
};

const actionHandlers = {
    ["CLIENT_MESSAGE"] (state, msg) {
        var convMap = _.cloneDeep(state)
        var conv = convMap.get(msg.sender)

        console.log("new message from client \n")

        if(!conv && msg.type === "message"){
            convMap = state.set(msg.sender, {state: "open",
            messages: [{sender: msg.sender, content: msg.content}]})

        }
        else if(conv && msg.type === "message" ){
            conv.messages.push({sender: msg.sender, content: msg.content})
            conv.state = "open"

            convMap = state.set(msg.sender, conv)
        }
        else if(conv && msg.type === "disconnect"){
            convMap = state.set(msg.sender, {state: "history", messages: conv.messages})

            console.log("client has disconnected - conversation moved to history\n")
        }

        return convMap
    },
    ["ADMIN_MESSAGE"] (state, msg) {
        var convMap = _.cloneDeep(state)
        var conv = convMap.get(msg.recipient)

        console.log("new message from admin \n")

        if(conv && conv.state === "open"){
            conv.messages.push({sender: msg.sender, content: msg.content})
            convMap = state.set(msg.recipient, conv)
        }
        else if(conv && conv.state === "history"){
            console.log("cannot reply on history message\n")
        }

        return convMap
    }
}

function conversationReducer(state, action){
    const { type, payload } = action
    const actionHandler = actionHandlers[type]

    console.log("new message\n")

    if (actionHandler) {
      return actionHandler(state, payload)
    }

    return state
}

function Chat(props){
    var ws = useRef(null)

    const wsEp = "ws://127.0.0.1:8000/admin/ws?auth_token=" + localStorage.getItem("auth-token")

    const [convCurrent, changeConversation] = useReducer(conversationReducer, Map({}))
    const [activeSender, changeActiveSender] = useState("")

    useEffect(() => {
        ws.current = new WebSocket(wsEp)
        ws.current.onmessage = (msg) => {
            var action = {
                type: actionTypes.clientMessage,
                payload: JSON.parse(msg.data)
            }

            changeConversation(action)
        }
    }, [])

    const submitMessage = useCallback((msg) => {
        var message = {recipient: activeSender, sender:"admin", content: msg}
        var action = {
            type: actionTypes.adminMessage,
            payload: message
        }

        ws.current.send(message)
        changeConversation(action)
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