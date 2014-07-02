
var hub = require('widget').hub
var $ = require('jquery')

var BASE_URL = 'http://tinytower.info/wp-json'

var cache = {}

function loadAbout() {
  $.ajax({
    url: BASE_URL,
    type: 'GET',
    success: function(body) {
      cache.about = body
      hub.trigger('aboutLoaded', body.group_data)
    }
  })
}

function loadPosts() {
  $.ajax({
    url: BASE_URL + '/posts',
    type: 'GET',
    success: function(body) {
      debugger
    }
  })
}

hub.on('aboutNeeded', function() {
  if (cache.about) hub.trigger('aboutLoaded', cache.about)
  else loadAbout()
})

hub.on('teamNeeded', function() {
  $.ajax(BASE_URL + '/posts?type=team', {
    type: 'GET',
    success: function(team) {
      hub.trigger('teamLoaded', team)
    }
  })
})

hub.on('partnersNeeded', function() {
  var all = []
  function fetch(page) {
    $.ajax(BASE_URL + '/partners?page=' + page, {
      type: 'GET',
      success: function(partners) {
        all = all.concat(partners)
        if (partners.length == 10) {
          fetch(page + 1)
        } else {
          hub.trigger('partnersLoaded', all)
        }
      }
    })
  }
  fetch(1)
})

hub.on('blogNeeded', function() {
  $.ajax(BASE_URL + '/posts?filter[category_name]=blog', {
    success: function(blog) {
      hub.trigger('blogLoaded', blog)
    }
  })
})

hub.on('newsNeeded', function() {
  $.ajax(BASE_URL + '/posts?filter[category_name]=media-mention', {
    success: function(news) {
      hub.trigger('newsLoaded', news)
    }
  })
})

hub.on('releasesNeeded', function() {
  $.ajax(BASE_URL + '/posts?filter[category_name]=press-release', {
    success: function(releases) {
      hub.trigger('releasesLoaded', releases)
    }
  })
})

hub.on('faqNeeded', function() {
  hub.trigger('faqLoaded', [
    { question: 'Is my gift to Openly Secular tax-deductible?', answer: 'Yes, your gift is tax-deductible. Although many organizations are involved with Openly Secular, the two organizations that will be providing most of the staff and creating most of the resources are the Richard Dawkins Foundation for Reason and Science and the Secular Student Alliance. Both organizations are tax-exempt under Federal law, and are the entities handling and putting to work donated funds.' },
    { question: 'How are funds being matched?', answer: 'Todd Stiefel and the Stiefel Freethought Foundation have offered a dollar-for-dollar doubling of all gifts, up to $250,000! With your donations and matching support, we can have a total impact of a half a million dollars! The matches have been offered in the amounts of $125,000 to Richard Dawkins Foundation for Reason and Science, and $125,000 to Secular Student Alliance.' },
    { question: 'What details may I need to document my tax deduction?', answer: 'Openly Secular is a joint project spearheaded by the Richard Dawkins Foundation for Reason and Science and the Secular Student Alliance. Both organizations are tax-exempt under Federal law, and are the entities handling and putting donated funds to work. You will receive documentation of your gift for tax purposes via email and/or postal mail.' },
    { question: 'What details may I need to confirm charitable eligibility <small>(such as from a donor-advised fund)</small>?', answer: 'You may make a gift payable to \"Openly Secular\" at either organization\'s address (preferred), or made payable to a single organization, with a memo or cover letter instructing to use the funds for Openly Secular.<div class="row"><div class="column small-12 medium-6"><p>Richard Dawkins Foundation for Reason and Science (U.S.)<br>Director of Development Marlo Jacobson<br>1012 14th St., NW, Suite 205 <br>Washington, DC 20005<br>207-733-5287<br>marlo@richarddawkins.net<br>United States Tax ID (EIN): 98-0499347</p></div><div class="column small-12 medium-6"><p>Secular Student Alliance<br><br>Development Director Neil Wehneman<br>PO Box 2371<br>Columbus, OH 43216<br>614-441-9588 x104<br>neil.wehneman@secularstudents.org<br>United States Tax ID (EIN): 41-1967141</p></div></div>' },
    { question: 'Can I donate by check or money order?', answer: 'You can absolutely pay by check or money order! Just make the check payable to \"Openly Secular\" and send it to either of the addresses below:<div class="row"><div class="column small-12 medium-6"><p>Richard Dawkins Foundation for Reason and Science (U.S.)<br>Director of Development Marlo Jacobson<br>1012 14th St., NW, Suite 205 <br>Washington, DC 20005<br>207-733-5287<br>marlo@richarddawkins.net<br>United States Tax ID (EIN): 98-0499347</p></div><div class="column small-12 medium-6"><p>Secular Student Alliance<br><br>Development Director Neil Wehneman<br>PO Box 2371<br>Columbus, OH 43216<br>614-441-9588 x104<br>neil.wehneman@secularstudents.org<br>United States Tax ID (EIN): 41-1967141</p></div></div>' },
    { question: 'How will my gifts be used?', answer: 'Your gift will be used by the Richard Dawkins Foundation and the Secular Student Alliance to drive Openly Secular Forward! All of your gift will be used to expand Openly Secular and decrease the discrimination faced by secular people.<p>The specific goals and deliverables of Openly Secular are available at LINK. RDF and SSA are working together, with the support of other organizations, to achieve these goals. RDF and SSA are relying on each organization\'s respective strengths to meet specific and shared objectives. We encourage all donors, including those new to the secular movement, to support the work of both organizations in this project.</p>' },
    { question: 'What if I want to designate my gift to one organization\'s work in this shared project?', answer: 'Richard Dawkins Foundation for Reason and Science and Secular Student Alliance have worked together on how to allocate the gifts made to the project. This allocation is driven by our understanding of donor intent based upon, for example, pre-existing donor relationships. We encourage all donors, including those new to the secular movement, to support the work of both organizations in this project. Donors who wish to specifically designate their gift solely to one organization\'s work may do so by making a gift payable to \"Openly Secular\" at either organization\'s address.</p><div class="row"><div class="column small-12 medium-6"><p>Richard Dawkins Foundation for Reason and Science (U.S.)<br>Director of Development Marlo Jacobson<br>1012 14th St., NW, Suite 205 <br>Washington, DC 20005<br>207-733-5287<br>marlo@richarddawkins.net<br>United States Tax ID (EIN): 98-0499347</p></div><div class="column small-12 medium-6"><p>Secular Student Alliance<br><br>Development Director Neil Wehneman<br>PO Box 2371<br>Columbus, OH 43216<br>614-441-9588 x104<br>neil.wehneman@secularstudents.org<br>United States Tax ID (EIN): 41-1967141</p></div></div>' },
    { question: 'What will happen to my contact information as a donor?', answer: 'Richard Dawkins Foundation for Reason and Science and Secular Student Alliance have worked together on how to handle donor contact information. Donors who wish to have their contact information used in a specific fashion (e.g. not shared with one organization or expressly shared with both) may do so by reaching out to us via the contact information above.<p>Donor information provided to Openly Secular will not be rented, sold, licensed, traded, or otherwise shared with any organization other than Richard Dawkins Foundation for Reason and Science and Secular Student Alliance.</p>' },
    { question: 'What if I have other questions not answered above?', answer: 'We are happy to answer other questions you may have. Please reach out to us via the contact information above.' }
  ])
})
