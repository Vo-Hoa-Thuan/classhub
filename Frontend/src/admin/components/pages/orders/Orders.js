import { useEffect, useState } from "react";
import OrderTable from "../../childrencomponents/ordertable/OrderTable";
import DefaultLayout from "../../layout/default/DefaultLayout";
import ProtectedRoute from "../../common/ProtectedRoute";
import axios from "axios";
import { api } from "../../../../api";

function Orders() {
    const [orders, setOrders] = useState([]);
    const [token,setToken] = useState(() => {
        const data = localStorage.getItem('accessToken');
        return data ? data : '';
      });
    const headers = {
      Authorization: `Bearer ${token}`,
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
            console.log('Error fetching orders in Orders:', err);
        });
        },[]);
    return ( 
        <ProtectedRoute 
            requiredPermissions={['canConfirmOrders', 'canCancelOrders']}
            mode="any"
            customMessage="Bạn cần có quyền quản lý đơn hàng để truy cập trang này"
        >
            <DefaultLayout>
                <OrderTable
                    orders={orders}
                />
            </DefaultLayout>
        </ProtectedRoute>
     );
}

export default Orders;
