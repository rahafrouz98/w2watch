import { createClient } from '@supabase/supabase-js'
import fs from "node:fs"

const supabaseClient = createClient( process.env.SUPABASE_URL_MOVIE, process.env.SUPABASE_KEY_MOVIE)

const data = fs.readFileSync("../../data/table200.json", "utf-8")
const table = JSON.parse(data)
let step=100;

// for(let i = 0; i < table.length; i+=step)
// {
//     try
//     {
//         let temptable = table.slice(i,i+step)
//         let res =await supabaseClient.from('documents').insert(temptable)
//         let{error} = res
//         console.log(res)
//         if(error){throw new Error("error from supabase network")}
//     }
//     catch(err)
//     {
//         console.log(err)
//     }
// }


for(let i = 0; i < table.length; i += step) {
    try {
        let temptable = table.slice(i, i + step);

        // --- VALIDATION STEP ---
        // Pick the first item of the batch and check the embedding
        const firstItem = temptable[0];
        if (!Array.isArray(firstItem.embedding) || firstItem.embedding.length !== 1536) {
            console.error(`Invalid data at index ${i}. Expected array of 1536, got:`, typeof firstItem.embedding);
            break; // Stop the loop if data is malformed
        }
        // -----------------------

        let { data, error } = await supabaseClient.from('documents').insert(temptable);
        
        if (error) throw error;
        
        console.log(`Successfully uploaded rows ${i} to ${i + temptable.length}`);
    } catch (err) {
        console.error("Upload failed:", err.message);
        break; 
    }
}


