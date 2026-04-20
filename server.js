import express from "express"
import cors from "cors"
import path from "path"
import { OpenAIEngine } from "./lib/openaiengine.js";
import {TMDBEngine} from "./lib/tmdb-image.js"

const openAiEngine = new OpenAIEngine();
const tmdbEngine = new TMDBEngine();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.text());
app.use(cors());
// Serve static frontend
const frontendPath = path.join(process.cwd(), "client/dist");
app.use(express.static(frontendPath));
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.post( "/vector", async(req,res)=>{
    try{
            const vector=await openAiEngine.contentEmbedding(req.body)
            res.json(vector);
    }
    catch (err)
    {
        console.log("error from OpenAi Engine, embedding:")
        console.log(err)
    }

})
app.post( "/llm", async(req,res)=>{
    try
    {
        const llmComment = await openAiEngine.llmAdvise(req.body)
        res.send(llmComment)
    }
    catch(err)
    {
        console.log("error from OpenAi Engine, LLM:")
        console.log(err)
    }
})
app.post( "/image", async(req,res)=>{
    try
    {
        const imageUrl = await tmdbEngine.getImage(req.body)
        res.send(imageUrl)
    }
    catch
    {
        console.log("error from TMDB engine, :")
        console.log(err)
    }
})

app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
})