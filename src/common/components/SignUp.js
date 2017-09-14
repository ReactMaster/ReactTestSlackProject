import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import * as actions from '../actions/actions';
import {Input, Button} from 'react-bootstrap';
import * as authActions from '../actions/authActions';
import uuid from 'node-uuid';
import {Link} from 'react-router';
import io from 'socket.io-client';

const socket = io('', { path: '/api/chat' });

class SignUp extends Component {

    static propTypes = {
        welcomePage: PropTypes.string.isRequired,
        dispatch: PropTypes.func.isRequired
    };

    constructor(props, context) {
        super(props, context);
        this.state = {
            username: this.props.welcomePage || '',
            password: '',
            confirmPassword: ''
        };
    }

    componentDidMount() {
        if (this.state.username.length) {
            this.refs.passwordInput.getInputDOMNode().focus();
        } else {
            this.refs.usernameInput.getInputDOMNode().focus();
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        const {dispatch} = this.props;
        if (!this.state.username.length) {
            this.refs.usernameInput.getInputDOMNode().focus();
        }
        if (this.state.username.length && !this.state.password.length) {
            this.refs.passwordInput.getInputDOMNode().focus();
        }
        if (this.state.username.length && this.state.password.length && !this.state.confirmPassword.length) {
            this.refs.confirmPasswordInput.getInputDOMNode().focus();
        }
        if (this.state.username.length && this.state.password.length && this.state.confirmPassword.length) {
            const userObj = {
                username: this.state.username,
                password: this.state.password,
                confirmPassword: this.state.confirmPassword
            };
            dispatch(authActions.signUp(userObj))
            const initLobby = {
                name: "myChannel",
                id: 0,
                private: false
            };
            dispatch(actions.createChannel(initLobby));
            //Create User channel
            /*const newChannel = {
                name: this.state.username,
                id: `${Date.now()}${uuid.v4()}`,
                private: false
            };
            dispatch(actions.createChannel(newChannel));
            socket.emit('new channel', newChannel);*/

            this.setState({username: '', password: '', confirmPassword: ''});
        }
    }

    handleChange(event) {
        if (event.target.name === 'username') {
            this.setState({username: event.target.value});
        }
        if (event.target.name === 'password') {
            this.setState({password: event.target.value});
        }
        if (event.target.name === 'confirm-password') {
            this.setState({confirmPassword: event.target.value});
        }
    }

    validateUsername() {
        return 'success';
    }

    validateConfirmPassword() {
        if (this.state.confirmPassword.length > 0 && this.state.password.length > 0) {
            if (this.state.password === this.state.confirmPassword) {
                return 'success';
            }
            return 'error';
        }
    }

    render() {
        return (
            <div>
                <header
                    style={{display: 'flex', height: '70px', justifyContent: 'center', background: '#f5f5f5', color: '#6f6f6f', flexGrow: '0', order: '0'}}>
                    <h3>Sign Up</h3>
                </header>
                <main style={{display: 'flex', justifyContent: 'center', paddingTop: '20px'}}>
                    <form  style={{width: '600px'}} onSubmit={::this.handleSubmit}>
                        <section style={{height: '6em'}}>
                            <Input
                                label="Username"
                                ref="usernameInput"
                                type="text"
                                help={this.validateUsername() === 'error' && 'A user with that name already exists!'}
                                bsStyle={this.validateUsername()}
                                hasFeedback
                                name="username"
                                autoFocus="true"
                                placeholder="Enter username"
                                value={this.state.username}
                                onChange={::this.handleChange}
                            />
                        </section>
                        <section style={{height: '6em'}}>
                            <Input
                                label="Password"
                                ref="passwordInput"
                                type="password"
                                name="password"
                                value={this.state.password}
                                placeholder="Enter password"
                                onChange={::this.handleChange}
                            />
                        </section>
                        <section style={{height: '6em'}}>
                            <Input
                                label="Confirm Password"
                                ref="confirmPasswordInput"
                                help={this.validateConfirmPassword() === 'error' && 'Your password doesn\'t match'}
                                type="password"
                                name="confirm-password"
                                placeholder="Enter password again" value={this.state.confirmPassword}
                                onChange={::this.handleChange}
                            />
                        </section>
                        <Button
                            disabled={this.validateUsername() === 'error' || this.validateConfirmPassword() === 'error' && true}
                            bsStyle="success"
                            style={{width: '100%', height: '50px', marginTop: '2rem'}}
                            onClick={::this.handleSubmit}
                            type="submit">
                            <p style={{color: 'white', margin: '0', padding: '0', fontSize: '1.5em'}}>Sign Up</p>
                        </Button>
                        <p style={{paddingTop: '10px'}}>If you already have an account, pls <a href='/signin'>Login here.</a></p>
                    </form>
                </main>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        welcomePage: state.welcomePage,
    }
}

export default connect(mapStateToProps)(SignUp)
