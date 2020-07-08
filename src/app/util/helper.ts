
import { Platform } from '@ionic/angular';

let savedInstance;

class Helper {
    public isMobile = function() {
        return !this.platform.is('desktop');
      }
      
      constructor(private platform) {

      }
    
}

const GetInstance = function() {
    if (savedInstance) {
        return savedInstance;
    } else {
        savedInstance = new Helper(Platform);
    }
}

export default GetInstance();
  