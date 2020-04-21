package main

import (
	"fmt"
	"github.com/gorilla/mux"
	"net/http"
	"encoding/json"
)

var News_list []db.News

func main(){
	fmt.Printf("hello, backend server available on port 8000 \n")
	router := mux.NewRouter()

	router.HandleFunc("/news", getAllNews).Methods("GET")
	router.HandleFunc("/news", createNews).Methods("POST")
	
	http.ListenAndServe(":8000", router)
}

func getAllNews(w http.ResponseWriter, r *http.Request){
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(News_list)
}

func createNews(w http.ResponseWriter, r *http.Request){
	var v db.News

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Decode(&v)
}
