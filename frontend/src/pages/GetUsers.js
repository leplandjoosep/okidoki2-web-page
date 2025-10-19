import React from "react";
import axios from "axios";
import { Table, Button } from "react-bootstrap";
import { useTable, useSortBy, useGlobalFilter, usePagination } from 'react-table';
import '../css/GetUsers.css'

const api = axios.create({
    baseURL: "http://okidoki2.hopto.org/api"
    // baseURL: "http://localhost:8080/api"
});

const GetUsers = () => {
    const [users, setUsers] = React.useState([]);
    const authToken = localStorage.getItem('token');

    React.useEffect(() => {
        getUsers();
        fetchSunset();
        // eslint-disable-next-line
    }, []);

    const getUsers = async () => {
        try {
            if (!authToken) {
                console.error('Authentication token is missing.');
                return;
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            };

            let data = await api.get("/user", config).then(({data}) => data);
            setUsers(data);
        } catch (err) {
            console.error('Error retrieving users:', err);
        }
    };

    const [sunset, setSunset] = React.useState('');

    const fetchSunset = async () => {
        try {
            const response = await api.get('/public/sunset');
            const data = await response.data;
            setSunset(data.sunset);
        } catch (error) {
            console.error('Error getting sunset info: ', error);
        }
    };


    const data = React.useMemo(() => users, [users]);

    const columns = React.useMemo(
        () => [
            {
                Header: 'First Name',
                accessor: 'firstName',
            },
            {
                Header: 'Last Name',
                accessor: 'lastName',
            },
            {
                Header: 'Email',
                accessor: 'email',
            },
        ],
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        nextPage,
        previousPage,
        gotoPage,
        pageCount,
        setGlobalFilter,
        state: { pageIndex, globalFilter },
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0, pageSize: 5 },
        },
        useGlobalFilter,
        useSortBy,
        usePagination
    );

    return (
        <div className="userTableContainer">
            <p>Sunset: {sunset}</p> {/* Display the "sunset" data */}
            <input
                value={globalFilter || ''}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder={"Search..."}
                style={{
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    fontSize: '16px',
                    width: '250px', // Adjust width as needed
                    marginTop: '20px'
                }}
            />
            <Table className='userTable' {...getTableProps()}>
                <colgroup>
                    <col style={{ width: '150px' }} /> {/* Set the width for each column */}
                    <col style={{ width: '150px' }} />
                    <col style={{ width: '150px' }} />
                    {/* Add more col elements for each column */}
                </colgroup>
                <thead>
                {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                            <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                {column.render('Header')}
                                <span>
                    {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                  </span>
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                {page.map((row) => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map((cell) => (
                                <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                            ))}
                        </tr>
                    );
                })}
                </tbody>
            </Table>
            <div>
                <Button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                    {'<<'}
                </Button>{' '}
                <Button onClick={() => previousPage()} disabled={!canPreviousPage}>
                    {'<'}
                </Button>{' '}
                <Button onClick={() => nextPage()} disabled={!canNextPage}>
                    {'>'}
                </Button>{' '}
                <Button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                    {'>>'}
                </Button>{' '}
                <span>
          Page{' '}
                    <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
            </div>
        </div>
    );
};

export default GetUsers;