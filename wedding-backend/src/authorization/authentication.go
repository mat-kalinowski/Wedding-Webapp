package authorization

import (
	"github.com/gorilla/mux"	
	"github.com/dgrijalva/jwt-go"
	"github.com/mat-kalinowski/wedding-backend/models"
	"github.com/auth0/go-jwt-middleware"

	"net/http"
	"encoding/json"
)

var secretKey = []byte("9805217C84EC1A128FBCFE089690F8D626B5DFE8CC3EF6B60E36C363F8BFB567")


func userLogin(w http.ResponseWriter, r *http.Request){
	var user models.User

	err := json.NewDecoder(r.Body).Decode(&user)

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Expose-Headers", "Authorization")

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
	}

	res := models.CheckCredentials(user)

	if res == false {
		http.Error(w, "wrong credentials", http.StatusUnauthorized)
		return 
	}

	/*
	*	Setting JSON web token for authenticated user
	*/

	claims := &jwt.StandardClaims{
		Issuer: "Wedding App 4events",
		Subject: user.Username,
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	ss, err := token.SignedString(secretKey)

	w.Header().Set("Authorization", ss)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func AuthMiddleware(h http.Handler) http.Handler {
	middleware := jwtmiddleware.New(
		jwtmiddleware.Options {
			ValidationKeyGetter: func(token *jwt.Token) (interface{}, error){
				return secretKey, nil
			},
			Extractor: jwtmiddleware.FromFirst(jwtmiddleware.FromAuthHeader,
				jwtmiddleware.FromParameter("auth_token")),
			SigningMethod: jwt.SigningMethodHS256 })
	
	return middleware.Handler(h)
}

func SetupRoutes(router *mux.Router) {
	router.HandleFunc("/admin/login", userLogin).Methods("POST")
}