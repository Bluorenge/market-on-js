import AbstractComponent from '../utils/abstarct-component'

const formTemplate = `<form action="#" method="post" class="data-maker__wrap"></form>`

export default class FormComponent extends AbstractComponent {
  getTemplate() {
    return formTemplate
  }
}
