import { CompetitionImporter } from "./CompetitionImporter";
import { ClubImporter } from "./ClubImporter";
import { MatchImporter } from "./MatchImporter";

export class FootballSeeder {
  async execute() {
    console.log("====================================");
    console.log("TRIBUNE FOOT");
    console.log("INITIALISATION FOOTBALL");
    console.log("====================================");

    const competitionImporter =
      new CompetitionImporter();

    const clubImporter =
      new ClubImporter();

    const matchImporter =
      new MatchImporter();

    console.log("");
    console.log("Import des compétitions...");

    const competitions =
      await competitionImporter.execute();

    console.log(
      `${competitions} compétitions importées.`
    );

    console.log("");
    console.log("Import des clubs...");

    const clubs =
      await clubImporter.execute();

    console.log(
      `${clubs} clubs importés.`
    );

    console.log("");
    console.log("Import des matchs...");

    const matches =
      await matchImporter.execute();

    console.log(
      `${matches} matchs importés.`
    );

    console.log("");
    console.log("Initialisation Football terminée.");
    console.log("====================================");

    return {
      success: true,
      competitions,
      clubs,
      matches,
    };
  }
}

export default FootballSeeder;