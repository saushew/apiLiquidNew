package controllers

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"os"
	"os/exec"
	"strings"

	"github.com/gorilla/mux"

	// "go-swap/models"
	"fmt"
	u "go-liquid/utils"
	"net/http"
)

const FileNameSettingsInfo = "settings_info.json"
const FileNameSettings = "settings.json"

type SettingsInfo struct {
	Profit      float64 `json:"profit"`
	PeriodCheck int     `json:"periodCheck"`
	Amount      float64 `json:"amount"`
	MinPrice    float64 `json:"minPrice"`
	MaxPrice    float64 `json:"maxPrice"`
	OrderNum    int     `json:"orderNumber"`
}

var GetSettingsInfo = func(w http.ResponseWriter, r *http.Request) {
	fmt.Println(" request", "/api/get_liquid_settings/{path}")

	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r)

	path := "local/" + strings.Split(params["path"], "_")[2] + "/" + strings.ToLower(params["path"]) + "/"
	var data SettingsInfo

	err := ReadJsonSettingsInfo(path+FileNameSettingsInfo, &data)
	if err != nil {
		resp := u.Message(true, "Error in ReadJsonSettingsInfo with this path: "+params["path"]+"   Error: "+err.Error())
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

var SetSettingsInfo = func(w http.ResponseWriter, r *http.Request) {
	fmt.Println(" request", "/api/set_liquid_settings/{path}")

	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r)

	client, err := runRedis()
	if err != nil {
		u.Respond(w, u.Message(true, "Error in runRedis"+"   Error: "+err.Error()))
		return
	}

	path := "local/" + strings.Split(params["path"], "_")[2] + "/" + strings.ToLower(params["path"]) + "/"

	data := &SettingsInfo{}
	err = json.NewDecoder(r.Body).Decode(data) //decode the request body into struct and failed if any error occur
	if err != nil {
		u.Respond(w, u.Message(true, "Invalid request"))
		return
	}

	err = ReadWriteSettingsAdmin(path+FileNameSettingsInfo, *data)
	if err != nil {
		u.Respond(w, u.Message(true, "Error in ReadWriteSettingsAdmin with this path: "+params["path"]+"   Error: "+err.Error()))
		return
	}

	err = RedisSet(client, "settings_liquid_edit_"+params["path"], "true")
	if err != nil {
		u.Respond(w, u.Message(true, "Error in RedisSet path with this path: "+params["path"]+"   Error: "+err.Error()))
		return
	}

	u.Respond(w, u.Message(false, "success"))
}

var RunBot = func(w http.ResponseWriter, r *http.Request) {
	fmt.Println(" request", "/api/run_bot/{path}")

	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r)

	path := "local/" + strings.Split(params["path"], "_")[2] + "/" + strings.ToLower(params["path"])

	fmt.Println(path)

	cmd := &exec.Cmd{
		Path: "./launch.sh",
		Dir:  root,
		Args: []string{"./launch.sh", path},
	}

	// run command
	go func() {
		if output, err := cmd.Output(); err != nil {
			fmt.Println(err.Error())
			u.Respond(w, u.Message(true, "Error: "+err.Error()))
			return
		} else {
			fmt.Println(string(output))
		}
	}()

	u.Respond(w, u.Message(false, "success"))
}

var StopBot = func(w http.ResponseWriter, r *http.Request) {
	fmt.Println(" request", "/api/stop_bot/{path}")

	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r)

	path := strings.ToLower(params["path"])

	cmd := &exec.Cmd{
		Path: "stop.sh",
		Dir:  root,
		Args: []string{"./stop.sh", path},
	}

	// run command
	if output, err := cmd.Output(); err != nil {
		u.Respond(w, u.Message(true, "Error: "+err.Error()))
		return
	} else {
		fmt.Println(string(output))
	}

	u.Respond(w, u.Message(false, "success"))
}

var CheckBot = func(w http.ResponseWriter, r *http.Request) {
	fmt.Println(" request", "/api/check_bot/{path}")

	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r)

	path := strings.ToLower(params["path"])

	cmd := &exec.Cmd{
		Path: "check.sh",
		Dir:  root,
		Args: []string{"./check.sh", path},
	}

	// run command
	if output, err := cmd.Output(); err != nil {
		resp := u.Message(false, "Error: "+err.Error())
		resp["run"] = false
		u.Respond(w, resp)

		fmt.Println("Error: " + err.Error())
		return
	} else {
		fmt.Println(string(output))
	}

	resp := u.Message(false, "success")
	resp["run"] = true
	u.Respond(w, resp)
}

var CreateBot = func(w http.ResponseWriter, r *http.Request) {
	fmt.Println(" request", "/api/set_liquid_settings/{path}")

	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r)

	path := "../liquidbot/local/" + strings.Split(params["path"], "_")[2] + "/" + strings.ToLower(params["path"]) + "/"

	if _, err := os.Stat(path); !os.IsNotExist(err) {
		u.Respond(w, u.Message(true, "Dir already exist. Use run!"))
		return
	}

	// do JSON
	src, _ := ioutil.ReadAll(r.Body)
	data := &bytes.Buffer{}
	json.Indent(data, src, "", "  ")

	// make dirs and file
	err := os.MkdirAll(path, 0777)
	if err != nil {
		fmt.Println(err)
	}

	file, err := os.Create(path + FileNameSettings)
	if err != nil {
		fmt.Println(err)
	}
	defer file.Close()

	file.WriteString(data.String())

	u.Respond(w, u.Message(false, "success"))
}
