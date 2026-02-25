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
        justifyContent: 'center',
        alignItems: 'center',
        gap: { xs: 2, md: 0 },
        minHeight: { xs: 'auto', md: '200px' },
        mb: 2,
        position: { xs: 'static', md: 'relative' }
      }}>
        <Box sx={{ 
          position: { xs: 'static', md: 'absolute' },
          left: { md: 0 },
          display: 'flex',
          gap: { xs: 1, sm: 1.5 },
          flexWrap: 'wrap',
          justifyContent: 'center',
          maxWidth: { xs: '100%', md: '40%' },
          order: { xs: 2, md: 1 }
        }}>
          <Button />
        </Box>
        <Box sx={{ order: { xs: 1, md: 2 } }}>
          <Logo />
        </Box>
        <Box sx={{ 
          position: { xs: 'static', md: 'absolute' },
          right: { md: 0 },
          display: 'flex',
          gap: { xs: 1, sm: 1.5 },
          flexWrap: 'wrap',
          justifyContent: 'center',
          maxWidth: { xs: '100%', md: '40%' },
          order: { xs: 3, md: 3 }
        }}>
          <Button2 />
        </Box>
      </Box>
      <NavLinks />
      <Animation />
      <CakeRain />
    </Container>
  );
}
