import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://impredea.hasura.app/v1/graphql',
  cache: new InMemoryCache(),
  headers: {
    'x-hasura-admin-secret': 'CeM1lN3gedaHt8ybnh53H5mPYngsY6mMbOhDITzlb0LcShiWLUK1JInBs3zRwB7i',
  },
});

export default client;
