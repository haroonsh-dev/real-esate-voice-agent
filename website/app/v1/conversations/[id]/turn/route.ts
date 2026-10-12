import { NextResponse } from "next/server";
import { FALLBACK_VERIFIED_LISTINGS } from "@/lib/fallbackData";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const text = String(body.text || "").trim();
  const language = String(body.language || "ur-Latn");
  const q = text.toLowerCase();

  let spoken_text = "";
  let matched = FALLBACK_VERIFIED_LISTINGS;
  const actions: Array<Record<string, unknown>> = [];

  if (q.includes("what can you do") || q.includes("help")) {
    spoken_text =
      language === "en"
        ? "I can search verified properties across Islamabad, Rawalpindi, Lahore, and Karachi, compare listings side-by-side, calculate mortgage installments, save properties to your shortlist, and schedule site viewings. Tell me your preferred city, area, and budget in PKR."
        : "Main Islamabad, Rawalpindi, Lahore aur Karachi mein verified properties search kar sakta hoon, side-by-side comparison, mortgage installment calculation, shortlist save, aur site viewing schedule kar sakta hoon. Apna pasandeeda area aur budget batayein.";
    matched = FALLBACK_VERIFIED_LISTINGS.slice(0, 3);
  } else if (q.includes("mortgage") || q.includes("installment") || q.includes("finance") || q.includes("calculate")) {
    spoken_text =
      language === "en"
        ? "For a PKR 5 Crore property with a 20% down payment (PKR 1 Crore) over 15 years, your estimated monthly installment is approximately PKR 5.85 Lakh per month. I have opened the installment calculator for you and loaded matching verified homes."
        : "PKR 5 Crore property par 20 percent down payment ke sath 15 saal ki mahana qist taqreeban PKR 5.85 Lakh banti hai. Maine aapke liye installment calculator khol diya hai.";
    matched = FALLBACK_VERIFIED_LISTINGS.slice(0, 2);
    actions.push({
      id: `act-calc-${Date.now()}`,
      kind: "calculate_mortgage",
      payload: { price_pkr: 50000000, down_payment_pct: 20, tenure_years: 15 },
      summary: "Opened 15-year installment calculator for PKR 5 Crore (20% down)",
      executed: true,
    });
  } else if (q.includes("shortlist") || q.includes("save")) {
    const target = FALLBACK_VERIFIED_LISTINGS[0];
    spoken_text =
      language === "en"
        ? `I have saved ${target.title} in ${target.area}, ${target.city} to your shortlist.`
        : `Ji bilkul! Maine "${target.title}" (${target.area}, ${target.city}) aapki shortlist mein save kar diya hai.`;
    matched = [target];
    actions.push({
      id: `act-save-${Date.now()}`,
      kind: "shortlist_property",
      payload: { property_id: target.id, action: "add" },
      summary: `Saved ${target.title} to shortlist`,
      executed: true,
    });
  } else if (q.includes("compare")) {
    matched = FALLBACK_VERIFIED_LISTINGS.slice(0, 2);
    spoken_text =
      language === "en"
        ? `Here is a side-by-side comparison of ${matched[0].title} (${matched[0].area}) and ${matched[1].title} (${matched[1].area}).`
        : `Maine ${matched[0].area} aur ${matched[1].area} ki dono verified properties ka side-by-side comparison khol diya hai.`;
    actions.push({
      id: `act-cmp-${Date.now()}`,
      kind: "compare_properties",
      payload: { property_ids: matched.map((m) => m.id) },
      summary: "Comparing top 2 verified properties side-by-side",
      executed: true,
    });
  } else {
    const filtered = FALLBACK_VERIFIED_LISTINGS.filter((item) => {
      const hay = `${item.title} ${item.city} ${item.area} ${item.property_type} ${item.transaction_type} ${item.description}`.toLowerCase();
      if (q.includes("karachi") && item.city.toLowerCase() === "karachi") return true;
      if (q.includes("lahore") && item.city.toLowerCase() === "lahore") return true;
      if (q.includes("rawalpindi") && item.city.toLowerCase() === "rawalpindi") return true;
      if (q.includes("dha") && item.area.toLowerCase().includes("dha")) return true;
      if (q.includes("f-10") && item.area.toLowerCase().includes("f-10")) return true;
      if (q.includes("bahria") && item.area.toLowerCase().includes("bahria")) return true;
      if (q.includes("blue area") && item.area.toLowerCase().includes("blue area")) return true;
      if (q.includes("rent") && item.transaction_type === "rent") return true;
      if (q.includes("apartment") && item.property_type === "apartment") return true;
      if ((q.includes("villa") || q.includes("house") || q.includes("home")) && item.property_type === "house") return true;
      if (q.includes("islamabad") && item.city.toLowerCase() === "islamabad") return true;
      return hay.includes(q);
    });
    matched = filtered.length > 0 ? filtered.slice(0, 3) : FALLBACK_VERIFIED_LISTINGS.slice(0, 3);
    const top = matched[0];
    const priceCrore =
      top.price_pkr >= 10_000_000
        ? `PKR ${(top.price_pkr / 10_000_000).toFixed(2).replace(/\.00$/, "")} Crore`
        : `PKR ${(top.price_pkr / 100_000).toFixed(1)} Lakh`;
    spoken_text =
      language === "en"
        ? `I found ${matched.length} verified ${matched.length === 1 ? "property" : "properties"} matching your request. The top match is "${top.title}" in ${top.area}, ${top.city} at ${priceCrore}. Would you like to compare these listings or schedule a site visit?`
        : `Ji bilkul! Mujhe aapki requirement ke mutabiq ${matched.length} verified properties mili hain. Sab se behtareen option ${top.area}, ${top.city} mein "${top.title}" hai (${priceCrore}). Kya aap inka comparison dekhna chahein gay ya site visit book karein?`;
  }

  return NextResponse.json({
    decision: {
      spoken_text,
      property_ids: matched.map((m) => m.id),
      actions,
    },
    structured_reasoning: {
      status: "configured_unverified",
      last_failure_category: null,
    },
  });
}
