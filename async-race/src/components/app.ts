import Garage from './garage';
import Winners from './winners';
import Draw from '../draw/draw';
import { getCars, getWinners } from './appLoad';
import check from './utils/checkClass';
import { CarsInGarage } from './interfaces';

class App {
  private garage: Garage;

  private winners: Winners;

  private draw: Draw;

  constructor() {
    this.garage = new Garage();
    this.winners = new Winners();
    this.draw = new Draw();
  }

  async start() {
    const PAGE_START = 1;
    await this.requestCars(PAGE_START);
    this.addHandlers();
  }

  private addHandlers() {
    const body = <HTMLElement>document.querySelector('body');
    body.addEventListener('click', (e:Event) => this.defineTarget(e));

    const popupCar = <HTMLElement>document.getElementById('popupCar');
    popupCar?.addEventListener('click', (e:Event) => this.defineTarget(e));
  }

  private defineTarget(event: Event) {
    console.log(event.target);
    const button = <HTMLElement>event.target;
    const carId = Number(button.closest('.car')?.id);
    if (check(button, 'garage__create')) this.garage.openPopupCar();
    if (check(button, 'garage__generate')) this.garage.generateСars(this.requestCars.bind(this));
    if (check(button, 'header__winners')) this.requestWinners();
    if (check(button, 'header__garage')) this.winners.close();

    if (check(button, 'garage__pagination_prev')) this.garage.pagination('prev', this.requestCars.bind(this));
    if (check(button, 'garage__pagination_next')) this.garage.pagination('next', this.requestCars.bind(this));

    if (check(button, 'popup__button')) this.garage.closePopupCarTrue(this.requestCars.bind(this));
    if (check(button, 'popup__cross')) this.garage.closePopupCarFalse();

    if (check(button, 'garage__race')) this.garage.race();
    if (check(button, 'garage__race_reset')) this.garage.raceReset();

    if (check(button, 'winners__time')) this.winners.sort('time', button, this.requestWinners.bind(this));
    if (check(button, 'winners__wins')) this.winners.sort('wins', button, this.requestWinners.bind(this));

    if (check(button, 'winners__pagination_prev')) this.winners.pagination('prev', this.requestWinners.bind(this));
    if (check(button, 'winners__pagination_next')) this.winners.pagination('next', this.requestWinners.bind(this));

    if (carId) {
      const carInGarage = this.garage.cars.find((car) => carId === car.id);
      if (check(button, 'car__update')) this.garage.openPopupCar(carId);
      if (check(button, 'car__delete')) carInGarage?.delete(this.requestCars.bind(this));
      if (check(button, 'car__switch_input')) carInGarage?.startStop();
    }
  }

  protected async requestCars(pageStart?:number) {
    let pageNumber: number;
    pageNumber = this.garage.getPageNumber();
    if (pageStart) pageNumber = pageNumber || pageStart;

    const cars = await getCars(pageNumber, this.garage.CARS_ON_PAGE);
    this.view(cars);
    this.garage.addCarsToGarage(cars);
  }

  protected async requestWinners() {
    const page = this.winners.getPageNumber();
    const { sort, order } = this.winners.sortWinners;
    const limit = this.winners.WINNERS_ON_PAGE;

    const winnersOnPage = await getWinners(page, sort, order, limit);
    this.winners.countOfWinners = winnersOnPage.count;

    const winnersCarsOnPage = await this.winners.getWinnersInfo(winnersOnPage);
    this.draw.winnersList(await winnersCarsOnPage);
    this.winners.open();
  }

  private view(cars:CarsInGarage) {
    const wrapper = document.getElementById('wrapper');
    if (wrapper) this.draw.cars(cars);
    else this.draw.app(cars);
  }
}

export default App;
