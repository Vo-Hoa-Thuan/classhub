import { useEffect, useState } from "react";
import DataTable from 'react-data-table-component'
import axios from 'axios';

import {api} from '../../../../api'
import { Link } from "react-router-dom";
import { customStylesDark } from "../datatable/DatatableCustom";
import Toast,{notifyError} from "../../../../components/toast/Toast";

function TopicTable() {
    const [topics, setTopics] = useState([]);
    const [records,setRecords] = useState([]);
    const [topicId,setTopicId] = useState();
    const [deleteDialog, setDeleteDialog] = useState(false);
    const api_delete = api+'/topic/delete/'
    const [token,setToken] = useState(() => {
      const data = localStorage.getItem('token');
      return data ? data : '';
    });
    const headers = {
      token: `Bearer ${token}`,
      };

    useEffect(()=>{
        axios.get(api+'/topic')
        .then((response)=>{
        setTopics(response.data);
        console.log(response.date);
        })
        .catch((err)=>{
        console.log(err);
        });
    },[]);
    
    useEffect(() => {
        setRecords(topics);
        }, [topics]);

    const columns = [
        {
          name: 'Title',
          selector: row => row.title,
          sortable: true,
        },
        {
          name: 'Description',
          selector: row => row.desc,
          sortable: true
        },
        {
            name: 'Status',
            cell: row => <>
                <button className={`toggle-btn ${row.status ? "active" : ""}`}>
                    <div className="slider"></div>
                </button>
            </>,
            selector: row => row.status,
            sortable: true
        },
        {
          name: 'Action',
          cell: (row) => <>
            <Link to={`/admin/topic/update/${row._id}`} 
            className="btn-update-table">Sửa</Link> | 
            <a href="#home" 
            className="btn-delete-table" 
            onClick={() => handleDelete(row._id)}>Xóa</a>
          </>,
        }
      ];
    
    const handleFilter = (e) =>{
        const newData = topics.filter(row =>{
          return row.title.toLowerCase().includes(e.target.value.toLowerCase());
        })
        setRecords(newData);
      }
    const handleDelete = (id) =>{
        setTopicId(id);
        setDeleteDialog(true);
      }
    const handleConfirmDelete = async() => {
        await axios.delete(api_delete+topicId,{headers})
            .then((reponsive)=>{
                console.log('Xóa thành công!');
                setDeleteDialog(false);
                setRecords(topics.filter(topic => topic._id !== topicId));
            })
            .catch((err)=>{
                console.log(err);
        });
        notifyError('Xóa thành công!')
    }
    return ( 
        <>
            <div className="row mb-4">
                <div className="col-12">
                    <div className="title-table">
                    <h5 className="mb-2 upcase">Danh Sách Topic</h5>
                    <Link to='/admin/topic/add' className="btn btn-primary"><i className='bx bx-image-add'></i>Thêm</Link>
                    <div className='text-end'>
                        <input className="input-search-tb" placeholder='Tìm theo tên...' type='text' onChange={handleFilter}/>
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

            {deleteDialog &&
                <div className='container-dialog-delete'>
                <div className="overlay-dialog"></div>
                    <div className="dialog-delete">
                        <i className='icon-cancel-delete bx bx-x' 
                        onClick={()=> setDeleteDialog(false)}></i>
                    <div className="card-header">
                      <h5 className='text-dark'>Xác nhận xóa</h5>
                    </div>
                    <p className="card-text">Bạn có chắc muốn xóa sản phẩm này không?</p>
                    <div className="dialog-action">
                      <a href="#home" onClick={handleConfirmDelete} className="btn btn-danger">Xóa</a>
                      <a href="#home" onClick={() => setDeleteDialog(false)} className="btn btn-primary">Cancel</a>
                    </div>
                </div>
            </div>
            }
            <Toast/>
        </>
     );
}

export default TopicTable;