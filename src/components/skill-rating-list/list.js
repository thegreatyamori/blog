import React from 'react'
import { Skill } from './skill'
import '@scomponents/skill-rating-list.scss'

export const SkillsList = ({ edges }) => {
  const renderSkillItem = edges
    .sort(({ node: { name: nameA } }, { node: { name: nameB } }) =>
      nameA.toLowerCase() > nameB.toLowerCase() ? 1 : -1
    )
    .map(({ node: { name, childImageSharp } }) => (
      <Skill
        name={name}
        metaImg={childImageSharp}
        rating={5}
        category={'interests'}
      />
    ))

  return <div className="skill__container">{renderSkillItem}</div>
}
