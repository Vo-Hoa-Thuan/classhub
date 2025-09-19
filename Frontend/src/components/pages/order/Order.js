import { useEffect } from "react";
import OrderList from "../../childrencomponents/orderlist/OrderList";
import Default from "../../layout/default/Default";
import { useNavigate } from "react-router-dom";

function Order() {
    const navigate = useNavigate();
    useEffect(()=>{
        const user = localStorage.getItem('user');
        if(!user){
            navigate('/404-page');
    }},[]);
    return ( 
        <Default>
            <OrderList/>
        </Default>
     );
}

export default Order;