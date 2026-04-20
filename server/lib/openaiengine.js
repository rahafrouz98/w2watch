import OpenAI from "openai"
import fs from "fs";

const jsonSchema = JSON.parse(fs.readFileSync("./data/json-schema.json", "utf-8"));

export class OpenAIEngine
{
    constructor()
    {
        this.myOpenAI = new OpenAI({apiKey:process.env.AI_KEY})
        this.instructions= `
                                You are an assistant that recommends movies for multiple users based on the provided information.

                                You will be given:
                                1. users favorites
                                2. type of movie which is new vs classic
                                3.the maximum duration users can spend watching movie

                                Your task:
                                -Based on the comments of users about their favorite create an orderd list of movies that are in the domain of favorite of all users as much as possible.
                                -the list should only contain movies and not series.
                                -consider the specified type of movie 
                                
                                Output format:
                                Return ONLY a valid JSON array. Each item must be:

                                {
                                "title": "Movie Name (year of release)",
                                "overview": "Brief movies overview and explanation of why this movie matches user preferences",
                                "duration": "minutes"
                                }

                                Rules:
                                - Do not include extra text outside JSON
                                - Only use provided data or widely known information
                                -The list should not be longer than 5 movies
                                -do not invent content or information
                                -year of release should be inside parentheses
                             `
    }
    async contentEmbedding(content)
    {
        try{
            const em = await this.myOpenAI.embeddings.create(
            {
                model: "text-embedding-3-small",
                input: content,
                encoding_format: "float",
            })
            return em.data
        }
        catch(err)
        {
            console.log("Error in openAI embedding API:" + err)
            throw err
        }

    }
    async llmAdvise(body)
    {
        try
        {
                const response = await this.myOpenAI.responses.create({
                model:"gpt-5.4-nano",
                instructions:this.instructions,
                input:JSON.stringify(body),
                text:{
                    format:{
                        type:"json_schema",
                        name:"movie_advice",
                        strict:true,
                        schema:jsonSchema
                    }
                },
                temperature:0.7,
                top_p:0.9    
            })
            return response.output_text
        }
        catch(err)
        {
            console.log("Error in openAI LLM API:" + err)
            throw err
        }
    }
}

