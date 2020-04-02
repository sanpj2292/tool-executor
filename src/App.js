import React from 'react';
import './App.css';
import Header from './components/header/header';
import StoreTool from './components/tool/store-tool';
import axios from "axios";
import socketIOClient from "socket.io-client";
import Grid from './components/grid/grid';
import Card from 'react-bootstrap/Card';
import InstructionPreview from "./components/instruction/instruction-preview";
import { connect } from "react-redux";
import { getToolList, showCreateForm } from "./redux/actions";


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

  handleSubmit = (e) => {
    e.preventDefault();
    const folderVal = e.target.folder.value;
    this.setState({ folder: folderVal });
  }

  handleExecute = (e) => {
    const socket = socketIOClient('http://localhost:4000/sendHello');
    socket.on('hello', data => alert(data));
  };

  async componentDidMount() {
    if (!this.state.createForm) {
      try {
        const { getToolList } = this.props;
        const rows = await axios.get('http://localhost:4000/service/aggregate');
        if (rows.data.length > 0) {
          const selectedVals = rows.data.map(val => 0);
          // Using redux we have put this into state
          getToolList({
            rows: rows.data,
            preview: rows.data[0].instructions[0],
            selectedVals
          });
        } else {
          getToolList({
            createForm: false,
            preview: '',
            rows: [],
            selectedVals: []
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  render() {
    const { showCreateForm, createForm, rows, selectedVals, preview } = this.props;
    return (
      <div className="App">
        <Header />
        <Card className='d-flex flex-row card'>
          <div className='d-flex flex-column card-container'>
            <div className={`${!createForm ? 'ml-auto' : 'mr-auto ml-2'} py-2`} >
              <button className='btn btn-primary'
                onClick={() => showCreateForm({
                  createForm: !createForm,
                  preview: ''
                })} >
                {!createForm ? 'Create' : 'Back'}
              </button>
            </div>
            <div className='table-responsive grid-container mr-auto my-2 ml-2'>
              {
                createForm ? <StoreTool preview={preview} /> : <Grid rows={rows} columns={['name', 'versions', 'download', 'delete']}
                  selectedVals={selectedVals} />
              }
            </div>
          </div>
          <InstructionPreview containerClass='mr-auto px-2' />
        </Card>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    ...state
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getToolList: (stateData) => dispatch(getToolList(stateData)),
    showCreateForm: (state) => dispatch(showCreateForm(state))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
