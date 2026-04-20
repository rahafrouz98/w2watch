import { createClient } from "@supabase/supabase-js";
const SUPABASE_URL_MOVIE ="https://ayvtjlpywjjcwqrlkles.supabase.co"
const SUPABASE_KEY_MOVIE = "sb_publishable_c3u2yf_Dr4aCY6qHCQjV4Q_t77qohoF"

export class SupabaseMatching
{
    constructor()
    {
        this.supabase = createClient( SUPABASE_URL_MOVIE, SUPABASE_KEY_MOVIE)
    }
    async findNearestMatch(vectorList) 
    {
        const movies=[]
        for( let vector of vectorList)
        {
            try
            {
                const {data, error} = await this.supabase.rpc('match_documents', {
                                            query_embedding: vector,
                                            match_threshold: 0.40,
                                            match_count: 4
                                        });
                if(error)
                {
                    throw error
                }
                movies.push(...data)
            }
            catch(err)
            {
                console.log(err)
            }
        }
        return movies;    
    }
}