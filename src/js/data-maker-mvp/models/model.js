import { createStore, createEffect } from "effector";
import { eventsForDataMaker } from "./eventsForDataMaker";
import * as findAnd from "find-and";
import { findById, findLastIndex } from "../utils/utils";

export const $typeView = createStore(`setting`);
$typeView.on(eventsForDataMaker.changeView, (_, type) => type);

export const fetchUserMarketFx = createEffect({
    async handler(value) {
        const req = await value;
        return req ? JSON.parse(req) : req;
    },
    // async handler({id}) {
    // const url = `https://api.github.com/users/${id}/repos`
    // const req = await fetch(url)
    //   return res.json()
    // },
    // },
});

export const $currentId = createStore(1);
$currentId.on(eventsForDataMaker.setCurrentIdValue, (_, data) => data);

export let menuList = [];

export const $settingOfMarket = createStore(null);
$settingOfMarket
    .on(fetchUserMarketFx.doneData, (_, data) => {
        return data ? data[0] : $settingOfMarket.defaultState;
    })
    .on(eventsForDataMaker.updateSetting, (_, data) => {
        return {
            id: data.id,
            currency: data.currency,
        };
    });

export const $idContent = createStore(1);
$idContent
    .on(fetchUserMarketFx.doneData, (_, data) => {
        return data ? findLastIndex(data[1]) : $idContent.defaultState;
    })
    .on(eventsForDataMaker.idContentIncrease, state => {
        state++;
        return state;
    });

export const $isFormValidate = createStore(false);
$isFormValidate.on(eventsForDataMaker.toggleValidate, (_, isValidate) => isValidate);

export const $productList = createStore([]);
$productList
    .on(fetchUserMarketFx.doneData, (_, data) => {
        return data ? data[1] : $productList.defaultState;
    })
    .on(eventsForDataMaker.makeCategory, (state, data) => {
        const find = findById(state, data.id);
        let newObject = { id: data.id, name: data.item.name, img: data.item.img };

        if (find?.subCategory) {
            newObject.subCategory = find.subCategory;
        }

        if (find?.productsInCategory) {
            newObject.productsInCategory = find.productsInCategory;
        }

        if (!find) {
            state.push(newObject);
        } else {
            state = findAnd.replaceObject(state, { id: data.id }, newObject);
        }
        console.log("eventsForDataMaker.makeCategory :", state);
        return state;
    })
    .on(eventsForDataMaker.makeSubCategory, (state, data) => {
        const parent = findById(state, data.parentId);

        if (!parent.subCategory) {
            parent.subCategory = [];
        }

        const foundParent = parent.subCategory.find(item => item.id === data.elId);

        if (!foundParent) {
            parent.subCategory.push({
                id: data.elId,
                name: data.item.name,
                img: data.item.img,
            });
        } else {
            state = findAnd.replaceObject(
                state,
                { id: data.elId },
                {
                    id: data.elId,
                    name: data.item.name,
                    img: data.item.img,
                },
            );
        }
        console.log("state :", state);
        return state;
    })
    .on(eventsForDataMaker.deleteCategory, (state, data) => {
        state = findAnd.removeObject(state, { id: data.id });
        const find = findById(state, data.parentId);
        if (find?.subCategory.length === 0) {
            find.subCategory = undefined;
        }
        console.log("eventsForDataMaker.deleteCategory :", state);
        return state;
    })
    .on(eventsForDataMaker.makeProduct, (state, data) => {
        const foundProduct = findById(state, data.id);
        const parentItem = findById(state, data.parentId);

        // То меняем его отдельные свойства
        const newProductData = { id: data.id };
        // Если товара не существует и у него нет родителя
        if (!foundProduct && !parentItem) {
            state.push(newProductData);
        }
        // Если родитель есть
        else if (parentItem) {
            // Если у него нету поля продуктов
            if (!parentItem.productsInCategory) {
                parentItem.productsInCategory = [];
                parentItem.productsInCategory.push(newProductData);
            } else {
                parentItem.productsInCategory.push(newProductData);
            }
        }
        console.log("eventsForDataMaker.makeProduct :", state);
        return state;
    })
    .on(eventsForDataMaker.updateProduct, (state, data) => {
        // То меняем его отдельные свойства
        const newProductData = { id: data.id };

        newProductData.name = data.item.name;
        newProductData.img = data.item.img;
        newProductData.price = data.item.price;
        newProductData.active = data.item.active ? data.item.active : true;
        newProductData.desc = data.item.desc ? data.item.desc : undefined;
        newProductData.options = data.item.options ? data.item.options : undefined;

        state = findAnd.replaceObject(state, { id: data.id }, newProductData);

        console.log("eventsForDataMaker.updateProduct :", state);
        return state;
    })
    .on(eventsForDataMaker.deleteProduct, (state, data) => {
        // const find = findByName(state, data.id)
        state = findAnd.removeObject(state, { id: data.id });
        console.log("eventsForDataMaker.deleteProduct :", state);
        return state;
    })
    .on(eventsForDataMaker.makeDesc, (state, data) => {
        const find = findById(state, data.id);
        if (!find.desc) {
            find.desc = data.desc;
        }
        console.log("eventsForDataMaker.makeDesc :", state);
    })
    .on(eventsForDataMaker.deleteDesc, (state, data) => {
        state = findAnd.changeProps(state, { id: data.id, desc: data.desc }, { id: data.id, desc: undefined });
        console.log("eventsForDataMaker.deleteDesc :", state);
        return state;
    })
    .on(eventsForDataMaker.makeOptions, (state, data) => {
        const find = findById(state, data.id);
        if (!find.options) {
            find.options = { nameOptionList: undefined, optionList: undefined };
        } else if (data.options) {
            find.options = {
                nameOptionList: data.options.nameOptionList,
                optionList: data.options.optionList,
            };
        }
        console.log("eventsForDataMaker.makeOptions :", state);
    })
    .on(eventsForDataMaker.deleteOptions, (state, data) => {
        const find = findById(state, data.id);
        find.options = undefined;
        console.log("eventsForDataMaker.deleteOptions :", state);
    })
    .on(eventsForDataMaker.deleteOption, (state, data) => {
        let find = findById(state, data.id);
        // const optionIndex = find.options.optionList[data]
        const newOptionList = find.options.optionList.filter((item, index) => {
            return index !== data.index;
        });
        find.options.optionList = newOptionList;
        console.log("eventsForDataMaker.deleteOptions :", state);
    });

export let findItem = null;
// ! Костыль. С map и sample не получилось создать производный стор..
eventsForDataMaker.searchItem.watch(data => {
    findItem = findById($productList.getState(), data.id);
});

// Попытка с map. .on() работает не так как ожидается
// export const findItem = $productList
//   .map(state => state === [] ? undefined : state)
//   .on(eventsForDataMaker.searchItem, (state, data) => findByName(state, data.id))

// export let $productList
// export let searchList
// export let productPage

// awaitProducts.done.watch(({ result }) => {
//   $productList = createStore(result)
// })
