import { useState } from "react";
import { Link } from "react-router";

type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

export default function Checkout() {

  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: "Ergonomic Desk Chair",
      price: 18999.99,
      image: "/images/chair.png",
      quantity: 1,
    },
    {
      id: 2,
      name: "Noise Cancelling Headphones",
      price: 7950,
      image: "/images/headphones.png",
      quantity: 2,
    },
    {
      id: 3,
      name: "Portable SSD 1TB",
      price: 12000,
      image: "/images/ssd.png",
      quantity: 1,
    },
  ]);

  const shipping = 500;

  const increaseQty = (id: number) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQty = (id: number) => {
    setCartItems((items) =>
      items.map((item) =>
        item.quantity > 1 && item.id === id
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const total = subtotal + shipping;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      {/* NAVBAR */}
      <nav className="bg-white shadow-md px-8 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          USIU Market
        </Link>

        <div className="flex gap-6 text-gray-700">
          <Link to="/products">Products</Link>
          <Link to="/checkout">Cart</Link>
          <Link to="/seller-dashboard">Seller</Link>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-10">

        <h1 className="text-3xl font-bold mb-8">
          Cart & Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* LEFT SIDE - CART */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">

            <h2 className="text-xl font-semibold mb-6">
              Your Shopping Cart
            </h2>

            {cartItems.map((item) => (

              <div
                key={item.id}
                className="grid grid-cols-5 items-center border-b py-4"
              >

                {/* PRODUCT */}
                <div className="flex items-center gap-4 col-span-2">
                  <img
                    src={item.image}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <span className="font-medium">{item.name}</span>
                </div>

                {/* PRICE */}
                <div className="text-gray-600">
                  KSH {item.price.toFixed(2)}
                </div>

                {/* QUANTITY */}
                <div className="flex items-center gap-2">

                  <button
                    onClick={() => decreaseQty(item.id)}
                    className="px-2 border rounded"
                  >
                    -
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() => increaseQty(item.id)}
                    className="px-2 border rounded"
                  >
                    +
                  </button>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="ml-3 text-red-500"
                  >
                    🗑
                  </button>
                </div>

                {/* TOTAL */}
                <div className="font-semibold text-right">
                  KSH {(item.price * item.quantity).toFixed(2)}
                </div>

              </div>
            ))}
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-6">

            {/* ORDER SUMMARY */}
            <div className="bg-white p-6 rounded-lg shadow">

              <h2 className="text-lg font-semibold mb-4">
                Order Summary
              </h2>

              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>KSH {subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between mb-2">
                <span>Shipping</span>
                <span>KSH {shipping.toFixed(2)}</span>
              </div>

              <hr className="my-3"/>

              <div className="flex justify-between font-bold">
                <span>Order Total</span>
                <span>KSH {total.toFixed(2)}</span>
              </div>

            </div>

            {/* MPESA PAYMENT */}
            <div className="bg-white p-6 rounded-lg shadow">

              <h2 className="text-lg font-semibold mb-4">
                M-Pesa Payment Details
              </h2>

              <input
                type="text"
                placeholder="M-Pesa Number e.g 0712345678"
                className="w-full border rounded p-2 mb-4"
              />

              <div className="text-sm text-gray-600 space-y-1">
                <p>To complete payment via M-Pesa:</p>
                <p>1. Go to your M-Pesa menu</p>
                <p>2. Select "Lipa Na M-Pesa"</p>
                <p>3. Select "Buy Goods and Services"</p>
                <p>4. Enter Till Number: <b>123456</b></p>
                <p>5. Enter Amount: <b>KSH {total.toFixed(2)}</b></p>
                <p>6. Enter your PIN and confirm</p>
              </div>

              <button
                className="w-full mt-6 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Confirm Payment
              </button>

            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white text-center py-6 mt-10">
        <p>© {new Date().getFullYear()} USIU Market</p>
        <p className="text-sm text-gray-400">
          Buy and sell easily within the USIU community
        </p>
      </footer>

    </div>
  );
}