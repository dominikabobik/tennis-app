import axios from "axios";
import cheerio, { load } from "cheerio";

export interface Player {
  rank: number;
  country: string | undefined;
  country_flag_media: string | undefined;
  move: string;
  name: string;
  age: string;
  points: string;
}

export interface CountryStats {
  country: string | undefined;
  number: number;
}

export async function stats_per_country(range: string) {
  const players: Player[] = await all_players(range);
  const stats: CountryStats[] = [];
  players.forEach((player) => {
    const index = stats.findIndex((e) => e.country === player.country);
    if (index < 0) {
      stats.push({ country: player.country, number: 1 });
    } else {
      stats[index].number++;
    }
  });
  return stats;
}

export async function all_players(range: string): Promise<Player[]> {
  const url =
    "https://www.atptour.com/en/rankings/singles?rankRange=1-" +
    range +
    "&countryCode=All&rankDate=2023-07-03"; // URL we're scraping
  const AxiosInstance = axios.create(); // Create a new Axios Instance
  // const players: Player[] = [];
  // // Send an async HTTP Get request to the url
  const response = await AxiosInstance.get(url);
  const players: Player[] = [];
  const $ = load(response.data);
  const statsTable = $(".mega-table > tbody > tr");
  statsTable.each((i, element) => {
    const rank: number = parseInt($(element).find("td").text());
    const name: string = $(element)
      .find(".player-cell-wrapper > a")
      .text()
      .trim();
    const country: string | undefined = $(element)
      .find(".country-item > img")
      .attr("alt");
    const country_flag_media: string | undefined = $(element)
      .find(".country-item > img")
      .attr("src");
    const move: string = $(element)
      .find(".move-cell.border-right-4.border-left-dash-1 > span")
      .text();
    const age: string = $(element)
      .find(".age-cell.border-left-dash-1.border-right-4")
      .text()
      .trim();
    const points: string = $(element)
      .find(".points-cell.border-right-dash-1 > a")
      .text()
      .trim();

    players.push({
      rank,
      country,
      country_flag_media,
      move,
      name,
      age,
      points,
    });
  });
  return players;
}

export async function number_of_players_by_country(
  country_code: string,
  range: string
) {
  const players: Player[] = await all_players(range);
  return players.filter((e) => e.country === country_code).length;
}
