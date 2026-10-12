import Footer from "@/components/LandingPageUI/Footer";
import Hero from "@/components/LandingPageUI/Hero";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <Hero />
      <Footer />
    </main>
  );
}
