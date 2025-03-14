import { Injectable, signal } from '@angular/core';

interface Row {
  id: number;
  label: string;
}

@Injectable({
  providedIn: 'root'
})
export class TableService {
  private nextId = 1;

  data = signal<Row[]>([]);
  selected = signal<number | null>(null);

  private random(max: number): number {
    return Math.round(Math.random() * 1000) % max;
  }

  private buildData(count: number): Row[] {
    const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint"];
    const colors = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "white", "black", "orange"];
    const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger"];

    return Array.from({ length: count }, () => ({
      id: this.nextId++,
      label: `${adjectives[this.random(adjectives.length)]} ${colors[this.random(colors.length)]} ${nouns[this.random(nouns.length)]}`
    }));
  }

  run() {
    this.data.set(this.buildData(1000));
    this.selected.set(null);
  }

  runLots() {
    this.data.set(this.buildData(10000));
    this.selected.set(null);
  }

  add() {
    this.data.set([...this.data(), ...this.buildData(1000)]);
  }

  update() {
    const updatedData = this.data().map((row, index) =>
      index % 10 === 0 ? { ...row, label: row.label + " !!!" } : row
    );
    this.data.set(updatedData);
  }

  clear() {
    this.data.set([]);
    this.selected.set(null);
  }

  swapRows() {
    const updatedData = [...this.data()];
    if (updatedData.length > 998) {
      [updatedData[1], updatedData[998]] = [updatedData[998], updatedData[1]];
      this.data.set(updatedData);
    }
  }

  remove(id: number) {
    this.data.set(this.data().filter(row => row.id !== id));
  }

  select(id: number) {
    this.selected.set(id);
  }
}
