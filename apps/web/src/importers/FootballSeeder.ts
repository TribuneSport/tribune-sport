import { CompetitionImporter } from "./CompetitionImporter";
import { ClubImporter } from "./ClubImporter";
import { PlayerImporter } from "./PlayerImporter";
import { MatchImporter } from "./MatchImporter";

export class FootballSeeder {
  async execute() {
    console.log("====================================");
    console.log("TRIBUNE FOOT");
    console.log("FOOTBALL DATABASE");
    console.log("====================================");

    const competitionImporter = new CompetitionImporter();
    const clubImporter = new ClubImporter();
    const playerImporter = new PlayerImporter();
    const matchImporter = new MatchImporter();

    console.log("");
    console.log("Import des compétitions...");

    const competitions = await competitionImporter.execute();

    console.log(
      `${competitions} compétitions importées.`
    );

    console.log("");
    console.log("Import des clubs...");

    const clubs = await clubImporter.execute();

    console.log(
      `${clubs} clubs importés.`
    );

    console.log("");
    console.log("Import des joueurs...");

    const players = await playerImporter.execute();

    console.log(
      `${players} joueurs importés.`
    );

    console.log("");
    console.log("Import des matchs...");

    const matches = await matchImporter.execute();

    console.log(
      `${matches} matchs importés.`
    );

    console.log("");
    console.log("Import Football terminé.");
    console.log("====================================");

    return {
      success: true,
      competitions,
      clubs,
      players,
      matches,
    };
  }
}

export default FootballSeeder;