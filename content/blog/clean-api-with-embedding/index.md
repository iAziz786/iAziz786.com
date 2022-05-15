---
title: How to Use Embedding to Write Cleaner Code in Go?
slug: clean-code-with-embedding-in-go
author: Mohammad Aziz
date: "2020-12-17"
categories:
  - "golang"
description: "Know how borrowing a type can give you clean code"
tags:
  - golang
  - embedding
  - api
  - clean

cover:
  image: blog/clean-code-with-embedding-in-go/images/golang-embedding-og.png
  caption: Photo by [Amir Esrafili](https://unsplash.com/@amirvisuals?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/abstract-background?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
---

## Abstract

Go is cleaner because it doesn't support many of the features that tradition OO languages support. _Less is more_. Inheritance is one of those features but Go has a different style which can fulfil the necessity of inheritance. It's called Embedding.

## What is embedding

You can "borrow" the functionality of a struct or interface into another struct and interface respectively is called embedding. You can not embed an interface into a struct or vice versa.

## How to create embedding

To create an embedding you need to put a different struct or interface into a different one without naming the field.

```go {hl_lines=[6, "18-19"]}
type Morning struct {
  breakfast bool
}

type Routine struct {
  Morning // ⬅️ no field name makes it embedded
}

type Director interface {
  Direct()
}

type Producer interface {
  Produce()
}

type Creator interface {
  Director
  Producer
}
```

## Embedding In Interface

Interface when embedded is the union of all the methods present in all of the interfaces combined. If method `Eat()` is present on an interface and `Sleep()` on another then embedding them into an interface with `Repeat()` method will have all, `Eat()`, `Sleep()`, and `Repeat()` methods.

## Embedding In Struct

Embedding in a struct is where you can see the real power of Go. Not only the fields that [defined type](https://golang.org/ref/spec#Type_definitions) has but also the methods you can access them directly. How cool is that! Let's continue with our Routine struct.

```go {hl_lines=["5-7",15]}
type Morning struct {
  breakfast bool
}

func (m Morning) hasBreakfast() bool {
  return m.breakfast
}

type Routine struct {
  Morning
}

r := Routine{}

r.hasBreakfast() // false
```

You also the embedded type will be a field name on the struct. For example, you can have:

```go {hl_lines=[9]}
type DailySports struct {
  Jog            // field name Jog
  *Swim          // field name Swim
  sports.Cycling // field name Cycling
  *sports.Tennis // field name Tennis
}

func (d DailySports) enrolledBySwimming() bool {
  return d.Swim.Speed
}
```

But you cannot have conflict while embedding. This makes sense otherwise you won't know which one to pick.

```go
struct {
  *Swim         // ⛔ Now allowed
  *sports.Swim  // ⛔ Not allowed
}
```

You can do all the things you can with the promoted fields but you can not use the field name present in the defined type while constructing the struct.

```go {hl_lines=[9]}
type Morning struct {
  breakfast bool
}

type Routine struct {
  Morning
}

r := Routine{breakfast: true} // ⛔ Not allowed
```

## Conclusion

You can use embedding to use any defined type to used inside a struct and borrow all the functionality it has. You need to check that the names don't clash otherwise you are good to go.

## Reference

1. https://golang.org/doc/effective_go.html#embedding
2. https://golang.org/ref/spec#Struct_types
