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
  
// USAGE:
    const factory = new ProductFactory();
    const product1 = factory.createProduct('product-a');
    const product2 = factory.createProduct('product-b');
    const product3 = factory.createProduct('product-c');
    product1.doSomething();
    product2.doSomething();
    product3.doSomething();
// OUTPUT:
// "Product A do this"
// "Product A do this"
// "Product B do this"
// "Product is unkown"