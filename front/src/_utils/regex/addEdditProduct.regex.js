
// name //
export const NameMaxLength = /^.{1,100}$/
export const NameForbidden  = /^[^<>]*$/

// details //
export const DetailsMaxLength = /^.{1,500}$/
export const DetailsForbidden = /^[^<>]*$/

// Price //
export const PriceForbidden = /^(?!0(\.0+)?$)(\d+(\.\d+)?|\.\d+)$/

// image //
export const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
export const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png']

