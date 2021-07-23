import React, { Component, Fragment } from "react";

class Tracked extends Component {
  

  render() {
    return (
      <Fragment>
        <table class="table table-hover">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Item Name</th>
              <th scope="col">Item Price</th>
              <th scope="col">Item URL</th>
            </tr>
          </thead>
          <tbody>
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
          </tbody>
        </table>
      </Fragment>
    );
  }
}

export default Tracked;
