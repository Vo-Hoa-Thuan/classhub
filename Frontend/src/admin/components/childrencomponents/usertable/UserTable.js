import { useEffect, useState } from "react";
import { api } from "../../../../api";
import axios from "axios";
import { Link } from "react-router-dom";
import Toast from "../../../../components/toast/Toast";
import DataTable from 'react-data-table-component'
import { customStylesDark } from "../datatable/DatatableCustom";
import DeleteUserDialog from "../../dialogs/dialogdelete/DeleteUserDialog";
import PermissionManager from "../../pages/role/PermissionManager";

function UserTable() {
    const [users, setUsers] = useState([]);
    const [records,setRecords] = useState([]);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState(null);
    const [permissionDialog, setPermissionDialog] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [token] = useState(() => {
      const data = localStorage.getItem('accessToken');
      return data ? data : '';
    });
    const [userLocal] = useState(() => {
        const data = JSON.parse(localStorage.getItem('user'));
        return data ? data : [];
      });

    useEffect(()=>{
        const headers = {
            Authorization: `Bearer ${token}`,
        };
        
        axios.get(api+'/user',{headers})
        .then((response)=>{
            // Kiểm tra cấu trúc response và lấy data array
            const users = response.data.data || response.data;
            const filteredUsers = users.filter(item => item._id !== userLocal._id);
            setUsers(filteredUsers);
            console.log('Users data:', users);
        })
        .catch((err)=>{
            console.error('Error fetching users:', err);
        });
    },[token, userLocal._id]);
    
    useEffect(() => {
        setRecords(users);
        }, [users]);

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
            name: 'Role',
            cell: (row) => {
                const getRoleLabel = (role) => {
                    switch(role) {
                        case 'admin': return 'Quản trị viên';
                        case 'productManager': return 'Quản lý sản phẩm';
                        case 'blogger': return 'Người viết blog';
                        case 'user': return 'Người dùng';
                        default: return 'Người dùng';
                    }
                };
                
                const getRoleBadge = (role) => {
                    const badges = {
                        'admin': 'badge bg-danger',
                        'productManager': 'badge bg-warning',
                        'blogger': 'badge bg-info',
                        'user': 'badge bg-secondary'
                    };
                    return badges[role] || 'badge bg-secondary';
                };
                
                return (
                    <span className={getRoleBadge(row.role)}>
                        {getRoleLabel(row.role)}
                    </span>
                );
            },
        },
        {
          name: 'Action',
          cell: (row) => <>
            <button 
                className="btn btn-sm btn-primary me-1"
                onClick={() => handlePermissionClick(row._id)}
            >
                Quản lý quyền
            </button>
            <Link to={`/admin/role/change/${row._id}`} 
            className="btn btn-sm btn-outline-secondary me-1">Phân quyền cũ</Link>
            <button 
                className="btn btn-sm btn-danger" 
                onClick={() => handleDelete(row._id)}
            >
                Xóa
            </button>
          </>,
        }
      ];
    
    const handleFilter = (e) =>{
        const newData = users.filter(row =>{
          return row.email.toLowerCase().includes(e.target.value.toLowerCase());
        })
        setRecords(newData);
      }

    const handleDelete = (id) => {
        setUserIdToDelete(id);
        setDeleteDialog(true);
    }

    const handlePermissionClick = (id) => {
        setSelectedUserId(id);
        setPermissionDialog(true);
    }

    const handlePermissionClose = () => {
        setPermissionDialog(false);
        setSelectedUserId(null);
        // Refresh user data
        fetchUsers();
    }

    const fetchUsers = () => {
        const headers = {
            Authorization: `Bearer ${token}`,
        };
        
        axios.get(api+'/user',{headers})
        .then((response)=>{
            const users = response.data.data || response.data;
            const filteredUsers = users.filter(item => item._id !== userLocal._id);
            setUsers(filteredUsers);
        })
        .catch((err)=>{
            console.error('Error fetching users:', err);
        });
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
            <Toast/>
            {deleteDialog && (
                <DeleteUserDialog
                    id={userIdToDelete}
                    setDeleteDialog={setDeleteDialog}
                    data={users}
                    setData={setUsers}
                    api_request={`${api}/user/delete/`}
                />
            )}
            {permissionDialog && (
                <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Quản lý quyền người dùng</h5>
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    onClick={handlePermissionClose}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <PermissionManager 
                                    userId={selectedUserId} 
                                    onClose={handlePermissionClose}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
     );
}

export default UserTable;
