import React from "react";
import {
  Grid,
  TextField,
  InputAdornment,
  IconButton,
  Icon,
} from "@mui/material";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";

function Input({
  name,
  label,
  type,
  handleChange,
  half,
  autoFocus,
  handleShowPassword,
  value,
}) {
  return (
    <Grid item xs={12} sm={half ? 6 : 12}>
      <TextField
        name={name}
        value={value}
        label={label}
        type={type}
        onChange={handleChange}
        fullWidth
        variant="outlined"
        required
        autoFocus={autoFocus}
        InputProps={
          name === "password" || name === "confirmPassword"
            ? {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleShowPassword}>
                      {type === "password" ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }
            : null
        }
      />
    </Grid>
  );
}

export default Input;
