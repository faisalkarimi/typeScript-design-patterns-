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
  
// USAGE:
const adapter = new InterfaceAdapter();
adapter.request('param');
// OUTPUT:
// "Request made in old interface." 