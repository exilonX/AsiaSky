import * as SkyScanner from "skyscannerjs";
import {CountryCodes} from "./countryCodes";
import 'source-map-support/register'

const API_KEY = 'io744074446712880789659816394855';

console.log("Skyscanner ", SkyScanner);

let skyScanner = new SkyScanner.Skyscanner(API_KEY);

var countryCode = new CountryCodes();

var romCode = countryCode.getCountryCode("ROMANIA");

console.log(romCode);
