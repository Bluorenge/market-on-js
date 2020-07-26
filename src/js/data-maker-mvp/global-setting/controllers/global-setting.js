import { RenderPosition, render, remove } from '../../utils/render'
import GlobalSettingComponent from '../components/global-setting'
import { eventsForDataMaker } from '../../models/eventsForDataMaker'
import { $settingOfMarket, $isFormValidate } from '../../models/model'
import * as findAnd from 'find-and'

export default class GlobalSettingController {
  constructor(container) {
    this.container = container
    this._globalSetting = null
  }

  render() {
    this._globalSetting = new GlobalSettingComponent($settingOfMarket.getState())
    render(this.container.getElement(), this._globalSetting, RenderPosition.BEFOREEND)
  }

  remove() {
    remove(this._globalSetting)
  }

  isValidity() {
    if (!this._globalSetting.getElement().checkValidity()) {
      eventsForDataMaker.toggleValidate(false)
      this._globalSetting.clickBtn()
    } else {
      eventsForDataMaker.updateSetting(this._globalSetting.getData())

      if (!$isFormValidate.getState()) {
        eventsForDataMaker.toggleValidate(true)
      }
    }

    return this._globalSetting.getElement().checkValidity()
  }
}
