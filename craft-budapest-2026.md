# Craft Budapest 2026

- **Homepage:** https://craft-conf.com/2026
- **Dates:** June 4–5, 2026
- **Format:** Live & Virtual
- **Venue:** Budapest, Hungarian Railway Museum

## About

An international, festival-like conference dedicated to the art and science of software delivery craft. Speakers from companies like Google, Spotify, Netflix, Tesla, and Apple. Combines talk sessions and masterclasses.

## Logistics

- **Venue:** Railway Museum Budapest
- **Registration opens:** Thursday 8:20
- **Commute from Puskás Ferenc Stadion (~30 min):**
  1. Tram 1 eastbound → **Vágány utca / Róbert Károly körút** (6 stops, ~7 min)
  2. Bus 30 / 230 / 30A northbound → **Kucsma utca** (6 stops, ~7 min)

## Keynote Speakers

- **Gergely Orosz** – Software Engineer & Author at The Pragmatic Engineer
- **Veronica Lynn Clark** – Speaker, Author, Facilitator
- **Kent Beck** – Principal at The Critical Hire

## Workshops (selection)

- "Fundamentals of Software Architecture: Crafting Systems in the Age of A.I." – Neal Ford & Mark Richards
- "Building blocks of a Meta-Harness: leading into ruFlo on day 2" – Robert Ranson
- "From Building Blocks to Boundless Creation (Hands-On with RuVector)" – Reuven Cohen
- "Drawing like an Architect: Diagrams for Human Insight" – Gregor Hohpe

## Program

Stages: Main Stage (18), Platform 2 (11), Focus Platform (6), Yellow Stage (11), Telekom Stage (11), Purple Stage (11), Green Stage (6), Innovation Stage (11), Podcast Stage (10), Tech Leaders' Lounge (3), Central Workshop Area (5), 🚂 Train Tracks (2), Sponsor Arena (2)

- [Day 1 – Thursday, June 4](craft-budapest-day-1.md)
- [Day 2 – Friday, June 5](craft-budapest-day-2.md)

## Overall Impressions

**Atmosphere:** Craft feels more playful and relaxed than conferences like Devoxx. People are very open and friendly — easy to get into conversations with everyone.

**Content:** Less technical depth than expected; the program leans more towards presentations than hands-on, practical takeaways. That said, this was intentional for this trip — the goal was to learn about leadership topics and psychological aspects of team and company work, which the conference does cover.

**AI overload:** The schedule is heavily dominated by AI topics. Seemingly fewer than 25% of talks avoid mentioning AI.

**Format drawbacks:**
- Compressed into just two days with up to 10 tracks running in parallel — hard to prioritise.
- One track (Tech Leaders' Lounge) requires a VIP ticket, effectively leaving only nine accessible tracks.
- Some talks have no abstract on the programme page, making it difficult to judge what a session will cover.

**Food:** Excellent. You can get through the entire day without eating elsewhere (hotel breakfast helps too).

## Talk Reviews

### Day 1 – Thursday, June 4

#### Slow down to speed up · Gergely Orosz (Keynote)

**Rating:** ★★★☆☆

**Notes:** Lively presentation. Reported on the frustration of high-grade developers at Meta being used as data labellers for AI — tasked with evaluating pull requests so the AI could learn from them. The middle section moved too fast to be actually digestible.

- The trend of reaching for hacks instead of rethinking solutions, now that LLMs make hacks easy.
- *"Slop buries the people who care"* — developers who care are overwhelmed keeping up with the damage done by messy AI-generated code.
- AI has an amplification effect: seniors gain the most, while juniors use more tokens with less results. Judgement you already have is what the tool rewards.
- Recommendations: stay (or become) hands-on; use AI to gain deep understanding rather than shortcuts; integrate AI at the system level to reduce friction.

#### Turn the Sh*t Around – High-performance communication techniques for high-performing teams · Joseph Pelrine

**Rating:** ★★★☆☆

**Notes:** Talk on communication triggers. Three types of triggers:

- **Truth triggers** – the feedback feels wrong, unfair, or unhelpful.
- **Relationship triggers** – *"What is your authority to say this to me?"*
- **Identity triggers** – the message makes you feel threatened or devalued.

Illustrated toxic communication strategies using Trump as an example.

**Side note:** Techniques for managing triggers in the moment — breathing or thinking exercises, physical stimuli to break out of the triggered state.

#### Thinking like an Architect · Gregor Hohpe

**Rating:** ★★★★★

**Notes:** Opened with the Black-Scholes options-pricing formula to isolate two parameters — volatility and time — then drew the analogy to architecture: frozen requirements deprive an architect of important input by removing volatility from planning.

Quote: *"Excessive complexity is nature's punishment for organizations that are unable to make decisions."*

A large portion focused on the power of metaphors: using them to build shared understanding between architects, management, and customers — inviting others into the thought process. Key clarification: metaphors and models are not a true representation of reality, but a helpfully simplified or abstracted version drawn from reality.

**Conclusions:**
- Architects need to connect levels of abstraction.
- Use metaphors to communicate across audiences.
- See problems from multiple dimensions / perspectives.
- Use models to make better decisions.
- Unearth hidden assumptions — make them obvious.

The mark of success: at the end of the process, stakeholders feel the solution is *"obvious"* — that obviousness is what the architect produced.

#### Debiasing Your Software Design Decision-Making · Kenny (Baas) Schwegler & Evelyn van Kelle

**Rating:** ★★★☆☆

**Notes:** Presented a decision-making checklist:

1. Be decision-ready
2. Broaden the frame
3. Seek independent advice
4. Test your assumptions
5. Establish simple rules

Techniques mentioned:
- **Generic parts** technique — for broadening perspective on a problem.
- **Pre-mortem** analysis — imagining failure before it happens, as a counter to overconfidence.
- **Bikeshedding** as a bias example: the tendency to focus on trivial tasks while avoiding the complicated ones.

Additional habit suggestions were shown during the talk. The speakers have published a book on the topic.

#### Taming the Unpredictable: Technical Leadership in Chaotic Times · Michelle Brush

**Rating:** ★★★☆☆

**Notes:** Used the classic conscious/unconscious × competence/incompetence quadrant model, reframed as a linear scale: "unconscious" at both extremes, "conscious" in the centre, with competence at the top and incompetence at the bottom. The argument: LLMs operate by definition at the unconscious extremes, while deliberate human thinking sits in the conscious centre.

Interpretation: LLMs are "unconscious competent" ~98% of the time and "unconscious incompetent" ~2% of the time.

**Systems blob model:** A system starts as a small blob with a fuzzy boundary. As behaviour at the edges is refined, the fuzzy area gets absorbed into a larger, well-defined system — which then has a new fuzzy boundary outside it. This cycle repeats indefinitely, regardless of whether refinement is driven by humans or LLMs.

**The Hopper:** A monkey-testing approach — deliberately trying to break the system at its edges, then feeding the findings back into the LLM to drive the next refinement cycle.

### Day 2 – Friday, June 5

<!-- Add reviews here -->

## Inspirations

- **MCP as an LLM interface for existing systems:** Could the current system be made more amenable to LLMs by exposing functionality via MCP? This could serve as a way to provide well-defined functions to other agents, and potentially open the system up for agentic / automated testing (cf. the "Hopper" concept from Michelle Brush's talk).
