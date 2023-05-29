import { isEmpty } from "./utils";

// 枚举
const enumerable = (list: any[], value: any) => {

  if(isEmpty(value)) return true;

  const valArr = value || [];
  if (valArr.length !== new Set([...valArr, ...list]).size) return false;
  return true;
}

// 正则
const pattern = (reg: any, value: any) => {

  if(isEmpty(value)) return true;

  if (reg instanceof RegExp) {
    return reg.test(value)
  } else if (typeof reg === 'string') {
    const _reg = new RegExp(reg);
    return _reg.test(value)
  }
  return true;
}

// 必填
const required = (must: boolean, value: any) => {
  return must ? !isEmpty(value) : true;
}

// 长度
const len = (len: number, value: any, type: string) => {

  if(isEmpty(value)) return true;

  if(type === 'number') {
    return Number(value) === len
  } else {
    return String(value || '').length === len
  }
}

// 最大
const max = (max: number, value: any, type: string) => {

  if(isEmpty(value)) return true;

  if(type === 'number') {
    return Number(value) <= max
  } else {
    return String(value || '').length <= max
  }
}

// 最小
const min = (min: number, value: any, type: string) => {

  if(isEmpty(value)) return true;

  if(type === 'number') {
    return Number(value) >= min
  } else {
    return String(value || '').length >= min
  }
}

// 是否布尔值
const boolean = (must: boolean, value: any) => {

  if(isEmpty(value)) return true;
  
  return must === (typeof value === 'boolean');
};

// 自定义校验器
const validator = async (validator: any, value: any, rule: any) => {
  return await new Promise((resolve) => {
    try {
      validator(rule, value, (msg) => resolve(msg));
    } catch (error) {
      resolve(error);
    }
  })
}

export default {
  enum: enumerable,
  pattern,
  required,
  len,
  max,
  min,
  boolean,
  validator,
}