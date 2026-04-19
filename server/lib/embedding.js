import OpenAi from "openai"

export class Embedding
{
    constructor()
    {
        this.openAi = new OpenAi({apiKey:process.env.AI_KEY})
    }

    async contentEmbedding(body)
    {
        const release = body.content.reduce((accu, current)=>{
                    return accu+=(current.movieType+", ")
                }, "")
        const characteristics =  body.content.reduce((accu, current)=>{
                    return accu+=(current.favorite+", ")
                }, "")
        const seriousness =  body.content.reduce((accu, current)=>{
                    return accu+=(current.seriousness+", ")
                }, "")
        const content = `Release year:${release}|Duration: ${body["hour"]}. characteristics:${characteristics}. seriousness:${seriousness}`;

        const em = await this.openAi.embeddings.create(
        {
            model: "text-embedding-3-small",
            input: content,
            encoding_format: "float",
        })
        return em.data[0].embedding;
    }
}

