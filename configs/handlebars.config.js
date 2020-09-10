

module.exports = {
  ifEquals: function ( value1, value2, options ) {
    return value1 === value2 ? options.fn(this) : "";
  }
}



// Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
//   return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
// });