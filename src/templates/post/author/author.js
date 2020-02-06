/* Vendor imports */
import React from 'react'
// import Img from 'gatsby-image'

import style from './author.module.less'
import Config from '../../../../config'

const Author = () => (
  <div>
    {/* <div className={style.roundedCircle}>
      <Img fluid="" title="Jerson" alt="Jerson" />
    </div> */}
    <p>
      <b>jerson alexander</b> es estudiante de Ingenieria de Software en
      Ecuador, apasionado por la programación, libros, manga, arte y cultura
      general. Participa como organizador de meet-ups en la comunidad de&nbsp;
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