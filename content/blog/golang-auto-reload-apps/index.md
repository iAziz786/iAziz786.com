---
title: How to Auto Reload Golang Applications?
slug: golang-auto-reload-apps
author: Mohammad Aziz
date: "2020-11-30"
category: "golang"
description: "Learn how to reload golang applications without too much manual work"
banner: "./images/tim-swaan.jpg"
credits: "Photo by [Tim Swaan](https://unsplash.com/@timswaanphotography?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/new?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText)"
keywords:
  - golang
  - reload
  - auto-reload
  - application
  - server
---

You wanted to develop quick, you wanted to develop fast and there is
nothing more tedious for a developer than doing the same thing again
and again.

I really _HATE_ doing repetitive work.

## Foundation (a server)

I have been exploring Go, you might be aware since my previous post was
written for itself. You can spin up a simple Go server with the following
code.

```go
package main

import "net/http"

func handler(w http.ResponseWriter, r *http.Request) {
  fmt.Fprintln(w, "hello")
}

func main() {
  http.HandleFunc("/echo", handler)

  http.ListenAndServe(":3000", nil)
}
```

The above code creates a simple server which listens on port 3000 and if
you hit `http://localhost:3000/echo` you will receive "hello" as a message.

To run the go server we should run the command below

```sh
go run .
```

I call this the "tedious code". I don't care about it but I care what it
does for me, it runs my application.

## I want changes, right now!

Now, if you do any changes to the code you have run the "tedious code" again, and again, and again...

You get it 🙄

If you are a lazy developer you must be thinking what is the
the better way to do it?

Your computer can help you will that for sure.

Firstly, you need to install [Node.js](https://nodejs.org/en/download/).

I know, you must be thinking about how Node.js can help you to reload your Go code?
Just bear with me and you will know how.

Once Node.js is installed on your system you will be able to run the
command below.

```sh
npm install -g nodemon
```

It will install a package called nodemon in your system and you will be
able to run it from the command line.

## Command to Auto Reload

Now you can start you Go application with the command mentioned below.

```sh
nodemon --exec go run . --ext go
```

Let's break it down.

It will watch for any files with `.go` extension in the current directory and if
any change in the go files it will execute the `go run .` command again.

## Summary

By using nodemon you can reload your any application, not just Go, by providing the command
to run in the `--exec` command and specifying which extensions to watch and
if there is any change in the provided extensions, nodemon will execute the command specified in the `--exec` again.
