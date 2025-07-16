---
title: How to Handle Missing Fields From A Struct in Go?
slug: handle-missing-struct-fields
author: Mohammad Aziz
date: "2020-12-09"
description: "If you want to remove the struct field which is not present while unmarshalling JSON"
tags:
  - golang
  - struct
cover:
  image: "blog/handle-missing-struct-fields/images/dirty-hand.jpg"
  caption: Photo by [Ian](https://unsplash.com/@greystorm?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/dirt?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
---

Suppose you have a variable of type of the struct mentioned below which you
wanted to `Unmarshal`.

```go
type Building struct {
	WindowCount int `json:"window_count"`
	Doors       int `json:"doors"`
}
```

In case the data is coming from an unreliable source, you can never be sure
that the value you will receive will always have the correct format. You
have to be cautious when working around data like this. If you are new in Go
you might be wondering what will happen you `Unmarshal` and incorrect value?

## Compiler Loves Zero Values

If you unmarshal the code into a variable you will get the [zero value](https://dave.cheney.net/2013/01/19/what-is-the-zero-value-and-why-is-it-useful) for the fields
`WindowCount`, and `Doors`. Which in some case can lead to bug because
you might have different logic for missing case.

```go

var b Building
json.Unmarshal([]byte(""), &b)

fmt.Printf("%+v\n", b)


// Output:
// {WindowCount:0 Doors:0}
```

## Pointer To Rescue 🦸

If you have worked with pointers in languages like C, C++ you might have some
opinion. You either like it or you hate it. Most people fall into the later
group. Working with pointers in Golang is fun because things are declarative
comparatively.

_If you set field type to pointer of that type it will be `nil` in case the
field is missing_

```go {hl_lines=["2-3"]}
type Building struct {
	WindowCount *int `json:"window_count"`
	Doors       *int `json:"doors"`
}
```

Unmarshalling it has the following effect:

```go {hl_lines=[2,8]}
var b Building
json.Unmarshal([]byte(`{"window_count": 2}`), &b)

fmt.Printf("%+v\n", b)


// Output:
// {WindowCount:0xc000016170 Doors:<nil>}
```

The `WindowCount` holds the pointer to integer which holds the value 2. Whereas
since `doors` is missing from the JSON string it will set to `nil` thanks to
the zero value of pointers. You can now write your logic in case of the absence
of that value.

## Conclusion

Since the field of a struct is part of the contract of the struct it can't go
missing entirely instead you need to handle it little differently. Most preferable
way is to convert the type to a pointer of the same type and when in some case
the value is missing it will be set to the zero value, which is `nil`.
