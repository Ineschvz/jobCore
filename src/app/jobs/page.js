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
            <h1 className='text-2xl font-bold mb-4'>
                List of jobs:
            </h1>
            <ul className='space-y-2'>
                {jobs.map((job) => (
                    <li  key = {job.id}
                    className='p-4 border rounded shadow-sm hover:bg-gray-50 transition'>
                        <div className=''> {job.title}</div>
                    </li>
                ))}
            </ul>
        </main>
    )

}