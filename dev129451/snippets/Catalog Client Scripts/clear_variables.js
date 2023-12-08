/**
  @name clearVariables
  @description Clear/reset all fields on a form
  @param  {string[]} ignoreVaribles - Variables to not clear
  @example
  clearVariables(['variable1', 'variable2']);
*/
function clearVariables(ignoreVaribles, isPortal) {
  var clearableVariables = isPortal
    ? g_form.getEditableFields()
    : g_form.nameMap;
  var variableName = "";
  clearableVariables.forEach(function (clearableVars) {
    if (typeof clearableVars === "object") {
      variableName = clearableVars.prettyName;
    } else {
      variableName = clearableVars;
    }
    if (ignoreVaribles.indexOf(variableName) === -1) {
      g_form.clearValue(variableName);
    }
  });
}
