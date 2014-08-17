angular-swipe
=============

Simple vertical/horizontal swipe gesture directives and a swipe service for angular js >= 1.2. Small extension of the existing angular $swipe service.

## Install

Add this line to your *bower.json* dependencies

    "angular-swipe": "~0.0.6"

and run *bower install* afterwards.

## Usage

#### Directives

* ng-swipe-up
* ng-swipe-down
* ng-swipe-left
* ng-swipe-right

#### Service

* swipe

## Known issues and workarounds

* ng-swipe-up and ng-swipe-down uses preventDefault when you start swiping. This prevents clicks from giving focus to input fields. Adding a `noPreventDefault` class to these elements will not preventDefault when the swipe start on them and thus allow clicks to work.
