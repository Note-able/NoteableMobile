export const createAsyncActionTypes = type => ({
  processing: `PROCESSING.${type}`,
  error: `ERROR.${type}`,
  success: `SUCCESS.${type}`,
});
