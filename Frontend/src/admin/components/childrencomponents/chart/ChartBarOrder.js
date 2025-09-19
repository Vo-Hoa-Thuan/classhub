import React, { useEffect, useState } from 'react';
import {Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { api } from '../../../../api';
import moment from 'moment';
import './chartstyle.scss'
ChartJS.register(
    BarElement, 
    CategoryScale, 
    LinearScale, 
    Tooltip, 
    Legend
)

function ChartBarOrder() {
    const [orders, setOrders] = useState([]);
    const [next, setNext] = useState(false);
    const [token,setToken] = useState(() => {
        const data = localStorage.getItem('token');
        return data ? data : '';
      });
     const headers = {
        token: `Bearer ${token}`,
        };
  
      useEffect(()=>{
          axios.get(api+'/order',{headers})
          .then((response)=>{
          setOrders(response.data)
          })
          .catch((err)=>{
          console.log(err);
      });
      },[]);

    const handleNextChart = (e)=>{
      e.preventDefault();
      setNext(!next);
    }
    const data = {
        labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
        datasets: [
            {
                label: 'Đơn Thành Công',
                data: [
                    orders.filter((order) => (moment(order.createdAt).month() === 0 & order.status===true)).length,
                    orders.filter((order) => (moment(order.createdAt).month() === 1 & order.orderTracking===6)).length,
                    orders.filter((order) => (moment(order.createdAt).month() === 2 & order.orderTracking===6)).length,
                    orders.filter((order) => (moment(order.createdAt).month() === 3 & order.orderTracking===6)).length,
                    orders.filter((order) => (moment(order.createdAt).month() === 4 & order.orderTracking===6)).length,
                    orders.filter((order) => (moment(order.createdAt).month() === 5 & order.orderTracking===6)).length,
                ],
                borderColor: '#36A2EB',
                backgroundColor: '#32CD32',
              },
              {
                label: 'Đơn Hủy',
                data: [
                    orders.filter((order) => (moment(order.createdAt).month() === 0 & order.orderTracking===20 || order.orderTracking===21)).length,
                    orders.filter((order) => (moment(order.createdAt).month() === 1 & order.orderTracking===20 || order.orderTracking===21)).length,
                    orders.filter((order) => (moment(order.createdAt).month() === 2 & order.orderTracking===20 || order.orderTracking===21)).length,
                    orders.filter((order) => (moment(order.createdAt).month() === 3 & order.orderTracking===20 || order.orderTracking===21)).length,
                    orders.filter((order) => (moment(order.createdAt).month() === 4 & order.orderTracking===20 || order.orderTracking===21)).length,
                    orders.filter((order) => (moment(order.createdAt).month() === 5 & order.orderTracking===20 || order.orderTracking===21)).length,
                ],
                borderColor: '#FF6384',
                backgroundColor: '#FF0000',
              },
              {
                label: 'Tổng đơn',
                data: [
                    orders.filter((order) => (moment(order.createdAt).month() === 0)).length,
                    orders.filter((order) => (moment(order.createdAt).month() === 1)).length,
                    orders.filter((order) => (moment(order.createdAt).month() === 2)).length,
                    orders.filter((order) => (moment(order.createdAt).month() === 3)).length,
                    orders.filter((order) => (moment(order.createdAt).month() === 4)).length,
                    orders.filter((order) => (moment(order.createdAt).month() === 5)).length,
                ],
                borderColor: '#FF6384',
                backgroundColor: '#4169E1',
              },
        ]
      };
    const dataNext = {
        labels: ['Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
        datasets: [
            {
                label: 'Đơn Thành Công',
                data: [
                    orders.filter((order) => (moment(order.createdAt).month() === 6 & order.status===true)).length,
                    orders.filter((order) => (moment(order.createdAt).month() === 7 & order.orderTracking===6)).length,
                    orders.filter((order) => (moment(order.createdAt).month() === 8 & order.orderTracking===6)).length,
                    orders.filter((order) => (moment(order.createdAt).month() === 9 & order.orderTracking===6)).length,
                    orders.filter((order) => (moment(order.createdAt).month() === 10 & order.orderTracking===6)).length,
                    orders.filter((order) => (moment(order.createdAt).month() === 11 & order.orderTracking===6)).length,
                ],
                borderColor: '#36A2EB',
                backgroundColor: '#32CD32',
              },
              {
                label: 'Đơn Hủy',
                data: [
                    orders.filter((order) => (moment(order.createdAt).month() === 6 & order.orderTracking===20 || order.orderTracking===21)).length,
                    orders.filter((order) => (moment(order.createdAt).month() === 7 & order.orderTracking===20 || order.orderTracking===21)).length,
                    orders.filter((order) => (moment(order.createdAt).month() === 8 & order.orderTracking===20 || order.orderTracking===21)).length,
                    orders.filter((order) => (moment(order.createdAt).month() === 9 & order.orderTracking===20 || order.orderTracking===21)).length,
                    orders.filter((order) => (moment(order.createdAt).month() === 10 & order.orderTracking===20 || order.orderTracking===21)).length,
                    orders.filter((order) => (moment(order.createdAt).month() === 11 & order.orderTracking===20 || order.orderTracking===21)).length,
                ],
                borderColor: '#FF6384',
                backgroundColor: '#FF0000',
              },
              {
                label: 'Tổng đơn',
                data: [
                    orders.filter((order) => (moment(order.createdAt).month() === 6)).length,
                    orders.filter((order) => (moment(order.createdAt).month() === 7)).length,
                    orders.filter((order) => (moment(order.createdAt).month() === 8)).length,
                    orders.filter((order) => (moment(order.createdAt).month() === 9)).length,
                    orders.filter((order) => (moment(order.createdAt).month() === 10)).length,
                    orders.filter((order) => (moment(order.createdAt).month() === 11)).length,
                ],
                borderColor: '#FF6384',
                backgroundColor: '#4169E1',
              },
        ]
      };
      const options = {

      }
  return (
    <div>
      <div>
        <Bar
            data={next ? dataNext : data}
            options={options}
        />
      </div>
      <div className='action-chart'>
      {next ? 
      <button onClick={handleNextChart}>Xem 1 - 6</button>
      :
      <button onClick={handleNextChart}>Xem 7 - 12</button>
      }
      </div>
    </div>
  );
}

export default ChartBarOrder;