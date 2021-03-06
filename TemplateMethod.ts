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
  
// USAGE:
const a = new ConcreteAClass();
const b = new ConcreteBClass();

a.templateMethod();
b.templateMethod();
// OUTPUT:
// "A take actionA"
// "A take actionB" 
// "B take actionA" 
// "B take actionB"  