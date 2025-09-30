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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [token] = useState(() => {
      const data = localStorage.getItem('accessToken');
      return data ? data : '';
    });

    useEffect(()=>{
        console.log('Token from localStorage:', token);
        console.log('Token length:', token ? token.length : 0);
        setLoading(true);
        setError(null);
        
        if(token) {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            
            console.log('Headers being sent:', headers);
            console.log('Making API request to:', api+'/user/with-orders');
            axios.get(api+'/user/with-orders',{headers})
            .then((response)=>{
                console.log('API Response:', response);
                // Lấy danh sách user có đơn hàng
                const users = response.data.data || response.data;
                console.log('Users with orders data:', users);
                setCustomers(users);
                setRecords(users);
                setLoading(false);
            })
            .catch((err)=>{
                console.error('Error fetching users with orders:', err);
                console.error('Error response:', err.response);
                setError(err.response?.data?.message || 'Có lỗi xảy ra khi tải dữ liệu');
                setLoading(false);
            });
        } else {
            console.log('No token found in localStorage');
            setError('Vui lòng đăng nhập để xem dữ liệu');
            setLoading(false);
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
            name: 'Số đơn hàng',
            selector: row => row.totalOrders || 0,
            sortable: true,
            cell: (row) => (
                <span className="badge bg-primary">
                    {row.totalOrders || 0} đơn
                </span>
            )
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
                    <h5 className="mb-2 upcase">Danh Sách Khách Hàng Có Đơn Hàng</h5>
                    <div className='text-end'>
                        <input className="input-search-tb" placeholder='Tìm theo email...' type='text' onChange={handleFilter}/>
                    </div>
                    </div>
                    
                    {loading && (
                        <div className="text-center py-4">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-2">Đang tải dữ liệu...</p>
                        </div>
                    )}
                    
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            <strong>Lỗi:</strong> {error}
                        </div>
                    )}
                    
                    {!loading && !error && records.length === 0 && (
                        <div className="alert alert-info" role="alert">
                            <strong>Thông báo:</strong> Không có dữ liệu khách hàng nào có đơn hàng.
                        </div>
                    )}
                    
                    {!loading && !error && records.length > 0 && (
                        <DataTable
                            columns={columns}
                            data={records}
                            fixedHeader
                            pagination
                            customStyles={customStylesDark}
                        ></DataTable>
                    )}
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
