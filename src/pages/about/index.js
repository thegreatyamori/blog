/* Vendor imports */
import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import Img from 'gatsby-image'
/* App imports */
import Layout from '../../components/layout'
import SEO from '../../components/seo'
import Utils from '../../utils'
import style from './index.module.less'
import Config from '../../../config'

export const aboutPropTypes = {
  data: PropTypes.shape({
    profilePhoto: PropTypes.shape({
      childImageSharp: PropTypes.shape({
        fluid: PropTypes.object.isRequired,
      }).isRequired,
    }).isRequired,
    skillIcons: PropTypes.object.isRequired,
    toolIcons: PropTypes.object.isRequired,
  }),
}

class About extends React.Component {
  static propTypes = aboutPropTypes

  compare(a, b) {
    return a.initDate > b.initDate ? -1 : 1
  }

  render() {
    const experiences = Config.experience
    let {
      profilePhoto,
      skillIcons,
      toolIcons,
      interestsIcons,
    } = this.props.data

    return (
      <Layout>
        <SEO
          title="About"
          description="A brief summary of this blog"
          path="about"
        />
        <div className={style.container}>
          <div className={style.profile}>
            <div className={style.photo}>
              <Img fluid={profilePhoto.childImageSharp.fluid} />
            </div>
            <div className={style.aboutMe}>
              <h1>Hola, Soy Jerson!</h1>
              <h2>Estudiante de Ingeniería en Software</h2>
              <p>
                En este último año de mi carrera, decidí empezar este blog por
                dos motivos: compartir los conocimientos que he adquirido a lo
                largo de mis estudios (les puede servir a ustedes y me sirven de
                recordatorio) y mejorar mis capacidades de comunicación oral y
                escrita. Además de la programación, me encanta la música, así
                que me propuse aprender guitarra 
                <span role="img" aria-label="jsx-a11y/accessible-emoji">
                  🎸
                </span>
                (creo que voy bien !). Creo que aprender sobre la diversidad de 
                las culturas alrededor del planeta reafirma mi convicción sobre la 
                imperfección del ser humano.
              </p>
            </div>

            <div className={style.title}>
              <h2>Experiencia</h2>
            </div>
            <div className={style.content}>
              {experiences
                .sort((a, b) => this.compare(a, b))
                .map((exp, index) => (
                  <div key={index} className={style.itemWrapper}>
                    <br />
                    <label>{`${exp.initDate} - ${exp.finishDate}`}</label>
                    <h4>{exp.position}</h4>
                    <span>
                      En <b>{exp.company}</b>
                    </span>
                    <p>{exp.description}</p>
                  </div>
                ))}
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

export const imageListPropTypes = {
  edges: PropTypes.arrayOf(
    PropTypes.shape({
      node: PropTypes.shape({
        name: PropTypes.string.isRequired,
        childImageSharp: PropTypes.shape({
          fixed: PropTypes.object.isRequired,
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
            <Img
              fixed={childImageSharp.fixed}
              alt={name + ' logo'}
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
    profilePhoto: file(name: { eq: "profile-photo" }) {
      childImageSharp {
        fluid(maxWidth: 800) {
          ...GatsbyImageSharpFluid_tracedSVG
        }
      }
    }
    skillIcons: allFile(filter: { dir: { regex: "/about/skills$/" } }) {
      edges {
        node {
          name
          childImageSharp {
            fixed(width: 50) {
              ...GatsbyImageSharpFixed_tracedSVG
            }
          }
        }
      }
    }
    toolIcons: allFile(filter: { dir: { regex: "/about/tools$/" } }) {
      edges {
        node {
          name
          childImageSharp {
            fixed(width: 50) {
              ...GatsbyImageSharpFixed_tracedSVG
            }
          }
        }
      }
    }
    interestsIcons: allFile(filter: { dir: { regex: "/about/interests$/" } }) {
      edges {
        node {
          name
          childImageSharp {
            fixed(width: 50) {
              ...GatsbyImageSharpFixed_tracedSVG
            }
          }
        }
      }
    }
  }
`
// Use to set specific icons names
export const iconsNameMap = {
  css: 'CSS',
  html: 'HTML',
  nodejs: 'Node.js',
  gruntjs: 'Grunt.js',
  rxjs: 'RxJS',
  vscode: 'VS Code',
  mysql: 'MySQL',
  react: 'ReactJS',
  graphql: 'GraphQL',
  mongo: 'mongoDB',
}

export default About
