import { Movie } from "@/data/types";

type Props = {
  movie: Movie;
  onClick: (movie: Movie) => void;
};

export default function MovieCard({ movie, onClick }: Props) {
  return (
    <div
      className="bg-zinc-900 rounded-lg overflow-hidden relative cursor-pointer"
      onClick={() => onClick(movie)}
    >
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="w-full"
      />

      <div className={`absolute top-2 left-2 text-xs font-bold px-2 py-1 rounded ${
        movie.vote_average >= 7
          ? "bg-green-400 text-black"
          : movie.vote_average >= 5
          ? "bg-yellow-400 text-black"
          : "bg-red-500 text-white"
      }`}>
        ⭐ {movie.vote_average}
      </div>

      <h2 className="text-sm font-semibold m-2 px-2">
        {movie.title}
      </h2>
    </div>
  );
}