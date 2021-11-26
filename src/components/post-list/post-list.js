/* Vendor imports */
import React from 'react'
import PropTypes from 'prop-types'
import { Link, withPrefix } from 'gatsby'
import { GatsbyImage } from "gatsby-plugin-image"
/* App imports */
import TagList from '../tag-list'
import Utils from '../../utils'
import * as style from './post-list.module.less'

const PostList = ({ posts }) => (
  <div className={style.container}>
    {posts.map((post, index) => {
      const { title, date, path, tags, cover, excerpt } = post.node.frontmatter
      return (
        <div key={title} className={style.post}>
          <div className={style.cover}>
            <Link to={withPrefix(Utils.resolvePageUrl(path))}>
              <GatsbyImage
                image={cover.childImageSharp.gatsbyImageData}
                title={excerpt}
                alt={title}
              />
            </Link>
          </div>
          <div className={style.content}>
            <Link to={withPrefix(Utils.resolvePageUrl(path))}>
              {date ? <label>{date}</label> : null}
              <h2>{title}</h2>
              <p>{excerpt}</p>
            </Link>
            <TagList tags={tags} />
          </div>
        </div>
      )
    })}
  </div>
)

PostList.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      node: PropTypes.shape({
        frontmatter: PropTypes.shape({
          title: PropTypes.string.isRequired,
          date: PropTypes.string,
          path: PropTypes.string.isRequired,
          tags: PropTypes.arrayOf(PropTypes.string).isRequired,
          cover: PropTypes.shape({
            childImageSharp: PropTypes.shape({
              gatsbyImageData: PropTypes.object.isRequired,
            }).isRequired,
          }).isRequired,
        }),
      }),
    })
  ),
}

export default PostList
