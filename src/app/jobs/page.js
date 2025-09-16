//component loads, adds, deletes jobs 
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../db/client';


export default function JobsPage() {
    //this is the state to hold the list of jobs
    const [jobs, setJobs] = useState([]);
    //this is the state to hold the title and the description of the new job
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    //this is the state to indicate if the job is being saved
    const [saving, setSaving] = useState(false);

//loading all jobs from database 
    async function loadJobs() {
        const{data, error } = await supabase
        .from('jobs')
        .select('*')


        if (error) {
            console.error('Error loading jobs:', error);
        }else {
            setJobs(data || [])
        }
    }
    useEffect(() => {
        loadJobs();
    }, []);
    
//function to add job to database 
    async function addJob() {
        if (!title.trim() || !description.trim()) {
            alert("ayee fill me in please.")
            return;
        };
        setSaving(true);
        const {data, error} = await supabase
        .from('jobs')
        .insert([{ title, description }])
        .select()
        .single();
        setSaving(false);
    
        if (error) {
            console.log ("Error adding job", error);
            alert("Error adding job, please try again.")
        } else {
            //append the new job to the list of jobs
            setJobs((prevJobs) => [...prevJobs, data]);
            setTitle('');
            setDescription('');
        };
        }
        //function to delete job from database 
        async function deleteJob(id){
            const jobId = Number(id);

            const { data, error } = await supabase
            .from('jobs')
            .delete()
            .eq('id', jobId)
            .select();

            if (error) return alert(error.message);

            setJobs(prev => prev.filter(j => j.id !== jobId)); // remove locally


        }

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
                                <div className='text-sm text-gray-600'> {job.description}</div>
                                
                                <button className='mt-2 text-red-500 hover:underline'
                                onClick={() => deleteJob(job.id)}>
                                    Delete
                                </button>   
                            </li>
                        ))}
                    </ul>

                    <div>
                        <h2>  Add a new job  </h2>
        
                        <input className='border p-2 rounded w-full mb-2' 
                        type="text"
                        placeholder='Job Title'
                        value={title}
                        onChange={(e) => setTitle (e.target.value)}>
                        </input>
        
                        <textarea className='border p-2 rounded w-full mb-2'
                        placeholder = 'Job Description'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}>
                        </textarea>
        
                        <button className='bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition'
                        onClick={addJob}
                        disabled={saving}>
                            {saving ? 'Saving...' : 'Add Job'}
                        </button>
                        
                    </div>
        
                </main>
            )

    }


