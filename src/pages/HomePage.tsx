import { gql, useQuery } from "urql";
import { Link } from "react-router-dom";
import styles from "./HomePage.module.css";
import Header from "../components/Header/Header";
import { useState } from "react";
import { Characters } from "../generated/graphql";
import { Loader } from "../components/Loader";


export const query = gql`
  query Home($page: Int!) {
    characters(page: $page) {
      results {
          id
          name
          image
      }
      info {
          count
          next
          pages
          prev
      }
    }
  }
`

const HomePage = () => {
  const [page, setPage] = useState(1);
  const [{ data, fetching, error }] = useQuery<{ characters: Characters }>({
    query: query,
    variables: { page },
  });


  if (fetching) return <Loader />;
  if (error) return <p>Error: {error.message}</p>;

  const totalPages = data?.characters?.info?.pages || 1;

  const getVisiblePages = () => {
    const pages = [];
    const start = Math.max(page - 2, 1);
    const end = Math.min(page + 2, totalPages);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };


  return (
    <>
      <div className={styles.container}>
        <Header />
        <div className={styles.charactersGrid}>
          {data?.characters?.results?.map(
            (character: NonNullable<Characters['results']>[number]) =>
              character && character.id && (
                <Link to={`/character/${character.id}`} key={character.id} className={styles.characterCard}>
                  {character.image && (
                    <img
                      src={character.image}
                      alt={character.name || "Unknown"}
                      className={styles.characterImage}
                    />
                  )}
                  <p className={styles.characterName}>{character.name || "Unknown"}</p>
                </Link>)
          )
          }
        </div>
        <div className={styles.pagination}>
          <button
            disabled={!data?.characters?.info?.prev}
            onClick={() => setPage((prev) => (prev > 1 ? prev - 1 : prev))}
            className={styles.arrowButton}
          >
            <img className={styles.arrowLeft} src="/arrow-left.svg" alt="Prev" />
          </button>
          {getVisiblePages().map((p) => (
            <button
              key={p}
              className={`${styles.pageNumber} ${p === page ? styles.activePage : ""}`}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          ))}
          <button
            disabled={!data?.characters?.info?.next}
            onClick={() => setPage((prev) => (prev < totalPages ? prev + 1 : prev))}
            className={styles.arrowButton}
          >
            <img className={styles.arrowRight} src="/arrow-left.svg" alt="Next" />
          </button>
        </div>
      </div>
    </>
  )
};

export default HomePage;
