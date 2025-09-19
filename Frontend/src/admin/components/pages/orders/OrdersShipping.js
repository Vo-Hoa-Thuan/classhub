import axios from "axios";
import { useEffect, useState } from "react";
import { api } from "../../../../api";
import DefaultLayout from "../../layout/default/DefaultLayout";
import OrderTable from "../../childrencomponents/ordertable/OrderTable";

function OrdersShipping() {
    const [orders, setOrders] = useState([]);
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
            console.log(response.data);
            const sortedOrders = response.data.sort((a, b) => {
                return new Date(b.createdAt) - new Date(a.createdAt);
              });
            setOrders(sortedOrders.filter((item) => item.orderTracking === 4 || item.orderTracking === 5));
            })
            .catch((err)=>{
            console.log(err);
        });
        },[]);
    return ( 
        <DefaultLayout>
            <OrderTable
                orders={orders}
            />
        </DefaultLayout>
     );
}

export default OrdersShipping;