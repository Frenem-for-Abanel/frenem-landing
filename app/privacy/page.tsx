import type { Metadata } from "next"
import LegalPage, { LegalSection } from "../components/LegalPage"
import { pageMetadata } from "../utils/seo"

export const metadata: Metadata = pageMetadata({
  path: "/privacy",
  title: "Privacy Policy | Frenem",
  description: "How the Frenem website, operated by Protark Pvt. Ltd., handles the little personal data it receives.",
})

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" path="/privacy" updated="18 November 2026">
      <LegalSection heading="Overview">
        <p>
          This website is operated by Protark Pvt. Ltd. (&ldquo;Protark&rdquo;, &ldquo;we&rdquo;), trading as Frenem.
          It is an information site with no accounts. We do not sell data or run advertising or tracking cookies. Our
          products run on separate sites and are covered by their own privacy terms, not this policy.
        </p>
      </LegalSection>

      <LegalSection heading="What we collect">
        <p>
          <strong className="font-semibold text-ink">What you send us.</strong> If you use a contact form, we receive
          what you enter, such as your name, work email, company and message. It reaches our team by email and is used
          only to respond to you.
        </p>
        <p>
          <strong className="font-semibold text-ink">Technical data.</strong> Our hosting provider processes standard
          server data, such as IP address and browser type, to run and secure the site.
        </p>
      </LegalSection>

      <LegalSection heading="Sharing and retention">
        <p>
          We share information only with providers that help us run the site and receive your message (such as hosting
          and email), or where the law requires. We keep enquiries only as long as needed to respond and follow up.
        </p>
      </LegalSection>

      <LegalSection heading="Your choices">
        <p>
          To ask us to correct or delete what you sent, email <a href="mailto:team@frenem.com" className="underline underline-offset-2 hover:text-ink">
            team@frenem.com
          </a>.
        </p>
      </LegalSection>

      <LegalSection heading="No liability">
        <p>
          You submit information at your own discretion and risk. No method of transmission over the internet is
          completely secure, and to the fullest extent permitted by law, Protark accepts no liability for loss or
          misuse of information arising from its transmission, from third-party providers, or from circumstances
          beyond our reasonable control. We may update this policy at any time; the date above shows the latest
          version.
        </p>
      </LegalSection>
    </LegalPage>
  )
}
