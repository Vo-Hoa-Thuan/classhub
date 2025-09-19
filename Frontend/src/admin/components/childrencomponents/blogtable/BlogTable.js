import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";

import { api } from "../../../../api";
import { Link } from "react-router-dom";
import { customStylesDark } from "../datatable/DatatableCustom";
import DeleteDialog from "../../dialogs/dialogdelete/DeleteDialog";
import moment from "moment";
import { DatePicker } from "antd";
const api_delete = api + "/blog/delete/";

function BlogTable() {
  const { RangePicker } = DatePicker;
  const [blogs, setBlogs] = useState([]);
  const [records, setRecords] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [idBlog, setIdBlog] = useState();
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [rangerDate, setRangerDate] = useState();

  useEffect(() => {
    axios
      .get(api + "/blog")
      .then((response) => {
        setBlogs(response.data);
        setRecords(response.data);
        console.log(blogs);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const columns = [
    {
      name: "Image",
      cell: (row) => (
        <div className="container-img-product" style={{ width: "80px" }}>
          <img
            src={row.imageUrl}
            className="img-product rounded float-left"
            alt={row.name}
          />
        </div>
      ),
    },
    {
      name: "Tên bài viết",
      selector: (row) => row.title,
      sortable: true,
    },
    {
      name: "Topic",
      selector: (row) => (row.topic ? row.topic.title : null),
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      cell: (row) => (
        <>
          <button className={`toggle-btn ${row.status ? "active" : ""}`}>
            <div className="slider"></div>
          </button>
        </>
      ),
      sortable: true,
    },
    {
      name: "Ngày đăng",
      cell: (row) => <b>{moment(row.createdAt).format("HH:mm, DD/MM/YYYY")}</b>,
      selector: (row) => row.createdAt,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <Link
            to={`/admin/blog/update/${row._id}`}
            className="btn-update-table"
          >
            Sửa
          </Link>{" "}
          |
          <a
            href="#home"
            className="btn-delete-table"
            onClick={() => handleDelete(row._id, row.imageUrl)}
          >
            Xóa
          </a>
        </>
      ),
    },
  ];

  const handleFilter = (e) => {
    const newData = blogs.filter((row) => {
      return row.title.toLowerCase().includes(e.target.value.toLowerCase());
    });
    setRecords(newData);
  };
  const handleDelete = (id, img) => {
    console.log(id, img);
    setIdBlog(id);
    setImageUrl(img);
    setDeleteDialog(true);
  };
  const handleFilterByDate = () => {
    if (!!rangerDate) {
      let middle = [];
      const startDate = new Date(rangerDate[0]);
      const endDate = new Date(rangerDate[1]);
      for (var i = 0; i < blogs.length; i++) {
        const date = new Date(blogs[i].createdAt);
        if (startDate <= date && date <= endDate) {
          middle.push(blogs[i]);
        }
      }
      setRecords(middle);
    } else {
      setRecords(blogs);
    }
  };

  return (
    <div className="row mb-4">
      <div className="col-12">
        <div className="title-table">
          <h5 className="mb-2 upcase">Danh Sách Bài Viết</h5>
          <Link to="/admin/blog/add" className="btn btn-primary">
            <i className="bx bx-image-add"></i>Thêm
          </Link>
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
                className="input-search-tb"
                placeholder="Tìm theo title..."
                type="text"
                onChange={handleFilter}
              />
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
      {deleteDialog && (
        <DeleteDialog
          id={idBlog}
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

export default BlogTable;
