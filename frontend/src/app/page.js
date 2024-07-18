"use client";

import { useState } from 'react';
import {
  Container,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Box,
  Card,
  CardContent,
  IconButton,
  InputAdornment
} from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';

const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
  borderRadius: theme.shape.borderRadius,
}));

const StyledCard = styled(Card)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  boxShadow: theme.shadows[2],
}));

export default function Home() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const text = await file.text();

    const response = await fetch('http://localhost:5000/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    const result = await response.json();
    setResult(result);
    setLoading(false);
  };

  return (
    <StyledContainer maxWidth="sm">
      <Typography variant="h4" gutterBottom align="center">
        Upload and Analyze Content
      </Typography>
      <form onSubmit={handleSubmit} noValidate>
        <TextField
          type="file"
          fullWidth
          onChange={handleFileChange}
          InputLabelProps={{ shrink: true }}
          variant="outlined"
          margin="normal"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton>
                  <AttachFileIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Box textAlign="center" marginTop="1em">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading || !file}
            endIcon={loading ? <CircularProgress size={24} /> : <SearchIcon />}
          >
            {loading ? 'Processing...' : 'Analyze'}
          </Button>
        </Box>
      </form>
      {result && (
        <StyledCard>
          <CardContent>
            <Typography variant="h6">Summary</Typography>
            <Typography variant="body2" paragraph>
              {result.summary}
            </Typography>
            <Typography variant="h6">Insights</Typography>
            <Typography variant="body2">
              {result.insights.join(', ')}
            </Typography>
          </CardContent>
        </StyledCard>
      )}
    </StyledContainer>
  );
}
