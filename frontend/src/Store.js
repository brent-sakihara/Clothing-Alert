import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";

class Store extends Component {
  initialState = {
    URL: "",
    isOpen: false,
    storeName: "",
  };

  state = this.initialState;

  showModal = (name) => {
    this.setState({
      isOpen: true,
      storeName: name,
    });
  };

  hideModal = () => {
    this.setState({ isOpen: false });
  };

  handleChange = (event) => {
    const { name, value } = event.target;

    this.setState({
      [name]: value,
    });
  };

  isValidHttpUrl = (string) => {
    let url;

    try {
      url = new URL(string);
    } catch (_) {
      return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
  };

  handleTrack = async () => {
    if (this.state.URL !== "" && this.isValidHttpUrl(this.state.URL)) {
      try {
        const u = await fetch(`http://localhost:5000/users/${this.props.userEmail}`);
        const user = await(u.json());
        const body = { storeName: this.state.storeName, itemURL: this.state.URL, userId: user.id };
        const response = await fetch("http://localhost:5000/urls", {
          method: "POST", 
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        this.props.showItems(true);
      } catch (err) {
        console.error(err.message);
        alert("Error: " + err.message);
      }
      this.hideModal();
      this.setState(this.initialState);
    } else {
      alert("Please enter a valid HTTP URL");
    }
  };

  render() {
    const shops = this.props.storeData.map((shop, index) => {
      const store = shop.store;
      const imgURL = shop.imgURL;
      return (
        <div className="store" key={index}>
          <img className="store-img" alt={store} src={imgURL} />
          <h2 className="store-name">{store}</h2>
          <button className="btn btn-primary" onClick={() => this.showModal(store)}>
            Select
          </button>
          <Modal show={this.state.isOpen} onHide={this.hideModal}>
            <Modal.Header>Enter a URL for {this.state.storeName}</Modal.Header>
            <Modal.Body>
              <label htmlFor="URL">URL</label>
              <input
                type="text"
                name="URL"
                className = "URL"
                value={this.state.URL}
                onChange={this.handleChange}
              />
            </Modal.Body>
            <Modal.Footer>
              <button className="btn btn-dark" onClick={this.handleTrack}>
                Save
              </button>
            </Modal.Footer>
          </Modal>
        </div>
      );
    });
    return (
      <div>
        <h1 id="title">Clothing Sales Alert</h1>
        <div id="container">{shops}</div>
      </div>
    );
  }
}

export default Store;
