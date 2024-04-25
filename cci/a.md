---
style: annex
---

# Annex A **(informative)** A Introduction to SystemC Configuration
{:.page-break-before}

This clause is informative and is intended to aid the reader in the understanding of the structure and intent of the SystemC Configuration
standard. The SystemC Configuration API is entirely within namespace **cci**. Code fragments illustrating this document have an implicit
using namespace **cci** for brevity.

1.  ### *Sample code*

    1.  #### Basic parameter use

Defining a *parameter* and treating it like a variable:

**cci_param**&lt;int&gt; p("param", 17, "Demonstration parameter"); p
= p + 1;

sc_assert( p == 18 );

#### A.0.0.1.0.1.0.1.0.1.0.1.0.1.0.1.0.1.0.1.0.1.0.1.0.1.0.1.0.1.0.1.0.1.0.1.0.1.0.1.0.1.0.1.0.1.0.1.0.1.0.1.0.1.0.1.0.1.0.1.0.1.0.1.0.1.0.1.0.1.0.1.0.1.0.1 Parameter handles

Retrieving a *parameter* by name and safely using the *handle*:

**cci_broker_handle** broker(**cci_get_broker**()); auto p = new
**cci_param**&lt;int&gt;("p", 17); string name = p-&gt;**name**();

// Getting handle as wrong type fails

**cci_param_typed_handle**&lt;double&gt; hBad =
broker.**get_param_handle**(name); sc_assert( !hBad.**is_valid**()
);

// Getting handle as right type succeeds
**cci_param_typed_handle**&lt;int&gt; hGood =
broker.**get_param_handle**(name); sc_assert( hGood.**is_valid**()
);

// Operations upon handle affect original parameter hGood = 9;

sc_assert(\*p == 9);

// Destroying parameter invalidates handle delete p;

sc_assert( !hGood.**is_valid**() );

#### A.0.0.2.0.2.0.2.0.2.0.2.0.2.0.2.0.2.0.2.0.2.0.2.0.2.0.2.0.2.0.2.0.2.0.2.0.2.0.2.0.2.0.2.0.2.0.2.0.2.0.2.0.2.0.2.0.2.0.2.0.2.0.2.0.2.0.2.0.2.0.2.0.2.0.2 Enumerating parameters

Listing all *parameter* names and *values* registered with the
*automatic broker*:

auto broker(**cci_get_broker**());

for(auto p : broker.**get_param_handles**()) {

std::cout &lt;&lt; p.**name**() &lt;&lt; "=" &lt;&lt;
p.**get_cci_value**() &lt;&lt; std::endl;

}

#### A.0.0.3.0.3.0.3.0.3.0.3.0.3.0.3.0.3.0.3.0.3.0.3.0.3.0.3.0.3.0.3.0.3.0.3.0.3.0.3.0.3.0.3.0.3.0.3.0.3.0.3.0.3.0.3.0.3.0.3.0.3.0.3.0.3.0.3.0.3.0.3.0.3.0.3 Preset and default parameter values

Setting a *preset value* through the *broker* overrides the *default
value* provided as a constructor argument:

auto broker(**cci_get_broker**());
broker.**set_preset_cci_value**("module.sip",
cci::**cci_value**(7)); auto sip = **cci_param**&lt;int&gt;("sip",
42);

sc_assert( sip == 7 );

sc_assert( sip.**is_preset_value**() &&
!sip.**is_default_value**() );

#### A.0.0.4.0.4.0.4.0.4.0.4.0.4.0.4.0.4.0.4.0.4.0.4.0.4.0.4.0.4.0.4.0.4.0.4.0.4.0.4.0.4.0.4.0.4.0.4.0.4.0.4.0.4.0.4.0.4.0.4.0.4.0.4.0.4.0.4.0.4.0.4.0.4.0.4 Linking parameters with callbacks

Uses a *callback* function to set *parameter* “triple” to three times
the value of some other modified *parameter*:

void set_triple_callback(const
**cci_param_write_event**&lt;int&gt;& ev) { auto
broker(**cci_get_broker**());

**cci_param_typed_handle**&lt;double&gt; h =
broker.**get_param_handle**("m.triple"); h = 3 \*
**cci_param_typed_handle**&lt;int&gt;(ev.param_handle);

}

void test() {

**cci_param**&lt;int&gt; p("p", 0);

**cci_param**&lt;double&gt; triple("triple", 0);
p.**register_post_write_callback**(set_triple_callback); p = 7;

sc_assert(triple == 21);

}

### A.0.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1 *Interface classes*

The interface classes are described in detail in the main document
body; what follows here is a description of the relationships of some
major classes, providing a conceptual model for locating
functionality.

#### A.0.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1 cci_value

Variant data types are provided by the **cci_value** hierarchy
(depicted in [<span class="underline"Figure 2</span](#cci_param)).
The encapsulated type *may* be:

-   one of the directly supported standard data types: bool, int,
    unsigned int, sc_dt::int64, sc_dt::uint64, double, or
    std::string

-   a user-defined type such as a struct, where an application provides
    the definition for the converter

**cci_value_converter**&lt; *type* &gt;

-   a list of **cci_value** objects (**cci_value_list**)

-   a string-keyed map of **cci_value** objects (**cci_value_map**)

Accessors such as **get_int64** retrieve the value, verifying that
the type matches or trivially coerces to the accessor type. For
example:

**cci_value** vi(-7);

auto i32 = vi.**get_int**(); // succeeds auto i64 =
vi.**get_int64**(); // succeeds auto d = vi.**get_double**(); //
succeeds

auto u64 = vi.**get_uint64**(); // reports **CCI_VALUE_FAILURE**
error

Standard and user-defined types are set by initialization (initially
through the constructor, subsequently through a setter function).
**set_list** and **set_map** return adapter objects
(**cci_value**::**list_reference** and
**cci_value**::**map_reference** respectively) providing appropriate
container methods:

**cci_value** val;

**cci_value**::**map_reference** vm(val.**set_map**());
vm.push_entry("width", 7.3); vm.push_entry("label", “Stride”);
optionClass defaultOptions; vm.push_entry("options", defaultOptions);

Containers can be nested:

**cci_value_map** options;

**cci_value_list** enabledBits;
enabledBits.push_back(0).push_back(3); // b01001
options.push_entry(“widget0_flags”, enabledBits);
enabledBits.pop_back(); // b00001

enabledBits.push_back(4); // b10001
options.push_entry(“widget1_flags”, enabledBits);

To make the interfaces more granular each of the **cci_value**
sub-hierarchies has _cref classes with accessor methods and _ref
classes with modifier methods.

#### A.0.1.2.1.2.1.2.1.2.1.2.1.2.1.2.1.2.1.2.1.2.1.2.1.2.1.2.1.2.1.2.1.2.1.2.1.2.1.2.1.2.1.2.1.2.1.2.1.2.1.2.1.2.1.2.1.2.1.2.1.2.1.2.1.2.1.2.1.2.1.2.1.2.1.2 cci_param

##### A.0.1.2.1.1.2.1.1.2.1.1.2.1.1.2.1.1.2.1.1.2.1.1.2.1.1.2.1.1.2.1.1.2.1.1.2.1.1.2.1.1.2.1.1.2.1.1.2.1.1.2.1.1.2.1.1.2.1.1.2.1.1.2.1.1.2.1.1.2.1.1.2.1.1.2.1.1.2.1.1.2.1.1.2.1.1.2.1.1.2.1.1.2.1.1.2.1.1.2.1.1.2.1.1.2.1.1.2.1.1.2.1 ![](./media/media/image5.png)Figure 2 - cci_value hierarchy

*Parameter* functionality is implemented by the small hierarchy shown
in [Figure 3.](#figure-3---cci_param-hierarchy) The final class,
**cci_param_typed**, is parameterized by both data type T and
mutability TM (with mutability defaulted to mutable) and is
instantiated with both a name and a *default value* to create the
*parameter* and add it to a *broker*:

-   The final *parameter* name may include the hosting object name and a
    suffix to make it unique.

-   If no *broker* is specified then the *broker* associated with the
    current context is used.

-   ![](./media/media/image6.png)A description and *originator* may
    optionally be given.

##### A.0.1.2.2.1.2.2.1.2.2.1.2.2.1.2.2.1.2.2.1.2.2.1.2.2.1.2.2.1.2.2.1.2.2.1.2.2.1.2.2.1.2.2.1.2.2.1.2.2.1.2.2.1.2.2.1.2.2.1.2.2.1.2.2.1.2.2.1.2.2.1.2.2.1.2.2.1.2.2.1.2.2.1.2.2.1.2.2.1.2.2.1.2.2.1.2.2.1.2.2.1.2.2.1.2.2.1.2.2.1.2.2 ![](./media/media/image6.png)Figure 3 - cci_param hierarchy

The base class **cci_param_untyped** and the interface class
**cci_param_if** provide most of the functionality free of concrete
type and so are suitable for library interfaces.

For brevity **cci_param**&lt;T, TM&gt; is an alias for
**cci_param_typed**&lt;T, TM&gt;, as seen in the above code samples.

#### A.0.1.3.1.3.1.3.1.3.1.3.1.3.1.3.1.3.1.3.1.3.1.3.1.3.1.3.1.3.1.3.1.3.1.3.1.3.1.3.1.3.1.3.1.3.1.3.1.3.1.3.1.3.1.3.1.3.1.3.1.3.1.3.1.3.1.3.1.3.1.3.1.3.1.3 cci_param_handle

*Parameter handles* provide a safe reference to *parameters*: safety
is ensured by asserting the validity of the *handle* upon all
operations and invalidating *handles* when their *parameter* is
destroyed. Using an invalid *handle* results in an SC_ERROR report.
As with *parameters* both *untyped* and *typed handles* exist:
*untyped handles* are returned from *parameter* lookups and
*callbacks* and *typed handles* provide direct access to the *typed
parameter value* and are safely constructible from the *untyped
handle*:

![](./media/media/image5.png)**cci_param_typed_handle**&lt;int&gt;
val(broker.**get_param_handle**("mode")); if(val != DEFAULT_MODE) {
... }

##### A.0.1.3.1.1.3.1.1.3.1.1.3.1.1.3.1.1.3.1.1.3.1.1.3.1.1.3.1.1.3.1.1.3.1.1.3.1.1.3.1.1.3.1.1.3.1.1.3.1.1.3.1.1.3.1.1.3.1.1.3.1.1.3.1.1.3.1.1.3.1.1.3.1.1.3.1.1.3.1.1.3.1.1.3.1.1.3.1.1.3.1.1.3.1.1.3.1.1.3.1.1.3.1.1.3.1.1.3.1.1.3.1 Figure 4 - cci_param_handle hierarchy

For convenience **cci_param_handle** is an aliased for
**cci_param_untyped handle**.

### A.0.2.2.2.2.2.2.2.2.2.2.2.2.2.2.2.2.2.2.2.2.2.2.2.2.2.2.2.2.2.2.2.2.2.2.2.2.2 *Error reporting*

Errors are reported through the sc_report_handler::report mechanism
with severity SC_ERROR and the message type prefixed with <span
class="underline"</spanCCI_SC_REPORT_MSG_TYPE_PREFIX
(currently "/Accellera/CCI/"). A convenience function
**cci_report_handler**::**get_param_failure** decodes common CCI
error messages as the **cci_param_failure** enum.

Annex B Glossary
================

(Informative)

This glossary contains brief, informal descriptions for a number of
terms and phrases used in this standard. Where appropriate, the
complete, formal definition of each term or phrase is given in the
main body of the standard. Each glossary entry contains either the
clause number of the definition in the main body of the standard.

**automatic broker**: The *broker* that has responsibility for the
current module hierarchy, obtained by calling **cci_get_broker**.
This will be the *broker* registered at, or most closely above, the
current module hierarchy and will be the *global broker* in the event
that no *local brokers* have been registered. *Parameters* are
registered with the *automatic broker* at the time of their creation,
unless explicitly overridden. The *automatic broker* is sometimes
referred to as the “responsible” broker. (See [<span
class="underline"5.6.2.2</span](#construction-1))

**broker**: An object that aggregates *parameters*, providing
container behaviors such as finding and enumerating, as well as
managing preset values for *parameters*. A *global broker* is
requisite; additional *local brokers* may be instantiated, e.g. to
confine *parameters* to a sub-assembly. (See [<span
class="underline"5.7</span](#brokers))

**broker handle**: An object that acts as a proxy to a *broker
implementation* while relaying an *originator* representing the
*handle* owner. (See [<span
class="underline"5.7.1</span](#cci_broker_handle))

**broker manager**: A private singleton class accessed via global
functions to register brokers, using

**cci_register_broker**, and retrieve the currently responsible
broker, using **cci_get_broker**. (See [<span
class="underline"5.7.2</span](#cci_broker_manager))

**callback**: A function registered to be invoked when a particular
action happens. Both *brokers* and *parameters* support *callbacks* to
enable custom processing of actions of interest, such as the creation
of a new *parameter* or accessing a *parameter value*. (See [<span
class="underline"5.4.3.6</span](#broker-callbacks) for *broker
callbacks* and [<span class="underline"5.4.2.8</span](#callbacks)
for *parameter callbacks*)

**callback handle**: An object that is returned from successfully
registering a *callback* function; it is used as an identifier to
subsequently unregister that *callback* function. (See [<span
class="underline"5.4.2.8</span](#callbacks))

**global broker**: This *broker* must be registered before any
*parameters* are constructed and it has responsibility (1) outside of
the module hierarchy and (2) for all module hierarchies that have no
registered *local broker*. A *global broker handle* is obtained
outside the module hierarchy by calling **cci_get_global_broker**
within the module hierarchy, it is returned by **cci_get_broker**
when appropriate. (See [<span class="underline"5.7</span](#brokers))

**local broker**: A *broker* explicitly registered at a specific level
in the module hierarchy, becoming the *automatic broker*

for that module and submodules below it that don’t register a *local
broker* themselves. (See [<span
class="underline"5.7</span](#brokers))

**originator**: An object used to identify the source of *parameter
value* and *preset value* changes. Originators are embedded within
*handles* allowing source identification to be provided in a largely
implicit manner. (See [<span
class="underline"5.4.1</span](#cci_originator))

**parameter**: An object representing a named configuration *value* of
a specific compile-time type. *Parameters* are typically created
within modules from which their name is derived, managed by brokers,
and accessed externally via *parameter handles*. (See [<span
class="underline"5.6</span](#_bookmark56))

**(parameter) default value**: The *value* provided as an argument to
the *parameter*’s constructor. This *value* is supplanted by the
preset value, when present. (See [<span
class="underline"5.4.2.3</span](#value-origin))

**parameter handle**: An object that acts as a proxy to a *parameter*
while relaying an *originator* representing the *handle*

owner. *Parameter handles* can be either *untyped* (See [<span
class="underline"5.6.3</span](#cci_param_untyped_handle)) or *typed*
(See [<span class="underline"5.6.4</span](#_bookmark64)).

**parameter value**: The current *value* of the *parameter*,
accessible in either an *untyped* or *typed* manner. (See [<span
class="underline"5.4.2.1</span](#value-and-data-type))

**(parameter) value origin**: The *originator* that most recently set
the *parameter*’s value. (See [<span
class="underline"5.4.2.3</span](#value-origin))

**(parameter) preset value**: A *value* used to initialize the
*parameter*, overriding its default value. Preset values are supplied
to the appropriate *broker* prior to constructing or resetting the
*parameter*. (See [<span
class="underline"5.4.3.4</span](#_bookmark48)).

**(parameter) underlying data type**: The specific compile-time type
supplied as a template instantiation argument in the *parameter*’s
declaration. Syntactically, this is referenced as the *parameter*’s
**value_type**. (See [<span
class="underline"5.6.2.1</span](#value_type))

**typed (parameter access)**: Using interfaces based on the
*parameter*’s *underlying data type* to access a *parameter value*.
(See [<span class="underline"5.6.2</span](#cci_param_typed))

**untyped (parameter access)**: Using interfaces based on
**cci_value** to access a *parameter value*. (See [<span
class="underline"5.6.1</span](#cci_param_untyped))

Annex C SystemC Configuration modeler guidelines
================================================

(Informative)

The following guidelines are provided to help ensure proper and most
effective use of this standard.

1.  ***Declare parameter instances as protected or private members***

Making *parameters* non-public ensures they are accessed via a
*handle* provided by a broker, adhering to any *broker*

access policies and properly tracking *originator* information.

### A.0.3.3.3.3.3.3.3.3.3.3.3.3.3.3.3.3.3.3.3.3.3.3.3.3.3.3.3.3.3.3.3.3.3.3.3.3.3 *Initialize broker handles during module elaboration*

*Broker handles should* be obtained, and stored for later use, during
elaboration when the well-defined current module can be used to
accurately determine implicit *originator* information.

### A.0.4.4.4.4.4.4.4.4.4.4.4.4.4.4.4.4.4.4.4.4.4.4.4.4.4.4.4.4.4.4.4.4.4.4.4.4.4 *Prefer typed parameter value access over untyped, when possible, for speed*

When a *parameter*’s *underlying data type* is known, access via the
*typed handle* is preferred over the *untyped handle*

since it avoids the overhead associated with **cci_value**
conversions.

### A.0.5.5.5.5.5.5.5.5.5.5.5.5.5.5.5.5.5.5.5.5.5.5.5.5.5.5.5.5.5.5.5.5.5.5.5.5.5 *Provide parameter descriptions*

Providing a description of *parameters*, which can only be done during
*parameter* construction, is recommended when the *parameter*’s
purpose and meaning are not entirely clear from the name. Tools can
relay descriptions to users to give insights about *parameters*.

Annex D Enabling user-defined parameter value types
===================================================

To be able to instantiate a **cci_param_typed** with some
user-defined type "VT", that type must provide these features:

-   default constructor: VT() (DefaultConstructible in C++ concept
    terminology)

-   copy constructor: VT(const VT&) (CopyConstructible)

-   value type assignment operator: operator=(const VT&)
    (CopyAssignable)

-   value type equality operator: operator==(const VT&)
    (EqualityComparable)

-   **cci_value_converter**&lt;value type&gt; defined

The following example takes a small class custom_type, the pairing of
an integer and string, and enables use such as:

Emphasized in italics below is the added support code.

There is no explicit stability requirement for the packing and
unpacking operations; for example it is not required that:

and for some data types such as floating point it may not be
practicable, nor desirable to encourage thinking of equality as a
useful concept when comparing types. However in general such behavior
may astonish users, so stability may be a sensible default goal.

Index
=====

A
-

add_metadata, 16

add_param, 26

add_param_failed, 51

add_param_handle, 20

application, 4

B
-

broker, 49

C
-

**callbacks broker**, 25

**parameter**, 17

category, 29

CCI_ABSOLUTE_NAME, 11

CCI_ADD_PARAM_FAILURE, 50

CCI_ANY_FAILURE, 50

CCI_BOOL_PARAM, 11

CCI_BOOL_VALUE, 26

**cci_broker_handle**, 47

**cci_broker_if**, 20

**cci_broker_manager**, 49

cci_configuration, 10

cci_gen_unique_name, 51

cci_get_name, 52

CCI_GET_PARAM_FAILURE, 50

cci_handle_exception, 51

CCI_IMMUTABLE_PARAM, 10

CCI_INTEGRAL_PARAM, 11

CCI_INTEGRAL_VALUE, 26

CCI_LIST_PARAM, 11

CCI_LIST_VALUE, 26

CCI_MUTABLE_PARAM, 10

**cci_name_type**, 11

CCI_NOT_FAILURE, 50

CCI_NULL_VALUE, 26

**cci_originator**, 11

CCI_OTHER_MUTABILITY, 10

CCI_OTHER_PARAM, 11

CCI_OTHER_VALUE, 26

cci_param, 37

cci_param_callback_if, 13

**cci_param_data_category**, 11

cci_param_failure, 50

**cci_param_if**, 13

**cci_param_mutable_type**, 10

**cci_param_typed**, 37

**cci_param_typed_handle**, 44

**cci_param_untyped**, 36

**cci_param_untyped_handle**, 41

**cci_param_write_event**, 46

CCI_REAL_PARAM, 11

CCI_REAL_VALUE, 26

CCI_RELATIVE_NAME, 11

CCI_REMOVE_PARAM_FAILURE, 50

cci_report_handler, 50

CCI_SET_PARAM_FAILURE, 50

CCI_STRING_PARAM, 11

CCI_STRING_VALUE, 26

CCI_UNDEFINED_FAILURE, 50

cci_unregister_name, 52

**cci_value**, 26

**cci_value_category**, 26

cci_value_failure, 51

CCI_VALUE_FAILURE, 50

**cci_value_list**, 32

**cci_value_map**, 34

consuming_broker, 49

create_broker_handle, 24

create_param_handle, 20

D
-

decode_param_failure, 51

E
-

empty

cci_value_list, 33

equals, 17

F
-

from_json, 32

G
-

get, 31

get_bool, 30

get_cci_value, 14

cci_broker_if, 22

get_data_category, 14

get_default_cci_value, 14

get_default_value, 40

get_description, 16

get_double, 30

get_int, 30

get_int64, 30

get_list, 31

get_map, 31

get_metadata, 16

get_mutable_type, 17

get_number, 30

get_object, 12

get_originator cci_param_if, 15

cci_param_untyped_handle, 44

get_param_failed, 51

get_param_handle, 22

get_param_handles, 22

get_preset_cci_value, 23

get_preset_value_origin, 23

get_raw_default_value, 15

get_raw_value, 15, 40

get_string, 31

get_type_info, 14

get_uint, 30

get_uint64, 30

get_unconsumed_preset_values, 24

get_value, 39

get_value_origin, 15

cci_broker_if, 22

global broker, 47 global variables

parameters (prohibited), 39

H
-

has_callbacks cci_broker_if, 25

cci_param_if, 20

has_preset_value, 23

I
-

ignore_unconsumed_preset_values, 24

implementation, 4

invalidate, 43

is_bool, 29

is_default_value, 15

is_double, 29

is_global_broker, 22

is_int, 29

is_int64, 29

is_list, 30

is_locked, 17

is_map, 30

is_null, 29

is_number, 29

is_preset_value, 15

is_same, 32

is_string, 29

is_uint, 29

is_uint64, 29

is_unknown, 12

is_valid

cci_param_untyped_handle, 43

L
-

local brokers, 47

lock, 17

lock_preset_value, 23

M
-

move, 29

N
-

name

cci_broker_if, 22

cci_orginator, 12

cci_param_if, 16

O
-

operator&lt; cci_originator, 13

operator= cci_originator, 12

cci_param_typed, 40

cci_param_typed_handle, 45

cci_param_untyped_handle, 43

operator== cci_originator, 13

R
-

register_create_callback, 25

register_destroy_callback, 25

register_post_read_callback, 18

register_post_write_callback, 18

register_pre_read_callback, 18, 41

register_pre_write_callback, 18

remove_param, 26

remove_param_failed, 51

remove_param_handle, 20

reset, 14

S
-

set, 32

set_bool, 32

set_cci_value, 14

set_description, 16

set_double, 32

set_int, 32

set_int64, 32

set_list, 32

set_map, 32

set_null, 32

set_param_failed, 51

set_preset_cci_value, 23

set_raw_value, 15, 40

set_string, 32

set_uint, 32

set_uint64, 32

set_value, 40

swap, 29

cci_originator, 12

T
-

to_json, 32

try_get, 31

try_set, 32

U
-

unlock, 17

unregister_all_callbacks cci_broker_if, 25

cci_param_if, 20

unregister_create_callback, 25

unregister_destroy_callback, 25

unregister_pre_read_callback, 19

unregister_pre_write_callback, 19
