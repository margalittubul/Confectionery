import { useState } from 'react';
import { TextField, Button, Typography, Checkbox, FormControlLabel, MenuItem } from '@mui/material';
import './ClubJoin.css';

export default function ClubJoin() {
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  return (
    <div className="club-container">
      <div className="club-benefits">
        <Typography variant="h4" gutterBottom>הצטרפות למועדון</Typography>
        <Typography variant="subtitle1">
          עדיין לא חברים ב-<span className="highlight">My SweetClub</span>? ההרשמה ללא עלות ותיהנו מ:
        </Typography>
        <ul>
          <li>כוס קפה מתנה בהצטרפות</li>
          <li>עוגה / קפה / אייסקפה עשירי במתנה</li>
          <li>מבצעי סוף שבוע</li>
          <li>הטבות יומולדת (מותנות ב-3 חודשי חברות)</li>
          <li>עדכונים חמים על מוצרים חדשים ופינוקים שווים</li>
          <li>הטבות משתנות לחברים בלבד</li>
        </ul>
      </div>

      <div className="club-form">
        <Typography variant="h6">בואו להיות חברים שלנו!</Typography>
        <Typography variant="body1">הירשמו ותיהנו ממגוון הטבות!</Typography>
        <form>
          <TextField label="שם פרטי" fullWidth required />
          <TextField label="שם משפחה" fullWidth required />
          <TextField label="נייד" fullWidth required />
          <TextField label="מייל" type="email" fullWidth required />
          
          <Typography variant="body2" align="right">תאריך יום הולדת:</Typography>
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
                <MenuItem key={index} value={index + 1}>{index + 1}</MenuItem>
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
              {["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"].map((monthName, idx) => (
                <MenuItem key={idx} value={monthName}>{monthName}</MenuItem>
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
              {Array.from({ length: 21 }, (_, i) => 2005 + i).map((y) => (
                <MenuItem key={y} value={y}>{y}</MenuItem>
              ))}
            </TextField>
          </div>

          <FormControlLabel
            control={<Checkbox />}
            label="אני מאשר/ת הצטרפות למועדון"
            sx={{ alignSelf: 'start' }}
          />

          <Button variant="contained" sx={{ backgroundColor: '#f8bbd0', '&:hover': { backgroundColor: '#f48fb1' } }}>
            הצטרפו עכשיו
          </Button>
        </form>
      </div>
    </div>
  );
}
