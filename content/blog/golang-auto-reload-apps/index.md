---
title: How to Auto Reload Golang Applications?
slug: golang-auto-reload-apps
author: Mohammad Aziz
date: "2020-11-30"
description: "Learn how to reload golang applications without too much manual work"
categories:
  - "golang"
tags:
  - golang
  - reload
  - auto-reload
  - application
  - server
cover:
  image: "blog/golang-auto-reload-apps/images/tim-swaan.jpg"
  caption: "Photo by [Tim Swaan](https://unsplash.com/@timswaanphotography?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/new?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText)"
---

You wanted to develop quick, you wanted to develop fast and there is
nothing more tedious for a developer than doing the same thing again
and again.

I really _HATE_ doing repetitive work. Probably that's why I become a programmer to automate the boring stuff.

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

The above code creates a simple server that listens on port 3000 and if
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

If you are a lazy developer you must be thinking about what is the
the better way to do it?

Your computer can help you will that for sure.

## Conventional way

One of the most popular ways to auto-reload your application on any kind of change is by using [air](https://github.com/cosmtrek/air).

It is written in, no surprise, Go.

To install head over to their [installation](https://github.com/cosmtrek/air#installation) section. Do it, so that you can follow along. If you are feeling lazy then last time when I check their docs this was the command to do it.

```sh
curl -sSfL https://raw.githubusercontent.com/cosmtrek/air/master/install.sh | sh -s -- -b $(go env GOPATH)/bin
```

Is it done? Good.

This command has two parts. First, to download the binary and second, to move the binary to Go's binary path. The binary path is at `$(go env GOPATH)/bin`.

With all the things in place, you might be ready to start using the `air` command. But let's verify it first. Does the below command works?

```sh
air -v
```

If it is, great! If not and you might be getting a command not found error. Most probably the Go binary is not set to your shell's path. Usually, it's fixed by adding the below command to your shell's resource file (e.g. `.zshrc`, `.bashrc`):

```sh
export PATH=$PATH:$(go env GOPATH)/bin
```

Open a new shell after adding the above line so new changes are reflected. Now the previous command should be working.

The next step, run the application! Move to the application which you want to run with the auto-reload feature and just start it with the command mentioned:

```sh
air
```

This will start your application and when you make any changes it will listen to those and reload it automatically.

## Unconventional way

If you are/were a JavaScript developer you might be familiar with the steps mentioned onwards.

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
any change in the go files will execute the `go run .` command again.

## Summary

You can reload your server apps or any other app which needs a constant restart to reflect the changes by using tools like [air](https://github.com/cosmtrek/air) and [nodemon](https://nodemon.io/). Although both methods get your job done I personally use the `air` cli to reload my app because I find it fast and easier to use.
