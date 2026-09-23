import AuthRedirect from '@/components/landing/AuthRedirect';
import LandingHeader from '@/components/landing/LandingHeader';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import HowItWorks from '@/components/landing/HowItWorks';
import CTASection from '@/components/landing/CTASection';
import FAQ from '@/components/landing/FAQ';
import LandingFooter from '@/components/landing/LandingFooter';

// This page is a Server Component: its content (headings, text, images) is
// present in the initial HTML response with no JavaScript required, which
// is what lets Google actually index HRJ Board's homepage content instead
// of an empty, client-redirected shell.
export default function Home() {
  return (
    <>
      {/* Only redirects visitors who already have a session - crawlers and
          logged-out visitors always see the full page below. */}
      <AuthRedirect />

      <div className="min-h-screen bg-white dark:bg-slate-950">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:text-slate-900 focus:shadow"
        >
          Skip to content
        </a>

        <LandingHeader />

        <main id="main-content">
          <Hero />
          <Features />
          <HowItWorks />
          <CTASection />
          <FAQ />
        </main>

        <LandingFooter />
      </div>
    </>
  );
}
