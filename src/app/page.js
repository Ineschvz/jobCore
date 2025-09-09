
// src/app/page.js
// This is the main page component for the JobCore application
export default async function Home() {

  const baseUrl = process.env.BASE_URL || "http://localhost:3000";
  //defining the base URL for the API request, using an environment variable if available, otherwise defaulting to localhost
  const res = await fetch (`${baseUrl}/api/hello`);
  //sending a get request to the api/hello endpoint
  //awaiting the response before continuing
  const data = await res.json();
  //parsing the response as json
  console.log("this is the data", data)



  return (
    <main>
      <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Hello, this is JobCore! ✅
      </h1>
      <p>Solutions to your concrete job-tracking problems.</p>
    </main>
  );
}