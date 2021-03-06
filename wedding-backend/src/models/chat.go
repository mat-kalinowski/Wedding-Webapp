package models

import (
	"log"
	"database/sql"
)

type Client struct{
	Id string `json:"id" db:"id"`
	State string `json:"state" db:"state"`
}

type Conversation struct {
	User Client `json:"user"`
	Messages []Message `json:"messages"`
}

type Message struct {
    Recipient string `json:"recipient" db:"recipient"`
    Sender string `json:"sender" db:"sender"`
    Content string `json:"content" db:"content"`
    Type string `json:"type"`
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
	rows, err := db.Queryx("SELECT * FROM users")

	for rows.Next() {
		var conv Conversation
		err = rows.StructScan(&conv.User)
		
    	if err != nil {
        	log.Fatalln(err)
		} 
			
		err = db.Select(&conv.Messages, "SELECT recipient, sender, content FROM messages WHERE sender=? OR recipient=?", conv.User.Id, conv.User.Id)

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

func DeleteConversation(user string){
	removeQuery := `DELETE FROM users WHERE id=?`

	_, err := db.Exec(removeQuery, user)

	if err != nil {
		log.Printf("Couldn't remove given user and its conversation from database!\n")
	}
}

/*
* Storing single message in database messages table
* If client user is not present in users table, given record will be added
*/

func StoreMessage(msg Message){
	searchQuery := `SELECT id, state FROM users WHERE id=?`
	insertQuery := `INSERT INTO messages (sender, recipient, content) VALUES (?, ?, ?)`

	var currUser Client
	var err error

	if msg.Sender != "admin" {
		err = db.Get(&currUser, searchQuery, msg.Sender)

		if err == sql.ErrNoRows {
			log.Printf("inserting user into database \n")
			_, err := db.Exec("INSERT INTO users (id, state) VALUES (?, ?)", msg.Sender, "open")
	
			if err != nil {
				log.Fatalln(err)
				return
			}
		}
	
		if currUser.State == "history" {
			updateQuery := `UPDATE users SET state="open" WHERE id=?`
			db.Exec(updateQuery, msg.Sender)
		}
	
	}

	_, err = db.Exec(insertQuery, msg.Sender, msg.Recipient, msg.Content)

	if err != nil {
		log.Printf("Couldn't insert message into database!\n")
	}
}

func CloseConversation(user string){
	updateQuery := `UPDATE users SET state="history" WHERE id=?`

	_, err := db.Exec(updateQuery, user)

	if err != nil {
		log.Printf("Couldn't set conversation state to history!\n");
	}

}
