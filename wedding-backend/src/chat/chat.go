package chat

import ( 
    auth "github.com/mat-kalinowski/wedding-backend/authorization"

	"fmt"
    "net/http"
	"github.com/gorilla/websocket"
	"github.com/gorilla/mux"
)

type Message struct {
    recipient string `json: recipient`
    sender string `json: sender`
	msg string `json: msg`
}

type User interface {
    getID() string
}

type Hub struct {
    users map[string]User

    register chan User
    unregister chan User
    send chan []byte
}

func newHub() *Hub {
    return &Hub{
        users: make(map[string] User),
        register: make(chan User),
        unregister: make(chan User),
        send: make(chan []byte),
    }
} 

var hub *Hub

func (h *Hub) run(){
    for{
        select{
            case u:= <-h.register :
                if h.users[u.getID()] == nil{
                    h.users[u.getID()] = u
                }
                
            case u:= <-h.unregister :
                delete(h.users, u.getID()) 
            
            case msg:= <-h.send :
                fmt.Printf("message from user : %s\n", msg)
                /* 
                * identify recipient and
                */
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