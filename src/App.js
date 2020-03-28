import React from 'react';
import './App.css';
// import ConsoleOut from './components/console-out/console-out';
// import FileUpload from "./components/file-upload/file-upload";
import Header from './components/header/header';
import StoreTool from './components/store-tool/store-tool';

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

  render() {
    // const { folder } = this.state;
    return (
      <div className="App">
        <Header />
        <div className='container'>
          <StoreTool />
        </div>
      </div>
    );
  }
}

export default App;
