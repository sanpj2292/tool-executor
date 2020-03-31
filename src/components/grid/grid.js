import React from 'react';
import './grid.scss';
import { previewChange, versionChange } from "../../redux/actions";
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
        const instruction = !instructions[vInd] || instructions[vInd] === '' ? '###### Instruction Information not provided' : instructions[vInd];
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
                defaultValue={0}
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
            window.location = `http://localhost:4000/service/download/${id}`;
        } catch (error) {
            console.error(error);
        }
    }

    render() {
        const { rows, onDelete } = this.props;
        const { renderHeader, renderGridSelect } = this;
        return (
            <table className="table table-hover table-dark">
                <thead>
                    <tr>{renderHeader()}</tr>
                </thead>
                <tbody>
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
                                            onDelete(e, ind);
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
        versionChange: (preview) => dispatch(versionChange(preview))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Grid);