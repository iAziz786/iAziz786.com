import React from "react"
import Footer from "../components/footer"
import Header from "../components/header"
import SEO from "../components/seo"

function About() {
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
            <img className="rounded-full object-scale-down" style={{ height: '100px' }} alt="profile" src="https://avatars2.githubusercontent.com/u/17024120?s=400&u=e6a9b25f424c50a7483fc824aabe70d78904ae4d&v=4" />
          </div>
          <div>
            <h2 className="mt-0 text-4xl">Mohammad Aziz</h2>
            <p className="mt-0">Full Stack Developer, <a target="_blank" rel="noopener noreferrer" href="https://zoop.one">ZOOP.ONE</a></p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center mx-2 md:mx-0">
          <h3 className="uppercase">About Me</h3>
          <p>I am a full stack developer.</p>
          <p>I like swimming 🏊</p>
          <p>I love to solve problems through software 👨‍💻</p>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default About
