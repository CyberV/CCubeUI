import { LoginService } from "app/login/login.service";
import { IonItem } from '@ionic/angular';
import { async } from 'q';

let domain: string = 'api-ccube.herokuapp.com';
//let  url: string = 'https://' + this.domain + '/api/';

let url: string = 'http://localhost:4000/api/';

let data = null;

let init = async function () {
    return new Promise( (resolve) => {
        console.log('INIT COMMON');
        fetch(url+"plan/getCommonData").then(response => response.json()).then((res:any) => {
        console.log('INIT COMMON RESPONSE', res);
    
            if (res.success) {
                data = res.data
               resolve (res.data);
            } else {
                resolve (null);
            }
        });
    })
    
};

(async function asd() {
    await init();
} )();

export function  planData() {
    return data;
}
