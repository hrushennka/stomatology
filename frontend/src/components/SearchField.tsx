import React from "react";
import { TextField, IconButton } from "@mui/material";
import { FaSearch } from "react-icons/fa";
interface SearchFieldProps {
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
  setSearchTerm: (term: string) => void;
  handleKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}
const SearchField: React.FC<SearchFieldProps> = ({
  showSearch,
  setShowSearch,
  setSearchTerm,
  handleKeyDown,
}) => {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {showSearch && (
        <TextField
          variant="outlined"
          size="small"
          placeholder="Поиск..."
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          sx={{
            ml: 1,
            mb: 0,
            width: "150px",
            "& .MuiOutlinedInput-root": {
              "& input": {
                padding: "2px 4px",
              },
              "& fieldset": {
                borderRadius: "4px",
              },
            },
          }}
        />
      )}
      <IconButton onClick={() => setShowSearch(!showSearch)}>
        <FaSearch style={{ fontSize: "16px" }} />
      </IconButton>
    </div>
  );
};
export default SearchField;
