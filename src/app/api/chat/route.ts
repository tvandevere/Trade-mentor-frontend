import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import path from "path";

// Define the expected request body structure
interface ChatRequestBody {
  message: string;
  history?: Array<{ sender: string; text: string }>;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as ChatRequestBody;
    const userMessage = body.message;
    const conversationHistory = body.history || [];

    // Construct the path to the python script
    // IMPORTANT: This assumes openai_client.py is in backend_api, one level above frontend_v4 parent
    // This path needs to be robust or the script needs to be co-located for Vercel deployment
    const scriptPath = path.resolve(process.cwd(), "../../backend_api/openai_client.py");
    const pythonExecutable = "python3.11"; // Ensure this is the correct python version

    // Prepare the data to be passed to the Python script
    const scriptArgs = [
      scriptPath,
      JSON.stringify(userMessage),
      JSON.stringify(conversationHistory)
    ];

    // Create a wrapper script to execute the python client and pass arguments
    const pythonWrapperScript = `
import sys
import json
# Adjust the path to where openai_client.py is actually located relative to this execution
# This assumes the backend_api directory is a sibling of the trade_caddie_project directory if cwd is trade_caddie_project/frontend_v4
# For Vercel, this structure will be different. Consider placing openai_client.py within the Next.js app structure.
sys.path.append(r"${path.resolve(process.cwd(), "../../backend_api")}")
from openai_client import get_chatgpt_response, initialize_openai_client

user_msg_json = sys.argv[1]
history_json = sys.argv[2]

user_msg = json.loads(user_msg_json)
history = json.loads(history_json)

if initialize_openai_client():
    response = get_chatgpt_response(user_msg, conversation_history=history)
    print(response)
else:
    print("Error: Failed to initialize OpenAI client in API route wrapper.")
`;

    return new Promise((resolve, reject) => {
      const child = exec(
        `${pythonExecutable} -c "${pythonWrapperScript.replace(/\n/g, ";")}" '${JSON.stringify(userMessage)}' '${JSON.stringify(conversationHistory)}'`,
        { env: { ...process.env, PYTHONPATH: `${process.env.PYTHONPATH || ""}:${path.resolve(process.cwd(), "../../backend_api")}` } }, // Add backend_api to PYTHONPATH
        (error, stdout, stderr) => {
          if (error) {
            console.error(`Error executing Python script: ${error.message}`);
            console.error(`Stderr: ${stderr}`);
            resolve(NextResponse.json({ error: "Failed to get response from AI", details: stderr }, { status: 500 }));
            return;
          }
          if (stderr) {
            // Non-fatal errors or warnings from Python script
            console.warn(`Python script stderr: ${stderr}`);
          }
          resolve(NextResponse.json({ response: stdout.trim() }));
        }
      );
    });

  } catch (error) {
    console.error("Error in /api/chat POST handler:", error);
    let errorMessage = "Internal Server Error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

