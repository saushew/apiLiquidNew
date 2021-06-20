package main

import (
	"context"
	"fmt"
	"go-liquid/controllers"
	"log"
	"net/http"
	"os"
	"os/signal"
	"runtime/debug"
	"time"

	"github.com/gorilla/mux"
)

func main() {
	defer func() {
		if r := recover(); r != nil {
			log.Printf("panic in main %s\n%#v\n", string(debug.Stack()), r)
		}
	}()

	router := mux.NewRouter()
	// router.HandleFunc("/api/user/new", controllers.CreateAccount).Methods("POST")
	// router.HandleFunc("/api/user/login", controllers.Authenticate).Methods("POST")

	// router.HandleFunc("/api/balances/{path}", controllers.GetBalances).Methods("GET")
	// router.HandleFunc("/api/hashs/{path}", controllers.GetHashs).Methods("GET")

	router.HandleFunc("/api/get_liquid_settings/{path}", controllers.GetSettingsInfo).Methods("GET")
	router.HandleFunc("/api/set_liquid_settings/{path}", controllers.SetSettingsInfo).Methods("POST")

	router.HandleFunc("/api/get_liquid_stats/{path}", controllers.GetStats).Methods("GET")

	router.HandleFunc("/api/run_liquid/{path}", controllers.RunBot_).Methods("POST")
	router.HandleFunc("/api/check_liquid/{path}", controllers.CheckBot).Methods("GET")
	router.HandleFunc("/api/stop_liquid/{path}", controllers.StopBot).Methods("GET")
	// router.HandleFunc("/api/create_liquid/{path}", controllers.CreateBot).Methods("POST")

	// router.Use(app.JwtAuthentication) //attach JWT auth middleware

	port := os.Getenv("PORT") //Получить порт из файла .env; мы не указали порт, поэтому при локальном тестировании должна возвращаться пустая строка
	if port == "" {
		port = "3333" //localhost
	}

	fmt.Println(port)

	srv := &http.Server{
		Addr:         ":" + port,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
		// IdleTimeout: 120 * time.Second,
		Handler: router,
	}

	go func() {
		if err := srv.ListenAndServe(); err != http.ErrServerClosed {
			log.Printf(err.Error())
		}
	}()

	// Ожидание сигнала
	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt)
	<-c

	// Попытка корректного завершения
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	srv.Shutdown(ctx)

	log.Printf("closes\n")
}
