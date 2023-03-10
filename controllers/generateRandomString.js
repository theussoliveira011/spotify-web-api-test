/**
 * Generate a random string containing numbers and letter
 * @param {number} length The length of string
 * @return {string} The generated string
*/

const generateRandomString = function(length){
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';


  for(let i = 0; i < length; i++){
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  };

  return text;
};

module.exports = generateRandomString;