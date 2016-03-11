/****************************************************************************
	leaflet-layer-tides-greenland.js, 

	(c) 2015, FCOO

	https://github.com/FCOO/leaflet-layer-tides-greenland
	https://github.com/FCOO

****************************************************************************/
;(function ($, L, window, document, undefined) {
	"use strict";

  L.GeoJSON.Tides = L.GeoJSON.extend({
  options: {
    language: 'en',
    url: "../json/tidal_stations_greenland.json",
      onEachFeature: function (feature, layer) {
        var popstr;
        var tidal_url_base = window.location.protocol + "//api.fcoo.dk/tides?station={s}&start={t1}&end={t2}&nx=500&ny=350&lang={l}&tz={dt}";
        var t1 = new Date();
        var dt = t1.getTimezoneOffset();
        t1.setUTCHours(0);
        t1.setUTCMinutes(0);
        t1.setUTCSeconds(0);
        t1.setUTCMilliseconds(0);
        var t2 = new Date();
        t2.setUTCDate(t2.getDate() + 3);
        t2.setUTCHours(0);
        t2.setUTCMinutes(0);
        t2.setUTCSeconds(0);
        t2.setUTCMilliseconds(0);
        t1 = t1.toISOString();
        t2 = t2.toISOString();
        var tidal_url = tidal_url_base.replace('{s}', feature.properties.id);
        tidal_url = tidal_url.replace('{t1}', t1);
        tidal_url = tidal_url.replace('{t2}', t2);
        tidal_url = tidal_url.replace('{l}', this.language);
        var popups = {};
        popups.en = '<h2>Tidal predictions for ' + feature.properties.name + '</h2><img src="' + tidal_url + '" height="350" width="500" /><p>Tidal predictions from <a href="http://dmi.dk">DMI</a>. Tidal tables can be found <a href="http://www.dmi.dk/en/groenland/hav/tidevandstabeller-groenland/">here</a>.</p>';
        popups.da = '<h2>Tidevandsprognose for ' + feature.properties.name + '</h2><img src="' + tidal_url + '" height="350" width="500" /><p>Tidevandsprognoser fra <a href="http://dmi.dk">DMI</a>. Tidevandstabeller kan findes <a href="http://www.dmi.dk/groenland/hav/tidevandstabeller-groenland/">her</a>.</p>';
        if (typeof popups[this.language] != 'undefined') {
          popstr = popups[this.language];
        } else {
          popstr = popups.en;
        }
        feature.properties.popup = popstr;
        popstr = popstr.replace('{dt}', dt);
        layer.bindPopup(popstr, {maxWidth: 700, maxHeight: 600});
      },
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
               radius: 5,
               fillColor: "#ff7800",
               color: "#000",
               weight: 1,
               opacity: 1,
               fillOpacity: 0.8
        });
      },
    },

    initialize: function (options) {
      var that = this;
      L.setOptions(this, options);
      this._layers = {};
      // jqxhr is a jQuery promise to get the requested JSON data
      this.jqxhr = $.getJSON(this.options.url);
      this.jqxhr.done(function (data) {
        that.addData(data);
      });
    },

    onAdd: function (map) {
      var that = this;
      this.jqxhr.done(function (/*data*/) {
        L.GeoJSON.prototype.onAdd.call(that, map);
      });
    },
  });

  return L.GeoJSON.Tides;



}(jQuery, L, this, document));



