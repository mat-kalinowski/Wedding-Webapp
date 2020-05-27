package chat

import (
	"fmt"

	"net"
	"github.com/gorilla/websocket"
)

type Client struct {
	ip net.Addr
	hub *Hub
	conn *websocket.Conn
	send chan byte[]
}

func newClient(h *Hub, c *websocket.Conn) *Client {
	return &{
		hub: h,
		conn: c,
		send: make(chan byte[]),
	}
}

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
				fmt.Printf("connection with client closed unexpectedly\n")
			}
			return
		}

		c.hub.send <- msg
	}
}

func serveWs(w http.ResponseWriter, r *http.Request) {
    ws, err := upgrader.Upgrade(w, r, nil)
    if err != nil {
		log.Println(err)
		return 
	}

	client := &Client{ip: r.RemoteAddr, hub: hub, conn: ws.Conn, make(chan []byte)}

	hub.register <- client

	go client.writer
	go client.reader
}

