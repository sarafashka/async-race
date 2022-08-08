import { getCars } from './appLoad';
import {
  ICarsWinners, WinnersOnPage, ICar, IWinner, SortWinners, Sort,
} from './interfaces';
import paginate from './utils/paginate';

class Winners {
  countOfWinners: number;

  WINNERS_ON_PAGE: number;

  sortWinners: SortWinners;

  constructor() {
    this.WINNERS_ON_PAGE = 10;
    this.countOfWinners = 0;
    this.sortWinners = { sort: 'id', order: 'ASC' };
  }

  async getWinnersInfo(winnersOnPage: WinnersOnPage) {
    const { winners, count } = winnersOnPage;
    const cars = await getCars();

    const carsWinners: ICarsWinners[] = this.getCarsWinners(cars.cars, winners);
    return { carsWinners, count };
  }

  getCarsWinners(cars: Array<ICar>, winners: Array<IWinner>) {
    const carsWinners: Array<ICarsWinners> = [];
    winners.forEach((winner) => {
      cars.forEach((car) => {
        if (car.id === winner.id) {
          const common = {
            id: winner.id, name: car.name, color: car.color, wins: winner.wins, time: winner.time,
          };
          carsWinners.push(common);
        }
      });
    });
    return carsWinners;
  }

  open() {
    const winners = document.getElementById('winners');
    winners?.classList.add('winners_open');
  }

  close() {
    const winners = document.getElementById('winners');
    if (winners?.classList.contains('winners_open')) winners.classList.remove('winners_open');
  }

  sort(
    sort:Sort,
    button:HTMLElement,
    callback:() => void,
  ) {
    this.sortWinners.sort = sort;
    this.defineSortOrder(button);
    callback();
  }

  defineSortOrder(button:HTMLElement) {
    const ASC = 'ASC';
    const DESC = 'DESC';
    this.clearSortOrder(button, ASC, DESC);

    if (!button.classList.contains(ASC) && !button.classList.contains(DESC)) {
      button.classList.add(ASC);
      this.sortWinners.order = ASC;
    } else if (button.classList.contains(DESC)) {
      button.classList.remove(DESC);
      button.classList.add(ASC);
      this.sortWinners.order = ASC;
    } else if (button.classList.contains(ASC)) {
      button.classList.remove(ASC);
      button.classList.add(DESC);
      this.sortWinners.order = DESC;
    }
  }

  clearSortOrder(button:HTMLElement, order1:string, order2:string) {
    const winnersTime = document.querySelector('.winners__time');
    const winnersWins = document.querySelector('.winners__wins');

    if (button.classList.contains('winners__time')) {
      winnersWins?.classList.remove(order1, order2);
    }

    if (button.classList.contains('winners__wins')) {
      winnersTime?.classList.remove(order1, order2);
    }
  }

  pagination(direction:string, callback:() => void) {
    const page = <HTMLElement>document.getElementById('winnersPage');
    paginate(direction, callback, page, this.WINNERS_ON_PAGE, this.countOfWinners);
  }

  getPageNumber() {
    const page = <HTMLElement>document.getElementById('winnersPage');
    return Number(page?.innerHTML);
  }
}
export default Winners;
