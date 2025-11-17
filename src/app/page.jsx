import LatestJobsServer from "@/components/LatestJobsServer";
import AdmitCardsServer from "@/components/AdmitCardsServer";
import ResultsServer from "@/components/ResultsServer";
import YojnasServer from "@/components/YojnasServer";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="max-w-6xl mx-auto p-4">
      {/* Latest Jobs */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-blue-800 mb-4 rounded-full text-center p-1 bg-[#f6e7d2]">Latest Jobs / नवीनतम नौकरियाँ</h2>
        <LatestJobsServer limit={6} />
        <div className="flex justify-center mt-6">
          <Link
            href="/jobs"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-xl font-semibold shadow transition"
          >
            View All Jobs
          </Link>
        </div>
      </section>

      {/* Admit Cards */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-blue-800 mb-4 rounded-full text-center p-1 bg-[#f6e7d2]">Admit Cards / प्रवेश पत्र</h2>
        <AdmitCardsServer limit={6} />
        <div className="flex justify-center mt-6">
          <Link
            href="/admit-cards"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-xl font-semibold shadow transition"
          >
            View All Admit Cards
          </Link>
        </div>
      </section>

      {/* Results */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-blue-800 mb-4 rounded-full text-center p-1 bg-[#f6e7d2]">Results / परिणाम</h2>
        <ResultsServer limit={6} />
        <div className="flex justify-center mt-6">
          <Link
            href="/results"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-xl font-semibold shadow transition"
          >
            View All Results
          </Link>
        </div>
      </section>

      {/* Sarkari Yojana */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-blue-800 mb-4 rounded-full text-center p-1 bg-[#f6e7d2]">Sarkari Yojana / सरकारी योजना</h2>
        <YojnasServer limit={6} />
        <div className="flex justify-center mt-6">
          <Link
            href="/yojna"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-xl font-semibold shadow transition"
          >
            View All Yojanas
          </Link>
        </div>
      </section>
    </main>
  );
}
