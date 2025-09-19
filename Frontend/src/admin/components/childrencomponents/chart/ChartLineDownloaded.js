import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title } from 'chart.js';
import axios from 'axios';
import { api } from '../../../../api';
import moment from 'moment';

ChartJS.register(LineElement, PointElement, LinearScale, Title);


function ChartLineDownloaded() {
    const [ordersApp, setOrdersApp] = useState([]);
    const [next, setNext] = useState(false);
    const [token,setToken] = useState(() => {
        const data = localStorage.getItem('token');
        return data ? data : '';
      });
     const headers = {
        token: `Bearer ${token}`,
        };
  
      useEffect(()=>{
          axios.get(api+'/order-app',{headers})
          .then((response)=>{
            console.log(response.data);
          setOrdersApp(response.data)
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
                label: 'Lượt tải',
                data: [
                  ordersApp.filter((order) => (moment(order.createdAt).month() === 0)).length,
                  ordersApp.filter((order) => (moment(order.createdAt).month() === 1)).length,
                  ordersApp.filter((order) => (moment(order.createdAt).month() === 2)).length,
                  ordersApp.filter((order) => (moment(order.createdAt).month() === 3)).length,
                  ordersApp.filter((order) => (moment(order.createdAt).month() === 4)).length,
                  ordersApp.filter((order) => (moment(order.createdAt).month() === 5)).length,
                ],
                borderColor: '#36A2EB',
                backgroundColor: '#32CD32',
              }
        ]
      };
    const dataNext = {
      labels: ['Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
      datasets: [
          {
              label: 'Lượt tải',
              data: [
                ordersApp.filter((order) => (moment(order.createdAt).month() === 6)).length,
                ordersApp.filter((order) => (moment(order.createdAt).month() === 7)).length,
                ordersApp.filter((order) => (moment(order.createdAt).month() === 8)).length,
                ordersApp.filter((order) => (moment(order.createdAt).month() === 9)).length,
                ordersApp.filter((order) => (moment(order.createdAt).month() === 10)).length,
                ordersApp.filter((order) => (moment(order.createdAt).month() === 11)).length,
              ],
              borderColor: '#36A2EB',
              backgroundColor: '#32CD32',
            }
      ]
    };
      const options = {

      }
  return (
    <div>
      <div>
        <Line
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

export default ChartLineDownloaded;