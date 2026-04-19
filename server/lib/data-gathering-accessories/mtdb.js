import fs from 'node:fs'

const API_KEY = "Bearer  eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ODM0ZmVmZGI3ZWI2NTgxODE1Yzc0YTA3Y2UxZGIwMCIsIm5iZiI6MTc3NjM2NzEyMC43MzgsInN1YiI6IjY5ZTEzNjEwZWMxMmNhNTQ5ZTFlMTU4ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.at4T0LAWdf5aeZi8b0Zl-luMepO8pjW7fyXKn5cvzso";


async function fetchMovies(page = 1) {
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


function transform(movie) {
  return `${movie.title}: ${movie.release_date?.slice(0, 4)} | ${movie.adult? "R": "PG-13"} | ${movie.runtime} min |  Rating: ${movie.vote_average} \n Overview: ${movie.overview}. Genres: ${movie.genres.map(g => g.name).join(", ")}.\n\n`
  
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
    let data= await buildDataset(36,45)
    let text = data.join("")
    fs.appendFile('movies2.txt', text, 'utf8', (err) => 
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

