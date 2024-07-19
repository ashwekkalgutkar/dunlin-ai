"use client";

import { useState } from "react";
import {
  Container,
  Typography,
  Button,
  CircularProgress,
  Box,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider,
  CssBaseline,
  AppBar,
  Toolbar,
  Drawer,
  IconButton,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import MenuIcon from "@mui/icons-material/Menu";

const drawerWidth = 240;

export default function Home() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const text = await file.text();

    const response = await fetch("http://localhost:5000/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    const result = await response.json();
    setResult(result);

    const newHistory = [...history, { fileName: file.name, result }];
    setHistory(newHistory);
    setSelectedHistory(newHistory.length - 1);

    setLoading(false);
  };

  const handleHistoryClick = (index) => {
    setSelectedHistory(index);
    setResult(history[index].result);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {history.map((item, index) => (
          <div key={index}>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleHistoryClick(index)}>
                <ListItemText primary={item.fileName} />
              </ListItemButton>
            </ListItem>
            {index < history.length - 1 && <Divider />}
          </div>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ width: { sm: `calc(100% - ${drawerWidth}px)` }, ml: { sm: `${drawerWidth}px` } }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            AI-Powered Content Summarization
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        <Container maxWidth="md">
          <Card sx={{ p: 4, boxShadow: 3, borderRadius: 2 }}>
            <Typography variant="h4" align="center" gutterBottom>
              Upload and Analyze Content
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                mt: 4,
                mb: 4,
                width: "300px",
                mx: "auto",
              }}
            >
              <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
              >
                Upload file
                <input type="file" hidden onChange={handleFileChange} />
              </Button>
              {file && (
                <Typography variant="body1" sx={{ mt: 2 }}>
                  {file.name}
                </Typography>
              )}
            </Box>
            <Grid container justifyContent="center" sx={{ mt: 2 }}>
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={loading || !file}
                  onClick={handleSubmit}
                  endIcon={loading ? <CircularProgress size={24} /> : null}
                >
                  {loading ? "Processing..." : "Analyze"}
                </Button>
              </Grid>
            </Grid>
            {result && (
              <Card sx={{ mt: 4, p: 2, boxShadow: 2 }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Summary
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {result.summary}
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    Insights
                  </Typography>
                  <Typography variant="body2">
                    {result.insights.join(", ")}
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Card>
        </Container>
      </Box>
    </Box>
  );
}
