import React from "react";
import "./Cart.css";
import Button from "../Button/Button";
function Cart({ cartItems, onCheckout }) {
  const totalPrice = cartItems.reduce((a, c) => a + c.price * c.quantity, 0);

  return (
    <div className="cart__container">
      {cartItems.length === 0 ? " لا توجد طلبات" : ""}
      <br /> <span className="">المجموع :  د {totalPrice.toFixed(2)}</span>
      <Button
        title={`${cartItems.length === 0 ? "الطلب !" : "ارسال الطلب"} `}
        type={"checkout"}
        disable={cartItems.length === 0 ? true : false}
        onClick={onCheckout}
      />
    </div>
  );
}

export default Cart;
