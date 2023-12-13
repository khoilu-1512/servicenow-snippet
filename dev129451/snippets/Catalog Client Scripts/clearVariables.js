/**
  @name clearVariables
  @description Clear/reset all fields on a form
  @param  {string[]} ignoreVaribles - Variables to not clear
  @param  {boolean} isPortal - True if the form is in Service Portal, false otherwise
  @example
  clearVariables(['variable1', 'variable2']);
*/
function clearVariables(ignoreVaribles, isPortal) {
  // Get all the variables on the form
  var clearableVariables = isPortal
    ? g_form.getEditableFields()
    : g_form.nameMap;
  // Clear the variables
  var variableName = "";
  clearableVariables.forEach(function (clearableVars) {
    // If the variable is in ITIL view, get the pretty name
    if (typeof clearableVars === "object") {
      variableName = clearableVars.prettyName;
    } else {
      variableName = clearableVars;
    }
    // If the variable is not in the ignore list, clear it
    if (ignoreVaribles.indexOf(variableName) === -1) {
      g_form.clearValue(variableName);
    }
  });
}
