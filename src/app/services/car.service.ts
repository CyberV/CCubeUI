import { Injectable } from '@angular/core';
import carsList from 'assets/carslist.json';
import { PlanService } from './plan.service';

let findMatchingCar = function (car) {
  let found = null;
  try {

    let makerStr = car.maker.split(' ')[0].toLowerCase();
    let modelStr = car.model.toLowerCase().replace(makerStr, "").trim();

    if (modelStr.split(' ').length) {
      modelStr = modelStr.split(' ')[0];
    }

    let filtered = carsList.filter((maker) => maker.maker.toLowerCase().includes(makerStr));

    if (filtered && filtered.length) {
      let cars = filtered[0].cars.filter((_car) => _car.model.toLowerCase().includes(modelStr));

      if (cars && cars.length) {
        found = {
          ...cars[0],
          ...car,
          maker: car.maker,
          model: car.model
        };
      } else {
        found = {
          image: './assets/icons/makers/models/0.png',
          ...car,
          maker: car.maker,
          missing: true
        };
      }
    }
  } catch (err) {
    return null;
  }
  return found;
}

@Injectable({
  providedIn: 'root'
})
export class CarService {

  constructor(
  ) { }

  changeCar(carDetails) {
    if (carDetails) {
      let found = findMatchingCar(carDetails);
      sessionStorage.setItem('currentCar', JSON.stringify(found ? found : carDetails));
    }
  }

  changeAddon(addonDetails) {
    if (addonDetails) {
      //let found = findMatchingCar(carDetails);
      sessionStorage.setItem('currentAddon', JSON.stringify(addonDetails));
      return addonDetails;
    } else {
      return null;
    }
  }

  clear(addonOnly = false) {
    if (!addonOnly) {
      sessionStorage.setItem('currentCar', null);
    }
    sessionStorage.setItem('currentAddon', null);
    sessionStorage.setItem('includedAddons', null);
    sessionStorage.setItem('includedAdhocs', null);
  
  }

  getCurrentAddon() {
    let addon: any = sessionStorage.getItem('currentAddon');

    if (addon && addon != "null") {
      addon = JSON.parse(addon);
      return addon;
    } else {
      return null;
    }
  }


  getCurrentCar() {
    let car: any = sessionStorage.getItem('currentCar');

    if (car && car != "null") {
      car = JSON.parse(car);

      let found = findMatchingCar(car);

      if (found) {
        return found;
      } else {
        return car;
      }

    } else {
      return null;
    }
  }
}
