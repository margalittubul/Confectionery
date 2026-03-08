import { IconButton } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function BackButton() {
  const navigate = useNavigate();
  return (
    <IconButton
      onClick={() => navigate(-1)}
      sx={{ position: "absolute", top: 16, right: 16, color: "#f48fb1" }}
    >
      <ArrowForward />
    </IconButton>
  );
}
