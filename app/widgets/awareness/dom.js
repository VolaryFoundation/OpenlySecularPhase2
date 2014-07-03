
var rivets = require('rivets')
var $ = require('jquery')
var hub = require('widget').hub
var _ = require('lodash')

// TODO loads
rivets.binders.modal = function(el, val) {
  if (val) {
    el.style.display = 'block'
    $(document.body).addClass('showing-dialog')
    var bodyRect = document.body.getBoundingClientRect()
    var elemRect = el.getBoundingClientRect()
    var placeholderTop = $(el).offsetParent().offset().top
    var styles = {
      top: ((bodyRect.top * -1) - placeholderTop + (bodyRect.height * .1)) + 'px',
      maxHeight: (bodyRect.height * .8) + 'px'
    }
    $(el).css(styles)
      .find('.inner').css(styles)
  } else {
    $(document.body).removeClass('showing-dialog')
    el.style.display = 'none'
  }
}

rivets.binders.autoscroll = function(el, val) {

  var winHeight = document.body.clientHeight
  var placeholder = document.querySelector('#placeholder')
  if (placeholder) placeholder.style.height = (winHeight - 290) + 'px'

  var section = document.getElementById(val)
  if (section) {
    var bodyRect = document.body.getBoundingClientRect()
    var elemRect = section.getBoundingClientRect()
    var offset   = elemRect.top - bodyRect.top
    $(document.body).animate({ scrollTop: offset - 100 }, '500')
  }
}

function isElementInViewport(el) {

  var docTop = $(window).scrollTop()
  var docHeight = $(window).height()
  var docBottom = docTop + docHeight

  var elTop = $(el).offset().top;
  var elBottom = elTop + $(el).height();

  // eltop is in top half of page//, or elbottom is in bottom half of page
  return ((elTop >= docTop && elTop <= docTop + (docHeight / 2)))// || (elBottom <= docBottom && elBottom >= docBottom - (docHeight / 2)))
}

function shouldSectionBeLoaded(el) {

  var docTop = $(window).scrollTop()
  var docHeight = $(window).height()
  var docBottom = docTop + docHeight

  var elTop = $(el).offset().top;
  var elBottom = elTop + $(el).height();

  return elTop <= docTop + docHeight
}

// TODO hacky
/*
window.addEventListener('scroll', _.throttle(function() {
  var bodyBounds = document.body.getBoundingClientRect()
  var bodyTop = bodyBounds.top * -1
  var docRange = [ bodyTop, bodyTop + bodyBounds.height ]
  var sections = document.querySelectorAll('section')
  var possibleSections = _.filter(sections, function(section) {
    return isElementInViewport(section)
  })
  var possibleLoading = _.filter(sections, function(section) {
    return shouldSectionBeLoaded(section)
  })

  if (possibleSections[0]) {
    var section = _.last(possibleSections)
    hub.trigger('sectionInView', section.getAttribute('id'))
  }

  if (possibleLoading[0]) {
    _.each(possibleLoading, function(section) {
      hub.trigger(section.getAttribute('id') + 'ScrolledTo')
    })
  }

}, 500))
*/
