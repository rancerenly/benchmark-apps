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

const clearRows = () => {
  data.value = [];
  selected.value = null;
  markRenderComplete();
};

const updateRows = () => {
  data.value = data.value.map((row, index) =>
      index % 10 === 0 ? {...row, label: row.label + " !!!"} : row
  );
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

const selectRow = (id) => {
  selected.value = id;
};

const markRenderComplete = async () => {
  await nextTick();
  renderComplete.value = true;
};
</script>

<template>
  <div class="container">
    <div class="jumbotron">
      <h1>Vue Benchmark</h1>
      <div>
        <button id="btn-add-rows" class="btn btn-primary" @click="addRows">Add 1000 Rows</button>
        <button id="btn-create-10k" class="btn btn-primary" @click="create10k">Create 10,000 Rows</button>
        <button id="btn-clear" class="btn btn-primary" @click="clearRows">Clear Rows</button>
        <button id="btn-swap" class="btn btn-primary" @click="swapRows">Swap Rows</button>
        <button id="btn-update" class="btn btn-primary" @click="updateRows">Update every 10th Row</button>
      </div>
    </div>
    <table class="table table-hover">
      <tbody>
      <tr v-for="row in data" :key="row.id" :class="{ danger: selected === row.id }">
        <td>{{ row.id }}</td>
        <td><a href="#" @click.prevent="selectRow(row.id)">{{ row.label }}</a></td>
        <td>
          <button :id="'btn-delete-' + row.id" @click="removeRow(row.id)">Delete</button>
        </td>
      </tr>
      </tbody>
    </table>
    <div id="render-complete" v-show="renderComplete">Render Complete</div>
  </div>
</template>

<style>
.danger {
  background-color: #fdd;
}
</style>
