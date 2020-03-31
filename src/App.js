import React from 'react';
import './App.css';
import Header from './components/header/header';
import StoreTool from './components/tool/store-tool';
import axios from "axios";
import socketIOClient from "socket.io-client";
import Grid from './components/grid/grid';
import Card from 'react-bootstrap/Card';
import InstructionPreview from "./components/instruction/instruction-preview";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      folder: '',
      createForm: false,
      preview: '',
      rows: [],
      selectedVals: []
    };
  }

  showCreateForm = e => {
    this.setState((prevState, prevProps) => ({
      createForm: !prevState.createForm,
      preview: ''
    }));
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const folderVal = e.target.folder.value;
    this.setState({ folder: folderVal });
  }

  handleExecute = (e) => {
    const socket = socketIOClient('http://localhost:4000/sendHello');
    socket.on('hello', data => alert(data));
  };

  handleInstruction = (e) => {
    this.setState({ preview: e.currentTarget.value });
  }

  async componentDidMount() {
    if (!this.state.createForm) {
      try {
        const rows = await axios.get('http://localhost:4000/service/aggregate');
        const selectedVals = rows.data.map(val => 0);
        this.setState({
          rows: rows.data,
          preview: rows.data[0].instructions[0],
          selectedVals
        });
      } catch (error) {
        console.error(error);
      }
    }
  }

  onRowClick = (e, row, ind) => {
    const { instructions } = row;
    const { selectedVals } = this.state;
    const vInd = selectedVals[ind];
    const instruction = !instructions[vInd] || instructions[vInd] === '' ? '###### Instruction Information not provided' : instructions[vInd];
    this.setState({
      preview: instruction
    });
  }

  onChangeSelect = (e, rowInd) => {
    const selectVal = e.currentTarget.value;
    this.setState((prevState, prevProps) => {
      let { selectedVals, rows } = prevState;
      selectedVals[rowInd] = Number(selectVal);
      const preview = rows[rowInd].instructions[selectVal];
      return { ...prevState, selectedVals, preview };
    });
  }


  render() {
    const { createForm, preview, rows } = this.state;
    return (
      <div className="App">
        <Header />
        <Card className='d-flex flex-row card'>
          <div className='d-flex flex-column card-container'>
            <div className={`${!createForm ? 'ml-auto' : 'mr-auto ml-2'} py-2`} >
              <button className='btn btn-primary'
                onClick={this.showCreateForm} >
                {!createForm ? <i className="fas fa-plus" /> : null}
                {!createForm ? ' Create' : 'Back'}
              </button>
            </div>
            <div className='grid-container mr-auto my-2 ml-2'>
              {
                createForm ? <StoreTool preview={preview} handleInput={this.handleInstruction} /> : <Grid rows={rows} columns={['name', 'versions', 'download']}
                  onRowClick={this.onRowClick}
                  onChangeSelect={this.onChangeSelect} />
              }
            </div>
          </div>
          <InstructionPreview className='mr-auto px-2' isPreview={createForm}
            previewText={(!preview || preview === null) && !createForm ? '##### Information not provided' : preview} />
        </Card>
      </div>
    );
  }
}

export default App;
