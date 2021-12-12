/* Vendor imports */
import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
/* App imports */
import Layout from '../components/layout'
import Seo from '../components/seo'
import PostList from '../components/post-list'
import ArchivePagination from '../components/archive-pagination'
import Config from '../../config'

const IndexPage = ({ data }) => (
  <Layout>
    <Seo title="Home" description={Config.siteDescription} path="" />
    <PostList posts={data.allMarkdownRemark.edges} />
    <ArchivePagination nextPage={2} />
  </Layout>
)

IndexPage.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
    }).isRequired,
  }).isRequired,
}

export const query = graphql`
  {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { fileAbsolutePath: { regex: "/index.md$/" } }
    ) {
      edges {
        node {
          frontmatter {
            path
            title
            tags
            excerpt
            cover {
              childImageSharp {
                gatsbyImageData(
                  layout: CONSTRAINED
                  width: 600
                  placeholder: TRACED_SVG
                )
              }
            }
          }
        }
      }
    }
  }
`

export default IndexPage
