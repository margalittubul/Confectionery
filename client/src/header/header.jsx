// import React, { useEffect, useState } from "react";
// import {
//   AppBar,
//   Toolbar,
//   Box,
//   Typography,
//   IconButton,
//   Button,
//   Container,
// } from "@mui/material";
// import { Link } from "react-router-dom";

// import SearchIcon from "@mui/icons-material/Search";
// import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
// import PersonIcon from "@mui/icons-material/Person";

// import logo from "/img/מתוק מהבית .png";

// const pinkLight = "#f8d7db";

// const navItemsRight = [
//   { label: "דף הבית", to: "/Picthur" },
//   { label: "אודותינו", to: "/about" },
//   { label: "צור קשר", to: "/contact" },
//   { label: "קונדיטוריה", to: "/category" },
//   { label: "הזמנות", to: "/order" },
// ];

// const navItemsLeft = [
//   { label: "סל שלי", to: "/buying" },
//   { label: "התחברות", to: "/login" },
//   { label: "כניסה", to: "/" },
//   { label: "פרופיל", to: "/profile" },
//   { label: "חיפוש", to: "/search" },
// ];

// export default function HeaderFlexible() {
//   const [username, setUsername] = useState("אורח");

//   useEffect(() => {
//     // כאן ניתן להכניס את קריאת הפרופיל מהשרת
//     // לדוגמה:
//     // const profile = await getCustomerProfile();
//     // setUsername(profile?.name || "אורח");
//     setUsername("מירי"); // לדוגמה
//   }, []);

//   return (
//     <AppBar
//       position="static"
//       sx={{
//         bgcolor: "transparent",
//         boxShadow: "none",
//         py: 1,
//         px: 2,
//         userSelect: "none",
//       }}
//     >
//       <Container
//         maxWidth="lg"
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           gap: 2,
//         }}
//       >
//         {/* צד ימין */}
//         <Box
//           sx={{
//             display: "flex",
//             gap: 1,
//             flexWrap: "nowrap",
//             alignItems: "center",
//           }}
//         >
//           {navItemsRight.map(({ label, to }) => (
//             <Button
//               key={label}
//               component={Link}
//               to={to}
//               variant="contained"
//               disableElevation
//               sx={{
//                 minWidth: 70,
//                 bgcolor: pinkLight,
//                 color: "#6b2c3b",
//                 fontWeight: "bold",
//                 borderRadius: "50%",
//                 padding: "10px",
//                 textTransform: "none",
//                 boxShadow: "none",
//                 "&:hover": { bgcolor: "#f3c6cc" },
//                 fontSize: "0.8rem",
//               }}
//             >
//               {label}
//             </Button>
//           ))}
//         </Box>

//         {/* לוגו במרכז */}
//         <Box
//           component={Link}
//           to="/Picthur"
//           sx={{
//             display: "flex",
//             justifyContent: "center",
//             flexShrink: 0,
//             mx: 2,
//           }}
//         >
//           <Box
//             component="img"
//             src={logo}
//             alt="לוגו מתוק מהבית"
//             sx={{
//               height: 80,
//               width: 80,
//               borderRadius: "50%",
//               backgroundColor: pinkLight,
//               padding: 1,
//               boxShadow: "0 0 10px rgba(255, 192, 203, 0.6)",
//               objectFit: "contain",
//             }}
//           />
//         </Box>

//         {/* צד שמאל */}
//         <Box
//           sx={{
//             display: "flex",
//             gap: 1,
//             flexWrap: "nowrap",
//             alignItems: "center",
//           }}
//         >
//           {/* כפתור עם שם המשתמש */}
//           <Button
//             component={Link}
//             to={`/profile/${username}`}
//             variant="contained"
//             disableElevation
//             sx={{
//               minWidth: 70,
//               bgcolor: pinkLight,
//               color: "#6b2c3b",
//               fontWeight: "bold",
//               borderRadius: "50%",
//               padding: "10px",
//               textTransform: "none",
//               boxShadow: "none",
//               fontSize: "0.8rem",
//               "&:hover": { bgcolor: "#f3c6cc" },
//             }}
//           >
//             {username}
//           </Button>

//           {navItemsLeft
//             .filter((item) => item.label !== "פרופיל") // את הפרופיל כבר הראינו
//             .map(({ label, to }) => (
//               <Button
//                 key={label}
//                 component={Link}
//                 to={to}
//                 variant="contained"
//                 disableElevation
//                 sx={{
//                   minWidth: 70,
//                   bgcolor: pinkLight,
//                   color: "#6b2c3b",
//                   fontWeight: "bold",
//                   borderRadius: "50%",
//                   padding: "10px",
//                   textTransform: "none",
//                   boxShadow: "none",
//                   fontSize: "0.8rem",
//                   "&:hover": { bgcolor: "#f3c6cc" },
//                 }}
//               >
//                 {label}
//               </Button>
//             ))}
//         </Box>
//       </Container>
//     </AppBar>
//   );
// }


import React from 'react';
import { Box, Container } from '@mui/material';

// import { CakeRain } from './CakeRain';       // תחליף לנתיב האמיתי שלך
// import { Animation } from './Animation';
import { UserButtons } from './UserButtons';
// import { Logo } from './Logo';
// import { NavLinks } from './NavLinks';

import Animation from "../header/Animation";
import Button from "../header/Button";
import Button2 from "../header/Button2";
import Logo from "../header/Logo";
import CakeRain from '../header/ChocolateDrips'
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
