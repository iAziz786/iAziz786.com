import React, { useState, useEffect } from "react"

import SEO from "../components/seo"
import { Link, graphql } from "gatsby"
import Transition from "./transition"

const IndexPage = ({
  data: {
    site: {
      siteMetadata: { title },
    },
  },
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [wave, setWave] = useState(false)

  useEffect(() => {
    if (wave) {
      setTimeout(() => {
        setWave(false)
      }, 2500)
    }
  }, [wave])

  return (
    <>
      <SEO
        title={"Home"}
        keywords={[`personal website`, `javascript`, `Mohammad Aziz`, `Aziz`]}
      />
      <div className="relative bg-gray-50 overflow-hidden">
        <div className="hidden sm:block sm:absolute sm:inset-y-0 sm:h-full sm:w-full">
          <div className="relative h-full max-w-screen-xl mx-auto">
            <svg
              className="absolute right-full transform translate-y-1/4 translate-x-1/4 lg:translate-x-1/2"
              width={404}
              height={784}
              fill="none"
              viewBox="0 0 404 784"
            >
              <defs>
                <pattern
                  id="svg-pattern-squares-1"
                  x={0}
                  y={0}
                  width={20}
                  height={20}
                  patternUnits="userSpaceOnUse"
                >
                  <rect
                    x={0}
                    y={0}
                    width={4}
                    height={4}
                    className="text-gray-200"
                    fill="currentColor"
                  />
                </pattern>
              </defs>
              <rect
                width={404}
                height={784}
                fill="url(#svg-pattern-squares-1)"
              />
            </svg>
            <svg
              className="absolute left-full transform -translate-y-3/4 -translate-x-1/4 md:-translate-y-1/2 lg:-translate-x-1/2"
              width={404}
              height={784}
              fill="none"
              viewBox="0 0 404 784"
            >
              <defs>
                <pattern
                  id="svg-pattern-squares-2"
                  x={0}
                  y={0}
                  width={20}
                  height={20}
                  patternUnits="userSpaceOnUse"
                >
                  <rect
                    x={0}
                    y={0}
                    width={4}
                    height={4}
                    className="text-gray-200"
                    fill="currentColor"
                  />
                </pattern>
              </defs>
              <rect
                width={404}
                height={784}
                fill="url(#svg-pattern-squares-2)"
              />
            </svg>
          </div>
        </div>
        <div
          className={`relative pt-6 pb-12 sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32`}
        >
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
            <nav className="relative flex items-center justify-between sm:h-10 md:justify-center">
              <div className="flex items-center flex-1 md:absolute md:inset-y-0 md:left-0">
                <div className="flex items-center justify-between w-full md:w-auto">
                  <Link to={"/"}>Mohammad Aziz</Link>
                  <div className="-mr-2 flex items-center md:hidden">
                    <button
                      onClick={() => setIsOpen((open) => !open)}
                      type="button"
                      className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                    >
                      <svg
                        className="h-6 w-6"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6h16M4 12h16M4 18h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <Link
                  to="/blog"
                  className="font-medium text-gray-500 hover:text-gray-900 focus:outline-none focus:text-gray-900 transition duration-150 ease-in-out"
                >
                  Blog
                </Link>
                <Link
                  to="/about"
                  className="ml-10 font-medium text-gray-500 hover:text-gray-900 focus:outline-none focus:text-gray-900 transition duration-150 ease-in-out"
                >
                  About
                </Link>
              </div>
              <div className="hidden md:absolute md:flex md:items-center md:justify-end md:inset-y-0 md:right-0">
                <div className="inline-flex rounded-md shadow">
                  <button
                    onClick={() => setWave(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-indigo-600 bg-white hover:text-indigo-500 focus:outline-none focus:shadow-outline-blue active:bg-gray-50 active:text-indigo-700 transition duration-150 ease-in-out"
                  >
                    <span
                      className={`${wave ? "wave" : ""}`}
                      role="img"
                      aria-label="wave"
                    >
                      👋{"   "}
                    </span>
                    {"   "}
                    Wave Back
                  </button>
                </div>
              </div>
            </nav>
          </div>
          <div
            style={{ display: isOpen ? "block" : "none" }}
            className="absolute top-0 inset-x-0 p-2 md:hidden"
          >
            <Transition
              className="rounded-lg shadow-md transition transform origin-top-right"
              show={isOpen}
              enter="duration-150 ease-out"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="duration-100 ease-in"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="rounded-lg bg-white shadow-xs overflow-hidden">
                <div className="px-5 pt-4 flex items-center justify-between">
                  <div>
                    <img
                      className="h-8 w-auto"
                      src="/images/gatsby-icon"
                      alt=""
                    />
                  </div>
                  <div className="-mr-2">
                    <button
                      onClick={() => setIsOpen((open) => !open)}
                      type="button"
                      className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                    >
                      <svg
                        className="h-6 w-6"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="px-2 pt-2 pb-3">
                  <Link
                    href={"/blog"}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:text-gray-900 focus:bg-gray-50 transition duration-150 ease-in-out"
                  >
                    Blog
                  </Link>
                  <Link
                    href={"/about"}
                    className="mt-1 block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:text-gray-900 focus:bg-gray-50 transition duration-150 ease-in-out"
                  >
                    About
                  </Link>
                </div>
                <div>
                  <button
                    className="block w-full px-5 py-3 text-center font-medium text-indigo-600 bg-gray-50 hover:bg-gray-100 hover:text-indigo-700 focus:outline-none focus:bg-gray-100 focus:text-indigo-700 transition duration-150 ease-in-out"
                    onClick={() => setWave(true)}
                  >
                    <span
                      className={`${wave ? "wave" : ""}`}
                      role="img"
                      aria-label="wave"
                    >
                      👋{"   "}
                    </span>
                    {"   "}
                    Wave Back
                  </button>
                </div>
              </div>
            </Transition>
          </div>
          <div className="mt-10 mx-auto max-w-screen-xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 xl:mt-28">
            <div className="text-center">
              <h2 className="text-4xl tracking-tight leading-10 font-extrabold text-gray-900 sm:text-5xl sm:leading-none md:text-6xl">
                Welcome!
                <br />
                <span className="text-indigo-600">
                  I'm Aziz{" "}
                  <span role="img" aria-label="wave">
                    👋
                  </span>
                </span>
              </h2>
              <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                I'm a software developer working for full time at{" "}
                <a href="https://zoop.one">Zoop.one</a>. I love learning in
                Public and this is where you'll find most of my finding which I
                will be posting frequently.
              </p>
              <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                <div className="rounded-md shadow">
                  <Link
                    to={"/blog"}
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:shadow-outline-indigo transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10"
                  >
                    Go to Blog
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default IndexPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
