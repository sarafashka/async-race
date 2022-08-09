import { CarsInGarage, WinnersСarsOnPage } from '../components/interfaces';
import create from '../components/utils/createElement';
import imageSvg from '../components/utils/svgImage';

class Draw {
  app(carsInGarage: CarsInGarage) {
    const { body } = document;
    const wrapper = create({
      tagname: 'div', class: 'wrapper', parent: body, id: 'wrapper',
    });

    this.header(wrapper);
    this.garage(wrapper);
    this.cars(carsInGarage);
    this.footer(wrapper);
    this.winners();
    this.popup(body);
  }

  private header(wrapper:HTMLElement) {
    const { body } = document;
    const header = create({ tagname: 'header', class: 'header', parent: wrapper });
    create({
      tagname: 'div', class: 'header__logo', parent: header, text: 'Tractor Race',
    });
    const nav = create({ tagname: 'nav', class: 'header__nav', parent: header });
    create({
      tagname: 'div', class: 'header__garage', parent: nav, text: 'Garage',
    });
    create({
      tagname: 'div', class: 'header__winners', parent: nav, text: 'Luckers',
    });
    create({
      tagname: 'div', class: 'winners', id: 'winners', parent: body,
    });
  }

  private footer(wrapper:HTMLElement) {
    const footer = create({ tagname: 'footer', class: 'footer', parent: wrapper });
    const github = create({ tagname: 'div', class: 'github', parent: footer });
    const githubLink = <HTMLLinkElement>create({
      tagname: 'a', class: 'github__link', parent: github, text: '2022 © myGithub',
    });
    githubLink.href = 'https://github.com/sarafashka';
    const rss = create({ tagname: 'div', class: 'rss', parent: footer });
    const rssLink = <HTMLLinkElement>create({ tagname: 'a', class: 'rss__link', parent: rss });
    rssLink.href = 'https://rs.school/js/';
    create({ tagname: 'p', class: 'rss__logo', parent: rssLink });
  }

  // eslint-disable-next-line max-lines-per-function
  private garage(wrapper:HTMLElement) {
    const main = create({
      tagname: 'main', class: 'main', id: 'main', parent: wrapper,
    });
    const garage = create({ tagname: 'div', class: 'garage', parent: main });
    const garageAction = create({ tagname: 'div', class: 'garage__action', parent: garage });
    const garageCommon = create({ tagname: 'div', class: 'garage__common', parent: garageAction });
    create({
      tagname: 'div', class: 'garage__create', parent: garageCommon, text: 'Create new car',
    });
    create({
      tagname: 'div', class: 'garage__generate', parent: garageCommon, id: 'generateСars', text: 'Generate new cars',
    });
    const garageInfo = create({
      tagname: 'div', class: 'garage__info', parent: garageCommon, text: 'Cars in garage:',
    });
    create({
      tagname: 'span', class: 'garage__count', parent: garageInfo, text: '1', id: 'garageCount',
    });
    const pagination = create({ tagname: 'div', class: 'garage__pagination', parent: garageCommon });
    create({
      tagname: 'div', class: 'garage__pagination_prev', parent: pagination, text: 'Prev',
    });
    create({
      tagname: 'div', class: 'garage__pagination_cur', id: 'garagePage', parent: pagination, text: '1',
    });
    create({
      tagname: 'div', class: 'garage__pagination_next', parent: pagination, text: 'Next',
    });
    create({
      tagname: 'button', class: 'garage__race', parent: garageAction, id: 'race', text: "Let's get out",
    });
    const raceResetBtn = <HTMLButtonElement>create({
      tagname: 'button', class: 'garage__race_reset', parent: garageAction, id: 'raceReset', text: 'Reset',
    });
    raceResetBtn.disabled = true;
    create({
      tagname: 'div', class: 'garage__race_win', id: 'garageWin', parent: garage,
    });
    create({
      tagname: 'div', class: 'garage__cars', parent: garage, id: 'garageCars',
    });
  }

  // eslint-disable-next-line max-lines-per-function
  cars(carsInGarage: CarsInGarage) {
    const CARS_ON_PAGE = 7;
    const garage = document.getElementById('garageCars');
    const { cars, count } = carsInGarage;
    const garageCount = <HTMLElement>document.getElementById('garageCount');
    garageCount.innerHTML = String(count);
    if (!garage) throw new Error('The garage was not found');
    while (garage.firstChild) {
      garage.removeChild(garage.firstChild);
    }

    for (let i = 0; i < CARS_ON_PAGE; i += 1) {
      const garageTrack = create({ tagname: 'div', class: 'garage__track', parent: garage });
      create({
        tagname: 'div', class: 'garage__finish', id: `garageFinish${i}`, parent: garageTrack,
      });

      const car = cars[i];
      if (car) {
        const carItem = create({
          tagname: 'div', id: `${car.id}`, class: 'car', parent: garageTrack,
        });
        const carSettings = create({ tagname: 'div', class: 'car__settings', parent: carItem });
        create({ tagname: 'div', class: 'car__delete', parent: carSettings });
        create({ tagname: 'div', class: 'car__update', parent: carSettings });
        const carSwitch = create({ tagname: 'div', class: 'car__switch', parent: carItem });
        const carSwitchInput = <HTMLInputElement>create({ tagname: 'input', class: 'car__switch_input', parent: carSwitch });
        carSwitchInput.id = `carSwitch${car.id}`;
        carSwitchInput.type = 'checkbox';
        const carSwitchLabel = <HTMLLabelElement>create({ tagname: 'label', class: 'car__switch_label', parent: carSwitch });
        carSwitchLabel.htmlFor = carSwitchInput.id;
        const carImage = create({ tagname: 'div', class: 'car__image', parent: carItem });
        carImage.innerHTML = imageSvg;
        carImage.style.fill = car.color;
        create({
          tagname: 'div', class: 'car__name', parent: carItem, text: `${car.name}`,
        });
      }
    }
  }

  private winners() {
    const winnersDiv = <HTMLElement>document.getElementById('winners');
    const winnersWrapper = create({ tagname: 'div', class: 'winners__wrapper', parent: winnersDiv });
    const pagination = create({ tagname: 'div', class: 'winners__pagination', parent: winnersWrapper });
    create({
      tagname: 'div', class: 'winners__pagination_prev', parent: pagination, text: 'Prev',
    });
    create({
      tagname: 'div', class: 'winners__pagination_cur', id: 'winnersPage', parent: pagination, text: '1',
    });
    create({
      tagname: 'div', class: 'winners__pagination_next', parent: pagination, text: 'Next',
    });

    const winnersHead = create({ tagname: 'div', class: 'winners__head', parent: winnersWrapper });
    create({ tagname: 'div', class: 'winners__color', parent: winnersHead });
    create({
      tagname: 'div', class: 'winners__num', parent: winnersHead, text: '№',
    });
    create({
      tagname: 'div', class: 'winners__color', parent: winnersHead, text: 'Car',
    });
    create({
      tagname: 'div', class: 'winners__name', parent: winnersHead, text: 'Model',
    });
    create({
      tagname: 'div', class: 'winners__wins', parent: winnersHead, text: 'Wins',
    });
    create({
      tagname: 'div', class: 'winners__time', parent: winnersHead, text: 'Best time(sec)',
    });
    create({
      tagname: 'div', class: 'winners__list', id: 'winnersList', parent: winnersWrapper,
    });
    create({
      tagname: 'div', class: 'winners__image', parent: winnersWrapper,
    });
  }

  winnersList(winnersCarsOnPage: WinnersСarsOnPage) {
    const winnersList = document.getElementById('winnersList');
    if (!winnersList) throw new Error('Winners not found');

    while (winnersList.firstChild) {
      winnersList.removeChild(winnersList.firstChild);
    }
    if (winnersCarsOnPage) {
      const { carsWinners, count } = winnersCarsOnPage;

      carsWinners.forEach((carWinner, i) => {
        const winnersItem = create({ tagname: 'div', class: 'winner', parent: winnersList });
        create({
          tagname: 'div', class: 'winner__num', parent: winnersItem, text: `${i + 1}`,
        });
        const winnerColor = create({ tagname: 'div', class: 'winner__color', parent: winnersItem });
        winnerColor.innerHTML = imageSvg;
        winnerColor.style.fill = carWinner.color;
        create({
          tagname: 'div', class: 'winner__name', parent: winnersItem, text: `${carWinner.name}`,
        });
        create({
          tagname: 'div', class: 'winner__wins', parent: winnersItem, text: `${carWinner.wins}`,
        });
        create({
          tagname: 'div', class: 'winner__time', parent: winnersItem, text: `${carWinner.time}`,
        });
      });

      const winnersCount = create({
        tagname: 'div', class: 'winners__count', parent: winnersList, text: 'Winners:',
      });

      create({
        tagname: 'span', class: 'winners__number', parent: winnersCount, id: 'winnersNumber', text: `${count}`,
      });
    }
  }

  private popup(body:HTMLElement) {
    const popup = create({
      tagname: 'div', class: 'popup', parent: body, id: 'popupCar',
    });
    const popupBody = create({ tagname: 'div', class: 'popup__body', parent: popup });
    const popupWindow = create({ tagname: 'div', class: 'popup__window', parent: popupBody });
    const popupContent = create({ tagname: 'div', class: 'popup__content', parent: popupWindow });
    const popupSelectName = <HTMLInputElement>create({
      tagname: 'input', class: 'popup__name', parent: popupContent, id: 'popupInputName',
    });
    popupSelectName.type = 'text';
    popupSelectName.placeholder = 'Type here';
    popupSelectName.autocomplete = 'off';
    const popupLabelName = <HTMLLabelElement>create({
      tagname: 'label', parent: popupContent, text: 'Select name',
    });
    popupLabelName.htmlFor = 'popupInputName';
    const popupSelectColor = <HTMLInputElement>create({
      tagname: 'input', class: 'popup__color', parent: popupContent, id: 'popupInputColor',
    });
    popupSelectColor.value = '#ff0000';
    popupSelectColor.type = 'color';
    const popupLabelColor = <HTMLLabelElement>create({
      tagname: 'label', parent: popupContent, text: 'Select color',
    });
    popupLabelColor.htmlFor = 'popupInputColor';
    create({
      tagname: 'button', class: 'popup__button', parent: popupContent, id: 'popupButton', text: 'Ok',
    });
    create({
      tagname: 'div', class: 'popup__cross', parent: popupContent, id: 'popupCross', text: 'x',
    });
  }
}
export default Draw;
