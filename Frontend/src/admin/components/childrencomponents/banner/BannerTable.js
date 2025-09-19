import { useEffect, useState } from "react";
import DataTable from 'react-data-table-component'
import axios from 'axios';

import {api} from '../../../../api'
import { Link } from "react-router-dom";
import { customStylesDark } from "../datatable/DatatableCustom";
import DeleteDialog from "../../dialogs/dialogdelete/DeleteDialog";
const api_delete = api+'/banner/delete/'

function BannerTable() {
    const [banners, setBanners] = useState([]);
    const [records,setRecords] = useState([]);
    const [imageUrl,setImageUrl] = useState('');
    const [idBanner,setIdBanner] = useState();
    const [deleteDialog, setDeleteDialog] = useState(false);

    useEffect(()=>{
        axios.get(api+'/banner')
        .then((response)=>{
        setBanners(response.data);
        console.log(banners);
        })
        .catch((err)=>{
        console.log(err);
        });
    },[]);
    
    useEffect(() => {
        setRecords(banners);
        }, [banners]);

    const columns = [
        {
            name: 'Image',
            cell: (row) => <div className='container-img-product'>
            <img src={row.imageUrl} className="img-product rounded float-left" alt={row.name}/>
            </div>,
        },
        {
          name: 'Text Highlight',
          selector: row => row.textHighLight,
          sortable: true,
        },
        {
          name: 'Description',
          selector: row => row.desc,
          sortable: true
        },
        {
          name: 'Position',
          selector: row => row.position,
          sortable: true
        },
        {
            name: 'Status',
            cell: row => <>
                <button className={`toggle-btn ${row.offBanner ? "" : "active"}`}>
                    <div className="slider"></div>
                </button>
            </>,
            selector: row => row.offBanner,
            sortable: true
        },
        {
          name: 'Action',
          cell: (row) => <>
            <Link to={`/admin/banner/update/${row._id}`} 
            className="btn-update-table">Sửa</Link> | 
            <a href="#home" 
            className="btn-delete-table" 
            onClick={() => handleDelete(row._id,row.imageUrl)}>Xóa</a>
          </>,
        }
      ];
    
    const handleFilter = (e) =>{
        const newData = banners.filter(row =>{
          return row.textHighLight.toLowerCase().includes(e.target.value.toLowerCase());
        })
        setRecords(newData);
      }
    const handleDelete = (id,img) =>{
        console.log(id,img);
        setIdBanner(id);
        setImageUrl(img)
        setDeleteDialog(true);
      }
    return ( 
        <div className="row mb-4">
            <div className="col-12">
                <div className="title-table">
                <h5 className="mb-2 upcase">Danh Sách Banner</h5>
                <Link to='/admin/banner/add' className="btn btn-primary"><i className='bx bx-image-add'></i>Thêm</Link>
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
            {deleteDialog && (
              <DeleteDialog
                id={idBanner}
                setDeleteDialog={setDeleteDialog}
                data={records}
                setData={setRecords}
                imageUrl={imageUrl}
                api_request={api_delete}
              />
            )}
        </div>
     );
}

export default BannerTable;