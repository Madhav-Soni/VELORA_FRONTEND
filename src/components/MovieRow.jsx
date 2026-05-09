import ScrollRow from "./ScrollRow";
import MovieCard from "./MovieCard";

/**
 * A reusable row component that displays a list of movies using ScrollRow and MovieCard.
 * 
 * @param {string} title - The title of the row
 * @param {Array} movies - The list of movies to display
 * @param {Function} onSelect - Callback when a movie is clicked
 * @param {boolean} loading - Loading state
 * @param {boolean} error - Error state
 * @param {string} accent - Accent color (brand, red, gold, etc.)
 */
export default function MovieRow({ 
  title, 
  movies, 
  onSelect, 
  loading, 
  error, 
  accent = "brand" 
}) {
  return (
    <ScrollRow 
      title={title} 
      loading={loading} 
      error={error} 
      accent={accent}
    >
      {movies?.map((movie, index) => (
        <MovieCard 
          key={movie.id || movie._id} 
          movie={movie} 
          index={index} 
          onSelect={onSelect} 
        />
      ))}
    </ScrollRow>
  );
}
