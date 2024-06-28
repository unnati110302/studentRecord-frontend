import React, { useState, useEffect } from 'react';
import { GridApi } from 'ag-grid-community';

const PaginationComponent = ({ api }) => {
    const [pageSize, setPageSize] = useState(2); // Set a default page size

  useEffect(() => {
    if (api) {
      const currentPageSize = api.paginationGetPageSize();
      setPageSize(currentPageSize);
    }
  }, [api]);
  //const [pageSize, setPageSize] = useState(api.paginationGetPageSize());
  const pageSizes = [2, 5, 10]; 

  const handleChangePageSize = (e) => {
    const value = Number(e.target.value);
    setPageSize(value);
    if (api) {
        api.paginationSetPageSize(value);
    }
    //api.paginationSetPageSize(value);
  };

  return (
    <select value={pageSize} onChange={handleChangePageSize}>
      {pageSizes.map((size) => (
        <option key={size} value={size}>
          {size}
        </option>
      ))}
    </select>
  );
};

export default PaginationComponent;
