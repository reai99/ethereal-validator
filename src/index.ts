import { pick, isEmpty, parseValidator, validateErrorTip } from "./utils";
import ruleMap from './rule';

const SUPORT_RULE_TYPE = ['string', 'array', 'number', 'boolean'];

const ruleTypeValidator = SUPORT_RULE_TYPE.reduce((r, type) => {
  r[type] = parseValidator(type, ruleMap);
  return r;
}, {})

class Validator {
  private fieldRuleMap: any = {};
  private data = null;

  get validateFields() {
    return this.typeof(this.fieldRuleMap) === 'object' ? Object.keys(this.fieldRuleMap) : []
  }

  get validateData() {
    const type = this.typeof(this.data);
    return type === 'object' ? [this.data] : ( type === 'array' ? this.data : [])
  }

  private parseRuleList(rule: any, row: any) {
    return this.typeof(rule) === 'function' ? rule(row) : rule;
  }

  private getRuleListOfKey(key: string) {
    return this.typeof(this.fieldRuleMap) === 'object' ? this.fieldRuleMap[key] : [];
  }

  typeof(data: any): string {
    return Object.prototype.toString.call(data).slice(8, -1).toLowerCase();
  }

  addRule(field: string, rule: any) {
    this.fieldRuleMap[field] = rule;
  }

  removeRule(field: string, rule: any) {
    this.fieldRuleMap[field] = rule;
  }

  clearRule() {
    this.fieldRuleMap = {};
  }

  validateValueOfRuleList = async (val: any, rules: any[]) => {

    if (isEmpty(rules)) return false;

    const error = [];

    for (let i = 0, length = rules.length; i < length; i++) {
      const rule = rules[i] || {};
      const { type = 'string', message, transform, validator, ...args } = rules[i] || {};
      const value = this.typeof(transform) === 'function' ? transform(val) : val;
      const validateMap = pick(ruleTypeValidator[type] || {}, Object.keys(args));
      const result = Object.keys(validateMap).reduce((r, fn) => {
        return !validateMap[fn](args[fn], value, type) ? r.concat({ rule, message, target: { key: fn, type, value, params: args[fn] } }) : r;
      }, []);

      if (this.typeof(validator) === 'function') {
        const errMsg = await ruleMap.validator(validator, value, rule);
        if (errMsg) error.push({ rule, message: errMsg || rule.message, target: { key: 'validator', type, value } });
      }

      result.length && error.push(...result);
    }

    validateErrorTip(error);

    return error;
  }

  validate = async (data: any, rowIndex: number, isAllowValidateCallback: any) => {

    if (data) this.data = data;

    const dataLen = this.validateData.length;

    if (dataLen === 0) return false;

    const error = [];

    for (let i = 0; i < dataLen; i++) {
      const row = this.validateData[i];
      for (let key of this.validateFields) {
        const rules = this.parseRuleList(this.getRuleListOfKey(key), row);
        const value = row[key];

        if (this.typeof(isAllowValidateCallback) === 'function' && !isAllowValidateCallback(row, key, rules)) {
          continue;
        }

        const result = await this.validateValueOfRuleList(value, rules) || [];
        if (result.length) {
          error.push({
            error: result,
            value, key,
            index: rowIndex >= 0 ? rowIndex : i,
            row: this.validateData[i],
            message: result.map(v => v.message)
          })
        }
      }
    }
    return error.length > 0 ? error : false;
  }
}

const Scheme = new Validator()

export default {
  ruleTypeValidator,
  Validator,
  validateValue: Scheme.validateValueOfRuleList
};
