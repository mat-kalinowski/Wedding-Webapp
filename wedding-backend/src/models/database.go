package models 

import (
	"log"
	"github.com/jmoiron/sqlx"
	"github.com/mattn/go-sqlite3"
)

var db *sqlx.DB
var migrationsPath = "./migrations/wdapp.db"

func InitDB(dbName string) {
	var err error 

	db, err = sqlx.Open("sqlite3", migrationsPath)

	if err != nil {
		log.Fatalln(err)
	}

	if err = db.Ping(); err != nil {
		log.Fatalln(err)
	}
}