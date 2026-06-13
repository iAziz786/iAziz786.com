# The $50/Million Token Problem With Fable 5

Anthropic launched their most powerful model yet. Mostly I don't need it.

Published: June 10, 2026


Anthropic dropped Claude Fable 5 yesterday.
First Mythos-class model available to the public.
Same tier that found and exploited vulnerabilities
in every major operating system and browser earlier
this year. 80.3% on SWE-Bench Pro, 29.3 on
FrontierCode Diamond, beat Pokémon FireRed using
nothing but raw screenshots.

Most developers won't need it.

## The advantage is conditional

Anthropic's own words:

> The longer and more complex the task, the larger
> Fable 5's lead over our other models.

The lead shrinks on short tasks. The kind that make
up most development work. TrueFoundry's analysis
confirms it. On shorter, well-scoped tasks, Fable 5
and Opus 4.8 are close. Opus 4.8 is the sensible
default for most production traffic.

Most development work is autocomplete a function,
explain an error, draft a test, refactor a file.
Opus 4.8 at half the price handles that.

## The math

Fable 5: $10 per million input tokens,
$50 per million output tokens. 2x Opus 4.8.

One agentic call (50k input, 15k output) costs
$1.25. Chain 12 of those for a real task, roughly
$15. Max reasoning effort on hard FrontierCode
tasks, closer to $20.

That's a Stripe-class migration. 50 million lines
of Ruby, refactored in a day. Not the kind of task
most people hand to an AI.

## Speed

Artificial Analysis ranks Fable 5 #71 out of 152
models. 60.3 tokens per second. Fine for long tasks,
slower on quick ones.

The reasoning-effort dial helps. Low effort, fewer
tokens, faster answers. But then Fable 5 prices for
Sonnet-class output.

## Safeguards

Karpathy on launch day: the safeguards are
"configured to be a little too trigger happy."
Anthropic says they'll tune them.

About 5% of sessions fall back to Opus 4.8 right
now. Fable 5 prices, sometimes Opus 4.8 answers.
Makes sense for security researchers and
biologists. Doesn't help with React.

## The trial ends June 22

Fable 5 is free on Pro, Max, Team, and Enterprise
plans through June 22. Then it moves to usage-based
credits. Anthropic says they'll restore it to
standard subscriptions "as quickly as we can."

The $20/month Pro plan crowd will stick with
Opus 4.8 when the meter starts.

## Who it's actually for

Stripe compressed a two-month migration into a day.
IMC aced trading-analysis evaluations across the
board. Rakuten says "the extra thinking pays for
itself" for autonomous operations. Anthropic's
internal team accelerated drug discovery 10x.

Enterprises running long-horizon, multi-step
workflows where the model works for hours without
human intervention.

## The benchmarks are Anthropic's

Every number comes from Anthropic's published evals.
80.3% SWE-Bench Pro, 29.3 FrontierCode, 88.0%
Terminal-Bench. Not independent tests. The starred
rows for cybersecurity and biology are Mythos 5
scores. Fable 5, with safeguards active, performs
closer to Opus 4.8 on those tasks.

Marketing is cleaner than reality.

## Where this lands

Fable 5 is a specialist tool. Reach for it when
Opus 4.8 has plateaued. Long-running, multi-stage,
complex enough that 2x pricing is justified by 10x
time savings.

For everything else, Opus 4.8 is half the price,
faster on routine work, and doesn't have safety
classifiers tripping over security questions.
