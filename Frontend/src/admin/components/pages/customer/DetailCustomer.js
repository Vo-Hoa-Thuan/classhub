import { Avatar, Button, Col, Layout, Row, Table } from "antd";
import "./style.css";
import {
  CardContactStyled,
  LayoutCenterStyled,
  LayoutInfoStyled,
} from "./styled";
import DefaultLayout from "../../layout/default/DefaultLayout";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { api } from "../../../../api";
import Images from "../../../../assets/img/Image";
import moment from "moment";
function DetailCustomer() {
  const { id } = useParams();
  const [customer, setCustomer] = useState();
  const [city,setCity] = useState('');
  const [appsDownloaded, setAppsDownloaded] = useState([]);
  const [token, setToken] = useState(() => {
    const data = localStorage.getItem("token");
    return data ? data : "";
  });
  const headers = {
    token: `Bearer ${token}`,
  };
  const columsDL = [
    {
      key: '1',
      dataIndex: '_id',
      title: 'Mã Đơn'
  },
  {
      key: '2',
      dataIndex: 'product',
      title: 'Tên ứng dụng',
      render: (prop)=>(
        <>
          <img src={prop.imageUrl} alt="" style={{width:'60px'}}/>
          <b>{prop.name}</b>
        </>
      )
  },
  {
      key: '3',
      dataIndex: 'price',
      title: 'Giá',
      render: (prop)=>(
        <p>{prop.toLocaleString("vi-VN")} đ</p>
      )
  },
  {
      key: '4',
      dataIndex: 'paymentStatus',
      title: 'Trạng thái thanh toán',
      render: (prop)=>(
        <p>{prop ? 'Đã thanh toán':'Chưa thanh toán'}</p>
      )
  },
  {
      key: '5',
      dataIndex: 'createdAt',
      title: 'Ngày mua',
      render:(prop)=>(
        <>
          <p>{moment(prop.createdAt).format("HH:mm, DD/MM/YYYY")}</p>
        </>
      )
  },
  {
    key: '6',
    dataIndex: '_id',
    render:(prop)=>(
      <>
        <Link 
        to={`/admin/detail-download-app/${prop}`}
        className="btn-update-table"
        >Xem</Link>
      </>
    )
}
  ]
  useEffect(() => {
    axios
      .get(api + `/user/${id}`, { headers })
      .then((response) => {
        console.log(response.data);
        const address = response.data.address;
        const parts = address.split(", ");
        setCity(parts[3]);
        setCustomer(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    axios
      .get(api + `/order-app/user/${id}`, { headers })
      .then((response) => {
        const sortedList = response.data.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setAppsDownloaded(sortedList);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <DefaultLayout>
      <LayoutInfoStyled className="container">
        {/* Heading Text */}
        <Row>
          <Col span={24}>
            <LayoutCenterStyled>
              <h4>
                <b className="text-uppercase" style={{ color: "#212529" }}>
                  Thông Tin Khách Hàng
                </b>
              </h4>
            </LayoutCenterStyled>
          </Col>
        </Row>
        <Row className="mt-2">
          {/* Avatar */}
          <Col xs={24} sm={24} xl={6}>
            <LayoutCenterStyled
              style={{ backgroundColor: "#fff", width: "100%" }}
            >
              <Avatar
                shape="square"
                size={{
                  xs: 100,
                  sm: 120,
                  md: 140,
                  lg: 150,
                  xl: 160,
                  xxl: 200,
                }}
                src={
                  customer && customer.image ? customer.image : Images.default
                }
              />
              <LayoutCenterStyled
                className="text-center mt-4"
                style={{ backgroundColor: "#fff", width: "100%" }}
              >
                <h4 style={{ color: "#154398" }}>
                  <b className="text-uppercase">
                    {customer && customer.fullname}
                  </b>
                  <p
                    style={{ marginTop: "0px", padding: "0px" }}
                    className="text-des text-center"
                  >
                    {customer && moment(customer.birth).format("DD/MM/YYYY")}
                  </p>
                </h4>
              </LayoutCenterStyled>
            </LayoutCenterStyled>
          </Col>

          <Col xs={24} sm={24} md={24} lg={24} xl={18}>
            {/* Contact Details */}
            <Row className="contact-info" gutter={[16, 24]}>
              <Col className="gutter-row" xs={24} sm={12} md={12} lg={7} xl={7}>
                <CardContactStyled>
                <i class="fas fa-user"></i> {customer && customer.gender}
                </CardContactStyled>
              </Col>
              <Col className="gutter-row" xs={24} sm={12} md={12} lg={7} xl={7}>
                <CardContactStyled>
                <i class="fas fa-phone"></i> {customer && customer.phone}
                </CardContactStyled>
              </Col>
              <Col
                className="gutter-row"
                xs={24}
                sm={24}
                md={24}
                lg={10}
                xl={10}
              >
                <CardContactStyled>
                <i class="fas fa-envelope"></i> {customer && customer.email}
                </CardContactStyled>
              </Col>
              <Col
                className="gutter-row"
                xs={24}
                sm={24}
                md={24}
                lg={14}
                xl={14}
              >
                <CardContactStyled>
                <i class="fas fa-map-marker-alt"></i> {customer && customer.address}
                </CardContactStyled>
              </Col>
            </Row>
          </Col>
        </Row>
        {/* Thông tin cá nhân */}
        <h4 className="mt-4">
          <b>Thông tin cá nhân:</b>
        </h4>
        <Row className="mt-3">
          <Col xs={24} sm={24} md={24} lg={24}>
            <p>
              Hộ khẩu thường trú: <b>{customer && customer.address}</b>
            </p>
          </Col>
        </Row>
        <Row className="mt-2">
          <Col className="gutter-row" xs={24} sm={12} md={8} lg={8}>
            <div className="d-flex">
              <p>
                Căn cước công dân số: <b>030099009999</b>
              </p>
            </div>
          </Col>
          <Col className="gutter-row" xs={12} sm={12} md={8} lg={8}>
            <p>
              Cấp ngày: <b>12/05/2020</b>
            </p>
          </Col>
          <Col className="gutter-row" xs={12} sm={12} md={8} lg={8}>
            <p>
              Nơi cấp: <b>{city && city}</b>
            </p>
          </Col>
        </Row>
        <h4 className="mt-4">
          <b>ỨNG DỤNG ĐÃ TẢI XUỐNG</b>
        </h4>
        <Row>
          <Col span={24}>
            <Table
              className="table_details"
              bordered={true}
              columns={columsDL}
              dataSource={appsDownloaded}
              scroll={{
                x: 700,
              }}
            />
          </Col>
        </Row>
      </LayoutInfoStyled>
    </DefaultLayout>
  );
}

export default DetailCustomer;
