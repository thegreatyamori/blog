import React, { useState } from 'react'
import { Link, withPrefix } from 'gatsby'
import {
  FaBars,
  FaTimes,
  FaGithub,
  FaLinkedin,
  FaInstagram,
} from 'react-icons/fa'
/* App imports */
import useEvent from '../../hooks/useEvent'
import * as style from './header.module.less'
import Config from '../../../../config'
import Utils from '../../../utils'

const Header = () => {
  const [isMenuCollapsed, setMenuCollapsed] = useState(false)
  const [isHeaderCollapsed, setHeaderCollapsed] = useState(false)

  function toggleFixedHeader() {
    if (!isHeaderCollapsed && window.scrollY > 100) {
      setHeaderCollapsed(true)
    } else if (isHeaderCollapsed && window.scrollY < 100) {
      setHeaderCollapsed(false)
    }
  }

  function toggleMenu() {
    setMenuCollapsed(!isMenuCollapsed)
  }

  useEvent('scroll', toggleFixedHeader)

  return (
    <div
      className={style.container}
      style={isHeaderCollapsed ? { backgroundImage: 'none' } : null}
    >
      <div className={style.titleContainer}>
        <div className={style.title}>
          <Link to={withPrefix(Utils.resolvePageUrl(Config.pages.home))}>
            <h4>{Config.siteTitle}</h4>
            <p
              className={
                isHeaderCollapsed
                  ? style.hiddenDescription
                  : style.visibleDescription
              }
            >
              {Config.siteDescription}
            </p>
          </Link>
        </div>
        <div className={style.menuButton}>
          {isMenuCollapsed ? (
            <FaBars size="30" onClick={toggleMenu} />
          ) : (
            <FaTimes size="30" onClick={toggleMenu} />
          )}
        </div>
      </div>
      <div
        className={[
          style.list,
          isMenuCollapsed ? style.collapsedMenu : style.expandedMenu,
        ].join(' ')}
      >
        <ul>
          <li>
            <Link to={withPrefix(Utils.resolvePageUrl(Config.pages.home))}>
              Inicio
            </Link>
          </li>
          <li>
            <Link to={withPrefix(Utils.resolvePageUrl(Config.pages.tag))}>
              Tags
            </Link>
          </li>
          <li>
            <Link to={withPrefix(Utils.resolvePageUrl(Config.pages.about))}>
              Sobre mí
            </Link>
          </li>
        </ul>
        <ul>
          <li>
            <a
              target="_blank"
              rel="nofollow noopener noreferrer"
              href={Config.social.github}
            >
              <FaGithub size="30" />
            </a>
          </li>
          <li>
            <a
              target="_blank"
              rel="nofollow noopener noreferrer"
              href={Config.social.linkedin}
            >
              <FaLinkedin size="30" />
            </a>
          </li>
          <li>
            <a
              target="_blank"
              rel="nofollow noopener noreferrer"
              href={Config.social.instagram}
            >
              <FaInstagram size="30" />
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Header
