export class Standard {
  constructor(skyScanner) {
    this.skyScanner = skyScanner;
  }

  static capitalize(countryName) {
    return countryName[0].toUpperCase() + countryName.slice(1).toLowerCase();
  }

  getCountryCode(countryName, locale, cb) {
    countryName = CountryCodes.capitalize(countryName);
    this.skyScanner.reference.countries(locale)
        .then((response) => {
          var data = response.data;
          if (data && data.Countries) {
            for (var country of data.Countries) {
              if (country.Name && country.Name == countryName) {
                return cb(country.Code);
              }
            }
          }
          return cb(new Error("No countries returned"));
        })
        .catch((response) => {
          if (response instanceof Error) {
            cb(response);
          } else {
            var err = `Status: ${response.status}
                  Data : ${response.data}`;
            cb(new Errror(err));
          }
        })

  }
}
