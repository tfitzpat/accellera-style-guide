---
style: annex
---

# Annex A **(informative)** A Introduction to SystemC Configuration
{:.page-break-before}

This clause is informative and is intended to aid the reader in the understanding of the structure and intent of the SystemC Configuration
standard. The SystemC Configuration API is entirely within namespace **`cci`**. Code fragments illustrating this document have an implicit
using namespace **`cci`** for brevity.

## A.1 Sample code

### A.1.1 Basic parameter use

Defining a *parameter* and treating it like a variable:

```
cci_param<int> p("param", 17, "Demonstration parameter");
p = p + 1;
sc_assert( p == 18 );
```

### A.1.2 Parameter handles

Retrieving a *parameter* by name and safely using the *handle*:

```
cci_broker_handle broker(cci_get_broker());
auto p = new cci_param<int>("p", 17);
string name = p->name();

// Getting handle as wrong type fails
cci_param_typed_handle<double> hBad = broker.get_param_handle(name);
sc_assert( !hBad.is_valid() );

// Getting handle as right type succeeds
cci_param_typed_handle<int> hGood = broker.get_param_handle(name);
sc_assert( hGood.is_valid() );

// Operations upon handle affect original parameter
hGood = 9;
sc_assert(*p == 9);

// Destroying parameter invalidates handle
delete p;
sc_assert( !hGood.is_valid() );
```

### A.1.3 Enumerating parameters

Listing all *parameter* names and *values* registered with the *automatic broker*:

```
auto broker(cci_get_broker());
for(auto p : broker.get_param_handles()) {
std::cout << p.name() << "=" << p.get_cci_value() << std::endl;
}
```

### A.1.4 Preset and default parameter values

Setting a *preset value* through the *broker* overrides the *default value* provided as a constructor argument:

```
auto broker(cci_get_broker());
broker.set_preset_cci_value("module.sip", cci::cci_value(7));
auto sip = cci_param<int>("sip", 42);
sc_assert( sip == 7 );
sc_assert( sip.is_preset_value() && !sip.is_default_value() );
```

### A.1.5 Linking parameters with callbacks

Uses a *callback* function to set *parameter* “triple” to three times the value of some other modified *parameter*:

```
void set_triple_callback(const cci_param_write_event<int>& ev) {
  auto broker(cci_get_broker());
  cci_param_typed_handle<double> h = broker.get_param_handle("m.triple");
  h = 3 * cci_param_typed_handle<int>(ev.param_handle);
}

void test() {
  cci_param<int> p("p", 0);
  cci_param<double> triple("triple", 0);
  p.register_post_write_callback(set_triple_callback);
  p = 7;
  sc_assert(triple == 21);
}
```

## A.2  Interface classes

The interface classes are described in detail in the main document body; what follows here is a description of the relationships of some
major classes, providing a conceptual model for locating functionality.

### A.2.1 cci_value

Variant data types are provided by the **`cci_value`** hierarchy (depicted in [Figure A-1](#figure-a-1)). The encapsulated type *may* be:

 -  one of the directly supported standard data types: `bool`, `int`,
    `unsigned int`, `sc_dt::int64`, `sc_dt::uint64`, `double`, or
    `std::string`.

 -  a user-defined type such as a `struct`, where an application provides
    the definition for the converter **`cci_value_converter`**`< `*`type`*` >`

 -  a list of **`cci_value`** objects (**`cci_value_list`**).

 -  a string-keyed map of **`cci_value`** objects (**`cci_value_map`**).

Accessors such as **`get_int64`** retrieve the value, verifying that the type matches or trivially coerces to the accessor type. For
example:

```
cci_value vi(-7);
auto i32 = vi.get_int();    // succeeds
auto i64 = vi.get_int64();  // succeeds
auto d = vi.get_double();   // succeeds
auto u64 = vi.get_uint64(); // reports CCI_VALUE_FAILURE error
```

Standard and user-defined types are set by initialization (initially through the constructor, subsequently through a setter function).
**`set_list`** and **`set_map`** return adapter objects (**`cci_value::list_reference`** and **`cci_value::map_reference`** respectively) providing appropriate container methods:

```
cci_value val;
cci_value::map_reference vm(val.set_map());
vm.push_entry("width", 7.3);
vm.push_entry("label", “Stride”);
optionClass defaultOptions;
vm.push_entry("options", defaultOptions);
```

Containers can be nested:

```
cci_value_map options;
cci_value_list enabledBits;
enabledBits.push_back(0).push_back(3);  // b01001
options.push_entry(“widget0_flags”, enabledBits);
enabledBits.pop_back();                 // b00001
enabledBits.push_back(4);               // b10001
options.push_entry(“widget1_flags”, enabledBits);
```

To make the interfaces more granular each of the **`cci_value`** sub-hierarchies has `_cref` classes with accessor methods and `_ref`
classes with modifier methods.

{% include figure
   reference="Figure A-1"
   caption="cci_value hierarchy"
   alt-text=""
   class="fixed"
   images="figure2.png"
%}


### A.2.2  cci_param

*Parameter* functionality is implemented by the small hierarchy shown in [Figure A-2](#figure-a-2) The final class,**`cci_param_typed`**, is parameterized by both data type `T` and mutability TM (with mutability defaulted to mutable) and is instantiated with both a name and a *default value* to create the `*parameter* and add it to a *broker*:

 -  The final *parameter* name may include the hosting object name and a suffix to make it unique.

 -  If no *broker* is specified then the *broker* associated with the current context is used.

 -  A description and *originator* may optionally be given.

{% include figure
   reference="Figure A-2"
   caption="cci_param hierarchy"
   alt-text=""
   class="fixed"
   images="figure3.png"
   image-height="15"
%}

The base class **`cci_param_untyped`** and the interface class **`cci_param_if`** provide most of the functionality free of concrete type and so are suitable for library interfaces.

For brevity **`cci_param`**`<T, TM>` is an alias for **`cci_param_typed`**`<T, TM>`, as seen in the above code samples.

### A.2.3 cci_param_handle

*Parameter handles* provide a safe reference to *parameters*: safety is ensured by asserting the validity of the *handle* upon all operations and invalidating *handles* when their *parameter* is destroyed. Using an invalid *handle* results in an `SC_ERROR` report. As with *parameters* both *untyped* and *typed handles* exist: *untyped handles* are returned from *parameter* lookups and *callbacks* and *typed handles* provide direct access to the *typed parameter value* and are safely constructible from the *untyped handle*:

**`cci_param_typed_handle`**`<int>` `val(broker.`**`get_param_handle`**`("mode")); if(val != DEFAULT_MODE) { ... }`

{% include figure
   reference="Figure A-3"
   caption="cci_param_handle hierarchy"
   alt-text=""
   class="fixed"
   images="figure4.png"
   image-height="10"
%}

For convenience **`cci_param_handle`** is an aliased for **`cci_param_untyped handle`**.

## A.3 Error reporting

Errors are reported through the sc_report_handler::report mechanism with severity SC_ERROR and the message type prefixed with `__CCI_SC_REPORT_MSG_TYPE_PREFIX__` (currently "/Accellera/CCI/"). A convenience function **`cci_report_handler::get_param_failure`** decodes common CCI error messages as the **`cci_param_failure`** enum.
