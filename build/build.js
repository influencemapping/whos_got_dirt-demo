/**
 * Require the module at `name`.
 *
 * @param {String} name
 * @return {Object} exports
 * @api public
 */

function require(name) {
  var module = require.modules[name];
  if (!module) throw new Error('failed to require "' + name + '"');

  if (!('exports' in module) && typeof module.definition === 'function') {
    module.client = module.component = true;
    module.definition.call(this, module.exports = {}, module);
    delete module.definition;
  }

  return module.exports;
}

/**
 * Meta info, accessible in the global scope unless you use AMD option.
 */

require.loader = 'component';

/**
 * Internal helper object, contains a sorting function for semantiv versioning
 */
require.helper = {};
require.helper.semVerSort = function(a, b) {
  var aArray = a.version.split('.');
  var bArray = b.version.split('.');
  for (var i=0; i<aArray.length; ++i) {
    var aInt = parseInt(aArray[i], 10);
    var bInt = parseInt(bArray[i], 10);
    if (aInt === bInt) {
      var aLex = aArray[i].substr((""+aInt).length);
      var bLex = bArray[i].substr((""+bInt).length);
      if (aLex === '' && bLex !== '') return 1;
      if (aLex !== '' && bLex === '') return -1;
      if (aLex !== '' && bLex !== '') return aLex > bLex ? 1 : -1;
      continue;
    } else if (aInt > bInt) {
      return 1;
    } else {
      return -1;
    }
  }
  return 0;
}

/**
 * Find and require a module which name starts with the provided name.
 * If multiple modules exists, the highest semver is used. 
 * This function can only be used for remote dependencies.

 * @param {String} name - module name: `user~repo`
 * @param {Boolean} returnPath - returns the canonical require path if true, 
 *                               otherwise it returns the epxorted module
 */
require.latest = function (name, returnPath) {
  function showError(name) {
    throw new Error('failed to find latest module of "' + name + '"');
  }
  // only remotes with semvers, ignore local files conataining a '/'
  var versionRegexp = /(.*)~(.*)@v?(\d+\.\d+\.\d+[^\/]*)$/;
  var remoteRegexp = /(.*)~(.*)/;
  if (!remoteRegexp.test(name)) showError(name);
  var moduleNames = Object.keys(require.modules);
  var semVerCandidates = [];
  var otherCandidates = []; // for instance: name of the git branch
  for (var i=0; i<moduleNames.length; i++) {
    var moduleName = moduleNames[i];
    if (new RegExp(name + '@').test(moduleName)) {
        var version = moduleName.substr(name.length+1);
        var semVerMatch = versionRegexp.exec(moduleName);
        if (semVerMatch != null) {
          semVerCandidates.push({version: version, name: moduleName});
        } else {
          otherCandidates.push({version: version, name: moduleName});
        } 
    }
  }
  if (semVerCandidates.concat(otherCandidates).length === 0) {
    showError(name);
  }
  if (semVerCandidates.length > 0) {
    var module = semVerCandidates.sort(require.helper.semVerSort).pop().name;
    if (returnPath === true) {
      return module;
    }
    return require(module);
  }
  // if the build contains more than one branch of the same module
  // you should not use this funciton
  var module = otherCandidates.sort(function(a, b) {return a.name > b.name})[0].name;
  if (returnPath === true) {
    return module;
  }
  return require(module);
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Register module at `name` with callback `definition`.
 *
 * @param {String} name
 * @param {Function} definition
 * @api private
 */

require.register = function (name, definition) {
  require.modules[name] = {
    definition: definition
  };
};

/**
 * Define a module's exports immediately with `exports`.
 *
 * @param {String} name
 * @param {Generic} exports
 * @api private
 */

require.define = function (name, exports) {
  require.modules[name] = {
    exports: exports
  };
};
require.register("manuelstofer~foreach@2.0.4", function (exports, module) {

var hasOwn = Object.prototype.hasOwnProperty;
var toString = Object.prototype.toString;

module.exports = function forEach (obj, fn, ctx) {
    if (toString.call(fn) !== '[object Function]') {
        throw new TypeError('iterator must be a function');
    }
    var l = obj.length;
    if (l === +l) {
        for (var i = 0; i < l; i++) {
            fn.call(ctx, obj[i], i, obj);
        }
    } else {
        for (var k in obj) {
            if (hasOwn.call(obj, k)) {
                fn.call(ctx, obj[k], k, obj);
            }
        }
    }
};


});

require.register("manuelstofer~json-pointer@0.2.2", function (exports, module) {
'use strict';

var each = require('manuelstofer~foreach@2.0.4');
module.exports = api;


/**
 * Convenience wrapper around the api.
 * Calls `.get` when called with an `object` and a `pointer`.
 * Calls `.set` when also called with `value`.
 * If only supplied `object`, returns a partially applied function, mapped to the object.
 *
 * @param obj
 * @param pointer
 * @param value
 * @returns {*}
 */

function api (obj, pointer, value) {
    // .set()
    if (arguments.length === 3) {
        return api.set(obj, pointer, value);
    }
    // .get()
    if (arguments.length === 2) {
        return api.get(obj, pointer);
    }
    // Return a partially applied function on `obj`.
    var wrapped = api.bind(api, obj);

    // Support for oo style
    for (var name in api) {
        if (api.hasOwnProperty(name)) {
            wrapped[name] = api[name].bind(wrapped, obj);
        }
    }
    return wrapped;
}


/**
 * Lookup a json pointer in an object
 *
 * @param obj
 * @param pointer
 * @returns {*}
 */
api.get = function get (obj, pointer) {
    var tok,
        refTokens = api.parse(pointer);
    while (refTokens.length) {
        tok = refTokens.shift();
        if (!obj.hasOwnProperty(tok)) {
            throw new Error('Invalid reference token: ' + tok);
        }
        obj = obj[tok];
    }
    return obj;
};

/**
 * Sets a value on an object
 *
 * @param obj
 * @param pointer
 * @param value
 */
api.set = function set (obj, pointer, value) {
    var refTokens = api.parse(pointer),
        tok,
        nextTok = refTokens[0];
    while (refTokens.length > 1) {
        tok = refTokens.shift();
        nextTok = refTokens[0];

        if (!obj.hasOwnProperty(tok)) {
            if (nextTok.match(/^\d+$/)) {
                obj[tok] = [];
            } else {
                obj[tok] = {};
            }
        }
        obj = obj[tok];
    }
    obj[nextTok] = value;
    return this;
};

/**
 * Removes an attribute
 *
 * @param obj
 * @param pointer
 */
api.remove = function (obj, pointer) {
    var refTokens = api.parse(pointer);
    var finalToken = refTokens.pop();
    if (finalToken === undefined) {
        throw new Error('Invalid JSON pointer for remove: "' + pointer + '"');
    }
    delete api.get(obj, api.compile(refTokens))[finalToken];
};

/**
 * Returns a (pointer -> value) dictionary for an object
 *
 * @param obj
 * @param {function} descend
 * @returns {}
 */
api.dict = function dict (obj, descend) {
    var results = {};
    api.walk(obj, function (value, pointer) {
        results[pointer] = value;
    }, descend);
    return results;
};

/**
 * Iterates over an object
 * Iterator: function (value, pointer) {}
 *
 * @param obj
 * @param {function} iterator
 * @param {function} descend
 */
api.walk = function walk (obj, iterator, descend) {
    var refTokens = [];

    descend = descend || function (value) {
        var type = Object.prototype.toString.call(value);
        return type === '[object Object]' || type === '[object Array]';
    };

    (function next (cur) {
        each(cur, function (value, key) {
            refTokens.push(String(key));
            if (descend(value)) {
                next(value);
            } else {
                iterator(value, api.compile(refTokens));
            }
            refTokens.pop();
        });
    }(obj));
};

/**
 * Tests if an object has a value for a json pointer
 *
 * @param obj
 * @param pointer
 * @returns {boolean}
 */
api.has = function has (obj, pointer) {
    try {
        api.get(obj, pointer);
    } catch (e) {
        return false;
    }
    return true;
};

/**
 * Escapes a reference token
 *
 * @param str
 * @returns {string}
 */
api.escape = function escape (str) {
    return str.toString().replace(/~/g, '~0').replace(/\//g, '~1');
};

/**
 * Unescapes a reference token
 *
 * @param str
 * @returns {string}
 */
api.unescape = function unescape (str) {
    return str.replace(/~1/g, '/').replace(/~0/g, '~');
};

/**
 * Converts a json pointer into a array of reference tokens
 *
 * @param pointer
 * @returns {Array}
 */
api.parse = function parse (pointer) {
    if (pointer === '') { return []; }
    if (pointer.charAt(0) !== '/') { throw new Error('Invalid JSON pointer: ' + pointer); }
    return pointer.substring(1).split(/\//).map(api.unescape);
};

/**
 * Builds a json pointer from a array of reference tokens
 *
 * @param refTokens
 * @returns {string}
 */
api.compile = function compile (refTokens) {
    if (refTokens.length === 0) { return ''; }
    return '/' + refTokens.map(api.escape).join('/');
};

});

require.register("whos_got_dirt-demo", function (exports, module) {
jQuery(function ($) {
  // Returns the HTML for selecting a field's operator.
  //
  // @param {string} field The field's name.
  // @return {string} The HTML for selecting a field's operator.
  function operatorTemplate(field) {
    // Multiple operators.
    if (field_operators[field].length > 1) {
      return '<select class="form-control" name="operator[]">' +
        $.map(field_operators[field], function (operator) {
          return '<option value="' + operator + '">' + operators[operator] + '</option>';
        }).join('') +
      '</select>';
    }
    // Single operator.
    else {
      return '<input name="operator[]" type="hidden" value="' + field_operators[field][0] + '">' +
        '<div>' + operators[field_operators[field][0]] + '</div>';
    }
  }

  // Returns the HTML for entering a field's value.
  //
  // @param {string} field The field's name.
  // @param {string} [operator] The field's operator.
  // @param {string} [value] The field's value.
  // @return {string} The HTML for entering a field's value.
  function valueTemplate(field, operator, value) {
    var attributes = value ? ' value="' + value + '"' : '';

    switch (field_types[field]) {
    case 'integer':
      return '<input class="form-control" name="value[]" type="number" min="0" step="1"' + attributes + '>';

    case 'boolean':
      return '<select class="form-control" name="value[]">' +
        '<option value="false">False</option>' +
        '<option value="true">True</option>' +
      '</select>';

    default:
      // Code list.
      if (field_valid_values[field] && operator !== '|=') {
        return '<select class="form-control" name="value[]">' +
          $.map(field_valid_values[field], function (row) {
            return '<option value="' + row[0] + '">' + row[1] + '</option>';
          }).join('') +
        '</select>';
      }
      // Date picker.
      else if (field_formats[field]) {
        return '<input class="form-control date" name="value[]" type="text"' + attributes + '>';
      }
      // Default.
      else {
        return '<input class="form-control" name="value[]" type="text"' + attributes + '>';
      }
    }
  }

  // Appends a new filter.
  function addField() {
    $('#filters').append(
      '<div class="row">' +
        '<div class="form-group">' +
          '<div class="col-sm-2">' +
            '<select class="form-control field" name="field[]">' +
              $.map(fields, function (label, field) {
                return '<option value="' + field + '">' + label + '</option>';
              }).join('') +
            '</select>' +
          '</div>' +
          '<div class="col-sm-2 operator">' +
            operatorTemplate('name') +
          '</div>' +
          '<div class="col-sm-7 value">' +
            valueTemplate('name') +
          '</div>' +
          '<div class="col-sm-1">' +
            ($('#filters .row').length ?
              '<button type="button" class="btn btn-default remove" aria-label="Remove Filter">' +
                '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>' +
              '</button>' : '') +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  // Renders the JSON response.
  //
  // @param {Object} data The JSON response.
  function render(data) {
    var result = data['q0']['result'];

    var results = $.map(result, function (result, i) {
      return '<tr class="'+ result['@type'] + '">' +
        '<td>' +
          result.name +
        '</td>' +
        '<td>' +
          (result.country_code || '') +
        '</td>' +
        '<td>' +
          (result.classification || '') +
        '</td>' +
        '<td>' +
          (result.founding_date || '') +
        '</td>' +
        '<td>' +
          (address(result.contact_details) || '') +
        '</td>' +
        '<td>' +
          (link(result.links) || '') +
        '</td>' +
        '<td>' +
          '<button type="button" class="btn" data-toggle="modal"data-target="#result-' + i + '">JSON</button>' +
        '</td>' +
      '</tr>';
    }).join('');

    var modals = $.map(result, function (result, i) {
      return '<div class="modal fade" tabindex="-1" role="dialog" id="result-' + i + '">' +
        '<div class="modal-dialog modal-lg" role="document">' +
          '<div class="modal-content">' +
            '<pre>' +
              JSON.stringify(result, null, '  ') +
            '</pre>' +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');

    $('#number').html(data['q0']['result'].length);
    $('#count').html(data['q0']['count']);
    $('#results').show();
    $('#results tbody').html(results);
    $('#modals').html(modals);
  }

  // Returns the address value in the contact details.
  //
  // @param {Array} contact_details The contact details.
  // @return {string} The address value.
  function address(contact_details) {
    if (contact_details) {
      for (var i = 0, l = contact_details.length; i < l; i++) {
        if (contact_details[i].type == 'address') {
          return contact_details[i].value;
        }
      }
    }
  }

  // Returns a link to the last URL in the links.
  //
  // @param {Array} links The links.
  // @return {string} A link to the last URL.
  function link(links) {
    if (links) {
      var url = links[links.length - 1].url;
      return '<a href="' + url + '">' + url.match(/:\/\/([^/]+)/)[1] + '</a>';
    }
  }

  // Renders messages.
  //
  // @param {Array} messages Messages.
  function render_messages(messages) {
    if (messages.length) {
      for (var i = 0, l = messages.length; i < l; i++) {
        render_message(messages[i]);
      }
    }
  }

  // Renders a message.
  //
  // @param {Object} message A message.
  function render_message(message) {
    $('#messages').append(
      '<div class="alert alert-warning">' +
        (message.info ?
          '<p>' +
            'An error occurred when requesting <code>' + message.info.url + '</code>:' +
          '</p>' : '') +
        '<p>' +
          message.message +
          (message.status ?
            ' (' + message.status + ')' : '') +
        '</p>' +
      '</div>'
    );
  }

  // Add event handlers.
  $('[data-toggle="tooltip"]').tooltip();

  $(document).on('change', '.field', function () {
    var field = $(this).val();
    var $row = $(this).parents('.row');
    var $value = $(this).parents('.row').find('.value');
    var value = $value.find('input, select').val();

    $row.find('.operator').html(operatorTemplate(field));
    $value.html(valueTemplate(field, field_operators[field][0], value));
    $row.find('.date').datepicker();
  });

  $(document).on('change', '.operator select', function () {
    var operator = $(this).val();
    var field = $(this).parents('.row').find('.field').val();
    var $value = $(this).parents('.row').find('.value');
    var value = $value.find('input, select').val();

    $value.html(valueTemplate(field, operator, value));
    if (operator === '|=') {
      $value.append('<span class="help-block">The "is one of" operator accepts a pipe-separated list: for example, <kbd>gb|ie</kbd>.</span>');
    }
  });

  $(document).on('click', '.remove', function () {
    $(this).parents('.row').remove();
  });

  $('#add').click(function () {
    addField();
  });

  $('#form').submit(function (event) {
    var controls = $(this).serializeArray();
    var query = {type: 'Person'};
    var membership = {};

    $('#loading').css('visibility', 'visible').html('<img src="build/ajax-loader.gif" width="16" height="16" alt="">');
    $('.alert-warning').remove();

    // Build the query.
    for (var i = 0, l = controls.length; i < l; i += 3) {
      if (controls[i].name == 'endpoints') {
        break;
      }

      var field = controls[i].value;
      var operator = controls[i + 1].value;
      var value = controls[i + 2].value;
      var field_with_operator = field;

      if (operator !== '=') {
        field_with_operator += operator;
      }

      if (field_types[field] === 'boolean') {
        value = value === 'false' ? false : true;
      }

      // @todo Special casing nested fields will get long and complicated. This
      // should be replaced with a universal solution using some configuration.
      switch (field) {
      case 'address':
        query.contact_details = [{
          'type': 'address',
          'value~=': value
        }];
        break;
      case 'inactive':
      case 'role':
        membership[field_with_operator] = value;
        break;
      default:
        query[field_with_operator] = value;
      }
    }

    if (!$.isEmptyObject(membership)) {
      query.memberships = [membership];
    }

    // Collect endpoints.
    var endpoints = [];
    $('input[name="endpoints"]:checked').each(function () {
      endpoints.push($(this).val());
    });

    // Send the request.
    var json = JSON.stringify({
      q0: {
        query: query,
        endpoints: endpoints
      }
    });

    $.ajax({
      dataType: 'json',
      url: 'https://whosgotdirt.herokuapp.com/entities',
      data: {queries: json},
      success: function (data) {
        $('#loading').css('visibility', 'hidden');
        render_messages(data['q0']['messages']);
        render(data);
      },
      error: function (xhr, textStatus, errorThrown) {
        $('#loading').css('visibility', 'hidden');
        var status = xhr.status + ' ' + errorThrown.replace(/ $/, '');
        if (xhr.responseJSON) {
          var messages = xhr.responseJSON['messages'];
          for (var i = 0, l = messages.length; i < l; i++) {
            messages[i].message += ' (' + status + ')';
          }
          render_messages(messages);
        }
        else if (xhr.status) {
          render_message({message: status});
        }
        else {
          render_message({message: 'An unknown error occurred.'});
        }
      }
    });

    event.preventDefault();
  });

  // Setup the page.
  $('#results').hide();
  addField();
});

var operators = {
  '=': 'is exactly',
  '~=': 'is like',
  '<': 'is less than',
  '<=': 'is less than or equal to',
  '>=': 'is greater than or equal to',
  '>': 'is greater than',
  '|=': 'is one of'
}

var fields = {
  'name': 'Name',
  'country_code': 'Country',
  'classification': 'Classification',
  'founding_date': 'Founding date',
  'address': 'Address',
  'limit': 'Number of results per API'
};

var field_operators = {
  'name': ['~='],
  'country_code': ['=', '|='],
  'classification': ['=', '|='],
  'founding_date': ['=', '>=', '>', '<', '<='],
  'address': ['~='],
  'limit': ['=']
};

var field_types = {
  'limit': 'integer'
};

var field_formats = {
  'founding_date': 'date'
};

var field_valid_values = {
  'country_code': [
    ["af", "Afghanistan"],
    ["ax", "ÅLand Islands"],
    ["al", "Albania"],
    ["dz", "Algeria"],
    ["as", "American Samoa"],
    ["ad", "Andorra"],
    ["ao", "Angola"],
    ["ai", "Anguilla"],
    ["aq", "Antarctica"],
    ["ag", "Antigua and Barbuda"],
    ["ar", "Argentina"],
    ["am", "Armenia"],
    ["aw", "Aruba"],
    ["au", "Australia"],
    ["at", "Austria"],
    ["az", "Azerbaijan"],
    ["bs", "Bahamas"],
    ["bh", "Bahrain"],
    ["bd", "Bangladesh"],
    ["bb", "Barbados"],
    ["by", "Belarus"],
    ["be", "Belgium"],
    ["bz", "Belize"],
    ["bj", "Benin"],
    ["bm", "Bermuda"],
    ["bt", "Bhutan"],
    ["bo", "Bolivia, Plurinational State of"],
    ["bq", "Bonaire, Sint Eustatius and Saba"],
    ["ba", "Bosnia and Herzegovina"],
    ["bw", "Botswana"],
    ["bv", "Bouvet Island"],
    ["br", "Brazil"],
    ["io", "British Indian Ocean Territory"],
    ["bn", "Brunei Darussalam"],
    ["bg", "Bulgaria"],
    ["bf", "Burkina Faso"],
    ["bi", "Burundi"],
    ["kh", "Cambodia"],
    ["cm", "Cameroon"],
    ["ca", "Canada"],
    ["cv", "Cape Verde"],
    ["ky", "Cayman Islands"],
    ["cf", "Central African Republic"],
    ["td", "Chad"],
    ["cl", "Chile"],
    ["cn", "China"],
    ["cx", "Christmas Island"],
    ["cc", "Cocos (Keeling) Islands"],
    ["co", "Colombia"],
    ["km", "Comoros"],
    ["cg", "Congo"],
    ["cd", "Congo, The Democratic Republic of the"],
    ["ck", "Cook Islands"],
    ["cr", "Costa Rica"],
    ["ci", "Côte D'ivoire"],
    ["hr", "Croatia"],
    ["cu", "Cuba"],
    ["cw", "Curaçao"],
    ["cy", "Cyprus"],
    ["cz", "Czech Republic"],
    ["dk", "Denmark"],
    ["dj", "Djibouti"],
    ["dm", "Dominica"],
    ["do", "Dominican Republic"],
    ["ec", "Ecuador"],
    ["eg", "Egypt"],
    ["sv", "El Salvador"],
    ["gq", "Equatorial Guinea"],
    ["er", "Eritrea"],
    ["ee", "Estonia"],
    ["et", "Ethiopia"],
    ["fk", "Falkland Islands (Malvinas)"],
    ["fo", "Faroe Islands"],
    ["fj", "Fiji"],
    ["fi", "Finland"],
    ["fr", "France"],
    ["gf", "French Guiana"],
    ["pf", "French Polynesia"],
    ["tf", "French Southern Territories"],
    ["ga", "Gabon"],
    ["gm", "Gambia"],
    ["ge", "Georgia"],
    ["de", "Germany"],
    ["gh", "Ghana"],
    ["gi", "Gibraltar"],
    ["gr", "Greece"],
    ["gl", "Greenland"],
    ["gd", "Grenada"],
    ["gp", "Guadeloupe"],
    ["gu", "Guam"],
    ["gt", "Guatemala"],
    ["gg", "Guernsey"],
    ["gn", "Guinea"],
    ["gw", "Guinea-Bissau"],
    ["gy", "Guyana"],
    ["ht", "Haiti"],
    ["hm", "Heard Island and Mcdonald Islands"],
    ["va", "Holy See (Vatican City State)"],
    ["hn", "Honduras"],
    ["hk", "Hong Kong"],
    ["hu", "Hungary"],
    ["is", "Iceland"],
    ["in", "India"],
    ["id", "Indonesia"],
    ["ir", "Iran, Islamic Republic of"],
    ["iq", "Iraq"],
    ["ie", "Ireland"],
    ["im", "Isle of Man"],
    ["il", "Israel"],
    ["it", "Italy"],
    ["jm", "Jamaica"],
    ["jp", "Japan"],
    ["je", "Jersey"],
    ["jo", "Jordan"],
    ["kz", "Kazakhstan"],
    ["ke", "Kenya"],
    ["ki", "Kiribati"],
    ["kp", "Korea, Democratic People's Republic of"],
    ["kr", "Korea, Republic of"],
    ["kw", "Kuwait"],
    ["kg", "Kyrgyzstan"],
    ["la", "Lao People's Democratic Republic"],
    ["lv", "Latvia"],
    ["lb", "Lebanon"],
    ["ls", "Lesotho"],
    ["lr", "Liberia"],
    ["ly", "Libya"],
    ["li", "Liechtenstein"],
    ["lt", "Lithuania"],
    ["lu", "Luxembourg"],
    ["mo", "Macao"],
    ["mk", "Macedonia, The Former Yugoslav Republic of"],
    ["mg", "Madagascar"],
    ["mw", "Malawi"],
    ["my", "Malaysia"],
    ["mv", "Maldives"],
    ["ml", "Mali"],
    ["mt", "Malta"],
    ["mh", "Marshall Islands"],
    ["mq", "Martinique"],
    ["mr", "Mauritania"],
    ["mu", "Mauritius"],
    ["yt", "Mayotte"],
    ["mx", "Mexico"],
    ["fm", "Micronesia, Federated States of"],
    ["md", "Moldova, Republic of"],
    ["mc", "Monaco"],
    ["mn", "Mongolia"],
    ["me", "Montenegro"],
    ["ms", "Montserrat"],
    ["ma", "Morocco"],
    ["mz", "Mozambique"],
    ["mm", "Myanmar"],
    ["na", "Namibia"],
    ["nr", "Nauru"],
    ["np", "Nepal"],
    ["nl", "Netherlands"],
    ["nc", "New Caledonia"],
    ["nz", "New Zealand"],
    ["ni", "Nicaragua"],
    ["ne", "Niger"],
    ["ng", "Nigeria"],
    ["nu", "Niue"],
    ["nf", "Norfolk Island"],
    ["mp", "Northern Mariana Islands"],
    ["no", "Norway"],
    ["om", "Oman"],
    ["pk", "Pakistan"],
    ["pw", "Palau"],
    ["ps", "Palestine, State of"],
    ["pa", "Panama"],
    ["pg", "Papua New Guinea"],
    ["py", "Paraguay"],
    ["pe", "Peru"],
    ["ph", "Philippines"],
    ["pn", "Pitcairn"],
    ["pl", "Poland"],
    ["pt", "Portugal"],
    ["pr", "Puerto Rico"],
    ["qa", "Qatar"],
    ["re", "Réunion"],
    ["ro", "Romania"],
    ["ru", "Russian Federation"],
    ["rw", "Rwanda"],
    ["bl", "Saint Barthélemy"],
    ["sh", "Saint Helena, Ascension and Tristan da Cunha"],
    ["kn", "Saint Kitts and Nevis"],
    ["lc", "Saint Lucia"],
    ["mf", "Saint Martin (French part)"],
    ["pm", "Saint Pierre and Miquelon"],
    ["vc", "Saint Vincent and the Grenadines"],
    ["ws", "Samoa"],
    ["sm", "San Marino"],
    ["st", "Sao Tome and Principe"],
    ["sa", "Saudi Arabia"],
    ["sn", "Senegal"],
    ["rs", "Serbia"],
    ["sc", "Seychelles"],
    ["sl", "Sierra Leone"],
    ["sg", "Singapore"],
    ["sx", "Sint Maarten (Dutch part)"],
    ["sk", "Slovakia"],
    ["si", "Slovenia"],
    ["sb", "Solomon Islands"],
    ["so", "Somalia"],
    ["za", "South Africa"],
    ["gs", "South Georgia and the South Sandwich Islands"],
    ["ss", "South Sudan"],
    ["es", "Spain"],
    ["lk", "Sri Lanka"],
    ["sd", "Sudan"],
    ["sr", "Suriname"],
    ["sj", "Svalbard and Jan Mayen"],
    ["sz", "Swaziland"],
    ["se", "Sweden"],
    ["ch", "Switzerland"],
    ["sy", "Syrian Arab Republic"],
    ["tw", "Taiwan, Province of China"],
    ["tj", "Tajikistan"],
    ["tz", "Tanzania, United Republic of"],
    ["th", "Thailand"],
    ["tl", "Timor-Leste"],
    ["tg", "Togo"],
    ["tk", "Tokelau"],
    ["to", "Tonga"],
    ["tt", "Trinidad and Tobago"],
    ["tn", "Tunisia"],
    ["tr", "Turkey"],
    ["tm", "Turkmenistan"],
    ["tc", "Turks and Caicos Islands"],
    ["tv", "Tuvalu"],
    ["ug", "Uganda"],
    ["ua", "Ukraine"],
    ["ae", "United Arab Emirates"],
    ["gb", "United Kingdom"],
    ["us", "United States"],
    ["um", "United States Minor Outlying Islands"],
    ["uy", "Uruguay"],
    ["uz", "Uzbekistan"],
    ["vu", "Vanuatu"],
    ["ve", "Venezuela, Bolivarian Republic of"],
    ["vn", "Viet Nam"],
    ["vg", "Virgin Islands, British"],
    ["vi", "Virgin Islands, U.S."],
    ["wf", "Wallis and Futuna"],
    ["eh", "Western Sahara"],
    ["ye", "Yemen"],
    ["zm", "Zambia"],
    ["zw", "Zimbabwe"]
  ]
};

});

require("whos_got_dirt-demo");
