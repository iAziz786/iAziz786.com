import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />
    <section className="text-gray-500 bg-gray-900 body-font">
      <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
        <div className="lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center">
          <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-white">
            Welcome
            <br className="hidden lg:inline-block" />
            I&rsquo;m Aziz 👋
          </h1>
          <p className="mb-8 leading-relaxed">
            I'm a software developer currently working with{" "}
            <a href="https://zoop.one">Zoop.one</a>. I love creating softwares
            and working in web development for more than 3 years
          </p>
        </div>
      </div>
    </section>
  </Layout>
)

export default IndexPage
