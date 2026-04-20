import { createClient } from '@supabase/supabase-js'
import OpenAI from "openai";
import fs, { readFileSync } from "fs"

// const openai = new OpenAI({
//   apiKey: process.env.AI_KEY
// });

const supabaseClient = createClient(
  process.env.SUPABASE_URL_MOVIE,
  process.env.SUPABASE_KEY_MOVIE
);

async function runSearch() {
  try {

    const embedding = JSON.parse(readFileSync("../../data/embedding.json"))

    console.log(embedding.length)
    console.log("rpc started")
    const { data, error } = await supabaseClient.from('documents')
  .select('id')
  .limit(5);

    console.log("rpc finished")

    if (error) {
      console.log("Supabase error:", error);
      return;
    }

    console.log(data);

  } catch (err) {
    console.log("Error:", err);
  }
}

import axios from 'axios'

const supabaseRequest = axios.create({
  baseURL: 'https://ayvtjlpywjjcwqrlkles.supabase.co/rest/v1',
  headers: {
    'apikey': process.env.SUPABASE_KEY_MOVIE,
    'Authorization': `Bearer ${process.env.SUPABASE_KEY_MOVIE}`,
    'Content-Type': 'application/json'
  }
});

async function callHamedRpc() {
  console.log("Starting Axios RPC...");
  try {
    const response = await axios.post(
      'https://ayvtjlpywjjcwqrlkles.supabase.co/rest/v1/rpc/hamed',
      { targetid: 10 }, // Your function parameters
      {
        headers: {
          'apikey': process.env.SUPABASE_KEY_MOVIE,
          'Authorization': `Bearer ${process.env.SUPABASE_KEY_MOVIE}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log("Success! Data received:", response.data);
  } catch (err) {
    console.error("Axios Error:", err.message);
  }
}

callHamedRpc();