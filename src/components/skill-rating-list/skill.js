import React from 'react'
import { GatsbyImage } from 'gatsby-plugin-image'

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
  postres: 'PostgresSQL',
  aws_s3: 'AWS S3',
}

export const Skill = ({ name, metaImg }) => {
  return (
    <div key={name} className="skill__item">
      <GatsbyImage image={metaImg} alt={name + '-logo'} title={name} />
      <label>{name}</label>
    </div>
  )
}
