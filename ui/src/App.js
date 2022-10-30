import { DockerMuiThemeProvider } from "@docker/docker-mui-theme";
import { createDockerDesktopClient } from "@docker/extension-api-client";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Link,
  TextField,
  Typography,
  Card,
  CardContent,
  Checkbox,
  Box,
  Stack,
} from "@mui/material";

import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import React, { useEffect, useState } from "react";
import "./App.css";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MenuItem from "@mui/material/MenuItem";
import jsPDF from "jspdf";
import AutoSuggestionField from "./components/AutoSuggestionField";

const protocols = [
  {
    value: "https",
    label: "HTTPS",
  },
  {
    value: "http",
    label: "HTTP",
  },
];

const methods = [
  {
    value: "GET",
    label: "GET",
  },
  {
    value: "POST",
    label: "POST",
  },
  {
    value: "PUT",
    label: "PUT",
  },
  {
    value: "PATCH",
    label: "PATCH",
  },
  {
    value: "DELETE",
    label: "DELETE",
  },
  {
    value: "HEAD",
    label: "HEAD",
  },
  {
    value: "OPTIONS",
    label: "OPTIONS",
  },
];

const requestHeaders = [
  "A-IM",
  "Accept",
  "Accept-Charset",
  "Accept-Encoding",
  "Accept-Language",
  "Accept-Datetime",
  "Access-Control-Request-Method",
  "Access-Control-Request-Headers",
  "Authorization",
  "Cache-Control",
  "Connection",
  "Content-Length",
  "Content-Type",
  "Cookie",
  "Date",
  "Forwarded",
  "From",
  "Host",
  "If-Match",
  "If-Modified-Since",
  "f-None-Match",
  "If-Range",
  "If-Unmodified-Since",
  "Max-Forwards",
  "Origin",
  "Pragma",
  "Proxy-Authorization",
  "Range",
  "Referer",
  "TE",
  "User-Agent",
  "Upgrade",
  "Via",
  "Warning",
  "Dnt",
  "X-Requested-With",
  "X-CSRF-Token",
];

const client = createDockerDesktopClient();

function useDockerDesktopClient() {
  return client;
}

function App() {
  const ddClient = useDockerDesktopClient();
  const [backendInfo, setBackendInfo] = useState("");
  const [res, setRes] = useState("");
  const [running, setRunning] = useState(false);
  const [enableDownload, setDownload] = useState(false);

  const [options, setOptions] = useState({
    target: "",
    protocol: "http",
    method: "GET",
    duration: 10,
    request_count: 100,
    load_type: "linear",
    timeout: 5,
    body: "",
    basic_auth_username: "",
    basic_auth_password: "",
    proxy: "",
  });

  const [headers, setHeaders] = useState([
    {
      key: "User-Agent",
      value: "DdosifyDockerExtension/0.1.2",
      id: Math.random(),
    },
  ]);

  let handleHeaderChange = (index, target, value) => {
    let newHeaders = [...headers];
    newHeaders[index][target] = value ?? "";
    setHeaders(newHeaders);
  };

  let addHeader = () => {
    setHeaders([...headers, { key: "", value: "", id: Math.random() }]);
    // console.log(headers);
  };

  let removeHeader = (id) => {
    setHeaders(headers.filter((header) => header.id !== id));
  };

  const [basicAuthChecked, setbasicAuthChecked] = React.useState(false);

  const handleBasicAuthChange = (event) => {
    setbasicAuthChecked(event.target.checked);
  };

  const [proxyChecked, setProxyChecked] = React.useState(false);

  const handleProxyChange = (event) => {
    setProxyChecked(event.target.checked);
  };

  const configValues = () => {
    let str = `
    Configuration:

    Target URL: ${options.target}
    Load Type: ${options.load_type}
    Duration: ${options.duration}
    Request Count: ${options.request_count}
    Timeout: ${options.timeout}
    Headers: ${options.headers}
    Basic Auth: UserName: ${options.basic_auth_username}
                Password: ${options.basic_auth_password}
    Proxy: ${options.proxy}
    `;
    return str;
  };
  const downloadReport = () => {
    let doc = new jsPDF("l", "mm", [450, 210]);
    let result = backendInfo.substring(backendInfo.indexOf("RESULT") - 1);
    let newStr = configValues() + result;
    doc.text(newStr, 10, 10);
    let dateTimeString = new Date().toLocaleDateString();
    doc.save(`Test Report-${dateTimeString}.pdf`);
  };
  useEffect(() => {
    if (res !== "") {
      let prevBackendInfo = backendInfo;
      if (res.includes("Initializing")) {
        // New test, clear output
        prevBackendInfo = "";
      }
      setBackendInfo(prevBackendInfo + res);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [res]);

  useEffect(() => {
    if (running) {
      if (options.request_count > 5000) {
        ddClient.desktopUI.toast.error(
          "Request count is limited to 5000, for more you can use Ddosify Cloud."
        );
        setRunning(false);
        return;
      }
      if (options.request_count <= 0) {
        ddClient.desktopUI.toast.error("Request count must be positive");
        setRunning(false);
        return;
      }

      if (options.duration > 100) {
        ddClient.desktopUI.toast.error(
          "Duration is limited to 100 seconds, for more you can use Ddosify Cloud."
        );
        setRunning(false);
        return;
      }
      if (options.duration <= 0) {
        ddClient.desktopUI.toast.error("Duration must be positive");
        setRunning(false);
        return;
      }

      if (options.target === "") {
        ddClient.desktopUI.toast.warning("Please enter a target URL");
        setRunning(false);
        return;
      }

      var args = [
        "-t",
        options.protocol + "://" + options.target,
        "-n",
        options.request_count,
        "-d",
        options.duration,
        "-m",
        options.method,
        "-l",
        options.load_type,
        "-T",
        options.timeout,
      ];
      for (let index in headers) {
        var element = headers[index];
        if (element.key === "") {
          ddClient.desktopUI.toast.warning("Header key can not be empty");
          setRunning(false);
          return;
        }
        if (element.value === "") {
          ddClient.desktopUI.toast.warning("Header value can not be empty");
          setRunning(false);
          return;
        }
        args.push("-h", element.key + ":" + element.value);
      }

      if (options.body !== "") {
        args.push("-b", options.body);
      }

      if (
        options.basic_auth_username !== "" &&
        options.basic_auth_password !== "" &&
        basicAuthChecked
      ) {
        args.push(
          "-a",
          options.basic_auth_username + ":" + options.basic_auth_password
        );
      }

      if (options.proxy !== "" && proxyChecked) {
        args.push("-P", options.proxy);
      }

      // console.log(args);

      ddClient.extension.vm.cli.exec("./ddosify", args, {
        stream: {
          onOutput(data) {
            if (data?.stdout) {
              let tmp = res + clearEmoji(data.stdout);
              setRes(() => tmp);
            } else {
              console.log(data.stderr);
              ddClient.desktopUI.toast.error(data.stderr);
            }
          },
          onError(error) {
            setRunning(false);
            console.error(error);
          },
          onClose(exitCode) {
            setRunning(false);
            setDownload(true);
            // console.log("onClose with exit code " + exitCode);
          },
        },
      });
    } else {
      setRes("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const stopDdosify = async () => {
    ddClient.extension.vm.cli.exec("killall", ["-SIGINT", "ddosify"]);
  };

  const clearEmoji = (str) => {
    return str
      .replace("â\x9A\x99ï¸\x8F  ", "⚙️ ")
      .replace("ð\x9F\x94¥ ", "🔥 ")
      .replace("ð\x9F\x9B\x91 ", "")
      .replace("â\x9C\x94ï¸\x8F  ", "✅ ")
      .replace("â\x9D\x8C ", "❌ ")
      .replace("â\x8F±ï¸\x8F  ", "⏱️ ")
      .replace("CTRL+C to gracefully stop.", "");
  };

  const openExternalLinkCloud = () => {
    return ddClient.host.openExternal(
      "https://ddosify.com?utm_source=dockerextension"
    );
  };

  const openExternalLinkGithub = () => {
    return ddClient.host.openExternal(
      "https://github.com/ddosify/ddosify?utm_source=dockerextension"
    );
  };

  const openExternalLinkDocs = () => {
    return ddClient.host.openExternal(
      "https://docs.ddosify.com?utm_source=dockerextension"
    );
  };

  const openExternalLinkDiscord = () => {
    return ddClient.host.openExternal(
      "https://discord.gg/9KdnrSUZQg?utm_source=dockerextension"
    );
  };

  const openExternalLinkDynamicVariables = () => {
    return ddClient.host.openExternal(
      "https://docs.ddosify.com/extra/dynamic-variables-parameterization?utm_source=dockerextension"
    );
  };

  return (
    <DockerMuiThemeProvider>
      <CssBaseline />
      <div className="App">
        <Grid
          container
          columnSpacing={{ xs: 1 }}
          rowSpacing={4}
          style={{ padding: "4rem" }}
        >
          <Grid container item>
            <Grid container item>
              <img
                alt="ddosify logo"
                height="100px"
                src="https://ddosify-assets-analytics.s3.us-east-2.amazonaws.com/ddosify-docker-logo.svg"
                style={{
                  display: "block",
                  marginRight: "auto",
                  marginLeft: "auto",
                }}
              />
            </Grid>
            <Grid container item>
              <Typography
                style={{
                  display: "block",
                  marginRight: "auto",
                  marginLeft: "auto",
                }}
              >
                High-performance, open-source and simple load testing tool. For
                no-code, distributed and geo-targeted load testing you can use{" "}
                {"  "}
                <Link href="#" onClick={openExternalLinkCloud}>
                  Ddosify Cloud.
                </Link>
              </Typography>
            </Grid>
          </Grid>
          <Grid container item>
            <Grid item xs={1.6}>
              <TextField
                style={{ width: "100%", textAlign: "left" }}
                select
                value={options?.method}
                onChange={(e) =>
                  setOptions((prevState) => ({
                    ...prevState,
                    method: e.target.value,
                  }))
                }
                // helperText="Method"
              >
                {methods.map((method) => (
                  <MenuItem key={method.value} value={method.value}>
                    {method.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={0.2}></Grid>
            <Grid item xs={10.2} container>
              <Grid item xs={1.6}>
                <TextField
                  style={{ width: "100%", textAlign: "left" }}
                  select
                  value={options?.protocol}
                  onChange={(e) =>
                    setOptions((prevState) => ({
                      ...prevState,
                      protocol: e.target.value,
                    }))
                  }
                  // helperText="Protocol"
                >
                  {protocols.map((protocol) => (
                    <MenuItem key={protocol.value} value={protocol.value}>
                      {protocol.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={10.4} sx={{ position: "relative" }}>
                <AutoSuggestionField
                  value={options.target ?? ""}
                  onChange={(val) => setOptions({ ...options, target: val })}
                  error={options.target === ""}
                  placeholder="example.com"
                  helperText="Target URL"
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item container columnSpacing={{ xs: 2 }}>
            <Grid item>
              <TextField
                error={
                  options?.request_count === "" || options?.request_count <= 0
                }
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
                error={options?.duration === "" || options?.duration <= 0}
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
            <Grid item>
              <FormControl>
                <FormLabel style={{ textAlign: "left" }} required>
                  Load Type
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={options?.load_type}
                  onChange={(e) =>
                    setOptions((prevState) => ({
                      ...prevState,
                      load_type: e.target.value,
                    }))
                  }
                >
                  <FormControlLabel
                    value="linear"
                    control={<Radio />}
                    label="Linear"
                  />
                  <FormControlLabel
                    value="incremental"
                    control={<Radio />}
                    label="Incremental"
                  />
                  <FormControlLabel
                    value="waved"
                    control={<Radio />}
                    label="Waved"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>

          <Grid item container>
            <Accordion style={{ width: "100%" }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography variant="h6">Advanced</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Card variant="outlined">
                  <CardContent>
                    <Grid item container columnSpacing={{ xs: 2 }}>
                      <Grid item xs={2}>
                        <TextField
                          style={{ width: "100%" }}
                          required
                          variant="filled"
                          label="Timeout"
                          type="number"
                          value={options?.timeout}
                          onChange={(e) =>
                            setOptions((prevState) => ({
                              ...prevState,
                              timeout: e.target.value,
                            }))
                          }
                        />
                      </Grid>
                      <Grid item xs={10}>
                        <AutoSuggestionField
                          variant="filled"
                          label="Body"
                          value={options?.body}
                          onChange={(val) =>
                            setOptions((prevState) => ({
                              ...prevState,
                              body: val,
                            }))
                          }
                          boxStyle={{
                            top: "50%",
                            paddingLeft: "10px",
                          }}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                <Card variant="outlined">
                  <CardContent>
                    <Typography
                      textAlign={"left"}
                      gutterBottom
                      variant="h6"
                      component="div"
                    >
                      Headers
                    </Typography>
                    {headers.map((element, index) => (
                      <Grid
                        item
                        container
                        justifyContent="center"
                        alignItems="center"
                        key={element.id}
                        style={{ marginBottom: "15px" }}
                      >
                        <Grid item xs={5.5}>
                          <Autocomplete
                            freeSolo
                            disablePortal
                            sx={{ width: "98%" }}
                            options={requestHeaders}
                            inputValue={element.key}
                            onInputChange={(event, value) => {
                              handleHeaderChange(index, "key", value);
                            }}
                            renderInput={(params) => (
                              <TextField {...params} placeholder="Key" />
                            )}
                          />
                        </Grid>
                        <Grid item xs={5.5}>
                          <AutoSuggestionField
                            name="value"
                            placeholder="Value"
                            value={element.value ?? ""}
                            onChange={(val) => {
                              handleHeaderChange(index, "value", val);
                            }}
                            boxStyle={{
                              top: "35%",
                            }}
                          />
                        </Grid>
                        <Grid item xs={1}>
                          <IconButton onClick={() => removeHeader(element.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    ))}
                    <Grid item container>
                      <Button
                        style={{ marginTop: "10px" }}
                        variant="outlined"
                        onClick={() => addHeader()}
                      >
                        Add Header
                      </Button>
                    </Grid>
                  </CardContent>
                </Card>

                <Card variant="outlined">
                  <CardContent>
                    <Grid item container>
                      <FormControlLabel
                        style={{ textAlign: "left", display: "flex" }}
                        control={
                          <Checkbox
                            checked={basicAuthChecked}
                            onChange={handleBasicAuthChange}
                          />
                        }
                        label="Basic Authentication"
                      />
                    </Grid>
                    <Grid
                      item
                      container
                      visibility={basicAuthChecked ? "initial" : "hidden"}
                      style={{ marginTop: "10px" }}
                    >
                      <Grid item xs={6}>
                        <AutoSuggestionField
                          placeholder="Username"
                          size="small"
                          value={options?.basic_auth_username ?? ""}
                          onChange={(val) => {
                            setOptions((prevState) => ({
                              ...prevState,
                              basic_auth_username: val,
                            }));
                          }}
                          boxStyle={{
                            paddingLeft: "10px",
                          }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          style={{ width: "100%" }}
                          size="small"
                          required
                          type="password"
                          variant="outlined"
                          placeholder="Password"
                          value={options?.basic_auth_password}
                          onChange={(e) =>
                            setOptions((prevState) => ({
                              ...prevState,
                              basic_auth_password: e.target.value,
                            }))
                          }
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
                <Card variant="outlined">
                  <CardContent>
                    <Grid item container>
                      <FormControlLabel
                        style={{ textAlign: "left", display: "flex" }}
                        control={
                          <Checkbox
                            checked={proxyChecked}
                            onChange={handleProxyChange}
                          />
                        }
                        label="Proxy"
                      />
                    </Grid>
                    <Grid
                      item
                      container
                      visibility={proxyChecked ? "initial" : "hidden"}
                      style={{ marginTop: "10px" }}
                    >
                      <Grid item xs={12}>
                        <TextField
                          style={{ width: "100%" }}
                          size="small"
                          required
                          variant="outlined"
                          placeholder="http://user:pass@proxy_host.com:port"
                          value={options?.proxy}
                          onChange={(e) =>
                            setOptions((prevState) => ({
                              ...prevState,
                              proxy: e.target.value,
                            }))
                          }
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </AccordionDetails>
            </Accordion>
          </Grid>

          <Grid
            item
            container
            columnSpacing={{ xs: 2 }}
            justifyContent="flex-start"
          >
            <Grid item>
              <Typography>
                <span style={{ color: "#aaa49f" }}>
                  Tip: Use{" "}
                  <span style={{ color: "#00cfe8" }}>
                    {"{{_variableName}}"}
                  </span>{" "}
                  format to inject dynamic variables on inputs. {"  "}
                  <Link href="#" onClick={openExternalLinkDynamicVariables}>
                    Learn more →
                  </Link>
                </span>
              </Typography>
            </Grid>
          </Grid>

          <Grid
            item
            container
            columnSpacing={{ xs: 2 }}
            justifyContent="flex-start"
            style={{ marginTop: "1rem" }}
          >
            <Grid item>
              <Button
                size="large"
                variant="contained"
                onClick={() => setRunning(true)}
                disabled={running}
              >
                Start Load Test
              </Button>
            </Grid>
            <Grid item>
              <Button
                size="large"
                variant="contained"
                color="error"
                onClick={stopDdosify}
                disabled={!running}
              >
                Stop
              </Button>
            </Grid>
            <Grid item>
              <Button
                size="large"
                variant="contained"
                color="error"
                onClick={downloadReport}
                disabled={!enableDownload}
              >
                Download Report
              </Button>
            </Grid>
          </Grid>
          <Grid
            item
            container
            style={{ marginTop: "1rem" }}
            visibility={backendInfo === "" ? "hidden" : "initial"}
          >
            <pre
              style={{
                textAlign: "left",
                border: "3px solid #999",
                padding: "20px",
                width: "100%",
              }}
            >
              {backendInfo}
            </pre>
          </Grid>
        </Grid>

        <Grid container style={{ padding: "4rem", width: "100%" }}>
          <Box
            style={{ width: "100%" }}
            sx={{ py: 5, px: 3, borderRadius: 5, boxShadow: 6 }}
          >
            <Stack
              direction="row"
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  style={{
                    display: "block",
                    marginRight: "auto",
                    marginLeft: "auto",
                  }}
                >
                  More? Check out the {"  "}
                  <Link href="#" onClick={openExternalLinkGithub}>
                    Github
                  </Link>
                  {"  "}
                  open-source repository, {"  "}
                  <Link href="#" onClick={openExternalLinkDocs}>
                    Documentation
                  </Link>
                  {"  "} or join our {"  "}
                  <Link href="#" onClick={openExternalLinkDiscord}>
                    Discord Server
                  </Link>
                  {"  "} for issues, feature requests and feedbacks.
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Grid>
      </div>
    </DockerMuiThemeProvider>
  );
}

export default App;
