interface MyIterator {
next(): any;
hasNext(): boolean;
}

interface Aggregator {
createIterator(): MyIterator;
}

class ConcreteIterator implements MyIterator {
    private collection: any[] = [];
    private position: number = 0;

    constructor(collection: any[]) {
        this.collection = collection;
    }

    public next(): any {
        // Error handling is left out
        var result = this.collection[this.position];
        this.position += 1;
        return result;
    }

    public hasNext(): boolean {
        return this.position < this.collection.length;
    }
}

class Numbers implements Aggregator {
    private collection: number[] = [];

    constructor(collection: number[]) {
        this.collection = collection;
    }
    public createIterator(): MyIterator {
        return new ConcreteIterator(this.collection);
    }
}
  
// USAGE:
var nArray = [1, 7, 21, 657, 3, 2, 765, 13, 65],
numbers: Numbers = new Numbers(nArray),
it: MyIterator = numbers.createIterator();

while (it.hasNext()) {
console.log(it.next());
}
// OUTPUT:
// 1
// 7
// 21
// 657
// 3
// 2
// 765
// 13
// 65