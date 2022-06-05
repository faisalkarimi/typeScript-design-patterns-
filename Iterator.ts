type Novella = {
    name: string;
};

type Novellas = {
    novellas: Novella[];

    makeIterator(): NovellaIterator {
        return new NovellaIterator(novellas)
    }
};

class NovellaIterator {
    current = 0;
    novellas: Novella[];

    constructor(novellas: Novella[]) {
        this.novellas = novellas;
    }

    next(): Novella {
        return this.novellas.length > this.current++ ? this.novellas[this.current] : null;
    }
}

