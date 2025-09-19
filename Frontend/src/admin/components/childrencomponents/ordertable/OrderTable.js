import axios from "axios";
import { useEffect, useState } from "react";
import { api } from "../../../../api";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { customStylesDark } from "../datatable/DatatableCustom";
import moment from "moment";
import { ExportXLSFromJson } from "../../../../components/exportjson/ExportJson";
import { DatePicker, Modal, Button } from "antd";

function OrderTable({ orders }) {
  const { RangePicker } = DatePicker;
  const [orderTrackings, setOrderTracking] = useState();
  const [records, setRecords] = useState([]);
  const [rangerDate, setRangerDate] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(() => {
    const data = localStorage.getItem("token");
    return data ? data : "";
  });
  const headers = {
    token: `Bearer ${token}`,
  };

  useEffect(() => {
    axios
      .get(api + "/order-tracking", { headers })
      .then((response) => {
        console.log(response.data);
        setOrderTracking(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    setRecords(orders);
  }, [orders]);

  const columns = [
    {
      name: "Người đặt",
      selector: (row) => row.userName,
      sortable: true,
    },
    {
      name: "Phone",
      selector: (row) => row.phone,
      sortable: true,
    },
    {
      name: "Tổng tiền",
      selector: (row) => <>
        {row.total ? <b>{parseInt(row.total).toLocaleString('vi-VN')}₫</b> : null}
      </>,
      sortable: true,
    },
    {
      name: "Trạng thái",
      selector: (row) => row.orderTracking,
      cell: (row) => (
        <>
          <b>
            {row.paymentId === null && row.orderTracking === 1
              ? "Chờ xác nhận đơn hàng"
              : orderTrackings &&
                orderTrackings.find(
                  (track) => track.codeStatus === row.orderTracking
                ).name}
          </b>
        </>
      ),
      sortable: true,
    },
    {
      name: "Ngày Mua",
      cell: (row) => <b>{moment(row.createdAt).format("HH:mm, DD/MM/YYYY")}</b>,
      selector: (row) => row.createdAt,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <Link
            to={`/admin/detail-order/${row._id}`}
            className="btn-update-table"
          >
            Xem
          </Link>
          {/* | 
            <a href="#home" 
            className="btn-delete-table" 
            onClick={() => handleDelete(row._id,row.imageUrl)}>Xóa</a> */}
        </>
      ),
    },
  ];

  const handleFilter = (e) => {
    const newData = orders.filter((row) => {
      return row.userName.toLowerCase().includes(e.target.value.toLowerCase());
    });
    setRecords(newData);
  };

  const handleExportCSV = () => {
    setLoading(true);
    let exportList = [];
    console.log(orders);
    for (var i = 0; i < orders.length; i++) {
      const productNames = orders[i].products
        .map((item) => item.product.name)
        .join(", ");
      const item = {
        id: orders[i]._id,
        userName: orders[i].userName,
        phone: orders[i].phone,
        product: productNames,
        total: orders[i].total,
        payment: orders[i].paymentId
          ? orders[i].paymentId.name
          : "Thanh toán khi nhận hàng",
        paymentStatus: orders[i].paymentStatus
          ? "Đã thanh toán"
          : "Chưa thanh toán",
        status: orders[i].status ? "Đã giao" : "Chưa giao",
        createAT: moment(orders[i].createdAt).format("DD/MM/YYYY HH:mm"),
      };
      exportList.push(item);
    }
    console.log(exportList);
    setLoading(false);
    ExportXLSFromJson(exportList, "orders_export");
  };

  const handleBtnExportCSV = (rangDate) => {
    if (!!rangDate) {
      setLoading(true);
      let middle = [];
      const startDate = new Date(rangerDate[0]);
      const endDate = new Date(rangerDate[1]);
      for (var i = 0; i < orders.length; i++) {
        const date = new Date(orders[i].createdAt);
        if (startDate <= date && date <= endDate) {
          middle.push(orders[i]);
        }
      }
      let exportList = [];
      for (var j = 0; j < middle.length; j++) {
        const productNames = middle[j].products
          .map((item) => item.product.name)
          .join(", ");
        const item = {
          id: middle[j]._id,
          userName: middle[j].userName,
          phone: middle[j].phone,
          product: productNames,
          total: middle[j].total,
          payment: middle[j].paymentId
            ? middle[j].paymentId.name
            : "Thanh toán khi nhận hàng",
          paymentStatus: middle[j].paymentStatus
            ? "Đã thanh toán"
            : "Chưa thanh toán",
          status: middle[j].status ? "Đã giao" : "Chưa giao",
          createAT: moment(middle[j].createdAt).format("DD/MM/YYYY HH:mm"),
        };
        exportList.push(item);
      }
      setLoading(false);
      console.log(exportList);
      ExportXLSFromJson(exportList, "orders_export_by_date");
    } else{
      setLoading(false)
      handleExportCSV();
      setLoading(true)
    }
  };
  const handleFilterByDate = () => {
    if (!!rangerDate) {
      let middle = [];
      const startDate = new Date(rangerDate[0]);
      const endDate = new Date(rangerDate[1]);
      for (var i = 0; i < orders.length; i++) {
        const date = new Date(orders[i].createdAt);
        if (startDate <= date && date <= endDate) {
          middle.push(orders[i]);
        }
      }
      setRecords(middle);
    } else {
      setRecords(orders);
    }
  };

  return (
    <>
      <div className="row mb-4">
        <div className="col-12">
          <div className="title-table">
            <h5 className="mb-2 upcase">Danh Sách Đơn Hàng</h5>
            <div className="text-end row">
              <div className="text-end row">
                <div className="col-lg-6">
                  <RangePicker
                    onChange={(date) => {
                      setRangerDate(date);
                    }}
                  />
                  <button
                    onClick={handleFilterByDate}
                    className="btn btn-primary m-1"
                  >
                    Lọc
                  </button>
                </div>
                <div className="col-lg-6">
                  <input
                    className="input-search-tb mr-2"
                    placeholder="Tìm theo tên..."
                    type="text"
                    onChange={handleFilter}
                  />
                  <button
                    onClick={() => setOpenModal(true)}
                    className="btn btn-success"
                  >
                    <i class="fa-solid fa-file-excel"></i> Xuất file Excel
                  </button>
                </div>
              </div>
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
      <Modal
        title="Chọn kiểu xuất file"
        open={openModal}
        onOk={() => setOpenModal(false)}
        onCancel={() => setOpenModal(false)}
      >
        <div className="row">
          <div className="col-lg-12">
            <RangePicker
              onChange={(date) => {
                setRangerDate(date);
              }}
            />

            <Button
              onClick={() => handleBtnExportCSV(rangerDate)}
              loading={loading}
              className="btn btn-success m-1"
            >
              <i class="fa-solid fa-file-excel"></i> Xuất File Theo Ngày
            </Button>
            <Button 
            onClick={handleExportCSV} 
            loading={loading}
            className="btn btn-success m-1">
              <i class="fa-solid fa-file-excel"></i> Xuất Toàn Bộ Đơn Hàng
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default OrderTable;
