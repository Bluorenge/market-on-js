export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
  BEFOREBEGIN: `beforebegin`
}

export const createElement = (template) => {
  const newElement = document.createElement(`div`)
  newElement.innerHTML = template
  return newElement.firstChild
}

export const render = (container, component, place) => {
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

export const remove = (component) => {
  component.getElement().remove()
  component.removeElement()
}
