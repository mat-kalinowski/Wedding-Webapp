package chat

import (
	"fmt"

	"net/http"
	"github.com/gorilla/websocket"
)

func (c *User) clientReader(){
	for {
		msg := <-c.send

		c.conn.WriteMessage(websocket.TextMessage, []byte(msg.Content))
	}
}

func (c *User) clientWriter(){
	for {
		_, msg, err := c.conn.ReadMessage()

		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway){
				fmt.Printf("Connection with client closed unexpectedly\n")
			}
			return
		}

		c.hub.send <- &Message{"admin", c.id, string(msg)}
	}
}

func serveWs(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	
    if err != nil {
		fmt.Printf("Couldn't upgrade HTTP connection to websocket: %s\n", err)
		return 
	}

	client := &User{id: r.RemoteAddr, hub: hub, conn: ws, send: make(chan *Message)}
	hub.register <- client

	go client.clientWriter()
	go client.clientReader()
}

