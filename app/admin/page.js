"use client";
import { useState, useEffect } from "react";
import {
  fetchsellerl,
  fetchbuyerl,
  fetchproducts,
  fetchproductpid,
  fetchseller,
  orderlist,
  deleteuser,
} from "@/actions/useractions";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Sidebar = ({ setActivePage }) => {
  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-5 shadow-md bg-opacity-90">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
      <ul>
        <li
          className="mb-4 flex cursor-pointer p-2 hover:bg-gray-700 rounded"
          onClick={() => setActivePage("sellers")}
        >
          <div>
            <img
              src="https://cdn-icons-png.flaticon.com/128/10845/10845690.png"
              alt="seller"
              className="w-6 h-6 mr-2"
            />
          </div>
          <div>Seller List</div>
        </li>
        <li
          className="mb-4 flex cursor-pointer p-2 hover:bg-gray-700 rounded"
          onClick={() => setActivePage("buyers")}
        >
          <div>
            <img
              src="https://cdn-icons-png.flaticon.com/128/16687/16687028.png"
              alt="buyer"
              className="w-6 h-6 mr-2"
            />
          </div>
          <div>Buyer List</div>
        </li>
        <li
          className="mb-4 flex cursor-pointer p-2 hover:bg-gray-700 rounded"
          onClick={() => setActivePage("products")}
        >
          <div>
            <img
              src="https://cdn-icons-png.flaticon.com/128/10951/10951869.png"
              alt="product"
              className="w-6 h-6 mr-2"
            />
          </div>
          <div>Product List</div>
        </li>
        <li
          className="mb-4 cursor-pointer flex p-2 hover:bg-gray-700 rounded"
          onClick={() => setActivePage("payments")}
        >
          <div>
          <img
              src="https://cdn-icons-png.flaticon.com/128/1019/1019607.png"
              alt="product"
              className="w-6 h-6 mr-2"
            />
          </div>
          <div>

          Payment List
          </div>
        </li>
        <li
          className="mb-4 flex cursor-pointer p-2 hover:bg-gray-700 rounded"
          onClick={() => setActivePage("reports")}
        >
          <div>
            <img
              src="https://cdn-icons-png.flaticon.com/128/3029/3029337.png"
              alt="product"
              className="w-6 h-6 mr-2"
            />
          </div>
          <div>Report</div>
        </li>
      </ul>
    </div>
  );
};

const Content = ({
  activePage,
  sellerlist,
  buyerlist,
  productlist,
  paymentlist,
}) => {
  return (
    <div className="flex-1 p-5 bg-gray-100 min-h-screen overflow-scroll bg-opacity-85">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">{activePage} List</h2>
        <p className="text-gray-600">Manage {activePage} details here.</p>
        <div className="mt-4 overflow-scroll pb-24">
          {activePage === "sellers" && (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 p-2">Email</th>
                  <th className="border border-gray-300 p-2">Name</th>
                  <th className="border border-gray-300 p-2">Address</th>
                  <th className="border border-gray-300 p-2">Contact</th>
                  <th className="border border-gray-300 p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {sellerlist.map((item) => (
                  <tr key={item.id}>
                    <td className="border border-gray-300 p-2">{item.email}</td>
                    <td className="border border-gray-300 p-2">{item.name}</td>
                    <td className="border border-gray-300 p-2">
                      {item.address}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item.contact}
                    </td>
                    <td className="flex border border-gray-300 p-2 items-center justify-center">
                      <button className="bg-lime-600 text-white px-4 py-1 rounded">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {activePage === "buyers" && (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 p-2">Email</th>
                  <th className="border border-gray-300 p-2">Name</th>
                  <th className="border border-gray-300 p-2">Address</th>
                  <th className="border border-gray-300 p-2">Contact</th>
                  <th className="border border-gray-300 p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {buyerlist.map((item) => (
                  <tr key={item.id}>
                    <td className="border border-gray-300 p-2">{item.email}</td>
                    <td className="border border-gray-300 p-2">{item.name}</td>
                    <td className="border border-gray-300 p-2">
                      {item.address}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item.contact}
                    </td>
                    <td className="flex border border-gray-300 p-2 items-center justify-center">
                      <button className="bg-lime-600 text-white px-4 py-1 rounded">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {activePage === "products" && (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 p-2">Product Image</th>
                  <th className="border border-gray-300 p-2">Product Name</th>
                  <th className="border border-gray-300 p-2">Seller Name</th>
                  <th className="border border-gray-300 p-2">Seller Email</th>
                  <th className="border border-gray-300 p-2">Seller Address</th>
                  <th className="border border-gray-300 p-2">Seller Contact</th>
                  <th className="border border-gray-300 p-2">Product Price</th>
                  <th className="border border-gray-300 p-2">
                    Product Quantity
                  </th>
                </tr>
              </thead>
              <tbody>
                {productlist.map((item) => (
                  <tr key={item.pid}>
                    <td className="border border-gray-300 p-2">
                      <img
                        className="h-20 w-20 object-cover rounded-lg shadow-md"
                        src={item.pic}
                        alt={item.name || "pic"}
                      />
                    </td>
                    <td className="border border-gray-300 p-2">{item.name}</td>
                    <td className="border border-gray-300 p-2">
                      {item.s_name}
                    </td>
                    <td className="border border-gray-300 p-2">{item.email}</td>
                    <td className="border border-gray-300 p-2">
                      {item.s_address}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item.s_contact}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item.price}/kg
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {activePage === "payments" && (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 p-2">Product Image</th>
                  <th className="border border-gray-300 p-2">Product Name</th>
                  <th className="border border-gray-300 p-2">Seller Name</th>
                  <th className="border border-gray-300 p-2">Seller Email</th>
                  <th className="border border-gray-300 p-2">Seller Address</th>
                  <th className="border border-gray-300 p-2">Seller Contact</th>
                  <th className="border border-gray-300 p-2">Buyer Name</th>
                  {/* <th className="border border-gray-300 p-2">Buyer Email</th> */}
                  <th className="border border-gray-300 p-2">Buyer Address</th>
                  <th className="border border-gray-300 p-2">Buyer Contact</th>
                  <th className="border border-gray-300 p-2">Order Price</th>
                  <th className="border border-gray-300 p-2">Order Quantity</th>
                  <th className="border border-gray-300 p-2">Order Date</th>
                </tr>
              </thead>
              <tbody>
                {paymentlist.map((item) => (
                  <tr key={item.pid}>
                    <td className="border border-gray-300 p-2">
                      <img
                        className="h-20 w-20 object-cover rounded-lg shadow-md"
                        src={item.pic}
                        alt={item.name || "pic"}
                      />
                    </td>
                    <td className="border border-gray-300 p-2">{item.name}</td>
                    <td className="border border-gray-300 p-2">
                      {item.s_name}
                    </td>
                    <td className="border border-gray-300 p-2">{item.email}</td>
                    <td className="border border-gray-300 p-2">
                      {item.s_address}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item.s_contact}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item.b_name}
                    </td>
                    {/* <td className="border border-gray-300 p-2">{item.email}</td> */}
                    <td className="border border-gray-300 p-2">
                      {item.b_address}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item.b_contact}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item.price * item.quantity}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item.quantity}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {activePage === "reports" && (
            <table className="w-full border-collapse border border-gray-300">
              Work in progress
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [activePage, setActivePage] = useState("sellers");

  const [sellerlist, setsellerlist] = useState([]);
  const [buyerlist, setbuyerlist] = useState([]);
  const [productlist, setproductlist] = useState([]);
  const [paymentlist, setpaymentlist] = useState([]);
  const { data: session } = useSession();
  const router = useRouter();

  const fetchlist = async () => {
    const a = await fetchsellerl();
    setsellerlist(a);
    const b = await fetchbuyerl();
    setbuyerlist(b);
    getProducts();
    fetchorder();
  };
  const getProducts = async () => {
    let product1 = await fetchproducts();
    let fetchedProducts = [];
    // Loop through each cart item and fetch product details
    for (let i = 0; i < product1.length; i++) {
      const product = await fetchproductpid(product1[i].pid);
      const seller = await fetchseller(product.email);
      const productDetails = product; // Assuming product is returned as an array with one element
      const productWithQuantity = {
        ...productDetails, // Add the quantity from cart data
        s_name: seller.name,
        s_address: seller.address,
        s_contact: seller.contact,
      };
      fetchedProducts.push(productWithQuantity);
    }

    setproductlist(fetchedProducts);
  };

  const fetchorder = async () => {
    var cartData = await orderlist();
    // setCart(cartData)  // Set the cart state directly
    // Initialize an empty array to store product details
    let fetchedProducts = [];
    // Loop through each cart item and fetch product details
    for (let i = 0; i < cartData.length; i++) {
      const product = await fetchproductpid(cartData[i].pid);
      const seller = await fetchseller(product.email);
      const buyer = await fetchseller(cartData[i].email);
      const productDetails = product; // Assuming product is returned as an array with one element
      const productWithQuantity = {
        ...productDetails,
        oid: cartData[i].oid,
        quantity: cartData[i].quantity, // Add the quantity from cart data
        s_name: seller.name,
        s_address: seller.address,
        s_contact: seller.contact,
        b_name: buyer.name,
        b_address: buyer.address,
        b_contact: buyer.contact,
      };
      fetchedProducts.push(productWithQuantity);
    }

    setpaymentlist(fetchedProducts);
    // console.log(fetchedProducts)
    // console.log(products)
  };

  useEffect(() => {
    if (session && session.user.type === "admin") {
      router.push("/admin"); // Fetch the cart and products when session exists
      fetchlist();
    } else {
      router.push("/login");
    }
  }, [session, router]);

  return (
    <div className="flex h-screen">
      <Sidebar setActivePage={setActivePage} />
      <Content
        activePage={activePage}
        sellerlist={sellerlist}
        buyerlist={buyerlist}
        productlist={productlist}
        paymentlist={paymentlist}
      />
    </div>
  );
}
