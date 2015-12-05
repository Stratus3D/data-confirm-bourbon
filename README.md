# Data-Confirm Modal

Uses [Bourbon Refill's modals](http://refills.bourbon.io/components/#modal)
in place of the browser's builtin `confirm()` API for links generated through Rails'
helpers with the `:confirm` option.

Any link with the `data-confirm` attribute will trigger a Bourbon Refill modal.

HTML in the modal supported, and also the ability to have the user input a
certain value, for extra willingness confirmation (inspired by GitHub's
"delete repository" function).

## Installation

Add this line to your application's Gemfile:

    gem 'data-confirm-bourbon', github: 'Stratus3D/data-confirm-bourbon'

Then execute:

    $ bundle

Then generate the modal Sass:

    rails generate refills:import modal

Then include it in `application.scss`:

    @import "refills/_modal";

Your `application.scss` file should look something like this we you are finished:

    @import "base/base";
    @import 'base/grid-settings';
    @import "neat";
    @import "refills/_modal";

If you have trouble getting all the imports correct refer to [this refills issue](https://github.com/thoughtbot/refills/issues/113).

And then require the JavaScript from your `application.js`:

    //= require data-confirm-bourbon

## Usage

### With Rails

By default, the Gem's Javascript overrides Rails' [data-confirm behaviour][]
for you, with no change required to your code. The modal is applicable to
`<a>`, `<button>` and `<input[submit]>`  elements by default.

Example:

    <%= link_to 'Delete', data: {confirm: 'Are you sure?'} %>

The modal's title will be get from the link's `title` attribute value. The
modal text will be taken from the `data-confirm` value. Multiple paragraphs
are created automatically from two newlines (`\n\n`).

The modal's 'confirm' button text can be customized using the `data-commit`
attribute.

    <%= link_to 'Delete', data: {confirm: 'Are you sure?', commit: 'Sure!'} %>

Add a `data-verify` attribute to your input if you want an extra confirmation
from the user. The modal will contain an extra text input, and the user will be
asked to type the verification value before being allowed to proceed.

    <%= link_to 'Delete', data: {confirm: 'Are you sure?', verify: 'Foo', verify_text: 'Type "Foo" to confirm'} %>

You can set global setting using `dataConfirmBourbonModal.setDefaults`, for example:

    dataConfirmBourbonModal.setDefaults({
      title: 'Confirm your action',
      commit: 'Continue',
      cancel: 'Cancel'
    });

To restore default settings use `dataConfirmBourbonModal.restoreDefaults()`.

[data-confirm-behaviour]: http://api.rubyonrails.org/classes/ActionView/Helpers/UrlHelper.html

### Without Rails, with data attributes

Given an element with `data-confirm` attributes in place, such as

    <a id="foo" href="#" data-confirm="Really do this?" data-commit="Do it" data-cancel="Not really"/>

you can then invoke `.confirmModal()` on it using:

    $('#foo').confirmModal();

that'll display the confirmation modal. If the user confirms, then the `#foo`
link will receive a `click` event.

### Without Rails, without data attributes

Use `dataConfirmBourbonModal.confirm()` passing any of the supported options, and pass
an `onConfirm` and `onCancel` callbacks that'll be invoked when the user clicks
the confirm or the cancel buttons.

    dataConfirmBourbonModal.confirm({
      title: 'Are you sure?',
      text: 'Really do this?',
      commit: 'Yes do it',
      cancel: 'Not really',
      zIindex: 10099,
      onConfirm: function() { alert('confirmed') },
      onCancel:  function() { alert('cancelled') }
    });

### Modal Options

The options [bootstrap modal options](http://getbootstrap.com/javascript/#modals-options)
can be passed either via JavaScript or through data attributes.

     $('#foo').confirmModal({backdrop: 'static', keyboard: false});

or

     <a href="#" data-confirm="Really?" data-backdrop="static" data-keyboard="false">

## Issues

* Can't be used without rails.
* Can't be called directly from JavaScript.

## Authors

* Trevor Brown ([@Stratus3D](http://github.com/Stratus3D))
* Marcello Barnaba ([@vjt](https://github.com/vjt))
* LLeir Borras Metje ([@lleirborras](https://github.com/lleirborras))
* The Open Source [World](https://github.com/ifad/data-confirm-modal/graphs/contributors)

## Background

Spinned off a corporate [IFAD](http://github.com/ifad/) application in which
an user did too much damage because the confirm wasn't *THAT* explicit ... ;-). [Initially built for bootstrap](https://github.com/ifad/data-confirm-modal) and then later converted to work with Bourbon Refills.

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Added some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request
