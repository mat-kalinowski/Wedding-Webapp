import React, {useRef, useEffect, useState, useCallback} from 'react'

import './css/chat.css'


function Chat(props){
    var ws = useRef(null)

    const wsEp = "ws://127.0.0.1:8000/ws?auth_token=" + localStorage.getItem("auth-token")

    useEffect(() => {
        ws.current = new WebSocket(wsEp)
        ws.current.onmessage = (msg) => {
            console.log(msg)
        }
    }, [])

    const submitMessage = useCallback((msg) => {
        ws.current.send(msg)
    })

    return <ConversationPane submit={submitMessage} />
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

    return (<>
                <div className="conversationPane"></div>
                <textarea onChange={textTypingHandler} value={message} 
                            onKeyDown={keyDownHandler} className="messageInput"></textarea>
            </>)

}

function ContactPane(props){
    return <div className="contactBar"></div>
}

export default Chat;