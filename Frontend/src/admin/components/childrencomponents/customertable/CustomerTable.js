import axios from "axios";
import { useEffect, useState } from "react";
import { api } from "../../../../api";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { customStylesDark } from "../datatable/DatatableCustom";

function CustomerTable() {
    const [customers, setCustomers] = useState([]);
    const [records,setRecords] = useState([]);
    const [token,setToken] = useState(() => {
      const data = localStorage.getItem('token');
      return data ? data : '';
    });
    const headers = {
      token: `Bearer ${token}`,
      };

    useEffect(()=>{
        axios.get(api+'/user',{headers})
        .then((response)=>{
        setCustomers(response.data.filter(item => item.admin===false && item.blogger===false));
        setRecords(response.data.filter(item => item.admin===false && item.blogger===false));
        console.log(response.data);
        })
        .catch((err)=>{
        console.log(err);
        });
    },[]);

    const columns = [
        {
            name: 'Avatar',
            cell: (row) => <div className='container-img-product'>
            <img src={row.image} className="img-product rounded float-left" alt={row.fullname}/>
            </div>,
        },
        {
          name: 'Full Name',
          selector: row => row.fullname,
          sortable: true,
        },
        {
          name: 'Email',
          selector: row => row.email,
          sortable: true
        },
        {
            name: 'Phone',
            selector: row => row.phone,
            sortable: true
        },
        {
            name: 'Gender',
            selector: row => row.gender,
            sortable: true
        },
        {
          name: 'Action',
          cell: (row) => <>
            <Link to={`/admin/details-customer/${row._id}`} 
            className="btn-update-table">Xem</Link>
          </>,
        }
      ];
    
    const handleFilter = (e) =>{
        const newData = customers.filter(row =>{
          return row.email.toLowerCase().includes(e.target.value.toLowerCase());
        })
        setRecords(newData);
      }
    return ( 
        <>
            <div className="row mb-4">
                <div className="col-12">
                    <div className="title-table">
                    <h5 className="mb-2 upcase">Danh Sách Người Dùng</h5>
                    <div className='text-end'>
                        <input className="input-search-tb" placeholder='Tìm theo email...' type='text' onChange={handleFilter}/>
                    </div>
                    </div>
                    <DataTable
                        columns={columns}
                        data={records}
                        fixedHeader
                        pagination
                        customStyles={customStylesDark}
                    ></DataTable>
                </div>
            </div>
        </>
     );
}

export default CustomerTable;