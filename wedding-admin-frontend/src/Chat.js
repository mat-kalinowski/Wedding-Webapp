import React, {useRef, useEffect, useState,
     useCallback, useReducer} from 'react'

import './css/chat.css'

import MarkunreadIcon from '@material-ui/icons/Markunread';
import DeleteIcon from '@material-ui/icons/Delete';

const { Map } = require('immutable');

var _ = require('lodash');

const actionTypes = {
    clientMessage: "CLIENT_MESSAGE",
    adminMessage: "ADMIN_MESSAGE",
    historyConversations: 'HISTORY_CONVERSATIONS',
    deleteConversation: 'DELETE_CONVERSATION',
};

const iconStyle = {color: '#d4d4d4'}
const iconDeleteHover = {color: '#ba6665'}

const hiddenIcon = {visibility: 'hidden'}


const actionHandlers = {
    ["CLIENT_MESSAGE"] (state, msg) {
        var convMap = _.cloneDeep(state)
        var conv = convMap.get(msg.sender)

        if(!conv && msg.type === "message"){
            convMap = state.set(msg.sender, {state: "open",
            messages: [{sender: msg.sender, content: msg.content}],
            style: iconStyle})

        }
        else if(conv && msg.type === "message" ){
            conv.messages.push({sender: msg.sender, content: msg.content})
            conv.state = "open"
            conv.style = iconStyle

            convMap = state.set(msg.sender, conv)
        }
        else if(conv && msg.type === "disconnect"){
            convMap = state.set(msg.sender, {state: "history", 
            messages: conv.messages,
            style: conv.style})
        }

        return convMap
    },
    ["ADMIN_MESSAGE"] (state, msg) {
        var convMap = _.cloneDeep(state)
        var conv = convMap.get(msg.recipient)

        console.log(msg.content)

        if(conv && conv.state === "open"){
            conv.messages.push({sender: msg.sender, content: msg.content})
            convMap = state.set(msg.recipient, conv)
        }
        else if(conv && conv.state === "history"){
            console.log("cannot reply on history message\n")
        }

        return convMap
    },
    ["HISTORY_CONVERSATIONS"] (state, convs) {
        var convMap = _.cloneDeep(state)

        convs.forEach((conv) => {
            convMap = convMap.set(conv.user.id, {state: conv.user.state, style: hiddenIcon, messages: conv.messages})
        })

        return convMap
    },
    ["DELETE_CONVERSATION"] (state, user) {
        var convMap = _.cloneDeep(state)

        return convMap.delete(user)
    }
}

function conversationReducer(state, action){
    const { type, payload } = action
    const actionHandler = actionHandlers[type]

    if (actionHandler) {
      return actionHandler(state, payload)
    }

    return state
}

function Chat(props){
    var ws = useRef(null)

    const wsEp = "ws://127.0.0.1:8000/admin/ws?auth_token=" + localStorage.getItem("auth-token")
    const msgEp = "http://127.0.0.1:8000/conversation?auth_token=" + localStorage.getItem("auth-token") 

    const [convCurrent, changeConversation] = useReducer(conversationReducer, Map({}))
    const [activeSender, changeActiveSender] = useState("")

    useEffect((o) => {
        var reqData = { method: "GET",
                        headers: {'Content-Type': 'application/json; charset=UTF-8'}}

        fetch(msgEp, reqData)
        .then(res => res.json())
        .then(data => {
            console.log(data)

            if(data){
                var action = {
                    type: actionTypes.historyConversations,
                    payload: data
                }

                changeConversation(action)
            }
        })
        .catch(msg => console.log(`Cannot update news in DB: ${msg}`))

    },[])

    useEffect(() => {
        ws.current = new WebSocket(wsEp)
        ws.current.onmessage = (msg) => {
            console.log(msg)
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

        ws.current.send(JSON.stringify(message))
        changeConversation(action)
    })

    const deleteConversation = useCallback((user) =>{
        var reqData = { method: "DELETE",
                        headers: {'Content-Type': 'application/json; charset=UTF-8'}}
        var queryURL = msgEp + "&user=" + user

        fetch(queryURL, reqData)
        .then(res => {
            if(res.ok){
                var action = {
                    type: actionTypes.deleteConversation,
                    payload: user
                }

                changeConversation(action)
            }
        })
        .catch(msg => console.log(`Cannot update news in DB: ${msg}`))

    })

    return <div className="chatContainer">
            <ContactList convMap={convCurrent} swapActive={changeActiveSender} deleteConversation={deleteConversation}/>
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
                    conversation.messages.map(o =>{
                        const inlineStyle = o.sender === "admin" ? {backgroundColor: '#c6bccf', alignSelf: 'flex-end'} 
                                                                : {backgroundColor: '#cecfbc', alignSelf: 'flex-start'}
                        return <div className="messageBox" style={inlineStyle}>{o.content}</div>
                    }
                )}
                </div>
                <textarea rows="1" onChange={textTypingHandler} value={message} 
                            onKeyDown={keyDownHandler} className="messageInput"></textarea>
            </div>)
}

function ContactList(props){

    const getConversationsHistory = useCallback((e) => {})

    const chooseConversation = useCallback((user, conv) => {
        props.swapActive(user)
        conv.style=hiddenIcon
    }, [])

    const filterContacts = useCallback((filter) =>
        [...props.convMap].map((entry) => {
            if(entry[1].state === filter){

                return (<div onClick={() => {chooseConversation(entry[0], entry[1])}} className="contactListItem" key={entry[0]}>
                            <div className="contactHeader">
                                {entry[0]}
                            </div>
                            <div className="contactButtonsContainer">
                                <MarkunreadIcon className="iconDefaultStyle" style={entry[1].style}/>
                                <HoverButton name={DeleteIcon} className="iconDefaultStyle" defaultStyle={iconStyle}
                                        hoverStyle={iconDeleteHover} onClick={() => props.deleteConversation(entry[0])}/>
                            </div>
                        </div>)
            }
        }))

    return ( 
        <div className="contactList">
            <div className="listBreak"><b>Obecne rozmowy</b></div>
            {filterContacts("open")}
            <div className="listBreak"><b>Historia</b></div>
            {filterContacts("history")}
        </div>)
}

function HoverButton(props){
    const [hover, changeHover] = useState(false)

    var {name: Component, hoverStyle, defaultStyle, ...nativeProps} = props
    var style = {}

    if(hover){
        style = hoverStyle
    }
    else {
        style = defaultStyle
    }

    return <Component {...nativeProps} style={style} onMouseEnter={() => changeHover(!hover)} onMouseLeave={() => changeHover(!hover)}/> 
}

export default Chat;