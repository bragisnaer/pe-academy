-- Migration: replace Level 1 placeholder quiz questions with final content
-- Level 1 (Foundations) — 20 questions across 5 topic tags

DELETE FROM public.quiz_questions
WHERE level_id = '4d355fb9-493f-4101-9a9f-bc7ec6f85ca6';

INSERT INTO public.quiz_questions (id, level_id, topic_tag, question, options, correct_index, explanation) VALUES
  (
    '4a89e3de-95de-4a7c-8aba-61ac33c507b2',
    '4d355fb9-493f-4101-9a9f-bc7ec6f85ca6',
    'pe-fundamentals',
    'A family office is considering two investment options: buying shares of a publicly listed industrial conglomerate or committing capital to a private equity buyout fund. Which feature most fundamentally distinguishes the PE commitment from the public share purchase?',
    '["The PE commitment requires a higher minimum investment amount","The PE commitment locks up capital for years with no ability to redeem at will","The PE commitment involves less risk because private companies are more stable","The PE commitment generates dividend income rather than capital gains"]',
    1,
    'Illiquidity is the defining structural difference. Public shares can be sold on any trading day; PE commitments lock capital for 5–10 years. This illiquidity is why PE historically demands a return premium over public markets, not because the underlying businesses are riskier or safer on average.'
  ),
  (
    'b9539ca3-2e87-4e24-a98f-e31e304d5b45',
    '4d355fb9-493f-4101-9a9f-bc7ec6f85ca6',
    'pe-fundamentals',
    'A PE firm acquires a business at 9x EBITDA of €40M, grows EBITDA to €55M over five years, exits at 10x EBITDA, and repays €80M of debt during the hold period. Which value creation levers contributed to the return?',
    '["Only EBITDA growth, because the exit multiple is nearly identical to the entry multiple","EBITDA growth, modest multiple expansion, and debt paydown — all three","Only debt paydown, because the business value was essentially unchanged","Multiple expansion alone, since the entry and exit multiples differ"]',
    1,
    'All three classic LBO return drivers are present: EBITDA growth (€40M to €55M), multiple expansion (9x to 10x), and debt paydown (€80M). The strongest PE returns combine all three. Even a one-turn multiple move contributes meaningful value on a €55M EBITDA base.'
  ),
  (
    '3b91b101-545c-4008-9a33-4504a99258d3',
    '4d355fb9-493f-4101-9a9f-bc7ec6f85ca6',
    'pe-fundamentals',
    'In the 1980s LBO boom, three conditions converged to enable the era''s mega-deals. Which of the following was NOT one of them?',
    '["The maturation of the high-yield bond market, pioneered by Michael Milken","Deregulation of financial markets that expanded credit availability","The breakup of diversified conglomerates that created undervalued targets","Widespread institutional LP allocations from pension funds and sovereign wealth funds"]',
    3,
    'Institutional LP bases were relatively underdeveloped in the 1980s — pension funds and sovereign wealth funds formalised their PE allocations mostly in the 1990s and 2000s. The three enabling 1980s conditions were high-yield debt, deregulation, and conglomerate breakups providing acquisition targets.'
  ),
  (
    'f8122db9-cc01-4bac-9861-1ff8a7ecdf69',
    '4d355fb9-493f-4101-9a9f-bc7ec6f85ca6',
    'pe-fundamentals',
    'A European mid-market PE firm describes itself as ''operating in the upper mid-market.'' What characteristic most accurately fits this positioning?',
    '["Acquires businesses with $1–5 million of EBITDA using sector-focused strategies","Manages $50 billion or more in AUM and competes for the largest global deals","Operates with $5–50 billion in AUM and often builds concentrated sector-specialist portfolios","Invests exclusively in venture-stage technology companies with no leverage"]',
    2,
    'Upper mid-market firms typically manage $5–50 billion in AUM and frequently operate as sector specialists with deep operational capabilities. Mega-funds sit above this tier ($50B+), while lower mid-market firms operate below $1B AUM. Venture investing is a separate asset class.'
  ),
  (
    '4d212110-9840-4507-97fb-aff1a15046a1',
    '4d355fb9-493f-4101-9a9f-bc7ec6f85ca6',
    'key-players',
    'A PE fund''s Limited Partnership Agreement specifies that LPs contribute 98% of the fund''s capital. Yet the General Partner makes every investment decision without LP approval. What structural principle explains why LPs accept this arrangement?',
    '["LPs retain veto rights through the investment committee","LPs are paid a higher return than the GP to compensate for their passive role","Limited partnership structure trades LP control for limited liability and professional management","LPs can withdraw their capital at any time if they disagree with investment decisions"]',
    2,
    'The limited partnership structure grants LPs limited liability (capped at their commitment) and access to professional management in exchange for passivity in investment decisions. LPs cannot withdraw committed capital on demand, have no veto over individual investments, and do not earn higher returns than the GP — they earn different economics structured through the waterfall.'
  ),
  (
    '61b66aac-3ebc-46b9-94cf-0270713cd286',
    '4d355fb9-493f-4101-9a9f-bc7ec6f85ca6',
    'key-players',
    'A mid-market PE firm is considering hiring its first operating partner. Which statement best captures the function this role typically performs?',
    '["Sources new investment opportunities through industry networks and warm introductions","Provides operational expertise across portfolio companies — interim leadership, functional improvement, or sector guidance","Manages the fund''s regulatory filings, compliance obligations, and LP reporting requirements","Negotiates debt financing terms with lenders on behalf of the deal team"]',
    1,
    'Operating partners are typically former CEOs, CFOs, or functional experts who work directly with portfolio companies — serving as interim executives, leading operational improvement projects, or providing sector-specific expertise during diligence and ownership. Deal sourcing, compliance, and financing are performed by other roles within the firm.'
  ),
  (
    '9514bd63-4c16-47b6-b7e3-b2594876240e',
    '4d355fb9-493f-4101-9a9f-bc7ec6f85ca6',
    'key-players',
    'CLO managers have become one of the most important participants in the PE ecosystem, yet they rarely appear in news coverage of individual deals. What role do they play?',
    '["They provide equity co-investment alongside PE funds in large buyouts","They are the single largest buyer of leveraged loans issued to finance LBOs","They advise portfolio companies on operational improvements during the hold period","They conduct independent valuations of PE fund portfolios for LP reporting purposes"]',
    1,
    'Collateralised Loan Obligation (CLO) managers pool leveraged loans into structured vehicles and issue tranched securities to investors. They are the largest institutional buyer of the loans that finance PE-backed LBOs — making them a critical, if invisible, component of the PE debt ecosystem.'
  ),
  (
    '80dd33cd-ae99-42f4-adb3-9e738dea3071',
    '4d355fb9-493f-4101-9a9f-bc7ec6f85ca6',
    'key-players',
    'A PE firm is evaluating a proprietary deal opportunity — a founder-owned industrial business that was introduced through the firm''s operating partner network. What competitive advantage does this sourcing channel typically provide?',
    '["Lower regulatory scrutiny because the deal bypasses investment bank involvement","Guaranteed approval from the investment committee since senior partners made the introduction","Less competition and often better pricing than a formal auction process","Reduced legal costs because founder-owned businesses require no SPA documentation"]',
    2,
    'Proprietary deal flow — deals where the PE firm is the primary or only bidder — typically produces better pricing and less competitive tension than formal auctions run by investment banks. This is why firms invest heavily in building industry relationships. Regulatory requirements, IC approval standards, and legal documentation do not change based on sourcing channel.'
  ),
  (
    'aae53313-86a5-4ff7-95e2-64342e3d38f6',
    '4d355fb9-493f-4101-9a9f-bc7ec6f85ca6',
    'deal-concepts',
    'A PE firm is evaluating two potential targets. Company A generates €30M EBITDA with 85% recurring subscription revenue and 5% annual capex. Company B generates €30M EBITDA with project-based revenue tied to the construction cycle and 15% annual capex. Which is the stronger LBO candidate and why?',
    '["Company B — higher capex means more tangible assets to serve as debt collateral","Company A — stable recurring revenue and low capex produce predictable free cash flow to service debt","Both are equally suitable since they have identical EBITDA","Company B — cyclical businesses typically command higher exit multiples"]',
    1,
    'LBO candidates need stable, predictable cash flows because debt service is non-negotiable. Recurring subscription revenue and low capex produce reliable free cash flow. Cyclical, project-based businesses with high capex are poor LBO candidates because a downturn can trigger covenant breach while the debt load remains constant.'
  ),
  (
    '974181cc-c591-4292-8d94-b98d8e4e2771',
    '4d355fb9-493f-4101-9a9f-bc7ec6f85ca6',
    'deal-concepts',
    'A PE firm has signed a Letter of Intent on a €300M acquisition with a 60-day exclusivity period. Three weeks into diligence, a competitor approaches the seller with a higher offer. What does the exclusivity provision allow or require?',
    '["The seller must automatically accept the higher offer and terminate negotiations with the PE firm","The seller is contractually prohibited from negotiating with the competitor during the exclusivity window","The PE firm must match the higher offer or lose its position","Exclusivity provisions are non-binding and the seller can negotiate freely"]',
    1,
    'Exclusivity provisions in LOIs legally prevent the seller from negotiating with other parties during the specified window — typically 30–60 days. This protects the buyer''s diligence investment. While LOIs are generally non-binding on price and terms, exclusivity provisions are binding and enforceable.'
  ),
  (
    'ae8130f8-0d2b-4353-a757-c0d2165a2f08',
    '4d355fb9-493f-4101-9a9f-bc7ec6f85ca6',
    'deal-concepts',
    'A PE firm acquires a company for $500M using $175M equity and $325M debt. After 5 years, the business is sold for $600M. During the hold period, $100M of debt was repaid. What is the approximate equity return?',
    '["1.2x — matching the enterprise value appreciation from $500M to $600M","2.0x — driven primarily by debt paydown even though enterprise value grew modestly","3.4x — because leverage amplifies the small enterprise value increase","The equity was lost because remaining debt exceeds the sale proceeds"]',
    1,
    'Exit equity = $600M (EV) – $225M (remaining debt after $100M paydown) = $375M. MOIC = $375M / $175M ≈ 2.1x. This illustrates the leverage effect: even a modest 20% enterprise value increase (from $500M to $600M) produces a doubling of equity value when combined with significant debt paydown.'
  ),
  (
    '66bad7e8-33a9-4b2c-b2e4-3490a156263c',
    '4d355fb9-493f-4101-9a9f-bc7ec6f85ca6',
    'deal-concepts',
    'A PE-backed company has €60M of EBITDA and €360M of debt structured across senior secured (€240M at 5%), second lien (€80M at 8%), and mezzanine (€40M at 11%). What is the company''s leverage ratio, and what does this indicate?',
    '["4.0x — a conservative leverage level typical of investment-grade corporate structures","6.0x — a typical leveraged buyout capital structure for a stable business","9.5x — an extremely aggressive structure that would fail most covenant tests","Cannot be calculated without knowing the equity contribution"]',
    1,
    'Leverage ratio = Total Debt / EBITDA = €360M / €60M = 6.0x. This is a typical LBO entry leverage for a stable, cash-generative business. Investment-grade corporates usually carry 2-3x leverage; LBOs range from 4-7x depending on business quality and credit market conditions. The equity contribution is a separate consideration from the leverage ratio.'
  ),
  (
    'fb99b379-070a-419a-992a-d8742b8558aa',
    '4d355fb9-493f-4101-9a9f-bc7ec6f85ca6',
    'fund-structure',
    'A $2 billion PE fund closes in January 2023. Two years later, the GP has called approximately $1.2 billion to fund six platform acquisitions. An LP asks when they will receive distributions. What is the most accurate answer based on typical fund dynamics?',
    '["Distributions begin immediately after each capital call as investments generate cash flow","Distributions typically begin 3–5 years into the fund life as portfolio companies are exited","Distributions are paid annually based on portfolio company EBITDA growth","Distributions only occur at fund termination in year 10"]',
    1,
    'PE funds follow a J-curve pattern. Years 1–3 involve capital deployment with minimal distributions. Distributions typically accelerate in years 4–8 as portfolio companies are exited. This J-curve is inherent to PE and is why short-term performance measurement is misleading for the asset class.'
  ),
  (
    'f3f6a8b5-c924-4e7c-815c-b92e4893ea61',
    '4d355fb9-493f-4101-9a9f-bc7ec6f85ca6',
    'fund-structure',
    'A GP raises a $1 billion fund with standard 2-and-20 terms and an 8% hurdle. After 10 years, the fund returns $2.2 billion to investors. Under a standard European (whole-fund) waterfall, approximately how much does the GP receive as carried interest?',
    '["$200 million — 20% of the gross fund return","$100 million — 10% of the net profit","$175 million — 20% of profits above the preferred return","$440 million — 20% of the total distribution"]',
    2,
    'Under a European waterfall: LPs receive capital back ($1.0B) plus 8% preferred return (approximately $0.3B compound over the fund life). Profits above the hurdle: approximately $0.9B. Carry at 20% of this amount: roughly $175–180M. Carry is calculated on profits above the hurdle, not on gross distributions or the whole fund return.'
  ),
  (
    'e0aa80f5-482b-4dde-bc3e-3f3965a66772',
    '4d355fb9-493f-4101-9a9f-bc7ec6f85ca6',
    'fund-structure',
    'A PE firm''s GP and LPs have negotiated a clawback provision in the LPA. In which scenario would this provision be triggered?',
    '["The GP outperforms the hurdle rate and LPs want to reduce the GP''s carry percentage","The fund generates strong early exits but later investments underperform, leaving the GP with excess carry already distributed","A key senior partner departs the firm during the investment period","The fund life is extended beyond the original 10-year term"]',
    1,
    'Clawback provisions protect LPs when strong early exits cause the GP to receive carry, but subsequent underperformance means the GP was over-distributed relative to the fund''s final overall return. The GP must return the excess carry to LPs. Key-person events trigger different provisions (investment period suspension), and fund extensions require separate LP consent.'
  ),
  (
    'de92c56d-d662-4cbf-970d-2fc3edbff333',
    '4d355fb9-493f-4101-9a9f-bc7ec6f85ca6',
    'fund-structure',
    'A pension fund is evaluating a commitment to a new PE fund. The GP proposes a 2% management fee on committed capital during the investment period, dropping to 1.5% on invested capital thereafter. What is the economic significance of this step-down?',
    '["It is a loophole that allows the GP to extract additional fees after deployment","It aligns fees with the GP''s actual workload — active investing versus portfolio management","It increases LP costs over time as the fund matures","It is required by regulators in most jurisdictions"]',
    1,
    'The step-down reflects the economic reality that active deal-making during the investment period requires more resources than portfolio management during the harvest period. It also reduces fee drag on LP returns once the fund is fully deployed. The step-down is a market convention, not a regulatory requirement.'
  ),
  (
    '8d373ec7-4bfe-464c-9d1c-b133b549b45e',
    '4d355fb9-493f-4101-9a9f-bc7ec6f85ca6',
    'return-metrics',
    'Two investments both generate a 3.0x MOIC. Investment A returns capital in 4 years; Investment B returns capital in 9 years. Which is more attractive and why?',
    '["Investment B — longer holds demonstrate stronger operational transformation","Investment A — faster return generates a higher IRR and frees capital for redeployment","They are equally attractive — MOIC is the definitive measure of PE performance","Investment B — longer hold periods command premium exit multiples"]',
    1,
    'Both investments generate the same absolute multiple (3.0x), but Investment A delivers roughly 32% annualised returns versus approximately 13% for Investment B. Time matters because capital returned earlier can be redeployed. This is why MOIC alone is insufficient — it must be paired with IRR to evaluate PE performance.'
  ),
  (
    '2574ff03-89f1-47db-8382-9f4306fa9c16',
    '4d355fb9-493f-4101-9a9f-bc7ec6f85ca6',
    'return-metrics',
    'A PE fund reports a gross IRR of 25% and a net IRR of 17%. What primarily explains the 8 percentage point gap?',
    '["Taxes paid at the fund level before distribution to LPs","Management fees and carried interest paid to the GP","Currency translation losses on international investments","Valuation write-downs of underperforming portfolio companies"]',
    1,
    'The gap between gross and net IRR reflects the GP''s economic take: 2% annual management fees plus 20% carried interest on profits above the hurdle. The typical spread is 3–7 percentage points for well-performing funds, though it varies with fund size and fee structure. PE funds are pass-through entities for tax purposes in most jurisdictions.'
  ),
  (
    '2d52ff7a-1eba-4708-9ca7-8e67ed223e45',
    '4d355fb9-493f-4101-9a9f-bc7ec6f85ca6',
    'return-metrics',
    'An LP is comparing two PE funds approaching year 6. Fund Alpha reports TVPI of 2.2x with DPI of 0.4x. Fund Beta reports TVPI of 1.9x with DPI of 1.3x. Which fund''s performance is more certain and why?',
    '["Fund Alpha — higher TVPI means superior total value creation","Fund Beta — most of its reported value has been realised as actual cash distributions","Both are equally certain since TVPI captures total fund performance","Fund Alpha — the larger unrealised portion indicates greater growth potential"]',
    1,
    'DPI measures actual cash returned to LPs; RVPI (the difference between TVPI and DPI) is unrealised paper value that can deteriorate before exit. Fund Beta has distributed most of its value (1.3x of its 1.9x TVPI is realised), making its track record more certain. Fund Alpha''s 2.2x TVPI depends heavily on unrealised valuations that must still be achieved through exits.'
  ),
  (
    '0fbde182-8463-45a9-839a-a6d0cc0f2ac8',
    '4d355fb9-493f-4101-9a9f-bc7ec6f85ca6',
    'return-metrics',
    'A PE firm reports an impressive 28% IRR on its latest fund. A sophisticated LP asks for the fund''s Public Market Equivalent (PME) benchmark. What question is the LP trying to answer?',
    '["Whether the fund''s returns would have qualified for a stock market listing","How the fund''s returns compare to investing the same cash flows in a public index","Whether the fund''s valuations have been audited against public company standards","How the fund''s IRR compares to the GP''s historical track record"]',
    1,
    'PME benchmarks PE returns against what an equivalent investment in a public index would have earned on the same cash flow dates. A PME above 1.0x means the PE fund outperformed the benchmark; below 1.0x means a passive index would have done better. A 28% IRR during a strong bull market may reflect beta rather than genuine alpha.'
  );

