package models

import (
	"log"
)

type News struct {
	Title string 
	Content string 
	Date string 
}

/*
*	Adds single news into database
*/

func StoreNews(News nw) {
	insertQuery := `INSERT INTO news (title, content, creation_date)
					VALUES (?, ?, ?)`

	db.MustExec(insertQuery, nw.Title, nw.Content, nw.Date)
}

/*
*	Gets all news from database and returns a slice
*/

func GetNews(newsArr []News){
	searchQuery := `SELECT * FROM news`

	err := db.Select(newsArr, searchQuery)

	if err := nil {
		log.Fatalln(err)
	}
}