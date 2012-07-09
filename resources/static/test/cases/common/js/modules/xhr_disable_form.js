/*jshint browser: true, forin: true, laxbreak: true */
/*global test: true, start: true, stop: true, module: true, ok: true, equal: true, BrowserID:true */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
(function() {
  "use strict";

  var bid = BrowserID,
      Module = bid.Modules.XHRDisableForm,
      testHelpers = bid.TestHelpers,
      mediator = bid.Mediator,
      mod;

  function createModule(options) {
    mod = Module.create({});
    mod.start(options);
    return mod;
  }

  module("shared/modules/xhr_disable_form", {
    setup: function() {
      testHelpers.setup();
      createModule();
    },

    teardown: function() {
      testHelpers.teardown();
    }
  });

  asyncTest("xhr_start adds 'submit_disabled' to class, xhr_complete removes it", function() {
    var body = $("body");

    mediator.publish("xhr_start");
    equal(body.hasClass("submit_disabled"), true, "xhr_start adds submit_disabled");

    // submit_disabled is removed after a small delay so that if consecutive
    // XHR requests happen, there is no button flicker. See issue #1898
    // - https://github.com/mozilla/browserid/issues/1898
    mediator.subscribe("submit_enabled", function() {
      equal(body.hasClass("submit_disabled"), false, "xhr_complete removes submit_disabled");
      start();
    });
    mediator.publish("xhr_complete");
  });
}());
