export const RenderPosition: { AFTERBEGIN: string; BEFOREEND: string } = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
}

export const createElement = (template: string): HTMLElement => {
  const newElement: HTMLDivElement = document.createElement(`div`)
  newElement.innerHTML = template
  return newElement.firstChild as HTMLElement
}

interface ComponentClass {
  getElement(): HTMLElement
  removeElement(): void
}

export const render = (
  container: HTMLElement,
  component: ComponentClass,
  place: string
): void => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(component.getElement())
      break
    case RenderPosition.BEFOREEND:
      container.append(component.getElement())
      break
  }
}

export const replace = (
  newComponent: ComponentClass,
  oldComponent: ComponentClass
): void => {
  const parentElement = oldComponent.getElement().parentElement
  const newElement = newComponent.getElement()
  const oldElement = oldComponent.getElement()

  const isExistElements = Boolean(parentElement && newElement && oldElement)

  if (isExistElements && parentElement.contains(oldElement)) {
    parentElement.replaceChild(newElement, oldElement)
  }
}

export const remove = (component: ComponentClass): void => {
  component.getElement().remove()
  component.removeElement()
}
