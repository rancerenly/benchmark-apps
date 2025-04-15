import { memo, useReducer } from 'react';
import './styles.css';

const random = (max) => Math.round(Math.random() * 1000) % max;

const A = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint"];
const C = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "white", "black", "orange"];
const N = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger"];

let nextId = 1;

const buildData = (count) => {
    const data = new Array(count);

    for (let i = 0; i < count; i++) {
        data[i] = {
            id: nextId++,
            label: `${A[random(A.length)]} ${C[random(C.length)]} ${N[random(N.length)]}`,
        };
    }

    return data;
};

const initialState = { data: [], selected: 0 };

const listReducer = (state, action) => {
    const { data, selected } = state;

    switch (action.type) {
        case 'RUN':
            return { data: buildData(1000), selected: 0 };
        case 'RUN_LOTS':
            return { data: buildData(10000), selected: 0 };
        case 'ADD':
            return { data: data.concat(buildData(1000)), selected };
        case 'UPDATE': {
            const newData = data.slice(0);

            for (let i = 0; i < newData.length; i += 10) {
                const r = newData[i];

                newData[i] = { id: r.id, label: r.label + " !!!" };
            }

            return { data: newData, selected };
        }
        case 'UPDATE_ALL': {
            const newData = data.slice(0);

            for (let i = 0; i < newData.length; i += 1) {
                const r = newData[i];

                newData[i] = { id: r.id, label: r.label + " !!!" };
            }

            return { data: newData, selected };
        }
        case 'CLEAR':
            return { data: [], selected: 0 };
        case 'SWAP_ROWS':
            const newdata = [...data];
            if (data.length > 998) {
                const d1 = newdata[1];
                const d2 = newdata[2];
                newdata[1] = d2;
                newdata[2] = d1;
            }
            return { data: newdata, selected };
        case 'REMOVE': {
            const idx = data.findIndex((d) => d.id === action.id);

            return { data: [...data.slice(0, idx), ...data.slice(idx + 1)], selected };
        }
        case 'SELECT':
            return { data, selected: action.id };
        default:
            return state;
    }
};



const Component = memo(({ dispatch }) => (
    <div className="container">
        <div className="jumbotron">
            <h1>React Hooks </h1>
            <div className="row">
                <div className="col-md-6">
                    <Button id="btn-add-rows" title="Create 1,000 rows" cb={() => dispatch({type: 'RUN'})}/>
                </div>
                <div className="col-md-6">
                    <Button id="btn-create-10k" title="Create 10,000 rows" cb={() => dispatch({type: 'RUN_LOTS'})}/>
                </div>
                <div className="col-md-6">
                    <Button id="btn-add" title="Append 1,000 rows" cb={() => dispatch({type: 'ADD'})}/>
                </div>
                <div className="col-md-6">
                    <Button id="btn-update" title="Update all rows" cb={() => dispatch({type: 'UPDATE_ALL'})}/>
                </div>
                <div className="col-md-6">
                    <Button id="btn-select" title="Select row" cb={() => dispatch({type: 'SELECT', id: 1001 })}/>
                </div>
                <div className="col-md-6">
                    <Button id="btn-update-10" title="Update every 10th row" cb={() => dispatch({type: 'UPDATE'})}/>
                </div>
                <div className="col-md-6">
                    <Button id="btn-clear" title="Clear" cb={() => dispatch({type: 'CLEAR'})}/>
                </div>
                <div className="col-md-6">
                    <Button id="btn-swap" title="Swap Rows" cb={() => dispatch({type: 'SWAP_ROWS'})}/>
                </div>
            </div>
        </div>
    </div>
), () => true);

const Row = memo(({selected, item, dispatch}) => (
    <tr className={selected ? "danger" : ""}>

    <td className="col-md-1">{item.id}</td>
        <td className="col-md-4">
            <a>{item.label}</a>
            <a onClick={() => dispatch({type: 'SELECT', id: item.id})}>{item.label}</a>
        </td>
        <td className="col-md-1">
            <button className="btn btn-danger btn-sm" onClick={() => dispatch({type: 'REMOVE', id: item.id})} > Delete </button>
        </td>
        <td className="col-md-6"/>
    </tr>
), (prevProps, nextProps) => prevProps.selected === nextProps.selected && prevProps.item === nextProps.item)

const Button = ({id, cb, title}) => (
    <div className="col-sm-6 smallpad">
        <button type="button" className="btn btn-primary btn-block" id={id} onClick={cb}>{title}</button>
    </div>
);

const App = () => {
    const [{data, selected}, dispatch] = useReducer(listReducer, initialState);

    console.log('selected', selected)
    return (<div className="container">
        <Component dispatch={dispatch}/>
        <table className="table table-hover table-striped test-data">
            <tbody>
            {data.map(item => (
                <Row key={item.id} item={item} selected={selected === item.id} dispatch={dispatch} />
            ))}
            </tbody>
        </table>
    </div>);
}

export default App;