<script>
  import { writable } from 'svelte/store';

  const A = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint"];
  const C = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "white", "black", "orange"];
  const N = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger"];

  let nextId = 1;

  const buildData = (count) =>
    Array.from({ length: count }, () => ({
      id: nextId++,
      label: `${A[Math.floor(Math.random() * A.length)]} ${C[Math.floor(Math.random() * C.length)]} ${N[Math.floor(Math.random() * N.length)]}`
    }));

  const data = writable([]);
  const selected = writable(null);
  const renderComplete = writable(false);

  function updateRenderStatus() {
    renderComplete.set(false);
    setTimeout(() => renderComplete.set(true), 0);
  }

  function run() {
    data.set(buildData(1000));
    selected.set(null);
    updateRenderStatus();
  }

  function runLots() {
    data.set(buildData(10000));
    selected.set(null);
    updateRenderStatus();
  }

  function add() {
    data.update(d => [...d, ...buildData(1000)]);
    updateRenderStatus();
  }

  function update() {
    data.update(d => d.map(item => ({ ...item, label: item.label + " !!!" })));
    updateRenderStatus();
  }

  function updateEvery10th() {
    data.update(d => d.map((item, index) =>
      index % 10 === 0 ? { ...item, label: item.label + " !!!" } : item));
    updateRenderStatus();
  }

  function clear() {
    data.set([]);
    selected.set(null);
    updateRenderStatus();
  }

  function swapRows() {
    data.update(d => {
      if (d.length > 2) {
        const newData = [...d];
        [newData[1], newData[2]] = [newData[2], newData[1]]; // меняем местами 2 строки
        return newData;
      }
      return d;
    });
    updateRenderStatus();
  }

  function remove(id) {
    data.update(d => d.filter(row => row.id !== id));
    updateRenderStatus();
  }

  function select() {
    console.log('select');
    selected.set(1);
  }
</script>

<div class="container">
  <div class="jumbotron">
    <h1>Svelte Benchmark</h1>
    <div class="row">
      <!-- Кнопки -->
      <div class="col-sm-6 smallpad">
        <button id="btn-add-rows" class="btn btn-primary btn-block" on:click={run}>Create 1,000 rows</button>
      </div>
      <div class="col-sm-6 smallpad">
        <button id="btn-create-10k" class="btn btn-primary btn-block" on:click={runLots}>Create 10,000 rows</button>
      </div>
      <div class="col-sm-6 smallpad">
        <button id="btn-add" class="btn btn-primary btn-block" on:click={add}>Append 1,000 rows</button>
      </div>
      <div class="col-sm-6 smallpad">
        <button id="btn-update" class="btn btn-primary btn-block" on:click={update}>Update all rows</button>
      </div>
      <div class="col-sm-6 smallpad">
        <button id="btn-update-10" class="btn btn-primary btn-block" on:click={updateEvery10th}>Update every 10th row</button>
      </div>
      <div class="col-sm-6 smallpad">
        <button id="btn-select" class="btn btn-primary btn-block" on:click={() => select()}>Select row</button>
      </div>
      <div class="col-sm-6 smallpad">
        <button id="btn-swap" class="btn btn-primary btn-block" on:click={swapRows}>Swap rows</button>
      </div>
      <div class="col-sm-6 smallpad">
        <button id="btn-clear" class="btn btn-primary btn-block" on:click={clear}>Clear</button>
      </div>
    </div>
  </div>

  <!-- Таблица данных -->
  <table class="table table-hover table-striped test-data">
    <tbody>
      {#each $data as row (row.id)}
        <tr class:danger={$selected === row.id}>
          <td class="col-md-1">{row.id}</td>
          <td class="col-md-4">
            <a>{row.label}</a>
          </td>
          <td class="col-md-1">
            <button class="btn btn-danger" on:click|stopPropagation={() => remove(row.id)}>
              <span class="glyphicon glyphicon-remove" aria-hidden="true"></span> Delete
            </button>
          </td>
          <td class="col-md-6"></td>
        </tr>
      {/each}
    </tbody>
  </table>

  {#if $renderComplete}
    <div id="render-complete">Render Complete</div>
  {/if}
</div>

<style>
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
