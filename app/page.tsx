"use client";

import { useState, useEffect } from "react";

type Movie = {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
};

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("home");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [movieDetails, setMovieDetails] = useState<any>(null);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMovies() {
      let url = "";

      if (activeTab === "home") {
        
        setMovies([]);          // очищаем фильмы
        setCurrentPage(1);      // сбрасываем страницу
        return;

      } else if (activeTab === "popular"){
        url = `https://api.themoviedb.org/3/movie/${activeTab}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&page=${currentPage}&language=ru-RU`;
      } else{
        url = `https://api.themoviedb.org/3/movie/${activeTab}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&page=${currentPage}&language=ru-RU`;
      }

      const res = await fetch(url);
      const data = await res.json();
      setMovies(data.results);
    }

    fetchMovies();
  }, [currentPage, activeTab]);

  useEffect(() => {
    console.log("Жанр изменился:", selectedGenre);
  }, [selectedGenre]);

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

  // Функция для открытия модалки и подгрузки деталей
  async function handleClick(movie: Movie) {
    setSelectedMovie(movie);

    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=ru-RU`
    );
    const data = await res.json();
    setMovieDetails(data);
  }

  // Закрыть модалку
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
      <h1 className="text-3xl font-bold mb-6">Что посмотреть сегодня?</h1>

      {/* Вкладки */}
      <div className="flex gap-4 mb-4" >
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

      {/* Сетка фильмов */}
      {activeTab !== "home" && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="bg-zinc-900 rounded-lg overflow-hidden relative cursor-pointer"
              onClick={() => handleClick(movie)}
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="rounded mb-2 w-full"
              />

              {/* Рейтинг сверху */}
              <div
                className={`absolute top-2 left-2 text-xs font-bold px-2 py-1 rounded ${
                  movie.vote_average >= 7
                    ? "bg-green-400 text-black"
                    : movie.vote_average >= 5
                    ? "bg-yellow-400 text-black"
                    : "bg-red-500 text-white"
                }`}
              >
                ⭐ {movie.vote_average}
              </div>

              <h2 className="text-sm font-semibold mt-2">{movie.title}</h2>
            </div>
          ))}
        </div>
      )}

      {/* Пагинация */}
      {activeTab !== "home" && (
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-4 py-2 bg-zinc-800 rounded hover:bg-zinc-700"
            disabled={currentPage === 1}
          >
            Назад
          </button>

          <span className="px-4 py-2">{currentPage}</span>

          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-4 py-2 bg-zinc-800 rounded hover:bg-zinc-700"
          >
            Вперёд
          </button>
        </div>
      )}

      {/* Модальное окно */}
      {selectedMovie && movieDetails && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-zinc-900 text-white rounded-lg p-6 w-11/12 max-w-4xl relative">
            <button
              className="absolute top-2 right-2 text-white font-bold text-xl cursor-pointer"
              onClick={closeModal}
            >
              ✕
            </button>

            <div className="flex flex-col md:flex-row gap-4">
              <img
                src={`https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`}
                alt={movieDetails.title}
                className="w-full md:w-1/3 rounded"
              />

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{movieDetails.title}</h2>
                  <p className="mb-1">Год: {movieDetails.release_date?.slice(0, 4)}</p>
                  <p className="mb-1">Длительность: {movieDetails.runtime} мин</p>
                  <p className="mb-1">Рейтинг: ⭐ {movieDetails.vote_average}</p>
                  <p className="mt-2">{movieDetails.overview}</p>
                </div>

                <div className="mt-4 flex gap-4">
                  <button className="flex-1 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded cursor-pointer"
                  onClick={() => searchMovie(movieDetails.title, "смотреть")}>
                    Искать
                  </button>
                  <button className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded cursor-pointer"
                  onClick={() => searchMovie(movieDetails.title, "трейлер")}>
                    Трейлер
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Кнопки жанров */}

      {activeTab === "home" && (
      <div className="space-y-10">
        
        <section>
          <h2 className="text-xl font-semibold mb-4">По настроению</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <GenreButton label="Боевики" onClick={() => setSelectedGenre("Action")} />
            <GenreButton label="Комедия" onClick={() => setSelectedGenre("Comedy")} /> 
            <GenreButton label="Детектив" onClick={() => setSelectedGenre("Detective")} />
          </div>
        </section>

        <section>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <GenreButton label="Ужасы" onClick={() => setSelectedGenre("Horror")} />
            <GenreButton label="Фантастика" onClick={() => setSelectedGenre("Science Fiction")} />
            <GenreButton label="Приключения" onClick={() => setSelectedGenre("Adventure")} />
            <GenreButton label="Фэнтези" onClick={() => setSelectedGenre("Fantasy")} />
          </div>
        </section>

        <section>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <GenreButton label="Спорт" onClick={() => setSelectedGenre("Sports")} />
            <GenreButton label="Триллер" onClick={() => setSelectedGenre("Thriller")} />
            <GenreButton label="Драмы" onClick={() => setSelectedGenre("Drama")} />
          </div>
        </section>

        {selectedGenre && (
          <div>МОДАЛКА {selectedGenre}</div>
        )}
      </div>


      )}


    </main>
  );
}