import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
  Box,
  Link,
} from "@mui/material";

const AnalyticsTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/analytics")
      .then((res) => setData(res.data))
      .catch((err) => console.error("Error fetching analytics:", err));
  }, []);

  return (
    <Box mt={4} display="flex" justifyContent="center">
      <Paper sx={{ width: "90%", padding: 3 }}>
        <Typography variant="h6" gutterBottom>
          URL Analytics
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Short URL</TableCell>
              <TableCell>Long URL</TableCell>
              <TableCell>Click Count</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.shortUrl}>
                <TableCell>
                  <Link href={row.shortUrl} target="_blank" rel="noopener">
                    {row.shortUrl}
                  </Link>
                </TableCell>
                <TableCell
                  sx={{
                    maxWidth: 300,
                    whiteSpace: "normal",
                    wordBreak: "break-all",
                  }}
                >
                  <Link href={row.longUrl} target="_blank" rel="noopener">
                    {row.longUrl}
                  </Link>
                </TableCell>
                <TableCell>{row.hitCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default AnalyticsTable;
