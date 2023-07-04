export class PriorityQueue {
	values: { value: any; priority: number }[]; 

	constructor() {
		this.values = [];
	}

	enqueue(value: any, priority: any) {
		this.values.push({ value, priority });
		this.sort();
	}

	dequeue() {
		return this.values.shift()?.value;
	}

	sort() {
		this.values.sort((a, b) => a.priority - b.priority);
	}

	isEmpty() {
		return !this.values.length;
	}
}
