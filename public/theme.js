// Runs before paint so a stored preference never flashes the wrong theme.
// External rather than inline because the CSP does not allow inline scripts.
(function () {
  var KEY = 'theme';
  var ORDER = ['system', 'light', 'dark'];

  function stored() {
    try {
      return localStorage.getItem(KEY);
    } catch (e) {
      return null;
    }
  }

  function apply(value) {
    if (value === 'light' || value === 'dark') {
      document.documentElement.setAttribute('data-theme', value);
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  apply(stored());

  function ready() {
    var button = document.querySelector('[data-theme-toggle]');
    if (!button) return;

    function current() {
      var value = stored();
      return value === 'light' || value === 'dark' ? value : 'system';
    }

    function render() {
      var value = current();
      button.setAttribute('data-state', value);
      button.setAttribute(
        'aria-label',
        'Theme: ' + (value === 'system' ? 'auto, following your system' : value) + '. Change it.',
      );
      button.setAttribute('title', 'Theme: ' + (value === 'system' ? 'auto' : value));
    }

    button.hidden = false;
    render();

    button.addEventListener('click', function () {
      var next = ORDER[(ORDER.indexOf(current()) + 1) % ORDER.length];
      try {
        if (next === 'system') localStorage.removeItem(KEY);
        else localStorage.setItem(KEY, next);
      } catch (e) {
        /* private mode; the choice just will not persist */
      }
      apply(next === 'system' ? null : next);
      render();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
  } else {
    ready();
  }
})();
