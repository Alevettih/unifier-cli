const helper = require('./helpers');
const validator = require('./validators');
const projects = require('../project-types');

module.exports = [{
  name: 'title',
  type: 'input',
  message: 'Project name:',
  default: helper.getCWD(),
  validate: validator.title
}, {
  name: 'description',
  type: 'input',
  message: 'Project description:',
  default: ''
}, {
  name: 'type',
  type: 'list',
  message: 'Project type:',
  choices: [
    {name: 'Plain JS', value: 'plain-js'},
    {name: 'Angular', value: projects.types.ANGULAR},
    {name: 'React', value: 'react'},
    {name: 'Vue', value: 'vue'}
  ]
}];
