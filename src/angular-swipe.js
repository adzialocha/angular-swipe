(function(window, angular, undefined) {
  'use strict';

  /* global -ngSwipe */

  var ngSwipe = angular.module('swipe', []);

  ngSwipe.factory('swipe', [ function() {

    var MOVE_BUFFER_RADIUS = 40;
    var MAX_RATIO = 0.3;

    var POINTER_EVENTS = {
      'mouse': {
        start: 'mousedown',
        move: 'mousemove',
        end: 'mouseup'
      },
      'touch': {
        start: 'touchstart',
        move: 'touchmove',
        end: 'touchend',
        cancel: 'touchcancel'
      }
    };

    function getCoordinates(event) {
      var originalEvent = event.originalEvent || event;
      var touches = originalEvent.touches && originalEvent.touches.length ? originalEvent.touches : [originalEvent];
      var e = (originalEvent.changedTouches && originalEvent.changedTouches[0]) || touches[0];

      return {
        x: e.clientX,
        y: e.clientY
      };
    }

    function getEvents(pointerTypes, eventType) {
      var res = [];
      angular.forEach(pointerTypes, function(pointerType) {
        var eventName = POINTER_EVENTS[pointerType][eventType];
        if (eventName) {
          res.push(eventName);
        }
      });
      return res.join(' ');
    }

    return {

      bind: function(element, eventHandlers, pointerTypes) {

        // Absolute total movement
        var totalX, totalY;
        // Coordinates of the start position.
        var startCoords;
        var lastPos;
        // Whether a swipe is active.
        var active = false;
        // Decide where we are going
        var isDecided = false;
        var isVertical = true;

        pointerTypes = pointerTypes || ['mouse', 'touch'];

        element.on(getEvents(pointerTypes, 'start'), function(event) {
          startCoords = getCoordinates(event);
          active = true;
          totalX = 0;
          totalY = 0;
          isDecided = false;
          isVertical = true;
          lastPos = startCoords;
          eventHandlers['start'] && eventHandlers['start'](startCoords, event);
        });

        element.on(getEvents(pointerTypes, 'cancel'), function(event) {
          active = false;
          eventHandlers['cancel'] && eventHandlers['cancel'](event);
        });

        element.on(getEvents(pointerTypes, 'move'), function(event) {

          if (! active) {
            return;
          }

          if (! startCoords) {
            return;
          }

          var coords = getCoordinates(event);

          totalX += Math.abs(coords.x - lastPos.x);
          totalY += Math.abs(coords.y - lastPos.y);

          lastPos = coords;

          if (totalX < MOVE_BUFFER_RADIUS && totalY < MOVE_BUFFER_RADIUS) {
            return;
          } else {
            if (! isDecided){

              var deltaX, deltaY, ratio;

              deltaX = Math.abs(coords.x - startCoords.x);
              deltaY = Math.abs(coords.y - startCoords.y);

              ratio = deltaY / deltaX;

              if (ratio < MAX_RATIO){
                event.preventDefault();
                isVertical = false;
              } else {
                isVertical = true;
              }

              isDecided = true;
            }
          }

          event.isVertical = isVertical;
          eventHandlers['move'] && eventHandlers['move'](coords, event);
        });

        element.on(getEvents(pointerTypes, 'end'), function(event) {
          if (! active){
            return;
          }
          event.isVertical = isVertical;
          active = false;
          eventHandlers['end'] && eventHandlers['end'](getCoordinates(event), event);
        });
      }
    };
  }]);

  function makeSwipeDirective(directiveName, direction, axis, eventName) {
    ngSwipe.directive(directiveName, ['$parse', 'swipe', function($parse, swipe) {

      var MAX_OTHER_AXIS_DISTANCE = 75;
      var MAX_RATIO = 0.3;
      var MIN_DISTANCE = 30;

      return function(scope, element, attr) {

        var swipeHandler = $parse(attr[directiveName]);

        var startCoords, valid;

        function checkOverride(element, clazz) {
          do {
            var className = element.getAttribute('class');
            if (className && className.match(clazz) !== null) {
              return true;
            }
            element = element.parentElement;
          } while (element !== null);
          return false;
        }

        function validSwipe(coords) {

          if (! startCoords || ! valid){
            return false;
          }

          var deltaY = (coords.y - startCoords.y) * direction;
          var deltaX = (coords.x - startCoords.x) * direction;

          if(axis === null) { // tap
              return Math.abs(deltaY) < MIN_DISTANCE &&
                     Math.abs(deltaX) < MIN_DISTANCE;
          }
          else if(axis === false) {  // horizontal swipe
            return Math.abs(deltaY) < MAX_OTHER_AXIS_DISTANCE &&
              deltaX > 0 &&
              deltaX > MIN_DISTANCE &&
              Math.abs(deltaY) / deltaX < MAX_RATIO;
          }
          else {  // vertical swipe
            return Math.abs(deltaX) < MAX_OTHER_AXIS_DISTANCE &&
              deltaY > 0 &&
              deltaY > MIN_DISTANCE &&
              Math.abs(deltaX) / deltaY < MAX_RATIO;
          }
        }

        var pointerTypes = ['touch'];

        if (!angular.isDefined(attr['ngSwipeDisableMouse'])) {
          pointerTypes.push('mouse');
        }

        swipe.bind(element, {
          'start': function(coords, event) {
            if (axis && !checkOverride(event.target, 'noPreventDefault')) {
              event.preventDefault();
            }
            startCoords = coords;
            valid = !checkOverride(event.target, 'noStartDrag');
          },
          'cancel': function() {
            valid = false;
          },
          'end': function(coords, event) {
            if (validSwipe(coords)) {
              scope.$apply(function() {
                element.triggerHandler(eventName);
                swipeHandler(scope, { $event: event });
              });
            }
          }
        }, pointerTypes);
      };
    }]);
  }

  // avoid conflicts with ngTouch module

  try {
    angular.module('ngTouch');
  } catch(err) {
    makeSwipeDirective('ngSwipeLeft', -1, false, 'swipeleft');
    makeSwipeDirective('ngSwipeRight', 1, false, 'swiperight');
  }

  // left is negative x-coordinate, right is positive

  makeSwipeDirective('ngSwipeUp', -1, true, 'swipeup');
  makeSwipeDirective('ngSwipeDown', 1, true, 'swipedown');

  makeSwipeDirective('ngTap', 1, null, 'tap');
})(window, window.angular);
