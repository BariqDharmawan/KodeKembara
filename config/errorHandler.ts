export const getCodeError = (errorAPI: PromiseRejectedResult) => {
  return errorAPI.reason.code === 'E_ROW_NOT_FOUND' ? 404 : 500
}

export const getMsgError = (errorAPI: PromiseRejectedResult) => {
  return errorAPI.reason.code === 'E_ROW_NOT_FOUND' ? errorAPI.reason.message : errorAPI.reason
}
