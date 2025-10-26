import Link from "next/link";

export default function AdminJobCard({ job }) {
  return (
    <div className="bg-white shadow rounded p-4 flex flex-col justify-between">
      <h2 className="font-bold text-blue-700">{job.title_en}</h2>
      <div className="mt-2 flex justify-between">
        <Link
          href={`/admin/dashboard/edit-job/${job.slug}`}
          className="text-sm text-yellow-700 hover:underline"
        >
          Edit
        </Link>
        <button className="text-sm text-red-600 hover:underline">Delete</button>
      </div>
    </div>
  );
}
