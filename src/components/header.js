import React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"

const Header = () => {
  return (
    <header className="bg-indigo-600">
      <div className="flex items-center justify-between mx-auto max-w-screen-md py-4 px-2">
        <h1 className="text-base">
          <Link to="/" className="text-white">
            Mohammad Aziz
          </Link>
        </h1>
        <div className="flex">
          <Link
            to="/blog"
            className="px-4 py-1 text-white font-normal"
            getProps={({ isPartiallyCurrent }) => {
              return isPartiallyCurrent
                ? {
                  className:
                    "px-4 py-1 text-white font-normal bg-indigo-700 rounded-full",
                }
                : {}
            }}
          >
            Blog
          </Link>
          <Link
            to="/about"
            className="px-4 py-1 text-white font-normal"
            activeClassName="bg-indigo-700 rounded-full"
            style={{ marginLeft: "5px" }}
          >
            About
          </Link>
        </div>
      </div>
    </header>
  )
}

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
