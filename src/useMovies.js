import { useState, useEffect } from "react";
const API = "3eaf94b3";

export function useMovies(query) {
  const [loading, setloading] = useState(false);
  const [movies, setMovies] = useState();
  const [err, seterr] = useState("");

  useEffect(() => {
    // callback?.();
    const controller = new AbortController();
    async function getdata() {
      try {
        seterr("");
        setloading(true);
        let data = await fetch(
          `https://www.omdbapi.com/?apikey=${API}&s=${query}`,
          { signal: controller.signal }
        );
        if (!data.ok)
          throw new Error("Something went wrong with fetching movies");
        let res = await data.json();
        if (res.Response === "False") throw new Error("Movie not found!");
        setMovies(res.Search);
      } catch (e) {
        if (e.name !== "AbortError") {
          seterr("Not Found");
        }
      } finally {
        setloading(false);
      }
    }

    if (!query.length) {
      setMovies([]);
      seterr("");
      return;
    }
    // closeselected();
    getdata();

    return () => {
      controller.abort();
    };
  }, [query]);

  return { loading, movies, err };
}
