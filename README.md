# TypeScript Design Patterns
> Click ⭐if you like the project. Pull Requests are highly appreciated. Follow me @faisalkarimi for technical updates.
---
👷 Project started by: [@faisalkarimi](https://github.com/faisalkarimi)

# Table of Contents

[**Behavioral**](#Behavioral) | [**Creational**](#Creational) | [**Structural**](#Structural)
-------------- | -------------- | --------------
|[🐝 Chain Of Responsibility](#Chain-Of-Responsibility)| [🌰 Abstract Factory](#)|[🔌 Adapter]()|
|[👫 Command](#Command)| [👷 Builder](#Builder)|[🌉 Bridge]()|
|[🎶 Interpreter](#Interpreter)| [🏭 Factory Method](#Factory-Method)| [🌿 Composite](#Composite)
|[🍫 Iterator](#Iterator)| [🃏 Prototype](#Prototype)| [🍧 Decorator](#Decorator)|
|[💐 Mediator](#Mediator)| [💍 Singleton](#Singleton)| [🎁 Façade](#Façade)|
|[💾 Momento](#Momento)| |[](#) |[🍃 Flyweight](#Flyweight)|
|[👓 Observer](#Observer)| |[](#) |[☔ Proxy](#Proxy)|
|[🐉 State](#State)| |[](#)  |[](#)|
|[💡 Strategy](#Strategy)| |[](#)
|[🏃 Visitor](#Visitor)| |[](#) 
|[📝 Template Method](#Template-Method)| 

# Behavioral

> In software engineering, behavioral design patterns are design patterns that identify common communication patterns between objects and realize these patterns. By doing so, these patterns increase flexibility in carrying out this communication.
> 
> **Source:** [wikipedia.org](http://en.wikipedia.org/wiki/Behavioral_pattern)

## 🐝 Chain Of Responsibility
The chain of responsibility pattern is used to process varied requests, each of which may be dealt with by a different handler.
### Example:
```typescript
interface Withdrawing {
    withdraw(amount: number): boolean;
}

class MoneyPile implements Withdrawing {
    value: number;
    quantity: number;
    next?: Withdrawing;

    constructor(value: number, quantity: number, next?: Withdrawing) {
        this.value = value;
        this.quantity = quantity;
        this.next = next;
    }

    public withdraw(amount: number): boolean {
        let localAmount = amount;
        const canTakeSomeBill = (want: number): boolean => ((want / this.value) > 0);

        let localQuantity = this.quantity;

        while(canTakeSomeBill(localAmount)) {
            if (localQuantity === 0) {
                break;
            }

            localAmount -= this.value;
            localQuantity -= 1;
        }

        if (localAmount <= 0) {
            return true;
        }

        if (this.next !== undefined) {
            return this.next.withdraw(localAmount);
        }

        return false;
    }
}


class ATM implements Withdrawing {
    #hundred: Withdrawing;
    #fifty: Withdrawing;
    #twenty: Withdrawing;
    #ten: Withdrawing;

    get startPile(): Withdrawing {
        return this.#hundred;
    }

    constructor(hundred: Withdrawing, fifty: Withdrawing, twenty: Withdrawing, ten: Withdrawing) {
        this.#hundred = hundred;
        this.#fifty = fifty;
        this.#twenty = twenty;
        this.#ten = ten;
    }

    withdraw(amount: number): boolean {
        return this.startPile.withdraw(amount);
    }
}
```

### USAGE:
```typescript
const ten = new MoneyPile(10, 6);
const twenty = new MoneyPile(20, 2, ten);
const fifty = new MoneyPile(50, 2, twenty);
const hundred = new MoneyPile(100, 1, fifty);

// BUILD ATM:
const atm = new ATM(hundred, fifty, twenty, ten);
console.log(atm.withdraw(310));
console.log(atm.withdraw(150));
```

### OUTPUT:
```typescript
//false
//true
```

## 👫 Command
The command pattern is used to express a request, including the call to be made and all of its required parameters, in a command object. The command may then be executed immediately or held for later use.
### Example:
```typescript
interface DoorCommand {
    execute(): string;
}

class OpenCommand implements DoorCommand {
    doors: string;

    constructor(doors: string) {
        this.doors = doors;
    }

    execute(): string {
        return `Opened ${this.doors}`;
    }
}

class CloseCommand implements DoorCommand {
    doors: string;

    constructor(doors: string) {
        this.doors = doors;
    }

    execute(): string {
        return `Closed ${this.doors}`;
    }
}

class HAL9000DoorsOperations {
    openCommand: DoorCommand;
    closeCommand: DoorCommand;

    constructor(doors: string) {
        this.openCommand = new OpenCommand(doors);
        this.closeCommand = new CloseCommand(doors);
    }

    close(): string {
        return this.closeCommand.execute();
    }

    open(): string {
        return this.openCommand.execute();
    }
}
```

### USAGE:
```typescript
const podBayDoors = "Pod Bay Doors";
const doorModule = new HAL9000DoorsOperations(podBayDoors);

console.log(doorModule.open()); 
console.log(doorModule.close()); 
```

### OUTPUT:
```typescript
//Opened Pod Bay Doors
//Closed Pod Bay Doors
```

## 🎶 Interpreter
The interpreter pattern is used to evaluate sentences in a language.
### Example:
```typescript
interface IntegerExpression {
    evaluate(context: IntegerContext): number;
    replace(character: string, integerExpression: IntegerExpression): IntegerExpression;
    copied(): IntegerExpression;


}

class IntegerContext {
    data: {[key: string]: number} = {};
    
    lookup(name: string): number {
        return this.data[name];
    }

    assign(expression: IntegerVariableExpression, value: number) {
        this.data[expression.name] = value;
    }
}

class IntegerVariableExpression implements IntegerExpression {
    name: string;

    constructor(name: string) {
        this.name = name;
    }

    evaluate(context: IntegerContext): number {
        return context.lookup(this.name);
    }

    replace(character: string, integerExpression: IntegerExpression): IntegerExpression {
        return character === this.name ? integerExpression.copied() : new IntegerVariableExpression(this.name);
        //****// OR:
        // if (name === this.name) {
        //     return integerExpression.copied();
        // } else {
        //     return new IntegerVariableExpression(this.name);
        // }
    }

    copied(): IntegerExpression {
        return new IntegerVariableExpression(this.name);
    }
}

class AddExpression implements IntegerExpression {
    #operand1: IntegerExpression;
    #operand2: IntegerExpression;

    constructor(opt1: IntegerExpression, opt2: IntegerExpression) {
        this.#operand1 = opt1;
        this.#operand2 = opt2;
    }

    evaluate(context: IntegerContext): number {
        return this.#operand1.evaluate(context) + this.#operand2.evaluate(context);
    }

    replace(character: string, integerExpression: IntegerExpression): IntegerExpression {
        return new AddExpression(this.#operand1.replace(character, integerExpression), this.#operand2.replace(character, integerExpression));
    }

    copied(): IntegerExpression {
        return new AddExpression(this.#operand1, this.#operand2);
    }
}
```

### USAGE:
```typescript
let context = new IntegerContext();

let a = new IntegerVariableExpression("A");
let b = new IntegerVariableExpression("B");
let c = new IntegerVariableExpression("C");

let expression = new AddExpression(a, new AddExpression(b, c));

context.assign(a, 2);
context.assign(b, 1);
context.assign(c, 3);

const result = expression.evaluate(context);
console.log(result);
```

### OUTPUT:
```typescript
//6
```

## 🍫 Iterator
The iterator pattern is used to provide a standard interface for traversing a collection of items in an aggregate object without the need to understand its underlying structure.
### Example:
```typescript
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
```

### USAGE:
```typescript
var nArray = [1, 7, 21, 657, 3, 2, 765, 13, 65],
numbers: Numbers = new Numbers(nArray),
it: MyIterator = numbers.createIterator();

while (it.hasNext()) {
console.log(it.next());
}
```

### OUTPUT:
```typescript
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
```

## 💐 Mediator
The mediator pattern is used to reduce coupling between classes that communicate with each other. Instead of classes communicating directly, and thus requiring knowledge of their implementation, the classes send messages via a mediator object.
### Example

```typescript
type MessageType = {
    message: string;
}

interface Receiver {
    receive(message: string): void;
}

interface Sender {
    recepients: Programmer[];

    send(message: string): void;
}

class Programmer implements Receiver {
    name: string;

    constructor(name: string) {
        this.name = name;
    }

    receive(message: string): void {
        console.log(`${this.name} received: ${message}`);
    }
}

class MessageMediator implements Sender {
    recepients: Programmer[] = [];
    
    add(recepient: Programmer) {
        this.recepients.push(recepient);
    }

    send(message: string): void {
        this.recepients.forEach(recepient => recepient.receive(message));
    }
}
```

### USAGE:
```typescript
function spamMonster(message: string, worker: MessageMediator) {
    worker.send(message);
}

const messageMediator = new MessageMediator();

const user1 = new Programmer("Linus Torvalds");
const user2 = new Programmer("Tim Cook");

messageMediator.add(user1);
messageMediator.add(user2);

spamMonster("I'd Like to Add you to My Professional Network", messageMediator);
```

### OUTPUT:
```typescript
// OUTPUT:
// "Linus Torvalds received: I'd Like to Add you to My Professional Network" 
// "Tim Cook received: I'd Like to Add you to My Professional Network"
```

## 💾 Memento
The memento pattern is used to capture the current state of an object and store it in such a manner that it can be restored at a later time without breaking the rules of encapsulation.
### Example:

```typescript
class State {
  private _value: String;

  constructor(value: string) {
    this._value = value;
  }

  public set value(newValue: String) {
    this._value = newValue;
  }

  public get value() {
    return this._value;
  }
}

interface StateInterface {
  state: State;
}

class Memento implements StateInterface {
  private _state: State;

  constructor(state: State) {
    this._state = state;
  }

  public set state(newState: State) {
    this._state = newState;
  }

  public get state() {
    return this._state;
  }
}

class Originator implements StateInterface {
  private _state: State;

  constructor(state: State) {
    console.log(state.value);
    this._state = state;
  }

  public set state(state: State) {
    console.log(state.value);
    this._state = state;
  }

  public get state() {
    return this._state;
  }

  public createMemento() {
    console.log(`create ${this._state.value} memento`);
    return new Memento(this._state);
  }

  public restoreMemento(memento: Memento) {
    console.log(`restore ${memento.state.value}`);
    this._state = memento.state;
  }
}

class CareTaker {
  private _memento: Memento;

  constructor() {
      this._memento = new Memento(new State("Initial State"));
  }

  public set memento(memento: Memento) {
    // memento saved
    this._memento = memento;
  }

  public get memento() {
    return this._memento;
  }
}
```

### USAGE:
```typescript
  // Save check point
  const oldState = new State('check point');
  const originator = new Originator(oldState);
  const careTaker = new CareTaker();
  careTaker.memento = originator.createMemento();

  // Player dies
  const currentState = new State('die');
  originator.state = currentState;

  // Player reset to check point
  originator.restoreMemento(careTaker.memento);

  // Player gain medel
  const medalState = new State('get medal');
  originator.state = medalState;
  // Save
  careTaker.memento = originator.createMemento();
```

### OUTPUT:
```typescript
// "check point" 
// "create check point memento" 
// "die" 
// "restore check point"
// "get medal" 
// "create get medal memento"
```

## 👓 Observer
The observer pattern is used to allow an object to publish changes to its state. Other objects subscribe to be immediately notified of any changes.
### Example:

```typescript
interface Observer {
  uniqueID: string;
  update(): void;
}

class ConcreteObserver implements Observer {
  public uniqueID: string
  constructor(uniqueID: string) {
    this.uniqueID = uniqueID;
  }

  update(): void {
    console.log(`${this.uniqueID} updates something...`);
  }
}

function findObserver(obs: Observer[], uniqueID: string) {
  let index = 0;
  const existed = obs.some((observer, idx) => {
    index = idx;
    return observer.uniqueID === uniqueID;
  });
  return {
    existed,
    index
  };
}

class Subject {
  private _observers: Observer[];
  constructor() {
    this._observers = [];
  }

  registerObserver(ob: Observer) {
    const id: string = ob.uniqueID;
    if (findObserver(this._observers, id).existed) {
      return console.log(`Observer ${id} is already in list`);
    }
    this._observers.push(ob);
    console.log(`Observer ${ob.uniqueID} is pushed into list`);
    console.log(this._observers);
  }

  removeObserver(uniqueID: string) {
    const { existed, index } = findObserver(this._observers, uniqueID);
    if (existed) {
      this._observers.splice(index, 1);
      console.log(`Observer ${uniqueID} is removed from list`);
    } else {
      console.log('Observer not existed');
    }
  }

  notifyObservers() {
    console.log('Subject notify all observers >>');
    this._observers.map((observer) => {
      observer.update();
    });
  }
}
```

### USAGE:
```typescript
const subject = new Subject();

const obA = new ConcreteObserver('A');
const obB = new ConcreteObserver('B');
const obC = new ConcreteObserver('C');

subject.registerObserver(obA);
subject.registerObserver(obA); // already existed

subject.registerObserver(obB);
subject.registerObserver(obC);

subject.notifyObservers();
```

### OUTPUT:
```typescript
// "Observer A is pushed into list"
// "Observer A is already in list"
// "Observer B is pushed into list"
// "Observer C is pushed into list"
// "Subject notify all observers >>" 
// "A updates something..."
// "B updates something..." 
// "C updates something..."
```

## 🐉 State
The state pattern is used to alter the behaviour of an object as its internal state changes. The pattern allows the class for an object to apparently change at run-time.

### Example:
```typescript
interface ATMState {
    name?: string;
    takeCash(cash: number): void;
  }
  
  class ATMHasCashState implements ATMState {
    private _machine: ATMMachine;
    name: string;
    constructor(machine: ATMMachine, name: string) {
      this.name = name;
      this._machine = machine;
    }
  
    takeCash(cash: number): void {
      if (this._machine.cash < cash) {
        this._machine.state = this._machine.noCashState();
        console.log('Not enough cash');
        return;
      } else if (this._machine.cash === cash) {
        this._machine.state = this._machine.noCashState();
        console.log('No cash after cash token');
      }
      console.log(`${this._machine.cash} - ${cash}`);
      this._machine.cash -= cash;
    }
  }
  
  class ATMNoCashState implements ATMState {
    private _machine: ATMMachine;
    name: string;
    constructor(machine: ATMMachine, name: string) {
      this.name = name;
      this._machine = machine;
    }
  
    takeCash(cash: number): void {
      throw new Error('ATMMachine has no cash');
    }
  }
  
  class ATMMachine implements ATMState {
  
    private _hasCashState: ATMHasCashState;
    private _noCashState: ATMNoCashState;
  
    private _currentState: ATMState;
    
    public cash: number;
    
    constructor(cash: number) {
      this.cash = cash;
  
      this._hasCashState = new ATMHasCashState(this, 'HasCash');
      this._noCashState = new ATMNoCashState(this, 'NoCash');
  
      this._currentState = this.cash ? this._hasCashState : this._noCashState;
    }
  
    public set state(value: ATMState) {
      console.log(`Current state is ${value.name}`);
      this._currentState = value;
    }
  
    public get state() {
      return this._currentState;
    }
  
    takeCash(cash: number): void {
      this._currentState.takeCash(cash);
    }
  
    // Get states
    public hasCashState() {
      return this._hasCashState;
    }
  
    public noCashState() {
      return this._noCashState;
    }
  }
```

### USAGE:
```typescript
    const machine  = new ATMMachine(1000);
    machine.takeCash(200);
    machine.takeCash(1000);
```

### OUTPUT:
```typescript
// "1000 - 200"
// "Current state is NoCash"
// "Not enough cash"
```

## 💡 Strategy
The strategy pattern is used to create an interchangeable family of algorithms from which the required process is chosen at run-time.

### Example:
```typescript
interface WorkoutStrategy {
    fire(): void;
    stop?(): void;
  }
  
  class Running implements WorkoutStrategy {
    public fire(): void {
      console.log('Running')
    }
  }
  
  class Basketball implements WorkoutStrategy {
    public fire(): void {
      console.log('Basketball')
    }
  }
  
  class Swimming implements WorkoutStrategy {
    public fire(): void {
      console.log('Swimming')
    }
  }
  
  class Person {
    public strategy: WorkoutStrategy;
    public name: String;
    constructor(name: string, strategy: WorkoutStrategy) {
      this.name = name;
      this.strategy = strategy
    }
  
    workout(): void {
      console.log(`${ this.name } starts:`)
      this.strategy.fire();
    };
  }
```

### USAGE:
```typescript
const amanda = new Person('Amanda', new Running());
amanda.workout();
```

### OUTPUT:
```typescript
// "Amanda starts:"
// "Running" 
```

## 📝 Template Method
The template method pattern defines the steps of an algorithm and allows the redefinition of one or more of these steps. In this way, the template method protects the algorithm, the order of execution and provides abstract methods that can be implemented by concrete types.

### Example:
```typescript
class BaseClass {
    public templateMethod(): void {
      this.actionA();
      this.actionB();
    }
  
    public actionA(): void {
      throw new Error('should not be invoker by BaseClass');
    };
  
    public actionB(): void {
      throw new Error('should not be invoker by BaseClass');
    }
  }
  
  class ConcreteAClass extends BaseClass {
    actionA(): void {
      console.log('A take actionA')
    }
  
    actionB(): void {
      console.log('A take actionB')
    }
  }
  
  class ConcreteBClass extends BaseClass {
    actionA(): void {
      console.log('B take actionA')
    }
  
    actionB(): void {
      console.log('B take actionB')
    }
  }
```

### USAGE:
```typescript
const a = new ConcreteAClass();
const b = new ConcreteBClass();

a.templateMethod();
b.templateMethod();
```

### OUTPUT:
```typescript
// "A take actionA"
// "A take actionB" 
// "B take actionA" 
// "B take actionB" 
```

## 🏃 Visitor
The visitor pattern is used to separate a relatively complex set of structured data classes from the functionality that may be performed upon the data that they hold.

### Example:
```typescript
interface Visitable {
    accept(visitor: IVisitor): void;
  }
  
  interface IVisitor {
    visitMainItem?(mainItem: MainItem): void;
    visitSideItem?(sideItem: SideItem): void;
  }
  
  class MainItem implements Visitable {
    accept(visitor: IVisitor) {
      if(visitor.visitMainItem) {
          visitor.visitMainItem(this);
      }
    }
  }
  
  class SideItem implements Visitable {
    accept(visitor: IVisitor) {
      if(visitor.visitSideItem) {
          visitor.visitSideItem(this);
      }
    }
  }
  
  class LogVisitor implements IVisitor {
    visitMainItem(mainItem: MainItem): void {
      console.log('Log mainItem, and add new logics');
    }
  
    visitSideItem(sideItem: SideItem): void {
      console.log('Log sideItem, and add new logics');
    }
  }
  
  class DecorateVisitor implements IVisitor {
    visitMainItem(mainItem: MainItem): void {
      console.log('Decorate mainItem, and add new logics');
    }
  
    visitSideItem(sideItem: SideItem): void {
      console.log('Decorate sideItem, and add new logics');
    }
  }
  
  class ItemsGroup implements Visitable {
    private _items: Visitable[];
  
    constructor() {
      this._items = [];
    }
  
    public addItem(item: Visitable) {
      this._items.push(item);
    }
  
    accept(visitor: IVisitor): void {
      this._items.map((item: Visitable) => item.accept(visitor));;
    }
  }
```

### USAGE:
```typescript
const group = new ItemsGroup();
group.addItem(new MainItem());
group.addItem(new SideItem());

const mainVisitor = new LogVisitor();
const sideVisitor = new DecorateVisitor();

group.accept(mainVisitor);
group.accept(sideVisitor);
```

### OUTPUT:
```typescript
// "Log mainItem, and add new logics"
// "Log sideItem, and add new logics"
// "Decorate mainItem, and add new logics" 
// "Decorate sideItem, and add new logics" 
```

# Creational

> In software engineering, creational design patterns are design patterns that deal with object creation mechanisms, trying to create objects in a manner suitable to the situation. The basic form of object creation could result in design problems or added complexity to the design. Creational design patterns solve this problem by somehow controlling this object creation.
> 
> **Source:** [wikipedia.org](http://en.wikipedia.org/wiki/Creational_pattern)

## 🌰 Abstract Factory
The abstract factory pattern is used to provide a client with a set of related or dependant objects. The "family" of objects created by the factory are determined at run-time.

### Example:
```typescript
abstract class AbstractProductA {
    abstract methodA(): void;
    abstract methodB(): void;
  }
  
  abstract class AbstractProductB {
    abstract methodA(): void;
    abstract methodB(): void;
  }
  
  class ProductA extends AbstractProductA {
    constructor(value: String) {
      super();
      console.log(value);
    }
    methodA(): void {}
    methodB(): void {}
  }
  
  class ProductB extends AbstractProductB {
    constructor(value: String) {
      super();
      console.log(value);
    }
    methodA(): void {}
    methodB(): void {}
  }
  
  abstract class AbstractFactory {
    abstract createProductA(): AbstractProductA;
    abstract createProductB(): AbstractProductA;
  }
  
  class NewYorkFactory extends AbstractFactory {
    createProductA(): ProductA {
      return new ProductA('ProductA made in New York');
    }
  
    createProductB(): ProductB {
      return new ProductB('ProductB made in New York');
    }
  }
  
  class CaliforniaFactory extends AbstractFactory {
    createProductA(): ProductA {
      return new ProductA('ProductA made in California');
    }
  
    createProductB(): ProductB {
      return new ProductB('ProductB made in California');
    }
  }
```

### USAGE:
```typescript
const nyFactory = new NewYorkFactory();
nyFactory.createProductA();
nyFactory.createProductB();

const calFactory = new CaliforniaFactory();
calFactory.createProductA();
calFactory.createProductB();
```

### OUTPUT:
```typescript
// "ProductA made in New York" 
// "ProductB made in New York"
// "ProductA made in California" 
// "ProductB made in California"
```

## 👷 Builder
The builder pattern is used to create complex objects with constituent parts that must be created in the same order or using a specific algorithm. An external class controls the construction algorithm.

### Example:
```typescript
 interface Builder {
    producePartA(): void;
    producePartB(): void;
    producePartC(): void;
}

class ConcreteBuilder1 implements Builder {
    private product: Product1;

    /**
     * A fresh builder instance should contain a blank product object, which is
     * used in further assembly.
     */
    constructor() {
        this.reset();
        this.product = new Product1();
    }

    public reset(): void {
        this.product = new Product1();
    }

    /**
     * All production steps work with the same product instance.
     */
    public producePartA(): void {
        this.product.parts.push('PartA1');
    }

    public producePartB(): void {
        this.product.parts.push('PartB1');
    }

    public producePartC(): void {
        this.product.parts.push('PartC1');
    }

    public getProduct(): Product1 {
        const result = this.product;
        this.reset();
        return result;
    }
}


class Product1 {
    public parts: string[] = [];

    public listParts(): void {
        console.log(`Product parts: ${this.parts.join(', ')}\n`);
    }
}

class Director {
    private builder: Builder;

    constructor(builder: Builder) {
        this.builder = builder;
    }
    public setBuilder(builder: Builder): void {
        this.builder = builder;
    }

    public buildMinimalViableProduct(): void {
        this.builder.producePartA();
    }

    public buildFullFeaturedProduct(): void {
        this.builder.producePartA();
        this.builder.producePartB();
        this.builder.producePartC();
    }
}

function clientCode(director: Director) {
    const builder = new ConcreteBuilder1();
    director.setBuilder(builder);

    console.log('Standard basic product:');
    director.buildMinimalViableProduct();
    builder.getProduct().listParts();

    console.log('Standard full featured product:');
    director.buildFullFeaturedProduct();
    builder.getProduct().listParts();

    // Remember, the Builder pattern can be used without a Director class.
    console.log('Custom product:');
    builder.producePartA();
    builder.producePartC();
    builder.getProduct().listParts();
}
```

### USAGE:
```typescript
const builder = new ConcreteBuilder1();
const director = new Director(builder);
clientCode(director);
```

### OUTPUT:
```typescript
// "Standard basic product:" 
// "Product parts: PartA1"
// "Standard full featured product:"
// "Product parts: PartA1, PartB1, PartC1"
// "Custom product:"
// "Product parts: PartA1, PartC1"
```

## 🏭 Factory Method
The factory pattern is used to replace class constructors, abstracting the process of object generation so that the type of the object instantiated can be determined at run-time.

### Example:
```typescript
interface Product {
    doSomething(): void;
  }
  
  interface Factory {
    createProduct(name: string): Product;
  }
  
  class ConcreteProductA implements Product {
    doSomething(): void {
      console.log('Product A do this');
    }
  }
  
  class ConcreteProductB implements Product {
    doSomething(): void {
      console.log('Product B do this');
    }
  }

    class UnkownProduct implements Product {
    doSomething(): void {
      console.log('Product is unkown');
    }
  }
  
  class ProductFactory implements Factory {
    createProduct(name: string): Product {
      switch(name) {
        case 'product-a':
          return new ConcreteProductA();
        case 'product-b':
          return new ConcreteProductB();
        default:
          return new UnkownProduct();
      }
    }
  }
```

### USAGE:
```typescript
const factory = new ProductFactory();
const product1 = factory.createProduct('product-a');
const product2 = factory.createProduct('product-b');
const product3 = factory.createProduct('product-c');
product1.doSomething();
product2.doSomething();
product3.doSomething();
```

### OUTPUT:
```typescript
// "Product A do this"
// "Product A do this"
// "Product B do this"
// "Product is unkown"
```

## 🃏 Prototype
The prototype pattern is used to instantiate a new object by copying all of the properties of an existing object, creating an independent clone. This practise is particularly useful when the construction of a new object is inefficient.

### Example:
```typescript
interface CarPrototype {
    clone(): CarPrototype
  }
  
  class Audi implements CarPrototype {
    clone(): CarPrototype {
      return new Audi()
    }
  }
  
  class Benz implements CarPrototype {
    clone(): CarPrototype {
      return new Benz()
    }
  }
  
  class BMW implements CarPrototype {
    clone(): CarPrototype {
      return new BMW()
    }
  }
  
  abstract class CarFactory {
    abstract createCar(brand: string): CarPrototype;
  }
  
  class ChineseCarFactory extends CarFactory {
    private brands: { [brand: string]: CarPrototype; } = {};
  
    constructor() {
      super()
      this.brands['Audi'] = new Audi()
      this.brands['Benz'] = new Benz()
      this.brands['BMW'] = new BMW()
    }
  
    createCar(brand: string): CarPrototype {
      return this.brands[brand].clone()
    }
  }
```

### USAGE:
```typescript
const factory = new ChineseCarFactory()
const prototypes = ['Audi', 'Benz', 'BMW'].map((brand) => {
  return factory.createCar(brand)
})
console.log(prototypes);
```

### OUTPUT:
```typescript
// [Audi: {}, Benz: {}, BMW: {}] 
```

## 💍 Singleton

The singleton pattern ensures that only one object of a particular class is ever created. All further references to objects of the singleton class refer to the same underlying instance. There are very few applications, do not overuse this pattern!

### Example:
```typescript
class Singleton {
  private static instance: Singleton;

  private constructor() { }

  public static getInstance(): Singleton {
      if (!Singleton.instance) {
          Singleton.instance = new Singleton();
      }

      return Singleton.instance;
  }

  public someBusinessLogic() {
      // ...
  }
}
```

### USAGE:
```typescript
const s1 = Singleton.getInstance();
const s2 = Singleton.getInstance();

if (s1 === s2) {
    console.log('Singleton works, both variables contain the same instance.');
} else {
    console.log('Singleton failed, variables contain different instances.');
}
```

### OUTPUT:
```typescript
//  "Singleton works, both variables contain the same instance." 
```

# Structural

> In software engineering, structural design patterns are design patterns that ease the design by identifying a simple way to realize relationships between entities.
> 
> **Source:** [wikipedia.org](http://en.wikipedia.org/wiki/Structural_pattern)

## 🔌 Adapter
The adapter pattern is used to provide a link between two otherwise incompatible types by wrapping the "adaptee" with a class that supports the interface required by the client.

### Example:
```typescript
interface Adapter {
    request(newParam: string): void;
  }
  
  class InterfaceAdapter implements Adapter {
    request(newParam: string): void {
      const old = new OldInterface();
      old.requestInOldWay({});
    };
  }
  
  class OldInterface {
    requestInOldWay(oldParam: any): void {
        console.log("Request made in old interface.");
        
    };
  }
```

### USAGE:
```typescript
const adapter = new InterfaceAdapter();
adapter.request('param');
```

### OUTPUT:
```typescript
// "Request made in old interface." 
```

## 🌉 Bridge
The bridge pattern is used to separate the abstract elements of a class from the implementation details, providing the means to replace the implementation details without modifying the abstraction.

### Example:
```typescript
class Commander {
    executeObject: Executive;
  
    constructor(executeObject: Executive) {
      this.executeObject = executeObject;
    }
  
    order(): void {
      this.executeObject.operate();
    }
  }
  
  class AirForceCommander extends Commander {
    order(): void {
      console.log('Air Force commander make order')
      // extra logics here
      super.order();
    }
  }
  
  class SpecialForceCommander extends Commander {
    order(): void {
      console.log('Special Force commander make order')
      // extra logics here
      super.order();
    }
  }
  
  interface Executive {
    operate(): void;
  }
  
  class Pilot implements Executive {
    operate(): void {
      console.log('Fly');
    }
  }
  
  class Soldier implements Executive {
    operate(): void {
      console.log('Shoot');
    }
  }
```

### USAGE:
```typescript
const commanderA = new AirForceCommander(new Pilot());
const commanderB = new SpecialForceCommander(new Soldier());

commanderA.order();
commanderB.order();
```

### OUTPUT:
```typescript
// "Air Force commander make order"
// "Fly"
// "Special Force commander make order"
// "Shoot"
```

## 🌿 Composite
The composite pattern is used to create hierarchical, recursive tree structures of related objects where any element of the structure may be accessed and utilised in a standard manner.

### Example:
```typescript
interface ArmyObject {
    seq: String;
    operate(): void;
  }
  
  class Team implements ArmyObject {
    seq: String;
    private _soldiers: ArmyObject[];
  
    constructor(seq: String) {
      this.seq = seq;
      this._soldiers = [];
    }
  
    operate(): void {
      console.log(`Team: ${this.seq} operates`)
      this._soldiers.map((soldier: ArmyObject) => {
        soldier.operate();
      });
    }
  
    addSoldier(newSoldier: ArmyObject) {
      const soldiers = this._soldiers.filter((soldier: ArmyObject, index) => {
        return soldier.seq === newSoldier.seq;
      })
      if (soldiers.length < 1) {
        console.log(`Soldier: ${newSoldier.seq} comes in ${this.seq}`);
        this._soldiers.push(newSoldier);
      } else {
        console.log('The soldier is already in the team');
      }
    }
  
    soldierGone(deadSoldier: ArmyObject) {
      const deads = this._soldiers.filter((soldier: ArmyObject, index) => soldier.seq === deadSoldier.seq)
      if (deads.length > 0) {
        console.log(`Soldier: ${deadSoldier.seq} died in the fight`);
      } else {
        console.log('No one dies');
      }
    }
  }
  
  class Soldier implements ArmyObject {
    seq: String;
  
    constructor(seq: String) {
      this.seq = seq;
    }
  
    operate() {
      console.log(`Soldier: ${this.seq} soldier operates`);
    }
  }
```

### OUTPUT:
```typescript
const team = new Team('Seal Team 6');
const specialSquad = new Team('Seal Team 6 - Special Squad');

const soldierJoe = new Soldier('Joe');
const soldierJames = new Soldier('James');
const soldierRoy = new Soldier('Roy');
team.addSoldier(soldierJoe);
team.addSoldier(soldierJames);
team.addSoldier(soldierRoy);

const specialForceTommy = new Soldier('Tommy');

specialSquad.addSoldier(specialForceTommy);

team.operate();
specialSquad.operate();

team.soldierGone(soldierJames);
```

### OUTPUT:
```typescript
  // "Soldier: Joe comes in Seal Team 6"
  // "Soldier: James comes in Seal Team 6" 
  // "Soldier: Roy comes in Seal Team 6"
  // "Soldier: Tommy comes in Seal Team 6 - Special Squad"
  // "Team: Seal Team 6 operates"
  // "Soldier: Joe soldier operates"
  // "Soldier: James soldier operates"
  // "Soldier: Roy soldier operates"
  // "Soldier: Tommy soldier operates"
  // "Soldier: James died in the fight"
```

## 🍧 Decorator
The decorator pattern is used to extend or alter the functionality of objects at run- time by wrapping them in an object of a decorator class. This provides a flexible alternative to using inheritance to modify behaviour.

### Example:
```typescript
interface Coffee {
    cost(): Number;
  }
  
  class GeneralCoffee implements Coffee {
    cost(): Number {
      return 10;
    }
  }
  
  class CoffeeExtraDecorator implements Coffee {
    private _coffee: Coffee;
  
    constructor(coffee: GeneralCoffee) {
      this._coffee = coffee;
    }
  
    cost(): Number {
      return this._coffee.cost();
    }
  }
  
  class BubbleDecorator extends CoffeeExtraDecorator {
    private _price: Number = 3;
  
    cost(): Number {
      return super.cost().valueOf() + this._price.valueOf();
    }
  }
  
  class MilkDecorator extends CoffeeExtraDecorator {
    private _price: Number = 2.5;
    private _freshExtra: Number = 1.5;
  
    cost(): Number {
      return super.cost().valueOf() + this._price.valueOf() + this._freshExtra.valueOf();
    }
  }
```

### USAGE:
```typescript
const general = new GeneralCoffee();
const withBubble = new BubbleDecorator(general);
const withMilk = new MilkDecorator(withBubble);
console.log(`Total: ${withMilk.cost()}`);
```

### OUTPUT:
```typescript
// "Total: 17"
```

## 🎁 Façade
The facade pattern is used to define a simplified interface to a more complex subsystem.

### Example:
```typescript
class EngineSystem {
    activate() {
      console.log('Activate the engine');
    }
  }
  
  class MonitorSystem {
    check() {
      console.log('Check system situations');
    }
  }
  
  class OxygenSystem {
    generate() {
      console.log('Oxygen will be generated');
    }
  }
  
  class RocketTestingOperation {
  
    private _engineSys: EngineSystem;
    private _monitorSys: MonitorSystem;
    private _oxygenSys: OxygenSystem;
  
    constructor() {
      this._engineSys = new EngineSystem();
      this._monitorSys = new MonitorSystem();
      this._oxygenSys = new OxygenSystem();
    }
  
    operationStart() {
      this._monitorSys.check();
      this._oxygenSys.generate();
      this._engineSys.activate();
  
    }
  }
```

### USAGE:
```typescript
const operation = new RocketTestingOperation();
operation.operationStart();
```

### OUTPUT:
```typescript
// "Check system situations"
// "Oxygen will be generated"
// "Activate the engine"
```

## 🍃 Flyweight
The flyweight pattern is used to minimize memory usage or computational expenses by sharing as much as possible with other similar objects.

### Example:
```typescript
interface Action {
    move(location: [number, number]): void;
    shoot?(target: string, location: [number, number]): void;
    cure?(mate: string, location: [number, number]): void;
  }
  
  class Soldier implements Action {
  
    private equipmentSet: string;
    number: number;
  
    constructor(set: string, number: number) {
      // initialization consumes time
      this.equipmentSet = set;
      this.number = number;
      console.log(`new soldier ${number}`);
    }
  
    move(location: [number, number]): void {
      console.log(`move to ${location}`)
    }
  
    shoot?(target: string, location: [number, number]): void {
      console.log(`damage ${target} at ${location}`);
    }
  
    cure?(mate: string, location: [number, number]): void {
      console.log(`cure ${mate} at ${location}`);
    }
  }
  
  class SoldierAcademy {
    private static groups: { [set: string]: Soldier } = {}
  
    public static getSoldier(set: string, num: number) {
      let soldier = SoldierAcademy.groups[set];
  
      if (!soldier) {
        soldier = new Soldier(set, num);
        SoldierAcademy.groups[set] = soldier;
      } else {
        soldier.number = num;
        console.log(`shared soldier ${soldier.number}`);
      }
  
      return soldier;
    }
  }
```

### USAGE:
```typescript
const start = Math.floor(Date.now());
for (let i = 0; i < 1000; i++) {
  // new Soldier('normal-set', i); // create 1m real soldiers
  SoldierAcademy.getSoldier('normal-set', i); // create 1 soldier
}
const end = Math.floor(Date.now());
console.log(end - start);
```

### OUTPUT:
```typescript
// "new soldier 0" 
// "shared soldier 1" 
// "shared soldier 2" 
// ...
// "shared soldier 999" 
// 5409
```

## ☔ Proxy
The proxy pattern is used to provide a surrogate or placeholder object, which references an underlying object. Proxy is used for loading object on demand.

### Example:
```typescript
interface IResource {
    fetch(): void;
  }
  
  class ResourceProxy implements IResource {
    private resource: Resource;
  
    constructor() {
      this.resource = new Resource();
    }
  
    fetch(): void {
      //
      console.log('invoke resource fetch method')
      this.resource.fetch();
    }
  }
  
  class Resource implements IResource {
    fetch(): void {
      console.log('fetch resource')
    }
  }
```

### USAGE:
```typescript
const proxy = new ResourceProxy();
proxy.fetch();
```

### OUTPUT:
```typescript
// "invoke resource fetch method"
// "fetch resource" 
```

## Resources:
[Design Patterns implemented in Swift 5.0](https://github.com/ochococo/Design-Patterns-In-Swift#readme)
[Design Patterns](https://refactoring.guru/design-patterns/)
