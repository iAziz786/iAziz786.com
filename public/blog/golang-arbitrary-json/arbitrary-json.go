package main

import (
	"encoding/json"
	"fmt"
)

func main() {
	var shoppingList interface{}
	listJSON := []byte(`
{
  "food": {
    "ketchup": "1pc",
    "noodles": "1pc",
    "rice": "2Kg"
  },
  "utensils": {
    "knives": 2,
    "forks": 3
  }
}
`)

	json.Unmarshal(listJSON, &shoppingList)

	list := shoppingList.(map[string]interface{})

	utensils := list["utensils"].(map[string]interface{})

	fmt.Println(utensils["forks"])
}
