import { createContext, useEffect, useState } from "react";
import { getCartLocalStorage } from "./CartLocalStorage";

const CartCountContext = createContext();

function CartCountProvider({children}) {
    const [cartCount, setCartCount] = useState(0);
    const [cart, setCart] = useState(() => {
      const cartData = getCartLocalStorage();
      return cartData ? cartData : [];
    });
      useEffect(()=>{
        setCartCount(cart.length);
      },[cart]);

    const cartCountUp = () => {
        setCartCount(prev => prev + 1);
      }
    const cartCountContext = {
        cartCount,
        cartCountUp,
        setCartCount,
        setCart
    }
return (
    <CartCountContext.Provider value={cartCountContext}>
    {children}
    </CartCountContext.Provider>
)
}

export {CartCountContext, CartCountProvider}