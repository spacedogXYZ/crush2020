import React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"
import { OutboundLink } from "gatsby-plugin-google-analytics"

import { Footer, Logo, SocialLinks } from "@trussworks/react-uswds"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const SiteFooter = () => {
  return (
    <Footer
      size="slim"
      secondary={
        <div className="grid-row grid-gap">
          <Logo
            medium
            heading={<h3 className="usa-footer__logo-heading">CrushPAC 2020</h3>}
          />
          
          <div className="usa-footer__contact-links mobile-lg:grid-col-6">
            <SocialLinks
              links={[
                <OutboundLink
                  key="twitter"
                  className="usa-social-link icon-center"
                  href="https://twitter.com/crush2020_/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FontAwesomeIcon icon={["fab", "twitter"]} size="1x" />
                  <span>Twitter</span>
                </OutboundLink>,
                <OutboundLink
                  key="instagram"
                  className="usa-social-link icon-center"
                  href="https://instagram.com/crush2020election/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FontAwesomeIcon icon={["fab", "instagram"]} size="1x" />
                  <span>Instagram</span>
                </OutboundLink>,
                <OutboundLink
                  key="facebook"
                  className="usa-social-link icon-center"
                  href="https://www.facebook.com/crush2020election/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FontAwesomeIcon icon={["fab", "facebook-f"]} size="1x" />
                  <span>Facebook</span>
                </OutboundLink>,
              ]}
            />
            <Link to={'/privacy'}>Privacy Policy</Link>&nbsp;&nbsp;
            <OutboundLink href="https://github.com/spacedogXYZ/crush2020" target="_blank" rel="noreferrer">Source Code</OutboundLink>
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
