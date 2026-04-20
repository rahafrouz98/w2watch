import fs from 'node:fs'

const API_KEY = `Bearer ${process.env.TMDB_API_KEY}`


async function fetchMovies(page = 1) {
    try{
         const url = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}`;
        const options = 
        {
            method: 'GET',
            headers:
            {
                accept: 'application/json',
                Authorization: API_KEY
            }
        };

    return fetch(url, options).then(res => res.json()).catch(err => {console.error(err);});

    }
    catch (err)
    {
        console.log("tmdb api list failed")
        console.err()
    }


}

async function fetchManyPages(frompage,topage) {
  let allMovies = [];
  for (let i = frompage; i <= topage; i++) {
    const data = await fetchMovies(i);
    await new Promise(r => setTimeout(r, 250));
    allMovies.push(...data.results);
  }
  return allMovies;
}

async function fetchMovieDetails(id) 
{
    try
    {
        const url = `https://api.themoviedb.org/3/movie/${id}?language=en-US`;
        const options = 
        {
            method: 'GET',
            headers: 
            {
                accept: 'application/json',
                Authorization: API_KEY 
            }
        };

        return fetch(url, options).then(res => res.json()).catch(err => console.error(err));
    }
    catch(err)
    {
        console.log("tmdb api list failed")
        console.err()
    }

}


function transform(movie) {
  return `${movie.title}(${movie.release_date?.slice(0, 4)}),${movie.adult? "R": "PG-13"}. Overview:${movie.overview}.Genres: ${movie.genres.map(g => g.name).join(", ")}.\n\n`
}

async function buildDataset(frompage, topage) {
  const list = await fetchManyPages(frompage, topage); // start small

  let detailed =[]
  for(let movie of list)
  {
    detailed.push(await fetchMovieDetails(movie.id))
    await new Promise(r => setTimeout(r, 250));
  }

  return detailed.map(transform);
}

async function main()
{
    let data= await buildDataset(11,20)
    let text = data.join("")
    fs.appendFile('../../data/movies.txt', text, 'utf8', (err) => 
    {
        if (err) 
        {
            console.error("Error writing file:", err);
            return;
        }
        console.log("File written successfully");
    });
}
main()

