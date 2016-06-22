import * as SkyScanner from "./skyscanner";
import * as util from "util";
import moment from "moment";
import * as async from "async";

export class FirstFlight {
  constructor(apiKey, outDate, inDate, params, origin, destination) {
    this.skyScanner = new SkyScanner.Skyscanner(apiKey);
    this.outDate = outDate;
    this.inDate = inDate
    this.params = params;
    this.origin = origin;
    this.destination = destination;
    this.response = {};
  }

  bestPrice(outDate, inDate, cb) {
    this.params['originplace'] = this.origin;
    this.params['destinationplace'] = this.destination;
    this.params['outbounddate'] = outDate;
    this.params['inbounddate'] = inDate;
    let self = this;

    var pollParams = {
      pageindex : 0,
      pagesize : 5
    }

    this.skyScanner.flights.livePrices.session(this.params)
      .then((response) => {
        const location = response.headers.location;
        return location.substring(location.lastIndexOf("/") + 1);
      })
      .then((session) => {
        var timeout = setInterval(() => {
          self.skyScanner.flights.livePrices.poll(session, pollParams)
            .then((response) => {
              console.log("Polling ...", response.data.Status);

              if (response.data.Status == 'UpdatesComplete') {
                clearTimeout(timeout);
                self.parseResponse(response.data, outDate, inDate, cb);
              }
            })
        }, 1000);

      })
      .catch((response) => {
        if (response instanceof Error) {
          console.log("Error ", response.message);
          cb(response);
        } else {
          console.log("Error thrown");
          console.log(response.data);
          console.log(response.status);
          console.log(response.headers);
          console.log(response.config);
          cb(new Error(response.data));
        }
      })
  }

  parseResponse(data, outDate, inDate, cb) {
    let itineraries = data.Itineraries;
    let top = [];
    for (let i = 0; i < 3; ++i) {
      var pricingOptions = itineraries[i].PricingOptions;
      for (let pricing of pricingOptions) {
        let j = 0;
        for (; j < top.length; ++j) {
          if (top[j].Price > pricing.Price) {
            break;
          }
        }
        top.splice(j, 0, pricing);
      }
    }

    top = top.splice(0, 3);

    if (!this.response[outDate])
      this.response[outDate] = {};

    this.response[outDate][inDate] = top;
    cb(null, {"out" : outDate, "in" : inDate});
  }

  execute(callback) {
    var self = this;
    var inDate = moment(this.inDate);
    var outDate = moment(this.outDate);
    var dateList = [];
    for (var i = 0; i < 30; ++i) {
      var outDateString = outDate.format("YYYY-MM-DD");
      inDate = moment(this.inDate);
      for (var j = 0; j < 30; ++j) {
        var inDateString = inDate.format("YYYY-MM-DD");
        ((outD, inD) => {
          dateList.push({
            "in" : inD,
            "out" : outD,
          })
        })(outDateString, inDateString);
        inDate = inDate.add(1, 'day');
      }
      outDate = outDate.add(1, 'day');
    }

    let asyncList = [];
    for (var i = 0; i < dateList.length; ++i) {
      ((i) => {
        asyncList.push((cb) => {
          setTimeout(function() {
            let d = dateList[i];
            self.bestPrice(d.out, d.in, cb);
          }, (i / 50) * 60000);
        })
      })(i);
    }

    async.parallel(asyncList, ((err, results) => {
      callback(err, results);
    }));

  }

  getTop() {
    let self = this;
    self.execute(((err, results) => {
      if (err) {
        console.log("Error ", err.message);
        return;
      }
      // console.log('Results ', results);
      // console.log("Full response", self.response);

      let minPrice = 999999999999;
      let minPricing = {};

      // get top
      for (let i = 0; i < results.length; ++i) {
        let inD = results[i].in;
        let outD = results[i].out;
        let pricing = self.response[outD][inD];
        if (pricing) {
          for (let j = 0; j < 3; j++) {
            let pricingItem = pricing[j];
            if (pricingItem) {
              if (minPrice > pricingItem.Price) {
                minPricing = {
                  "out" : outD,
                  "in" : inD,
                  "price" : pricingItem.Price,
                  "pricing" : pricingItem
                }
                minPrice = pricingItem.Price;
              }
            }
          }
        }
      }

      console.log("Min price ", minPrice);
      console.log("Min pricing ", minPricing);

    }))
  }

}
