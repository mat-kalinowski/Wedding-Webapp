package models

import (
	"log"
)

type News struct {
	Id int  `json:"id" db:"id"`
	Title string  `json:"title" db:"title"`
	Content string `json:"content" db:"content"`
	Date string  `json:"creation_date" db:"date"`
}

/*
*	Adds or updates single news into database
*/

func StoreNews(nw News) {

	if nw.Id >= 0 {
		updateQuery := `UPDATE news SET title=?, content=? WHERE id=?`

		_, err := db.Exec(updateQuery, nw.Title, nw.Content, nw.Id)

		if err != nil {
			log.Printf("Couldn't update news in database\n")
			log.Fatalln(err)
		}

	} else {
		insertQuery := `INSERT INTO news (title, content, date)
		VALUES (?, ?, ?)`

		_, err := db.Exec(insertQuery, nw.Title, nw.Content, nw.Date)

		if err != nil {
			log.Printf("Couldn't insert news into database\n")
		}
	}
}

/*
*	Gets all news from database and returns a slice
*/

func GetNews(newsArr *[]News) {
	searchQuery := `SELECT * FROM news` 

	err := db.Select(newsArr, searchQuery)

	if err != nil {
		log.Fatalln(err)
	}
}

/*
*	Removes given news from database
*/

func DeleteNews(nw News) {
	removeQuery := `DELETE FROM news WHERE title=? AND date=?`

	_, err := db.Exec(removeQuery, nw.Title, nw.Date)

	if err != nil {
		log.Printf("Couldn't remove given news from database\n")
	}
}