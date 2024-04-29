---
style: frontmatter
---

# Introduction

| This introduction is informative and not part of the SystemC CCI standard

This document defines the SystemC Configuration, Control and Inspection standard as a collection of C++ Application Programming
Interfaces (APIs) layered on top of the SystemC language standard; familiarity with the existing ISO C++ and IEEE 1666 SystemC standards
is presumed.

SystemC Configuration represents phase one of the Configuration, Control and Inspection (CCI) standards for model- to-tool
interoperability. The primary use case is configuring variable properties of the structure and behavior of a model. This standard
facilitates consistent configurability of SystemC models from different providers and promotes a consistent user experience across
compliant tools.

Stakeholders in SystemC Configuration include suppliers of electronic components and systems using SystemC to develop configurable models of their intellectual property, and Electronic Design Automation (EDA) companies that implement SystemC Configuration class libraries and
supporting tools.

This standard is not intended to serve as a user’s guide or provide an introduction to SystemC Configuration. Readers requiring a SystemC
Configuration tutorial or information on its intended use should consult the Accellera Systems Initiative web site 
(<https://www.accellera.org/>).

# Acknowledgments

The SystemC CCI Working Group would like to express gratitude to the following organizations for their extraordinary contributions to
development of the Configuration standard:
- **GreenSocs**, for contributing a complete Configuration solution which served as a concrete reference in defining the standard and also as a foundation for the reference implementation.
- **Ericsson**, for funding resources to fully develop the SystemC Configuration reference implementation.
