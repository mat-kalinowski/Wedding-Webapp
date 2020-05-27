package chat

import ( 
    auth "github.com/mat-kalinowski/wedding-backend/authorization"

    "sync"
	"log"
    "net/http"
    "net"
	"github.com/gorilla/websocket"
	"github.com/gorilla/mux"
)

type AdminConn struct {
    conn *websocket.Conn
    dataLock *sync.Mutex
}

type Hub struct {
    clients map[string]*Client
    admin AdminConn,
    register chan *Client
    unregister chan *Client
    send chan []byte
}

func newHub() *Hub {
    return &Hub{
        clients: make(map[string]bool),
        register: make(chan *Client),
        unregister: make(chan *Client),
        send: make(chan []byte),
    }
}

var hub *Hub

func (h *Hub) run(){
    for{
        select{
            case c:= <-h.register :
                if h.clients[c.ip.String()] == nil{
                    h.clients[c.ip.String()] = c
                }
                
            case c:= <-h.unregister :
                delete(h.clients, c.ip.String()) 
            
            case msg:= <-h.send :
                log.printf("message from client : %s", msg)
                h.admin.conn.WriteMessage(websocket.TextMessage, msg)

            case msg:= h.admin.conn.ReadMessage() :
                log.Printf("message from admin : %s", msg)
                //strip ip number and chose given client
        }
    }
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
  	WriteBufferSize: 1024,
  	CheckOrigin: func(r *http.Request) bool { return true },
}

func adminWsHandler(w http.ResponseWriter, r *http.Request) {
    ws, err := upgrader.Upgrade(w, r, nil)

    if err != nil {
        log.Println(err)
    }

    h.admin.dataLock.Lock()
    h.admin.conn = ws.Conn
    h.admin.dataLock.Unlock()
}

func SetupRoutes(router *mux.Router) {
    hub := newHub()
    go hub.run()

    router.HandleFunc("/ws", serveWs).Methods("GET")
    router.Handle("/admin/ws", auth.AuthMiddleware(http.HandlerFunc(adminWsHandler))).Methods("GET")
}