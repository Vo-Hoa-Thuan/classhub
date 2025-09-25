import axios from "axios";
import { useEffect, useState } from "react";
import { api } from "../../../../api";
import moment from "moment";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { customStylesDark } from "../datatable/DatatableCustom";
import { ExportXLSFromJson } from "../../../../components/exportjson/ExportJson";
import { DatePicker, Modal, Button } from "antd";

function DownloadAppTable() {
  const { RangePicker } = DatePicker;
  const [ordersApp, setOrdersApp] = useState();
  const [records, setRecords] = useState([]);
  const [rangerDate, setRangerDate] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(() => {
    const data = localStorage.getItem("token");
    return data ? data : "";
  });
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    axios
      .get(api + "/order-app", { headers })
      .then((response) => {
        console.log("Full response:", response);
        console.log("Response data:", response.data);
        console.log("Response data.data:", response.data.data);
        setOrdersApp(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    console.log("ordersApp state:", ordersApp);
    console.log("ordersApp length:", ordersApp?.length);
    setRecords(ordersApp);
  }, [ordersApp]);

  const columns = [
    {
      name: "Người tải",
      selector: (row) => row.user?.fullname || "N/A",
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.user?.email || "N/A",
      sortable: true,
    },
    {
      name: "Tổng tiền",
      selector: (row) => row.price && row.price.toLocaleString("vi-VN") + " đ",
      sortable: true,
    },
    {
      name: "Trạng thái",
      selector: (row) => row.position,
      cell: (row) => (
        <>
          <b>{row.paymentStatus ? "Đã thanh toán" : "Chưa thanh toán"}</b>
        </>
      ),
      sortable: true,
    },
    {
      name: "Date",
      cell: (row) => <b>{moment(row.createdAt).format("HH:mm, DD/MM/YYYY")}</b>,
      selector: (row) => row.createdAt,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <Link
            to={`/admin/detail-download-app/${row._id}`}
            className="btn-update-table"
          >
            Xem
          </Link>
          {" | "}
          <a 
            href="#home" 
            className="btn-delete-table" 
            onClick={(e) => {
              e.preventDefault();
              handleDelete(row._id);
            }}
          >
            Xóa
          </a>
        </>
      ),
    },
  ];

  const handleFilter = (e) => {
    const newData = ordersApp.filter((row) => {
      return (row.user?.email || "").toLowerCase().includes(e.target.value.toLowerCase());
    });
    setRecords(newData);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa đơn hàng này?")) {
      try {
        await axios.delete(api + `/order-app/delete/${id}`, { headers });
        // Cập nhật lại danh sách sau khi xóa
        const updatedOrders = ordersApp.filter(order => order._id !== id);
        setOrdersApp(updatedOrders);
        setRecords(updatedOrders);
        alert("Xóa thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa:", error);
        alert("Có lỗi xảy ra khi xóa!");
      }
    }
  };

  const handleExportCSV = () => {
    let listDL = [];
    for (var i = 0; i < ordersApp.length; i++) {
      const item = {
        id: ordersApp[i]._id,
        userName: ordersApp[i].user?.fullname || "N/A",
        email: ordersApp[i].user?.email || "N/A",
        app: ordersApp[i].product.name,
        total: ordersApp[i].price,
        payment: ordersApp[i].payment && ordersApp[i].payment.name,
        paymentStatus: ordersApp[i].paymentStatus
          ? "Đã thanh toán"
          : "Chưa thanh toán",
        status: ordersApp[i].status ? "Đã tải xuống" : "Chưa tải xuống",
        createAT: moment(ordersApp[i].createdAt).format("DD/MM/YYYY HH:mm"),
      };
      listDL.push(item);
    }
    ExportXLSFromJson(listDL, "downloaded_list");
  };
  const handleFilterByDate = () => {
    if (!!rangerDate) {
      let middle = [];
      const startDate = new Date(rangerDate[0]);
      const endDate = new Date(rangerDate[1]);
      for (var i = 0; i < ordersApp.length; i++) {
        const date = new Date(ordersApp[i].createdAt);
        if (startDate <= date && date <= endDate) {
          middle.push(ordersApp[i]);
        }
      }
      setRecords(middle);
    } else {
      setRecords(ordersApp);
    }
  };
  const handleBtnExportCSV = (rangDate) => {
    if (!!rangDate) {
      setLoading(true);
      let middle = [];
      const startDate = new Date(rangerDate[0]);
      const endDate = new Date(rangerDate[1]);
      for (var i = 0; i < ordersApp.length; i++) {
        const date = new Date(ordersApp[i].createdAt);
        if (startDate <= date && date <= endDate) {
          middle.push(ordersApp[i]);
        }
      }
    let listDL = [];
    for (var j = 0; j < middle.length; j++) {
      const item = {
        id: middle[j]._id,
        userName: middle[j].user?.fullname || "N/A",
        email: middle[j].user?.email || "N/A",
        app: middle[j].product.name,
        total: middle[j].price,
        payment: middle[j].payment && middle[j].payment.name,
        paymentStatus: middle[j].paymentStatus
          ? "Đã thanh toán"
          : "Chưa thanh toán",
        status: middle[j].status ? "Đã tải xuống" : "Chưa tải xuống",
        createAT: moment(middle[j].createdAt).format("DD/MM/YYYY HH:mm"),
      };
      listDL.push(item);
    }
    setLoading(false);
    ExportXLSFromJson(listDL, "downloaded_list_by_date");
    } else {
      setLoading(false);
      handleExportCSV();
      setLoading(true);
    }
  };
  return (
    <>
      <div className="row mb-4">
        <div className="col-12">
          <div className="title-table">
            <h5 className="mb-2 upcase">Lượt Tải Xuống</h5>
            {/* <Link to='/admin/banner/add' className="btn btn-primary"><i className='bx bx-image-add'></i>Thêm</Link> */}
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
              className="btn btn-success m-1"
            >
              <i class="fa-solid fa-file-excel"></i> Xuất Toàn Bộ Đơn Hàng
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default DownloadAppTable;
