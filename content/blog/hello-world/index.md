---
title: Hello World
date: "2019-05-11"
description: "This is my first blog post"
---

This is my first blog

I wrote this javascript few days back.

```javascript
function CountProvider(props) {
  const [count, setCount] = React.useState(0)
  const value = { count, setCount }
  return <CountContext.Provider value={value} {...props} />
}
```
