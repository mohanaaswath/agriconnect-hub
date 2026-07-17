import { createFileRoute, Link } from "@tanstack/react-router";

const URL = "https://farm-first-connect.lovable.app/blog/guide-to-buying-agricultural-land-tamil-nadu";
const TITLE = "Guide to buying agricultural land in Tamil Nadu (2026)";
const DESCRIPTION =
  "Step-by-step guide to buying agricultural land in Tamil Nadu — Patta Chitta verification, FMB, EC checks, land conversion rules, taxes and common pitfalls.";
const PUBLISHED = "2026-07-01";

export const Route = createFileRoute("/blog/guide-to-buying-agricultural-land-tamil-nadu")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { property: "og:url", content: URL },
      { property: "article:published_time", content: `${PUBLISHED}T00:00:00Z` },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: TITLE,
          description: DESCRIPTION,
          datePublished: PUBLISHED,
          author: { "@type": "Organization", name: "Dhandapani Farms" },
          publisher: {
            "@type": "Organization",
            name: "Dhandapani Farms",
            logo: {
              "@type": "ImageObject",
              url: "https://farm-first-connect.lovable.app/favicon.png",
            },
          },
          mainEntityOfPage: URL,
        }),
      },
    ],
  }),
  component: GuidePage,
});

function GuidePage() {
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-xs uppercase tracking-widest text-gold">Guide · Real Estate</div>
      <h1 className="mt-3 font-display text-4xl sm:text-5xl font-bold leading-tight">{TITLE}</h1>
      <p className="mt-4 text-muted-foreground text-lg">
        Buying agricultural land in Tamil Nadu is straightforward once you know which records to
        check and which rules apply. This guide walks through the legal essentials, the documents
        every buyer should verify, and how land-use conversion works — the way a first-time
        buyer would encounter them.
      </p>

      <Section title="1. Confirm you are eligible to buy">
        <p>
          Under the Tamil Nadu Land Reforms (Fixation of Ceiling on Land) Act, an individual or
          family is capped at 15 standard acres of agricultural land. Non-agriculturists can buy
          agricultural land in Tamil Nadu — unlike some other states — but the ceiling still
          applies. NRIs and foreign nationals cannot buy agricultural land without RBI approval.
        </p>
      </Section>

      <Section title="2. Verify Patta Chitta (ownership record)">
        <p>
          The <strong>Patta</strong> is issued by the Revenue Department and names the legal owner
          of a survey number. <strong>Chitta</strong> is the record classifying the land as
          <em> Nanjai</em> (wet) or <em>Punjai</em> (dry). Pull the latest Patta Chitta online via
          the{" "}
          <a
            className="text-gold underline"
            href="https://eservices.tn.gov.in/eservicesnew/index.html"
            target="_blank"
            rel="noreferrer"
          >
            TN e-Services portal
          </a>{" "}
          and confirm the seller's name, survey number, and extent match what you're being sold.
        </p>
      </Section>

      <Section title="3. Cross-check with FMB, A-Register and Adangal">
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>FMB (Field Measurement Book)</strong>: the survey sketch of the parcel — use
            it to confirm shape and boundaries.
          </li>
          <li>
            <strong>A-Register</strong>: total village land record, useful when a survey number
            has been split.
          </li>
          <li>
            <strong>Adangal</strong>: crop-cultivation record. Confirms the land is actually
            farmed — important for land-conversion applications later.
          </li>
        </ul>
      </Section>

      <Section title="4. Pull the Encumbrance Certificate (EC)">
        <p>
          Request a 30-year EC from the sub-registrar office (or online at{" "}
          <a
            className="text-gold underline"
            href="https://tnreginet.gov.in"
            target="_blank"
            rel="noreferrer"
          >
            TNReginet
          </a>
          ). A clean EC shows no active mortgage, court attachment or unpaid loan on the parcel.
          If a bank loan appears, insist on a written no-dues certificate before closing.
        </p>
      </Section>

      <Section title="5. Trace the title for at least 30 years">
        <p>
          Ask a local advocate for a title-search opinion covering three decades of prior sale
          deeds, partition deeds, gift deeds and settlement deeds. Gaps or unregistered
          transfers are the most common reason deals unwind after money changes hands.
        </p>
      </Section>

      <Section title="6. Check zoning and land-use conversion">
        <p>
          Agricultural land can only be used for agriculture until it is officially converted.
          If you plan to build a farmhouse, warehouse, or non-agricultural use, apply for
          conversion under Section 4A of the Tamil Nadu Land Reforms Act with the District
          Collector. Conversion fees depend on classification (wet/dry) and location, and
          approval is not guaranteed inside notified urban-development zones.
        </p>
      </Section>

      <Section title="7. Register the sale properly">
        <p>
          Sale deeds must be executed on non-judicial stamp paper and registered at the
          jurisdictional sub-registrar. Current Tamil Nadu stamp duty on agricultural land is
          7% of the market value plus 4% registration fee (verify the latest rates before
          closing). Both parties, two witnesses, and originals of ID and Patta must be
          present.
        </p>
      </Section>

      <Section title="8. After registration">
        <p>
          File for <strong>mutation (Patta transfer)</strong> at the taluk office within a few
          weeks — the sale isn't recognised in revenue records until your name is on the Patta.
          Keep the registered deed, mutation order, and updated Adangal together for future
          resale or loans.
        </p>
      </Section>

      <Section title="Common pitfalls">
        <ul className="list-disc pl-5 space-y-1">
          <li>Trusting a Xerox Patta — always pull the latest online copy yourself.</li>
          <li>Skipping the EC because the seller "assures" it's clean.</li>
          <li>Missing joint-family or partition disputes hidden in older deeds.</li>
          <li>Assuming DTCP or panchayat approval already exists for a nearby "layout".</li>
          <li>Paying in cash above ₹20,000 for a single transaction — disallowed under IT rules.</li>
        </ul>
      </Section>

      <div className="mt-12 rounded-2xl glass p-6">
        <div className="text-xs uppercase tracking-widest text-gold">Ready to browse?</div>
        <h2 className="mt-2 font-display text-2xl font-semibold">
          See verified agricultural land in Tamil Nadu
        </h2>
        <p className="mt-2 text-muted-foreground">
          Every listing on Dhandapani Farms includes soil type, water source, and owner
          verification — so your due diligence starts from a stronger baseline.
        </p>
        <Link
          to="/real-estate"
          className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary to-[color:var(--dark-gold)] text-primary-foreground font-medium shadow-glow"
        >
          Browse real estate →
        </Link>
      </div>

      <p className="mt-10 text-xs text-muted-foreground">
        This guide is general information, not legal advice. Rules and fees change — verify with
        the Tamil Nadu Revenue Department or a licensed advocate before you sign.
      </p>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-2xl font-semibold">{title}</h2>
      <div className="mt-3 text-muted-foreground leading-relaxed space-y-3">{children}</div>
    </section>
  );
}
