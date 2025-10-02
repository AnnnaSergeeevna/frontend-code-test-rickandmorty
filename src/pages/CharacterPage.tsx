import { gql, useQuery } from "urql";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./CharacterPage.module.css";
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";
import { CharacterQuery, CharacterQueryVariables } from "../generated/graphql";
const query = gql`
  query Character ($id: ID!) {
    character(id: $id) {
      image
      name
      status
      species
      gender
      origin {
        id
        name
      }
      episode {
        id
        name
        air_date
        episode
      }
    }
  }
`;

function formatDate(dateString?: string | null): string {
  if (!dateString) return "Unknown";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric"
  });
}

const CharacterPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [{ data, fetching, error }] = useQuery<CharacterQuery, CharacterQueryVariables>({
    query: query,
    variables: { id: id! },
  })

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data?.character) return <p>Character not found</p>;

  const { character } = data;

  return (
    <>
      <div className={styles.container}>
        <div className={styles.characterOverview}>
          <div className={styles.blockHeader}>
            <button className={styles.prevButton} onClick={() => navigate(-1)}>
              <img className={styles.arrow} src="/arrow-left.svg" alt="arrow" /></button>
            <h2 className={styles.header}>{character.name}</h2>
          </div>
          {character.image && <img src={character.image} alt={character.name ?? "Unknown"} />}
          <p className={styles.characterPropS}>Status: {character.status}</p>
          <p className={styles.characterProp}>Species: {character.species}</p>
          <p className={styles.characterProp}>Gender: {character.gender}</p>
          <div className={styles.episodes}>
            <h3 className={styles.episodesHeader}>Episodes:</h3>
            <div className={styles.episodeList}>
              {character.episode
                .filter((ep): ep is NonNullable<typeof ep> => ep !== null)
                .slice()
                .sort((a, b) => new Date(a.air_date ?? "").getTime() - new Date(b.air_date ?? "").getTime())
                .map((ep) => (
                  <div key={ep.id ?? Math.random()} className={styles.episodeCard}>
                    <p className={styles.episodeName}>{ep.name}</p>
                    <p className={styles.episodeDate}>{formatDate(ep.air_date)}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>


    </>)
};

export default CharacterPage;
