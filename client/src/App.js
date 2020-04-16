import React from 'react';
import './App.css';
import Header from './components/header/header';
import StoreTool from './components/tool/store-tool';
import axios from "axios";
import Grid from './components/grid/grid';
import Card from 'react-bootstrap/Card';
import InstructionPreview from "./components/instruction/instruction-preview";
import { connect } from "react-redux";
import { getToolList, showCreateForm } from "./redux/actions";
import TimeoutAlert from "./components/alert/timeout-alert";
import { showAlert } from "./redux/actions";

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

  async componentDidMount() {
    const { showAlert } = this.props;
    if (!this.props.createForm) {
      try {
        const { getToolList } = this.props;
        const rows = await axios.get('/api/service/aggregate');
        if (rows.data.length > 0) {
          showAlert({ variant: 'success', message: 'Data successfully fetched' });
          const selectedVals = rows.data.map(val => 0);
          // Using redux we have put this into state
          getToolList({
            rows: rows.data,
            preview: rows.data[0].instructions[0],
            selectedVals
          });

        } else {
          showAlert({ variant: 'info', message: 'Data is empty in DB' });
          getToolList({
            createForm: false,
            preview: '',
            rows: [],
            selectedVals: []
          });
        }
      } catch (error) {
        return showAlert({
          variant: 'danger',
          message: error.message ? error.message : 'Could not load the data'
        });
      }
    }
  }

  render() {
    const { showCreateForm, createForm, rows, selectedVals, preview, alert } = this.props;
    return (
      <div className="App">
        <Header />
        {alert.message && alert.message.length > 0 ? <TimeoutAlert {...alert} /> : null}
        <Card className='d-flex flex-row card'>
          <div className='d-flex flex-column card-container'>
            <div className={`${!createForm ? 'ml-auto' : 'mr-auto ml-2'} py-2`} >
              <button className='btn btn-primary'
                onClick={() => {
                  showCreateForm({
                    createForm: !createForm,
                    preview: rows.length > 0 && createForm ? rows[0].instructions[selectedVals[0]] : ''
                  })
                }} >
                {!createForm ? 'Create' : 'Back'}
              </button>
            </div>
            <div className='table-responsive grid-container mr-auto my-2 ml-2'>
              {
                createForm ? <StoreTool preview={preview} /> :
                  <Grid rows={rows} selectedVals={selectedVals}
                    columns={['name', 'versions', 'download', 'delete', 'update']} />
              }
            </div>
          </div>
          <div className='px-3 mt-2 border-right h-80'></div>
          <InstructionPreview containerClass='px-2 ml-3' />
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
    showCreateForm: (state) => dispatch(showCreateForm(state)),
    showAlert: ({ variant, message }) => dispatch(showAlert({ variant, message }))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);