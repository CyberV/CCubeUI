import { Injectable } from '@angular/core';
import carsList from 'assets/carslist.json';

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
          maker: car.maker
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

  constructor() { }

  changeCar(carDetails) {
    if (carDetails) {
      let found = findMatchingCar(carDetails);
      sessionStorage.setItem('currentCar', JSON.stringify(found? found : carDetails));
    }
  }

  clear() {
    sessionStorage.setItem('currentCar', null);
  }



  getCurrentCar() {
    let car: any = sessionStorage.getItem('currentCar');

    if (car && car != "null") {
      car = JSON.parse(car);

      let found = findMatchingCar(car);

      if(found) {
        return found;
      } else {
        return car;
      }

    } else {
      return null;
    }
  }
}
