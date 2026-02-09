"use client";

import MovieCard from "@/components/MovieCard";
import MovieModal from "@/components/MovieModal";
import { useState, useEffect } from "react";
import { Movie } from "@/data/types";
import { genres } from "@/data/genres";

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("home");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [movieDetails, setMovieDetails] = useState<any>(null);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);

useEffect(() => {
  async function fetchMovies() {
    let url = "";

    if (activeTab === "home") {
      if (!selectedGenre) {
        setMovies([]);
        return;
      }

      url = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&with_genres=${selectedGenre}&page=${currentPage}&language=en-US`;
    } else {
      url = `https://api.themoviedb.org/3/movie/${activeTab}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&page=${currentPage}&language=en-US`;
    }

    const res = await fetch(url);
    const data = await res.json();
    setMovies(data.results);
  }

  fetchMovies();
}, [activeTab, selectedGenre, currentPage]);



  function GenreButton({ label, onClick }: { label: string; onClick?: () => void }) {
      return (
        <button
          onClick={onClick}
          className="
            bg-zinc-800 rounded-xl p-6
            text-lg font-medium
            hover:bg-zinc-700
            transition
            text-left
          "
        >
          {label}
        </button>
      );}

  // Open modal and fetch movie details
  async function handleClick(movie: Movie) {
    setSelectedMovie(movie);

    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
    );
    const data = await res.json();
    setMovieDetails(data);
  }

  // Close modal
  function closeModal() {
    setSelectedMovie(null);
    setMovieDetails(null);
  }

function searchMovie(movieTitle: string, searchText: string) {
  const query = encodeURIComponent(`${movieTitle + " " + searchText}`);
  const url = `https://www.google.com/search?q=${query}`;
  window.open(url, "_blank");
}

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl text-center font-bold mb-6">What to watch today?</h1>

      {/* Tabs */}
      <div className="flex justify-center items-center gap-4 mb-4">
        <button
          className={activeTab === "home" ? "font-bold" : "" }
          onClick={() => { setActiveTab("home"); setCurrentPage(1); }} 
        >
          Home
        </button>
        <button 
          className={activeTab === "popular" ? "font-bold" : ""}
          onClick={() => { setActiveTab("popular"); setCurrentPage(1); }}
        >
          Popular
        </button>
        <button
          className={activeTab === "top_rated" ? "font-bold" : ""}
          onClick={() => { setActiveTab("top_rated"); setCurrentPage(1); }}
        >
          Top Rated
        </button>
      </div>

      {/* Movies grid */}
      {activeTab !== "home" && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onClick={handleClick}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {activeTab !== "home" && (
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-4 py-2 bg-zinc-800 rounded hover:bg-zinc-700"
            disabled={currentPage === 1}
          >
            Previous
          </button>

          <span className="px-4 py-2">{currentPage}</span>

          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-4 py-2 bg-zinc-800 rounded hover:bg-zinc-700"
          >
            Next
          </button>
        </div>
      )}

      {/* Modal window */}
      {selectedMovie && movieDetails && (
        <MovieModal
          movie={movieDetails}
          onClose={closeModal}
          onSearch={searchMovie}
        />
      )}

      {/* Genre buttons */}

      {activeTab === "home" && (
      <div className="space-y-10">
        
        <section>
          <h2 className="text-xl font-semibold mb-4">Top 20</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <GenreButton label="Action" onClick={() => { setSelectedGenre(28); setActiveTab("home"); }} />
            <GenreButton label="Comedy" onClick={() => { setSelectedGenre(35); setActiveTab("home"); }} /> 
            <GenreButton label="Crime" onClick={() => { setSelectedGenre(53); setActiveTab("home"); }} />
          </div>
        </section>

        <section>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <GenreButton label="Horror" onClick={() => { setSelectedGenre(27); setActiveTab("home"); }} />
            <GenreButton label="Science Fiction" onClick={() => { setSelectedGenre(878); setActiveTab("home"); }} />
            <GenreButton label="Adventure" onClick={() => { setSelectedGenre(12); setActiveTab("home"); }} />
            <GenreButton label="Fantasy" onClick={() => { setSelectedGenre(14); setActiveTab("home"); }} />
          </div>
        </section>

        <section>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <GenreButton label="Romance" onClick={() => { setSelectedGenre(10749); setActiveTab("home"); }} />
            <GenreButton label="Thriller" onClick={() => { setSelectedGenre(9648); setActiveTab("home"); }} />
            <GenreButton label="Drama" onClick={() => { setSelectedGenre(18); setActiveTab("home"); }} />
          </div>
        </section>

        {selectedGenre && (
          <div className="mt-4 text-center text-3xl"> Top 20 { genres.find(g => g.id === selectedGenre)?.name} films</div>
        )}

        {movies.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onClick={handleClick}
              />
            ))}
          </div>

        )}

      </div>

      )}

    </main>
  );
}