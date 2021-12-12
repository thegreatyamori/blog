/* Vendor imports */
import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import { GatsbyImage } from 'gatsby-plugin-image'
/* App imports */
import Layout from '../../components/layout'
import Seo from '../../components/seo'
import EmblaCarousel from '../../components/carousel'
import SkillsList from '../../components/skill-rating-list'
import * as style from './index.module.less'

const aboutPropTypes = {
  data: PropTypes.shape({
    profilePhoto: PropTypes.shape({
      childImageSharp: PropTypes.shape({
        gatsbyImageData: PropTypes.object.isRequired,
      }).isRequired,
    }).isRequired,
    skillIcons: PropTypes.object.isRequired,
    toolIcons: PropTypes.object.isRequired,
  }),
}

class About extends React.Component {
  static propTypes = aboutPropTypes

  renderExperience(experience) {
    return experience.edges.map(({ node: work }, index) => (
      <div key={index} className={style.itemWrapper}>
        <br />
        <label>{`${work.initDate} - ${work.finishDate}`}</label>
        <h4>{work.position}</h4>
        <span>
          En <b>{work.company}</b>
        </span>
        <p>{work.description}</p>
      </div>
    ))
  }

  render() {
    let {
      about,
      experience,
      profilePhoto,
      skillIcons,
      toolIcons,
      interestsIcons,
    } = this.props.data

    return (
      <Layout>
        <Seo
          title="About"
          description="A brief summary of this blog"
          path="about"
        />
        <div className={style.container}>
          <div className={style.profile}>
            <div className={style.photo}>
              <GatsbyImage
                image={profilePhoto.childImageSharp.gatsbyImageData}
                alt="profile-jerson"
              />
            </div>
            <div className={style.aboutMe}>
              <h1>Hola, Soy Jerson!</h1>
              {console.log(about.edges.length)}
              <EmblaCarousel slides={about.edges} />
            </div>

            <div className={style.title}>
              <h2>Experiencia</h2>
            </div>
            <div className={style.content}>
              {this.renderExperience(experience)}
            </div>
            <div className={style.title}>
              <h2>Habilidades</h2>
            </div>
            <div className={style.content}>
              <SkillsList edges={skillIcons.edges} />
            </div>
            <div className={style.title}>
              <h2>Herramientas</h2>
            </div>
            <div className={style.content}>
              <SkillsList edges={toolIcons.edges} />
            </div>
            <div className={style.title}>
              <h2>Intereses</h2>
            </div>
            <div className={style.content}>
              <SkillsList edges={interestsIcons.edges} />
            </div>
          </div>
        </div>
      </Layout>
    )
  }
}

export const query = graphql`
  {
    about: allAboutJson(sort: { fields: date, order: DESC }) {
      edges {
        node {
          summary
          title
          date
        }
      }
    }
    experience: allExperienceJson(limit: 3) {
      edges {
        node {
          description
          company
          finishDate
          initDate
          position
        }
      }
    }
    profilePhoto: file(name: { eq: "profile-photo" }) {
      childImageSharp {
        gatsbyImageData(layout: CONSTRAINED, width: 800)
      }
    }
    skillIcons: allFile(filter: { dir: { regex: "/about/skills$/" } }) {
      edges {
        node {
          name
          childImageSharp {
            gatsbyImageData(width: 40, layout: FIXED, placeholder: TRACED_SVG)
          }
        }
      }
    }
    toolIcons: allFile(filter: { dir: { regex: "/about/tools$/" } }) {
      edges {
        node {
          name
          childImageSharp {
            gatsbyImageData(width: 40, layout: FIXED, placeholder: TRACED_SVG)
          }
        }
      }
    }
    interestsIcons: allFile(filter: { dir: { regex: "/about/interests$/" } }) {
      edges {
        node {
          name
          childImageSharp {
            gatsbyImageData(width: 40, layout: FIXED, placeholder: TRACED_SVG)
          }
        }
      }
    }
  }
`

export default About
