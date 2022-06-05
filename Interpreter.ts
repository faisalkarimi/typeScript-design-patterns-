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

// USAGE:
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
// OUTPUT:
//6
