export function renderForm2(person)
{   
    document.getElementById("person-number").textContent=person
    document.getElementById("form2").classList.remove("hidden")
    document.getElementById("form2").reset()
    document.getElementById("new").classList.remove("selected")
    document.getElementById("classic").classList.remove("selected")
    updateType()
}

export function updateType()
{
    let mType=""
    const isClassic = document.getElementById("classic").classList.contains("selected")
    const isNew = document.getElementById("new").classList.contains("selected")
    if((isClassic&&isNew)||(!isClassic&&!isNew))
    {
        mType=" new or classic"
    }
    else if(isClassic)
    {
        mType="classic"
    }
    else
    {
        mType="new"
    }
    return mType;
}

export function renderMovie(index, list)
{    
    document.getElementById("na-poster").classList.add("hidden")
    document.getElementById("next-movie").classList.remove("hidden")
    document.getElementById("movie-title").textContent=list[index[0]].title
    let image = document.getElementById("poster");
    
    const imageQuery = list[index[0]].title.replace(/\s*\(\d{4}\)\s*/g, "").trim();

    fetch("/image", {method: "POST",   headers: {"Content-Type": "text/plain"},body:imageQuery})
    .then(res=> {
        return res.text()}).then((imageUrl)=>{
        flipPoster(imageUrl)
    }).catch(err=>console.log(err))
   
    document.getElementById("overview").textContent=list[index[0]].overview;
    document.getElementById("duration").textContent=`Duration: ${list[index[0]].duration}`;
    index[0]++;
}

export function flipPoster(imageUrl)
{
    let image = document.getElementById("poster")
    image.src=imageUrl;
    if(imageUrl !== "")
    {
        image.classList.remove("hidden")
    }
    else
    {
        image.classList.add("hidden")
        document.getElementById("na-poster").classList.remove("hidden")
    }
}
