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
  
// USAGE:
const group = new ItemsGroup();
group.addItem(new MainItem());
group.addItem(new SideItem());

const mainVisitor = new LogVisitor();
const sideVisitor = new DecorateVisitor();

group.accept(mainVisitor);
group.accept(sideVisitor);
// OUTPUT:
// "Log mainItem, and add new logics"
// "Log sideItem, and add new logics"
// "Decorate mainItem, and add new logics" 
// "Decorate sideItem, and add new logics" 