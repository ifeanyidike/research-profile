---
layout: page
title: "Couette-Poiseuille Reactive Fluid Flow with Variable Thermophysical Properties"
description: Applied mathematics research on modeling reactive fluid flow with variable viscosity and thermal conductivity using coupled nonlinear PDEs, perturbation methods, and finite difference numerics.
importance: 6
category: Research
related_publications: false
---

**Institution:** Federal University of Technology Akure &nbsp;·&nbsp; **Year:** 2018 &nbsp;·&nbsp; **[View PDF](https://drive.google.com/file/d/1HDzLk4WE9xv4sC5gxzviWx9snAWFaYSt/view?usp=sharing)**

---

### Overview

This undergraduate thesis investigated Couette-Poiseuille flow — the combined pressure-driven and shear-driven flow between parallel plates — under reactive conditions with variable fluid properties (viscosity, thermal conductivity) that depend on temperature.

### Problem Formulation

Classical Couette-Poiseuille flow assumes constant fluid properties, which breaks down when the fluid undergoes exothermic chemical reactions that significantly alter local temperature and, consequently, local viscosity. The thesis formulated a coupled system of nonlinear PDEs governing:

- **Momentum equation:** with variable viscosity as a function of temperature
- **Energy equation:** including viscous dissipation and Arrhenius-type reaction term
- **Constitutive relations:** linking viscosity and thermal conductivity to temperature via exponential (Vogel-type) dependence

### Methods

- **Analytical approach:** Perturbation expansion for limiting cases (small reaction parameter, large activation energy)
- **Numerical approach:** Finite difference discretization with iterative solution of the coupled nonlinear system; convergence analysis and grid refinement
- **Stability analysis:** Examination of temperature runaway conditions (thermal explosion criterion)

### Significance

The variable-property reactive flow problem is relevant to polymer processing, combustion, and geophysical flows. The mathematical challenge — coupled nonlinear PDEs with temperature-dependent coefficients — develops core skills in applied analysis and scientific computing that underpin computational ML methods.

---

> **Connection to research:** Rigorous training in numerical analysis, coupled nonlinear systems, and applied PDE theory from this thesis informs how I approach ML research — particularly in areas that involve optimization landscapes, iterative algorithms, and understanding when learned models generalize vs. fail.
