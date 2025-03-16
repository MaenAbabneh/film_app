import Search from "./components/Search.tsx";
import Spanner from "./components/Spanner.tsx";
import MovieCard from "./components/MovieCard.tsx";
import { useState, useEffect } from "react";
import { useDebounce} from "react-use";
import {updateSearchCount,getTrendingMovies} from './appwrite.ts';
import  Movie  from './types.ts';

const API_URL = "https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [searchTerm, setsearchTerm] = useState("");
  const [errormass, seterrormass] = useState<string>("");
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false);
  const [debonce , setdebonce] = useState('');
  const [trending, settrending] = useState<Movie[]>([]);
  useDebounce(()=>setdebonce(searchTerm),1000 , [searchTerm] )
  
  const feachMovies = async (quary = '') => {
    setLoading(true);
    seterrormass("");
    try {
      const endpoint = quary ? 
      `${API_URL}/search/movie?query=${encodeURIComponent(quary)}`:
      `${API_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) {
        throw new Error("Request failed");
      }

      const data = await response.json();
      if (data.response == "false"){
        seterrormass(data.Error ||`There Are Problem`);
        setMovies([]);  
      }
      setMovies(data.results||[]);

      if (quary &&data.results.length > 0){
        await updateSearchCount(quary , data.results[0]);

      }

    } catch (error) {
      console.error(`${error}`);
      seterrormass(`There Are Problem`);

    } finally {
      setLoading(false);
    }
  };
  const feachTrending = async () => {
    try { 
      const movies: Movie[] = await getTrendingMovies();
      settrending(movies);
    } catch(error) {
      console.error(`${error}`);
    }
  };
  
  useEffect(() => {
    feachMovies(debonce);
  }, [debonce]);

  useEffect(() => {
    feachTrending();
  }, []);

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="/hero.png" alt="herobanner" />
          <h1>
            Find <span className="text-gradient">Movies</span>You'll Enjoy
            Without The Hassle
          </h1>
          <Search searchTerm={searchTerm} setsearchTerm={setsearchTerm} />
        </header>
        {trending.length > 0 && (
  <section className="trending">
    <h2>Trending Movies</h2>

    <ul>
      {trending.map((movie, index) => (
        <li key={movie.$id}>
          <p>{index + 1}</p>
          <img src={movie.poster_url} alt={movie.title} />
        </li>
      ))}
    </ul>
  </section>
)}
        <section className="all-movies">
          <h2>All Movies</h2>
          {loading ?(  
            <Spanner />):
            errormass ? (<p className=" text-red-500 ">{errormass}</p>):
            (
              <ul>
                {movies.map((movie) => (
                  <MovieCard key = {movie.id} movie={movie}/>
                ))}
              </ul>
            )}
               
        </section>
      </div>
    </main>
  );
};
export default App;
