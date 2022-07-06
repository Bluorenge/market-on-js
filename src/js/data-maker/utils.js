// Импортируем информацию о товарах для поиска
import { ENTER_KEYCODE } from "./data-maker";

const randomColor = el => (el.style.backgroundColor = `#` + Math.floor(Math.random() * 16777215).toString(16));
/**
 * Получаем индекс последнего элемента на текущем уровне
 *
 * @param {collection} parentNode - родитель элемента
 * @param {string} className - имя класса
 * @returns
 */
const indexOfLastElement = (parentNode, className) => {
    // Находим количество элементов
    const lastElement = [...parentNode.children].filter(e => e.classList.contains(className));
    // Получаем индекс последнего элемента на первом уровне
    return lastElement.length + 1;
};

// Находим в массиве объект по его value
const findElementInArr = (value, arr, searchValue) =>
    arr.reduce((a, item) => {
        if (a) {
            return a;
        }
        if (item[value] === searchValue) {
            return item;
        }
        if (item.subCategory) {
            return findElementInArr(value, item.subCategory, searchValue);
        }
        if (item.productsInCategory) {
            return findElementInArr(value, item.productsInCategory, searchValue);
        }
    }, null);

// Находим все элементы в массиве по его имени
// ! функция в функции, потому что привязка к внешней переменной
const inputFindProduct = (nameFromInput, arr) => {
    // [] с найденными через input элементами
    let foundItems = [];

    /* Рекурсивный поиск всех элементов по всему массиву
    Функция, принимающая на вход:
      arr - сам массив
      firstLevel - имя ключа первого уровня
      secondLevel - имя ключа второго уровня
      searchName - имя поиска
  */
    const findProduct = (arr, firstLevel, secondLevel, searchName) => {
        if (arr !== undefined) {
            // Проходим по каждому элементу массива
            arr.map(item => {
                if (item.name !== undefined) {
                    if (item.name.toLowerCase() === searchName.toLowerCase()) {
                        foundItems.push(item);
                    }
                    // Если элемент массива содержит ключ поиска, то..
                    else if (secondLevel in item) {
                        /* Фильтруем переданный массив по имени поиска
                В каждом элементе ищем имя
                  приводим его к нижнему регистру
                  и проверяем на содержание символов, переданных в атрибуте searchName
            */
                        let newItem = item[secondLevel].filter(
                            item => item.name.toLowerCase() === searchName.toLowerCase(),
                        );

                        // Добавляем отфильтрованный массив во внешнюю переменную foundItems
                        foundItems = foundItems.concat(newItem);

                        return foundItems;
                    } else {
                        // Иначе снова вызываем функцию поиска в подкатегории
                        return findProduct(item[firstLevel], firstLevel, secondLevel, searchName);
                    }
                }
            });
        }
    };

    // ! привязка к названиями потомков
    findProduct(arr, `subCategory`, `productsInCategory`, nameFromInput);

    return foundItems;
};

const findElementsOfArrayByKey = (nameFromInput, arr) => {
    // [] с найденными через input элементами
    let foundItems = [];

    /* Рекурсивный поиск всех элементов по всему массиву
      Функция, принимающая на вход:
        arr - сам массив
        firstLevel - имя ключа первого уровня
        secondLevel - имя ключа второго уровня
        searchName - имя поиска
    */
    const findProduct = (arr, firstLevel, secondLevel, searchName) => {
        if (arr !== undefined) {
            // Проходим по каждому элементу массива
            arr.map(item => {
                foundItems.push(item.id);
                // Если элемент массива содержит ключ поиска, то..
                if (secondLevel in item) {
                    // Иначе снова вызываем функцию поиска в подкатегории
                    return findProduct(item[secondLevel], firstLevel, secondLevel, searchName);
                }
                if (firstLevel in item) {
                    // Иначе снова вызываем функцию поиска в подкатегории
                    return findProduct(item[firstLevel], firstLevel, secondLevel, searchName);
                }
            });
        }
    };

    // ! привязка к названиями потомков
    findProduct(arr, `subCategory`, `productsInCategory`, nameFromInput);

    return foundItems;
};

// Функция задержки выполнения функции
const debounce = (func, wait, immediate) => {
    let timeout;

    return function () {
        let context = this,
            args = arguments;
        let callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            timeout = null;
            if (!immediate) {
                func.apply(context, args);
            }
        }, wait);

        if (callNow) {
            func.apply(context, args);
        }
    };
};

// Проверка на нажатие enter
const checkEnter = e => {
    e = e || event;
    const txtArea = /textarea/i.test((e.target || e.srcElement).tagName);
    return txtArea || (e.keyCode || e.which || e.charCode || 0) !== ENTER_KEYCODE;
};

export {
    randomColor,
    indexOfLastElement,
    findElementInArr,
    inputFindProduct,
    debounce,
    checkEnter,
    findElementsOfArrayByKey,
};
