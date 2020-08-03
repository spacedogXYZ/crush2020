import React, { useState } from "react"
import { Link } from "gatsby"
import PropTypes from "prop-types"

import {
  Header,
  Title,
  NavMenuButton,
  PrimaryNav,
} from "@trussworks/react-uswds"

const navItems = [
  <Link to={"/"} activeClassName="usa-current"></Link>,
  <Link to={"/about"} activeClassName="usa-current">
    About
  </Link>,
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
            <Link to={"/"}>{siteTitle}</Link>
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
