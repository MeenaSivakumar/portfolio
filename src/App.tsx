import { useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProfileSidebar from './components/ProfileSidebar';
import FeedLayout from './components/FeedLayout';
import Projects from './components/Projects';
import WorkAndBlog from './components/WorkAndBlog';
import RightSidebar from './components/RightSidebar';
import Footer from './components/Footer';
import AnimatedBackground from './components/AnimatedBackground';

function App() {
  useEffect(() => {
    // Smooth scroll behavior for anchor links
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');
      if (anchor) {
        e.preventDefault();
        const href = anchor.getAttribute('href');
        if (href && href !== '#') {
          const element = document.querySelector(href);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 relative">
      <AnimatedBackground />
      <Header />
      <main className="relative z-10">
        {/* Main Layout - GitHub + LinkedIn Style */}
        <section id="overview" className="pt-24 pb-12 md:pt-32 md:pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-6">
              {/* Left Sidebar - Profile (GitHub + LinkedIn) */}
              <div className="hidden lg:block">
                <ProfileSidebar />
              </div>

              {/* Main Content Area */}
              <div className="flex-1 min-w-0">
                {/* Hero Section with Typing Animation */}
                <Hero />
                
                {/* Feed Content (About) */}
                <FeedLayout />
              </div>

              {/* Right Sidebar - Contact & Quick Info (LinkedIn) */}
              <div className="hidden xl:block">
                <RightSidebar />
              </div>
            </div>

            {/* Projects Section - Full Width Below Sidebars */}
            <Projects />

            {/* Work Experience & Blog - Full Width */}
            <div className="mt-6">
              <WorkAndBlog />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default App;

