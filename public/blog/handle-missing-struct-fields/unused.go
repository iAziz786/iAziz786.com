package main

import (
	"encoding/json"
	"fmt"
)

// Building is a struct
type Building struct {
	WindowCount *int `json:"window_count"`
	Doors       *int `json:"doors"`
}

func main() {
	var b Building
	json.Unmarshal([]byte(`{"window_count": 2}`), &b)

	fmt.Printf("%+v\n", b)
}
