/**
 * @typedef {Object} GlideAjaxProps
 * @property {string} name - The name property.
 * @property {Array<{ name: string, value: string }>} params - An array of parameters.
 */

/**
 * Function to perform an asynchronous GlideAjax request.
 * @param {GlideAjaxProps} ajaxProps - An object containing the necessary data for the GlideAjax request.
 * @returns {Promise} A Promise that resolves with the response from the GlideAjax request.
 * @example
 * callAjaxRequestGlobal({
 *  name: "myScriptIncludeName",
 *  params: [
 *    { name: "sysparm_name", value: "myFunctionName" },
 *    { name: "sysparm_param1", value: "myParam1Value" }
 * ],
 * })
 * .then(function (response) {
 *  console.log(response);
 * })
 * .catch(function (error) {
 *  console.log(error);
 * });
 */
function callAjaxRequestGlobal(ajaxProps) {
  return new Promise(function (resolve, reject) {
    try {
      // Validate ajaxProps
      if (!ajaxProps || _isObjectEmpty(ajaxProps)) {
        throw new Error("Paramater is required. Expected an non-empty object");
      }
      if (typeof ajaxProps !== "object") {
        throw new Error("Invalid parameter. Expected an object.");
      }
      // Validate ajaxProps.name
      if (!ajaxProps.name || typeof ajaxProps.name !== "string") {
        throw new Error(
          "Invalid Script Include name. Expected a non-empty string."
        );
      }
      // Validate ajaxProps.params
      if (!ajaxProps.params || !Array.isArray(ajaxProps.params)) {
        throw new Error(
          "Invalid parameter of Script Include. Expected an array."
        );
      }
      // Instantiate a new GlideAjax object
      var callGARequest = new GlideAjax(ajaxProps.name);
      // Add parameters from ajaxProps.params array
      ajaxProps.params.forEach(function (param) {
        if (!param || typeof param !== "object" || _isObjectEmpty(param)) {
          throw new Error(
            "Invalid property. Each parameter should be an object with name and value properties."
          );
        }
        if (!param.name) {
          throw new Error(
            "Invalid property. Expect non-empty name of property"
          );
        }
        if (!param.value) {
          throw new Error(
            "Invalid property. Expect non-empty value of property"
          );
        }
        callGARequest.addParam(param.name, param.value);
      });
      // Make the GlideAjax request
      callGARequest.getXMLAnswer(function (response) {
        resolve(response);
      });
    } catch (error) {
      reject(
        error.message || "An error occurred during the GlideAjax request."
      );
    }
  });
}

function _isObjectEmpty(object) {
  var isEmpty = Object.keys(object).length === 0;
  return isEmpty;
}
