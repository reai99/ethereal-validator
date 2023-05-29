import newMessages from "./message";


export const pick = (obj: any, selector: any[]) => {
  const result = {};
  selector.forEach(key => {
    if (obj.hasOwnProperty(key)) result[key] = obj[key]
  });
  return result;
}

export const isEmpty = (value: any) => {
  return (
    value === undefined || 
    value === null || 
    (Array.isArray(value) && !value.length) || 
    (typeof value === 'string' && !value)
  )
}

export const parseValidator = (type: string, ruleMap: any) => {
  switch (type) {
    case 'string': return pick(ruleMap, ['len', 'max', 'min', 'pattern', 'required']);    
    case 'number': return pick(ruleMap, ['len', 'max', 'min', 'pattern', 'required']);  
    case 'array': return pick(ruleMap, ['len', 'max', 'min', 'required', 'enum']);  
    case 'boolean': return pick(ruleMap, ['required', 'boolean']); 
    default:
      return {};
  }
}

export const validateErrorTip = (errors: any[]) => {
  errors.forEach(error => {
    const { target } = error;
    const { key, type, value } = target;
    const matchMsg = (newMessages[type] && newMessages[type][key]) || newMessages[key] || newMessages.default;
    const errorMsg = matchMsg.replace('%s', value);
    console.log('[validate-error]:',errorMsg)

  })
}