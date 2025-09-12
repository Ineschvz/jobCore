// src/app/page.js
// This is the main page component for the JobCore application
import { headers } from "next/headers";


export default async function Home() {
  let apiStatus = "down";

  try { 
    const hdr = await headers();
    const host = hdr.get("host"); 
   //check the host header from the incoming request
    console.log("this is the host", host)
  
    const protocol = process.env.VERCEL ? "https" : "http";
    //determines the protocol based on the enviorment, if in vercel use https otherwise use http

    const res = await fetch (`${protocol}://${host}/api/ping`)
    //fetching the api/ping endpoint using the determined protocol and host
    if (res.ok){
      const data =await res.json();
      if(data?.ok){
        apiStatus = "up";
        console.log("api is up and running")  
      }
    }
    //if the response is ok and the data contains ok: true, set apiStatus to "up"
  }
  catch (error){
    console.error("Ping Failed:", error)
  }

  return (
    <main>
      <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Hello, this is JobCore! ✅
      </h1>
      <p>Solutions to your concrete job-tracking problems.</p>
            <p style={{ marginTop: 16 }}>
        API status:{" "}
        <span style={{ color: apiStatus === "up" ? "green" : "red" }}>
          {apiStatus}
        </span>
      </p>
    </main>
  );
} 