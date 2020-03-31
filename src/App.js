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

  handleInstruction = (e) => {
    this.setState({ preview: e.currentTarget.value });
  }

  async componentDidMount() {
    if (!this.state.createForm) {
      try {
        const rows = await axios.get('http://localhost:4000/service/aggregate');
        const selectedVals = rows.data.map(val => 0);
        // Using redux we have put this into state
        this.props.getToolList({
          rows: rows.data,
          preview: rows.data[0].instructions[0],
          selectedVals
        });
      } catch (error) {
        console.error(error);
      }
    }
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

  onDelete = async (e, rowInd) => {
    try {
      const { selectedVals, rows } = this.state;
      const row = rows[rowInd];
      const versionSelVal = selectedVals[rowInd];
      const id = row.ids[versionSelVal];
      const res = await axios.delete(`http://localhost:4000/service/delete/${id}`);
      alert(`${res.data.versioned_name} has been deleted Successfully`);
      this.setState((prevState, prevProps) => {
        // Removing elements in respective arrays
        prevState.rows[rowInd].ids.splice(versionSelVal, 1);
        prevState.rows[rowInd].versionedNames.splice(versionSelVal, 1);
        prevState.rows[rowInd].versions.splice(versionSelVal, 1);
        prevState.rows[rowInd].instructions.splice(versionSelVal, 1);
        // Setting the preview value
        const preview = prevState.rows[rowInd].instructions[versionSelVal];
        return { ...prevState, preview };
      });
    } catch (error) {
      console.error(error);
    }
  }


  render() {
    // const { preview, rows, selectedVals } = this.state;
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
                {!createForm ? <i className="fas fa-plus" /> : null}
                {!createForm ? ' Create' : 'Back'}
              </button>
            </div>
            <div className='grid-container mr-auto my-2 ml-2'>
              {
                createForm ? <StoreTool preview={preview} /> : <Grid rows={rows} columns={['name', 'versions', 'download', 'delete']}
                  selectedVals={selectedVals}
                  onChangeSelect={this.onChangeSelect}
                  onDelete={this.onDelete} />
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
