/*
 * Implements a user-facing modal confirmation when link has a
 * "data-confirm" attribute using Bourbon Refill's modal component. MIT license.
 *
 */
(function ($) {

  /**
   * Builds the markup for a [Bourbon Refill modal](http://refills.bourbon.io/components/#modal)
   * for the given `element`. Uses the following `data-` parameters to
   * customize it:
   *
   *  * `data-confirm`: Contains the modal body text. HTML is allowed.
   *                    Separate multiple paragraphs using \n\n.
   *  * `data-commit`:  The 'confirm' button text. "Confirm" by default.
   *  * `data-cancel`:  The 'cancel' button text. "Cancel" by default.
   *  * `data-verify`:  Adds a text input in which the user has to input
   *                    the text in this attribute value for the 'confirm'
   *                    button to be clickable. Optional.
   *  * `data-verify-text`:  Adds a label for the data-verify input. Optional
   *  * `data-focus`:   Define focused input. Supported values are
   *                    'cancel' or 'commit', 'cancel' is default for
   *                    data-method DELETE, 'commit' for all others.
   *
   * You can set global setting using `dataConfirmBourbonModal.setDefaults`, for example:
   *
   *    dataConfirmBourbonModal.setDefaults({
   *      title: 'Confirm your action',
   *      commit: 'Continue',
   *      cancel: 'Cancel',
   *      fade:   false,
   *      verifyClass: 'form-control',
   *    });
   *
   */

  var defaults = {
    title: 'Are you sure?',
    commit: 'Confirm',
    commitClass: 'btn-danger',
    cancel: 'Cancel',
    cancelClass: 'btn-default',
    fade: true,
    verifyClass: 'form-control',
    elements: ['a[data-confirm]', 'button[data-confirm]', 'input[type=submit][data-confirm]'],
    focus: 'cancel',
    zIndex: 1050,
    modalClass: false,
    show: true
  };

  var settings = $.extend({}, defaults);

  var buildModal = function (options) {
    var id = 'confirm-modal-' + String(Math.random()).slice(2, -1);
    //var fade = settings.fade ? 'fade' : '';
    var modalClass = settings.modalClass || '';
    var element = options.element;

    var modal = $('<div class="modal">' +
                  '<input class="modal-state" id="' + id + '" type="checkbox" />' +
                  '<div class="modal-fade-screen">' +
                  '<div class="modal-inner ' + modalClass + '">' +
                  '<label class="modal-close" for="' + id + '"></label>' +
                  '<h1 class="modal-title">Modal Title</h1>' +
                  '<div class="modal-content"></div>' +
                  '<div class="modal-footer">' +
                  '<button class="cancel" data-dismiss="modal"></button>' +
                  '<button class="commit"></button>' +
                  '</div>'+
                  '</div>' +
                  '</div>' +
                  '</div>'
                  );

    $('body').append(modal);
    element.data('confirm-modal-id', id);

    var modalState = modal.find('.modal-state');

    modal.isVisible = function() {
        return modalState.is(':checked');
    };

    modal.find('.modal-title').text(options.title || settings.title);

    var body = modal.find('.modal-content');

    $.each((options.text||'').split(/\n{2}/), function (i, piece) {
      body.append($('<p/>').html(piece));
    });

    var commit = modal.find('.commit');
    commit.text(options.commit || settings.commit);
    commit.addClass(options.commitClass || settings.commitClass);

    var cancel = modal.find('.cancel');
    cancel.text(options.cancel || settings.cancel);
    cancel.addClass(options.cancelClass || settings.cancelClass);

    //if (options.remote) {
    //  commit.attr('data-dismiss', 'modal');
    //}

    if (options.verify || options.verifyRegexp) {
      commit.prop('disabled', true);

      var isMatch;
      if (options.verifyRegexp) {
        var caseInsensitive = options.verifyRegexpCaseInsensitive;
        var regexp = options.verifyRegexp;
        var re = new RegExp(regexp, caseInsensitive ? 'i' : '');

        isMatch = function (input) { return input.match(re); };
      } else {
        isMatch = function (input) { return options.verify === input; };
      }

      var verification = $('<input/>', {"type": 'text', "class": settings.verifyClass}).on('keyup', function () {
        commit.prop('disabled', !isMatch($(this).val()));
      });

      modalState.on('change', function () {
          if (this.checked) {
              verification.focus();
          } else {
              verification.val('').trigger('keyup');
          }
      });

      if (options.verifyLabel) {
        body.append($('<p>', {text: options.verifyLabel}));
      }

      body.append(verification);
    }

    var focusElement;
    if (options.focus) {
      focusElement = options.focus;
    } else if (options.method === 'delete') {
      focusElement = 'cancel';
    } else {
      focusElement = settings.focus;
    }
    focusElement = modal.find('.' + focusElement);

    modal.data('confirmed', false);

    modal.hide = function() {
        //$(modalState).prop('checked', false);
        if (modalState.prop('checked')) {
            modalState.click();
        }
    };

    modal.show = function() {
        //modalState.prop('checked', true);
        if (!modalState.prop('checked')) {
            modalState.click();
        }
    };

    var stateChangeHandler = function () {
        if (modalState.is(':checked')) {
            $("body").addClass("modal-open");
            modal.trigger('shown');
            focusElement.focus();
        } else {
            $("body").removeClass("modal-open");
            modal.trigger('hidden');
        }
    };

    modalState.on('click', function () {
        stateChangeHandler();
    });

    modalState.on('change', function () {
        stateChangeHandler();
    });

    modal.find('.commit').on('click', function () {
        console.log('clicked the confirm button');

        //modal.data('confirmed', true);
        //console.log(element);
        //console.log(modal.data('confirmed'));
        //element.trigger('click');

        if (options.onConfirm && options.onConfirm.call) {
            options.onConfirm.call();
        }
    });

    modal.find('.cancel').on('click', function () {
        console.log('clicked the cancel button');

        if (options.onCancel && options.onCancel.call) {
            options.onCancel.call();
        }

        modal.hide();
    });

    return modal;
  };

  //window.dataConfirmBourbonModal = {
  //  setDefaults: function (newSettings) {
  //    settings = $.extend(settings, newSettings);
  //  },

  //  restoreDefaults: function () {
  //    settings = $.extend({}, defaults);
  //  },

  //  confirm: function (options) {
  //    // Build an ephemeral modal
  //    //
  //    var modal = buildModal(options);

  //    modal.show();

  //    modal.find('.commit').on('click', function () {
  //      if (options.onConfirm && options.onConfirm.call) {
  //        options.onConfirm.call();
  //      }

  //      modal.hide();
  //    });

  //    modal.find('.cancel').on('click', function () {
  //      if (options.onCancel && options.onCancel.call) {
  //        options.onCancel.call();
  //      }

  //      modal.hide();
  //    });
  //  }
  //};

  //dataConfirmBourbonModal.restoreDefaults();

  var buildElementModal = function (element) {
    var options = {
      element:      element,
      title:        element.attr('title') || element.data('original-title'),
      text:         element.data('confirm'),
      focus:        element.data('focus'),
      method:       element.data('method'),
      commit:       element.data('commit'),
      commitClass:  element.data('commit-class'),
      cancel:       element.data('cancel'),
      cancelClass:  element.data('cancel-class'),
      remote:       element.data('remote'),
      verify:       element.data('verify'),
      verifyRegexp: element.data('verify-regexp'),
      verifyLabel:  element.data('verify-text'),
      verifyRegexpCaseInsensitive: element.data('verify-regexp-caseinsensitive'),
      backdrop:     element.data('backdrop'),
      keyboard:     element.data('keyboard'),
      show:         element.data('show')
    };

    var modal = buildModal(options);

    modal.data('confirmed', false);                                             
    modal.find('.commit').on('click', function () {                             
        modal.data('confirmed', true);                                            
        element.trigger('click');                                                 
        modal.hide();                                                      
    });              

    return modal;
  };

  var getExistingModal = function (element) {
    var modalId = element.data('confirm-modal-id');
    if (modalId) {
        var modal = $($('#'+modalId).parent()[0]);
        console.log(modal);
        return modal;
    }

    return;
  };

  /**
   * Returns a modal already built for the given element or builds a new one,
   * caching it into the element's `confirm-modal` data attribute.
   */
  var getModal = function (element) {
    var modal = getExistingModal(element) || buildElementModal(element);

    return modal;
  };

  if ($.rails) {
    /**
     * Attaches to the Rails' UJS adapter 'confirm' event on links having a
     * `data-confirm` attribute. Temporarily overrides the `$.rails.confirm`
     * function with an anonymous one that returns the 'confirmed' status of
     * the modal.
     *
     * A modal is considered 'confirmed' when an user has successfully clicked
     * the 'confirm' button in it.
     */
    $(document).delegate(settings.elements.join(', '), 'confirm', function() {
      var element = $(this),
          modal = getModal(element),
          confirmed = modal.data('confirmed');

      console.log(modal);
      if (!confirmed) { //&& !modal.isVisible()) {
        modal.on('shown', function () { console.log('modal shown'); });

        modal.show();

        var confirm = $.rails.confirm;
        $.rails.confirm = function () { return modal.data('confirmed'); };
        modal.on('hidden', function () { console.log('modal hidden'); $.rails.confirm = confirm; });
      }
      return confirmed;
    });
  }

})(jQuery);
