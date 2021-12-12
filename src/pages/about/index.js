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
    skills: PropTypes.object.isRequired,
    tools: PropTypes.object.isRequired,
    interests: PropTypes.object.isRequired,
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
    let { about, experience, profilePhoto, skills, tools, interests } =
      this.props.data

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
              <SkillsList edges={skills.edges} />
            </div>
            <div className={style.title}>
              <h2>Herramientas</h2>
            </div>
            <div className={style.content}>
              <SkillsList edges={tools.edges} />
            </div>
            <div className={style.title}>
              <h2>Intereses</h2>
            </div>
            <div className={style.content}>
              <SkillsList edges={interests.edges} />
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
    skills: allTechJson(filter: { group: { eq: "skills" } }) {
      edges {
        node {
          id
          name
          rating
          group
          image {
            childImageSharp {
              gatsbyImageData(width: 40, layout: FIXED, placeholder: TRACED_SVG)
            }
          }
        }
      }
    }
    tools: allTechJson(filter: { group: { eq: "tools" } }) {
      edges {
        node {
          id
          name
          rating
          group
          image {
            childImageSharp {
              gatsbyImageData(width: 40, layout: FIXED, placeholder: TRACED_SVG)
            }
          }
        }
      }
    }
    interests: allTechJson(filter: { group: { eq: "interests" } }) {
      edges {
        node {
          id
          name
          rating
          group
          image {
            childImageSharp {
              gatsbyImageData(width: 40, layout: FIXED, placeholder: TRACED_SVG)
            }
          }
        }
      }
    }
  }
`

export default About
