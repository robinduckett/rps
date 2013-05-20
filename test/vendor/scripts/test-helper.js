// Create `window.describe` etc. for our BDD-like tests.
mocha.setup({ui: 'tdd'});

// Create another global variable for simpler syntax.
window.assert = chai.assert;
