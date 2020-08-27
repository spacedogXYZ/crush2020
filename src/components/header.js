import React, { useState } from "react"
import { Link } from "gatsby"
import { OutboundLink } from "gatsby-plugin-google-analytics"
import PropTypes from "prop-types"

import {
  Header,
  Title,
  Logo,
  NavMenuButton,
  PrimaryNav,
} from "@trussworks/react-uswds"

import logoImg from "../images/logo.png"

const navItems = [
  <Link to={"/about"} activeClassName="usa-current">
    About
  </Link>,
  <Link to={"/methodology"} activeClassName="usa-current">
    Methodology
  </Link>,
  <OutboundLink
    href="https://secure.actblue.com/donate/crush2020?ref=header"
    target="_blank"
    rel="noreferrer"
  >
    Donate
  </OutboundLink>,
]

const SiteHeader = ({ siteTitle }) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const toggleMobileNav = () => {
    setMobileNavOpen(prevOpen => !prevOpen)
  }

  return (
    <Header basic>
      <div className="usa-nav-container">
        <div className="usa-navbar">
          <Title>
            <Link to={"/"}>
              <Logo
                image={
                  <img
                    className="usa-footer__logo-img"
                    src={logoImg}
                    alt="Crush2020"
                  />
                }
              />
            </Link>
          </Title>
          <NavMenuButton
            label="Menu"
            onClick={toggleMobileNav}
            className="usa-menu-btn"
          />
        </div>

        <PrimaryNav
          aria-label="Primary navigation"
          items={navItems}
          onToggleMobileNav={toggleMobileNav}
          mobileExpanded={mobileNavOpen}
        />
      </div>
    </Header>
  )
}

SiteHeader.propTypes = {
  siteTitle: PropTypes.string,
}

SiteHeader.defaultProps = {
  siteTitle: ``,
}

export default SiteHeader
