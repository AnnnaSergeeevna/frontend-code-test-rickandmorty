import { gql, useQuery } from "urql";
import { Link, useSearchParams } from "react-router-dom";
import styles from "./HomePage.module.css";
import Header from "../../components/Header/Header";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Characters } from "../../generated/graphql";
import { Loader } from "../../components/Loader/Loader";


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

  const totalPages = data?.characters?.info?.pages || 1;

  const visiblePages = useMemo(() => {
    const pages = [];
    const start = Math.max(page - 2, 1);
    const end = Math.min(page + 2, totalPages);
    for (let i = start; i <= end; i++) { pages.push(i); }
    return pages;
  }, [page, totalPages]);

  const handleStatusChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, status: e.target.value }); setPage(1);
  }, [filters]);

  const handleGenderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, gender: e.target.value }); setPage(1);
  }, [filters]);


  return (
    <div className={styles.container}>
      <Header />
      {fetching && <Loader />}
      {error && <p>Error: {error.message}</p>}

      {!fetching && !error && (
        <>
          <div className={styles.filters}>
            <div data-cy="filter-status">
              <h4 className={styles.statusContainer}>Status</h4>
              {["alive", "dead", "unknown"].map((status) => (
                <label key={status}>
                  <input
                    data-cy={`status-${status}`}
                    className={styles.statusRadioButton}
                    type="radio"
                    name="status"
                    value={status}
                    checked={filters.status === status}
                    onChange={handleStatusChange}
                  />
                  {status}
                </label>
              ))}
            </div>

            <div data-cy="filter-gender">
              <h4 className={styles.genderContainer}>Gender</h4>
              {["female", "male", "genderless", "unknown"].map((gender) => (
                <label key={gender}>
                  <input
                    data-cy={`gender-${gender}`}
                    className={styles.statusRadioButton}
                    type="radio"
                    name="gender"
                    value={gender}
                    checked={filters.gender === gender}
                    onChange={handleGenderChange}
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
                  <Link data-cy="character-card" to={`/character/${character.id}`} key={character.id} className={styles.characterCard}>
                    {character.image && (
                      <img className={styles.characterImage}
                        src={character.image}
                        alt={character.name || "Unknown"}
                      />
                    )}
                    <p className={styles.characterName}>{character.name || "Unknown"}</p>
                  </Link>)
            )
            }
          </div>
          <div className={styles.pagination}>
            <button
              data-cy="prev-page"
              disabled={!data?.characters?.info?.prev}
              onClick={() => setPage((prev) => (prev > 1 ? prev - 1 : prev))}
              className={styles.arrowButton}
            >
              <img className={styles.arrowLeft} src="/arrow-left.svg" alt="Prev" />
            </button>
            {visiblePages.map((p) => (
              <button
                data-cy={`page-${p}`}
                key={p}
                className={`${styles.pageNumber} ${p === page ? styles.activePage : ""}`}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            ))}
            <button
              data-cy="next-page"
              disabled={!data?.characters?.info?.next}
              onClick={() => setPage((prev) => (prev < totalPages ? prev + 1 : prev))}
              className={styles.arrowButton}
            >
              <img className={styles.arrowRight} src="/arrow-left.svg" alt="Next" />
            </button>
          </div>
        </>
      )}
    </div>
  )
};

export default HomePage;
