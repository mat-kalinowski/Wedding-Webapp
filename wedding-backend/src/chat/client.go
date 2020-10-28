package chat

import (
	"fmt"
	"net/http"
	"github.com/gorilla/websocket"

	"github.com/mat-kalinowski/wedding-backend/models"

)

var greeting= "Witamy na naszej stronie! zapraszamy do bezposredniego kontaktu za pomoca chatu."
var initialMessage = "Zachecamy do przekazania kontaktu w razie gdyby nikt z naszego zespolu nie byl w stanie natychmiastowo odpowiedziec"

func (c *User) clientReader(){
	c.conn.WriteMessage(websocket.TextMessage, []byte(greeting))
	c.conn.WriteMessage(websocket.TextMessage, []byte(initialMessage))

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

			models.CloseConversation(c.id)
			c.hub.send <- &models.Message{"admin", c.id, "", "disconnect"}
			c.hub.unregister <- c

			return
		}

		var serMsg = models.Message{"admin", c.id, string(msg), "message"}

		c.hub.send <- &serMsg
		models.StoreMessage(serMsg) 
	}
}

func serveWs(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	
    if err != nil {
		fmt.Printf("Couldn't upgrade HTTP connection to websocket: %s\n", err)
		return 
	}

	client := &User{id: r.RemoteAddr, hub: hub, conn: ws, send: make(chan *models.Message)}
	hub.register <- client

	go client.clientWriter()
	go client.clientReader()
}

