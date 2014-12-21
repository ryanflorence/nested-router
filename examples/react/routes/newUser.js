var React = require('react');
var api = require('../utils/api');
var getFormValues = require('../utils/getFormValues');
var location = require('../utils/location');

exports.name = 'newUser';

var handleSubmit = (event) => {
  event.preventDefault();
  var form = event.target;
  var fields = getFormValues(form);
  api.post('/contacts', { contact: fields }).then((res) => {
    form.reset();
    location.push(`/user/${res.contact.id}`);
  });
};

exports.validate = (ref) => {
  var fields = getFormValues(
    ref.getDOMNode().querySelector('form')
  );

  var unsaved = Object.keys(fields).reduce((unsaved, field) => {
    return unsaved || fields[field] !== '';
  }, false);

  return !unsaved || confirm('You have unsaved information, continue?');
};

exports.render = () => {
  return (
    <div>
      <h2>New User</h2>
      <form onSubmit={handleSubmit}>
        <p>
          <input type="text" name="first" placeholder="first name"/>
          <input type="text" name="last" placeholder="last name"/><br/>
          <input type="text" name="avatar" placeholder="avatar"/>
        </p>
        <p>
          <button type="submit">Save</button>
        </p>
      </form>
    </div>
  );
};


