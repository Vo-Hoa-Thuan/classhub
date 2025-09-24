import axios from "axios";
import { useEffect, useState } from "react";
import { api } from "../../../../api";
import DefaultLayout from "../../layout/default/DefaultLayout";
import OrderTable from "../../childrencomponents/ordertable/OrderTable";
import usePermissions from "../../../../hooks/usePermissions";

function OrdersShipping() {
    const [orders, setOrders] = useState([]);
    const [hasError, setHasError] = useState(false);
    const { isProductManager } = usePermissions();
    const [token] = useState(() => {
        const data = localStorage.getItem('accessToken');
        return data ? data : '';
      });

    useEffect(()=>{
        const headers = {
            Authorization: `Bearer ${token}`,
        };
        axios.get(api+'/order',{headers})
            .then((response)=>{
            console.log(response.data);
            const sortedOrders = response.data.sort((a, b) => {
                return new Date(b.createdAt) - new Date(a.createdAt);
              });
            setOrders(sortedOrders.filter((item) => item.orderTracking === 4 || item.orderTracking === 5));
            })
            .catch((err)=>{
            console.log('Error fetching orders in OrdersShipping:', err);
        });
        },[token]);
    return ( 
        <DefaultLayout>
            <OrderTable
                orders={orders}
            />
        </DefaultLayout>
     );
}

export default OrdersShipping;
