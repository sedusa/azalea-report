import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-azalea-green text-white py-6 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold hover:text-azalea-peach transition-colors">
              Azalea Report
            </Link>
            <nav className="flex gap-6">
              <Link href="/archives" className="hover:text-azalea-peach transition-colors">
                Archives
              </Link>
              <Link href="/about" className="text-azalea-peach font-semibold">
                About
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Page Header */}
      <section className="bg-azalea-peach py-12 border-b-4 border-azalea-green">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            About the Azalea Report
          </h1>
          <p className="text-lg text-gray-700">
            The official newsletter of the SGMC Internal Medicine Residency Program
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-azalea-green mb-4">
                Our Mission
              </h2>
              <p className="text-gray-700 leading-relaxed">
                The Azalea Report serves as the primary communication channel for the SGMC Internal
                Medicine Residency Program, keeping residents, faculty, and staff connected through
                monthly updates, achievements, and community news.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-azalea-green mb-4">
                What You'll Find
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Resident spotlights and achievements</li>
                <li>Program updates and announcements</li>
                <li>Educational content and research highlights</li>
                <li>Community events and celebrations</li>
                <li>Wellness tips and resources</li>
                <li>Birthday celebrations and milestones</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-azalea-green mb-4">
                Publication Schedule
              </h2>
              <p className="text-gray-700 leading-relaxed">
                The Azalea Report is published monthly, bringing you the latest news and updates
                from our residency program. Each edition is carefully curated to celebrate our
                community and share important information.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-azalea-green mb-4">
                Contact Us
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Have a story to share or suggestions for the newsletter? We'd love to hear from you!
                Contact the editorial team through the residency program office.
              </p>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <Link
                href="/archives"
                className="inline-flex items-center gap-2 text-azalea-green hover:text-azalea-green-hover font-semibold text-lg transition-colors"
              >
                Browse All Issues
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} SGMC Internal Medicine Residency Program
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Azalea Report Newsletter
          </p>
        </div>
      </footer>
    </main>
  );
}
