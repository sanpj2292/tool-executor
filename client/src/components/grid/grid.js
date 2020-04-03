import React from 'react';
import './grid.scss';
import axios from 'axios';
import { previewChange, deleteTool } from "../../redux/actions";
import { connect } from "react-redux";
import { ReactComponent as DownloadIcon } from "../../icons/download.svg";
import { ReactComponent as DeleteIcon } from "../../icons/delete.svg";
import GridSelect from "./grid-select";

class Grid extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            rows: [],
            selectedVals: [0, 0]
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

    onRowClick = (e, row, ind) => {
        const { instructions } = row;
        const { selectedVals, previewChange } = this.props;
        const vInd = selectedVals[ind];
        const instruction = instructions[vInd];
        previewChange(instruction);
    }

    onDownload = async (e, rowInd) => {
        try {
            const { selectedVals, rows } = this.props;
            const versionSelVal = selectedVals[rowInd];
            const id = rows[rowInd].ids[versionSelVal];
            window.location = `/download/${id}`;
        } catch (error) {
            console.error(error);
        }
    }

    onDelete = async (e, rowInd) => {
        try {
            const oldProps = { ...this.props };
            const { selectedVals: oldSelectedVals, rows: oldRows, deleteTool } = oldProps;
            const row = oldRows[rowInd];
            const versionSelVal = oldSelectedVals[rowInd];
            const id = row.ids[versionSelVal];
            const res = await axios.delete(`/delete/${id}`);
            const { rows, deleted } = res.data;
            alert(`${deleted.versioned_name} has been deleted Successfully`);
            let preview = '';
            let selectedVals = [...oldSelectedVals];
            if (rows.length >= 1) {
                // Versions condition check
                if (rows[rowInd]) {
                    // Setting the preview value and selectedVals
                    if (versionSelVal - 1 < 0) {
                        selectedVals[rowInd] = 0;
                        preview = rows[rowInd].instructions[0];
                    } else {
                        const selVal = versionSelVal - 1;
                        selectedVals[rowInd] = selVal;
                        preview = rows[rowInd].instructions[selVal];
                    }
                } else {
                    // Only a single version remaining condition
                    // Remove related Row's Selected Vals(as Row itself is removed)
                    selectedVals.splice(rowInd, 1);
                    if (rows.length >= 1) {
                        // Only one row remaining coniditon
                        if (rowInd - 1 > 0) {
                            const selVal = selectedVals[rowInd - 1];
                            preview = rows[rowInd - 1].instructions[selVal];
                        } else {
                            preview = rows[0].instructions[selectedVals[0]];
                        }
                    }
                }
            }
            deleteTool({ rows, preview, selectedVals });
        } catch (error) {
            console.error(error);
        }
    }

    render() {
        const { renderHeader, props: { rows } } = this;
        return (
            <table className="table table-hover table-dark">
                <thead>
                    <tr>{renderHeader()}</tr>
                </thead>
                <tbody className='row-auto'>
                    {
                        rows && rows.length > 0 ? (rows.map((row, ind) => (
                            <tr key={`row-${ind}`} onClick={e => this.onRowClick(e, row, ind)}>
                                <td key={`row-name-td-${ind}`}>
                                    <u style={{ color: 'white' }}>
                                        {row.name}
                                    </u>
                                </td>
                                <td key={`row-grid-${ind}`}>
                                    <GridSelect rowData={{ row, rowInd: ind }} />
                                </td>
                                <td key={`row-grid-dwnlod-${ind}`}>
                                    <button className='btn btn-info btn-sm'
                                        onClick={e => this.onDownload(e, ind)} >
                                        <DownloadIcon style={{ paddingTop: '2px' }} />
                                    </button>
                                </td>
                                <td key={`row-del-${ind}`}>
                                    <button className='btn btn-danger btn-sm'
                                        onClick={e => {
                                            e.stopPropagation();
                                            this.onDelete(e, ind);
                                        }}>
                                        <DeleteIcon style={{ paddingTop: '2px' }} />
                                    </button>
                                </td>
                            </tr>
                        ))) : null
                    }
                </tbody>
            </table>
        );
    }

}

const mapStateToProps = (state) => {
    const gridState = { ...state }
    delete gridState.createForm;
    return gridState;
};

const mapDispatchToProps = dispatch => {
    return {
        previewChange: (preview) => dispatch(previewChange(preview)),
        deleteTool: ({ rows, preview, selectedVals }) => dispatch(deleteTool({ rows, preview, selectedVals }))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Grid);