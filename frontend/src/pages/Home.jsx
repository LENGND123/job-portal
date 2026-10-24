import CategoryCarousel from "../components/CategoryCarousel";
import Hero from "../components/Hero";
import LatestJobs from "../components/LatestJobs";

export default function Home() {
  return (
    <div>
      <Hero />
      <CategoryCarousel />
      <LatestJobs />
    </div>
  );
}
