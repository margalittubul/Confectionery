import Animation from "./Animation";
import Button from "./Button";
import Button2 from "./Button2";
import Logo from "./Logo";
import ChocolateDrips from "./ChocolateDrips";

export default function Header() {
  return (
    <div className="header">
      <ChocolateDrips />
      <Animation />
      <div className="header-layout">
        <div className="desktop-buttons left">
          <Button2 />
        </div>
        <Logo />
        <div className="desktop-buttons right">
          <Button />
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
            <Button />
            <Button2 />
          </div>
        </div>
      </div>
    </div>
  );
}
