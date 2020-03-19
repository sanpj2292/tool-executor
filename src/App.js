import React from 'react';
import './App.css';
import ConsoleOut from './components/console-out';

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
    // fs.lstat(folderVal, (err, stats) => {
    //   if (err) {
    //     alert('Error in Uploading Directory')
    //     return;
    //   }
    //   console.log(`Is directory: ${stats.isDirectory()}`);
    // });
  }

  render() {
    const { folder } = this.state;
    return (
      <div className="App">
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="folder">FolderName</label>
          <input name="folder" type="text" />
          <input type="submit" value="Submit" />
        </form>
        {
          this.state.folder !== '' ? <ConsoleOut folderPath={folder} /> : null
        }
      </div>
    );
  }

}

export default App;
