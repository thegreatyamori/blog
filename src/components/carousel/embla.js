import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import useEmblaCarousel from 'embla-carousel-react'
import { DotButton } from './dotButton'
import '@scomponents/carousel.scss'

const EmblaCarousel = ({ slides }) => {
  const [emblaRef, embla] = useEmblaCarousel({ skipSnaps: false })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState([])

  const scrollTo = useCallback(
    (index) => embla && embla.scrollTo(index),
    [embla]
  )

  const onSelect = useCallback(() => {
    if (!embla) return
    setSelectedIndex(embla.selectedScrollSnap())
  }, [embla, setSelectedIndex])

  const renderSlides = slides.map((slide) => (
    <div className="embla__slide" key={slide.node.date}>
      <h2>{slide.node.title}</h2>
      <p>{slide.node.summary}</p>
    </div>
  ))

  const renderDots = scrollSnaps.map((_, index) => (
    <DotButton
      key={index}
      selected={index === selectedIndex}
      onClick={() => scrollTo(index)}
    />
  ))

  useEffect(() => {
    if (!embla) return
    onSelect()
    setScrollSnaps(embla.scrollSnapList())
    embla.on('select', onSelect)
  }, [embla, setScrollSnaps, onSelect])

  return (
    <>
      <div className="embla" ref={emblaRef}>
        <div className="embla__container">{renderSlides}</div>
      </div>
      <div className="embla__dots">{renderDots}</div>
    </>
  )
}

EmblaCarousel.propTypes = {
  slides: PropTypes.array.isRequired,
}

export default EmblaCarousel
