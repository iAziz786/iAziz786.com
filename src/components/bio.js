/**
 * Bio component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */

import React from "react"
import { StaticQuery, graphql } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image";

import { rhythm } from "../utils/typography"

function Bio() {
  return (
    <StaticQuery
      query={bioQuery}
      render={(data) => {
        const { author, social } = data.site.siteMetadata
        return (
          <div
            style={{
              display: `flex`,
              marginBottom: rhythm(2.5),
            }}
          >
            <GatsbyImage
              image={data.avatar.childImageSharp.gatsbyImageData}
              alt={author}
              style={{
                marginRight: rhythm(1 / 2),
                marginBottom: 0,
                minWidth: 50,
                borderRadius: `100%`,
              }}
              imgStyle={{
                borderRadius: `50%`,
              }} />
            <p>
              This post is written by{" "}
              <a href={`https://twitter.com/${social.twitter}`}>
                Mohammad Aziz
              </a>
              <br />
              <span>I like explaining things about software.</span>
            </p>
          </div>
        );
      }}
    />
  );
}

const bioQuery = graphql`query BioQuery {
  avatar: file(absolutePath: {regex: "/profile-pic.png/"}) {
    childImageSharp {
      gatsbyImageData(width: 50, height: 50, layout: FIXED)
    }
  }
  site {
    siteMetadata {
      author
      social {
        twitter
      }
    }
  }
}
`

export default Bio
