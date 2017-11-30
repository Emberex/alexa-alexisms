'use strict';

const alexisms = require('./alexisms');

function createResponse(sessionAttributes, {title='', speech='', repromptText=null, shouldEndSession=false}={}) {
  return {
    sessionAttributes,
    version: '1.0',
    response: {
      shouldEndSession,
      outputSpeech: {
        type: 'PlainText',
        text: speech,
      },
      card: {
        type: 'Simple',
        title: `SessionSpeechlet - ${title}`,
        content: `SessionSpeechlet - ${speech}`,
      },
      reprompt: {
        outputSpeech: {
          type: 'PlainText',
          text: repromptText,
        },
      },
    },
  };
}

function welcomeResponse() {
  return createResponse({}, {
    title: 'Hello',
    speech: 'Hi I\'m Alex. Ask me for a quote.',
    repromptText: 'Say "give me a quote".',
    shouldEndSession: false,
  });
}

function sessionEndResponse() {
    return createResponse({}, {
      title: 'Session Ended',
      speech: 'Bye!',
      shouldEndSession: true,
    });
}

function quoteResponse() {
  const quote = sample(alexisms);

  return createResponse({}, {
    title: 'Alexism',
    speech: quote,
    repromptText: 'Say "give me a quote".',
    shouldEndSession: true,
  });
}

function sample(array) {
  return array[Math.floor(Math.random() * array.length)];
}

exports.handler = (event, context, callback) => {
  try {
    console.log(`event.session.application.applicationId=${event.session.application.applicationId}`);
    const { request } = event;
    const { intent, type } = request;

    if(type === 'IntentRequest') {
      switch(intent.name) {
        case 'GetAQuoteIntent': return callback(null, quoteResponse());
        case 'AMAZON.HelpIntent': return callback(null, welcomeResponse());
        case 'AMAZON.StopIntent': return callback(null, sessionEndResponse());
        case 'AMAZON.CancelIntent': return callback(null, sessionEndResponse());
        default: throw new Error(`Invalid intent ${intent.name}`);
      }
    } else if(type === 'LaunchRequest') {
      return callback(null, quoteResponse());
    } else {
      throw new Error(`Unhandled request type ${type}`);
    }
  } catch (err) {
    callback(err);
  }
};
