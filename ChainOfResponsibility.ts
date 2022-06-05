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


// USAGE:
const ten = new MoneyPile(10, 6);
const twenty = new MoneyPile(20, 2, ten);
const fifty = new MoneyPile(50, 2, twenty);
const hundred = new MoneyPile(100, 1, fifty);

// BUILD ATM:
const atm = new ATM(hundred, fifty, twenty, ten);
console.log(atm.withdraw(310)); //false
console.log(atm.withdraw(150)); //true