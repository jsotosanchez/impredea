import '../styles/globals.css';
import { ChakraProvider, extendTheme, ColorModeProvider } from '@chakra-ui/react';
import { ApolloProvider } from '@apollo/client';
import client from '../graphql/apollo-client';

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
    <ApolloProvider client={client}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </ApolloProvider>
  );
}

export default MyApp;
