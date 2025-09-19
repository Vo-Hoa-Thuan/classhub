import axios from "axios";
import { useEffect, useState } from "react";
import { api } from "../../../../api";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { customStylesDark } from "../datatable/DatatableCustom";
import Toast from "../../../../components/toast/Toast";

function PaymentTable() {
    const [payments, setPayments] = useState([]);
    const [records,setRecords] = useState([]);
    const [token,setToken] = useState(() => {
    const data = localStorage.getItem('token');
    return data ? data : '';
  });
    const headers = {
      token: `Bearer ${token}`,
      };

    useEffect(()=>{
        axios.get(api+'/payment',{headers})
        .then((response)=>{
        console.log(response.data);
        setPayments(response.data);
        })
        .catch((err)=>{
        console.log(err);
        });
    },[]);
    
    useEffect(() => {
        setRecords(payments);
        }, [payments]);

    const columns = [
        {
            name: 'Avatar',
            cell: (row) => <div className='container-img-product'>
            <img src={row.imageUrl} className="img-product rounded float-left" alt={row.name}/>
            </div>
        },
        {
          name: 'Payment Name',
          selector: row => row.name,
          sortable: true,
        },
        {
          name: 'Payment Type',
          selector: row => row.isbank,
          cell: row => <>
                   {row.isbank ? <b>Ngân hàng</b> : <b>Ví điện tử</b>}
            </>,
          sortable: true,
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
            <Link to={`/admin/payment/update/${row._id}`} 
            className="btn-update-table">Sửa</Link>
          </>,
        }
      ];
    
    const handleFilter = (e) =>{
        const newData = payments.filter(row =>{
          return row.name.toLowerCase().includes(e.target.value.toLowerCase());
        })
        setRecords(newData);
      }

    return ( 
        <>
            <div className="row mb-4">
                <div className="col-12">
                    <div className="title-table">
                    <h5 className="mb-2 upcase">Danh Sách Hình Thức Thanh Toán</h5>
                    <Link to='/admin/payment/add' className="btn btn-primary"><i className='bx bx-image-add'></i>Thêm</Link>
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

export default PaymentTable;

// name
// apiKey
// apiSecret
// urlAPI
// imageUrl
// webUrl
// desc
// isbank
// status