package models

import (
	"log"
	"crypto/sha256"
	"bytes"
)

type User struct {
	Id int  `json:"id" db:"id"`
	Username string  `json:"username" db:"username"`
	Password string `json:"password" db:"password"`
}

func CreateAdminUser(u User){
	searchQuery := `SELECT username FROM admins WHERE username=?` 

	insertQuery := `INSERT INTO admins (username, password)
					VALUES (?, ?)`

	var result User
	var err error

	err = db.Get(&result, searchQuery, u.Username)

	if err == nil {
		log.Printf("User exists in database: %s\n", u.Username)
		return
	}

	h := sha256.New()
	h.Write([]byte(u.Password))

	_, err = db.Exec(insertQuery, u.Username, h.Sum(nil))

	if err != nil {
		log.Printf("Couldn't create %s account: %s\n", u.Username, err)
	}
}

func DeleteAdminUser(u User){
	deleteQuery := `DELETE FROM admins WHERE username=?` 

	_, err := db.Exec(deleteQuery, u.Username)

	if err != nil {
		log.Printf("Couldn't delete admin account\n")
	}
}

func CheckCredentials(u User) bool {
	var result User

	searchQuery := `SELECT username, password FROM admins WHERE username=?`
	h := sha256.New()

	err := db.Get(&result, searchQuery, u.Username)

	if err != nil{
		log.Printf("Couldn't find username in database\n")
		return false
	}

	h.Write([]byte(u.Password))

	if bytes.Compare(h.Sum(nil), []byte(result.Password)) == 1 {
		return false
	}

	return true

}