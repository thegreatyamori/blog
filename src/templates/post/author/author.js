/* Vendor imports */
import React from 'react'
import Img from 'gatsby-image'

import style from './author.module.less'
import Config from '../../../../config'

const Author = ({ img }) => (
  <div className={style.container}>
    <div className={style.avatar}>
      <Img fluid={img} className={style.rounded} title="Jerson" alt="Jerson" />
    </div>
    <p className={style.description}>
      <b>jerson alexander</b> es estudiante de Ingenieria en Software en
      Ecuador, disfruta mucho de la auto-educación, programación, música, libros, manga, arte y cultura
      general, además es seguidor de Jesucristo y lector de la biblia. Actualmente es miembro en la comunidad de&nbsp;
      <a
        href={Config.footer.jsEcuador.telegram}
        target="_blank"
        rel="nofollow noopener noreferrer"
      >
        jsEcuador
      </a>
      .
    </p>
  </div>
)

export default Author
