---
style: annex
---

# Annex C **(informative)** SystemC Configuration modeler guidelines

The following guidelines are provided to help ensure proper and most
effective use of this standard.

## C.1 Declare parameter instances as protected or private members

Making *parameters* non-`public` ensures they are accessed via a *handle* provided by a broker, adhering to any *broker* access policies and properly tracking *originator* information.

## C.2 Initialize broker handles during module elaboration

*Broker handles should* be obtained, and stored for later use, during elaboration when the well-defined current module can be used to
accurately determine implicit *originator* information.

## C.3 Prefer typed parameter value access over untyped, when possible, for speed

When a *parameter*’s *underlying data type* is known, access via the *typed handle* is preferred over the *untyped handle* since it avoids the overhead associated with **`cci_value`** conversions.

## C.4 Provide parameter descriptions

Providing a description of *parameters*, which can only be done during *parameter* construction, is recommended when the *parameter*’s purpose and meaning are not entirely clear from the name. Tools can relay descriptions to users to give insights about *parameters*.
