export class TMDBEngine
{
  constructor()
  {
    this.options = {
                      method: 'GET',
                      headers: 
                      {
                        accept: 'application/json',
                        Authorization: `Bearer ${process.env.TMDB_API_KEY}`
                      }
                  }
  }

  async getImage(myQuery)
  { console.log(myQuery)
    try
    {
      const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(myQuery)}`;
      const movieSearchRes = await fetch(url, this.options);
      const idData = await movieSearchRes.json();
      const movie_id = idData.results?.[0]?.id;
      let posterPath=undefined
      if(movie_id)
      {
        const imageRes = await fetch(`https://api.themoviedb.org/3/movie/${movie_id}/images`,this.options);
        const imageData = await imageRes.json();
        posterPath = imageData.posters[0]?.file_path;
        posterPath !== undefined ? (posterPath=`https://image.tmdb.org/t/p/w500${posterPath}`) : posterPath=""
      }
      return posterPath;
    }
    catch(err)
    {
        console.log("error from TMDB API:")
        console.log(err)
    }
  }
}