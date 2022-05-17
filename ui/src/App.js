import React from "react";
import Button from "@mui/material/Button";
import CssBaseline from '@mui/material/CssBaseline';
import { DockerMuiThemeProvider } from '@docker/docker-mui-theme';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import "./App.css";
import { useState } from 'react';

const client = createDockerDesktopClient();

function useDockerDesktopClient() {
    return client;
}

function App() {
  const ddClient = useDockerDesktopClient();
  const [backendInfo, setBackendInfo] = React.useState("");
  const get =  () => {
    setBackendInfo("");
    console.log("okok")
    const result =  ddClient.extension.vm.cli.exec("./ddosify", ["-t", "app.servdown.com", "-n", "1", "-d", "1"], {
      stream: {
        onOutput(data) {
          // console.log(data);
          if (data.stdout) {
            console.log("0", data.stdout);
            console.log("1", backendInfo)
            let tmp = backendInfo + data.stdout;
            console.log("2,", tmp)
            setBackendInfo(tmp);
          }
          // else {
          //   console.log(data.stderr);
          // }
        },
        onError(error) {
          console.error(error);
        },
        onClose(exitCode) {
          console.log("onClose with exit code " + exitCode);
        },
        splitOutputLines:true,
      },
    });
    // console.log(result);
    
    // const result2 = await ddClient.extension.vm.cli.exec("./ddosify", ["-t", "app.servdown.com", "-n", "1", "-d", "1"]);
    // console.log(result2);
    // setBackendInfo(result2?.stdout);
  };

  return (
    <DockerMuiThemeProvider>
      <CssBaseline />
      <div className="App">
        <Button variant="contained" onClick={get}>
          Call Ddosify
        </Button>
        <pre style={{"text-align": "left", backgroundColor: "#323028", border: "3px solid #999", padding: "20px"}}>{backendInfo}</pre>
      </div>
    </DockerMuiThemeProvider>
  );
}

export default App;
