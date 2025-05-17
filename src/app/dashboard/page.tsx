"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// Define the Wedding type based on your Supabase schema
// If you have a generated types file, import from there
// Otherwise, define minimally here:
type Wedding = {
  id: string;
  title: string;
  slug: string;
  user_id: string;
  created_at?: string;
};

export default function DashboardPage() {
  const [weddings, setWeddings] = useState<Wedding[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchWeddings = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      const { data, error } = await supabase
        .from("weddings")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setWeddings(data || []);
      setLoading(false);
    };
    fetchWeddings();
  }, [supabase, router]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">My Weddings</h1>
      <button
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => router.push("/dashboard/create-wedding")}
      >
        + Create New Wedding
      </button>
      {weddings.length === 0 ? (
        <div>No weddings yet.</div>
      ) : (
        <ul className="space-y-4">
          {weddings.map((wedding) => (
            <li key={wedding.id} className="border p-4 rounded flex justify-between items-center">
              <div>
                <div className="font-semibold">{wedding.title}</div>
                <div className="text-sm text-gray-500">
                  <a
                    href={`/weddings/${wedding.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    View Microsite
                  </a>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 bg-green-500 text-white rounded"
                  onClick={() => router.push(`/dashboard/edit-wedding/${wedding.id}`)}
                >
                  Edit
                </button>
                <button
                  className="px-3 py-1 bg-red-500 text-white rounded"
                  onClick={async () => {
                    if (confirm("Delete this wedding?")) {
                      await supabase.from("weddings").delete().eq("id", wedding.id);
                      setWeddings(weddings.filter(w => w.id !== wedding.id));
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 