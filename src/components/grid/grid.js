import React from 'react';
import './grid.scss';
import axios from 'axios';
import { previewChange, versionChange, deleteTool } from "../../redux/actions";
import { connect } from "react-redux";

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

    onChangeSelect = (e, rowInd) => {
        const selectVal = e.currentTarget.value;
        let { selectedVals, rows, versionChange } = this.props;
        selectedVals[rowInd] = Number(selectVal);
        const preview = rows[rowInd].instructions[selectVal];
        versionChange({ selectedVals, preview });
    }

    renderGridSelect = (row, rowInd) => {
        return (
            <select key={`select-row-${rowInd}`}
                className="custom-select custom-select-sm"
                defaultValue={this.props.selectedVals[rowInd]}
                onClick={e => e.stopPropagation()}
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
        try {
            const { selectedVals, rows } = this.props;
            const versionSelVal = selectedVals[rowInd];
            const id = rows[rowInd].ids[versionSelVal];
            console.log(rows);
            window.location = `http://localhost:4000/service/download/${id}`;
        } catch (error) {
            console.error(error);
        }
    }

    onDelete = async (e, rowInd) => {
        try {
            const { selectedVals, rows, deleteTool } = this.props;
            const row = rows[rowInd];
            console.log(selectedVals);
            const versionSelVal = selectedVals[rowInd];
            console.log(row.ids);
            const id = row.ids[versionSelVal];
            const res = await axios.delete(`http://localhost:4000/service/delete/${id}`);
            alert(`${res.data.versioned_name} has been deleted Successfully`);
            let preview = '';
            if (rows.length >= 1) {
                if (rows[rowInd].ids.length > 1) {
                    // Removing elements in respective arrays
                    rows[rowInd].ids.splice(versionSelVal, 1);
                    rows[rowInd].versionedNames.splice(versionSelVal, 1);
                    rows[rowInd].versions.splice(versionSelVal, 1);
                    rows[rowInd].instructions.splice(versionSelVal, 1);
                    // Setting the preview value
                    preview = rows[rowInd].instructions[versionSelVal];
                    if (versionSelVal - 1 > 0) {
                        selectedVals[rowInd] -= 1;
                    } else {
                        selectedVals[rowInd] = 0;
                    }
                } else {
                    rows.splice(rowInd, 1);
                }
            }
            deleteTool({ rows, preview, selectedVals });
        } catch (error) {
            console.error(error);
        }
    }

    render() {
        const { renderHeader, renderGridSelect, props: { rows } } = this;
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
                                <td key={`row-grid-${ind}`}>{renderGridSelect(row, ind)}</td>
                                <td key={`row-grid-dwnlod-${ind}`}>
                                    <i className="fas fa-download"
                                        onClick={e => this.onDownload(e, ind)}>
                                    </i>
                                </td>
                                <td key={`row-del-${ind}`}>
                                    <i className="far fa-trash-alt"
                                        onClick={e => {
                                            e.stopPropagation();
                                            this.onDelete(e, ind);
                                        }}
                                    ></i>
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
}

const mapDispatchToProps = dispatch => {
    return {
        previewChange: (preview) => dispatch(previewChange(preview)),
        versionChange: (preview) => dispatch(versionChange(preview)),
        deleteTool: ({ rows, preview, selectedVals }) => dispatch(deleteTool({ rows, preview, selectedVals }))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Grid);