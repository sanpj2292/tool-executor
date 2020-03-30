import React from 'react';
import './App.css';
// import ConsoleOut from './components/console-out/console-out';
// import FileUpload from "./components/file-upload/file-upload";
import Header from './components/header/header';
import StoreTool from './components/tool/store-tool';
import ConsoleOut from "./components/console-out/console-out";
import socketIOClient from "socket.io-client";
import Grid from './components/grid/grid';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      folder: ''
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const folderVal = e.target.folder.value;
    this.setState({ folder: folderVal });
  }

  handleExecute = (e) => {
    alert('Clicked')
    const socket = socketIOClient('http://localhost:4000/sendHello');
    socket.on('hello', data => alert(data));
  };

  render() {
    const { folder } = this.state;
    return (
      <div className="App">
        <Header />
        <div className='container d-flex'>
          {/* <div className='container my-2'>
            <Grid columns={['name', 'versions']} />
          </div> */}
          {/* <form style={{ width: '40vw' }} onSubmit={this.handleSubmit}>
            <div className='form-group mt-2 d-flex justify-content-around'>
              <label htmlFor='folder' > FolderPath </label>
              <input className='' name='folder' defaultValue='' />
            </div>
            {
              folder ? (<div className='form-group d-flex'>
                <ConsoleOut className='mt-2' folderPath={folder} />
              </div>) : null
            }

            <div className='form-group d-flex justify-content-end'>
              {/* {folder ? (
                ) : null} */}
          {/*<input type='button' className='btn btn-info mr-2'
                onClick={this.handleExecute} value='Execute' />
              <input type='submit' className='btn btn-primary' value='Submit' />
            </div>
          </form>*/}
          <StoreTool />
        </div>
      </div>
    );
  }
}

export default App;
