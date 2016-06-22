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


let firstFlight = new FirstFlight(API_KEY, "2016-10-01", "2017-03-01", defaultParamsLivePrice, 'OTP-sky', 'BKKT-sky');

firstFlight.getTop();
