import Head from 'next/head';
import Image from 'next/image'
import Link from 'next/link'
import {
  Flex, Container, Text, Box, Stack, Button, Heading, Tag, Select, Spacer
} from '@chakra-ui/react';
import { Layout, Authorization } from '@/components/common';
import { MKT_TAGS } from '@/utils/constants';
import { useState } from 'react';


export default function Marketplace({ }) {

  const [filter, setFitler] = useState(MKT_TAGS.ALL)

  return (
    <Authorization>
      <Layout>
        <Head>
          <title>Impredea</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Flex bg="white" h="100vh" mt="10%">
          <Stack ml="10%" w="40%">
            <Heading as="h2" size={"xl"} color="brandBlue">
              Consigue todos los insumos <br />para tu emprendimiento
            </Heading>
            <Heading as="h2" size={"md"} color="brandBlue" fontWeight={"light"} pt="15px">
              Que estas buscando?
            </Heading>
            <Select onChange={(e) => setFitler(e.target.value)} value={filter} w="40%">
              <option value={MKT_TAGS.ALL}>Mostrar todo</option>
              <option value={MKT_TAGS.PRINTERS}>Equipos de impresion</option>
              <option value={MKT_TAGS.SUPPLIES}>Filamentos</option>
              <option value={MKT_TAGS.MODELS}>Modelos</option>
            </Select>
            <Heading as="h3" size={"md"} color="brandBlue" fontWeight={"normal"} pt="70px" pb="10px"> Quieres publicitar tu empresa con nosotros?</Heading>
            <Link href="/contact" passHref>
              <Button colorScheme={"facebook"} w="160px" fontSize={"xl"}> Contáctanos</Button>
            </Link>
          </Stack>
          <Stack w="40%" ml="15px">
            <a target="_blank" href="https://store.che3d.com.ar/" rel="noopener noreferrer">
              <Container border="1px" borderRadius={"10px"} borderColor={"gray.300"} mb="30px" ml="0">
                <Flex pt="5px">
                  <Heading as="h2" size={"md"} color="brandBlue">
                    CHE 3D
                  </Heading>
                  <Spacer />
                  <Tag mx={"5px"}>Equipos</Tag>
                  <Tag mx={"5px"}>Insumos</Tag>
                  <Tag mx={"5px"}>Modelos</Tag>
                </Flex>
                <Flex mt="15px" pb="15px">
                  <Box mr="15px" >
                    <Image src="/che3d.png" width={"400"} height={"250"}></Image>
                  </Box>
                  <Text fontSize={"md"} >
                    Tenemos todos los insumos que necesites para hacer funcionar tu negocio. Desde filamento, hasta equipos de impresion. No dudes en contactarnos para empezar tu negocio!
                  </Text>
                </Flex>
              </Container>
            </a>
            {
              (filter == MKT_TAGS.ALL || filter == MKT_TAGS.PRINTERS) &&
              <a target="_blank" href="https://www.3dimpresoras.com.ar/impresoras-3d.html" rel="noopener noreferrer">
                <Container border="1px" borderRadius={"10px"} borderColor={"gray.300"} mb="30px" ml="0">
                  <Flex pt="5px">
                    <Heading as="h2" size={"md"} color="brandBlue">
                      3D Impresoras
                    </Heading>
                    <Spacer />
                    <Tag mx={"5px"}>Equipos</Tag>
                  </Flex>
                  <Flex mt="15px" pb="15px">
                    <Box mr="15px" >
                      <Image src="/impresoras3D.png" width={"400"} height={"250"}></Image>
                    </Box>
                    <Text fontSize={"md"} >
                      Tenemos todos los insumos que necesites para hacer funcionar tu negocio. Desde filamento, hasta equipos de impresion. No dudes en contactarnos para empezar tu negocio!
                    </Text>
                  </Flex>
                </Container>
              </a>}
            <Container border="1px" borderRadius={"10px"} borderColor={"gray.300"} mb="30px" ml="0">
              <Flex pt="5px">
                <Heading as="h2" size={"md"} color="brandBlue">
                  Tu empresa!
                </Heading>
              </Flex>
              <Flex mt="15px" pb="15px">
                <Box mr="15px" >
                </Box>
                <Text fontSize={"md"} >
                  Este espacio podria ser tuyo! Contactanos para publicitar tu empresa con nosotros.
                </Text>
              </Flex>
            </Container>
          </Stack>
        </Flex>
      </Layout>
    </Authorization >
  );
}