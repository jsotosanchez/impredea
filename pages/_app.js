import '../styles/globals.css';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

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
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
