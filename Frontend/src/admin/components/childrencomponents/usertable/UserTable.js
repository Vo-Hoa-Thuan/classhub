import { useEffect, useState } from "react";
import { api } from "../../../../api";
import axios from "axios";
import { Link } from "react-router-dom";
import Toast,{ notifyError} from "../../../../components/toast/Toast";
import DataTable from 'react-data-table-component'
import { customStylesDark } from "../datatable/DatatableCustom";

function UserTable() {
    const [users, setUsers] = useState([]);
    const [records,setRecords] = useState([]);
    const [token,setToken] = useState(() => {
      const data = localStorage.getItem('token');
      return data ? data : '';
    });
    const [userLocal,setUserLocal] = useState(() => {
        const data = JSON.parse(localStorage.getItem('user'));
        return data ? data : [];
      });
    const headers = {
      token: `Bearer ${token}`,
      };

    useEffect(()=>{
        axios.get(api+'/user',{headers})
        .then((response)=>{
        setUsers(response.data.filter(item => item._id !== userLocal._id));
        console.log(response.date);
        })
        .catch((err)=>{
        console.log(err);
        });
    },[]);
    
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
            cell: (row) => <>
            {row.admin &&
            <b>Admin</b>
            }
            {row.blogger &&
            <b>Blogger</b>
            }
            { !row.admin && !row.blogger &&
            <b>User</b>
            }
          </>,
        },
        {
          name: 'Action',
          cell: (row) => <>
            <Link to={`/admin/role/change/${row._id}`} 
            className="btn-update-table">Phân quyền</Link>
          </>,
        }
      ];
    
    const handleFilter = (e) =>{
        const newData = users.filter(row =>{
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
            <Toast/>
        </>
     );
}

export default UserTable;