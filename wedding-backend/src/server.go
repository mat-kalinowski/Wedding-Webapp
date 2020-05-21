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

	models.CreateAdminUser(models.User{Username: "mateusz", Password: "nakamura"})

	router.HandleFunc("/news", corsHandler).Methods("OPTIONS")
	router.HandleFunc("/news", getAllNews).Methods("GET")
	router.Handle("/news", AuthMiddleware(http.HandlerFunc(storeNews))).Methods("POST")
	router.Handle("/news", AuthMiddleware(http.HandlerFunc(deleteNews))).Methods("DELETE")
	models.SetupRoutes(router)
	SetupRoutes(router)

	http.ListenAndServe(":8000", router)
}

func corsHandler(w http.ResponseWriter, r *http.Request){
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

}

/*
*	Temporary development stage CORS preflight handler
*/

/*func corsHandler(fn http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		fmt.Printf("Method asked => %s\n", r.Method)
	  if (r.Method == "OPTIONS") {
		fmt.Printf("Handling OPTIONS preflight request\n")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	  } else {
		fmt.Printf("Handling normal request\n")
		fn(w,r)
	  }
	}
}*/

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

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")
}

func deleteNews(w http.ResponseWriter, r *http.Request) {
	var delNews models.News

	err := json.NewDecoder(r.Body).Decode(&delNews)
	
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
	}

	models.DeleteNews(delNews)

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")
}
