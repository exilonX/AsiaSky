import async from "async";

export class Info {
  constructor(skyScanner, countries) {
    this.skyScanner = skyScanner;
  }

  getCountryInfo(cb) {
    var info = {};
    var self = this;
    async.parallel({
      code : ((cb) => {
        
      })
    },
    function(err, results) {

    });
  }

}
