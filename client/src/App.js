import logo from "./logo.svg";
import "./App.css";
import Product from "./components/Product";

const product1 = {
  id: "1",
  description: "Solid Blue Tshirt",
  name: "Tshirt",
  url: "https://images.pexels.com/photos/3026284/pexels-photo-3026284.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
};

function App() {
  return (
    <div className="App">
      <h1>Razorpay Integration</h1>
      <Product info={product1} />
    </div>
  );
}

export default App;
