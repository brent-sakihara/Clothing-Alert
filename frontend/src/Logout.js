import React, { Component } from 'react'
import firebase from './firebase'

class Logout extends Component {
    logout = () => {
        this.props.showStores();
        firebase.auth().signOut();
    }
    render() {
        return (
            <div>
                <button onClick={this.logout}>Logout</button>
            </div>
        )
    }
}

export default Logout;