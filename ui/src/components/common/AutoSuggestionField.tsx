import React, { useEffect, useState, useCallback } from 'react';
import { Autocomplete, TextField, Box, TextFieldProps } from '@mui/material';
import { DYNAMIC_VARS } from '../../constants';

interface DynamicMatch {
  name: string;
  color: string;
}

interface AutoSuggestionFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  placeholder?: string;
  helperText?: string;
  label?: string;
  variant?: TextFieldProps['variant'];
  size?: TextFieldProps['size'];
  name?: string;
  boxStyle?: React.CSSProperties;
}

const regex = {
  option: /({+[^{]*?$)/,
  filter: /{([^{}]*?$)/,
  dynamic: /({{[^{}]*?}})/,
  openBrace: /{[^{}]*$/,  // Detects if there's an unclosed brace
};

export function AutoSuggestionField({
  value,
  onChange,
  error,
  placeholder,
  helperText,
  label,
  variant,
  size,
  name,
  boxStyle,
}: AutoSuggestionFieldProps) {
  const [dynamicMatch, setDynamicMatch] = useState<DynamicMatch[]>([]);
  const [open, setOpen] = useState(false);

  // Only show dropdown when there's an unclosed brace (typing dynamic variable)
  const shouldShowDropdown = useCallback((inputValue: string) => {
    return regex.openBrace.test(inputValue);
  }, []);

  const filterOptions = useCallback(
    (options: string[]) => {
      let filterValue: string | null = null;

      for (const matchOption of dynamicMatch) {
        const match = matchOption.name.match(regex.filter);
        if (match) {
          filterValue = match[1];
        }
      }

      if (!filterValue) return options;

      return options.filter((option) =>
        option.toLowerCase().includes(filterValue?.toLowerCase() ?? '')
      );
    },
    [dynamicMatch]
  );

  const handleTargetOption = useCallback(
    (selectedValue: string | null, type: string) => {
      if (type === 'selectOption' && selectedValue) {
        const newOption = value.replace(regex.option, '').concat('{{' + selectedValue + '}}');

        const splitOption = newOption.split(regex.dynamic).filter((key) => key !== '');

        const dynamicOption = splitOption.map((key) => ({
          name: key.trim(),
          color: key.match(regex.dynamic) ? '#00cfe8' : '',
        }));

        setDynamicMatch(dynamicOption);
        onChange(splitOption.join(''));
        setOpen(false);
      }
    },
    [value, onChange]
  );

  const handleTargetInput = useCallback(
    (inputValue: string, type: string) => {
      if (type !== 'reset') {
        const splitInput = inputValue.split(regex.dynamic).filter((key) => key !== '');

        const dynamicInput = splitInput.map((key) => ({
          name: key.trim(),
          color: key.match(regex.dynamic) ? '#00cfe8' : '',
        }));

        setDynamicMatch(dynamicInput);
        onChange(splitInput.join(''));

        // Only open dropdown when typing { for dynamic variables
        setOpen(shouldShowDropdown(inputValue));
      }

      if (!inputValue) {
        setDynamicMatch([]);
        setOpen(false);
      }
    },
    [onChange, shouldShowDropdown]
  );

  // Sync dynamicMatch when value prop changes (e.g., after URL cleaning)
  useEffect(() => {
    if (value) {
      const splitInput = value.split(regex.dynamic).filter((key) => key !== '');
      const dynamicInput = splitInput.map((key) => ({
        name: key.trim(),
        color: key.match(regex.dynamic) ? '#00cfe8' : '',
      }));
      setDynamicMatch(dynamicInput);
    } else {
      setDynamicMatch([]);
    }
  }, [value]);

  // Calculate top position based on size
  const getOverlayTop = () => {
    if (label) {
      return size === 'small' ? '50%' : '50%';
    }
    return '50%';
  };

  return (
    <Autocomplete
      freeSolo
      open={open}
      onClose={() => setOpen(false)}
      sx={{ width: '100%', position: 'relative' }}
      options={DYNAMIC_VARS}
      filterOptions={filterOptions}
      value={value}
      onChange={(_, selectedValue, type) => {
        handleTargetOption(selectedValue, type);
      }}
      inputValue={value}
      onInputChange={(_, inputValue, type) => {
        handleTargetInput(inputValue, type);
      }}
      renderInput={(params) => (
        <Box sx={{ position: 'relative' }}>
          <TextField
            {...params}
            name={name}
            size={size}
            sx={(theme) => ({
              '& input': {
                color: 'transparent',
                caretColor: theme.palette.text.primary,
                '&::selection': {
                  backgroundColor: theme.palette.action.selected,
                },
              },
            })}
            type="text"
            error={error}
            placeholder={placeholder}
            helperText={helperText}
            label={label}
            variant={variant}
            inputProps={{
              ...params.inputProps,
              'aria-label': label || placeholder || 'Input field',
            }}
          />
          <Box
            component="div"
            sx={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: getOverlayTop(),
              transform: 'translateY(-50%)',
              paddingLeft: '14px',
              paddingRight: '40px',
              fontSize: size === 'small' ? '0.875rem' : '1rem',
              lineHeight: 1.5,
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              ...boxStyle,
            }}
          >
            {dynamicMatch.length > 0 ? (
              dynamicMatch.map((match, matchIndex) => (
                <Box
                  component="span"
                  key={matchIndex}
                  sx={{ color: match.color || 'text.primary' }}
                >
                  {match.name}
                </Box>
              ))
            ) : (
              <Box component="span" sx={{ color: 'text.disabled' }}>
                {placeholder}
              </Box>
            )}
          </Box>
        </Box>
      )}
    />
  );
}
