export interface Validator {
  validationFunction: (value: any) => boolean;
  errorMessage: string
}


export const validatorRequired = {
  validationFunction: (value: any) => {
    return value !== undefined && value !== null && value !== '';
  },
  errorMessage: 'Field is required'
}

export const validatorPositive = {
  validationFunction: (value: any) => {
    return value > 0;
  },
  errorMessage: 'Number must be positive'
}

export const validatorEmail = {
  validationFunction: (email: string) => {
    // Regular expression for validating an email address
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  },
  errorMessage: 'Email format is not valid'
};
