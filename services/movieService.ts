export type Movie = {
  Title: string;
  Poster: string;
  Year: string;
  imdbID: string;
};

const OMDB_API_KEY = "49584fd";

export const searchMovies = async (title: string, year?: string) => {
  let apiUrl = `https://www.omdbapi.com/?s=${encodeURIComponent(
    title
  )}&apikey=${OMDB_API_KEY}&type=movie`;

  if (year) {
    apiUrl += `&y=${year}`;
  }

  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};
