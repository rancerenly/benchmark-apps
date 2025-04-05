<script setup>
import { ref, computed, nextTick } from 'vue';

const random = (max) => Math.floor(Math.random() * max);
const A = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint"];
const C = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const N = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger"];

let nextId = 1;

const buildData = (count) =>
    Array.from({ length: count }, () => ({
      id: nextId++,
      label: `${A[random(A.length)]} ${C[random(C.length)]} ${N[random(N.length)]}`
    }));

const data = ref([]);
const selected = ref(null);
const renderComplete = ref(false);

const addRows = () => {
  data.value = buildData(1000);
  selected.value = null;
  markRenderComplete();
};

const create10k = () => {
  data.value = buildData(10000);
  selected.value = null;
  markRenderComplete();
};

const addRowsBatch = () => {
  data.value = [...data.value, ...buildData(1000)];
  markRenderComplete();
};

const updateRows = () => {
  data.value = data.value.map((row) =>
      ({ ...row, label: row.label + " !!!" })
  );
  markRenderComplete();
};

const updateEvery10th = () => {
  data.value = data.value.map((row, index) =>
      index % 10 === 0 ? { ...row, label: row.label + " !!!" } : row
  );
  markRenderComplete();
};

const clearRows = () => {
  data.value = [];
  selected.value = null;
  markRenderComplete();
};

const swapRows = () => {
  if (data.value.length > 2) {
    [data.value[1], data.value[2]] = [data.value[2], data.value[1]];
    markRenderComplete();
  }
};

const removeRow = (id) => {
  data.value = data.value.filter((row) => row.id !== id);
  markRenderComplete();
};

const selectRow = () => {
  selected.value = 1;
};

const markRenderComplete = async () => {
  await nextTick();
  renderComplete.value = true;
};
</script>

<template>
  <div class="container">
    <div class="jumbotron">
      <h1>Vue </h1>
      <div class="row">
        <div class="col-sm-6 smallpad">
          <button id="btn-add-rows" class="btn btn-primary btn-block" @click="addRows">Create 1,000 rows</button>
        </div>
        <div class="col-sm-6 smallpad">
          <button id="btn-create-10k" class="btn btn-primary btn-block" @click="create10k">Create 10,000 rows</button>
        </div>
        <div class="col-sm-6 smallpad">
          <button id="btn-add" class="btn btn-primary btn-block" @click="addRowsBatch">Append 1,000 rows</button>
        </div>
        <div class="col-sm-6 smallpad">
          <button id="btn-update" class="btn btn-primary btn-block" @click="updateRows">Update all rows</button>
        </div>
        <div class="col-sm-6 smallpad">
          <button id="btn-update-10" class="btn btn-primary btn-block" @click="updateEvery10th">Update every 10th row
          </button>
        </div>
        <div class="col-sm-6 smallpad">
          <button id="btn-select" class="btn btn-primary btn-block" @click="selectRow">Select row</button>
        </div>
        <div class="col-sm-6 smallpad">
          <button id="btn-swap" class="btn btn-primary btn-block" @click="swapRows">Swap rows</button>
        </div>
        <div class="col-sm-6 smallpad">
          <button id="btn-clear" class="btn btn-primary btn-block" @click="clearRows">Clear</button>
        </div>
      </div>
    </div>
    <table class="table table-hover table-striped">
      <tbody>
      <tr v-for="row in data" :key="row.id" :class="{ danger: selected === row.id }">
        <td class="col-md-1">{{ row.id }}</td>
        <td class="col-md-4">
          <a href="#">{{ row.label }}</a>
        </td>
        <td class="col-md-1">
          <button :id="'btn-delete-' + row.id" class="btn btn-danger" @click="removeRow(row.id)">
            <span class="glyphicon glyphicon-remove" aria-hidden="true"></span> Delete
          </button>
        </td>
        <td class="col-md-6"></td>
      </tr>
      </tbody>
    </table>
    <div id="render-complete" v-show="renderComplete">Render Complete</div>
  </div>
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
