package models

import (
	"log"
	"database/sql"
	"github.com/mat-kalinowski/wedding-backend/chat"
)

type Client struct{
	Id string `db:"id"`
	State string `json:"state" db:"state"`
}

type Conversation struct {
	User Client
	Messages []chat.Message `json:"messages`
}

/*
* Get from database all messages grouped into conversations by given user
*/

/*  format of single conversation
	{ id: 172.168....,
	  state: "open",
	  messages:[...]
	}

*/

func GetConversations(convs []Conversation) []Conversation{
	var conv Conversation

	rows, err := db.Queryx("SELECT * FROM users")

	for rows.Next() {
		err = rows.StructScan(&conv.User)
		
    	if err != nil {
        	log.Fatalln(err)
		} 
	
		log.Printf("%#v\n", conv.User)
		
		err = db.Select(&conv.Messages, "SELECT * FROM messages WHERE sender=? OR recipient=?", conv.User.Id, conv.User.Id)

		if err != nil {
			log.Fatalln(err)
		}

		convs = append(convs, conv)
	}

	return convs
}

/*
* Remove conversation from database by single messages
* Messages are removed automatically due to FOREIGN KEY field by removing given user
*/

/*func DeleteConversation(user string){
	removeQuery := `DELETE FROM users WHERE id=?`

	_, err := db.Exec(removeQuery, sender)

	if err != nil {
		log.Printf("Couldn't remove given news from database\n")
	}
}*/


/*
* Storing single message in database messages table
* If client user is not present in users table, given record will be added
*/

func StoreMessage(msg chat.Message){
	searchQuery := `SELECT (id, state) FROM users WHERE user=?`
	insertQuery := `INSERT INTO messages (sender, recipient, content) VALUES (?, ?, ?)`

	var currUser Client
	var err error

	if msg.Sender != "admin" {
		err = db.Get(&currUser, searchQuery, msg.Sender)

		if err == sql.ErrNoRows {
			_, err := db.Exec("INSERT INTO users (id, state) VALUES (?, ?)", msg.Sender, "open")
	
			if err != nil {
				log.Fatalln(err)
				return
			}
		}
	
		if currUser.State == "history" {
			updateQuery := "UPDATE users SET state=open WHERE id=?"
	
			db.Exec(updateQuery, msg.Sender)
		}
	
	}

	_, err = db.Exec(insertQuery, msg.Sender, msg.Recipient, msg.Content)

	if err != nil {
		log.Printf("Couldn't insert message into database!\n")
	}
}

/*func CloseConversation(user string){
	updateQuery := ``
}*/
