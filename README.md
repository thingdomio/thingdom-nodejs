Thingdom Node.js Module
===========

Node.js module for v1.1 of the [Thingdom.io API](https://api.thingdom.io/1.1).

## What is Thingdom?

[Thingdom](https://thingdom.io) allows you to mobile-enable your product in four lines of code with no need to develop the iOS and Android apps or create scalable cloud infrastructure. [Get Started Now!](https://thingdom.io/sign-up)

<p align="center">

<img src="https://thingdom.io/images/profile/5.png?raw=true" height="400px" />

<img src="https://thingdom.io/images/profile/2.png?raw=true" height="400px" />

</p>

## Installation
```
npm install thingdom
```

## Getting Started
```
var Thingdom = require( 'thingdom' ).Thingdom;

// instantiate Thingdom object and authenticate
var thingdom = new Thingdom( 'YOUR_API_SECRET', function( result ) {
    if( result.isSuccess ) {
    
        // look-up Thing and get back object
        thingdom.getThing( 'YOUR_THING_NAME', function( thing, result ) {           
            if( result.isSuccess ) {
            
                // send a feed message
                thing.feed( 'FEED_CATEGORY', 'MESSAGE', function( result ) {
                    // do something based on result.isSuccess
                });
                
                // send a status update
                thing.status( 'KEY', 'VALUE', function( result ) {
                    // do something based on result.isSuccess
                });
            }           
        });
    }
});

```

## Ideas for Module Usage

1. Programmatically trigger push notifications, feed messages, and real-time status updates from your Node.js app.
2. Remotely monitor any interaction with your Node.js application, Express server, etc.
3. With our quick drop-in integration and simple API calls you can mobile-enable your Node.js application in a matter of hours, even customizing the mobile experience for your end-users. 
