package models

import ( 
	"log"
	"fmt"
	"net/http"
	"github.com/gorilla/websocket"
	"github.com/gorilla/mux"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
  	WriteBufferSize: 1024,
  	CheckOrigin: func(r *http.Request) bool { return true },
}

func reader(conn *websocket.Conn) {
    for {

        messageType, p, err := conn.ReadMessage()
        if err != nil {
            log.Println(err)
            return
        }

        fmt.Println(string(p))

        if err := conn.WriteMessage(messageType, p); err != nil {
            log.Println(err)
            return
        }

    }
}

func serveWs(w http.ResponseWriter, r *http.Request) {
    fmt.Println(r.Host)

    ws, err := upgrader.Upgrade(w, r, nil)
    if err != nil {
        log.Println(err)
  }

    reader(ws)
}

func SetupRoutes(router *mux.Router) {
	router.HandleFunc("/ws", serveWs).Methods("GET")
}