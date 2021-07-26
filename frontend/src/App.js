import React, {Component} from 'react'
//import Table from './Table'
//import Form from './Form'
import Tracked from './Tracked'
import Store from './Store'

class App extends Component {
    state = { //doesnt require constructors anymore
        //characters: [],
        showResults: true,
        stores: [
          {store: 'Amazon', imgURL: 'https://media-exp3.licdn.com/dms/image/C560BAQHTvZwCx4p2Qg/company-logo_200_200/0/1612205615891?e=2159024400&v=beta&t=J9qbDyzP2uv1lE1Xb_ieBaWwgeT-u52Mf-4ACuHP_p8'},
          {store: 'Nike', imgURL: 'https://static.nike.com/a/images/f_jpg,q_auto:eco/61b4738b-e1e1-4786-8f6c-26aa0008e80b/swoosh-logo-black.png'},
          {store: 'H&M', imgURL: 'https://ceowatermandate.org/wp-content/uploads/2017/08/HM.png'},
          {store: 'Aeropostale', imgURL: 'https://i.pinimg.com/originals/c7/76/01/c77601a51aab06397e9039eb4701af74.png'},
          {store: 'North Face', imgURL: 'https://cdn.shopify.com/s/files/1/2374/3709/products/The_north_face_thumb_8fd74e2f-763e-42dd-ace2-4f0fa4180527_1080x.jpg?v=1513996306'},
          {store: 'Adidas', imgURL: 'https://cdn.shopify.com/s/files/1/0961/8798/collections/adidas-Performance-Logo-Black-Square-transparent-background-300x300_06a33b7b-3743-4d08-9827-7d49dea44ead_600x600_crop_center.png?v=1466457455'},
          {store: 'Zara', imgURL: 'https://www.webanywhere.com/wp-content/uploads/2017/05/Zara-eLearning-Case-Study.png'},
        ],
        selectedStore: {},
    }
    changeScreen = () => { //using arrow functions allows to bypass binding the function
      const results = this.state.showResults;
      this.setState({showResults: !results})
    }
    addSelectedStore = (storeName, storeURL) => {
        this.setState({selectedStore: {storeName, storeURL}})
        this.changeScreen()
    }
    clearSelectedStore = () => {
        this.setState({selectedStore: {}})
        this.changeScreen()
    }
      render() {
        const { showResults, stores, selectedStore } = this.state
        return (
            <div className="container">
              {showResults ? <Store storeData= {stores} changeScreen={this.changeScreen}/> : null}
              {!showResults ? <Tracked changeScreen={this.changeScreen}/> : null} 
              <div>{selectedStore.storeName}{selectedStore.storeURL}</div>
              <button onClick={this.changeScreen}>CLICK HERE TO CHANGE SCREEN</button>
            </div>
          )
      }
  }

  
  
  export default App