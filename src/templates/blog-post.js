import React from "react"
import { graphql } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image";
import ReactMarkdown from "react-markdown"

import Layout from "../components/layout"
import SEO from "../components/seo"

import { siteURL } from "../../config/website"

import "../styles/blog.css"

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark
    const { slug } = this.props.pageContext
    const { title: siteTitle, siteUrl } = this.props.data.site.siteMetadata
    const blogPostURL = `${siteURL}${slug}`

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO
          title={post.frontmatter.title}
          description={post.frontmatter.description || post.excerpt}
          keywords={post.frontmatter.keywords}
          // TODO: add support for default og image
          ogImage={`${siteUrl}${post.frontmatter.banner.childImageSharp.gatsbyImageData.src}`}
        />
        <div className="relative py-6 bg-white dark:bg-gray-700 overflow-hidden">
          <div className="hidden lg:block lg:absolute lg:inset-y-0 lg:h-full lg:w-full">
            <div className="relative h-full text-lg max-w-prose mx-auto"></div>
          </div>
          <div className="relative px-4 sm:px-6 lg:px-8">
            <div className="text-lg max-w-prose mx-auto mb-6">
              <p className="text-base text-center leading-6 text-indigo-600 dark:text-indigo-400 font-semibold tracking-wide uppercase">
                {post.frontmatter.date}
              </p>
              <h1 className="mt-2 mb-8 text-3xl text-center leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl sm:leading-10">
                {post.frontmatter.title}
              </h1>
              <p className="text-xl text-center text-gray-500 dark:text-gray-100 leading-8">
                {post.frontmatter.description}
              </p>
            </div>
            <GatsbyImage
              image={post.frontmatter.banner.childImageSharp.gatsbyImageData}
              className="mt-4"
              alt="Introduction Coffee" />
            <ReactMarkdown className="text-center text-gray-600 mt-2">
              {post.frontmatter.credits}
            </ReactMarkdown>
            <div
              className="mt-4 mx-auto"
              dangerouslySetInnerHTML={{ __html: post.html }}
            ></div>
            <div className="text-center mt-6">
              <a href={`https://twitter.com/search?q=${blogPostURL}`}>
                Discuss on Twitter
              </a>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
        siteUrl
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
        keywords
        credits
        banner {
          ...bannerImage720
        }
      }
    }
  }
`
