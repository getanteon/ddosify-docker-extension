import { DockerMuiThemeProvider } from "@docker/docker-mui-theme";
import { createDockerDesktopClient } from "@docker/extension-api-client";
import { Grid, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import React, { useEffect, useState } from "react";
import "./App.css";
const client = createDockerDesktopClient();

function useDockerDesktopClient() {
  return client;
}

function App() {
  const ddClient = useDockerDesktopClient();
  const [backendInfo, setBackendInfo] = useState("");
  const [res, setRes] = useState("");
  const [running, setRunning] = useState(false);

  const [options, setOptions] = useState({
    target: "",
    protocol: "http",
    method: "GET",
    duration: 10,
    request_count: 100,
  });

  useEffect(() => {
    if (res !== "") {
      let prevBackendInfo = backendInfo;
      if (res.includes("Initializing")) {
        // New test, clear output
        prevBackendInfo = "";
      }
      setBackendInfo(prevBackendInfo + res);
    }
  }, [res]);

  useEffect(() => {
    if (running) {
      ddClient.extension.vm.cli.exec(
        "./ddosify",
        [
          "-t",
          options.target,
          "-n",
          options.request_count,
          "-d",
          options.duration,
        ],
        {
          stream: {
            onOutput(data) {
              if (data?.stdout) {
                let tmp = res + clearEmoji(data.stdout);
                setRes(() => tmp);
              } else {
                console.log(data.stderr);
              }
            },
            onError(error) {
              setRunning(false);
              console.error(error);
            },
            onClose(exitCode) {
              setRunning(false);
              console.log("onClose with exit code " + exitCode);
            },
          },
        }
      );
    } else {
      setRes("");
    }
  }, [running]);

  const clearEmoji = (str) => {
    return str
      .replace("â\x9A\x99ï¸\x8F  ", "⚙️ ")
      .replace("ð\x9F\x94¥ ", "🔥 ")
      .replace("ð\x9F\x9B\x91 ", "")
      .replace("â\x9C\x94ï¸\x8F  ", "✔️ ")
      .replace("â\x9D\x8C ", "❌ ")
      .replace("â\x8F±ï¸\x8F  ", "⏱️ ")
      .replace("CTRL+C to gracefully stop.", "");
  };

  return (
    <DockerMuiThemeProvider>
      <CssBaseline />
      <div className="App">
        <Button
          variant="contained"
          onClick={() => setRunning(true)}
          disabled={running}
        >
          Run Ddosify
        </Button>

        <Grid
          container
          owSpacing={1}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          style={{ marginTop: "1rem" }}
        >
          <Grid item>
            <TextField
              required
              variant="filled"
              label="URL"
              value={options?.target}
              onChange={(e) =>
                setOptions((prevState) => ({
                  ...prevState,
                  target: e.target.value,
                }))
              }
            />
          </Grid>
          <Grid item>
            <TextField
              required
              variant="filled"
              label="Request Count"
              type="number"
              value={options?.request_count}
              onChange={(e) =>
                setOptions((prevState) => ({
                  ...prevState,
                  request_count: e.target.value,
                }))
              }
            />
          </Grid>
          <Grid item>
            <TextField
              required
              variant="filled"
              label="Duration (s)"
              type="number"
              value={options?.duration}
              onChange={(e) =>
                setOptions((prevState) => ({
                  ...prevState,
                  duration: e.target.value,
                }))
              }
            />
          </Grid>
        </Grid>
        <Grid container style={{ marginTop: "3rem" }}>
          <pre
            style={{
              "text-align": "left",
              backgroundColor: "#323028",
              border: "3px solid #999",
              padding: "20px",
              width: "100%",
            }}
          >
            {backendInfo}
          </pre>
        </Grid>
      </div>
    </DockerMuiThemeProvider>
  );
}

export default App;
