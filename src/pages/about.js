import React from "react"
import Footer from "../components/footer"
import Header from "../components/header"
import SEO from "../components/seo"
import { graphql } from "gatsby"
import Image from "gatsby-image"

function About(props) {
  const { data } = props

  return (
    <>
      <div className="min-h-screen">
        <Header />
        <SEO
          title="About"
          description="Learn about who I am and what I do"
          keywords={[`about`, `Mohammad Aziz`, `Aziz`]}
        />
        <div className="flex items-center justify-center mx-2 md:mx-0" style={{ minHeight: "calc(100vh - 30em)" }}>
          <div className="mr-3">
            <Image className="rounded-full" fixed={data.avatar.childImageSharp.fixed} alt="profile" />
          </div>
          <div>
            <h2 className="mt-0 text-4xl">Mohammad Aziz</h2>
            <p className="mt-0">Full Stack Developer, <a target="_blank" rel="noopener noreferrer" href="https://zoop.one">ZOOP.ONE</a></p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center mx-2 md:mx-0">
          <h3 className="uppercase">About Me</h3>
          <p>I am a full stack developer.</p>
          <p>I like swimming <span role="img" aria-label="swimming">🏊</span></p>
          <p>I love to solve problems through software <span role="img" aria-label="programming">👨‍💻</span></p>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default About

export const pageQuery = graphql`
  query {
    avatar: file(absolutePath: { regex: "/profile-pic.png/" }) {
      childImageSharp {
        fixed(width: 100, height: 100) {
          ...GatsbyImageSharpFixed
        }
      }
    }
  }
`
