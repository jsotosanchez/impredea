import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://impredea.hasura.app/v1/graphql',
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // merge fetchMore results with cached results
          user: {
            keyArgs: false,
            merge(existing = [], incoming) {
              return [...existing, ...incoming];
            },
          },
          product: {
            keyArgs: false,
            merge(existing = [], incoming) {
              return [...existing, ...incoming];
            },
          },
        },
      },
    },
  }),
  headers: {
    'x-hasura-admin-secret': 'CeM1lN3gedaHt8ybnh53H5mPYngsY6mMbOhDITzlb0LcShiWLUK1JInBs3zRwB7i',
  },
});

export default client;
