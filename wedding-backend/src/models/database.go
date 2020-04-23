package models

import (
	"log"
	"github.com/jmoiron/sqlx"
	_ "github.com/mattn/go-sqlite3"
)

var db *sqlx.DB
var migrationsPath = "/root/models/migrations/wdapp.db"

func InitDB() {
	var err error

	db, err = sqlx.Connect("sqlite3", migrationsPath)

	if err != nil {
		log.Fatalln(err)
	}
}
