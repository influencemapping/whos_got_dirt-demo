jQuery(function($) {
  function operator(field) {
    if (field_operators[field].length > 1) {
      return '<select class="form-control" name="operator[]">' +
        $.map(field_operators[field], function(operator) {
          return '<option value="' + operator + '">' + operators[operator] + '</option>';
        }).join('') +
      '</select>';
    }
    else {
      return '<input name="operator[]" type="hidden"><div>' + operators[field_operators[field][0]] + '</div>';
    }
  }

  function value(field) {
    attributes = ' class="form-control" name="value[]"';
    switch (field_types[field]) {
    case 'integer':
      return '<input' + attributes + ' type="number" min="0" step="1">';
    case 'boolean':
      return '<select' + attributes + '>' +
        '<option value="false">False</option>' +
        '<option value="true">True</option>' +
      + '</select>';
    default:
      if (field_valid_values[field]) {
        return '<select' + attributes + '>' +
          $.map(field_valid_values[field], function(row) {
            return '<option value="' + row[0] + '">' + row[1] + '</option>';
          }).join('') +
        + '</select>';
      }
      // @todo https://eternicode.github.io/bootstrap-datepicker/
      // else if (field_formats[field]) {
      //   return '';
      // }
      else {
        return '<input' + attributes + ' type="text">';
      }
    }
  }

  function addField() {
    $('#filters').append(
      '<div class="row">' +
        '<div class="form-group">' +
          '<div class="col-sm-2">' +
            '<select class="form-control field" name="field[]">' +
              $.map(fields, function(label, field) {
                return '<option value="' + field + '">' + label + '</option>';
              }).join('') +
            '</select>' +
          '</div>' +
          '<div class="col-sm-2 operator">' +
            operator('name') +
          '</div>' +
          '<div class="col-sm-7 value">' +
            value('name') +
          '</div>' +
          '<div class="col-sm-1">' +
            (function () {
              if ($('#filters .row').length) {
                return '<button type="button" class="btn btn-default remove" aria-label="Remove Filter">' +
                  '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>' +
                '</button>';
              }
              else {
                return '';
              }
            })() +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  function render(data) {
    // Annabel
    console.log(data);
  }

  $(document).on('change', '.field', function () {
    var field = $(this).val();
    $(this).parents('.row').find('.operator').html(operator(field));
    $(this).parents('.row').find('.value').html(value(field));
  });
  $(document).on('click', '.remove', function () {
    $(this).parents('.row').remove();
  });
  $('#add').click(function () {
    addField();
  });

  $('#form').submit(function (event) {
    var controls = $(this).serializeArray();
    var query = {};
    for (var i = 0, l = controls.length; i < l; i += 3) {

    }
    event.preventDefault();
    // @todo
    // $.getJSON('http://whosgotdirt.herokuapp.com/people?queries={%22q0%22:{%22query%22:{%22type%22:%22Person%22,%22name%22:%22John%22}}}', function (data) {
    //   render(data);
    // });
  });

  addField();
});

var fields = {
  'name': 'Name',
  'birth_date': 'Birth date',
  'role': 'Role',
  'address': 'Address',
  'inactive': 'Inactive',
  'jurisdiction_code': 'Jurisdiction'
};

var operators = {
  '=': 'is exactly',
  '~=': 'is like',
  '<': 'is less than',
  '<=': 'is less than or equal to',
  '>=': 'is greater than or equal to',
  '>': 'is greater than',
  '|=': 'is one of'
}

var field_operators = {
  'name': ['~='],
  'birth_date': ['=', '<', '<=', '>=', '>'],
  'role': ['='],
  'address': ['~='],
  'inactive': ['='],
  'jurisdiction_code': ['=', '|=']
};

var field_types = {
  'limit': 'integer',
  'inactive': 'boolean'
};

var field_formats = {
  'birth_date': 'date'
};

var field_valid_values = {
  'jurisdiction_code': [
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
