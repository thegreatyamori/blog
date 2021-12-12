/* Vendor imports */
import React from 'react'
import PropTypes from 'prop-types'
import { graphql, Link, withPrefix } from 'gatsby'
import { GatsbyImage } from 'gatsby-plugin-image'
/* App imports */
import Layout from '../../components/layout'
import Seo from '../../components/seo'
import Config from '../../../config'
import Utils from '../../utils'
import * as style from './tag.module.less'

const Tag = ({ data }) => {
  const rawTags = data.allMarkdownRemark.edges
    .map((edge) => edge.node.frontmatter.tags)
    .reduce((prev, curr) => prev.concat(curr))

  const tags = rawTags
    .filter((tag, index) => index === rawTags.indexOf(tag))
    .sort() // Remove duplicates and sort values
  const getTagImageProps = (tag) =>
    data.allFile.edges.find((edge) => edge.node.name === tag).node
  const tagPage = Config.pages.tag

  return (
    <Layout title="Tags">
      <Seo
        title="Tags"
        description="All present tags in the site"
        path={tagPage}
      />
      <div>
        {tags.map((tag) => (
          <Link
            to={withPrefix(Utils.resolvePageUrl(tagPage, tag))}
            className={style.card}
            key={tag}
          >
            <div className={style.cover}>
              <GatsbyImage
                image={getTagImageProps(tag).childImageSharp.gatsbyImageData}
                alt={getTagImageProps(tag).base}
              />
            </div>
            <div className={style.content}>
              <h2>{Config.tags[tag].name || Utils.capitalize(tag)}</h2>
              <p>{Config.tags[tag].description}</p>
              <label>{`${
                rawTags.filter((sTag) => sTag === tag).length
              } Entrada/s`}</label>
            </div>
          </Link>
        ))}
      </div>
    </Layout>
  )
}

Tag.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            frontmatter: PropTypes.shape({
              tags: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
            }).isRequired,
          }).isRequired,
        }).isRequired
      ).isRequired,
    }).isRequired,
    allFile: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            name: PropTypes.string.isRequired,
            base: PropTypes.string.isRequired,
            childImageSharp: PropTypes.shape({
              gatsbyImageData: PropTypes.object.isRequired,
            }).isRequired,
          }).isRequired,
        }).isRequired
      ).isRequired,
    }).isRequired,
  }).isRequired,
}

export const query = graphql`
  {
    allMarkdownRemark(filter: { fileAbsolutePath: { regex: "/index.md$/" } }) {
      edges {
        node {
          frontmatter {
            tags
          }
        }
      }
    }
    allFile(filter: { relativeDirectory: { eq: "tags" } }) {
      edges {
        node {
          name
          base
          childImageSharp {
            gatsbyImageData(
              layout: CONSTRAINED
              width: 100
              placeholder: TRACED_SVG
            )
          }
        }
      }
    }
  }
`

export default Tag
