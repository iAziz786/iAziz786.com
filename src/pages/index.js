import React from "react"

import SEO from "../components/seo"
import Header from "../components/header"
import { Link, graphql } from "gatsby"

const IndexPage = ({
  data: {
    site: {
      siteMetadata: { title },
    },
  },
}) => (
  <>
    <Header siteTitle={title} />
    <SEO title={title} keywords={[`gatsby`, `application`, `react`]} />
    <section className="text-gray-500 bg-gray-900 body-font h-0">
      <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
        <div className="lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 md:pr-16 flex flex-col md:items-start md:text-left items-center text-center">
          <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-white">
            <p>Welcome!</p>
            <p className="text-orange-500">
              I&rsquo;m Aziz{" "}
              <span role="img" aria-label="wave">
                👋
              </span>
            </p>
          </h1>
          <p className="mb-8 leading-relaxed">
            I'm a software developer currently working with{" "}
            <a href="https://zoop.one">Zoop.one</a>. Learn to build valuable
            software for a great user experience.
          </p>
          <Link
            to="/blog"
            className="bg-orange-500 text-white hover:bg-orange-400 font-semibold py-2 px-4 border border-orange-500 rounded shadow"
          >
            Blog &rarr;
          </Link>
        </div>
      </div>
    </section>
  </>
)

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
