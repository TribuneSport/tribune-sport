import { CompetitionImporter } from "./CompetitionImporter";

export class FootballSeeder {
  async execute() {
    console.log("====================================");
    console.log("TRIBUNE FOOT");
    console.log("INITIALISATION FOOTBALL - COMPETITIONS");
    console.log("====================================");

    const importer = new CompetitionImporter();

    const competitions = await importer.execute();

    return {
      success: true,
      step: "competitions",
      competitions,
    };
  }
}

export default FootballSeeder;
