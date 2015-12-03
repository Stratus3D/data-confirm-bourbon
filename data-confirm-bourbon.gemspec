# -*- encoding: utf-8 -*-
require File.expand_path('../lib/data-confirm-bourbon/version', __FILE__)

Gem::Specification.new do |s|
  s.name        = "data-confirm-bourbon"
  s.version     = DataConfirmBourbon::VERSION
  s.platform    = Gem::Platform::RUBY
  s.authors     = ["Trevor Brown"]
  s.email       = ["admin@stratus3d.com"]
  s.homepage    = "http://github.com/Stratus3D/data-confirm-bourbon"
  s.summary     = "Use Bourbon Refill modals with Rails' UJS data-confirm"
  s.description = "This gem overrides Rails' UJS behaviour to open up a Bourbon Refill modal component instead of the browser's built in confirm() dialog"

  s.required_rubygems_version = ">= 1.3.6"

  s.add_dependency 'railties', '>= 3.0'

  s.files        = `git ls-files`.split("\n")
  s.require_path = 'lib'
end
