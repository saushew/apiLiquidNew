package controllers

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net"
)

func GetLocalIP() string {
	addrs, err := net.InterfaceAddrs()
	if err != nil {
		return ""
	}
	for _, address := range addrs {
		// check the address type and if it is not a loopback the display it
		if ipnet, ok := address.(*net.IPNet); ok && !ipnet.IP.IsLoopback() {
			if ipnet.IP.To4() != nil {
				return ipnet.IP.String()
			}
		}
	}

	return ""
}

func getRoot2() string {
	ip := GetLocalIP()
	fmt.Println("ip", ip)
	// root := "/Users/roman/Desktop/newLiquid/liquidbot/"
	root := "/Users/saushew/Roma/gotbitTraidingBot/newLiquid/liquidbot/"
	if ip == "212.224.118.25" {
		root = "/home/fil/newLiquid/liquidbot/"
	} else if ip == "212.224.118.141" {
		root = "/home/fil/newLiquid/liquidbot/"
	} else if ip == "212.224.113.213" {
		root = "/home/fil/newLiquid/liquidbot/"
	} else if ip == "5.187.1.249" {
		root = "/home/roma/newLiquid/liquidbot/"
	} else if ip == "91.228.152.50" {
		root = "/home/roma/newLiquid/liquidbot/"
	} else if ip == "91.228.153.40" {
		root = "/home/roma/newLiquid/liquidbot/"
	} else if ip == "185.26.99.149" {
		root = "/home/roma/newLiquid/liquidbot/"
	} else if ip == "185.26.98.97" {
		root = "/home/roma/newLiquid/liquidbot/"
	} else if ip == "185.26.97.56" {
		root = "/home/roma/newLiquid/liquidbot/"
	} else if ip == "185.26.97.54" {
		root = "/home/roma/newLiquid/liquidbot/"
	}

	fmt.Println("root2", root)

	return root
}

func getRoot() string {
	ip := GetLocalIP()
	fmt.Println("ip", ip)
	// root := "/Users/roman/Desktop/newLiquid/apiLiquid/"
	root := "/Users/saushew/Roma/gotbitTraidingBot/newLiquid/apiLiquid/"
	if ip == "212.224.118.25" {
		root = "/home/fil/newLiquid/apiLiquid/"
	} else if ip == "212.224.118.141" {
		root = "/home/fil/newLiquid/apiLiquid/"
	} else if ip == "212.224.113.213" {
		root = "/home/fil/newLiquid/apiLiquid/"
	} else if ip == "5.187.1.249" {
		root = "/home/roma/newLiquid/apiLiquid/"
	} else if ip == "91.228.152.50" {
		root = "/home/roma/newLiquid/apiLiquid/"
	} else if ip == "91.228.153.40" {
		root = "/home/roma/newLiquid/apiLiquid/"
	} else if ip == "185.26.99.149" {
		root = "/home/roma/newLiquid/apiLiquid/"
	} else if ip == "185.26.98.97" {
		root = "/home/roma/newLiquid/apiLiquid/"
	} else if ip == "185.26.97.56" {
		root = "/home/roma/newLiquid/apiLiquid/"
	} else if ip == "185.26.97.54" {
		root = "/home/roma/newLiquid/apiLiquid/"
	}

	fmt.Println("root", root)

	return root
}

var root = getRoot()
var root2 = getRoot2()

func ReadJsonStats(path string, data *statStruct) error {
	rawDataIn, err := ioutil.ReadFile(root2+path)
	if err != nil {
		return err
	}

	err = json.Unmarshal(rawDataIn, &data)
	if err != nil {
		return err
	}

	return nil
}

func ReadJsonOrders(path string, data *[]orderStruct) error {
	rawDataIn, err := ioutil.ReadFile(root2+path)
	if err != nil {
		return err
	}

	err = json.Unmarshal(rawDataIn, &data)
	if err != nil {
		return err
	}

	return nil
}

func ReadJsonSettingsInfo(path string, data *SettingsInfo) error {
	rawDataIn, err := ioutil.ReadFile(root2 + path)
	if err != nil {
		return err
	}

	err = json.Unmarshal(rawDataIn, &data)
	if err != nil {
		return err
	}

	return nil
}

func ReadWriteSettingsAdmin(path string, data SettingsInfo) error {
	fmt.Println(path, data, root2)
	rawDataIn, err := ioutil.ReadFile(root2 + path)
	if err != nil {
		return err
	}

	var tmp SettingsInfo

	err = json.Unmarshal(rawDataIn, &tmp)
	if err != nil {
		return err
	}
	fmt.Println("tmp", tmp)
	rawDataOut, err := json.MarshalIndent(&data, "", "  ")
	if err != nil {
		return err
	}

	fmt.Println(string(rawDataOut))

	err = ioutil.WriteFile(root2+path, rawDataOut, 0)
	if err != nil {
		return err
	}

	return nil
}
