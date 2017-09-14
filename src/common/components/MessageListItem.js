import React, {PropTypes} from 'react';
import io from 'socket.io-client';

const socket = io('', { path: '/api/chat' });

export default class MessageListItem extends React.Component {
    static propTypes = {
        message: PropTypes.object.isRequired
    };

    handleClick(user) {
        this.props.handleClickOnUser(user);
    }

    render() {
        const {message} = this.props;

        let text = String(message.text);
        if(text.indexOf('sticker') !== -1) {
            let position = text.indexOf("sticker");
            text = text.replace('sticker', '');
            return (
                <li>
                    <span>
                      <b style={{color: '#66c'}}><button
                          style={{background: 'Transparent',backgroundRepeat: 'noRepeat', border: 'none', cursor: 'pointer', overflow: 'hidden', outline: 'none'}}
                          onClick={this.handleClick.bind(this, message.user)}>{message.user.username}</button></b>
                      <i style={{color: '#aad', opacity: '0.8'}}>{message.time}</i>
                    </span>
                    <div style={{clear: 'both', paddingTop: '0.1em', marginTop: '-1px', paddingBottom: '0.3em'}}>
                        {text.slice(0, position)} &nbsp;
                        <img src='https://t4.ftcdn.net/jpg/00/91/61/81/500_F_91618179_eR79OdR87jR9fp9S3aaiJGz4aGqkkwuE.jpg' width="40px" /> &nbsp;
                        {text.slice(position)}
                    </div>
                </li>
            );
        }else {
            return (
                <li>
                    <span>
                      <b style={{color: '#66c'}}><button
                          style={{background: 'Transparent',backgroundRepeat: 'noRepeat', border: 'none', cursor: 'pointer', overflow: 'hidden', outline: 'none'}}
                          onClick={this.handleClick.bind(this, message.user)}>{message.user.username}</button></b>
                      <i style={{color: '#aad', opacity: '0.8'}}>{message.time}</i>
                    </span>
                    <div style={{clear: 'both', paddingTop: '0.1em', marginTop: '-1px', paddingBottom: '0.3em'}}>
                        {text}
                    </div>
                </li>
            );
        }

    }
}
