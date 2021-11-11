
import "./Header.css";
import { Grid, Box, Heading, Button } from "@chakra-ui/react"


interface HeaderProps {
  clickOnDistance: () => void
  clickOnCPUProcess: () => void
}
const Header = (props: HeaderProps) => {

  return (
    <Grid templateColumns="repeat(3, 1fr)" gap={6} bg="blue.500">
      <Box w="100%" h="20" >
        <Grid templateColumns="repeat(3, 1fr)" gap={6} bg="blue.500">
          <Box w="100%" h="20" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Button variant="ghost"  color="white" onClick={() => props.clickOnDistance()}>
              Distancia
            </Button>
          </Box>
          <Box w="100%" h="20" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Button variant="ghost"  color="white" onClick={() => props.clickOnCPUProcess()}>
              Tiempo de proceso en computadores
            </Button>
          </Box>

          <Box w="100%"></Box>

        </Grid>
      </Box>
      <Box w="100%" h="20" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Heading color="white">
          Peru
        </Heading>
      </Box>
      <Box w="100%" h="20" ></Box>
    </Grid>

  );
};


export default Header;
