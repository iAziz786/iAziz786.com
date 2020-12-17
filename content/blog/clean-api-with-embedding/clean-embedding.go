package main

import "fmt"

type Morning struct {
	breakfast bool
}

func (m Morning) hasBreakfast() bool {
	return m.breakfast
}

type Routine struct {
	Morning
}

func (r *Routine) Sleep() bool {
	fmt.Printf("%+v", r.Morning)
	return r.Morning.breakfast
}

func main() {
	r := Routine{}

	fmt.Println(r.Sleep())
}
