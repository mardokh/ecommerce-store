
// LastName FirstName //
export const lastFirstMaxLength = /^.{1,50}$/; // max lenght
export const lastFirstFormatAccept = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/; // only lettres and space
export const lastFirstForbidden =  /^[^<>]*$/; // xss secure

// Email //
export const emailMaxLength = /^.{1,50}$/; 
export const emailFormatAccept = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ // email format

// Password //
export const passwordMaxLength = /^.{8,20}$/;
export const passwordDigit = /(?=.*\d)/;
export const passwordUppercase = /(?=.*[A-Z])/;
export const passwordLowercase = /(?=.*[a-z])/;
export const passwordForbidden = /^[A-Za-z0-9!@#$%^&*()_+={}\[\]:;"',.?/\\|-]*$/;