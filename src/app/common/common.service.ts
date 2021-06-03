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
        data.updatedAt = +(new Date());
        localStorage.setItem('commonData', JSON.stringify(data));
    }
  }


let init = async function (city = "faridabad") {
    return new Promise( (resolve) => {

        let d = readCommonData();

        // if (d) {
        //     let old = d.updatedAt || +(new Date());
        //     let now = +(new Date());
        //     if (now - old >= (30* 60 * 1000)) {

        //     } else {
        //         console.log('Loading from cache. Last updated ' + ((now-old) /(60000) ) + ' minutes ago');
        //         resolve(d);
        //     }
        // }

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
                alert('Uh oh! Looks like a Connectivity Issue. Please try again in some time');
                resolve(null);
            }
        });
    })
    
};

export function getConfigValue(configKey) {
    let common = readCommonData();

    if (common) {
        let found = common.config.filter((c) => c.name == configKey);

        if (found.length) {
            return found[0].value;
        }
    } else {
        return null;
    }
}

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
