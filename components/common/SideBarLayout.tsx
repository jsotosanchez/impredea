import { Flex, Stack } from '@chakra-ui/react';
interface Props {
  sideBarChildren: JSX.Element;
  contentChildren: JSX.Element;
}
const SideBarLayout = ({ sideBarChildren, contentChildren }: Props): JSX.Element => (
  <Flex w="100%" h="100vh" pt="4rem">
    <Stack w="25%" bg="brandGray.100" v="100vh" p="2rem 3rem">
      {sideBarChildren}
    </Stack>
    <Stack w="75%" bg="white" h="100%" overflow="scroll">
      {contentChildren}
    </Stack>
  </Flex>
);

export default SideBarLayout;
