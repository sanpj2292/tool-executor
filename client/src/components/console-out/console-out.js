import React from 'react';
import socketIOClient from "socket.io-client";
import './console-out.css';

class ConsoleOut extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            consoleOut: null
        };
    }

    componentDidMount() {
        const { folderPath } = this.props;
        if (folderPath) {
            const socket = socketIOClient('http://localhost:4000/execution', {
                query: {
                    folderPath
                }
            });
            socket.on('FromAPI', data => {
                this.setState((prevState, prevProps) => {
                    const { consoleOut: prevConsoleOut } = prevState;
                    const { isDefAndNotNull } = this;
                    const isDef = isDefAndNotNull(prevConsoleOut) && prevConsoleOut !== '\n';
                    return { consoleOut: (isDef ? `${prevConsoleOut}\n` : '') + data }
                });
            });
            socket.on('exitFunction', (data) => {
                alert('I have come to Client...');
                this.setState((prevState, prevProps) => {
                    alert('Before changing state');
                    return { consoleOut: `${prevState.consoleOut}\n${data}` };
                });
            });
        }
    }

    isDefAndNotNull(inpStr) {
        return inpStr && inpStr !== null && inpStr !== '';
    }

    render() {
        const { consoleOut } = this.state;
        const { isDefAndNotNull } = this;
        const { className } = this.props;
        return (
            <textarea className={`console ${className}`}
                value={isDefAndNotNull(consoleOut) ? consoleOut : ''}
                readOnly>
            </textarea>
        );
    }
}

export default ConsoleOut;