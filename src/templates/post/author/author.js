/* Vendor imports */
import React from 'react'
import { GatsbyImage } from "gatsby-plugin-image"

import * as style from './author.module.less'
import Config from '../../../../config'

const jsEcuador = <a
  href={Config.footer.jsEcuador.telegram}
  target="_blank"
  rel="nofollow noopener noreferrer"
>
  Javascript Ecuador
</a>

const Author = ({ img }) => (
  <div className={style.container}>
    <div className={style.avatar}>
      <GatsbyImage image={img} className={style.rounded} title="Jerson" alt="Jerson" />
    </div>
    <p className={style.description}>
      <b>Sobre mí</b> Soy Ingeniero de Software en ioet, Inc. Disfruto mucho de
      la auto-educación, programación, música, libros, manga, arte y cultura general.
      Práctico ciclismo y basketball. Soy seguidor de Jesús y me encanta la biblia.
      Actualmente formo parte de la comunidad de {jsEcuador}.
    </p>
  </div>
)

export default Author
