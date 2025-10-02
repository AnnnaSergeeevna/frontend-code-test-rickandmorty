import { gql, useQuery } from "urql";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./CharacterPage.module.css";
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal, useState } from "react";
import { CharacterQuery, CharacterQueryVariables } from "../generated/graphql";
import { Loader } from "../components/Loader";
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
  const [index, setIndex] = useState(0);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [{ data, fetching, error }] = useQuery<CharacterQuery, CharacterQueryVariables>({
    query: query,
    variables: { id: id! },
  })

  if (fetching) return <Loader />;
  if (error) return <p>Error: {error.message}</p>;
  if (!data?.character) return <p>Character not found</p>;

  const { character } = data;

  const episodes = character.episode
    .filter((ep): ep is NonNullable<typeof ep> => ep !== null)
    .slice()
    .sort((a, b) => new Date(a.air_date ?? "").getTime() - new Date(b.air_date ?? "").getTime())
    .map((ep) => (
      <div key={ep.id ?? Math.random()} className={styles.episodeCard}>
        <p className={styles.episodeName}>{ep.name}</p>
        <p className={styles.episodeDate}>{formatDate(ep.air_date)}</p>
      </div>
    ));
  const episodesPerPage = 5;

  const visibleEpisodes = episodes.slice(index, index + episodesPerPage)
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
          <h3 className={styles.episodesHeader}>Episodes:</h3>
          <div className={styles.episodes}>
            <div className={styles.episodeCarousel}>

              <div className={styles.episodeTrack}>
                {visibleEpisodes}
              </div>
              <div className={styles.carouselButtonGroup}>
                <button className={styles.carouselButton} disabled={index === 0}
                  onClick={() => setIndex((prev) => Math.max(prev - episodesPerPage, 0))}>
                  <img className={styles.arrowLeft} src="/arrow-left.svg" alt="arrow" />
                </button>
                <button className={styles.carouselButton} disabled={index + episodesPerPage >= episodes.length} onClick={() => setIndex((prev) => Math.min(prev + episodesPerPage, episodes.length - episodesPerPage))}>
                  <img className={styles.arrowRight} src="/arrow-left.svg" alt="arrow" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>


    </>)
};

export default CharacterPage;
