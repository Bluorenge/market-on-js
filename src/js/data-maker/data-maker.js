import {
    createFieldsetCategory,
    createFieldsetProduct,
    createProductDesc,
    createOptionWrap,
    createOption,
    createTree,
} from "./templates";

import { findElementInArr, debounce, checkEnter, findElementsOfArrayByKey } from "./utils";

import * as findAnd from "find-and";
import * as clipboard from "clipboard";

// * Нельзя в категорию добавлять товар, если у неё есть подкатегория

// TODO: По-хорошему сделать бы проверку на общее количество конкретного товара в магазине
// TODO: реализовать возможность добавлять несколько опций к товару
// TODO: если удалить средний блок, то нарушится нумерация - может убрать вообще её?

// TODO: цену первой (активной?) опции нельзя менять - потому что в магазине выбирается первая активная опция

// TODO: добавить разные цвета для новых блоков (логичнее через css)
// TODO: добавить проверку активности категории

// // TODO: добавить проверку наличия товара
// // TODO: реализовать возможность удалять товар/категорию
// // TODO: реализовать возможность скрывать товар/категорию

// // ! если не задать имя предыдущей подкатегории с созданным товаром, то нельзя добавить следующую подкатегорию

const ENTER_KEYCODE = 13;
const formWrap = document.querySelector(`.data-maker__wrap`);
const userIdInput = formWrap.querySelector(`.data-maker__input--user-id`);
const currencyInput = formWrap.querySelector(`.data-maker__input--currency`);

const entry = formWrap.querySelector(`.data-maker__entry-point`);
const entryProductBtn = entry.querySelector(`.data-maker__add--product`);
const enrtyCategoryBtn = entry.querySelector(`.data-maker__add--category`);

let globalSetting = {
    userId: ``,
    currency: ``,
};
let productList = [];
let id = 1;

const submitBtn = formWrap.querySelector(`.data-maker__btn`);

const infoBlock = document.querySelector(`.data-maker__block-info`);
const infoText = infoBlock.querySelector(`.data-maker__block-info-text`);
const copyInfoBtn = infoBlock.querySelector(`.data-maker__block-info-btn-copy`);

const copyInfo = new clipboard(copyInfoBtn);

const addElementOnEntryLevel = (type, elementInsert) => {
    let typeOfFields;

    if (type === `product`) {
        typeOfFields = createFieldsetProduct(id);
    } else if (type === `category`) {
        typeOfFields = createFieldsetCategory(id, `категории`);
    }

    elementInsert.insertAdjacentHTML(`beforebegin`, typeOfFields);

    const addData = {
        id,
        name: ``,
    };
    if (type === `product`) {
        (addData.price = 0), (addData.active = true);
    }

    productList.push(addData);
    id++;
};

/**
 * Добавление товара
 *
 * @param {HTMLElement} target - элемент из обработчика
 * @param {HTMLElement} parentNode - индекс товара
 * @param {object} data - объект товара
 */
const addProduct = (target, parentNode, data) => {
    // Находим кнопку добавления товара
    const productToCatBtn = [...parentNode.children].filter(el => el.classList.contains(`data-maker__add--product`))[0];

    // Находим кнопкe добавления подкатегории
    const subCategoryBtn = parentNode.querySelector(`.data-maker__add--subcategory`);

    // Добавляем товар в текущую категорию
    if (productToCatBtn === target) {
        // Добавляем товар на страницу
        productToCatBtn.insertAdjacentHTML(`beforebegin`, createFieldsetProduct(id));

        if (subCategoryBtn !== null) {
            subCategoryBtn.remove();
        }

        // Если категория уже имеет товары, добавляем товар как объект
        if (`productsInCategory` in data) {
            data.productsInCategory.push({
                id,
                name: ``,
                price: 0,
                active: true,
            });
        }
        // Иначе, добавляем массив с товарами
        else {
            productList = findAnd.appendProps(productList, data, {
                productsInCategory: [
                    {
                        id,
                        name: ``,
                        price: 0,
                        active: true,
                    },
                ],
            });
        }

        id++;
    }
};

/**
 * Добавление категории
 *
 * @param {HTMLElement} target - элемент из обработчика
 * @param {number} index - индекс товара
 * @param {object} data - объект товара
 */
const addCategory = (target, parentNode, data) => {
    // Находим кнопкe добавления подкатегории
    const subCategoryBtn = [...parentNode.children].filter(e =>
        e.classList.contains(`data-maker__add--subcategory`),
    )[0];

    const productBtn = parentNode.querySelector(`.data-maker__add--product`);

    if (subCategoryBtn === target) {
        // Добавляем подкатегорию
        subCategoryBtn.insertAdjacentHTML(`beforebegin`, createFieldsetCategory(id, `подкатегории`));

        if (productBtn !== null) {
            productBtn.remove();
        }

        // Если категория уже имеет категории, добавляем категорию как объект
        if (`subCategory` in data) {
            data.subCategory.push({
                id,
                name: ``,
            });
        }
        // Иначе добавляем массив с категориями
        else {
            productList = findAnd.appendProps(productList, data, {
                subCategory: [
                    {
                        id,
                        name: ``,
                    },
                ],
            });
        }

        id++;
    }
};

/**
 * Добавление опций товара
 *
 * @param {HTMLElement} target - элемент, пот которому сделан клик
 * @param {HTMLElement} element - обёртка товара
 * @param {number} elementId - индекс товара
 * @param {object} data - объект текущего товара
 */
const productOption = (target, element, elementId, data) => {
    // Кнопка открытия опций
    const openOptionWrapHandler = element.querySelector(`.data-maker__add--option-wrap`);

    // Цена товара
    const priceProduct = element.querySelector(`.data-maker__input--price-product`);

    // Открываем блок опций
    if (openOptionWrapHandler === target) {
        // Вставляем опции в элемент
        openOptionWrapHandler.insertAdjacentHTML(`beforebegin`, createOptionWrap(elementId));
        // Отображаем блок с опциями
        openOptionWrapHandler.style.display = `none`;

        // Добавляем цену в опцию
        const optionPrice = element.querySelector(`.data-maker__input--option-price`);
        optionPrice.value = Number(priceProduct.value);

        // Добавляем объект с опциями в итоговый массив
        productList = findAnd.appendProps(productList, data, {
            options: {
                nameOptionList: ``,
                optionList: [
                    {
                        optionName1: true,
                        price: Number(priceProduct.value),
                    },
                ],
            },
        });
    }

    // Находим обёртку опций
    const wrapOption = element.querySelector(`.data-maker__option-wrap`);

    // Если обёртка опций существует
    if (wrapOption !== null) {
        // Добавляем опцию
        const addOptionHandler = wrapOption.querySelector(`.data-maker__add--option-item`);
        // Получаем номера всех опций
        const optionNum = wrapOption.querySelectorAll(`.data-maker__option-num`);
        // Получаем номер последней опции
        // * для корректного атрибута name инпута и уникального объекта
        let lastOptionNum = optionNum[optionNum.length - 1].textContent;

        // Находим блок пунктов опций
        const optionList = wrapOption.querySelector(`.data-maker__option`);

        // Если нажата кнопка добавления опции
        if (addOptionHandler === target) {
            // Увеличиваем номер последней опции
            lastOptionNum++;
            // Отрисовываем в конце блока с опциями
            optionList.insertAdjacentHTML(`beforeend`, createOption(elementId, lastOptionNum));
            // Добавляем цену в опцию
            const optionsPrice = optionList.querySelectorAll(`.data-maker__input--option-price`);
            const lastOptionPrice = optionsPrice[optionsPrice.length - 1];
            lastOptionPrice.value = priceProduct.value;
            // Добавляем инфу опции в массив опций итогового массива
            data.options.optionList.push({
                [`optionName` + lastOptionNum]: true,
                price: Number(priceProduct.value),
            });
        }

        // Ищем кнопку закрытия опций
        const closeOption = element.querySelector(`.data-maker__delete-btn--option`);

        // Если нажата кнопка закрытия опций
        if (closeOption === target) {
            // Удаляем блок с опциями
            wrapOption.remove();
            // Очищаем объект с опциями
            data.options = undefined;
            // Отображаем кнопку добавления
            openOptionWrapHandler.style.display = ``;
        }
    }
};

/**
 * Добавление описания товара
 *
 * @param {HTMLElement} target - элемент, пот которому сделан клик
 * @param {HTMLElement} element - обёртка товара
 * @param {number} elementId - индекс товара
 * @param {object} data - объект текущего товара
 */
const productDesc = (target, element, elementId, data) => {
    // Кнопка добавления описания
    const openProductDescHandler = element.querySelector(`.data-maker__add--desc`);

    if (openProductDescHandler === target) {
        // Вставляем блок описания перед кнопкой описания
        openProductDescHandler.insertAdjacentHTML(`beforebegin`, createProductDesc(elementId));
        // Скрываем кнопку добавления описания
        openProductDescHandler.style.display = `none`;
        // Добавляем поле описания в объект товара
        productList = findAnd.appendProps(productList, data, {
            desc: undefined,
        });
    }

    // Блок с описанием
    const wrapDesc = element.querySelector(`.data-maker__field-wrap--desc`);

    // Если существует
    if (wrapDesc !== null) {
        // Закрываем поле описания
        const closeDesc = element.querySelector(`.data-maker__delete-btn--desc`);

        if (closeDesc === target) {
            // Удаляем описание
            wrapDesc.remove();
            // Очищаем описание
            data.desc = undefined;
            // Отображаем кнопку добавления описания
            openProductDescHandler.style.display = ``;
        }
    }
};

const inputAddName = (inputFieldParent, currentElementInput, currentInput) => {
    // Название товара
    const inputName = inputFieldParent.querySelector(`.data-maker__input--name`);

    if (inputName === currentInput) {
        // Изменеяем имя текущего элемента в массиве
        currentElementInput.name = inputName.value;
        // Заменяем тайтл заголовка
        const titleProduct = inputFieldParent.querySelector(`.data-maker__fields-title`);
        titleProduct.textContent = inputName.value;
    }
};

const inputAddValue = (inputFieldParent, currentInput, currentChangeObject, changeValue) => {
    // Название картинки товара
    const input = inputFieldParent.querySelector(currentInput);
    currentChangeObject[changeValue] = input.value;
};

const getFieldId = fieldElement => {
    // Уникальный индекс нового элемента
    // * уникальный id для поиска элемента в массиве
    const fieldsId = Number(fieldElement.id);

    // Найденный объект элемента в массиве, соответсвующий индексу
    // * объект в [productList], соответствующий fieldsId
    return findElementInArr(`id`, productList, fieldsId);
};

// * Основной код приложения
// Обработчик события на инпут
// ? эта функция вызывается каждый раз при клике по форме
// * большая вложенность
const addInputEvent = () => {
    // Находим все инпуты в блоке
    const allInputsElement = formWrap.querySelectorAll(`.data-maker__input`);
    // Отрезаем первые два, потому что они из другого блока
    const allInputs = [...allInputsElement];
    allInputs.splice(0, 2);

    // Проходимся по всем массивам
    allInputs.forEach(input => {
        input.oninput = debounce(target => {
            // Находим родительского блока текущего инпута
            const inputFieldParent = target.path.find(item => item.classList.contains(`data-maker__fields`));

            // Находим объект родителя инпута в массиве
            const dataOfInput = getFieldId(inputFieldParent);

            // Название категории/товара
            inputAddName(inputFieldParent, dataOfInput, input);

            const activeProductInput = inputFieldParent.querySelector(`.data-maker__input--product-active`);

            if (input === activeProductInput) {
                dataOfInput.active = input.checked;
            }

            // Название картинки
            inputAddValue(inputFieldParent, `.data-maker__input--img`, dataOfInput, `img`);

            // Выбираем блок с продуктом
            if (inputFieldParent.classList.contains(`data-maker__fields--product`)) {
                // Цена товара
                const inputPrice = inputFieldParent.querySelector(`.data-maker__input--price-product`);
                dataOfInput.price = Number(inputPrice.value);

                // inputAddValue(
                //   inputFieldParent,
                //   `.data-maker__input--price-product`,
                //   dataOfInput,
                //   `price`
                // )

                // Описание товара
                const inputProductDesc = inputFieldParent.querySelector(`.data-maker__input--desc-product`);

                // ? если убрать вторую проверку, то косяк с именем
                if (inputProductDesc !== null && input === inputProductDesc) {
                    // Заполняем описане товара и меняем перенос
                    // на новую строку на hmtl-тег
                    dataOfInput.desc = input.value.replace(/\n/g, `<br />`);
                }

                // Блок с опциями товара
                const productOptionsWrap = inputFieldParent.querySelector(`.data-maker__option-wrap`);

                // Если блок с опциями найден
                if (productOptionsWrap !== null) {
                    // Ищем название опций
                    const inputProductOptionsName = productOptionsWrap.querySelector(
                        `.data-maker__input--option-list-name`,
                    );

                    // Если текущий импут, это имя блока опций
                    if (input === inputProductOptionsName) {
                        dataOfInput.options.nameOptionList = input.value;
                    }

                    // Ищём все опции
                    const inputProductOptionName = productOptionsWrap.querySelectorAll(`.data-maker__option-item`);

                    // Проходим по коллекции опций
                    for (let item of inputProductOptionName) {
                        // Находим номер опции
                        const itemNum = item.querySelector(`.data-maker__option-num`).textContent;

                        // Ищем название опции
                        const inputOptionName = item.querySelector(`.data-maker__input--option-name`);

                        // Ищем статус опции
                        const inputOptionStatus = item.querySelector(`.data-maker__input--option-active`);

                        const inputOptionPrice = item.querySelector(`.data-maker__input--option-price`);

                        // Ищем опцию в элементе массива
                        const option = dataOfInput.options.optionList[itemNum - 1];

                        // Если текущий инпут это имя опции
                        if (input === inputOptionName) {
                            productList = findAnd.replaceObject(productList, option, {
                                [input.value]: inputOptionStatus.checked,
                                price: Number(inputOptionPrice.value),
                            });
                        }

                        // Если текущий инпут это цена опции
                        if (input === inputOptionPrice) {
                            productList = findAnd.replaceObject(productList, option, {
                                [inputOptionName.value]: inputOptionStatus.checked,
                                price: Number(inputOptionPrice.value),
                            });
                        }

                        // Если текущий инпут это состояние опции
                        if (input === inputOptionStatus) {
                            productList = findAnd.replaceObject(productList, option, {
                                [inputOptionName.value]: input.checked,
                                price: Number(inputOptionPrice.value),
                            });
                        }
                    }
                }
            }

            console.log(`productList :`, productList);
        }, 500);
    });
};

// Создание структуры массива и отрисовка полей
// *главная функция
const createStructure = () => {
    const target = event.target;
    // Получаем обёртку полей первого уровня
    const entryFields = target.closest(`.data-maker__entry-point`);

    // Находим сообщение, побуждающее создать товар
    const message = entry.querySelector(`.message-to-create`);

    // Если найдено, удаляем его
    if (message !== null) {
        message.remove();
    }

    // Проверяем, первый ли это уровень
    if (entryFields !== null) {
        // Если это кнопка добавления товара первого уровня
        if (entryProductBtn === target) {
            addElementOnEntryLevel(`product`, entryFields);
        }

        // Если это кнопка добавления категории первого уровня
        if (enrtyCategoryBtn === target) {
            addElementOnEntryLevel(`category`, entryFields);
        }
    }

    // Находим элемент обёртки поля текущего уровня
    const fieldsWrap = target.closest(`.data-maker__fields`);

    // Если это блок товара/категории
    if (fieldsWrap !== null) {
        const currentElementClick = getFieldId(fieldsWrap);

        // Добавляем товар
        addProduct(target, fieldsWrap, currentElementClick);

        // Добавляем категорию
        addCategory(target, fieldsWrap, currentElementClick);

        // Если это продукт
        if (fieldsWrap.classList.contains(`data-maker__fields--product`)) {
            productDesc(target, fieldsWrap, fieldsWrap.id, currentElementClick);
            productOption(target, fieldsWrap, fieldsWrap.id, currentElementClick);
        }

        // Находим кнопку удаления
        const deleteFieldsBtn = fieldsWrap.querySelector(`.data-maker__delete-btn--fields`);

        if (deleteFieldsBtn === target) {
            // Удаляем объект из массива
            productList = findAnd.removeObject(productList, currentElementClick);

            const addSubcategoryBtn = (
                type,
                name,
            ) => `<div class="data-maker__add data-maker__add--${type}" tabindex="0">
        + Добавить ${name}
      </div>`;

            if (
                fieldsWrap.parentNode.querySelector(`.data-maker__add--subcategory`) === null &&
                fieldsWrap.parentNode !== formWrap
            ) {
                fieldsWrap.parentNode.insertAdjacentHTML(`beforeend`, addSubcategoryBtn(`subcategory`, `подкатегорию`));
            }

            // Проверка среди непосредственных потомков
            const parentProductBtn = [...fieldsWrap.parentNode.children].filter(el =>
                el.classList.contains(`data-maker__add--product`),
            )[0];

            // Если кнопка добавления продукта не найдена
            if (parentProductBtn === undefined && fieldsWrap.parentNode !== formWrap) {
                const subcategoryBtn = [...fieldsWrap.parentNode.children].filter(el =>
                    el.classList.contains(`data-maker__add--subcategory`),
                )[0];

                subcategoryBtn.insertAdjacentHTML(`beforebegin`, addSubcategoryBtn(`product`, `товар`));
            }

            // Удаляем группу полей
            fieldsWrap.remove();
        }

        // Находим кнопку скрытия блока
        const hideFieldsBtn = fieldsWrap.querySelector(`.data-maker__hide-btn`);

        if (hideFieldsBtn === target) {
            fieldsWrap.classList.toggle(`data-maker__fields--collapse`);
            if (hideFieldsBtn.textContent === `Скрыть`) {
                hideFieldsBtn.textContent = `Показать`;
            } else {
                hideFieldsBtn.textContent = `Скрыть`;
            }
        }
    }

    // Обработка клика по кнопке отправки формы
    if (submitBtn === target) {
        // Если массив с информацией пустой, отменяем действие по-умолчанию
        if (formWrap.checkValidity() && productList.length === 0) {
            const message = `<span class="message-to-create">Может быть нужно добавить товар или категорию?</span>`;
            submitBtn.insertAdjacentHTML(`beforebegin`, message);

            event.preventDefault();
        }

        // Если форма проходит валидацию и массив с инфой не пустой
        if (formWrap.checkValidity() && productList.length > 0) {
            // Показываем блок с массивом
            infoBlock.style.display = ``;
            // Переводим инфу о товарах в json формат и отрисовываем её в блоке
            const globalSettingJson = JSON.stringify(globalSetting);
            // Парсим массив в json и удаляем из него id
            const productListJson = JSON.stringify(productList);
            infoText.textContent = globalSettingJson + productListJson;
            event.preventDefault();
        }
    }

    console.log(`productList :`, productList);
};

/**
 * Проверка инпута на изменение
 *
 * @param {HTMLElement} element
 * @param {Object} object
 * @param {String} changeValue
 */
const checkInputValue = (element, object, changeValue) => {
    element.oninput = debounce(() => {
        object[changeValue] = element.value;
    }, 500);
};

const addWrapListener = () => {
    formWrap.onclick = () => {
        createStructure();
        addInputEvent();
    };

    formWrap.onkeydown = () => {
        // Запрещаем отправку формы по enter
        checkEnter();

        if (event.keyCode === ENTER_KEYCODE) {
            createStructure();
            addInputEvent();
        }
    };
};

checkInputValue(userIdInput, globalSetting, `userId`);
checkInputValue(currencyInput, globalSetting, `currency`);
addWrapListener();

copyInfo.on(`success`, e => {
    e.trigger.textContent = `Скопировано! Вставьте этот текст после кода магазина`;

    e.clearSelection();

    window.setTimeout(() => {
        e.trigger.textContent = `Скопировать информацию`;
    }, 4000);
});
(function () {
    `use strict`; // eslint-disable-line no-unused-expressions

    /* globals window:true */
    var _window = typeof window !== `undefined` ? window : this;
    const market = (_window.market = function (globalSettingIn, productListIn) {
        const setting = JSON.parse(globalSettingIn);
        const list = JSON.parse(productListIn);

        userIdInput.value = setting.userId;
        currencyInput.value = setting.currency;
        globalSetting = setting;
        productList = list;

        id = findElementsOfArrayByKey(`id`, productList).length;

        createTree(productList, `subCategory`, `productsInCategory`);
        const fields = document.querySelectorAll(`.data-maker__fields`);
        for (const field of fields) {
            field.classList.toggle(`data-maker__fields--collapse`);
            const hideFieldsBtn = field.querySelector(`.data-maker__hide-btn`);
            hideFieldsBtn.textContent = `Показать`;
        }
        checkInputValue(userIdInput, globalSetting, `userId`);
        checkInputValue(currencyInput, globalSetting, `currency`);
        addWrapListener();
    });
    return market;
});

export { ENTER_KEYCODE, entryProductBtn };
