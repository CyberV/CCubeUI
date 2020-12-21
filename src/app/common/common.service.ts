import { LoginService } from "app/login/login.service";
import { IonItem } from '@ionic/angular';
import { async } from 'q';

let domain: string = 'api-ccube.herokuapp.com';
let  url: string = 'https://' + domain + '/api/';

//let url: string = 'http://localhost:4000/api/';

let data = null;


let readCommonData = function () {
    let addons = localStorage.getItem('commonData');
    return addons && addons != "null" ? JSON.parse(addons) : null;
  }

  let saveCommonData = function(data) {
    if (data) {
        localStorage.setItem('commonData', JSON.stringify(data));
    }
  }


let init = async function (city = "faridabad") {
    return new Promise( (resolve) => {

        if (!city || city == '') {
            city = "faridabad"
        }
        console.log('INIT COMMON REquest', city);
        fetch(url+"plan/getCommonData/"+city).then(response => response.json()).then((res:any) => {
        console.log('INIT COMMON RESPONSE', res);
    
            if (res.success) {
                data = res.data
                saveCommonData(res.data);
               resolve (res.data);
            } else {
                resolve (null);
            }
        });
    })
    
};

// (async function asd() {
//     await init();
// } )();

export async function Initialize(city) {
    await init(city);
}

export function  planData() {

    if (!data && readCommonData()) {
        return readCommonData();
    }
    return data;
}
