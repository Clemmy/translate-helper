#!/usr/bin/env node

var $ = require('jquery');

var args = process.argv.slice(2);

var htmlPath = args[0];
var prefix = args[1].toUpperCase();

var tagsToSearch = ['h1', 'h2', 'p', 'div', 'button', 'span', 'a', 'option', 'label', 'li']; //nubhack
var dictionary = {};

var fs = require('fs');
fs.readFile(htmlPath, 'utf8', function (err, html) {
    var $page = $('<div/>').html(html); //ghost div wrapper

    for (var i=0; i<tagsToSearch.length; ++i) {
        var results = $page.find(tagsToSearch[i]);

        results.each(function () {
            replaceHtmlAndAddToDictionary(this);
        });
    }

    var finalHtml = $page.html();
    finalHtml = finalHtml.replace(/translate=""/g, 'translate'); //prohack
    finalHtml = finalHtml.replace(/&amp;&amp;/g, '&&'); //prohack2

    console.log(finalHtml);
    console.log('===================================================================================================================================');
    console.log(JSON.stringify(dictionary, null, '\t'));
});

function replaceHtmlAndAddToDictionary(self) {
    if ($(self).attr('translate')) {
        var key = $(self).attr('translate').toUpperCase();
        dictionary[key] = $(self).html().trim().replace(/\s+/g, ' ');

        $(self).removeAttr('translate');
        $(self).html((prefix + '.' + key));
        $(self).attr('translate', '');
    }
}