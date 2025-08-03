import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";
import { getAllCustomers } from "../API/CustomerController";

export default function AllUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllCustomers();
        setUsers(data.customers || []);
      } catch (err) {
        console.error("שגיאה בשליפת המשתמשים:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Box sx={{ maxWidth: "90%", mx: "auto", mt: 4 }} dir="rtl">
      <Typography variant="h4" gutterBottom align="center" > 
        כל המשתמשים במערכת
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 3, borderRadius: 2, boxShadow: 3 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
                  <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>שם</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>תפקיד</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>מייל</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>כתובת</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>סיסמה</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id} hover>
                    <TableCell sx={{ textAlign: 'right' }}>{user.name || user.username}</TableCell>
                    <TableCell sx={{ textAlign: 'right' }}>{user.role}</TableCell>
                    <TableCell sx={{ textAlign: 'right' }}>{user.email}</TableCell>
                    <TableCell sx={{ textAlign: 'right' }}>{user.address}</TableCell>
                    <TableCell sx={{ textAlign: 'right' }}>{user.password}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

      )}
    </Box>
  );
}
