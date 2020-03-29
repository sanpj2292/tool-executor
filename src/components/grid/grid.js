import React from 'react';
import axios from 'axios';

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
                            <tr key={`row-${ind}`}>
                                <td key={`row-name-td-${ind}`}>
                                    <div className='container' onClick={e => this.onDownload(e, ind)}>
                                        <u style={{ color: 'white' }}>{row.name}</u>
                                    </div>
                                </td>
                                <td key={`row-grid-${ind}`}>{renderGridSelect(row, ind)}</td>
                            </tr>
                        ))) : null
                    }
                </tbody>
            </table>
        );
    }

}

export default Grid;