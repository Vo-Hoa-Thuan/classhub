import { Link, useNavigate } from "react-router-dom";
import Default from "../../layout/default/Default";
import DataTable from 'react-data-table-component'
import { useEffect, useState } from "react";
import axios from "axios";
import { api } from "../../../api";
import { customStylesLight } from "../../../admin/components/childrencomponents/datatable/DatatableCustom";
import './BlogManagement.scss'

function BlogManagement() {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const [records,setRecords] = useState([]);
    const [token,setToken] = useState(() => {
        const data = localStorage.getItem('token');
        return data ? data : [];
      });
    const headers = {
        token: `Bearer ${token}`,
        };
    const [user,setUser] = useState(() => {
      const data = JSON.parse(localStorage.getItem('user'));
      return data ? data : '';
    });
    // const user = JSON.parse(localStorage.getItem('user'));
    useEffect(()=>{
      if(!user){
        navigate('/404-page');
      }
      else{
        axios.get(api+`/blog/get_by_blogger/${user._id}`,{headers})
        .then((response)=>{
        setBlogs(response.data);
        setRecords(response.data);
        })
        .catch((err)=>{
        console.log(err);
        });
      }
    },[]);
    const columns = [
        {
            name: 'Image',
            cell: (row) => <div className='container-img-product'>
            <img src={row.imageUrl} className="img-product rounded float-left" alt={row.name}/>
            </div>,
        },
        {
          name: 'Topic',
          selector: row => row.topic ? row.topic.title : null,
          sortable: true,
        },
        {
          name: 'Title',
          selector: row => row.title,
          sortable: true
        },
        {
            name: 'Status',
            selector: row => row.status,
            cell: row => <>
                <button className={`toggle-btn ${row.status ? "active" : ""}`}>
                    <div className="slider"></div>
                </button>
            </>,
            sortable: true
        },
        {
          name: 'Action',
          cell: (row) => <>
            <Link to={`/blog-update/${row._id}`} 
            className="btn-update-table">Sửa</Link>
          </>,
        }
      ];
    const handleFilter = (e) =>{
        const newData = blogs.filter(row =>{
          return row.title.toLowerCase().includes(e.target.value.toLowerCase());
        })
        setRecords(newData);
      }
    return ( 
        <Default>
            <div className="row mb-4">
            <div className="col-12">
                <div className="title-blog-management">
                <h5 className="mb-2 upcase">Danh Sách Bài Viết</h5>
                <Link to='/blog-create' className="btn btn-primary"><i className='bx bx-image-add'></i>Thêm</Link>
                <div className='text-end'>
                    <input className="input-search-tb" placeholder='Tìm theo title...' type='text' onChange={handleFilter}/>
                </div>
                </div>
                <DataTable
                    columns={columns}
                    data={records}
                    fixedHeader
                    pagination
                    customStyles={customStylesLight}
                ></DataTable>
            </div>
        </div>
        </Default>
     );
}

export default BlogManagement;