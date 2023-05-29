const newMessages = {
  default: 'validate error on field %s',
  required: '%s is required',
  boolean: '%s is not a boolean',
  enum: '%s must be one of %s',
  string: {
    len: '%s must be exactly %s characters',
    min: '%s must be at least %s characters',
    max: '%s cannot be longer than %s characters',
  },
  number: {
    len: '%s must equal %s',
    min: '%s cannot be less than %s',
    max: '%s cannot be greater than %s',
  },
  array: {
    len: '%s must be exactly %s in length',
    min: '%s cannot be less than %s in length',
    max: '%s cannot be greater than %s in length',
  }
};

export default newMessages;
