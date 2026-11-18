import type { Metadata } from "next"
import Link from "next/link"
import LegalPage, { LegalSection } from "../components/LegalPage"
import { pageMetadata } from "../utils/seo"

export const metadata: Metadata = pageMetadata({
  path: "/terms",
  title: "Terms of Use | Frenem",
  description: "The terms for using the Frenem website, operated by Protark Pvt. Ltd.",
})

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Use" path="/terms" updated="18 November 2026">
      <LegalSection heading="Who we are">
        <p>
          This website is operated by Protark Pvt. Ltd. (&ldquo;Protark&rdquo;, &ldquo;we&rdquo;), trading as Frenem.
          By using it, you agree to these terms.
        </p>
      </LegalSection>

      <LegalSection heading="What this site is">
        <p>
          This is an information website for our business products. It has no accounts and delivers no services. Our
          products, such as Pulse, Build and Prism, run on separate sites and are governed by their own terms or a
          separate written agreement, which take priority over these terms for that product.
        </p>
      </LegalSection>

      <LegalSection heading="Information you submit">
        <p>
          You may send us your contact details and enquiry through the forms on this site. You are responsible for
          what you submit: keep it accurate, and do not include sensitive information such as passwords or financial
          details. We use it to respond to you, as described in our{" "}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-ink">
            Privacy Policy
          </Link>
          . A submission creates no contract or business relationship.
        </p>
      </LegalSection>

      <LegalSection heading="No liability">
        <p>
          The site and its content are provided &ldquo;as is&rdquo;, for general information only, and are not
          professional advice. We make no promise that they are accurate, complete or available at all times. To the
          fullest extent permitted by law, Protark and its directors, employees and affiliates accept no liability for
          any loss or damage, direct or indirect, arising from your use of the site, reliance on its content, or
          information you submit through it.
        </p>
      </LegalSection>

      <LegalSection heading="Intellectual property">
        <p>
          The content, design, names and logos on this site, including Frenem, Pulse, Build and Prism, belong to
          Protark or its licensors. Please do not copy or reuse them without our written permission.
        </p>
      </LegalSection>

      <LegalSection heading="Changes and governing law">
        <p>
          We may update these terms at any time; continued use means you accept the update. These terms are governed by
          the laws of India.
        </p>
      </LegalSection>

      <LegalSection heading="Contact">
        <p>
          Questions? Email <a href="mailto:team@frenem.com" className="underline underline-offset-2 hover:text-ink">
            team@frenem.com
          </a>.
        </p>
      </LegalSection>
    </LegalPage>
  )
}
