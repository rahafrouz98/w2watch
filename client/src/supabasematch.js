import { createClient } from "@supabase/supabase-js";
const SUPABASE_URL_MOVIE ="https://ayvtjlpywjjcwqrlkles.supabase.co"
const SUPABASE_KEY_MOVIE = "sb_publishable_c3u2yf_Dr4aCY6qHCQjV4Q_t77qohoF"

export class SupabaseMatching
{
    constructor()
    {
        this.supabase = createClient( SUPABASE_URL_MOVIE, SUPABASE_KEY_MOVIE)
    }
    async findNearestMatch(embedding) 
    {
        try
        {
            console.log(Array.isArray(embedding))
            console.log(embedding.length)
            const {data, error} = await this.supabase.rpc('match_documents', {
                query_embedding: `[${embedding.join(",")}]`,
                match_threshold: 0.4,
                match_count: 1000
                });
            
            if(error)
            {
                throw error
            }
            return data[0].content;
        }
        catch(err)
        {
            console.log(err)
        }
    }
}