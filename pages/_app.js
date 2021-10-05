import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { ApolloProvider } from '@apollo/client';
import client from '@/graphql/apollo-client';
import { UserProvider } from '@auth0/nextjs-auth0';
import { SessionProvider } from '@/context/sessionContext';

const colors = {
  brandBlue: '#3D5A80',
  brandLightBlue: '#98C1D9',
  brandGray: {
    100: '#f5f5f5',
    300: '#c4c4c4',
  },
};

const theme = extendTheme({ colors });

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <SessionProvider>
        <ApolloProvider client={client}>
          <ChakraProvider theme={theme}>
            <Component {...pageProps} />
          </ChakraProvider>
        </ApolloProvider>
      </SessionProvider>
    </UserProvider>
  );
}

export default MyApp;
