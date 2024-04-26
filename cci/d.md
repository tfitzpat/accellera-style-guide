---
style: annex
---

# Annex D **(informative)** Enabling user-defined parameter value types
{:.page-break-before}

To be able to instantiate a **`cci_param_typed`** with some user-defined type `VT`, that type must provide these features:

 - default constructor: `VT()` (DefaultConstructible in C++ concept terminology).

 - copy constructor: `VT(const VT&`) (CopyConstructible).

 - value type assignment operator: `operator=(const VT&)` (CopyAssignable)

 - value type equality operator: `operator==(const VT&)` (EqualityComparable)

 - **`cci_value_converter`**`<value type>` defined.

The following example takes a small class `custom_type`, the pairing of an integer and string, and enables use such as:

```
custom_type ct1( 3, "foo" );
cci_param<custom_type> pct( "p1", ct1 );
custom_type ct2 = pct;
```

Emphasized in italics below is the added support code.

```
class custom_type
{
 private:
  int val_;
  string name_;
  friend class cci_value_converter< custom_type >;

 public:
  custom_type()
  : val_(0) {}
  custom_type( int val, const char* name )
  : val_(val), name_(name) {}
  bool operator==( const custom_type& rhs ) const
  {
    return val_ == rhs.val_ && name_ == rhs.name_;
  }
};

template<>
struct cci_value_converter< custom_type >
{
  typedef custom_type type;
  static bool pack( cci_value::reference dst, type const& src )
  {
    dst.set_map()
      .push_entry( "val", src.val_ )
      .push_entry( "name", src.name_ );
    return true;
  }

  static bool unpack( type& dst, cci_value::const_reference src )
  {
    // Highly defensive unpacker; probably could check less
    assert( src.is_map() );
    cci_value::const_map_reference m = src.get_map();
    return m.has_entry( "val" )
      && m.has_entry( "name" )
      && m.at( "val" ).try_get( dst.val_ )
      && m.at( "name" ).try_get( dst.name_ );
  }
};
```

There is no explicit stability requirement for the packing and unpacking operations; for example it is not required that:

```
T x;
cci_value vX( x );
T y = vX.get<T>();
sc_assert( x == y );

and for some data types such as floating point it may not be practicable, nor desirable to encourage thinking of equality as a
useful concept when comparing types. However in general such behavior may astonish users, so stability may be a sensible default goal.
