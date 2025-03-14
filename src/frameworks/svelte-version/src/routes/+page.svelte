<script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

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
        [newData[1], newData[2]] = [newData[2], newData[1]];
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

  function select(id) {
    selected.set(id);
  }
</script>

<div class="container">
  <div class="jumbotron">
    <h1>Svelte Benchmark</h1>
    <div>
      <button id="btn-add-rows" on:click={run}>Add 1000 Rows</button>
      <button id="btn-create-10k" on:click={runLots}>Create 10,000 Rows</button>
      <button id="btn-clear" on:click={clear}>Clear Rows</button>
      <button id="btn-swap" on:click={swapRows}>Swap Rows</button>
      <button id="btn-update" on:click={updateEvery10th}>Update every 10th Row</button>
    </div>
  </div>

  <table class="table table-hover">
    <tbody>
      {#each $data as row (row.id)}
        <tr class:danger={$selected === row.id} on:click={() => select(row.id)}>
          <td class="col-md-1">{row.id}</td>
          <td class="col-md-4">{row.label}</td>
          <td class="col-md-1">
            <button on:click|stopPropagation={() => remove(row.id)}>Delete</button>
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
  .danger {
    background-color: #fdd;
  }
</style>
