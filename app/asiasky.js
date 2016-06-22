import * as SkyScanner from "./skyscanner";
import {Standard} from "./standards";
import async from "async";
import {FirstFlight} from "./firstFlight"
import 'source-map-support/register'

const API_KEY = 'io744074446712880789659816394855';
const locale = "en-GB";
const Domestic_flights = true;

const userCountry = "RO";

const defaultParamsLivePrice = {
  currency : "EUR",
  country : "RO",
  locale: "en-GB",
  locationSchema: "Iata",
  adults : 1,
  groupPricing : true
}

const ipAddr = "127.0.0.1";

let skyScanner = new SkyScanner.Skyscanner(API_KEY);
var countryList = ['Thailand', 'Vietnam', 'Cambodia', 'Indonesia', 'Malaysia', 'Philippines'];

// skyScanner.autosuggest({
//   market : 'RO',
//   currency : 'EUR',
//   locale: "en-GB"
// }, 'Bangkok')
//   .then((response) => {
//     console.log(response.data);
//   })

var query = {
  market: "RO",
  currency: "EUR",
  locale: "en-GB",
  originPlace : "RO",
  destinationPlace : "TH",
  outboundPartialDate : "2016-10-01"
}

// skyScanner.flights.browse.routes(query, ipAddr)
//   .then((response) => {
//     console.log(response.data);
//   })
//   .catch((response) => {
//     if (response instanceof Error) {
//       console.log("Error ", response.message);
//     } else {
//       console.log("Error thrown");
//       console.log(response.data);
//       console.log(response.status);
//       console.log(response.headers);
//       console.log(response.config);
//     }
//   })

// async.waterfall([
//   ((cb) => {
//
//   }),
//   ((countries, cb) => {
//     console.log("The countries are", countries);
//     cb(null);
//   })
// ], function(err, data) {
//   console.log("Se termina");
// })

let firstFlight = new FirstFlight(API_KEY, "2016-10-01", "2017-03-01", defaultParamsLivePrice, 'OTP-sky', 'BKKT-sky');

firstFlight.getTop();
