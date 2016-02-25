const $ = require('jquery');
require('select2');
var debut = 0;
var taille = 15;
var tags = [];

$("#next").click(function() {
  debut += taille;
  newPage(debut,taille,tags);
});

$("#previous").click(function() {
  if(debut>=taille) debut -= taille;
  newPage(debut,taille,tags);
});

$(".js-example-basic-multiple").on("select2:select",function(e){
  tags.push(e.params.data.text);
  newPage(debut,taille,tags);
})

$(".js-example-basic-multiple").on("select2:unselect",function(e){
  var index = tags.indexOf(e.params.data.text);
  if (index > -1) {
    tags.splice(index, 1);
}
  newPage(debut,taille,tags);
})

$(document).ready(function(){
  requete(debut,taille,tags);
  $("select").select2();
  getTags();
});

function newPage(debut,taille,tags){
  $("#links").empty();
  requete(debut,taille,tags);
}

//// DOM ////
function render(data,debut,taille){
  var len = data.length;
  var fin = data.length;
  if(debut+taille<data.length) fin = debut+taille;
  var txt = "";
  if(len > 0){
    for(var i=debut;i<fin;i++){
      if(data[i]){
        txt += "<div class='link'><fieldset>";
        txt += "<a href='"+data[i].href+"'>"+data[i].description+"</a><br>";
        txt += "Tags : "+data[i].tags+"<br>";
        txt += "</fieldset></div>";
      }
    }
    if(txt != ""){
      $("#links").append(txt);
    }
  }
}

function addTags(tags){
  tags.forEach(function(element, index, array){
    $('#select')[0].innerHTML += '<option value="'+element+'">'+element+'</option>';
  })
}

//// DATA ////
function requete(debut,taille,tags){
  $.ajax({
    type: 'GET',
    url: "http://localhost:8080/links",
    success: function(data){
      if(data.data){
        render(filter(data.data,tags),debut,taille);
      }
    },
    error: function(jqXHR, textStatus, errorThrown){
      alert('error: ' + textStatus + ': ' + errorThrown);
    }
  });
}

function filter(data,tags){
  var list = [];
  data.forEach(function(elementLink, indexLink, arrayLink){
    if(filterTag(elementLink,tags)) list.push(elementLink);
  })
  return list;
}

function filterTag(link,tags){
  var fin = false;
  var somme = 0;
  //console.log(tags);
  tags.forEach(function(element, index, array){
    if(link.tags.indexOf(element)>-1){
      somme++;
    }
  });
  //console.log(somme);
  fin = (somme == tags.length);
  fin = fin || (tags.length==0);
  return fin;
}

function getTags(){
  $.ajax({
    type: 'GET',
    url: "http://localhost:8080/links",
    success: function(data){
      if(data.data){
        var tags = [];
        data.data.forEach(function(elementLink, indexLink, arrayLink){
          var stringTags = elementLink.tags.split(' ');
          stringTags.forEach(function(element, index, array){
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
  return tags;
}
