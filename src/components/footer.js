import React from "react"
import { StaticQuery } from "gatsby"
import { graphql } from "gatsby"

function Footer() {
  return (
    <StaticQuery
      query={footerQuery}
      render={(data) => {
        const {
          author,
          social: { twitter, github, linkedIn },
        } = data.site.siteMetadata
        return (
          <div className="bg-white dark:bg-gray-600">
            <div className="max-w-screen-xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
              <div className="flex justify-center md:order-2">
                <a
                  href={linkedIn}
                  className="ml-6 text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Instagram</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="icon icon-tabler icon-tabler-brand-linkedin"
                    viewBox="0 0 24 24"
                  >
                    <path stroke="none" d="M0 0h24v24H0z"></path>
                    <rect width="16" height="16" x="4" y="4" rx="2"></rect>
                    <path d="M8 11L8 16"></path>
                    <path d="M8 8L8 8.01"></path>
                    <path d="M12 16L12 11"></path>
                    <path d="M16 16v-3a2 2 0 00-4 0"></path>
                  </svg>
                </a>
                <a
                  href={twitter}
                  className="ml-6 text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Twitter</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-brand-twitter" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M22 4.01c-1 .49 -1.98 .689 -3 .99c-1.121 -1.265 -2.783 -1.335 -4.38 -.737s-2.643 2.06 -2.62 3.737v1c-3.245 .083 -6.135 -1.395 -8 -4c0 0 -4.182 7.433 4 11c-1.872 1.247 -3.739 2.088 -6 2c3.308 1.803 6.913 2.423 10.034 1.517c3.58 -1.04 6.522 -3.723 7.651 -7.742a13.84 13.84 0 0 0 .497 -3.753c-.002 -.249 1.51 -2.772 1.818 -4.013z"></path>
                  </svg>
                </a>
                <a
                  href={github}
                  className="ml-6 text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">GitHub</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="icon icon-tabler icon-tabler-brand-github"
                    viewBox="0 0 24 24"
                  >
                    <path stroke="none" d="M0 0h24v24H0z"></path>
                    <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 00-1.3-3.2 4.2 4.2 0 00-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 00-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 00-.1 3.2A4.6 4.6 0 004 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"></path>
                  </svg>
                </a>
              </div>
              <div className="mt-8 md:mt-0 md:order-1">
                <p className="text-center text-base leading-6 text-gray-400">
                  {author}
                </p>
              </div>
            </div>
          </div>
        )
      }}
    />
  )
}

const footerQuery = graphql`
  query FooterQuery {
    avatar: file(absolutePath: { regex: "/profile-pic.png/" }) {
      childImageSharp {
        fixed(width: 50, height: 50) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    site {
      siteMetadata {
        author
        title
        social {
          twitter
          github
          linkedIn
        }
      }
    }
  }
`

export default Footer
