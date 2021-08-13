import { HStack } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';

export const RenderRating = ({ rating }) => {
  const stars = [];
  for (let i = 0; i < rating; i++) {
    stars.push(i);
  }
  return (
    <HStack color="brandBlue">
      {stars.map((idx) => (
        <StarIcon key={idx} />
      ))}
    </HStack>
  );
};
