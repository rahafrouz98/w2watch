import express from "express"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url";
import { Embedding } from "./lib/embedding.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const embedding = new Embedding();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "../client")));

app.get( "/", (req,res)=>{
    res.sendFile(path.join(__dirname, "../client/index.html"));
})
app.post( "/start", async(req,res)=>{
    const vector=await embedding.contentEmbedding(req.body)
    res.json(vector);
})

app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
})