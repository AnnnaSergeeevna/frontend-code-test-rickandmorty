import { gql, useQuery } from "urql";
import { Link, useSearchParams } from "react-router-dom";
import styles from "./HomePage.module.css";
import Header from "../components/Header/Header";
import { useEffect, useState } from "react";
import { Characters } from "../generated/graphql";
import { Loader } from "../components/Loader";


export const query = gql`
  query Home($page: Int!, $filter: FilterCharacter) {
    characters(page: $page, filter: $filter) {
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<{ status?: string; gender?: string; }>({ status: searchParams.get("status") || undefined, gender: searchParams.get("gender") || undefined, });
  const [page, setPage] = useState(1);
  const [{ data, fetching, error }] = useQuery<{ characters: Characters }>({
    query: query,
    variables: { page, filter: filters },
  });

  useEffect(() => {
    const params: Record<string, string> = { page: String(page) };
    if (filters.status) params.status = filters.status;
    if (filters.gender) params.gender = filters.gender;
    setSearchParams(params);
  }, [filters, page, setSearchParams]);

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
        <div className={styles.filters}>
          <div>
            <h4 className={styles.statusContainer}>Status</h4>
            {["alive", "dead", "unknown"].map((status) => (
              <label key={status}>
                <input className={styles.statusRadioButton}
                  type="radio"
                  name="status"
                  value={status}
                  checked={filters.status === status}
                  onChange={(e) => {
                    setFilters({ ...filters, status: e.target.value });
                    setPage(1);
                  }}
                />
                {status}
              </label>
            ))}
          </div>

          <div>
            <h4 className={styles.genderContainer}>Gender</h4>
            {["female", "male", "genderless", "unknown"].map((gender) => (
              <label key={gender}>
                <input className={styles.statusRadioButton}
                  type="radio"
                  name="gender"
                  value={gender}
                  checked={filters.gender === gender}
                  onChange={(e) => {
                    setFilters({ ...filters, gender: e.target.value });
                    setPage(1);
                  }}
                />
                {gender}
              </label>
            ))}
          </div>
        </div>

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
