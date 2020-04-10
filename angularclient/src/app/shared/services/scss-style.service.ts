import { AppUtil } from './../util/app-util';
import { Injectable } from '@angular/core';
const scssVariables = require('./../../exported-sass-variables.json');

@Injectable({
  providedIn: 'root'
})
export class ScssStyleService {
  public getVariableData(variableName: string): string {
    if (!AppUtil.hasValue(scssVariables)) {
      throw new Error('There was a problem while exporting the scss variables to a JSON file');
    }

    for (const variableObj of scssVariables) {
      if (variableObj.name === variableName) {
        return variableObj.value;
      }
    }
    return null;
  }
}
