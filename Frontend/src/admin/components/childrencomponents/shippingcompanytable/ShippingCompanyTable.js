import axios from "axios";
import { useEffect, useState } from "react";
import { api } from "../../../../api";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { customStylesDark } from "../datatable/DatatableCustom";
import Toast from "../../../../components/toast/Toast";

function ShippingCompanyTable() {
    const [copmanies, setCompanies] = useState([]);
    const [records,setRecords] = useState([]);

    useEffect(()=>{
        axios.get(api+'/shipping-company')
        .then((response)=>{
        setCompanies(response.data);
        console.log(response.date);
        })
        .catch((err)=>{
        console.log(err);
        });
    },[]);
    
    useEffect(() => {
        setRecords(copmanies);
        }, [copmanies]);

    const columns = [
        {
            name: 'Avatar',
            cell: (row) => <div className='container-img-product'>
            <img src={row.imageUrl} className="img-product rounded float-left" alt={row.name}/>
            </div>,
        },
        {
          name: 'Company Name',
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
            <Link to={`/admin/ship-company/update/${row._id}`} 
            className="btn-update-table">Sửa</Link>
          </>,
        }
      ];
    
    const handleFilter = (e) =>{
        const newData = copmanies.filter(row =>{
          return row.name.toLowerCase().includes(e.target.value.toLowerCase());
        })
        setRecords(newData);
      }

    return ( 
        <>
            <div className="row mb-4">
                <div className="col-12">
                    <div className="title-table">
                    <h5 className="mb-2 upcase">Danh Sách Công Ty Vận Chuyển</h5>
                    <Link to='/admin/ship-company/add' className="btn btn-primary"><i className='bx bx-image-add'></i>Thêm</Link>
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

            <Toast/>
        </>
     );
}

export default ShippingCompanyTable;