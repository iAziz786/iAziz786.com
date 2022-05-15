---
title: How to Work with Arbitrary JSON in Go?
slug: golang-arbitrary-json
author: Mohammad Aziz
date: "2020-12-30"
description: "Many times you come across JSON which has very arbitrary in structure, Learn how you can handle them to get to in Go"
categories:
  - "golang"
tags:
  - golang
  - json
  - arbitrary
  - interface
  - map
cover:
  image: "blog/golang-arbitrary-json/images/aribrary-sand.jpg"
  caption: "Photo by [magnezis magnestic](https://unsplash.com/@agneska?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/backgrounds/nature?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)"
---

## Abstract

Mostly, when you are working with data you know the schema in which you will receive that data, but there come times when you don't know exactly what will be the structure you will end up receiving. We talk about how you can handle JSON data which are arbitrary in Go.

## JSON with a Fixed Structure

When you receive JSON for which you already know the structure, it is pretty easy to work with. You create a `struct` and unmarshal the bytes to that struct and the JSON package will take care of the rest. Suppose you receive information about today's dinner in JSON and everyday dinner has the following structure.

```go
type Dinner struct {
    MainCourse   string  `json:"main_course"`
    Beverage     string  `json:"beverage"`
    HasDessert   bool    `json:"has_dessert"`
}
```

And you receive the following JSON value:

```go
food := []byte(`
{
  "main_course": "Biryani",
  "beverage": "Coca Cola",
  "has_dessert": true
}
`)
```

You just need to create a variable which can hold the value from JSON.

```go
var dinner Dinner
```

Eventually, decode the values to the `dinner` variable like this:

```go
json.Unmarshal(food, &dinner)
```

Now, you can access those values through the fields on the struct. Lucky you, you have dessert for today 😋.

```go
dinner.MainCourse   // Biryani
dinner.HasDessert   // true
```

## JSON That You Are Not Aware

Let's diverge our mind from food to shopping list :). Now assume every weekend you go to purchase some grocery and the items in the list keep changing each week. If you have to represent that into a struct, you got no luck!

Like almost everything in Go where so much randomness is evolved, you have to use interfaces. More particularly an empty interface. You can represent your shopping list like this:

```go
var shoppingList interface{}
```

Because an empty interface can satisfy any type you can use that to do Unmarshaling.

```go {hl_lines=[15]}
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
```

At this point `shoppingList` looks like this:

```go
shoppingList = map[string]interface{
    "food": map[string]interface{
        "ketchup": "1pc",
        "noodles": "1pc",
        "rice": "2Kg"
    },
    "utensils": map[string]interface{
        "knives": 2,
        "forks": 3
    }
}
```

To access the data, you can make a type assertion to `map[string]interface{}`.

```go
list := shoppingList.(map[string]interface{})
```

After that, you can access the values like a regular map. But for the values that are nested, you **need to do a type assertion again**.

```go
utensils := list["utensils"].(map[string]interface{})

utensils["forks"] // 3
```

## Conclusion

You can handle arbitrary JSON with the help of interfaces. You just need to pass an empty interface to the Unmarshal function and the JSON data. After a type assertion, you are good to use the arbitrary fields and their values.
