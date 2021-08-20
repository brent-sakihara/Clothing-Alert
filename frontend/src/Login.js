import React,{Component} from 'react';
import firebase from "./firebase"

class Login extends Component {
    constructor(props){
        super(props);
        this.login = this.login.bind(this);
        this.signup = this.signup.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            email: "",
            password: "",
        }
    }

    login(e){
        e.preventDefault();
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then((u)=>{
            console.log(`user email: ${u.user.email}`);
            console.log(u.user);
        })
        .catch((err)=>{
            alert(err.message);
            console.log(err);
        })
    }

    signup(e){
        e.preventDefault();
        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then(async(u)=>{
            try {
                const body = { userEmail: u.user.email };
                const response = await fetch("http://localhost:5000/users", {
                  method: "POST", 
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(body),
                });
                const user = response.json();
                console.log(user);
              } catch (err) {
                console.error(err.message);
              }
            console.log(`user email: ${u.user.email}`);
            console.log(u.user);
        })
        .catch(err => {
            alert(err.message);
            console.log(err);
        })
    }

    handleChange(e){
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    render(){
        return(
            <div>
                <form>
                    <input 
                        name = "email"
                        type = "email"
                        id = "email"
                        placeholder = "Enter your email address"
                        onChange = {this.handleChange}
                        value = {this.state.email}
                    />
                    <input 
                        name = "password"
                        type = "password"
                        id = "password"
                        placeholder = "Enter your password"
                        onChange = {this.handleChange}
                        value = {this.state.password}
                    />
                    <button onClick = {this.login}>Login</button>
                    <button onClick = {this.signup}>Signup</button>
                </form>
            </div>
        )
    }
}

export default Login