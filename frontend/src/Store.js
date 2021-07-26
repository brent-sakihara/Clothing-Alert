import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";

class Store extends Component {
  initialState = {
    URL: "",
    isOpen: false,
  };

  state = this.initialState;

  showModal = () => {
    this.setState({ isOpen: true });
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

  handleTrack = () => {
    if (this.state.URL !== "" && this.isValidHttpUrl(this.state.URL)) {
      //sends to database here

      this.hideModal();
      this.setState(this.initialState);
      this.props.changeScreen()
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
          <button class="btn btn-primary" onClick={this.showModal}>Select</button>
          <Modal show={this.state.isOpen} onHide={this.hideModal}>
            <Modal.Header>Enter a URL</Modal.Header>
            <Modal.Body>
              <label htmlFor="URL">URL</label>
              <input
                type="text"
                name="URL"
                id="URL"
                value={this.state.URL}
                onChange={this.handleChange}
              />
            </Modal.Body>
            <Modal.Footer><button class="btn btn-dark" onClick={this.handleTrack}>Save</button></Modal.Footer>
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
