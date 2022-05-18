import { DockerMuiThemeProvider } from "@docker/docker-mui-theme";
import { createDockerDesktopClient } from "@docker/extension-api-client";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import React, { useEffect, useState } from "react";
import "./App.css";
const client = createDockerDesktopClient();

function useDockerDesktopClient() {
  return client;
}

function App() {
  const trimFields = ["â\x9A\x99ï¸\x8F  "];

  const ddClient = useDockerDesktopClient();
  const [backendInfo, setBackendInfo] = useState("");
  const [res, setRes] = useState("");
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let prevBackendInfo = backendInfo;
    if (res === "") {
      prevBackendInfo = "";
    }
    setBackendInfo(prevBackendInfo + res);
  }, [res]);

  const clearEmoji = (str) => {
    return str
      .replace("â\x9A\x99ï¸\x8F  ", "")
      .replace("ð\x9F\x94¥ ", "")
      .replace("ð\x9F\x9B\x91 ", "")
      .replace("â\x9C\x94ï¸\x8F  ", "")
      .replace("â\x9D\x8C ", "")
      .replace("â\x8F±ï¸\x8F  ", "");
  };

  const get = async () => {
    setRes("");
    setRunning(true);

    ddClient.extension.vm.cli.exec(
      "./ddosify",
      ["-t", "app.servdown.com", "-n", "10", "-d", "10"],
      {
        stream: {
          onOutput(data) {
            // console.log(data);
            if (data?.stdout) {
              console.log("0", data);
              let tmp = res + clearEmoji(data.stdout);
              setRes(() => tmp);
            }
            // else {
            //   console.log(data.stderr);
            // }
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

    // const result2 = await ddClient.extension.vm.cli.exec("./ddosify", [
    //   "-t",
    //   "app.servdown.com",
    //   "-n",
    //   "1",
    //   "-d",
    //   "1",
    // ]);
    // console.log(result2);
    // setBackendInfo(result2?.stdout);
  };

  return (
    <DockerMuiThemeProvider>
      <CssBaseline />
      <div className="App">
        <Button variant="contained" onClick={get} disabled={running}>
          Calle Ddosify
        </Button>
        <pre
          style={{
            "text-align": "left",
            backgroundColor: "#323028",
            border: "3px solid #999",
            padding: "20px",
          }}
        >
          {backendInfo}
        </pre>
      </div>
    </DockerMuiThemeProvider>
  );
}

export default App;
