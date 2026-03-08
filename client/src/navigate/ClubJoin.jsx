import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Alert,
} from "@mui/material";
import { joinClub } from "../API/CustomerController";
import "./ClubJoin.css";

export default function ClubJoin() {
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!user.token) {
      setError("עליך להתחבר כדי להצטרף למועדון");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    if (!day || !month || !year) {
      setError("יש למלא את תאריך הלידה המלא");
      return;
    }

    if (!agreed) {
      setError("יש לאשר הצטרפות למועדון");
      return;
    }

    const monthIndex =
      [
        "ינואר",
        "פברואר",
        "מרץ",
        "אפריל",
        "מאי",
        "יוני",
        "יולי",
        "אוגוסט",
        "ספטמבר",
        "אוקטובר",
        "נובמבר",
        "דצמבר",
      ].indexOf(month) + 1;

    const birthDate = new Date(year, monthIndex - 1, day);

    const result = await joinClub({ birth_date: birthDate });
    if (result && result._id) {
      setSuccess("הצטרפת בהצלחה למועדון!");
      setTimeout(() => navigate("/"), 1500);
    } else if (result && result.message === "כבר רשום למועדון") {
      setError("כבר רשום למועדון");
    } else {
      setError("אירעה שגיאה בהצטרפות למועדון");
    }
  };

  return (
    <div className="club-container">
      <div className="club-form">
        <Typography variant="h6">בואו להיות חברים שלנו!</Typography>
        <Typography variant="body1">הירשמו ותיהנו ממגוון הטבות!</Typography>
        <Alert severity="info" sx={{ mb: 2 }}>
          🎉 חברי מועדון מקבלים 10% הנחה בקנייה הראשונה!
        </Alert>
        <form>
          <Typography variant="body2" align="right">
            תאריך יום הולדת:
          </Typography>
          <div className="birthday-select">
            <TextField
              select
              label="יום"
              size="small"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              sx={{ width: 120 }}
            >
              {[...Array(31)].map((_, index) => (
                <MenuItem key={index} value={index + 1}>
                  {index + 1}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="חודש"
              size="small"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              sx={{ width: 150 }}
            >
              {[
                "ינואר",
                "פברואר",
                "מרץ",
                "אפריל",
                "מאי",
                "יוני",
                "יולי",
                "אוגוסט",
                "ספטמבר",
                "אוקטובר",
                "נובמבר",
                "דצמבר",
              ].map((monthName, idx) => (
                <MenuItem key={idx} value={monthName}>
                  {monthName}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="שנה"
              size="small"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              sx={{ width: 150 }}
            >
              {Array.from({ length: 22 }, (_, i) => 2005 + i).map((y) => (
                <MenuItem key={y} value={y}>
                  {y}
                </MenuItem>
              ))}
            </TextField>
          </div>

          <FormControlLabel
            control={
              <Checkbox
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
            }
            label="אני מאשר/ת הצטרפות למועדון"
            sx={{ alignSelf: "start" }}
          />

          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}

          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              backgroundColor: "#f8bbd0",
              "&:hover": { backgroundColor: "#f48fb1" },
            }}
          >
            הצטרפו עכשיו
          </Button>
        </form>
      </div>
    </div>
  );
}
