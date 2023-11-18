import React, { useState } from "react";

function Product(props) {
  const [success, setSuccess] = useState(false);

  async function paymentHandler(e) {
    const amount = 50000;
    const currency = "INR";
    const receipt = new Date();

    const requestBody = {
      amount,
      currency,
      receipt,
    };

    const order = await fetch("http://localhost:5000/order", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const jsonOrder = await order.json();
    const orderId = jsonOrder.id;

    console.log(jsonOrder);

    var options = {
      key: "rzp_test_QS9kJChVCC0ml4", // Enter the Key ID generated from the Dashboard
      amount: "50000", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: "INR",
      name: "Acme Corp", //your business name
      description: "Test Transaction",
      image: "https://example.com/your_logo",
      order_id: orderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      handler: async function (response) {
        console.log(response);
        const res = await fetch("http://localhost:5000/order/validate", {
          method: "POST",
          body: JSON.stringify(response),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const validationResponse = await res.json();
        if (validationResponse.success) {
          setSuccess(true);
        }
        console.log(validationResponse);
      },
      prefill: {
        //We recommend using the prefill parameter to auto-fill customer's contact information, especially their phone number
        name: "Gaurav Kumar", //your customer's name
        email: "gaurav.kumar@example.com",
        contact: "9000090000", //Provide the customer's phone number for better conversion rates
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };
    var rzp1 = new window.Razorpay(options);

    rzp1.on("payment.failed", function (response) {
      alert(response.error.code);
      alert(response.error.description);
      alert(response.error.source);
      alert(response.error.step);
      alert(response.error.reason);
      alert(response.error.metadata.order_id);
      alert(response.error.metadata.payment_id);
    });

    rzp1.open();
    e.preventDefault();
  }

  if (success) {
    return <h2>Success</h2>;
  }

  return (
    <div className="product">
      <h3>{props.info.name}</h3>
      <p>{props.info.description}</p>
      <img src={props.info.url} />
      <button onClick={paymentHandler}>Pay</button>
    </div>
  );
}

export default Product;
