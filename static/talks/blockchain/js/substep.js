/* Minimal substep support for impress.js 0.5.3.
 *
 * Reveals .substep elements one at a time as you move forward, hides them
 * again when moving backward, and emits impress:substep-active /
 * impress:substep-inactive on window (as the original iimpress fork did).
 */
(function () {
  "use strict";

  function substeps(step) {
    return Array.prototype.slice.call(step.querySelectorAll(".substep"));
  }

  function countActive(step) {
    return substeps(step).filter(function (el) {
      return el.classList.contains("active");
    }).length;
  }

  function render(step, count) {
    substeps(step).forEach(function (el, i) {
      var shown = i < count;
      el.classList.toggle("active", shown);
      el.classList.toggle("future", !shown);
      el.classList.toggle("present", shown && i === count - 1);
    });
  }

  document.addEventListener("impress:init", function (event) {
    var api = event.detail.api;
    var next = api.next;
    var prev = api.prev;

    Array.prototype.forEach.call(document.querySelectorAll(".step"), function (step) {
      render(step, 0);
    });

    api.next = function () {
      var step = document.querySelector(".step.active");
      if (step) {
        var items = substeps(step);
        var shown = countActive(step);
        if (shown < items.length) {
          render(step, shown + 1);
          window.dispatchEvent(new CustomEvent("impress:substep-active", {
            detail: { step: step, substep: items[shown] }
          }));
          return items[shown];
        }
      }
      return next();
    };

    api.prev = function () {
      var step = document.querySelector(".step.active");
      if (step) {
        var items = substeps(step);
        var shown = countActive(step);
        if (shown > 0) {
          var leaving = items[shown - 1];
          render(step, shown - 1);
          window.dispatchEvent(new CustomEvent("impress:substep-inactive", {
            detail: { step: step, substep: leaving }
          }));
          return leaving;
        }
      }
      return prev();
    };

    document.addEventListener("impress:stepenter", function (e) {
      render(e.target, 0);
    });
  });
})();
