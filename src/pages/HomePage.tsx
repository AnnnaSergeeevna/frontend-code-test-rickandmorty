import { gql, useQuery } from "urql";

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
	const [{ data, fetching, error }] = useQuery({
		query: query,
		variables: { page: 1 },
	})
  return <div>Home</div>;
};

export default HomePage;
