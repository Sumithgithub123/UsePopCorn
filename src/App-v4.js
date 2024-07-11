import { useEffect, useRef, useState } from "react";
import Starrating from "./Starrating";
import { useMovies } from "./useMovies";
import { useLocalStorageState } from "./useLocalStorageState";
import { useKey } from "./useKey";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const API = "3eaf94b3";

export default function App() {
  // const [watched, setWatched] = useState([]);
  // const [watched, setWatched] = useState(() => {
  //   const value = localStorage.getItem("watched");
  //   return JSON.parse(value);
  // });
  const [watched, setWatched] = useLocalStorageState([], "watched");
  const [query, setQuery] = useState("");
  const [selectedId, setselectedId] = useState(null);
  const avgImdbRating = average(
    watched.map((movie) => Number(movie.imdbRating))
  );
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(
    watched.map((movie) => Number(movie.runtime.split(" ").at(0)))
  );
  const { loading, movies, err } = useMovies(query);

  function selected(id) {
    setselectedId(id === selectedId ? null : id);
  }

  function closeselected() {
    setselectedId(null);
  }

  function handleaddwatched(movie) {
    setWatched((watched) => [...watched, movie]);

    // localStorage.setItem("watched", JSON.stringify([...watched, movie]));
  }

  function handleremove(id) {
    let newwatch = watched.filter((obj) => {
      return id !== obj.imdbID;
    });
    setWatched(newwatch);
  }

  // useEffect(() => {
  //   localStorage.setItem("watched", JSON.stringify(watched));
  // }, [watched]);

  return (
    <>
      <Navbar>
        <Search query={query} setQuery={setQuery} />
        <Numresults movies={movies} />
      </Navbar>
      <Main>
        <Box>
          {loading && <Loading />}
          {!loading && !err && (
            <MovieList
              selected={selected}
              setselectedId={setselectedId}
              movies={movies}
            />
          )}
          {err && <Error err={err} />}
        </Box>
        <Box>
          {selectedId ? (
            <SelectedMovie
              watched={watched}
              closeselected={closeselected}
              selectedId={selectedId}
              onaddwatched={handleaddwatched}
            />
          ) : (
            <>
              <WatchedSummary
                watched={watched}
                avgImdbRating={avgImdbRating}
                avgUserRating={avgUserRating}
                avgRuntime={avgRuntime}
              />
              <WatchedMovieList remove={handleremove} watched={watched} />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function SelectedMovie({ watched, onaddwatched, closeselected, selectedId }) {
  const [movie, setmovie] = useState({});
  const [loading, setloading] = useState(false);
  const [userRating, setuserRating] = useState("");
  const countRef = useRef(0);
  const buttonstatus = watched.map((obj) => obj.imdbID).includes(selectedId);
  const userRate = watched.find((obj) => obj.imdbID === selectedId)?.userRating;

  useKey("Escape", closeselected);

  useEffect(() => {
    if (userRating) countRef.current++;
  }, [userRating]);

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  function handleadd() {
    const movie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      runtime,
      imdbRating,
      userRating,
      genre,
      released,
      director,
      plot,
      actors,
      countratingdecisions: countRef.current,
    };
    onaddwatched(movie);
    closeselected();
  }

  useEffect(() => {
    async function getmoviedetails() {
      setloading(true);
      let data = await fetch(
        `http://www.omdbapi.com/?apikey=${API}&i=${selectedId}`
      );
      let res = await data.json();
      setmovie(res);
      setloading(false);
    }
    getmoviedetails();
  }, [selectedId]);

  useEffect(() => {
    if (title) {
      document.title = `Movie | ${title}`;
    }

    return () => {
      document.title = "usePopcorn";
    };
  }, [title]);

  return (
    <div className="details">
      {loading ? (
        <Loading />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={closeselected}>
              &larr;
            </button>
            <img
              src={poster === "N/A" ? "errorimage.jpg" : poster}
              alt={`Poster of ${movie}`}
            />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!buttonstatus ? (
                <>
                  <Starrating
                    maxrating={10}
                    size={24}
                    setstar={setuserRating}
                  />
                  {userRating && (
                    <button className="btn-add" onClick={handleadd}>
                      Add
                    </button>
                  )}
                </>
              ) : (
                <p>You rated the movie with {userRate}</p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Staring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}

function Navbar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

function Numresults({ movies }) {
  const num = movies?.length;
  return (
    <p className="num-results">
      Found <strong>{num}</strong> results
    </p>
  );
}

function Loading() {
  return (
    <div>
      <h1 className="loader">Loading...</h1>
    </div>
  );
}

function Error({ err }) {
  return (
    <div>
      <p style={{ color: "red" }} className="loader">
        <span>⚠️</span>
        {err}
      </p>
    </div>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search({ query, setQuery }) {
  // useEffect(()=>{
  //  async function getdata(){
  //    let data = await fetch(`http://www.omdbapi.com/?apikey=${API}&s=${query}`)
  //    let res = await data.json()
  //      setMovies(res.Search)
  //   }
  //   getdata()
  // },[query,setMovies])

  const inputelement = useRef(null);

  // useEffect(() => {
  //   const element = document.querySelector(".search");
  //   element.focus();
  // }, []);

  useEffect(() => {
    inputelement.current.focus();
  }, []);

  function keys() {
    if (document.activeElement === inputelement.current) return;
    inputelement.current.focus();
    setQuery("");
  }

  // useEffect(() => {
  //   document.addEventListener("keydown", (e) => {
  //     if (document.activeElement === inputelement.current) {
  //       return;
  //     }
  //     if (e.code === "Enter") {
  //       inputelement.current.focus();
  //       setQuery("");
  //     }
  //   });
  // }, [setQuery]);

  useKey("Enter", keys);

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputelement}
    />
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

// function Watchedbox({ children }) {
//   const [isOpen2, setIsOpen2] = useState(true);

//   return (
//     <div className="box">
//       <button
//         className="btn-toggle"
//         onClick={() => setIsOpen2((open) => !open)}
//       >
//         {isOpen2 ? "–" : "+"}
//       </button>
//       {isOpen2 && children}
//     </div>
//   );
// }

function MovieList({ selected, setselectedId, movies }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie
          setselectedId={setselectedId}
          selected={selected}
          key={movie.imdbID}
          movie={movie}
        />
      ))}
    </ul>
  );
}

function Movie({ selected, setselectedId, movie }) {
  return (
    <li
      onClick={() => {
        selected(movie.imdbID);
      }}
    >
      <img
        src={movie.Poster !== "N/A" ? movie.Poster : "errorimage.jpg"}
        alt={`${movie.Title} poster`}
      />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function WatchedMovieList({ remove, watched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WachedMovie
          removefromwatched={remove}
          key={movie.imdbID}
          movie={movie}
        />
      ))}
    </ul>
  );
}

function WachedMovie({ removefromwatched, movie }) {
  return (
    <li>
      <img
        src={movie.poster === "N/A" ? "errorimage.jpg" : movie.poster}
        alt={`${movie.title} poster`}
      />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime}</span>
        </p>
        <button
          className="btn-delete"
          onClick={() => {
            removefromwatched(movie.imdbID);
          }}
        >
          X
        </button>
      </div>
    </li>
  );
}

function WatchedSummary({ avgImdbRating, avgRuntime, avgUserRating, watched }) {
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}
