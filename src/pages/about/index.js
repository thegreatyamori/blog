/* Vendor imports */
import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import { GatsbyImage } from "gatsby-plugin-image"
/* App imports */
import Layout from '../../components/layout'
import Seo from '../../components/seo'
import EmblaCarousel from '../../components/carousel'
import Utils from '../../utils'
import * as style from './index.module.less'

// Use to set specific icons names
const iconsNameMap = {
  css: 'CSS',
  html: 'HTML',
  nodejs: 'Node.js',
  rxjs: 'RxJS',
  vscode: 'VS Code',
  vue: 'Vue.js',
  mysql: 'MySQL',
  react: 'ReactJS',
  graphql: 'GraphQL',
  mongo: 'mongoDB',
}

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
    return experience.edges
      .map(({ node: work }, index) => (
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
              <ImageList edges={skillIcons.edges} />
            </div>
            <div className={style.title}>
              <h2>Herramientas</h2>
            </div>
            <div className={style.content}>
              <ImageList edges={toolIcons.edges} />
            </div>
            <div className={style.title}>
              <h2>Intereses</h2>
            </div>
            <div className={style.content}>
              <ImageList edges={interestsIcons.edges} />
            </div>
          </div>
        </div>
      </Layout>
    )
  }
}

const imageListPropTypes = {
  edges: PropTypes.arrayOf(
    PropTypes.shape({
      node: PropTypes.shape({
        name: PropTypes.string.isRequired,
        childImageSharp: PropTypes.shape({
          gatsbyImageData: PropTypes.object.isRequired,
        }).isRequired,
      }).isRequired,
    })
  ).isRequired,
}

class ImageList extends React.Component {
  static propTypes = imageListPropTypes

  render = () => (
    <div className={style.iconsContainer}>
      {this.props.edges
        .sort((edgeA, edgeB) =>
          edgeA.node.name.toLowerCase() > edgeB.node.name.toLowerCase() ? 1 : -1
        )
        .map(({ node: { name, childImageSharp } }) => (
          <div className={style.iconWrapper} key={name}>
            <GatsbyImage
              image={childImageSharp.gatsbyImageData}
              alt={name + '-logo'}
              title={name}
            />
            <label>
              {iconsNameMap[name] ? iconsNameMap[name] : Utils.capitalize(name)}
            </label>
          </div>
        ))}
    </div>
  )
}

export const query = graphql`
  {
    about: allAboutJson(sort: {fields: date, order: DESC}) {
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
