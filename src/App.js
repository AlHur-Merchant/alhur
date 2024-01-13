import { useState, useEffect } from "react";
import "./App.css";
import Card from "./Components/Card/Card";
import Footer from './Components/Footer';
import Header from './Components/Header';
import Button from "./Components/Button/Button";
const { getData } = require("./db/db");
const foods = getData();
//import { Telegram } from 'telegraf';

const tele = window.Telegram.WebApp;
//const Telegram = window.Telegram.WebApp;
function App() {
  const [cartItems, setCartItems] = useState([]);
  const [storeName, setstoreName] = useState([])
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    tele.ready();
  });

   const handlePhoneNumberChange = (e) => {
    const input = e.target.value;
    // Allow only numbers (Western and Eastern Arabic numerals) in the phone number field
    if (/^[\d٠١٢٣٤٥٦٧٨٩]*$/.test(input) || input === '') {
      setPhoneNumber(input);
    }
  };


  const onAdd = (food) => {
    const exist = cartItems.find((x) => x.id === food.id);
    if (exist) {
      setCartItems(
        cartItems.map((x) =>
          x.id === food.id ? { ...exist, quantity: exist.quantity + 1 } : x
        )
      );
    } else {
      setCartItems([...cartItems, { ...food, quantity: 1 }]);
    }
  };

  const onRemove = (food) => {
    const exist = cartItems.find((x) => x.id === food.id);
    if (exist.quantity === 1) {
      setCartItems(cartItems.filter((x) => x.id !== food.id));
    } else {
      setCartItems(
        cartItems.map((x) =>
          x.id === food.id ? { ...exist, quantity: exist.quantity - 1 } : x
        )
      );
    }
  };

  const onCheckout = () => {
     if (!storeName || !phoneNumber || !address) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
      //adding totlal itms count
    const totalItems = cartItems.reduce((a, c) => a + c.quantity, 0);
    const totalPrice = cartItems.reduce((a, c) => a + c.price * c.quantity, 0);
    const dataToSend = {
      cartItems: cartItems,
      phoneNumber: phoneNumber,
      address: address,
      notice: notice,
      totalPrice: totalPrice,
      totalItems: totalItems,  // Add total count
      storeName: storeName,
      // Add any other relevant data you want to send
    };

    tele.MainButton.setText('ارسل الطلب').show().onClick(function () {
      const jsonData = JSON.stringify(dataToSend);
      tele.sendData(jsonData);
      tele.close();
    });
  };
 
  

  return (
    <>
      <Header cartItems={cartItems} onCheckout={onCheckout}/>
      <div
       style={{
              
             
              marginTop:"50px",
             
            }}>
        <label 
        style={{
              padding: '8px',
              fontSize: '14px',
              margin: '10px',
             
            }}>
اسم المحل:
          <input
            type="text"
            placeholder="ادخل اسم المحل"
            value={storeName}
            onChange={(e) => setstoreName(e.target.value)}
            style={{
              padding: '8px',
              fontSize: '14px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              width: '70%',
              margin: '20px',
              alignContent: 'center'
            }}
          />
        </label>

      </div>
      <div>
        <label 
        style={{
              padding: '8px',
              fontSize: '14px',
              margin: '10px',
             
            }}>
          رقم الهاتف:
          <input
            type="text"
            placeholder="ادخل رقم الهاتف"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            style={{
              padding: '8px',
              fontSize: '14px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              width: '70%',
              margin: '20px',
              alignContent: 'center'
            }}
          />
        </label>

      </div>
      <div>
        <label 
         style={{
              padding: '8px',
              fontSize: '14px',
            
              margin: '10px'
            }}>
          العنوان الكامل:
          <input
            type="text"
            placeholder="اكتب العنوان الكامل مع اقرب نقطة دالة"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={{
              padding: '8px',
              fontSize: '14px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              width: '70%',
              margin: '20px'
            }}
          />
        </label>
      </div>
      <div>
        <label style={{
          padding: '8px',
          fontSize: '14px',
          margin: '10px'
        }}>
          الملاحظات
          <input
            type="text"
            placeholder=" هل القائمة نقد او بالاجل؟ تاريخ ارسال البضاعة؟"
            value={notice}
            onChange={(e) => setNotice(e.target.value)}
            style={{
              padding: '8px',
              fontSize: '14px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              width: '70%',
              margin: '20px'
            }}
          />
        </label>
      </div>
    

      <div className="cards__container">
        {foods.map((food) => {
          return (
            <Card food={food} key={food.id} onAdd={onAdd} onRemove={onRemove} />
          );
        })}
    
      </div>
     
        <div className="mainBtn">
        <Button
          title={`${cartItems.length === 0 ? "الطلب !" : "ارسال الطلب"} `}
          type={"checkout"}
          disable={cartItems.length === 0 ? true : false}
          onClick={onCheckout}
        />
        </div>
      <Footer />
    </>
  );
}

export default App;
