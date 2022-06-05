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


// USAGE:
const podBayDoors = "Pod Bay Doors";
const doorModule = new HAL9000DoorsOperations(podBayDoors);

console.log(doorModule.open()); //Opened Pod Bay Doors
console.log(doorModule.close()); //Closed Pod Bay Doors

