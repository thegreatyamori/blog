import React from 'react'
import { Skill } from './skill'
import '@scomponents/skill-rating-list.scss'

export const SkillsList = ({ edges }) => {
  const renderSkillItem = edges
    .sort(({ node: { name: nameA } }, { node: { name: nameB } }) =>
      nameA.toLowerCase() > nameB.toLowerCase() ? 1 : -1
    )
    .map(({ node: { id, name, rating, group, image } }) => (
      <Skill
        key={id}
        name={name}
        metaImg={image.childImageSharp.gatsbyImageData}
        rating={rating}
        category={group}
      />
    ))

  return <div className="skill__container">{renderSkillItem}</div>
}
