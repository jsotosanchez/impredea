import { Button, Spacer, Flex } from '@chakra-ui/react';
import { Dispatch, SetStateAction } from 'react';

interface Props {
  hasResults: boolean;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
}

const PaginationButtons = ({ hasResults, currentPage, setCurrentPage }: Props): JSX.Element => {
  return (
    <Flex mt="10px">
      {currentPage > 0 && (
        <Button size="md" variant="outline" colorScheme="facebook" onClick={() => setCurrentPage((prev) => prev - 1)}>
          Anterior
        </Button>
      )}
      <Spacer />
      {hasResults && (
        <Button variant="solid" colorScheme="facebook" onClick={() => setCurrentPage((prev) => prev + 1)}>
          Siguiente
        </Button>
      )}
    </Flex>
  );
};

export default PaginationButtons;
