type Props = {
  movie: any;
  onClose: () => void;
  onSearch: (title: string, text: string) => void;
};

export default function MovieModal({ movie, onClose, onSearch }: Props) {
  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-zinc-900 text-white rounded-lg p-6 w-11/12 max-w-4xl relative">
            <button
              className="absolute top-2 right-2 text-white font-bold text-xl cursor-pointer"
              onClick={onClose}
            >
              ✕
            </button>

            <div className="flex flex-col md:flex-row gap-4">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-full md:w-1/3 rounded"
              />

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{movie.title}</h2>
                  <p className="mb-1">Год: {movie.release_date?.slice(0, 4)}</p>
                  <p className="mb-1">Длительность: {movie.runtime} мин</p>
                  <p className="mb-1">Рейтинг: ⭐ {movie.vote_average}</p>
                  <p className="mt-2">{movie.overview}</p>
                </div>

                <div className="mt-4 flex gap-4">
                  <button className="flex-1 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded cursor-pointer"
                  onClick={() => onSearch(movie.title, "смотреть")}>
                    Искать
                  </button>
                  <button className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded cursor-pointer"
                  onClick={() => onSearch(movie.title, "трейлер")}>
                    Трейлер
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
  );
}