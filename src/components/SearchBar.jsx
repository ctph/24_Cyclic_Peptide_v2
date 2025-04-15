import React, { useState } from 'react';
import { Select } from 'antd';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ allOptions }) => {
  const [value, setValue] = useState("");
  const navigate = useNavigate();
  const options = (allOptions || []).map((filename) => {
    const pdbId = filename.replace('.pdb', '').toUpperCase();
    return {
      label: pdbId,  // Display the clean ID
      value: filename  // Keep original filename as value
    };
  });

  const handleInput = (inputValue) => {
    setValue(inputValue);
  };

  const handleChange = (selectedFilename) => {
    const pdbId = selectedFilename.replace('.pdb', '').toLowerCase();
    setValue(selectedFilename);
    navigate(`/pdb/${pdbId}`);
  };

  return (
    <Select
      showSearch
      value={value}
      placeholder="Search PDB IDs"
      style={{ width: '100%' }}
      options={options}
      onSearch={handleInput}
      onChange={handleChange}
      filterOption={(input, option) =>
        option?.label?.toUpperCase().includes(input.toUpperCase()) ||
        option?.value?.toUpperCase().includes(input.toUpperCase())
      }
      optionFilterProp="both" // Search both label and value
      optionLabelProp="label" // Always show the clean ID in selection
    />
  );
};

export default SearchBar;