/****************************************************************************
    leaflet-layer-tides-greenland.js,

    (c) 2015, FCOO

    https://github.com/FCOO/leaflet-layer-tides-greenland
    https://github.com/FCOO

****************************************************************************/
(function ($, L, window/*, document, undefined*/) {
    "use strict";

    var imgWidth = 600,
        imgHeight = 400;

    function getTextObjFromFeature( feature ){
        var properties = feature.properties;
        return {da: properties.nameDK || properties.name, en: properties.nameENG || properties.name};
    }

    function layerTidesOnPopupopen( popupEvent ){
        var popup = popupEvent.popup,
            layer = popup._source,
            lang = window.i18next.language.toUpperCase() == 'DA' ? 'da' : 'en',
            startDate = moment().utc().startOf('day'),
            endDate = moment( startDate ).add( 3, 'days' ),
            link =
                (window.location.protocol == 'https:' ? 'https:' : 'http:') +
                '//app.fcoo.dk/tides/v1?' +
                    'station=' + layer.feature.properties.id + '&' +
                    'lang=' + lang + '&' +
                    'start=' + startDate.toISOString() + '&' +
                    'end=' + endDate.toISOString() + '&' +
                    'nx=' + imgWidth + '&' +
                    'ny=' + imgHeight + '&' +
                    'tz=' + -1*moment().utcOffset(),
            $img = $('<img/>')
                .attr('src', link)
                .css({width: imgWidth, height: imgHeight });

        popup.changeContent( $img );
    }

    L.GeoJSON.Tides = L.GeoJSON.extend({
        options: {
            url: "../json/tidal_stations_greenland.json",
            onEachFeature: function (feature, layer) {
                layer.bindPopup({
                    width  : 15 + imgWidth + 15,
                    fixable: true,
                    scroll : 'horizontal',
                    header : {icon: 'fa-chart-line', text: [{da: 'Tidevand -', en: 'Tide -'}, getTextObjFromFeature(feature)]},

                    //Add 'dummy' content to get popup dimentions correct on first open
                    content: $('<div/>').css({width: imgWidth, height: imgHeight}),
                    footer: [
                        {icon: 'far fa-copyright', text: {da: 'Tidevandstabeller fra ', en: 'Tide tables from '}},
                        {text: 'DMI', link: 'https://dmi.dk'}
                    ]
                });

                layer.on('popupopen', layerTidesOnPopupopen);
            },

            pointToLayer: function (feature, latlng) {
                return  L.circleMarker(latlng, {
                            radius     : 7,
                            fillColor  : "#ff7800",
                            color      : "#000",
                            weight     : 1,
                            opacity    : 1,
                            fillOpacity: 0.8,
                        })
                        .bindTooltip({text: getTextObjFromFeature( feature )});
            },
        },

        initialize: function(initialize){
            return function (options) {
                initialize.call(this, null, options);

                //Read the meta-data
                var _this = this;
                window.Promise.getJSON( this.options.url, {}, function( data ){ _this.addData( data );} );
            };
        } (L.GeoJSON.prototype.initialize)

    });

    return L.GeoJSON.Tides;

}(jQuery, L, this, document));



