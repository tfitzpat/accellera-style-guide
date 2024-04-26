---
style: annex
---

# Annex B **(informative)** Glossary
{:.page-break-before}

This glossary contains brief, informal descriptions for a number of terms and phrases used in this standard. Where appropriate, the complete, formal definition of each term or phrase is given in themain body of the standard. Each glossary entry contains either the clause number of the definition in the main body of the standard.

**automatic broker**: The *broker* that has responsibility for the current module hierarchy, obtained by calling **`cci_get_broker`**. This will be the *broker* registered at, or most closely above, the current module hierarchy and will be the *global broker* in the event that no *local brokers* have been registered. *Parameters* are registered with the *automatic broker* at the time of their creation, unless explicitly overridden. The *automatic broker* is sometimes referred to as the “responsible” broker. (See [5.6.2.2](05.html#5622-construction))

**broker**: An object that aggregates *parameters*, providing container behaviors such as finding and enumerating, as well as managing preset values for *parameters*. A *global broker* is requisite; additional *local brokers* may be instantiated, e.g. to confine *parameters* to a sub-assembly. (See [5.7](05.html#57-brokers))

**broker handle**: An object that acts as a proxy to a *broker implementation* while relaying an *originator* representing the *handle* owner. (See [5.7.1](05.html#571-cci_broker_handle))

**broker manager**: A private singleton class accessed via global functions to register brokers, using **`cci_register_broker`**, and retrieve the currently responsible broker, using **`cci_get_broker`**. (See [5.7.2](05.html#572-cci_broker_manager))

**callback**: A function registered to be invoked when a particular action happens. Both *brokers* and *parameters* support *callbacks* to
enable custom processing of actions of interest, such as the creation of a new *parameter* or accessing a *parameter value*. (See [5.4.3.6](05.html#5436-broker-callbacks) for *broker callbacks* and [5.4.2.8](05.html#5428-callbacks) for *parameter callbacks*)

**callback handle**: An object that is returned from successfully registering a *callback* function; it is used as an identifier to
subsequently unregister that *callback* function. (See [5.4.2.8](05.html#5428-callbacks))

**global broker**: This *broker* must be registered before any *parameters* are constructed and it has responsibility (1) outside of the module hierarchy and (2) for all module hierarchies that have no registered *local broker*. A *global broker handle* is obtained outside the module hierarchy by calling **`cci_get_global_broker`** within the module hierarchy, it is returned by **`cci_get_broker`** when appropriate. (See [5.7](05.html#57-brokers))

**local broker**: A *broker* explicitly registered at a specific level in the module hierarchy, becoming the *automatic broker* for that module and submodules below it that don’t register a *local broker* themselves. (See [5.7](05.html#57-brokers))

**originator**: An object used to identify the source of *parameter value* and *preset value* changes. Originators are embedded within *handles* allowing source identification to be provided in a largely implicit manner. (See [5.4.1](05.html#541-cci-originator))

**parameter**: An object representing a named configuration *value* of a specific compile-time type. *Parameters* are typically created
within modules from which their name is derived, managed by brokers, and accessed externally via *parameter handles*. (See [5.6](05.html#56-parameters))

**(parameter) default value**: The *value* provided as an argument to the *parameter*’s constructor. This *value* is supplanted by the
preset value, when present. (See [5.4.2.3](05.html#5423-value-origin))

**parameter handle**: An object that acts as a proxy to a *parameter* while relaying an *originator* representing the *handle* 
owner. *Parameter handles* can be either *untyped* (See [5.6.3](05.html#563-cci-param-untyped-handle)) or *typed* (See [5.6.4](05.html#564-cci-param-typed-handle)).

**parameter value**: The current *value* of the *parameter*, accessible in either an *untyped* or *typed* manner. (See [5.4.2.1](05.html#5421-value-and-data-type))

**(parameter) value origin**: The *originator* that most recently set the *parameter*’s value. (See [5.4.2.3](05.html#5423-value-origin))

**(parameter) preset value**: A *value* used to initialize the *parameter*, overriding its default value. Preset values are supplied to the appropriate *broker* prior to constructing or resetting the *parameter*. (See [5.4.3.4](05.html#5434-parameter-initialization)).

**(parameter) underlying data type**: The specific compile-time type supplied as a template instantiation argument in the *parameter*’s declaration. Syntactically, this is referenced as the *parameter*’s **`value_type`**. (See [5.6.2.1](05.html#5621-value-type))

**typed (parameter access)**: Using interfaces based on the *parameter*’s *underlying data type* to access a *parameter value*. (See [5.6.2](05.html#562-cci-param-typed))

**untyped (parameter access)**: Using interfaces based on **`cci_value`** to access a *parameter value*. (See [5.6.1](05.html#561-cci_param_untyped))
