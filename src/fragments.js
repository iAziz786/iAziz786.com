import { graphql } from "gatsby"

export const bannerImage = graphql`fragment bannerImage260 on File {
  childImageSharp {
    gatsbyImageData(
      width: 260
      tracedSVGOptions: {color: "#ED8936"}
      quality: 50
      placeholder: TRACED_SVG
      layout: CONSTRAINED
    )
  }
}

fragment bannerImage640 on File {
  childImageSharp {
    gatsbyImageData(
      width: 640
      tracedSVGOptions: {color: "#ED8936"}
      placeholder: TRACED_SVG
      layout: CONSTRAINED
    )
  }
}

fragment bannerImage720 on File {
  childImageSharp {
    gatsbyImageData(
      width: 720
      tracedSVGOptions: {color: "#ED8936"}
      quality: 75
      placeholder: TRACED_SVG
      layout: CONSTRAINED
    )
  }
}
`
