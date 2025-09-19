import { useEffect, useState } from "react";
import OrderTable from "../../childrencomponents/ordertable/OrderTable";
import DefaultLayout from "../../layout/default/DefaultLayout";
import axios from "axios";
import { api } from "../../../../api";

function Orders() {
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
            setOrders(sortedOrders);
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

export default Orders;