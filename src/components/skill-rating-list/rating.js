import React from 'react'
import { Rating } from 'react-simple-star-rating'
import { MdCircle, MdPanoramaFishEye } from 'react-icons/md'
import { HiOutlineHeart, HiHeart } from 'react-icons/hi'

export const SkillRating = ({ rating, category }) => {
  const ratingRange = 10
  const ratingReadOnly = true
  const icons = {
    interests: {
      fullIcon: <HiHeart />,
      emptyIcon: <HiOutlineHeart />,
      fullColor: '#c30030',
      emptyColor: '#ff6188',
    },
    skills: {
      fullIcon: <MdCircle />,
      emptyIcon: <MdPanoramaFishEye />,
      fullColor: '#ffffff',
      emptyColor: '#9d9d9d',
    },
    tools: {
      fullIcon: <MdCircle />,
      emptyIcon: <MdPanoramaFishEye />,
      fullColor: '#ffffff',
      emptyColor: '#ffffff',
    },
  }

  const selectIcon = (name) => (icons[name] ? icons[name] : '')

  return (
    <Rating
      ratingValue={rating}
      iconsCount={ratingRange}
      readonly={ratingReadOnly}
      fillColor={selectIcon(category).fullColor}
      emptyColor={selectIcon(category).emptyColor}
      fullIcon={selectIcon(category).fullIcon}
      emptyIcon={selectIcon(category).emptyIcon}
    />
  )
}
