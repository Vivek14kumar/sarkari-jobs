import { connectToDB } from "@/lib/mongodb";
import Yojna from "@/app/api/models/Yojna";
import Link from "next/link";
import { 
  FaArrowLeft, 
  FaCheckCircle, 
  FaExternalLinkAlt, 
  FaQuestionCircle, 
  FaFileAlt, 
  FaInfoCircle 
} from "react-icons/fa";

export default async function YojnaDetailPage({ params }) {
  const { id } = params;
  await connectToDB();
  //const yojna = await Yojna.findById(id).lean();
  let yojna = null;

  // 🟢 Try to find by slug first
  yojna = await Yojna.findOne({ slug: id }).lean();

  // 🔵 If not found by slug, try by ObjectId
  if (!yojna && id.match(/^[0-9a-fA-F]{24}$/)) {
    yojna = await Yojna.findById(id).lean();
  }
  if (!yojna)
    return (
      <p className="text-center text-red-600 text-lg mt-10 font-semibold">
        Yojna not found.
      </p>
    );

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-10">
      {/* Back Button */}
      <Link
        href="/yojna"
        className="inline-flex items-center text-green-600 font-medium hover:underline gap-2 transition-transform hover:scale-105"
      >
        <FaArrowLeft /> Back to All Yojnas
      </Link>

{/* Hero Section */}
<div className="relative ">
  
  {/* Title */}
  <div className="text-center m-1">
    <h1 className="text-2xl md:text-4xl font-extrabold drop-shadow-2xl animate-fadeIn p-2">
      {yojna.title_en} / {yojna.title_hi}
    </h1>
  </div>

  {/* Thumbnail Image */}
  {yojna.thumbnail && (
    <div className="relative aspect-video w-full overflow-hidden rounded-3xl">
      <img
        src={yojna.thumbnail}
        alt={yojna.title_en}
        className="w-full h-full object-cover object-center brightness-95 transition-transform duration-700 hover:scale-105"
        style={{ maxHeight: "720px" }}
      />
      
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
    </div>
  )}

</div>


      {/* Description Card */}
      <div className="bg-gradient-to-r from-green-50 to-green-100 border-l-8 border-green-400 rounded-3xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300">
        <p className="text-gray-800 text-lg md:text-xl leading-relaxed">
          {yojna.description_en}
        </p>
        {yojna.description_hi && (
          <p className="mt-4 text-gray-600 text-base md:text-lg">
            {yojna.description_hi}
          </p>
        )}
      </div>

      {/* Sections Array */}
      {[
        { 
          icon: <FaCheckCircle className="text-green-500" />, 
          title: "Eligibility Criteria", 
          items: yojna.eligibility 
        },
        { 
          icon: <FaFileAlt className="text-yellow-500" />, 
          title: "Important Documents", 
          items: yojna.documents 
        },
        { 
          icon: <FaExternalLinkAlt className="text-blue-500" />, 
          title: "Useful Links", 
          items: yojna.links, 
          isLink: true 
        },
        { 
          icon: <FaQuestionCircle className="text-purple-500" />, 
          title: "Frequently Asked Questions", 
          items: yojna.faq, 
          isFAQ: true 
        },
        { 
          icon: <FaInfoCircle className="text-orange-500" />, 
          title: "Other Details", 
          items: yojna.otherDetails 
        },
      ].map(
        (section, idx) =>
          section.items?.length > 0 && (
            <div
              key={idx}
              className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-3xl shadow-md p-6 hover:shadow-xl transition duration-300 hover:-translate-y-1 hover:scale-102"
            >
              <h3 className="flex items-center gap-3 text-xl font-bold text-green-600 mb-4">
                {section.icon} {section.title}
              </h3>
              
              {section.isFAQ ? (
                <div className="space-y-4">
                  {section.items.map((f, i) => (
                    <div key={i} className="p-4 border-l-4 border-green-500 bg-green-50 rounded-lg shadow-sm hover:shadow-md transition">
                      <p className="font-semibold text-gray-900">{f.question}</p>
                      <p className="text-gray-700 mt-1">{f.answer}</p>
                    </div>
                  ))}
                </div>
              ) : section.isLink ? (
                <ul className="space-y-3">
                  {section.items.map((l, i) => (
                    <li key={i}>
                      <a
                        href={l.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 underline font-medium transition-transform hover:scale-105"
                      >
                        {l.type} <FaExternalLinkAlt className="text-xs" />
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {section.items.map((item, i) => (
                    <li key={i} className="hover:text-green-600 transition-transform hover:translate-x-1">
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )
      )}
    </main>
  );
}
