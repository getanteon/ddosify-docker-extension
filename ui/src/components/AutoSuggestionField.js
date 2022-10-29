import { Autocomplete, TextField, Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { dynamicVarsList } from "../dynamicVarsList";

const regex = {
  option: /({+[^{]*?$)/,
  filter: /{([^{}]*?$)/,
  dynamic: /({{[^{}]*?}})/,
};

const AutoSuggestionField = (props) => {
  const { varsList } = dynamicVarsList();
  const [dynamicMatch, setDynamicMatch] = useState([]);

  const filterOptions = (options) => {
    let filterValue = null;

    for (const key in dynamicMatch) {
      const matchOption = dynamicMatch[key];

      if (matchOption.name.match(regex.filter)) {
        filterValue = matchOption.name.match(regex.filter)[1];
      }
    }

    return options.filter((option) =>
      option.toLowerCase().includes(filterValue?.toLowerCase())
    );
  };

  const handleTargetOption = (value, type) => {
    if (type === "selectOption") {
      const newOption = props.value
        .replace(regex.option, "")
        .concat("{{" + value + "}}");

      const splitOption = newOption
        .split(regex.dynamic)
        .filter((key) => key !== "");

      const dynamicOption = splitOption.map((key) => {
        return {
          name: key.trim(),
          color: key.match(regex.dynamic) ? "#00cfe8" : "",
        };
      });

      setDynamicMatch(dynamicOption);
      props.onChange(splitOption.join("") ?? "");
    }
  };

  const handleTargetInput = (value, type) => {
    if (type !== "reset") {
      const splitInput = value.split(regex.dynamic).filter((key) => key !== "");

      const dynamicInput = splitInput.map((key) => {
        return {
          name: key.trim(),
          color: key.match(regex.dynamic) ? "#00cfe8" : "",
        };
      });

      setDynamicMatch(dynamicInput);
      props.onChange(splitInput.join("") ?? "");
    }

    if (!value) {
      setDynamicMatch([]);
    }
  };

  useEffect(() => {
    if (props.value) {
      handleTargetInput(props.value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Autocomplete
      freeSolo
      sx={{ width: "100%", position: "relative" }}
      options={varsList}
      filterOptions={(options) => filterOptions(options)}
      value={props.value}
      onChange={(event, value, type) => {
        handleTargetOption(value, type);
      }}
      inputValue={props.value}
      onInputChange={(event, value, type) => {
        handleTargetInput(value, type);
      }}
      renderInput={(params) => (
        <>
          <TextField
            {...params}
            name={props.name}
            size={props.size}
            sx={{ WebkitTextFillColor: props.value ? "transparent" : "" }}
            type="text"
            error={props.error}
            placeholder={props.placeholder}
            helperText={props.helperText}
          />
          <Box
            {...params}
            component="div"
            sx={{
              position: "absolute",
              left: 0,
              top: "25%",
              paddingLeft: "15.5px",
              fontSize: "14px",
              lineHeight: 1.1,
              pointerEvents: "none",
              ...props.boxStyle,
            }}
          >
            {dynamicMatch?.map((match, matchIndex) => (
              <Box
                {...params}
                component="span"
                key={matchIndex}
                sx={{ color: `${match.color}` }}
              >
                {match.name}
              </Box>
            ))}
          </Box>
        </>
      )}
    />
  );
};

export default AutoSuggestionField;
