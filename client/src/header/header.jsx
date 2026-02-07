import { Box, Container } from "@mui/material";
import { UserButtons } from "./UserButtons";
import Animation from "../header/Animation";
import Logo from "../header/Logo";
import CakeRain from "../header/ChocolateDrips";
import NavLinks from "../navigate/navigate2";

export default function MainComponent() {
  return (
    <Container maxWidth="lg" sx={{ pt: 2 }}>
      <Logo />
      <Box sx={{ my: 2 }}>
        <UserButtons />
      </Box>
      <NavLinks />
      <Animation />
      <CakeRain />
    </Container>
  );
}
