import * as types from "./mutation-types";

export function showErrorNotification(error, commit) {
  // Set default error message
  let errorMsg = "Something went wrong.";
  if (typeof error === "string") {
    errorMsg = error;
  } else {
    if (error.response && error.response.data) {
      errorMsg = `${error.response.data.message}`;
    }
  }
  commit(types.SHOW_NOTIFICATION, {
    msg: errorMsg,
    type: "error"
  });
  throw error;
}

export function apiCallWrapper(commit, showSpinner, apiFun) {
  if (showSpinner) commit(types.IS_LOADING, true);
  return apiFun()
    .then(result => {
      if (showSpinner) commit(types.IS_LOADING, false);
      return Promise.resolve(result);
    })
    .catch(error => {
      if (showSpinner) commit(types.IS_LOADING, false);
      showErrorNotification(error, commit);
    });
}

export function loadIntoSlot(commit, slotType, showSpinner, apiFun) {
  return apiCallWrapper(commit, showSpinner, apiFun).then(result => {
    commit(slotType, result);
    return Promise.resolve(result);
  });
}

export default { showErrorNotification, apiCallWrapper, loadIntoSlot };
