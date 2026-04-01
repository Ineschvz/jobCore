//component loads, adds, deletes jobs
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '../../../utils/supabase/client';
import Link from 'next/link';

export default function JobsPage() {
  const supabase = createClient();
  const [jobs, setJobs] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  // Load all jobs for the current user
  async function loadJobs() {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading jobs:', error);
    } else {
      setJobs(data || []);
    }
  }

  useEffect(() => {
    loadJobs();
  }, []);

  // Add a new job (user_id is set automatically by Supabase auth)
  async function addJob() {
    if (!title.trim() || !description.trim()) {
      alert('Fill in both fields please.');
      return;
    }

    setSaving(true);

    // Get the current user's ID
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('jobs')
      .insert([{ title, description, user_id: user.id }])
      .select()
      .single();

    setSaving(false);

    if (error) {
      console.error('Error adding job:', error);
      alert('Error adding job, please try again.');
    } else {
      setJobs((prev) => [data, ...prev]);
      setTitle('');
      setDescription('');
    }
  }

  // Delete a job
  async function deleteJob(id) {
    const jobId = Number(id);

    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', jobId);

    if (error) return alert(error.message);

    setJobs((prev) => prev.filter((j) => j.id !== jobId));
  }

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Jobs</h1>
          <Link
            href="/dashboard"
            className="text-sm text-slate-500 hover:text-slate-700 hover:underline"
          >
            &larr; Back to Dashboard
          </Link>
        </div>

        {/* Add job form */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <h2 className="text-lg font-semibold mb-3">Add a new job</h2>

          <input
            className="border p-2 rounded w-full mb-2"
            type="text"
            placeholder="Job Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="border p-2 rounded w-full mb-3"
            placeholder="Job Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition disabled:opacity-50"
            onClick={addJob}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Add Job'}
          </button>
        </div>

        {/* Jobs list */}
        {jobs.length === 0 ? (
          <p className="text-slate-500 text-center py-8">
            No jobs yet. Add your first one above!
          </p>
        ) : (
          <ul className="space-y-3">
            {jobs.map((job) => (
              <li
                key={job.id}
                className="p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition"
              >
                <div className="font-semibold">{job.title}</div>
                <div className="text-sm text-slate-600 mt-1">{job.description}</div>

                <button
                  className="mt-3 text-sm text-red-500 hover:underline"
                  onClick={() => deleteJob(job.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
