---
layout: page
title: ETF Trend Prediction in Emerging Markets — Paper Reproduction
description: Reproduced Sagaceta-Mejía et al. (2024) using LASSO feature selection and MLP neural networks to predict ETF trends in Chile, Brazil, and U.S. equity markets. WQU MScFE coursework.
importance: 8
category: Research
related_publications: false
---

**Paper:** Sagaceta-Mejía et al., "An Intelligent Approach for Predicting Stock Market Movements in Emerging Markets Using Optimized Technical Indicators and Neural Networks," *Economics*, vol. 18, no. 1, De Gruyter, 2024. DOI: [10.1515/econ-2022-0073](https://doi.org/10.1515/econ-2022-0073) &nbsp;·&nbsp; [PDF](https://drive.google.com/file/d/17enWOcfe-Jka41dB1DwjBI1yIVZJeQk_/view?usp=sharing)

**Code:** [Google Colab](https://colab.research.google.com/drive/1LtQGECL0nT7TBeU2ksP2si1xvZ-6R2nT?usp=sharing) &nbsp;·&nbsp; [Report](https://drive.google.com/file/d/1zVwksgEXecqSOpKvr6z5dMfFt0zGfpLk/view?usp=sharing) &nbsp;·&nbsp; **Type:** Paper Reproduction &nbsp;·&nbsp; **Context:** WQU MScFE 600

---

### Overview

Reproduced and extended a 2024 *Economics* paper applying LASSO-regularized feature selection and MLP neural networks to predict daily trend direction (up/down) in equity ETFs. Targets: ECH (Chile), EWZ (Brazil) as emerging market proxies, and IVV (S&P 500) as a developed-market benchmark.

All Python implementation was done independently.

### Technical Approach

**Feature Engineering**
- Constructed 27 technical indicators across four categories: trend (SMA, EMA, MACD, ADX), momentum (RSI, Stochastic, Williams %R, ROC), volatility (Bollinger Bands, ATR, standard deviation), and volume (OBV, MFI)
- Expanded to 216 features via lag windows; binarized target as next-day trend direction

**Feature Selection — LASSO Variants**
- Compared 8 LASSO-family methods: standard LASSO, Ridge, Elastic Net, Adaptive LASSO, and group variants
- Evaluated feature stability across bootstrap samples using **Jaccard distance** (measures consistency of selected feature sets across resamples)
- **Selected(5)** (LASSO selecting 5 features) identified as optimal: lowest Jaccard distance (highest stability) with ~9–10 features retained

**Model**
- MLP classifier with k-fold cross-validation (k=10)
- Selected(5) achieved ~2% accuracy improvement over the full 216-feature baseline
- Reported per-ETF accuracy, precision, recall, F1; consistent gains in emerging market ETFs over developed market baseline

### Key Findings

- Emerging market ETFs (ECH, EWZ) showed stronger predictive signal from technical indicators than IVV — consistent with original paper's hypothesis about inefficiency in emerging markets
- Sparse feature selection (LASSO) generalizes better than full feature sets for daily trend classification
- Jaccard stability criterion provides a principled method for selecting among regularization variants

### Stack

`Python` · `scikit-learn` · `pandas` · `NumPy` · `Matplotlib` · `LASSO / Elastic Net` · `MLP Classifier` · `k-fold CV`

---

> **Connection to research:** This project develops fluency in the methodological toolkit common to empirical ML research — feature selection under high dimensionality, regularization as a model selection criterion, stability analysis, and benchmarking across data regimes. The emerging-market framing also connects to applied econometrics and alternative data themes in my MSc coursework.
