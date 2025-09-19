import axios from 'axios';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component'
import { api } from '../../../../api';
import { customStylesDark } from '../datatable/DatatableCustom';
import { Link } from 'react-router-dom';
import DeleteDialog from '../../dialogs/dialogdelete/DeleteDialog';
import moment from 'moment';
import { ExportXLSFromJson } from '../../../../components/exportjson/ExportJson';

function SoftwareTable() {
    const [data,setData] = useState([]);
    const [records,setRecords] = useState([]);
    const [deleteDialog,setDeleteDialog] = useState(false);
    const [idProduct,setIdProduct] = useState('');
    const [imageUrl,setImageUrl] = useState('');
    const api_delete = api+'/product/delete/'

    const columns = [
        {
            name: 'Image',
            sortable: true,
            cell: (row) => <div className='container-img-product'>
            <img src={row.imageUrl} className="img-product rounded float-left" alt={row.name}/>
            </div>,
        },
        {
          name: 'Name',
          selector: row => row.name,
          sortable: true,
        },
        {
          name: 'Price',
          cell: row => <>
            {row.price ? <b>{row.price.toLocaleString('vi-VN')}₫</b> : null}
          </>,
          selector: row => row.price,
          sortable: true
        },
        {
            name: 'Downloaded',
            selector: row => row.purchased,
            sortable: true
        },
        {
          name: 'Action',
          cell: (row) => <>
            <Link to={`/admin/product/update/${row._id}`} 
            className="btn-update-table" 
            >Sửa</Link> | 
            <a href="#home" 
            className="btn-delete-table" 
            onClick={() => handleDelete(row._id,row.imageUrl)}>Xóa</a>
          </>,
        }
      ];
    useEffect(() => {
    axios.get(api+'/product')
    .then((response)=>{
        const filteredData = response.data.filter(product => product.software === true);
        setData(filteredData);
    })
    .catch((err)=>{
      console.log(err);
    });
    },[]);

useEffect(() => {
  setRecords(data);
}, [data]);

      const handleFilter = (e) =>{
        const newData = data.filter(row =>{
          return row.name.toLowerCase().includes(e.target.value.toLowerCase());
        })
        setRecords(newData);
      }
    
      const handleDelete = (id,img) =>{
        console.log(id);
        setIdProduct(id);
        setImageUrl(img);
        setDeleteDialog(true);
      }
      const handleExportCSV = ()=>{
        let listProduct = [];
      for (var i = 0; i < data.length; i++){
        const item = {
          id: data[i]._id,
          name: data[i].name,
          downloaded: data[i].purchased,
          price: data[i].price,
          saleOff: data[i].saleOff,
          createAt: moment(data[i].createdAt).format('DD/MM/YYYY HH:mm')
        }
        listProduct.push(item);
      }
      ExportXLSFromJson(
        listProduct,
        'app_list'
      )}
    return ( 
        <div className="row mb-4">
            <div className="col-12">
                <div className="title-table">
                <h5 className="mb-2 upcase">Danh Sách Phần Mềm</h5>
                <Link to='/admin/product/add' className="btn btn-primary"><i className='bx bx-image-add'></i>Thêm</Link>
                <div className='text-end'>
                    <input className="input-search-tb mr-2" placeholder='Tìm theo tên...' type='text' onChange={handleFilter}/>
                    <button onClick={handleExportCSV} className="btn btn-success">
                    <i class="fa-solid fa-file-excel"></i> Xuất file Excel
                    </button>
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
                id={idProduct}
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

export default SoftwareTable;