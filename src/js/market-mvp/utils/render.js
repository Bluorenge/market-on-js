export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
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
  }
}

// Замена старого элемента на новый
export const replace = (newComponent, oldComponent) => {
  // Старый Родитель дом-элемент КОМПОНЕНТА (представления)
  const parentElement = oldComponent.getElement().parentElement
  // Новый дом-элемент КОМПОНЕНТА (представления)
  const newElement = newComponent.getElement()
  // Старый дом-элемент КОМПОНЕНТА (представления)
  const oldElement = oldComponent.getElement()

  // Это существующий элемент?
  const isExistElements = !!(parentElement && newElement && oldElement)

  // Если существующий и Родитель содержит старый элемент
  if (isExistElements && parentElement.contains(oldElement)) {
    // Заменяет дочерний элемент - старый, на выбранный - новый
    parentElement.replaceChild(newElement, oldElement)
  }
}

// Удаление КОМПОНЕНТА (представления)
export const remove = (component) => {
  // Удаляем КОМПОНЕНТ (представления), т.е. сам дом-элемент
  component.getElement().remove()
  // Обнуляем элемент в Классе КОМПОНЕНТА (представления)
  component.removeElement()
}
