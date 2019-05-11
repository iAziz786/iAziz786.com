import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />
    <h1>Hello World</h1>
    <p>My name is Mohammad Aziz</p>
    <p>
      I am a JavaScript developer. Currently I'm working as a software developer
      at <a href="https://livehealth.in">LiveHealth</a>
    </p>
    <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
      <Image />
    </div>
    <div>
      <Link to="/page-2/">Go to page 2</Link>
      <Link to="/blog">Blog</Link>
    </div>
  </Layout>
)

export default IndexPage
