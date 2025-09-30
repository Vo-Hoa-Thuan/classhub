import { useEffect, useState, useCallback } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";

import { api } from "../../../../api";
import { Link, useLocation } from "react-router-dom";
import { customStylesDark } from "../datatable/DatatableCustom";
import DeleteDialog from "../../dialogs/dialogdelete/DeleteDialog";
import moment from "moment";
import { DatePicker, Modal, Input, message } from "antd";
const api_delete = api + "/blog/delete/";

function BlogTable() {
  const { RangePicker } = DatePicker;
  const location = useLocation();
  const [blogs, setBlogs] = useState([]);
  const [records, setRecords] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [idBlog, setIdBlog] = useState();
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [rangerDate, setRangerDate] = useState();
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'pending'
  const [approvalModal, setApprovalModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [blogCounts, setBlogCounts] = useState({
    all: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });
  const [token] = useState(() => {
    const data = localStorage.getItem('accessToken');
    return data ? data : '';
  });

  // Kiểm tra URL và tự động chuyển sang tab pending nếu là route blog-approval
  useEffect(() => {
    if (location.pathname === '/admin/blog-approval') {
      setActiveTab('pending');
    }
  }, [location.pathname]);

  // Debug: Kiểm tra quyền admin
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('Current user:', user);
    console.log('User role:', user.role);
    console.log('User permissions:', user.permissions);
    console.log('Can approve posts:', user.permissions?.canApprovePosts);
    console.log('Is admin:', user.admin);
  }, []);

  const fetchAllBlogs = useCallback(() => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    axios
      .get(api + "/blog/admin/all", { headers })
      .then((response) => {
        const data = Array.isArray(response.data) ? response.data : [];
        setBlogs(data);
        setRecords(data);
        
        // Tính toán số lượng theo trạng thái
        const counts = {
          all: data.length,
          pending: data.filter(blog => blog.approvalStatus === 'pending').length,
          approved: data.filter(blog => blog.approvalStatus === 'approved').length,
          rejected: data.filter(blog => blog.approvalStatus === 'rejected').length
        };
        setBlogCounts(counts);
      })
      .catch((err) => {
        console.log(err);
        setBlogs([]);
        setRecords([]);
        setBlogCounts({ all: 0, pending: 0, approved: 0, rejected: 0 });
      });
  }, [token]);

  useEffect(() => {
    fetchAllBlogs();
  }, [fetchAllBlogs]);

  // Update records when activeTab changes
  useEffect(() => {
    if (activeTab === 'all') {
      setRecords(Array.isArray(blogs) ? blogs : []);
    } else if (activeTab === 'pending') {
      // Lọc bài viết chờ duyệt từ danh sách tất cả bài viết
      const pendingData = Array.isArray(blogs) ? blogs.filter(blog => blog.approvalStatus === 'pending') : [];
      setRecords(pendingData);
    }
  }, [activeTab, blogs]);

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
      name: "Trạng thái duyệt",
      cell: (row) => {
        const status = row.approvalStatus || 'pending';
        const statusMap = {
          'pending': { text: 'Chờ duyệt', class: 'badge-warning' },
          'approved': { text: 'Đã duyệt', class: 'badge-success' },
          'rejected': { text: 'Bị từ chối', class: 'badge-danger' }
        };
        const statusInfo = statusMap[status] || statusMap['pending'];
        return (
          <span className={`badge ${statusInfo.class}`}>
            {statusInfo.text}
          </span>
        );
      },
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
          {/* Nút duyệt/từ chối chỉ hiển thị cho bài viết chờ duyệt */}
          {row.approvalStatus === 'pending' && (
            <>
              {" "}|{" "}
              <a
                href="#home"
                className="btn-success-table"
                onClick={() => handleApprove(row._id)}
                style={{ color: 'green', textDecoration: 'none' }}
              >
                Duyệt
              </a>{" "}
              |{" "}
              <a
                href="#home"
                className="btn-danger-table"
                onClick={() => handleReject(row)}
                style={{ color: 'red', textDecoration: 'none' }}
              >
                Từ chối
              </a>
            </>
          )}
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

  const handleApprove = async (blogId) => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
      
      await axios.put(
        `${api}/blog/admin/approve/${blogId}`,
        { action: 'approve' },
        { headers }
      );
      
      message.success('Duyệt bài viết thành công!');
      fetchAllBlogs();
    } catch (error) {
      console.error('Error approving blog:', error);
      message.error('Có lỗi xảy ra khi duyệt bài viết!');
    }
  };

  const handleReject = (blog) => {
    setSelectedBlog(blog);
    setRejectionReason('');
    setApprovalModal(true);
  };

  const handleRejectConfirm = async () => {
    if (!rejectionReason.trim()) {
      message.warning('Vui lòng nhập lý do từ chối!');
      return;
    }

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
      
      await axios.put(
        `${api}/blog/admin/approve/${selectedBlog._id}`,
        { 
          action: 'reject',
          rejectionReason: rejectionReason.trim()
        },
        { headers }
      );
      
      message.success('Từ chối bài viết thành công!');
      setApprovalModal(false);
      setSelectedBlog(null);
      setRejectionReason('');
      fetchAllBlogs();
    } catch (error) {
      console.error('Error rejecting blog:', error);
      message.error('Có lỗi xảy ra khi từ chối bài viết!');
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Không cần refresh data vì đã có useEffect xử lý
  };

  return (
    <div className="row mb-4">
      <div className="col-12">
        <div className="title-table">
          <h5 className="mb-2 upcase">Danh Sách Bài Viết</h5>
          <Link to="/admin/blog/add" className="btn btn-primary">
            <i className="bx bx-image-add"></i>Thêm
          </Link>
          
          {/* Tabs */}
          <div className="mt-3">
            <ul className="nav nav-tabs" id="blogTabs" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'all' ? 'active' : ''}`}
                  onClick={() => handleTabChange('all')}
                  type="button"
                >
                  Tất cả bài viết ({blogCounts.all})
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'pending' ? 'active' : ''}`}
                  onClick={() => handleTabChange('pending')}
                  type="button"
                >
                  Chờ duyệt ({blogCounts.pending})
                </button>
              </li>
            </ul>
          </div>
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
          data={Array.isArray(records) ? records : []}
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

      {/* Modal từ chối bài viết */}
      <Modal
        title="Từ chối bài viết"
        open={approvalModal}
        onOk={handleRejectConfirm}
        onCancel={() => {
          setApprovalModal(false);
          setSelectedBlog(null);
          setRejectionReason('');
        }}
        okText="Từ chối"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
      >
        {selectedBlog && (
          <div>
            <p><strong>Tiêu đề:</strong> {selectedBlog.title}</p>
            <p><strong>Tác giả:</strong> {selectedBlog.author?.fullname || 'N/A'}</p>
            <p><strong>Ngày tạo:</strong> {moment(selectedBlog.createdAt).format('DD/MM/YYYY HH:mm')}</p>
            <div className="mt-3">
              <label><strong>Lý do từ chối:</strong></label>
              <Input.TextArea
                rows={4}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Nhập lý do từ chối bài viết..."
                maxLength={500}
                showCount
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default BlogTable;
