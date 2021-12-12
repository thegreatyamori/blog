/* Vendor imports */
import React from 'react'
import PropTypes from 'prop-types'
import { graphql, withPrefix } from 'gatsby'
import { GatsbyImage } from 'gatsby-plugin-image'
/* App imports */
import * as style from './404.module.less'
import Layout from '../../components/layout'
import Seo from '../../components/seo'
import Button from '../../components/button'
import Config from '../../../config'
import Utils from '../../utils'

const NotFoundPage = ({ data }) => (
  <Layout>
    <Seo
      title="404: Page not found"
      description="404 Page"
      path="404"
      keywords={['javascript', 'frontend', 'blog']}
    />
    <div className={style.container}>
      <div className={style.image}>
        <GatsbyImage
          image={data.file.childImageSharp.gatsbyImageData}
          alt="404"
        />
      </div>
      <div className={style.message}>
        <h1>Página no encontrada</h1>
        <Button to={withPrefix(Utils.resolvePageUrl(Config.pages.home))}>
          Regresa al Inicio
        </Button>
      </div>
    </div>
  </Layout>
)

NotFoundPage.propTypes = {
  data: PropTypes.shape({
    file: PropTypes.shape({
      childImageSharp: PropTypes.shape({
        gatsbyImageData: PropTypes.object.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
}

export const query = graphql`
  {
    file(base: { eq: "404.png" }) {
      childImageSharp {
        gatsbyImageData(
          layout: CONSTRAINED
          width: 400
          placeholder: TRACED_SVG
        )
      }
    }
  }
`
export default NotFoundPage
