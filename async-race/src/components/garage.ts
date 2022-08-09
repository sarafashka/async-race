/* eslint no-param-reassign:
 ["error", { "props": true, "ignorePropertyModificationsFor": ["name", "color"] }] */
import {
  ICarInGarage, INewCar, CarsInGarage, IWinner, WinnerUpdate,
} from './interfaces';
import {
  createCar, createWinner, getWinner, updateWinner,
} from './appLoad';
import { carBrand, carModal } from './utils/carModels';
import Car from './car';
import paginate from './utils/paginate';

class Garage {
  CARS_ON_PAGE: number;

  countOfCars: number;

  cars: Array<ICarInGarage>;

  constructor() {
    this.CARS_ON_PAGE = 7;
    this.countOfCars = 0;
    this.cars = [];
  }

  addCarsToGarage(cars:CarsInGarage) {
    this.countOfCars = cars.count;
    this.cars = cars.cars.map((car) => new Car(car.id, car.name, car.color));
  }

  openPopupCar(carId?:number) {
    const popupCar = <HTMLElement>document.getElementById('popupCar');
    popupCar.classList.add('popup_open');
    if (carId) {
      popupCar.dataset.car = String(carId);
      this.fillInput(carId);
    }
  }

  closePopupCarFalse() {
    const popupCar = <HTMLElement>document.getElementById('popupCar');
    if (popupCar.classList.contains('popup_open')) popupCar.classList.remove('popup_open');
    this.clearInfoAboutCar();
  }

  closePopupCarTrue(callback: () => void) {
    const popupInputName = <HTMLInputElement>document.getElementById('popupInputName');
    const popupInputColor = <HTMLInputElement>document.getElementById('popupInputColor');
    const popupCar = <HTMLElement>document.getElementById('popupCar');
    const carId = Number(popupCar.dataset.car);

    const infoAboutCar = this.getInfoAboutCar(popupInputName, popupInputColor);
    if (infoAboutCar.name === '') this.alertNoNameCar();

    else if (popupCar.classList.contains('popup_open')) {
      popupInputName.style.borderColor = '#000000';
      popupCar.classList.remove('popup_open');

      this.clearInfoAboutCar();

      if (carId) {
        const car = this.cars.find((el) => carId === el.id);
        if (!car) throw new Error('Car was not found');
        car.update(infoAboutCar, callback);
      } else this.createNewCar(infoAboutCar, callback);
    }
  }

  async fillInput(carId: number) {
    const popupInputName = <HTMLInputElement>document.getElementById('popupInputName');
    const popupInputColor = <HTMLInputElement>document.getElementById('popupInputColor');

    const car = this.cars.find((el) => carId === el.id);
    if (!car) throw new Error('Car was not found');
    popupInputName.value = car.name;
    popupInputColor.value = car.color;
  }

  generateСars(callback: () => void) {
    const numberOfCars = 3;
    for (let i = 0; i < numberOfCars; i += 1) {
      const newCar: INewCar = { name: '', color: '' };
      const modal = carModal[Math.floor(Math.random() * carModal.length)];
      const brand = carBrand[Math.floor(Math.random() * carBrand.length)];
      newCar.name = `${brand}  ${modal}`;
      newCar.color = `#${(Math.random().toString(16)).substring(2, 8)}`;
      this.createNewCar({ name: newCar.name, color: newCar.color }, callback);
    }
  }

  async createNewCar(info: INewCar, callback: () => void) {
    await createCar(info);
    callback();
  }

  private getInfoAboutCar(name:HTMLInputElement, color:HTMLInputElement) {
    return { name: name.value, color: color.value };
  }

  private alertNoNameCar() {
    const popupInputName = <HTMLElement>document.getElementById('popupInputName');
    popupInputName.style.borderColor = '#ff0000';
  }

  private clearInfoAboutCar() {
    const popupInputName = <HTMLInputElement>document.getElementById('popupInputName');
    const popupInputColor = <HTMLInputElement>document.getElementById('popupInputColor');
    const popupCar = <HTMLElement>document.getElementById('popupCar');

    popupInputName.value = '';
    popupInputColor.value = '#ff0000';

    if (popupCar.dataset.car) popupCar.dataset.car = '';
  }

  pagination(direction:string, callback: ()=> void) {
    const page = <HTMLElement>document.getElementById('garagePage');
    paginate(direction, callback, page, this.CARS_ON_PAGE, this.countOfCars);
  }

  getPageNumber() {
    const page = <HTMLElement>document.getElementById('garagePage');
    return Number(page?.innerHTML);
  }

  race() {
    let finish = false;
    this.changeRaceBtn(false);
    this.cars.forEach(async (car) => {
      const carElement = <HTMLElement>document.getElementById(String(car.id));
      const switchInput = <HTMLInputElement>carElement?.querySelector('.car__switch_input');
      switchInput.checked = true;
      const time = await car.startStop();
      const timeSec = Number(time) / 1000;

      if (!finish && timeSec) {
        finish = true;

        this.alertWinner(car.id, timeSec);
        this.createWinner(car.id, timeSec);
        this.changeResetBtn(true);
      }
    });
  }

  raceReset() {
    this.cars.forEach(async (car) => {
      const carElement = <HTMLElement>document.getElementById(String(car.id));
      const switchInput = <HTMLInputElement>carElement?.querySelector('.car__switch_input');
      switchInput.checked = false;
      await car.startStop();
    });
    this.closeAlertWinner();
    this.changeResetBtn(false);
    this.changeRaceBtn(true);
  }

  closeAlertWinner() {
    const alertOfWin = <HTMLElement>document.getElementById('garageWin');
    alertOfWin.innerHTML = '';
  }

  private async createWinner(idWin:number, timeWin: number) {
    const winnerInfo: IWinner | false = await this.getWinnerInfo(idWin);
    const countOfWins = 1;
    if (!winnerInfo) {
      const winnerNew = { id: idWin, wins: countOfWins, time: timeWin };
      await createWinner(winnerNew);
    } else {
      this.updateWinner(idWin, timeWin, winnerInfo);
    }
  }

  async updateWinner(idWin:number, timeWin: number, winnerInfo: IWinner) {
    const countOfWins = winnerInfo.wins + 1;
    const bestTime = timeWin <= winnerInfo.time ? timeWin : winnerInfo.time;
    const winnerUpdate: WinnerUpdate = { wins: countOfWins, time: bestTime };

    await updateWinner(idWin, winnerUpdate);
  }

  private async getWinnerInfo(idWin: number) {
    const winnerInfo: IWinner | false = await getWinner(idWin);
    return winnerInfo;
  }

  private alertWinner(idWin:number, timeWin: number) {
    const alertOfWin = <HTMLElement>document.getElementById('garageWin');
    const carInGarage = this.cars.find((car) => idWin === car.id);
    alertOfWin.innerHTML = `Win: ${carInGarage?.name} (${timeWin}s)`;
  }

  private changeResetBtn(reset:boolean) {
    const resetBtn = <HTMLButtonElement>document.getElementById('raceReset');
    if (reset) {
      resetBtn.disabled = false;
      resetBtn.style.color = '#ffcc4d';
    } else {
      resetBtn.disabled = true;
      resetBtn.style.color = '#707070';
    }
  }

  private changeRaceBtn(race:boolean) {
    const raceBtn = <HTMLButtonElement>document.getElementById('race');
    if (race) {
      raceBtn.disabled = false;
      raceBtn.style.color = '#ffcc4d';
      raceBtn.style.borderColor = '#ffcc4d';
    } else {
      raceBtn.disabled = true;
      raceBtn.style.color = '#707070';
      raceBtn.style.borderColor = '#707070';
    }
  }
}
export default Garage;
