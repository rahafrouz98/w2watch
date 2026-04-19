import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import OpenAI from "openai";
import fs from "fs"

const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 500, chunkOverlap: 0, separators:[`\n\n`] })
const openai = new OpenAI({apiKey:process.env.AI_KEY});


const data = fs.readFileSync('../../data/comment.txt', 'utf8');
const texts = await splitter.createDocuments([data])
console.log(texts)
let table=[]
for(let text of texts)
{
    const embedding = await openai.embeddings.create(
        {
            model: "text-embedding-3-small",
            input: text.pageContent,
            encoding_format: "float",
        });
    table.push({content: text.pageContent, embedding:embedding["data"]["0"]["embedding"]})
}
const json = JSON.stringify(table, null, 2);
fs.writeFileSync("../../data/table-comment.json", json, "utf-8");




