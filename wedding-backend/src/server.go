package main

import (
	"github.com/mat-kalinowski/wedding-backend/models"

	"fmt"
	"net/http"
	"encoding/json"
	"github.com/gorilla/mux"
)

func main(){
	fmt.Printf("hello, backend server available on port 8000 :) \n")

	router := mux.NewRouter()
	models.InitDB()

	router.HandleFunc("/news", getAllNews).Methods("GET")
	router.HandleFunc("/news", storeNews).Methods("POST")
	router.HandleFunc("/news", deleteNews).Methods("DELETE")
	models.SetupRoutes(router)

	http.ListenAndServe(":8000", router)
}

func getAllNews(w http.ResponseWriter, r *http.Request) {
	var newsList []models.News

	models.GetNews(&newsList)

	w.Header().Set("Content-Type", "application/json")

	/*
	* CORS allowing header for development server
	*/
	w.Header().Set("Access-Control-Allow-Origin", "*")
	json.NewEncoder(w).Encode(newsList)
}

func storeNews(w http.ResponseWriter, r *http.Request) {
	var currNews models.News

	err := json.NewDecoder(r.Body).Decode(&currNews)

	if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
	}

	models.StoreNews(currNews)

	w.Header().Set("Content-Type", "application/json")
}

func deleteNews(w http.ResponseWriter, r *http.Request) {
	var delNews models.News

	err := json.NewDecoder(r.Body).Decode(&delNews)
	
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
	}

	models.DeleteNews(delNews)

	w.Header().Set("Content-Type", "application/json")
}