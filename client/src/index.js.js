import {SupabaseMatching} from "./supabasematch.js"
import {renderForm2,updateType, renderMovie, flipPoster } from "./utils.js"
const body=
{
    number:1,
    hour:"",
    content:[]
}
let person = 1;
let release= "";
let recommendedMovies=[];
let nextMovie = [0];

const supabaseMatching = new SupabaseMatching();

document.addEventListener("submit", async(e)=>{
    e.preventDefault();
    /*form 1  */
    if (e.target.id==="form1")
    {
        const formData = new FormData(e.target)
        body["number"] = Number(formData.get("number"))
        body["hour"]= formData.get("hour")=== "" ? "4 hours" : formData.get("hour")
        e.target.classList.add("hidden")
        renderForm2(person)

    }
    /*form 2  */
    else if(e.target.id==="form2")
    {
        const formData = new FormData(e.target)
        const content= `A ${release} movie, similar to ${formData.get("favorite")} which is ${formData.get("seriousness")}`
        body.content.push(content)
        let type= ""
        if (person <body.number-1)
        {
            person++
            renderForm2(person)
        }
        else if(person ===body.number-1)
        {
            document.getElementById("get-movies").classList.remove("hidden")
            document.getElementById("next-person").classList.add("hidden")
            person++
            renderForm2(person)
        }
        else if(person === body.number)
        {
            document.getElementById("form2").classList.add("hidden")
            document.getElementById("movies-section").classList.remove("hidden")

            const vectorRes = await fetch("/vector", {
                method:"POST",
                headers: 
                {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(body.content)
            })
            const vectorData = await vectorRes.json()
            const vectorList=vectorData.map(data=>data.embedding)
            const movies = await supabaseMatching.findNearestMatch(vectorList)
            const LLMRes = await fetch("/llm",{
                method:"POST",
                headers:
                {
                    'content-type':"application/json",
                    "Accept":"application/json"
                },
                body: JSON.stringify({duration:body.hour, favorites:movies, type:release})
            })
            let response = await LLMRes.json();   
            recommendedMovies= response.movies
            renderMovie(nextMovie, recommendedMovies)

        }
    }

})
document.getElementById("new").addEventListener("click", typeHandler)
document.getElementById("classic").addEventListener("click", typeHandler)

export function typeHandler(e)
{
    e.target.classList.toggle("selected")
    release= updateType()
}

document.getElementById("next-movie").addEventListener("click",(e)=>{
    flipPoster("")
    renderMovie(nextMovie, recommendedMovies)
    if(nextMovie[0]===recommendedMovies.length)
    {
        e.target.classList.add("hidden")
        document.getElementById("restart").classList.remove("hidden")
    }
    
})

document.getElementById("restart").addEventListener("click",(e)=>{
    location.reload()
    
})




