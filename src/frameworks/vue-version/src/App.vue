<script setup>
import { ref, shallowRef } from 'vue'
let ID = 1;

function _random(max) {
  return Math.round(Math.random() * 1000) % max;
}

function buildData(count = 1000) {
  const adjectives = [
    "pretty",
    "large",
    "big",
    "small",
    "tall",
    "short",
    "long",
    "handsome",
    "plain",
    "quaint",
    "clean",
    "elegant",
    "easy",
    "angry",
    "crazy",
    "helpful",
    "mushy",
    "odd",
    "unsightly",
    "adorable",
    "important",
    "inexpensive",
    "cheap",
    "expensive",
    "fancy",
  ];
  const colours = [
    "red",
    "yellow",
    "blue",
    "green",
    "pink",
    "brown",
    "purple",
    "brown",
    "white",
    "black",
    "orange",
  ];
  const nouns = [
    "table",
    "chair",
    "house",
    "bbq",
    "desk",
    "car",
    "pony",
    "cookie",
    "sandwich",
    "burger",
    "pizza",
    "mouse",
    "keyboard",
  ];
  const data = [];
  for (let i = 0; i < count; i++)
    data.push({
      id: ID++,
      label:
          adjectives[_random(adjectives.length)] +
          " " +
          colours[_random(colours.length)] +
          " " +
          nouns[_random(nouns.length)],
    });
  return data;
}


const selected = ref()
const rows = shallowRef([])

function setRows(update = rows.value.slice()) {
  rows.value = update
}

function add() {
  rows.value = rows.value.concat(buildData(1000))
}

function remove(id) {
  rows.value.splice(
      rows.value.findIndex((d) => d.id === id),
      1
  )
  setRows()
}

function select(id) {
  selected.value = id
}

function run() {
  setRows(buildData())
  selected.value = undefined
}

function update() {
  const _rows = rows.value
  for (let i = 0; i < _rows.length; i += 10) {
    _rows[i].label += ' !!!'
  }
  setRows()
}

function updateAll() {
  const _rows = rows.value
  for (let i = 0; i < _rows.length; i += 1) {
    _rows[i].label += ' !!!'
  }
  setRows()
}


function runLots() {
  setRows(buildData(10000))
  selected.value = undefined
}

function clear() {
  setRows([])
  selected.value = undefined
}

function swapRows() {
  const _rows = rows.value
  if (_rows.length > 998) {
    const d1 = _rows[1]
    const d998 = _rows[998]
    _rows[1] = d998
    _rows[998] = d1
    setRows()
  }
}
</script>

<template>
  <div class="jumbotron">
    <div class="row">
      <div class="col-md-6">
        <h1>Vue.js 3</h1>
      </div>
      <div class="col-md-6">
        <div class="row">
          <div class="col-sm-6 smallpad">
            <button
                type="button"
                class="btn btn-primary btn-block"
                id="btn-add-rows"
                @click="run"
            >
              Create 1,000 rows
            </button>
          </div>
          <div class="col-sm-6 smallpad">
            <button
                type="button"
                class="btn btn-primary btn-block"
                id="btn-create-10k"
                @click="runLots"
            >
              Create 10,000 rows
            </button>
          </div>
          <div class="col-sm-6 smallpad">
            <button
                type="button"
                class="btn btn-primary btn-block"
                id="btn-add"
                @click="add"
            >
              Append 1,000 rows
            </button>
          </div>
          <div class="col-sm-6 smallpad">
            <button
                type="button"
                class="btn btn-primary btn-block"
                id="btn-update"
                @click="updateAll"
            >
              Append 1,000 rows
            </button>
          </div>
          <div class="col-sm-6 smallpad">
            <button
                type="button"
                class="btn btn-primary btn-block"
                id="btn-update-10"
                @click="update"
            >
              Update every 10th row
            </button>
          </div>
          <div class="col-sm-6 smallpad">
            <button
                type="button"
                class="btn btn-primary btn-block"
                id="btn-clear"
                @click="clear"
            >
              Clear
            </button>
          </div>
          <div class="col-sm-6 smallpad">
            <button
                type="button"
                class="btn btn-primary btn-block"
                id="btn-swap"
                @click="swapRows"
            >
              Swap Rows
            </button>
            <button
                type="button"
                class="btn btn-primary btn-block"
                id="btn-select"
                @click="select(1)"
            >
              Select
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <table class="table table-hover table-striped test-data">
    <tbody>
    <tr
        v-for="{ id, label } of rows"
        :key="id"
        :class="{ danger: id === selected }"
        :data-label="label"
        v-memo="[label, id === selected]"
    >
      <td class="col-md-1">{{ id }}</td>
      <td class="col-md-4">
        <a @click="select(id)">{{ label }}</a>
      </td>
      <td class="col-md-1">
        <button class="btn btn-danger" @click="remove(id)">
          <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
        </button>
      </td>
      <td class="col-md-6"></td>
    </tr>
    </tbody>
  </table>
</template>

<style scoped>
body {
  font-family: Arial, sans-serif;
  background-color: #f4f7fa;
  color: #333;
  margin: 0;
  padding: 0;
}

.container {
  font-family: Arial, sans-serif;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 20px;
}

.jumbotron {
  background-color: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

button.btn {
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

button.btn.btn-danger:hover {
  background-color: #b30000;
}

button.btn:hover {
  background-color: #0056b3;
}

button.btn-primary {
  background-color: #007bff;
  color: #fff;
}

button.btn-primary:focus {
  outline: none;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

button.btn-block {
  width: 100%;
  margin-bottom: 10px;
}

.default-padding {
  padding: 5px;
}

.row {
  display: flex;
  justify-content: space-between;
}


table.table {
  width: 100%;
  margin-top: 20px;
  border-collapse: collapse;
  background-color: #fff;
}

table.table th,
table.table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

table.table-hover tbody tr:hover {
  background-color: #f1f1f1;
}

table.table-striped tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

table.table-striped tbody tr.danger {
  background-color: #f8d7da;
}

table.table a {
  text-decoration: none;
  color: #007bff;
  cursor: pointer;
}

table.table a:hover {
  text-decoration: underline;
}

</style>
