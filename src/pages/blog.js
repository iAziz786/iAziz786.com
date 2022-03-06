import React from "react"
import { Link, graphql } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image";

import Layout from "../components/layout"
import SEO from "../components/seo"

class BlogIndex extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const posts = data.allMarkdownRemark.edges

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO
          title="Blog"
          description="Blog and writings to learn and create valuable software"
          keywords={[
            `blog`,
            `typescript`,
            `javascript`,
            `react`,
            `nodejs`,
            `software engineering`,
            `algorithm`,
            `data-structure`,
          ]}
        />
        <section>
          <div className="my-12 grid gap-5 max-w-lg mx-auto lg:grid-cols-2 lg:max-w-none">
            {posts.map(({ node }) => {
              const title = node.frontmatter.title || node.fields.slug
              return (
                <div
                  className="flex flex-col rounded-lg shadow-lg overflow-hidden"
                  key={title}
                >
                  <div className="flex-shrink-0">
                    <GatsbyImage
                      image={node.frontmatter.banner.childImageSharp.gatsbyImageData}
                      className="h-48 w-full object-cover"
                      alt={"banner"} />
                  </div>
                  <div className="flex-1 bg-white dark:bg-gray-700 p-6 flex flex-col justify-between">
                    <div className="flex-1">
                      <Link to={node.fields.slug} className="block">
                        <h3 className="mt-2 text-xl leading-7 font-semibold text-gray-900 dark:text-gray-50">
                          {title}
                        </h3>
                        <p className="mt-3 text-base font-normal leading-6 text-gray-500 dark:text-gray-400">
                          {node.frontmatter.description}
                        </p>
                      </Link>
                    </div>
                    <div className="mt-6 flex items-center">
                      <div className="flex-shrink-0">
                        <GatsbyImage
                          image={data.avatar.childImageSharp.gatsbyImageData}
                          className="h-10 w-10 rounded-full"
                          alt={"avatar"} />
                      </div>
                      <div className="ml-3">
                        <span className="text-sm leading-5 font-medium text-gray-900">
                          <Link to={"/about"} className="hover:underline">
                            {node.frontmatter.author}
                          </Link>
                        </span>
                        <div className="flex text-sm leading-5 text-gray-500 dark:text-gray-400">
                          <time dateTime="2020-03-16">
                            {node.frontmatter.date}
                          </time>
                          <span className="mx-1">·</span>
                          <span>{node.fields.readingTime.text}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </Layout>
    );
  }
}

export default BlogIndex

export const pageQuery = graphql`{
  site {
    siteMetadata {
      title
    }
  }
  avatar: file(absolutePath: {regex: "/profile-pic.png/"}) {
    childImageSharp {
      gatsbyImageData(width: 50, height: 50, layout: FIXED)
    }
  }
  allMarkdownRemark(sort: {fields: [frontmatter___date], order: DESC}) {
    edges {
      node {
        excerpt
        fields {
          slug
          readingTime {
            text
          }
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          description
          author
          keywords
          banner {
            ...bannerImage260
          }
        }
      }
    }
  }
}
`
