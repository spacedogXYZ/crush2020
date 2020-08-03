import React from "react"
import { Link } from "gatsby"
import PropTypes from "prop-types"

import {
  Footer,
} from "@trussworks/react-uswds"
import "@trussworks/react-uswds/lib/uswds.css"

const SiteFooter = ({ siteTitle }) => {
  return (
    <Footer size={'slim'}>
      
    </Footer>
  )
}

SiteFooter.propTypes = {
  siteTitle: PropTypes.string,
}

SiteFooter.defaultProps = {
  siteTitle: ``,
}

export default SiteFooter
