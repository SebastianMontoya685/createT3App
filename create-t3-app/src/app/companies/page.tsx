import Link from "next/link";

export default function CompaniesPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-20 px-4 bg-white">
      <h1 className="text-3xl font-bold mb-4">Companies Page</h1>
      <p className="mb-6 text-gray-700">Welcome to the Companies section. Add your content here as needed.</p>
      <Link href="/" className="text-indigo-600 hover:underline">Go Home</Link>
    </main>
  );
}
