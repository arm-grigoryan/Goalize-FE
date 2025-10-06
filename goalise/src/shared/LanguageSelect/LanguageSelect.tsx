"use client";

import { useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import styles from "./LanguageSelect.module.css";

const languages = [
  { code: "en", name: "English" },
  { code: "hy", name: "Հայերեն" },
];

export const LanguageSelect = () => {
  const [lang, setLang] = useState("en");

  const handleChange = (event: SelectChangeEvent<string>) => {
    setLang(event.target.value as string);
  };

  const renderValue = (selected: string) => {
    const item = languages.find((l) => l.code === selected);
    return (
      <Typography className={styles.langSelectedValue} variant="body2" noWrap>
        {item?.name ?? selected}
      </Typography>
    );
  };

  const menuProps = {
    PaperProps: {
      style: {
        backgroundColor: "#101010",
        borderRadius: 12,
        marginTop: 0,
        marginBottom: 0,
      },
    },
    MenuListProps: {
      style: {
        paddingTop: 0,
        paddingBottom: 0,
      },
    },
  };

  return (
    <Box className={styles.langBox}>
      <FormControl size="small" className={styles.langFormControl}>
        <InputLabel id="lang-select-label" className={styles.langLabel}>
          Language
        </InputLabel>

        <Select
          labelId="lang-select-label"
          value={lang}
          label="Language"
          onChange={handleChange}
          renderValue={(v) => renderValue(v as string)}
          MenuProps={menuProps}
          sx={{
            "& .MuiSelect-select": {
              color: "gray",
              padding: "6px 10px",
              borderRadius: 12,
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "gray",
              borderRadius: 12,
            },
            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#888" },
            "& .MuiSvgIcon-root": { color: "gray" },
          }}
        >
          {languages.map((item) => (
            <MenuItem
              key={item.code}
              value={item.code}
              sx={{
                color: "gray",
                backgroundColor: "#101010",
                "&.Mui-selected": { backgroundColor: "#222", color: "#ccc" },
                "&:hover": { backgroundColor: "#222" },
                borderRadius: 8,
              }}
            >
              <Typography className={styles.langMenuTypography} variant="body2">
                {item.name}
              </Typography>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};
