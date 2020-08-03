import React from "react"
import PropTypes from "prop-types"

import {
  Button,
  Footer,
  Logo,
  SocialLinks,
} from "@trussworks/react-uswds"
import "@trussworks/react-uswds/lib/uswds.css"

import "../styles/social-icons.css"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const returnToTop = (
  <div className="grid-container usa-footer__return-to-top">
    <Button type="button" unstyled>
      Return to top
    </Button>
  </div>
)

const SiteFooter = ({siteTitle}) => {
  return (
    <Footer
    size="slim"
    returnToTop={returnToTop}
    secondary={
      <div className="grid-row grid-gap">
        <Logo
          medium
          heading={<h3 className="usa-footer__logo-heading">{siteTitle}</h3>}
        />
        <div className="usa-footer__contact-links mobile-lg:grid-col-6">
          <SocialLinks
            links={[
              <a
                key="twitter"
                className="usa-social-link"
                href="https://twitter.com">
                <FontAwesomeIcon icon={['fab', 'twitter']} size="2x" />
                <span>Twitter</span>
              </a>,
              <a
                key="instagram"
                className="usa-social-link"
                href="https://instagram.com">
                <FontAwesomeIcon icon={['fab', 'instagram']} size="2x" />
                <span>Instagram</span>
              </a>,
              <a
                key="facebook"
                className="usa-social-link"
                href="https://facebook.com">
                <FontAwesomeIcon icon={['fab', 'facebook-f']} size="2x" />
                <span>Facebook</span>
              </a>,
            ]}
          />
        </div>
      </div>
    }
  />
  )
}

SiteFooter.propTypes = {
  siteTitle: PropTypes.string,
}

SiteFooter.defaultProps = {
  siteTitle: ``,
}

export default SiteFooter
