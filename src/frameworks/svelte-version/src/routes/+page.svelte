<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	let mutationCount = 0;

	let observer: MutationObserver | undefined;

	onMount(() => {
		const table = document.querySelector('table.test-data');
		if (!table) return;

		mutationCount = 0;

		// Инициализируем window.__domMutationCount только если window существует
		if (typeof window !== 'undefined') {
			window.__domMutationCount = 0;
		}

		observer = new MutationObserver((mutationsList) => {
			console.log('mutationsList', mutationsList);
			mutationCount = mutationsList.length;
			window.__domMutationCount = mutationCount;
		});

		observer.observe(table, {
			attributes: true,
			childList: true,
			subtree: true,
			characterData: true
		});
	});

	onDestroy(() => {
		if (observer) observer.disconnect();

		if (typeof window !== 'undefined') {
			window.__domMutationCount = mutationCount;
		}
	});

	interface Row {
		id: number;
		label: string;
	}

	let rowId = 1;
	let data = $state.raw<Row[]>([]);
	let selected = $state.raw();

	const adjectives = [
		'pretty',
		'large',
		'big',
		'small',
		'tall',
		'short',
		'long',
		'handsome',
		'plain',
		'quaint',
		'clean',
		'elegant',
		'easy',
		'angry',
		'crazy',
		'helpful',
		'mushy',
		'odd',
		'unsightly',
		'adorable',
		'important',
		'inexpensive',
		'cheap',
		'expensive',
		'fancy'
	];
	const colours = [
		'red',
		'yellow',
		'blue',
		'green',
		'pink',
		'brown',
		'purple',
		'brown',
		'white',
		'black',
		'orange'
	];
	const nouns = [
		'table',
		'chair',
		'house',
		'bbq',
		'desk',
		'car',
		'pony',
		'cookie',
		'sandwich',
		'burger',
		'pizza',
		'mouse',
		'keyboard'
	];

	const add = () => (data = [...data, ...buildData(1000)]),
		clear = () => {
			data = [];
		},
		partialUpdate = () => {
			for (let i = 0; i < data.length; i += 10) {
				const row = data[i];
				row.label = row.label + ' !!!';
			}
		},

		update = () => {
            data.map(d => d.label = d.label + "!!!");
          },
		remove = (row) => {
			const clone = data.slice();
			clone.splice(clone.indexOf(row), 1);
			data = clone;
		},
		run = () => {
			data = buildData(1000);
		},
		runLots = () => {
			data = buildData(10000);
		},
		select = () => {
            console.log('select');
            selected = 1;
        },
		swapRows = () => {
			if (data.length > 998) {
				const clone = data.slice();
				const tmp = clone[1];
				clone[1] = clone[2];
				clone[2] = tmp;
				data = clone;
			}
		};

	function _random(max) {
		return Math.round(Math.random() * 1000) % max;
	}

	class Item {
		id = rowId++;
		label = $state.raw(
			`${adjectives[_random(adjectives.length)]} ${colours[_random(colours.length)]} ${nouns[_random(nouns.length)]}`,
		);
	}

	function buildData(count = 1000) {
		const data = new Array(count);
		for (let i = 0; i < count; i++) {
			data[i] = new Item();
		}
		return data;
	}
</script>

<div id="main" class="container">
	<div class="jumbotron">
		<div class="row">
			<div class="col-md-6">
				<h1>Svelte </h1>
			</div>
			<div class="col-md-6">
				<div class="row">
					<div class="col-sm-6 smallpad">
						<button type="button" class="btn btn-primary btn-block" id="btn-add-rows" onclick={run}
							>Create 1,000 rows</button
						>
					</div>
					<div class="col-sm-6 smallpad">
						<button type="button" class="btn btn-primary btn-block" id="btn-create-10k" onclick={runLots}
							>Create 10,000 rows</button
						>
					</div>
					<div class="col-sm-6 smallpad">
						<button type="button" class="btn btn-primary btn-block" id="btn-add" onclick={add}
							>Append 1,000 rows</button
						>
					</div>
					<div class="col-sm-6 smallpad">
                            <button id="btn-update" class="btn btn-primary btn-block" onclick={update}>Update all rows</button>
                    </div>
					<div class="col-sm-6 smallpad">
						<button
							type="button"
							class="btn btn-primary btn-block"
							id="btn-update-10"
							onclick={partialUpdate}>Update every 10th row</button
						>
					</div>
					<div class="col-sm-6 smallpad">
                            <button id="btn-select" class="btn btn-primary btn-block" onclick={() => select()}>Select row</button>
                    </div>
					<div class="col-sm-6 smallpad">
						<button type="button" class="btn btn-primary btn-block" id="btn-clear" onclick={clear}
							>Clear</button
						>
					</div>
					<div class="col-sm-6 smallpad">
						<button
							type="button"
							class="btn btn-primary btn-block"
							id="btn-swap"
							onclick={swapRows}>Swap Rows</button
						>
					</div>
				</div>
			</div>
		</div>
	</div>
	<table class="table table-hover table-striped test-data">
		<tbody>
			{#each data as row (row)}
				<tr class={selected === row.id ? 'danger' : ''}
					><td class="col-md-1">{row.id}</td><td class="col-md-4"
						><a>{row.label}</a
						></td
					><td class="col-md-1"
						><button class="btn btn-danger" onclick={() => remove(row)}
							><span class="glyphicon glyphicon-remove" aria-hidden="true" />Delete </button>
						</td
					><td class="col-md-6" /></tr
				>
			{/each}
		</tbody>
	</table>
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
