import Animation from "../header/Animation";
import Button from "../header/Button";
import Button2 from "../header/Button2";
import Logo from "../header/Logo";
import ChocolateDrips from "../header/ChocolateDrips";
import Navigate2 from "../navigate/navigate2";

import "../App.css";

import { Outlet } from "react-router-dom";
import ScrollToTop from "../home/ScrollToTop";

export default function Root() {
  return (
    <>
      <ScrollToTop />
      <header>
        <div className="header">
          <ChocolateDrips></ChocolateDrips>
          <Animation></Animation>
          <div className="header-layout">
            <div className="desktop-buttons left">
              <Button2></Button2>
            </div>
            <Logo></Logo>
            <div className="desktop-buttons right">
              <Button></Button>
            </div>
            <div className="mobile-buttons">
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  justifyContent: "center",
                }}
              >
                <Button></Button>
                <Button2></Button2>
              </div>
            </div>
          </div>
        </div>
      </header>
      <br />
      <br />
      <main>
        <div className="main">
          <Outlet />
        </div>
      </main>
      <br />
      <br />
      <footer>
        <div className="footer">
          <Navigate2></Navigate2>
        </div>
      </footer>
    </>
  );
}
