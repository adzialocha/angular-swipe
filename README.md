angular-swipe
=============

Simple vertical and horizontal swipe gesture directives and swipe service for angular js 1.2. Small extension of the angular $swipe service.

## Install

Add this line to your *bower.json* dependencies

    "angular-swipe":  "https://github.com/marmorkuchen-net/angular-swipe.git"
    
and run *bower install* afterwards.

## Usage

#### Directives

* ng-swipe-up
* ng-swipe-down
* ng-swipe-left
* ng-swipe-right

#### Service

* swipe

#### Bugs

* ng-swipe-up and ng-swipe-down uses preventDefault when you start swiping. This prevent clicks from working and giving focus to input fields. Adding a noPreventDefault class to these elements will not preventDefault when the swipe start on them and thus allow clicks to work.
