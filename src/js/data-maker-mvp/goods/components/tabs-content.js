import AbstractComponent from "../../utils/abstarct-component";

const generateListBtn = `<div class="data-maker__tab-wrap"></div>`;

export default class TabContentWrapComponent extends AbstractComponent {
    getTemplate() {
        return generateListBtn;
    }
}
