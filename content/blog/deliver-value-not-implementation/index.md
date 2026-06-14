---
title: "Deliver Value, Not Implementation"
slug: deliver-value-not-implementation
author: Mohammad Aziz
date: "2026-06-14"
description: "A software engineer spent years building things that already existed. Here is what he learned."
tags:
  - software engineering
  - bias
  - value
  - ai
---

You add an extra spoonful of sugar to your tea. It was already sweet. But the habit is so ingrained you don't think about it. You just do it. Later you taste it and realize it was too much.

Software engineers do this with code. A problem shows up. They search for existing solutions and find a few. But reading the documentation of something new is uncomfortable. Learning someone else's API, understanding their conventions, figuring out the edge cases - it all takes effort. The unfamiliar friction makes the existing tool feel harder than building from scratch. So they build.

> The value is in the problem solved, not the code written.

Aziz was setting up a new project. He needed short URLs for the links he would share. The thought came before he could stop it: I could build a URL shortener. A quick one. A database table, an API endpoint, some redirect logic. He opened the editor. The LLM helped. Code flowed. Tables were created. Endpoints responded. It felt like flying.

Later that day, a colleague asked why he did not just use the host's built-in redirects. Aziz checked. It was right there in the settings. A config change. Thirty seconds.

He stared at his screen. The database table. The API endpoint. The careful redirect logic. All that work, and the solution had been running on the server the whole time, waiting to be turned on.

He had done this before. A commenting system when giscus already existed. An analytics dashboard when PostHog and Plausible were free. An auth system when Auth0 and Clerk had been doing it for years. A feature flag tool when LaunchDarkly and Flagsmith were battle-tested. A deployment script when GitHub Actions handled pipelines out of the box. A CMS when WordPress and Ghost had millions of users finding the edge cases so he would not have to.

Each time the same story. A problem shows up. Building feels productive. The code editor opens before the search engine. And weeks later, there is another project to maintain.

The cost of building has never been lower. An LLM can scaffold a working solution in an hour. An endpoint, a database, a UI. The gap between "I need this" and "it works" is almost nothing now. When the cost of building drops this low, the default answer to any problem becomes: build it.

The old question was "is this worth building?" The new question is "why wouldn't I build this?"

Here is the thing about Aziz. He built those things because he is curious. That is what makes him a good engineer. He wants to understand how things work, how they fit together, how they break. Curiosity drives most good engineers.

But curiosity also has a cost. It takes energy. Real, depletable energy that he only notices in specific moments. The midnight production issue. The weekend spent on a migration. The moment he looks at his own code and does not recognize it. Those moments remind him that every build, no matter how satisfying, is also a commitment he did not account for at the start.

He did not see this on that first afternoon. Nobody does. The cost is invisible at the beginning. The migrations he would need to write. The edge cases he had not considered. The feature request that turns a weekend project into a month of work.

An existing tool has already paid these costs. Its users found the edge cases. The documentation exists. The package is maintained by someone who thinks about that problem every day.

The learning curve of an existing tool is right in front of you. The learning curve of your own solution does not exist yet. You discover it as you go.

This is not an argument against curiosity. It is an argument for being careful about where you spend it.

What Aziz learned was not to stop building. He learned to ask one question before he starts: am I building this to understand it, or because I need it to work?

If understanding - build. That is how you learn.

If existing - use what is already there. Then move on to the problems that actually need solving.

The best engineers do not build everything. They know what not to build. They deliver value, not implementation.

Aziz is still learning this. But he is getting better at noticing when he does not need to build. The URL shortener taught him that. He has not built one since.
