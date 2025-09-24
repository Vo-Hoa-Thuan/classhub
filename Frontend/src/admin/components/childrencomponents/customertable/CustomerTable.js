import axios from "axios";
import { useEffect, useState } from "react";
import { api } from "../../../../api";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { customStylesDark } from "../datatable/DatatableCustom";
import DeleteUserDialog from "../../dialogs/dialogdelete/DeleteUserDialog";

function CustomerTable() {
    const [customers, setCustomers] = useState([]);
    const [records,setRecords] = useState([]);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [customerIdToDelete, setCustomerIdToDelete] = useState(null);
    const [token] = useState(() => {
      const data = localStorage.getItem('accessToken');
      return data ? data : '';
    });

    useEffect(()=>{
        if(token) {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            
            axios.get(api+'/user',{headers})
            .then((response)=>{
                // Kiểm tra cấu trúc response và lấy data array
                const users = response.data.data || response.data;
                const filteredUsers = users.filter(item => item.admin===false && item.blogger===false);
                setCustomers(filteredUsers);
                setRecords(filteredUsers);
                console.log('Users data:', users);
            })
            .catch((err)=>{
                console.error('Error fetching users:', err);
            });
        }
    },[token]);

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
            className="btn-update-table">Xem</Link> | 
            <a href="#home" 
            className="btn-delete-table" 
            onClick={() => handleDelete(row._id)}>Xóa</a>
          </>,
        }
      ];
    
    const handleFilter = (e) =>{
        const newData = customers.filter(row =>{
          return row.email.toLowerCase().includes(e.target.value.toLowerCase());
        })
        setRecords(newData);
      }

    const handleDelete = (id) => {
        setCustomerIdToDelete(id);
        setDeleteDialog(true);
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
            {deleteDialog && (
                <DeleteUserDialog
                    id={customerIdToDelete}
                    setDeleteDialog={setDeleteDialog}
                    data={customers}
                    setData={setCustomers}
                    api_request={`${api}/user/delete/`}
                />
            )}
        </>
     );
}

export default CustomerTable;
