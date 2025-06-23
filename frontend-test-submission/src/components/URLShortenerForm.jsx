import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Grid,
  Alert,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

export default function URLShortenerForm() {
  const [url, setUrl] = useState("");
  const [validity, setValidity] = useState(30);
  const [alias, setAlias] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/shorturls", {
        url,
        validity,
        shortcode: alias || undefined,
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to shorten URL");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 4 }} elevation={3}>
      <Typography variant="h5" gutterBottom>
        Create a Short URL
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Long URL"
              fullWidth
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              label="Validity (mins)"
              type="number"
              fullWidth
              value={validity}
              onChange={(e) => setValidity(Number(e.target.value))}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              label="Custom Alias"
              fullWidth
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              type="submit"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? "Shortening..." : "Shorten URL"}
            </Button>
          </Grid>
        </Grid>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {result && (
        <Alert severity="success" sx={{ mt: 2 }}>
          <Typography>
            Short URL:{" "}
            <a
              href={result.shortLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              {result.shortLink}
            </a>
          </Typography>
          <Typography>
            Expires at: {new Date(result.expiry).toLocaleString()}
          </Typography>
        </Alert>
      )}
    </Paper>
  );
}
