import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

import { GridContainer } from "@trussworks/react-uswds"

const AboutPage = () => (
  <Layout>
    <SEO title="Crush2020 Privacy Policy" />
    <GridContainer>
      <h1>Privacy Policy</h1>
      <h2>We take your privacy seriously</h2>

      <h3>Submitted Information</h3>

      <p>
        We will never sell, transfer, or spam your email address or other
        provided contact information. We will only contact you only to share
        information about your Crush2020 plan, and you can unsubscribe at any
        time.
      </p>
      <p>
        When you make a plan with Crush2020, we store your name, email, provided
        address, interests and suggested donation amounts in order to provide
        you with a personalized plan of action. We may communicate statistics
        about our users in aggregate, but will never transfer or publically
        release individual user information.
      </p>

      <h3>Information Gathered</h3>

      <p>
        We log other technical information as part of the normal operation of
        this site and may send it to third-parties for data analysis and service
        provision. These parties are covered by their own privacy policies.
      </p>
      <ul>
        <li>
          Google Analytics may receive your anonymized IP address when you
          browse this site.
        </li>
        <li>
          Google Maps and Civic API may receive your address when you create a
          plan. We store the returned response, including congressional and
          state legislative district.
        </li>
        <li>
          ActionNetwork may receive your email address if you create a plan with
          us. Every email we send will have a clear unsubscribe link.
        </li>
        <li>
          We may store a unique ID with your web browser's "cookie" or local
          storage, so you can come back to your plan later.
        </li>
        <li>
          If you donate to us, ActBlue may receive your biliing details, and the
          amount donated to CrushPAC may become public record.
        </li>
      </ul>

      <h3>Children under the age of 13</h3>
      <p>
        Crush2020 is not intended for children under 13 years of age. No one
        under age 13 may provide any personal information to or on the Service.
        We do not knowingly collect personal information from children under 13.
        If you are under 13, do not provide any information to us through the
        Service, use any of the interactive or public comment features of the
        Service or provide any information about yourself to us, including your
        name, address, telephone number, email address or any screen name or
        user name you may use. If we learn we have collected or received
        personal information from a child under 13 without verification of
        parental consent, we will use all reasonable efforts to delete such
        information. If you believe we might have any information from or about
        a child under 13, please contact us at privacy@crush2020.org.
      </p>

      <h3>Required Disclosure</h3>

      <p>
        We may disclose personally identifiable information about you to third
        parties in limited circumstances, including: (1) with your consent; or
        (2) when we have a good faith belief it is required by law, such as
        pursuant to a subpoena or other judicial or administrative order.
      </p>

      <p>
        If we are required by law to disclose the information that you have
        submitted, we will attempt to provide you with prior notice (unless we
        are prohibited or it would be futile) that a request for your
        information has been made in order to give you an opportunity to object
        to the disclosure. We will attempt to provide this notice by email, if
        you have given us an email address, or by postal mail if you have
        entered a postal address. If you do not challenge the disclosure
        request, we may be legally required to turn over your information.
      </p>

      <h4>Acknowledgements</h4>
      <p>
        Portions of this policy provided by the Electronic Frontier Foundation,
        under a Creative Commons Attribution license.
      </p>
    </GridContainer>
  </Layout>
)

export default AboutPage
