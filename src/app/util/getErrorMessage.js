var errorMessages = require('./constants.js').errorMessages;

function getErrorMessage(code) {
    return errorMessages[code] || errorMessages.generic;
}

module.exports = getErrorMessage;