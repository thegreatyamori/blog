/* Vendor imports */
import React from 'react'
import { withPrefix } from 'gatsby'
import PropTypes from 'prop-types'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
/* App imports */
import Button from '../../components/button'
import Config from '../../../config'
import Utils from '../../utils'
import * as style from './archive-pagination.module.less'

const ArchivePagination = ({ prevPage, nextPage }) => (
  <div className={style.container}>
    {prevPage ? (
      <Button
        to={withPrefix(Utils.resolvePageUrl(Config.pages.archive, prevPage))}
        buttonStyle={style.buttonLeft}
      >
        <FaArrowLeft />
        <span>Entradas más nuevas</span>
      </Button>
    ) : null}
    {nextPage ? (
      <Button
        to={withPrefix(Utils.resolvePageUrl(Config.pages.archive, nextPage))}
        buttonStyle={style.buttonRight}
      >
        <span>Entradas más antiguas</span>
        <FaArrowRight />
      </Button>
    ) : null}
  </div>
)

ArchivePagination.propTypes = {
  prevPage: PropTypes.number,
  nextPage: PropTypes.number,
}

export default ArchivePagination
