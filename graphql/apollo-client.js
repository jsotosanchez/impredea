import { ApolloClient, HttpLink, InMemoryCache, split } from '@apollo/client';
// import { getMainDefinition } from '@apollo/client/utilities';
// import { WebSocketLink } from 'apollo-link-ws';

const httpLink = new HttpLink({
  uri: 'http://impredea.hasura.app/v1/graphql', // use https for secure endpoint
});

// const wsLink = new WebSocketLink({
//   uri: 'ws://impredea.hasura.app/v1/graphql', // use wss for a secure endpoint
//   options: {
//     reconnect: true,
//   },
// });

// // using the ability to split links, you can send data to each link
// // depending on what kind of operation is being sent
// const link = split(
//   // split based on operation type
//   ({ query }) => {
//     const { kind, operation } = getMainDefinition(query);
//     return kind === 'OperationDefinition' && operation === 'subscription';
//   },
//   wsLink,
//   httpLink
// );

const client = new ApolloClient({
  // link,
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
