import './styles.css';
import { useState } from "react";

const A = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint"];
const C = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "white", "black", "orange"];
const N = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger"];

const random = (max) => Math.round(Math.random() * 1000) % max;

let nextId = 1;

const buildData = (count) => {
    return Array.from({ length: count }, () => ({
        id: nextId++,
        label: `${A[random(A.length)]} ${C[random(C.length)]} ${N[random(N.length)]}`
    }));
};

const App = () => {
    const [data, setData] = useState([]);
    const [selected, setSelected] = useState(null);

    const updateRows = () => {
        setData(data.map(row => ({ ...row, label: row.label + ' !!!' })));
    };

    const updateEvery10thRow = () => {
        setData(data.map((row, index) => index % 10 === 0 ? { ...row, label: row.label + ' !!!' } : row));
    };

    const removeRow = (id) => {
        setData(data.filter(row => row.id !== id));
    };

    const addRows = () => {
        setData([...data, ...buildData(1000)]);
    };

    const runLots = () => {
        setData(buildData(10000));
    };

    const clearRows = () => {
        setData([]);
        setSelected(null);
    };

    const swapRows = () => {
        if (data.length > 2) {
            const newData = [...data];
            [newData[1], newData[2]] = [newData[2], newData[1]];
            setData(newData);
        }
    };

    const selectRow = (id) => {
        setSelected(id);
    };

    const Button = ({ title, onClick, id }) => (
        <button className="btn btn-primary btn-block" id={id} onClick={onClick}>{title}</button>
    );

    return (
        <div className="container">
            <div className="jumbotron">
                <h1>React</h1>
                <div className="row">
                    <div className="col-sm-6 smallpad">
                        <Button id="btn-add-rows" title="Create 1,000 rows" onClick={() => setData(buildData(1000))} />
                    </div>
                    <div className="col-sm-6 smallpad">
                        <Button id="btn-create-10k" title="Create 10,000 rows" onClick={runLots} />
                    </div>
                    <div className="col-sm-6 smallpad">
                        <Button id="btn-add" title="Append 1,000 rows" onClick={addRows} />
                    </div>
                    <div className="col-sm-6 smallpad">
                        <Button id="btn-update" title="Update all rows" onClick={updateRows} />
                    </div>
                    <div className="col-sm-6 smallpad">
                        <Button id="btn-update-10" title="Update every 10th row" onClick={updateEvery10thRow} />
                    </div>
                    <div className="col-sm-6 smallpad">
                        <Button id="btn-select" title="Select row" onClick={() => selectRow(data[0]?.id)} />
                    </div>
                    <div className="col-sm-6 smallpad">
                        <Button id="btn-swap" title="Swap Rows" onClick={swapRows} />
                    </div>
                    <div className="col-sm-6 smallpad">
                        <Button id="btn-clear" title="Clear" onClick={clearRows} />
                    </div>
                </div>
            </div>

            <table className="table table-hover table-striped">
                <tbody>
                {data.map(row => (
                    <tr key={row.id} className={selected === row.id ? 'danger' : ''}>
                        <td>{row.id}</td>
                        <td>{row.label}</td>
                        <td>
                            <button className="btn btn-danger btn-sm" onClick={() => removeRow(row.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default App;
