import Sidebar from "../components/Sidebar";

import HeroBanner from "../components/HeroBanner";
import NavigationCards from "../components/NavigationCards";
import WelcomeVideo from "../components/WelcomeVideo";
import VisionSection from "../components/VisionSection";
import MissionSection from "../components/MissionSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <HeroBanner />

      <main className="max-w-7xl mx-auto px-8 py-8 space-y-16">
        <NavigationCards />

        <WelcomeVideo />

        <VisionSection />

        <MissionSection />
      </main>
    </div>
  );
}