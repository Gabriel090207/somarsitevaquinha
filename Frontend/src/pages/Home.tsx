import { Hero } from "../components/Hero/Hero";
import { Campaigns } from "../components/Campaigns/Campaigns";
import { MonthlyDonation } from "../components/MonthlyDonation/MonthlyDonation";
import { TrustSection } from "../components/TrustSection/TrustSection";
import { StoryCTA } from "../components/StoryCTA/StoryCTA";


export function Home() {
  return (
    <>
      <Hero />

      <Campaigns />
      <MonthlyDonation />
      <TrustSection />
      <StoryCTA />
    </>
  );
}