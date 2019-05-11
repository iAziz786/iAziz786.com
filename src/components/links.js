import React from "react"
import links from "../styles/modules/links.module.scss"
import { Link as GatsbyLink } from "gatsby"

function Link({ children, ...props }) {
  return <GatsbyLink className={links.link} {...props} children={children} />
}

function NavLink({ children, ...props }) {
  return (
    <Link className={links.navLinkPrimary} children={children} {...props} />
  )
}

export { Link, NavLink }
