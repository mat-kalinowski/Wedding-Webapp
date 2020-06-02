package chat

import (
	"fmt"

	"net/http"
	//"encoding/json"
	"github.com/gorilla/websocket"
)

type Client struct {
	ip string
	hub *Hub
	conn *websocket.Conn
	send chan []byte
}

func (c *Client) getID() string {
	return c.ip
}

/*
* message should be stripped from sender and recipient
*/

func (c *Client) reader(){
	for {
		msg := <-c.send

		c.conn.WriteMessage(websocket.TextMessage, msg)
	}
}

func (c *Client) writer(){
	for {
		_, msg, err := c.conn.ReadMessage()

		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway){
				fmt.Printf("Connection with client closed unexpectedly\n")
			}
			return
		}

		/*jsonMsg, err := json.Marshall(&Message{string(c.ip), "admin" msg})

		if err != nil {
			fmt.Printf("Cannot encode client message to json struct: %s\n", err)
		}*/

		c.hub.send <- msg
	}
}

func serveWs(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	
    if err != nil {
		fmt.Printf("Couldn't upgrade HTTP connection to websocket: %s\n", err)
		return 
	}

	fmt.Printf("registering client : %s\n", hub)

	client := &Client{ip: r.RemoteAddr, hub: hub, conn: ws, send: make(chan []byte)}
	hub.register <- client

	go client.writer()
	go client.reader()
}

