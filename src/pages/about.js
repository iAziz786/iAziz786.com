import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"

function About() {
  return (
    <Layout>
      <SEO
        title="About"
        description="Learn about who I am and what I do"
        keywords={[`about`, `Mohammad Aziz`, `Aziz`]}
      />
      <h1>Mohammad Aziz</h1>
      <p>
        Software Developer, <a href="https://zoop.one">Zoop.one</a>
      </p>
    </Layout>
  )
}

export default About
