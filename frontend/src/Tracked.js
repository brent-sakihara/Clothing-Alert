import React, { Fragment, useState, useEffect } from "react";

const Tracked = ({ userEmail, changeScreen, queuedItem }) => {
  const [items, setItems] = useState([]);

  const deleteItems = async (id) => {
    try {
      const deleteItem = await fetch(`http://localhost:5000/items/${id}`, {
        method: "DELETE",
      });

      setItems(items.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err.message);
    }
  };

  const getItems = async () => {
    try {
      const u = await fetch(`http://localhost:5000/users/${userEmail}`);
      const user = await(u.json());
      const response = await fetch(`http://localhost:5000/items/${user.id}`);
      const jsonData = await response.json();
      setItems(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  const queryItem = () => {
    changeScreen();
  };

  useEffect(() => {
    //calls getItems each time this component is rendered
    getItems();
  }, []); //the ,[] ensures it only calls it once, when you load the page

  return (
    <Fragment>
      {queuedItem ? <h1>Item Successfully Queried!</h1> : null}
      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col">Item Name</th>
            <th scope="col">Item Price</th>
            <th scope="col">Item URL</th>
            <th scope="col">Delete</th>
          </tr>
        </thead>
        <tbody>
        {/*
          <tr>
            <th scope="row">1</th>
            <td>Grey shirt</td>
            <td>$5.99</td>
            <td>https://shirts.com</td>
          </tr>
          <tr>
            <th scope="row">2</th>
            <td>Black pants</td>
            <td>$10.00</td>
            <td>https://pants.com</td>
          </tr>
        */}
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.itemName}</td>
              <td>{"$" + item.itemPrice}</td>
              <td>{item.itemURL}</td>
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => deleteItems(item.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn btn-primary" onClick={() => queryItem()}>
        Query Another Item
      </button>
    </Fragment>
  );
};

export default Tracked;
