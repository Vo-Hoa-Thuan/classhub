import { Link, useNavigate, useParams } from "react-router-dom";
import DefaultLayout from "../../layout/default/DefaultLayout";
import { useEffect, useState } from "react";
import Toast from "../../../../components/toast/Toast";
import axios from "axios";
import { api } from "../../../../api";
import moment from "moment";

function DetailDownloadApp() {
  const { id } = useParams();
  const [order, setOrder] = useState([]);
  const [token, setToken] = useState(() => {
    const data = localStorage.getItem("token");
    return data ? data : "";
  });
  const headers = {
    token: `Bearer ${token}`,
  };
  useEffect(() => {
    axios
      .get(api + `/order-app/${id}`, { headers })
      .then((response) => {
        setOrder(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <DefaultLayout>
      <div className="container-fluid pt-4 px-4">
        <div className="row">
          <div className="col-lg-12">
            <div className="card mb-4">
              <div className="card-body">
                <h4 className="mb-4">Chi Tiết Đơn Hàng</h4>
                <div className="mb-3 d-flex justify-content-between">
                  <div>
                    <span className="me-3">ID: #{order._id}</span>
                    <span className="me-3">
                      Thời gian:{" "}
                      {moment(order.createdAt).format("HH:mm, DD/MM/YYYY")}
                    </span>
                  </div>
                </div>
                <table className="table table-borderless">
                  <tbody>
                  <tr>
                      <td>
                      <p>Thông tin khách hàng</p>
                        <div className="d-flex mb-2">
                          <div className="flex-shrink-0">
                            <b>{order.user && order.user.fullname}</b><br></br>
                            <p>{order.user && order.user.email}</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="d-flex mb-2">
                          <div className="flex-shrink-0">
                            <img
                              src={order.product && order.product.imageUrl}
                              alt=""
                              style={{ width: "75px" }}
                              className="img-fluid"
                            />
                          </div>
                          <div className="flex-lg-grow-1 ms-3">
                            <h6 className="small mb-0">
                              <b className="text-dark">
                                {order.product && order.product.name}
                              </b>
                            </h6>
                          </div>
                        </div>
                      </td>
                      <td>Giá:</td>
                      <td className="text-end">
                        {order.price && order.price.toLocaleString("vi-VN")}đ
                      </td>
                    </tr>
                  </tbody>
                  <tfoot style={{ borderTop: "1px solid #000" }}>
                    <tr>
                      <td colspan="2">Giảm giá</td>
                      <td className="text-danger text-end">-0</td>
                    </tr>
                    <tr className="fw-bold">
                      <td colspan="2">Tổng tiền</td>
                      <td className="text-end">
                        {order.price &&
                          parseInt(order.price).toLocaleString("vi-VN")}
                        đ
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="card-body">
                <h3 className="h6">Hình thức thanh toán</h3>
                {order.payment && order.payment && (
                  <p>
                    <img
                      src={order.payment && order.payment.imageUrl}
                      alt={order.payment && order.payment.name}
                      style={{ width: "100px" }}
                    />
                    <br />
                    Thanh toán: {parseInt(order.price).toLocaleString("vi-VN")}đ
                    {order.paymentStatus ? (
                      <span className="badge bg-success rounded-pill">
                        Đã trả
                      </span>
                    ) : (
                      <span className="badge bg-danger rounded-pill">
                        Chưa thanh toán
                      </span>
                    )}
                  </p>
                )}
              </div>
            </div>
            <Link to="/admin/download-app" className="btn btn-secondary">
              Quay lại
            </Link>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}

export default DetailDownloadApp;
