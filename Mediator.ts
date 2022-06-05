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

// USAGE:
function spamMonster(message: string, worker: MessageMediator) {
    worker.send(message);
}

const messageMediator = new MessageMediator();

const user1 = new Programmer("Linus Torvalds");
const user2 = new Programmer("Tim Cook");

messageMediator.add(user1);
messageMediator.add(user2);

spamMonster("I'd Like to Add you to My Professional Network", messageMediator);

// OUTPUT:
// "Linus Torvalds received: I'd Like to Add you to My Professional Network" 
// "Tim Cook received: I'd Like to Add you to My Professional Network"