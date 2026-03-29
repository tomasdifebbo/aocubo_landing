import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedProperties from "@/components/FeaturedProperties";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";

export default function Home() {
  const [filters, setFilters] = useState<{
    neighborhood?: string;
    bedrooms?: number;
    parkingSlots?: number;
    maxPrice?: number;
    status?: string;
  }>({});

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <Hero onSearch={setFilters} />
        <FeaturedProperties filters={filters} />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
}
