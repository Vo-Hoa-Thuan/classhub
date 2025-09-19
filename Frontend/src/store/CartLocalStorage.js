const user = JSON.parse(localStorage.getItem('user'));
const setCartLocalStorage = (value) => {
    localStorage.setItem(`cart_${user ? user._id : ''}`,JSON.stringify(value));
}

const getCartLocalStorage = () => {
    const cart = JSON.parse(localStorage.getItem(`cart_${user ? user._id : ''}`));
    return cart;
}

export {setCartLocalStorage,getCartLocalStorage}