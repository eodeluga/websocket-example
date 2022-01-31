// Subscribe to websockets using key from https://www.cryptocompare.com/
// this is where you paste your api key
let apiKey = "";
const WebSocket = require("ws");
const ccStreamer = new WebSocket(
  "wss://streamer.cryptocompare.com/v2?api_key=" + apiKey
);

// Specify all exchanges to connect to
const exchanges = ["Coinbase", "Bitstamp", "Kraken", "Itbit", "Gemini"];

const getVWAPPenalty = (time) => {
  // Returns the correct penalty for each time range in seconds
  switch (true) {
    case time <= 5:
      return 1;
      break;
    case time > 5 && time <= 10:
      return 0.8;
      break;
    case time > 10 && time <= 15:
      return 0.6;
      break;
    case time > 15 && time <= 20:
      return 0.4;
      break;
    case time > 20 && time <= 25:
      return 0.2;
      break;
    default:
      return 0.001;
  }
};

const showVWAP = (exchange, timestamp, lastPrice, volume) => {  
    // This condition ensures NaN data is skipped
    if (exchange) {
        // Get current time
        let currTime = new Date();
        let tradeTime = new Date(timestamp);
        let elapsedTime = (currTime - tradeTime) / 1000;

        // Convert values to numerics for calculation
        let lp = parseFloat(lastPrice);
        let vol = parseFloat(volume);
        let penalty = getVWAPPenalty(elapsedTime);

        // Calculate the VWAP
        let vwap = (lp * penalty * vol) / (penalty * vol);
        console.log(`The VWAP for ${exchange} is ${vwap}`);
  }
};

// MAIN:
// Subscribe to each exchange Websocket
exchanges.forEach((exchange) => {
  ccStreamer.on("open", function open() {
    var subRequest = {
      action: "SubAdd",
      subs: [`0~${exchange}~BTC~USD`],
    };
    ccStreamer.send(JSON.stringify(subRequest));
  });
});

// Used to store ws message data
let message;
let exch, last, ts, vol;

ccStreamer.on("message", function incoming(data) {
  message = JSON.parse(data.toString());
  exch = message.M;
  ts = message.TS;
  last = message.P;
  vol = message.Q;

  // Show volume weighted average price
  showVWAP(exch, ts, last, vol);
});

exports.getVWAPPenalty = getVWAPPenalty;
