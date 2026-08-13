import competitions from "@/data/football/competitions.json";
import clubs from "@/data/football/clubs.json";
import countries from "@/data/football/countries.json";

export class FootballDataLoader {
  getCompetitions() {
    return competitions;
  }

  getClubs() {
    return clubs;
  }

  getCountries() {
    return countries;
  }
}

export const footballData = new FootballDataLoader();