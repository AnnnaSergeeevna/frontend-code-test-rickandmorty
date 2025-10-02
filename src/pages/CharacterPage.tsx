import {gql, useQuery} from "urql";

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

const CharacterPage = () => {
	const [{ data, fetching, error }] = useQuery({
		query: query,
		variables: { id: 1 },
	})
  return <div>Character</div>;
};

export default CharacterPage;
