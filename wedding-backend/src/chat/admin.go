package chat 

import ( 
	"fmt"
	"encoding/json"
	"github.com/gorilla/websocket"
	"net/http"
)

func (a *User) adminReader(){
	for {
		msg := <-a.send

		jsonMsg, err := json.Marshal(msg)

		if err != nil {
			fmt.Printf("Cannot encode client message to json struct: %s\n", err)
		}

		a.conn.WriteMessage(websocket.TextMessage, jsonMsg)
	}
}

func (a *User) adminWriter(){
	for {
		var jsonMsg *Message

		_, msg, err := a.conn.ReadMessage()

		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway){
				fmt.Printf("Connection with client closed unexpectedly\n")
			}
			return
		}

		err = json.Unmarshal(msg, jsonMsg)

		if err != nil {
			fmt.Printf("Cannot encode client message to json struct: %s\n", err)
		}

		a.hub.send <- jsonMsg
	}
}

func adminWsHandler(w http.ResponseWriter, r *http.Request, ) {
    ws, err := upgrader.Upgrade(w, r, nil)

    if err != nil {
        fmt.Printf("Couldn't upgrade HTTP connection to websocket: %s\n", err)
	}
	
	admin := &User{id: "admin", hub: hub, conn: ws, send: make(chan *Message)}

	hub.register <- admin

	go admin.adminWriter()
	go admin.adminReader()
}
