import React from "react"
import PropTypes from "prop-types"

import { Footer, Logo, SocialLinks } from "@trussworks/react-uswds"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const SiteFooter = ({ siteTitle }) => {
  return (
    <Footer
      size="slim"
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
                  className="usa-social-link icon-center"
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FontAwesomeIcon icon={["fab", "twitter"]} size="1x" />
                  <span>Twitter</span>
                </a>,
                <a
                  key="instagram"
                  className="usa-social-link icon-center"
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FontAwesomeIcon icon={["fab", "instagram"]} size="1x" />
                  <span>Instagram</span>
                </a>,
                <a
                  key="facebook"
                  className="usa-social-link icon-center"
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FontAwesomeIcon icon={["fab", "facebook-f"]} size="1x" />
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
