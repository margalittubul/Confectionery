import Header from "../header/header";
import Navigate2 from "../navigate/navigate2";

import "../App.css";

import { Outlet } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";

export default function Root() {
  return (
    <>
      <ScrollToTop />
      <header>
        <Header />
      </header>
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
