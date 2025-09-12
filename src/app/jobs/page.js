//component 

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../db/client';

export default function JobsPage() {

    const [jobs, setJobs] = useState([]);

    async function loadJobs() {
        const{data, error } = await supabase
        .from('jobs')
        .select('*');

        if (error) {
            console.error('Error loading jobs:', error);
        }else {
            setJobs(data || [])
        }
    }
    useEffect(() => {
        loadJobs();
    }, []);


    return (
        <main>
            <h1 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
                List of jobs:
            </h1>
            <ul style={{ display: 'grid', gap: 8 }}>
                {jobs.map((job) => (
                    <li  key = {job.id}
                    style={{ padding: 12, border: '1px solid #ccc', borderRadius: 4 }}>
                        <div style={{ fontWeight: 600 }}> {job.title}</div>
                    </li>
                ))}
            </ul>
        </main>
    )

}