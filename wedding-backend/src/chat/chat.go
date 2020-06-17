package chat

import ( 
    auth "github.com/mat-kalinowski/wedding-backend/authorization"

    "fmt"
    "net/http"
	"github.com/gorilla/websocket"
	"github.com/gorilla/mux"
)

type Message struct {
    Recipient string `json:"recipient"`
    Sender string `json:"sender"`
    Content string `json:"content"`
    Type string `json:"type"`
}

type User struct {
    id string
	hub *Hub
	conn *websocket.Conn
	send chan *Message
}

type Hub struct {
    users map[string]*User

    register chan *User
    unregister chan *User
    send chan *Message
}

func newHub() *Hub {
    return &Hub{
        users: make(map[string] *User),
        register: make(chan *User),
        unregister: make(chan *User),
        send: make(chan *Message),
    }
} 

var hub *Hub

func (h *Hub) run(){
    for{
        select{
            case u:= <-h.register :
                if h.users[u.id] == nil{
                    h.users[u.id] = u
                }
                
            case u:= <-h.unregister :
                delete(h.users, u.id) 
            
            case msg:= <-h.send :

                if h.users[msg.Recipient] != nil {
                    h.users[msg.Recipient].send <- msg
                }
        }
    }
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
  	WriteBufferSize: 1024,
  	CheckOrigin: func(r *http.Request) bool { return true },
}

func SetupRoutes(router *mux.Router) {
    hub = newHub()
    go hub.run()

    router.HandleFunc("/ws", serveWs).Methods("GET")
    router.Handle("/admin/ws", auth.AuthMiddleware(http.HandlerFunc(adminWsHandler))).Methods("GET")
}