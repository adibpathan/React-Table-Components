import React, { useMemo, useState } from "react";
import { useTable, useSortBy, usePagination, useGlobalFilter } from "react-table";
import dummy_data from "./dummy_data.json";
import { COLUMNS } from "./columns";
import GlobalFilter from "./GlobalFilter";
import { FaSortUp, FaSortDown } from "react-icons/fa";
import * as XLSX from 'xlsx'; // Import all functions and objects from xlsx
import "./table.css";
import "./FilteringSortingPaginationTable.css"

const Resume = () => {
  const columns = useMemo(() => COLUMNS, []);
  const [data, setData] = useState(dummy_data); // Initial data from dummy_data.json

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    prepareRow,
    pageOptions,
    state,
    gotoPage,
    pageCount,
    setPageSize,
    setGlobalFilter
  } = useTable(
    {
      columns,
      data
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const { globalFilter, pageIndex, pageSize } = state;

  const exportFilteredDataToExcel = () => {
    const filteredData = page.map(row => {
      const filteredRow = {};
      row.cells.forEach(cell => {
        filteredRow[cell.column.id] = cell.render('Cell');
      });
      return filteredRow;
    });

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Filtered Data');
    XLSX.writeFile(workbook, 'filtered_data.xlsx');
  };

  const exportAllDataToExcel = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'All Data');
    XLSX.writeFile(workbook, 'all_data.xlsx');
  };

  const handleAddRow = () => {
    // Assuming formInputData holds the input values for each field
    const newRow = {
      id: data.length + 1, // Generate unique ID (replace with your logic if needed)
      first_name: formInputData.first_name,
      last_name: formInputData.last_name,
      email: formInputData.email,
      gender: formInputData.gender,
      date_of_birth: formInputData.date_of_birth,
      age: formInputData.age,
      country: formInputData.country
    };

    setData([...data, newRow]);
    resetForm(); // Reset the form inputs after adding row
  };

  // State to hold form input data
  const [formInputData, setFormInputData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    gender: '',
    date_of_birth: '',
    age: '',
    country: ''
  });

  // Function to update form input data
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormInputData({
      ...formInputData,
      [name]: value
    });
  };

  // Function to reset form inputs
  const resetForm = () => {
    setFormInputData({
      first_name: '',
      last_name: '',
      email: '',
      gender: '',
      date_of_birth: '',
      age: '',
      country: ''
    });
  };

  return (
    <>
      <div className="form-container">
        <div className="form-input">
          <input
            type="text"
            name="first_name"
            value={formInputData.first_name}
            onChange={handleInputChange}
            placeholder="First Name"
          />
        </div>
        <div className="form-input">
          <input
            type="text"
            name="last_name"
            value={formInputData.last_name}
            onChange={handleInputChange}
            placeholder="Last Name"
          />
        </div>
        <div className="form-input">
          <input
            type="email"
            name="email"
            value={formInputData.email}
            onChange={handleInputChange}
            placeholder="Email"
          />
        </div>
        <div className="form-input">
          <input
            type="text"
            name="gender"
            value={formInputData.gender}
            onChange={handleInputChange}
            placeholder="Gender"
          />
        </div>
        <div className="form-input">
          <input
            type="text"
            name="date_of_birth"
            value={formInputData.date_of_birth}
            onChange={handleInputChange}
            placeholder="Date of Birth"
          />
        </div>
        <div className="form-input">
          <input
            type="number"
            name="age"
            value={formInputData.age}
            onChange={handleInputChange}
            placeholder="Age"
          />
        </div>
        <div className="form-input">
          <input
            type="text"
            name="country"
            value={formInputData.country}
            onChange={handleInputChange}
            placeholder="Country"
          />
        </div>
        <button onClick={handleAddRow} className="add-row-button">
          Add Data
        </button>
      </div>
      <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
      <button onClick={exportFilteredDataToExcel} className="excel-export-button">
        Export Filtered Data to Excel
      </button>
      <button onClick={exportAllDataToExcel} className="excel-export-button">
        Export All Data to Excel
      </button>
      <table {...getTableProps()} className="table">
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())} className="th">
                  {column.render("Header")}
                  <span>
                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <FaSortDown />
                      ) : (
                        <FaSortUp />
                      )
                    ) : null}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} className="tr">
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()} className="td">
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="pagination-buttons">
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <span>
          | Go to page: {' '}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={e => {
              const pageNumber = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(pageNumber);
            }}
            className="page-input"
          />
        </span>
        <select
          value={pageSize}
          onChange={e => setPageSize(Number(e.target.value))}
          className="page-size-select"
        >
          {[10, 25, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage} className="pagination-button">
          {'<<'}
        </button>
        <button onClick={() => previousPage()} disabled={!canPreviousPage} className="pagination-button">
          Previous
        </button>
        <button onClick={() => nextPage()} disabled={!canNextPage} className="pagination-button">
          Next
        </button>
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} className="pagination-button">
          {'>>'}
        </button>
      </div>
    </>
  );
};

export default Resume
