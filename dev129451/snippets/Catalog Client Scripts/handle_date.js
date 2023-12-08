/**
 * @name getDateFromFormat
 * @param {string} value - Date value
 * @param {string} format - Date format
 * @returns {number} - Date in miliseconds
 * @description A built-in function in Service Portal to convert a date value to miliseconds
 * @example
 * getDateFromFormat("29-10-2021", "dd-MM-yyyy");
 */

// g_user_date_format is a global variable in Service Portal store user date format
// g_user_date_time_format is a global variable in Service Portal store user date and time format
var date = getDateFromFormat(newValue, g_user_date_format);

/**
 * @name isDate
 * @param {string} value - Date value
 * @param {string} format - Date format
 * @returns {boolean} - True if date is valid, false otherwise
 * @description A built-in function in Service Portal to check if a date value is valid with given format
 * @example
 * isDate("29-10-2021", "dd-MM-yyyy");
 */
var isValidDate = isDate(value, format);

/**
 * @name compareDates
 * @param {string} firstDate - First date value
 * @param {string} firstDateFormat - First date format
 * @param {string} secondDate - Second date value
 * @param {string} secondDateFormat - Second date format
 * @returns {number} - 1 if firstDate is larger, -1 if either firstDate or secondDate is invalid, 0 if secondDate is larger
 * @description A built-in function in Service Portal to compare two date values
 * @example
 * compareDates("29-10-2021", "dd-MM-yyyy", "20-10-2021", "dd-MM-yyyy");
 */
var isSecondDateLarger = compareDates(
  "29-10-2021",
  "dd-MM-yyyy",
  "20-10-2021",
  "dd-MM-yyyy"
);

/**
 * @name formatDate
 * @param {Date} date - instance of JavaScript Date object
 * @param {string} format - Date format
 * @returns {string} - Formatted date
 * @description A built-in function in Service Portal to convert a Date object to a string with given format
 * @example
 * var date = new Date();
 * formateDate(date, "dd-MM-yyyy");
 */
var formattedDate = formatDate(date, format);
