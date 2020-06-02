package chat 

import ( 
	"fmt"
	"github.com/gorilla/websocket"
	"net/http"
)



func (a *User) adminReader(){
	for {
		msg := <-a.send

		a.conn.WriteMessage(websocket.TextMessage, msg)
	}
}

func (a *User) adminWriter(){
	for {
		_, msg, err := a.conn.ReadMessage()

		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway){
				fmt.Printf("Connection with client closed unexpectedly\n")
			}
			return
		}

		/*sonMsg, err := json.Marshall(&Message{string(a.getID()), msg})

		if err != nil {
			fmt.Printf("Cannot encode client message to json struct: %s\n", err)
		}*/

		a.hub.send <- msg
	}
}

func adminWsHandler(w http.ResponseWriter, r *http.Request, ) {
    ws, err := upgrader.Upgrade(w, r, nil)

    if err != nil {
        fmt.Printf("Couldn't upgrade HTTP connection to websocket: %s\n", err)
	}

	fmt.Printf("Registering admin user: %s\n", hub)
	
	admin := &User{id: "admin", hub: hub, conn: ws, send: make(chan []byte)}

	hub.register <- admin

	go admin.adminWriter()
	go admin.adminReader()
}
