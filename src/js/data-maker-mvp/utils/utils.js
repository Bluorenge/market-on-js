const ENTER_KEYCODE = 13;

export const randomColor = el => (el.style.backgroundColor = `#` + Math.floor(Math.random() * 16777215).toString(16));
/**
 * Получаем индекс последнего элемента на текущем уровне
 *
 * @param {collection} parentNode - родитель элемента
 * @param {string} className - имя класса
 * @returns
 */
export const indexOfLastElement = (parentNode, className) => {
    // Находим количество элементов
    const lastElement = [...parentNode.children].filter(e => e.classList.contains(className));
    // Получаем индекс последнего элемента на первом уровне
    return lastElement.length + 1;
};

// Находим в массиве объект по его value
export const findElementInArr = (value, arr, searchValue) =>
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
export const inputFindProduct = (nameFromInput, arr) => {
    // [] с найденными через input элементами
    let foundItems = [];

    /* Рекурсивный поиск всех элементов по всему массиву
    Функция, принимающая на вход:
      arr - сам массив
      firstLevel - имя ключа первого уровня
      secondLevel - имя ключа второго уровня
      searchName - имя поиска
  */
    const findProduct = (arrGoods, firstLevel, secondLevel, searchName) => {
        if (arrGoods) {
            // Проходим по каждому элементу массива
            arrGoods.map(item => {
                if (item.name) {
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
                            listItem => listItem.name.toLowerCase() === searchName.toLowerCase(),
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

export const findElementsOfArrayByKey = (nameFromInput, arr) => {
    // [] с найденными через input элементами
    let foundItems = [];

    /* Рекурсивный поиск всех элементов по всему массиву
      Функция, принимающая на вход:
        arr - сам массив
        firstLevel - имя ключа первого уровня
        secondLevel - имя ключа второго уровня
        searchName - имя поиска
    */
    const findProduct = (arrGoods, firstLevel, secondLevel, searchName) => {
        if (arrGoods) {
            // Проходим по каждому элементу массива
            arrGoods.map(item => {
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
export const debounce = (func, wait, immediate) => {
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
export const checkEnter = e => {
    e = e || event;
    const txtArea = /textarea/i.test((e.target || e.srcElement).tagName);
    return txtArea || (e.keyCode || e.which || e.charCode || 0) !== ENTER_KEYCODE;
};

// Путь к элементу
export const findParentId = (arr, id) => {
    let items = null;
    let continueSerach = true;

    const find = (arr, findId) => {
        arr.find(item => {
            // Если элемент найден на первом уровне, то прекращаем поиск
            if (item.id === findId) {
                continueSerach = false;
            } else if (continueSerach) {
                // Если есть подкатегории
                if (`subCategory` in item) {
                    // Если в этой ветке содержится нужный элемент
                    const itemHere = newItem =>
                        newItem.some(product => {
                            if (`subCategory` in product) {
                                itemHere(product.subCategory);
                            } else if (`productsInCategory` in product) {
                                itemHere(product.productsInCategory);
                            }
                        });
                    // Ищем в массиве с подкатегориями
                    itemHere(item.subCategory);
                    // Рекурсивно вызываем поиск
                    return find(item.subCategory, findId);
                }
                if (`productsInCategory` in item) {
                    // Если в этой категории содержится нужный элемент
                    const there = item.productsInCategory.some(product => product.id === findId);
                    if (there) {
                        items = { id: item.id };
                    }
                    return find(item.productsInCategory, findId);
                }
                if (item.id === findId) {
                    items = { id: item.id };
                }
            }
        });
    };
    find(arr, id);
    return items;
};
const list = [
    {
        id: 1,
        name: "Футболки",
        img: "1.png",
        subCategory: [
            {
                id: 2,
                name: "Крутые",
                img: "1.png",
                subCategory: [
                    {
                        id: 22,
                        name: "Крутые",
                        img: "1.png",
                        productsInCategory: [
                            {
                                id: 23,
                                name: "Крутая первая",
                                price: "1200",
                                img: "1.png",
                                active: true,
                                desc: "Состав: чистая крутость<br />Ваще круть",
                                options: {
                                    nameOptionList: "Степень крутости",
                                    optionList: [
                                        {
                                            1: true,
                                            price: "1200",
                                        },
                                        {
                                            2: true,
                                            price: "300",
                                        },
                                        {
                                            100500: true,
                                            price: "800",
                                        },
                                    ],
                                },
                            },
                            {
                                id: 24,
                                name: "Крутая вторая",
                                price: "1300",
                                img: "2.png",
                            },
                        ],
                    },
                ],
            },
            {
                id: 5,
                name: "Не оч крутые",
                img: "2.png",
                productsInCategory: [
                    {
                        id: 6,
                        name: "Ну такая первая",
                        price: "800",
                        img: "1.png",
                        active: true,
                        desc: "Состав: посредственность<br />Пойдёт",
                        options: {
                            nameOptionList: "Степень обычности",
                            optionList: [
                                {
                                    "-1": true,
                                    price: "800",
                                },
                                {
                                    "-2": true,
                                    price: "300",
                                },
                                {
                                    "-100500": true,
                                    price: "800",
                                },
                            ],
                        },
                    },
                ],
            },
        ],
    },
    {
        id: 7,
        name: "Толстковки",
        img: "1.png",
        subCategory: [
            {
                id: 8,
                name: "Крутые2",
                img: "1.png",
                subCategory: [
                    {
                        id: 9,
                        name: "Крутые3",
                        img: "1.png",
                        productsInCategory: [
                            {
                                id: 10,
                                name: "Крутая первая толст",
                                price: "1200",
                                img: "1.png",
                                desc: "Состав: чистая крутость<br />Ваще круть",
                                active: true,
                                options: {
                                    nameOptionList: "Степень крутости",
                                    optionList: [
                                        {
                                            1: true,
                                            price: "1200",
                                        },
                                        {
                                            2: true,
                                            price: "300",
                                        },
                                        {
                                            100500: true,
                                            price: "800",
                                        },
                                    ],
                                },
                            },
                            {
                                id: 11,
                                name: "Крутая вторая толст",
                                price: "1300",
                                img: "2.png",
                                active: true,
                            },
                        ],
                    },
                ],
            },
            {
                id: 12,
                name: "Не оч крутыеТол",
                img: "2.png",
                productsInCategory: [
                    {
                        id: 13,
                        name: "Ну такая первая",
                        price: "800",
                        img: "1.png",
                        desc: "Состав: посредственность<br />Пойдёт",
                        active: true,
                        options: {
                            nameOptionList: "Степень обычности",
                            optionList: [
                                {
                                    "-1": true,
                                    price: "800",
                                },
                                {
                                    "-2": true,
                                    price: "300",
                                },
                                {
                                    "-100500": true,
                                    price: "1800",
                                },
                            ],
                        },
                    },
                ],
            },
        ],
    },
    {
        id: 14,
        name: "Суперск",
        price: "6000",
        img: "1.png",
        active: true,
    },
    {
        id: 15,
        name: "Ееее",
        price: "200",
        img: "2.png",
        desc: "Состав: ееее.<br />Ееее ее е ееее.",
        active: false,
        options: {
            nameOptionList: "Е",
            optionList: [
                {
                    е: true,
                    price: "200",
                },
                {
                    ее: false,
                    price: "300",
                },
                {
                    еее: true,
                    price: "800",
                },
            ],
        },
    },
];

const list2 = [
    {
        id: 1,
        name: "Футболки",
        img: "1.png",
    },
];
// console.log('parentId(list2) :', parentId(list2))

// console.log(parentId(list, 24))
// console.log(parentId(list, 14))

// Проверка, отобразился ли элемент на странице
export const elementReady = (parent, selector) => {
    return new Promise(resolve => {
        let el = parent.querySelector(selector);
        if (el) {
            resolve(el);
        }
        new MutationObserver((mutationRecords, observer) => {
            // Query for elements matching the specified selector
            Array.from(parent.querySelectorAll(selector)).forEach(element => {
                resolve(element);
                // Once we have resolved we don`t need the observer anymore.
                observer.disconnect();
            });
        }).observe(parent.documentElement, {
            childList: true,
            subtree: true,
        });
    });
};

// Рекурсивный поиск одного элемента по всему массиву
export const findById = (arr, id) => {
    return arr.reduce((a, item) => {
        // При первой итерации этот if пропускается, потому что передаётся null
        if (a) {
            return a;
        }

        // Если текущий элемент массива содержит нужное имя, возращаем его. Если нет, то..
        if (item.id === id) {
            return item;
        }

        // ..берём элемент с ключом nestingKey и снова ищём в нём нужное имя, либо..
        if (`subCategory` in item) {
            return findById(item.subCategory, id);
        }

        // ..если нужно найти элемент в списке товаров в категории
        if (`productsInCategory` in item) {
            return findById(item.productsInCategory, id);
        }
    }, null);
};

export const findLastIndex = arr => {
    return arr
        .reduce((idArr, item) => {
            if (`subCategory` in item) {
                idArr.push(item.id);
                return idArr.concat(findLastIndex(item.subCategory));
            }
            if (`productsInCategory` in item) {
                idArr.push(item.id);
                return idArr.concat(findLastIndex(item.productsInCategory));
            }
            return idArr.concat(item.id);
        }, [])
        .sort((a, b) => a - b)
        .reverse()[0];
};
