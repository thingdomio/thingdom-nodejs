/**
 * A class that handles all HTTP communication with Thingdom.
 */
var https = require( 'https' );

var url = { host: 'api.thingdom.io', path: '/1.1' };
var requestCounter = 0;

/**
 * HttpHelper constructor.
 *
 * @constructor
 */
exports.HttpHelper = function () {
};

/**
 * Perform a HTTP GET request.
 *
 * @param request   - A request containing the endpoint and a optional query string.
 * @param callback  - A callback function that gets invoked with the request results.
 */
exports.HttpHelper.prototype.getData = function ( request, callback ) {
    var options = {
        host: url.host,
        path: url.path + '/' + request
    };
    doRequest( options, function( result ) {
        callback( result );
    });
}

/**
 * Perform a HTTP POST request.
 *
 * @param request   - A request containing the endpoint and a optional query string.
 * @param data      - An object containing the data to be posted.
 * @param callback  - A callback function that gets invoked with the request results.
 */
exports.HttpHelper.prototype.postData = function ( request, data, callback ) {
    var options = {
        host: url.host,
        path: url.path + '/' + request,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    };
    //
    // Add counter and date/time to each request.
    //
    data.counter = ++requestCounter;
    data.time = getDateAndTime();
    doRequest( options, data, function( result ) {
        callback( result );
    });
}

// ****************************************************************************
// Private Helper Methods
// ****************************************************************************

//
// Perform the HTTP request.
//
var doRequest = function ( options, data, callback ) {
    var req = https.request( options, function ( response ) {
        var jsonResponse = '';
        response.on( 'data', function ( chunk ) {
            jsonResponse += chunk;
        } );
        response.on( 'end', function () {
            var objResponse = JSON.parse( jsonResponse );
            callback( objResponse );
        } );
    } );

    if ( typeof data == 'function' ) {
        callback = data;
    }
    if ( typeof data == 'object' ) {
        var jsonData = JSON.stringify( data );
        req.write( jsonData );
    }
    req.end();
};

//
// Format the current date and time as yyyy/mm/dd hh:mm:ss
//
var getDateAndTime = function () {
    var now     = new Date();
    var year    = now.getFullYear();
    var month   = now.getMonth()+1;
    var day     = now.getDate();
    var hour    = now.getHours();
    var minute  = now.getMinutes();
    var second  = now.getSeconds();
    if(month.toString().length == 1) {
        var month = '0'+month;
    }
    if(day.toString().length == 1) {
        var day = '0'+day;
    }
    if(hour.toString().length == 1) {
        var hour = '0'+hour;
    }
    if(minute.toString().length == 1) {
        var minute = '0'+minute;
    }
    if(second.toString().length == 1) {
        var second = '0'+second;
    }
    var dateTime = year + '/' + month + '/' + day + ' ' + hour + ':' + minute + ':' + second;
    return dateTime;
};

