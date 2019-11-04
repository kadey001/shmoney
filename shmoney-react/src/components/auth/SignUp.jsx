import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { compose } from 'recompose';

import SignInGoogle from './SignInGoogle'
import { SignInLink } from './SignIn'
import { withFirebase } from '../firebase'

import '../../styles/SignUpBox.css';

const INITIAL_STATE = {
	username: '',
	email: '',
	passwordOne: '',
	passwordTwo: '',
	error: null,
};

class SignUpFormBase extends Component {
	constructor(props) {
		super(props);

		this.state = { ...INITIAL_STATE };
	}
	onChange = event => {
		this.setState({ [event.target.name]: event.target.value });
	}
	onSubmit = event => {
		event.preventDefault();

		const { username, email, passwordOne } = this.state;
		const roles = {}

		this.props.firebase.createUserWithEmailAndPassword(email, passwordOne).then(credential => {
			//Get authUser from credential
			let authUser = credential.user;
			//Update authUser displayName with username
			authUser.updateProfile({displayName: username});
			//Add firestore document for user with user info
			return this.props.firebase.user(authUser.uid).set({
				username,
				email,
				roles
			},{ merge: true });
		}).then(() => {
			this.props.firebase.sendEmailVerification();
			console.log("Email Verification Sent")
		}).then(() => {
			this.setState({ ...INITIAL_STATE });
			this.props.history.push('/');
		}).catch(error => {
			this.setState({ error });
		});
	}
	render() {
		const {
			username,
			email,
			passwordOne,
			passwordTwo,
			error
		} = this.state;

		const isInvalid = //True if any fields are invalid
			username === '' || email === '' || 
			passwordOne !== passwordTwo || passwordOne === '';

		return (
			<form onSubmit={this.onSubmit}>
				<div className="input-field">
					<div className = "universal-padding-3">
						Username:
					</div>
					<input 
						type="text"
						name="username"
						value={username}
						onChange={this.onChange}
						placeholder=""
						id = "rounded-corner-input"
					/>
				</div>
				<div className="input-field">
					<div className = "universal-padding-3">
						Email Address:
					</div>
					<input 
						type="email"
						name="email"
						value={email}
						onChange={this.onChange}
						placeholder=""
						id = "rounded-corner-input"
					/>
				</div>
				<div className="input-field">
					<div className = "universal-padding-3">
						Password:
					</div>
					<input 
						type="password"
						name="passwordOne"
						value={passwordOne}
						onChange={this.onChange}
						placeholder=""
						id = "rounded-corner-input"
					/>
				</div>
				<div className="input-field">
					<div className = "universal-padding-3">
						Confirm Password:
					</div>
					<input 
						type="password"
						name="passwordTwo"
						value={passwordTwo}
						onChange={this.onChange}
						placeholder=""
						id = "rounded-corner-input"	
					/>
					<div className = "universal-padding-10">
					</div>
				</div>
				<button type="submit" disabled={isInvalid}>Sign Up</button>
				<div className = "universal-padding-10"></div>

				{/* Handle Errors */}
				<div className="error-message">
					{error && <p>{error.message}</p>}
				</div>
			</form>
		)
	}
}

const SignUpPage = () => {
	return(
		<div className = "signup-box">
		<div className = "background-test">
			<h1>$ign Up</h1>
			<SignUpForm />
			<SignInGoogle />
			<SignInLink />
		</div>
		</div>
	);
};

const SignUpLink = () => {
	return(
		<p>
			Don't have an account? <Link to='/signup'>Sign Up</Link>
		</p>
	);
};

//Make component a FirebaseContext Consumer and Router Consumer
const SignUpForm = compose(
	withRouter,
	withFirebase
)(SignUpFormBase);

export default SignUpPage;

export { SignUpForm, SignUpLink }
