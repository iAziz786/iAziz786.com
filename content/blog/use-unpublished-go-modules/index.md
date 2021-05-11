---
title: How to Use Unpublished Go Modules in Your Local Projects?
slug: use-unpublished-go-modules
author: Mohammad Aziz
date: "2021-05-10"
category: "golang"
description: "When you are developing a module, learn how you can import and test them in other go projects before publishing it."
banner: "./images/two-white-shoes.jpg"
credits: "Photo by [Mathias Arlund](https://unsplash.com/@arlund?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/pieces?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)"
keywords:
  - golang
  - go
  - modules
  - unpublished
  - replace
  - go modules
---

## Context

While developing any go applications you might come into a situation where you need to use a module that is not yet ready to publish. The module might be living on your local machine and you wanted to get the taste of it using with other projects before shipping it. In this post, we will discuss what approach you can take to import a module that is still in development and before publishing it to the package registry.

We will write a simple project which takes a string and returns a boolean whether the string is valid [IP address][1] or not. The functionality is not that important but the important part is how we integrate it into another project while _still making changes_ to the project.

## Projects Layout

To keep things simple, I have created two projects which live side by side. The `wip-module` project is the unpublished one and the `tester-module` is the one in which will import the unpublished `wip-module` project. You can find the folder structure on [Github][github-unpublished-link].

<p></p>
<Image src="./images/two-folders.png" />

## WIP Project

The `wip-module` is a simple go module that holds the implementation of checking whether the IP is valid or not. Let's look into the file:

wip-module/ipchecker.go

```go
package ipchecker

import (
    "net"
)

func IsValidIP(host string) bool {
    if ip := net.ParseIP(host); ip != nil {
        return true
    }

    return false
}
```

This module does not have the main package which means it was intended to be used as a library in other projects.

## Tester Project

This is the project which will import the `ipchecker` package. Here is how it looks:

tester-module/main.go

```go{6}
package main

import (
    "fmt"

    ipchecker "github.com/iAziz786/wipmodule"
)

func main() {
    fmt.Println("valid IP = ", ipchecker.IsValidIP("127.0.0.1"))
    fmt.Println("valid IP = ", ipchecker.IsValidIP("invalid-ip"))
}

// Output:
// valid IP =  true
// valid IP =  false
```

As you can see it's using the `ipchecker` package from the `github.com/iAziz786/wipmodule` module. At this point, if you run the `tester-module` program you will see an error related to the package. Let's glue them together!

## Using Unpublished Modules

Before we do anything let's look at the `go.mod` file of the `tester-module`.

tester-module/go.mod

```
module github.com/iAziz786/testermodule

go 1.16

require github.com/iAziz786/wipmodule v0.0.0-unpublished
```

Since the module is not published we gave it a version (`v0.0.0-unpublished`) that does not exist yet but to make things work correctly.

The next step is to replace the import behaviour for the wipmodule. We can do this by telling the go compiler to replace the import for `github.com/iAziz786/wipmodule` with the local path of the module. Since they are siblings, I can use relative path dot (`..`) notation.

```sh
go mod edit -replace=github.com/iAziz786/wipmodule@v0.0.0-published=../wip-module
go get -d github.com/iAziz786/wipmodule@v0.0.0-published
```

This will add a replacement in the `go.mod` of the `tester-module`.

tester-module/go.mod

```{7}
module github.com/iAziz786/testermodule

go 1.16

require github.com/iAziz786/wipmodule v0.0.0-unpublished

replace github.com/iAziz786/wipmodule v0.0.0-unpublished => ../wip-module
```

Can you notice a replace directive at the end of the file? It adds the logic to tell `go get` to use the implementation which is one level up in the `wip-module`.

Now if you will run the program in the `tester-module` you will see this output:

```sh
$ cd tester-module
$ go run .

# Output
valid IP =  true
valid IP =  false
```

**Note**: Make sure to remove the replace directive from go.mod of the tester module before you commit your changes, otherwise `go get` will break in non-local environment.

## Conclusion

We have used the golang's module [replace directive](https://golang.org/ref/mod#go-mod-file-replace) to use the local go module which is not a published module to import it into the other projects.

## Reference

https://golang.org/doc/modules/managing-dependencies#unpublished

https://golang.org/ref/mod#go-mod-file-replace

[github-unpublished-link]: https://github.com/iAziz786/unpublished-go-module
[1]: https://en.wikipedia.org/wiki/IP_address
