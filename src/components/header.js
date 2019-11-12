import React from "react"
import PropTypes from "prop-types"
import { Link, NavLink } from "./links"

const Header = ({ siteTitle }) => (
  <header
    style={{
      background: `#4CAF50`,
      marginBottom: `1.45rem`,
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        margin: `0 auto`,
        maxWidth: 960,
        padding: `1.45rem 1.0875rem`,
      }}
    >
      <h1 style={{ margin: 0, fontSize: "28px" }}>
        <Link
          to="/"
          style={{
            color: `white`,
            textDecoration: `none`,
          }}
        >
          {siteTitle}
        </Link>
      </h1>
      <div>
        <NavLink to="/blog">Blog</NavLink>
        <NavLink to="/about" style={{ marginLeft: "5px" }}>
          About
        </NavLink>
      </div>
    </div>
  </header>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
