import {SupabaseMatching} from "./supabasematch.js"
const body=
{
    number:1,
    hour:"",
    content:[]
}
let person = 1;
let mType= "";

const supabaseMatching = new SupabaseMatching();

document.addEventListener("submit", async(e)=>{
    e.preventDefault();
    /*form 1  */
    if (e.target.id==="form1")
    {
        const formData = new FormData(e.target)
        body["number"] = Number(formData.get("number"))
        body["hour"]=formData.get("hour")
        e.target.classList.add("hidden")
        renderForm2()

    }
    /*form 2  */
    else if(e.target.id==="form2")
    {
        const formData = new FormData(e.target)
        const content= {"favorite":formData.get("favorite"), "movieType":mType, "seriousness":formData.get("seriousness")}
        body.content.push(content)
        let type= ""
        if (person <body.number-1)
        {
            person++
            renderForm2()
        }
        else if(person ===body.number-1)
        {
            document.getElementById("get-movies").classList.remove("hidden")
            document.getElementById("next-person").classList.add("hidden")
            person++
            renderForm2()
        }
        else if(person === body.number)
        {
            document.getElementById("form2").classList.add("hidden")
            document.getElementById("movies-section").classList.remove("hidden")

            const res = await fetch("http://localhost:3000/start", {
                method:"POST",
                headers: 
                {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(body)
            })
            const vector = await res.json()

            const foundMovies = await supabaseMatching.findNearestMatch(vector)
             console.log(foundMovies)
        }
    }

})
document.getElementById("new").addEventListener("click", typeHandler)
document.getElementById("classic").addEventListener("click", typeHandler)

function renderForm2()
{   
    document.getElementById("person-number").textContent=person
    document.getElementById("form2").classList.remove("hidden")
    document.getElementById("form2").reset()
    document.getElementById("new").classList.remove("selected")
    document.getElementById("classic").classList.remove("selected")
    updateType()
}

function typeHandler(e)
{
    e.target.classList.toggle("selected")
    updateType()
}
function updateType()
{
    const isClassic = document.getElementById("classic").classList.contains("selected")
    const isNew = document.getElementById("new").classList.contains("selected")
    if((isClassic&&isNew)||(!isClassic&&!isNew))
    {
        mType=""
    }
    else if(isClassic)
    {
        mType="classic"
    }
    else
    {
        mType="new"
    }
}



