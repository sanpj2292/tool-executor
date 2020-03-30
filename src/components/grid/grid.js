import React from 'react';
import axios from 'axios';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import Preview from "../preview/preview";
import SyntaxStyleRenderer from "../markdown/syntax-style-renderer";
import './grid.scss';

class Grid extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            rows: [],
            selectedVals: [0, 0]
        }
    }


    async componentDidMount() {
        try {
            const rows = await axios.get('http://localhost:4000/service/aggregate');
            this.setState({ rows: rows.data });
        } catch (error) {
            console.error(error);
        }
    }

    renderHeader = () => {
        const { columns } = this.props;
        return columns.map((column, i) => (
            <th key={`grid-header-${i}`} scope='col'>{
                `${column[0].toUpperCase()}${column.substring(1)}`}
            </th>
        ));
    }
    onChangeSelect = (e, rowInd) => {
        const selectVal = e.currentTarget.value;
        this.setState((prevState, prevProps) => {
            let { selectedVals } = prevState;
            selectedVals[rowInd] = selectVal;
            return { ...prevState, selectedVals };
        })
    }

    renderGridSelect = (row, rowInd) => {
        const { selectedVals } = this.state;
        return (
            <select key={`select-row-${rowInd}`}
                className="custom-select custom-select-sm"
                defaultValue={selectedVals[rowInd]}
                onChange={e => this.onChangeSelect(e, rowInd)}>
                {
                    row.versions.map((opt, i) => (
                        <option key={`${row.name}-opt-${i}`} value={i} >{opt}</option>
                    ))
                }
            </select>
        );
    }

    onDownload = async (e, rowInd) => {
        alert('Come to onDownload')
        try {
            const { selectedVals, rows } = this.state;
            const versionSelVal = selectedVals[rowInd];
            const id = rows[rowInd].ids[versionSelVal];
            window.location = `http://localhost:4000/service/download/${id}`;
        } catch (error) {
            console.error(error);
        }
    }
    renderPopOver = (row, ind) => {
        const { name, versions, instructions } = row;
        const { selectedVals } = this.state;
        const vInd = selectedVals[ind];
        const instruction = !instructions[vInd] || instructions[vInd] === '' ? '###### Instruction Information not provided' : instructions[vInd];
        return (
            <Popover key={`popover-container-${vInd}-${ind}`} id="popover-basic"
                className='mw-50vw'>
                <Popover.Title key={`popover-title-${vInd}-${ind}`} as="h4">
                    Guide for {name}-V{versions[vInd]}
                </Popover.Title>
                <Popover.Content key={`popover-content-${vInd}-${ind}`}>
                    <Preview key={`prev-comp-${vInd}-${ind}`}
                        name='preview-instruction'
                        previewValue={instruction}
                        renderers={{
                            code: SyntaxStyleRenderer
                        }}
                    />
                </Popover.Content>
            </Popover>);
    }

    render() {
        const { rows } = this.state;
        const { renderHeader, renderGridSelect } = this;
        return (
            <table className="table table-hover table-dark">
                <thead>
                    <tr>{renderHeader()}</tr>
                </thead>
                <tbody>
                    {
                        rows && rows.length > 0 ? (rows.map((row, ind) => (
                            <OverlayTrigger key={`overlay-trig-${ind}`}
                                trigger="click"
                                placement="right-start"
                                rootClose={true}
                                overlay={this.renderPopOver(row, ind)}
                            >
                                <tr key={`row-${ind}`}>
                                    <td key={`row-name-td-${ind}`}>
                                        <div className='container' >
                                            <u style={{ color: 'white' }}
                                                onClick={e => this.onDownload(e, ind)}>
                                                {row.name}
                                            </u>
                                        </div>
                                    </td>
                                    <td key={`row-grid-${ind}`}>{renderGridSelect(row, ind)}</td>
                                </tr>
                            </OverlayTrigger>
                        ))) : null
                    }
                </tbody>
            </table>
        );
    }

}

export default Grid;