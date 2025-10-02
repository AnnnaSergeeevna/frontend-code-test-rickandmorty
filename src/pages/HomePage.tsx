import { gql, useQuery } from "urql";
import { Link } from "react-router-dom";
import styles from "./HomePage.module.css";
import Header from "../components/Header/Header";
import { useState } from "react";
import { Characters } from "../generated/graphql";


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


  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <div className={styles.container}>
        <Header />
        <div className={styles.charactersGrid}>
          {data?.characters?.results?.map(
            (character: NonNullable<Characters['results']>[number]) =>
              character && character.id && (
                <Link to={`/character/${character.id}`} key={character.id} className={styles.characterCard}>

                  <div key={character.id} className={styles.characterCard}>
                    {character.image && (
                      <img
                        src={character.image}
                        alt={character.name || "Unknown"}
                        className={styles.characterImage}
                      />
                    )}
                    <p className={styles.characterName}>{character.name || "Unknown"}</p>
                  </div>
                </Link>
              )
          )
          }
        </div>
        <div className={styles.pagination}>
          <button
            disabled={!data?.characters?.info?.prev}
            onClick={() => setPage((prev) => (prev > 1 ? prev - 1 : prev))}
          >
            PREV PAGE
          </button>
          <button
            disabled={!data?.characters?.info?.next}
            onClick={() => setPage((prev) => prev + 1)}
          >
            NEXT PAGE
          </button>
        </div>
      </div>
    </>
  )
};

export default HomePage;
