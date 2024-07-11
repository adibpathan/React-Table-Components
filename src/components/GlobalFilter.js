import React, { useState } from 'react';
import { useAsyncDebounce } from 'react-table';
import './table.css';  // Import the CSS file for styling

const GlobalFilter = ({ filter, setFilter }) => {
  const [value, setValue] = useState(filter);

  const onChange = useAsyncDebounce(value => {
    setFilter(value || undefined);
  }, 1000);

  return (
    <div className="global-filter"> 
      Search: {' '}
      <input
        value={value || ''}
        onChange={e => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
      />
    </div>
  );
};

export default GlobalFilter;
