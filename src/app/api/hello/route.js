//API route example file 
// src/app/api/hello/route.js
// GET method handler
//responds with a JSON object containing a greeting message
//this can be accessed via a GET request to /api/hello
export async function GET(request) {
  return Response.json({message: "Hello, this is JobCore! ✅"});
}  
