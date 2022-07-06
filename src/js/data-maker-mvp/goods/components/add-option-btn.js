import AbstractComponent from "../../utils/abstarct-component";
import elementReady from "element-ready";

const addOptionsBtn = `<div class="data-maker__add data-maker__add--option-wrap" tabindex="0">
  <span>+ Добавить товару опцию</span>
</div>`;

export default class AddOptionsBtnComponent extends AbstractComponent {
    getTemplate() {
        return addOptionsBtn;
    }

    setAddOptionsHandler(handler) {
        (async () => {
            const el = await elementReady("." + this.getElement().classList[1]);

            el.addEventListener(`click`, handler);
        })();
    }
}
