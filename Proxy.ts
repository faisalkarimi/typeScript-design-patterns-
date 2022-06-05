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
  
// USAGE:
    const proxy = new ResourceProxy();
    proxy.fetch();
// OUTPUT:
// "invoke resource fetch method"
// "fetch resource" 