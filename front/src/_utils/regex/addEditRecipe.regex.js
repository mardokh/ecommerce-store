
// name //
export const NameMaxLength = /^.{1,100}$/
export const NameForbidden  = /^[^<>]*$/

// ingredients //
export const IngredientsMaxLength = /^.{1,800}$/
export const IngredientsForbidden = /^[^<>]*$/

// directions //
export const DirectionsMaxLength = /^.{1,800}$/
export const DirectionsForbidden = /^[^<>]*$/

// image //
export const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
export const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png']

