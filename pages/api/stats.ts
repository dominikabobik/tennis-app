import { CountryStats, stats_per_country } from "@/lib/lib";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CountryStats[]>
) {
  const range = Array.isArray(req.query.range)
    ? req.query.range[0]
    : req.query.range;
  const stats = await stats_per_country(range || "10");
  res.json(stats);
}
