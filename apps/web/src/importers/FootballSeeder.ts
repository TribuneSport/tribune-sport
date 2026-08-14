import { CompetitionImporter } from "./CompetitionImporter";
import { ClubImporter } from "./ClubImporter";

export class FootballSeeder {

  async execute() {

    console.log("====================================");
    console.log("Tribune Foot");
    console.log("FOOTBALL DATABASE");
    console.log("====================================");

    const competitionImporter = new CompetitionImporter();
    const clubImporter = new ClubImporter();

    const competitions = await competitionImporter.execute();

    const clubs = await clubImporter.execute();

    console.log("");

    console.log("Import terminé");

    console.log(`${competitions} compétitions`);

    console.log(`${clubs} clubs`);

    console.log("");

    return {

      success: true,

      competitions,

      clubs,

    };

  }

}
