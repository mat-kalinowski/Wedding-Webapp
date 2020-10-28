package chat

import ( 
    auth "github.com/mat-kalinowski/wedding-backend/authorization"
    "github.com/mat-kalinowski/wedding-backend/models"

    "net/http"
    "encoding/json"
	"github.com/gorilla/websocket"
	"github.com/gorilla/mux"
)

type User struct {
    id string
	hub *Hub
	conn *websocket.Conn
	send chan *models.Message
}

type Hub struct {
    users map[string]*User

    register chan *User
    unregister chan *User
    send chan *models.Message
}

func newHub() *Hub {
    return &Hub{
        users: make(map[string] *User),
        register: make(chan *User),
        unregister: make(chan *User),
        send: make(chan *models.Message),
    }
} 

var clientBuffer []models.Message

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

func getConversations(w http.ResponseWriter, r *http.Request){
    var convs []models.Conversation

	convs = models.GetConversations(convs)

	w.Header().Set("Content-Type", "application/json")
    w.Header().Set("Access-Control-Allow-Origin", "*")
    
	json.NewEncoder(w).Encode(convs)
}

func deleteConversation(w http.ResponseWriter, r *http.Request){
    keys, exists := r.URL.Query()["user"]
    
	if !exists {
		http.Error(w,"Wrong parameters in URL query!", http.StatusBadRequest)
    }

    models.DeleteConversation(keys[0])
    
    w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
}

func SetupRoutes(router *mux.Router) {
    hub = newHub()
    go hub.run()

    router.HandleFunc("/ws", serveWs).Methods("GET")
    router.Handle("/admin/ws", auth.AuthMiddleware(http.HandlerFunc(adminWsHandler))).Methods("GET")

    router.Handle("/conversation", auth.AuthMiddleware(http.HandlerFunc(getConversations))).Methods("GET")
    router.Handle("/conversation", auth.AuthMiddleware(http.HandlerFunc(deleteConversation))).Methods("DELETE")
}