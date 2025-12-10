import Layout from "../../components/Layout";
import HeroSection from "./components/HeroSection";
import { fetchRoot } from "../../api";
import { useQuery } from '@tanstack/react-query';

export default function HomePage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['root'],
    queryFn: fetchRoot,
    retry: 1
  });

  return (
    <Layout>
      <HeroSection />
      
      {/* API Status Indicator */}
      <div className="fixed bottom-4 right-4 z-50">
        {isLoading && (
          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-800"></div>
            <span className="text-sm">Connecting...</span>
          </div>
        )}
        {error && (
          <div className="bg-red-100 text-red-800 px-4 py-2 rounded-lg shadow-lg">
            <span className="text-sm">Backend connection failed</span>
          </div>
        )}
        {data && (
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg shadow-lg">
            <span className="text-sm">✓ Backend connected</span>
          </div>
        )}
      </div>
    </Layout>
  );
}