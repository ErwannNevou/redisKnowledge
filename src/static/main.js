const $ = require('jquery');
require('select2');
var start = 0;
var size = 15;
var tags = [];
var address = "http://localhost:8080/links";

$(document).ready(function(){
  request(start,size,tags);
  $("select").select2();
  getTags();
});

//// EVENTS ////

// Detect clic next
$("#next").click(function() {
  start += size;
  newPage(start,size,tags);
});

// Detect clic previous
$("#previous").click(function() {
  if(start>=size) start -= size;
  newPage(start,size,tags);
});

// Detect add tag from field
// Custom event from select2
$(".js-example-basic-multiple").on("select2:select",function(e){
  tags.push(e.params.data.text);
  newPage(start,size,tags);
})

// Detect remove tag from field
// Custom event from select2
$(".js-example-basic-multiple").on("select2:unselect",function(e){
  var index = tags.indexOf(e.params.data.text);
  if (index > -1) tags.splice(index, 1);
  newPage(start,size,tags);
})

// Format DOM and request
function newPage(start,size,tags){
  $("#links").empty();
  request(start,size,tags);
}

//// DOM ////

// Render the data
// Pagination too but better if we can ask only some result from api
function render(data,start,size){
  var end = data.length;
  // to limit amount of result to the size asked
  if( start+size < end ) end = start+size;
  var txt = "";
  if(end > 0){
    for(var i = start ; i < end ; i++){
      if(data[i]){
        txt += "<div class='link'><fieldset>";
        txt += "<a href='" + data[i].href + "'>" + data[i].description + "</a><br>";
        txt += "Tags : " + data[i].tags + "<br>";
        txt += "</fieldset></div>";
      }
    }
    if(txt != ""){
      $("#links").append(txt);
    }
  }
}

// Add tags as options of select2 field
// maybe can do better than innerHTML ?
function addTags(tags){
  tags.forEach(function(element, index, array){
    $('#select')[0].innerHTML += '<option value="'+element+'">'+element+'</option>';
  })
}

//// DATA ////
// Request the api
function request(start,size,tags){
  $.ajax({
    type: 'GET',
    url: address,
    success: function(data){
      if(data.data){
        // filter the links to render with filter
        render(filter(data.data,tags),start,size);
      }
    },
    error: function(jqXHR, textStatus, errorThrown){
      alert('error: ' + textStatus + ': ' + errorThrown);
    }
  });
}

// Filter the data
// Return the data who match the tags
function filter(data,tags){
  var list = [];
  // Parse the data ( all links )
  data.forEach(function(elementLink, indexLink, arrayLink){
    // If the element match tags then add to final list
    if(filterTag(elementLink,tags)) list.push(elementLink);
  })
  return list;
}

// Return if the element match tags
function filterTag(link,tags){
  var end = false;
  var sumTags = 0;
  // For all tags if in tags of element then increase sumTags
  tags.forEach(function(element, index, array){
    if(link.tags.indexOf(element)>-1){
      sumTags++;
    }
  });
  // if all tags matched
  end = (sumTags == tags.length);
  // if no tags
  end = end || (tags.length==0);
  return end;
}

// Get all the tags from all links
// Maybe get form api of all tags
function getTags(){
  $.ajax({
    type: 'GET',
    url: address,
    success: function(data){
      if(data.data){
        var tags = [];
        // for all links
        data.data.forEach(function(elementLink, indexLink, arrayLink){
          var stringTags = elementLink.tags.split(' ');
          // Get tags
          stringTags.forEach(function(element, index, array){
            // add to array if not in
            if($.inArray(element,tags)==-1) tags.push(element);
          })
        });
        addTags(tags);
      }
    },
    error: function(jqXHR, textStatus, errorThrown){
      alert('error: ' + textStatus + ': ' + errorThrown);
    }
  });
}
