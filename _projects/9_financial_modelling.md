---
layout: page
title: Option Pricing, Calibration and Hedging
description: Python simulations, model fitting and numerical checks from my financial engineering group work.
permalink: /projects/financial-modelling/
img: assets/img/projects/financial-modelling.svg
importance: 1
category: Financial Engineering
related_publications: false
---

**Context:** MSc Financial Engineering group coursework, WorldQuant University  
**Tools:** Python, NumPy, pandas, SciPy, Matplotlib

I worked on three connected questions: how to calculate an option's price, how to fit a model to supplied prices, and how to check that the calculations behave as expected.

An option's value depends on its terms and on assumptions about future prices. Some options can be exercised early. Others depend on the average price over time. Those differences affect both pricing and hedging.

<img src="{{ '/assets/img/projects/financial-modelling.svg' | relative_url }}" class="img-fluid rounded" style="width: 100%; height: auto;" alt="Pricing workflow: model assumptions, numerical calculation, checks and interpretation.">

### My contribution

In the stochastic modelling project, I wrote the code and report for an Asian call option and for fitting a Bates model using the Lewis pricing method. I used parameters from a teammate's Heston fit for the Asian option.

- **Simulation:** Priced the Asian option with 500,000 simulated paths, tracking daily prices and calculating the payoff from their average.
- **Numerical checks:** Reported sampling uncertainty, examined estimates as the sample grew, and compared a European payoff from the same simulation with a separate Fourier pricing method.
- **Model fitting:** Fitted a Bates model to ten supplied call and put quotes, with parameter constraints and tables showing the remaining pricing errors.

In the derivative pricing project, I was Team Member C. I checked pricing relationships, compared American and European options, and examined prices and implied volatility across seven strikes under Heston and Merton models.

The notebook I contributed also contains American- and Asian-option hedging examples. These track the shares held, interest, cash movements and final settlement. The American-option example handles early exercise; the Asian-option example carries the running price total as part of its state. These later tasks were shared group work.

### What the checks showed

The saved simulation results include a European-price cross-check that falls within the estimated sampling interval. The saved American-option hedge checks also settle close to numerical precision within the same binomial model.

One useful distinction arose in the model comparisons: rescaling simulated prices to match the theoretical forward price forces put-call parity to hold. I kept the raw discrepancies alongside the adjusted results. Passing a relationship enforced by construction does not independently establish that a model is correct.

### What I learned

The accounting around a calculation matters as much as the formula: when an option can exercise, which prices enter an average, when cash earns interest, and which assumptions a check actually tests.

This work complements my production backend experience. Both require explicit state, clear contracts and checks that can expose a wrong answer rather than merely reproduce it.

### Scope and collaborators

These were academic group projects, rather than production pricing systems or live trading strategies. Simulation intervals describe sampling uncertainty; they do not include every source of modelling or numerical error. A small hedge residual inside a model does not establish real-market performance.

I worked with **Sacheen Shrestha and Adam Darmanin** on stochastic modelling, and **Barnabas Novak and Saurabh Pathak** on derivative pricing. The contributions described above distinguish my assigned work from the shared tasks.

[Related project: financial time-series analysis]({{ '/projects/financial-time-series/' | relative_url }})
