/* Vendor imports */
import React from 'react'
import { FaTelegramPlane, FaTwitter } from 'react-icons/fa'

/* App imports */
import style from './footer.module.less'
import Config from '../../../../config'

const Footer = () => (
  <div className={style.container}>
    <div className={style.jsIcons}>
      <span>Chequea la comunidad de JavaScript Ecuador en: </span>
      <a
        className={style.separation}
        target="_blank"
        rel="nofollow noopener noreferrer"
        href={Config.footer.jsEcuador.telegram}
      >
        <FaTelegramPlane size="40" />
      </a>
      <a
        target="_blank"
        rel="nofollow noopener noreferrer"
        href={Config.footer.jsEcuador.twitter}
      >
        <FaTwitter size="40" />
      </a>
    </div>
    <p>
      <span>Este sitio esta hecho con </span>
      <a
        target="_blank"
        rel="nofollow noopener noreferrer"
        href={Config.footer.gatsby}
      >
        Gatbsy.js
      </a>
      <span>, hosteado en </span>
      <a
        target="_blank"
        rel="nofollow noopener noreferrer"
        href={Config.footer.gPages}
      >
        GitHub Pages
      </a>
    </p>
  </div>
)

export default Footer
