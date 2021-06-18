package controllers

import (
	"strings"

	"github.com/gorilla/mux"
	// "encoding/json"
	// "go-swap/models"
	"fmt"
	u "go-liquid/utils"
	"net/http"
)

const FileNameStats = "statistics.json"

type statStruct struct {
	Timestamp int64 `json:"timestamp"`
	Profit  float64 `json:"profit"`
	Buys    int     `json:"num_buys"`
	Sells   int     `json:"num_sells"`
	Counter int     `json:"arbs_counter"`
}

var GetStats = func(w http.ResponseWriter, r *http.Request) {
	fmt.Println(" request", "/api/get_liquid_stats/{path}")

	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r)

	path := "local/" + strings.Split(params["path"], "_")[2] + "/" + strings.ToLower(params["path"]) + "/"

	var data statStruct

	err := ReadJsonStats(path+FileNameStats, &data)
	if err != nil {
		resp := u.Message(true, "Error in ReadJsonStats with this path: "+params["path"]+"   Error: "+err.Error())
		resp["exist"] = false
		resp["data"] = data
		u.Respond(w, resp)
		return
	}

	fmt.Println(data)

	resp := u.Message(false, "success")
	resp["exist"] = true
	resp["data"] = data
	u.Respond(w, resp)
}
