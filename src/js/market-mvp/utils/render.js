export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
  BEFOREBEGIN: `beforebegin`
}

// Создаём элемент
export const createElement = (template) => {
  // Создаём див-обёртку
  const newElement = document.createElement(`div`)
  // Заполняем её переданным как параметр шаблоном
  newElement.innerHTML = template

  // newElement возвращает либо пустой див, либо со всеме элементами внутри
  // Как я понял, newElement.firstChild здесь для того, чтобы не учитывать обёртку
  // И это понадобилось для того, чтобы возвращать сам элемент, а не html-код
  return newElement.firstChild
}

export const render = (container, component, place) => {
  // В зависимости от места вставки, вставляем дом элемент КОМПОНЕНТА (представления) в контейнер (родительский блок)
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(component.getElement())
      break
    case RenderPosition.BEFOREEND:
      container.append(component.getElement())
      break
    case RenderPosition.BEFOREBEGIN:
      container.before(component.getElement())
      break
  }
}

// Удаление КОМПОНЕНТА (представления)
export const remove = (component) => {
  // Удаляем КОМПОНЕНТ (представления), т.е. сам дом-элемент
  component.getElement().remove()
  // Обнуляем элемент в Классе КОМПОНЕНТА (представления)
  component.removeElement()
}
