import React from "react"
import { Link as GatsbyLink } from "gatsby"

function Link({ children, ...props }) {
  return <GatsbyLink {...props} children={children} />
}

function NavLink({ children, ...props }) {
  return <Link children={children} {...props} />
}

export { Link, NavLink }
