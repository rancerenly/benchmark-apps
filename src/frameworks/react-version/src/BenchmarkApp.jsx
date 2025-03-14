import { memo, useReducer, useEffect } from "react";

const random = (max) => Math.round(Math.random() * 1000) % max;

const A = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean",
    "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive",
    "cheap", "expensive", "fancy"];
const C = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const N = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse",
    "keyboard"];

let nextId = 1;

const buildData = (count) => {
    return Array.from({ length: count }, () => ({ id: nextId++, label: `${A[random(A.length)]} ${C[random(C.length)]} ${N[random(N.length)]}` }));
};

const initialState = { data: [], selected: null, renderComplete: false };

const listReducer = (state, action) => {
    let newData;
    switch (action.type) {
        case "RUN":
            return { data: buildData(1000), selected: null, renderComplete: false };
        case "RUN_LOTS":
            return { data: buildData(10000), selected: null, renderComplete: false };
        case "ADD":
            return { data: [...state.data, ...buildData(1000)], selected: state.selected, renderComplete: false };
        case "UPDATE":
            newData = state.data.map((item, index) => index % 10 === 0 ? { ...item, label: item.label + " !!!" } : item);
            return { data: newData, selected: state.selected, renderComplete: false };
        case "CLEAR":
            return { data: [], selected: null, renderComplete: false };
        case "SWAP_ROWS":
            if (state.data.length > 2) {
                newData = [...state.data];
                [newData[1], newData[2]] = [newData[2], newData[1]];
                return { data: newData, selected: state.selected, renderComplete: false };
            }
            return state;
        case "REMOVE":
            return { data: state.data.filter((row) => row.id !== action.id), selected: state.selected, renderComplete: false };
        case "SELECT":
            return { data: state.data, selected: action.id, renderComplete: false };
        case "RENDER_COMPLETE":
            return { ...state, renderComplete: true };
        default:
            return state;
    }
};

const Row = memo(({ selected, item, dispatch }) => (
    <tr className={selected ? "danger" : ""} onClick={() => dispatch({ type: "SELECT", id: item.id })}>
        <td>{item.id}</td>
        <td>{item.label}</td>
        <td>
            <button id={`btn-delete-${item.id}`} onClick={(e) => { e.stopPropagation(); dispatch({ type: "REMOVE", id: item.id }); }}>Delete</button>
        </td>
    </tr>
));

const Button = ({ id, cb, title }) => (
    <button type="button" className="btn btn-primary" id={id} onClick={cb}>{title}</button>
);

const BenchmarkApp = () => {
    const [state, dispatch] = useReducer(listReducer, initialState);

    useEffect(() => {
        if (state.data.length >= 0) {
            dispatch({ type: "RENDER_COMPLETE" });
        }
    }, [state.data]);

    return (
        <div className="container">
            <div className="jumbotron">
                <h1>React Benchmark</h1>
                <div>
                    <Button id="btn-add-rows" title="Add 1000 Rows" cb={() => dispatch({ type: "RUN" })} />
                    <Button id="btn-create-10k" title="Create 10,000 Rows" cb={() => dispatch({ type: "RUN_LOTS" })} />
                    <Button id="btn-clear" title="Clear Rows" cb={() => dispatch({ type: "CLEAR" })} />
                    <Button id="btn-swap" title="Swap Rows" cb={() => dispatch({ type: "SWAP_ROWS" })} />
                    <Button id="btn-update" title="Update every 10th Row" cb={() => dispatch({ type: "UPDATE" })} />
                </div>
            </div>
            <table className="table table-hover">
                <tbody>
                {state.data.map((row) => <Row key={row.id} item={row} selected={state.selected === row.id} dispatch={dispatch} />)}
                </tbody>
            </table>
            <div id="render-complete" style={{ display: state.renderComplete ? "block" : "none" }}>Render Complete</div>
        </div>
    );
};

export default BenchmarkApp;
