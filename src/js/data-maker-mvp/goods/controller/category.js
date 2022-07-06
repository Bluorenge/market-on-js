import { RenderPosition, render, remove } from "../../utils/render";

import CategoryComponent from "../components/category";
import { $idContent, $isFormValidate, $productList, findItem, $currentId } from "../../models/model";
import { eventsForDataMaker } from "../../models/eventsForDataMaker";
import ProductController from "./product";
import CategoryEntryStateComponent from "../components/category-entry-state";
import SubCategoryTabsComponent from "../components/tabs";
import TabContentController from "./tab-content";
import SubCategoryController from "./sub-category";

export default class CategoryController {
    constructor(container) {
        this.container = container;

        this._id = Number(this.container.getElement().id.replace(/[^+\d]/g, ``));
        this._categoryComponent = null;
        this._subCategories = [];
        // this._entryState = null
        this._tabContent = null;
    }

    render() {
        eventsForDataMaker.searchItem({ id: this._id });

        // if (findItem) {
        this._categoryComponent = new CategoryComponent(`категории`, this._id, findItem);
        render(this.container.getElement(), this._categoryComponent, RenderPosition.BEFOREEND);

        this._categoryComponent.setRemoveCategoryBtnHandler(() => {
            eventsForDataMaker.changeView({ type: `setting`, id: 0 });
            eventsForDataMaker.deleteMenuItem(this._id);
            eventsForDataMaker.deleteCategory({ id: this._id });
        });
        this._categoryComponent.setAddCategoryHandler(() => {
            this._getData();
            eventsForDataMaker.validateFrom();

            if ($isFormValidate.getState()) {
                this._tabContent = new TabContentController(this._categoryComponent);
                this._tabContent.render();
                // const subCategory = new SubCategoryController()
                eventsForDataMaker.changeViewTab(`category`);
                // this._subCategories = this._subCategories.concat(subCategory)
                this._categoryComponent.hideBtn(`product`);
            }
        });
        this._categoryComponent.setAddProductHandler(() => {
            this._getData();
            eventsForDataMaker.validateFrom();

            if ($isFormValidate.getState()) {
                eventsForDataMaker.idContentIncrease();
                const product = new ProductController(this._categoryComponent, $idContent.getState());
                product.render();
                this._categoryComponent.hideBtn(`category`);
            }
        });
        this._categoryComponent.setInputsHandler(() => this._getData());
        // } else {
        //   this._entryState = new CategoryEntryStateComponent()
        //   render(this.container.getElement(), this._entryState, RenderPosition.BEFOREEND)
        //   this._entryState.setAddProductBtnHandler(() => )
        // }

        // Если у элемента есть подкатегории
        if (findItem?.subCategory) {
            this._renderSubCategory(this._categoryComponent, findItem);
        }
    }

    remove() {
        remove(this._categoryComponent);
    }

    isValidity() {
        if (!this._categoryComponent.getElement().checkValidity()) {
            eventsForDataMaker.toggleValidate(false);
            this._categoryComponent.clickBtn();
        } else if (!$isFormValidate.getState()) {
            eventsForDataMaker.toggleValidate(true);
        }

        return this._categoryComponent.getElement().checkValidity();
    }

    _getData() {
        const categoryData = this._categoryComponent.getData();
        eventsForDataMaker.makeCategory({ id: this._id, item: categoryData });

        eventsForDataMaker.changeMenuItemName({ id: this._id, name: categoryData.name });
    }

    _renderSubCategory(parentLevel, data) {
        if (data && "subCategory" in data) {
            if (this._id !== data.id) {
                const sub = new CategoryComponent(`подкатегории`, data.id, data);
                render(parentLevel.getElement(), sub, RenderPosition.BEFOREEND);
                data.subCategory.forEach(item => {
                    this._renderSubCategory(sub, item);
                });
            } else {
                data.subCategory.forEach(item => {
                    this._renderSubCategory(parentLevel, item);
                });
            }
        } else if (data) {
            const sub = new CategoryComponent(`подкатегории`, data.id, data);
            render(parentLevel.getElement(), sub, RenderPosition.BEFOREEND);
            this._setHandlersOnCategory(sub);
        } else {
            const sub = new CategoryComponent(`подкатегории`, $idContent.getState(), data);
            eventsForDataMaker.idContentIncrease();
            render(parentLevel.getElement(), sub, RenderPosition.BEFOREEND);
            this._setHandlersOnCategory(sub);
        }
    }

    _setHandlersOnCategory(subCategory) {
        const parentId = Number(subCategory.getElement().parentNode.id.replace(/[^+\d]/g, ``));
        // Создаём подкатегории в данных магазина
        const makeCategory = () => {
            return eventsForDataMaker.makeSubCategory({
                parentId,
                elId: subCategory.getIndex(),
                item: subCategory.getData(),
            });
        };
        makeCategory();
        this._subCategories.push(subCategory);

        subCategory.setInputsHandler(() => makeCategory());
        subCategory.setAddCategoryHandler(() => {
            eventsForDataMaker.validateFrom();

            if ($isFormValidate.getState()) {
                this._renderSubCategory(subCategory);
            }
        });
        subCategory.setRemoveCategoryBtnHandler(() => {
            eventsForDataMaker.deleteCategory({ id: subCategory.getIndex(), parentId });
            remove(subCategory);
        });
    }
}
