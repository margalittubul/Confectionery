import { Box, Container } from "@mui/material";
import { UserButtons } from "./UserButtons";
import Animation from "../header/Animation";
import Logo from "../header/Logo";
import CakeRain from "../header/ChocolateDrips";
import NavLinks from "../navigate/navigate2";
import Button from "./Button";
import Button2 from "./Button2";

export default function MainComponent() {
  return (
    <Container maxWidth="lg" sx={{ pt: 2 }}>
      <Box sx={{ 
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: { xs: 'center', md: 'space-between' },
        alignItems: 'center',
        gap: 2,
        mb: 2
      }}>
        <Box sx={{ 
          display: { xs: 'none', md: 'block' },
          flex: 1
        }}>
          <Button />
        </Box>
        
        <Box>
          <Logo />
        </Box>
        
        <Box sx={{ 
          display: { xs: 'none', md: 'block' },
          flex: 1
        }}>
          <Button2 />
        </Box>
        
        <Box sx={{ 
          display: { xs: 'block', md: 'none' },
          width: '100%'
        }}>
          <Button />
          <Button2 />
        </Box>
      </Box>
      <NavLinks />
      <Animation />
      <CakeRain />
    </Container>
  );
}
