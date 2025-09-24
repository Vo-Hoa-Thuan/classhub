import { getUser, safeSetJSON, safeGetJSON } from '../utils/localStorage';

const setCartLocalStorage = (value) => {
    const user = getUser();
    const userId = user ? user._id : '';
    safeSetJSON(`cart_${userId}`, value);
}

const getCartLocalStorage = () => {
    const user = getUser();
    const userId = user ? user._id : '';
    return safeGetJSON(`cart_${userId}`, []);
}

export {setCartLocalStorage,getCartLocalStorage}
