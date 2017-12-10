"use strict";
// Transcrypt'ed from Python, 2017-12-10 03:03:01
function A3TextAdventureSW () {
   var __symbols__ = ['__py3.6__', '__esv5__'];
    var __all__ = {};
    var __world__ = __all__;
    
    /* Nested module-object creator, part of the nesting may already exist and have attributes
    
    A Transcrypt applicaton consists of a main module and additional modules.
    Transcrypt modules constitute a unique, unambigous tree by their dotted names, no matter which of the alternative module root paths they come from.
    The main module is represented by a main function by the name of the application.
    The locals of this function constitute the outer namespace of the Transcrypt application.
    References to all local variables of this function are also assigned to attributes of local variable __all__, using the variable names as an attribute names.
    The main function returns this local variable __all__ (that inside the function is also known by the name __world__)
    Normally this function result is assigned to window.<application name>.
    The function may than be exited (unless its main line starts an ongoing activity), but the application namespace stays alive tby the reference that window has to it.
    In case of the ongoing activity including the script is enough to start it, in other cases it has to be started explicitly by calling window.<application name>.<a function>.
    There may be multiple such entrypoint functions.
    
    Additional modules are represented by objects rather than functions, nested into __world__ (so into __all__ of the main function).
    This nesting can be directly or indirectly, according to the dotted paths of the additional modules.
    One of the methods of the module object is the __init__ function, that's executed once at module initialisation time.
    
    The additional modues also have an __all__ variable, an attribute rather than a local variable.
    However this __all__ object is passed to the __init__ function, so becomes a local variable there.
    Variables in additional modules first become locals to the __init__ function but references to all of them are assigend to __all__ under their same names.
    This resembles the cause of affairs in the main function.
    However __world__ only referes to the __all__ of the main module, not of any additional modules.
    Importing a module boils down to adding all members of its __all__ to the local namespace, directly or via dotted access, depending on the way of import.
    
    In each local namespace of the module function (main function for main module, __init__ for additional modules) there's a variable __name__ holding the name of the module.
    Classes are created inside the static scope of a particular module, and at that (class creation) time their variable __module__ gets assigned a reference to __name__.
    This assignement is generated explicitly by the compiler, as the class creation function __new__ of the metaclass isn't in the static scope containing __name__.
    
    In case of
        import a
        import a.b
    a will have been created at the moment that a.b is imported,
    so all a.b. is allowed to do is an extra attribute in a, namely a reference to b,
    not recreate a, since that would destroy attributes previously present in a
    
    In case of
        import a.b
        import a
    a will have to be created at the moment that a.b is imported
    
    In general in a chain
        import a.b.c.d.e
    a, a.b, a.b.c and a.b.c.d have to exist before e is created, since a.b.c.d should hold a reference to e.
    Since this applies recursively, if e.g. c is already created, we can be sure a and a.b. will also be already created.
    
    So to be able to create e, we'll have to walk the chain a.b.c.d, starting with a.
    As soon as we encounter a module in the chain that isn't already there, we'll have to create the remainder (tail) of the chain.
    
    e.g.
        import a.b.c.d.e
        import a.b.c
    
    will generate
        var modules = {};
        __nest__ (a, 'b.c.d.e', __init__ (__world__.a.b.c.d.e));
        __nest__ (a, 'b.c', __init__ (__world__.a.b.c));
        
    The task of the __nest__ function is to start at the head object and then walk to the chain of objects behind it (tail),
    creating the ones that do not exist already, and insert the necessary module reference attributes into them.   
    */
    
    var __nest__ = function (headObject, tailNames, value) {    
        var current = headObject;
        // In some cases this will be <main function>.__all__,
        // which is the main module and is also known under the synonym <main function.__world__.
        // N.B. <main function> is the entry point of a Transcrypt application,
        // Carrying the same name as the application except the file name extension.
        
        if (tailNames != '') {  // Split on empty string doesn't give empty list
            // Find the last already created object in tailNames
            var tailChain = tailNames.split ('.');
            var firstNewIndex = tailChain.length;
            for (var index = 0; index < tailChain.length; index++) {
                if (!current.hasOwnProperty (tailChain [index])) {
                    firstNewIndex = index;
                    break;
                }
                current = current [tailChain [index]];
            }
            
            // Create the rest of the objects, if any
            for (var index = firstNewIndex; index < tailChain.length; index++) {
                current [tailChain [index]] = {};
                current = current [tailChain [index]];
            }
        }
        
        // Insert it new attributes, it may have been created earlier and have other attributes
        for (var attrib in value) {
            current [attrib] = value [attrib];          
        }       
    };
    __all__.__nest__ = __nest__;
    
    // Initialize module if not yet done and return its globals
    var __init__ = function (module) {
        if (!module.__inited__) {
            module.__all__.__init__ (module.__all__);
            module.__inited__ = true;
        }
        return module.__all__;
    };
    __all__.__init__ = __init__;
    
    
    
    
    // Since we want to assign functions, a = b.f should make b.f produce a bound function
    // So __get__ should be called by a property rather then a function
    // Factory __get__ creates one of three curried functions for func
    // Which one is produced depends on what's to the left of the dot of the corresponding JavaScript property
    var __get__ = function (self, func, quotedFuncName) {
        if (self) {
            if (self.hasOwnProperty ('__class__') || typeof self == 'string' || self instanceof String) {           // Object before the dot
                if (quotedFuncName) {                                   // Memoize call since fcall is on, by installing bound function in instance
                    Object.defineProperty (self, quotedFuncName, {      // Will override the non-own property, next time it will be called directly
                        value: function () {                            // So next time just call curry function that calls function
                            var args = [] .slice.apply (arguments);
                            return func.apply (null, [self] .concat (args));
                        },              
                        writable: true,
                        enumerable: true,
                        configurable: true
                    });
                }
                return function () {                                    // Return bound function, code dupplication for efficiency if no memoizing
                    var args = [] .slice.apply (arguments);             // So multilayer search prototype, apply __get__, call curry func that calls func
                    return func.apply (null, [self] .concat (args));
                };
            }
            else {                                                      // Class before the dot
                return func;                                            // Return static method
            }
        }
        else {                                                          // Nothing before the dot
            return func;                                                // Return free function
        }
    }
    __all__.__get__ = __get__;

    var __getcm__ = function (self, func, quotedFuncName) {
        if (self.hasOwnProperty ('__class__')) {
            return function () {
                var args = [] .slice.apply (arguments);
                return func.apply (null, [self.__class__] .concat (args));
            };
        }
        else {
            return function () {
                var args = [] .slice.apply (arguments);
                return func.apply (null, [self] .concat (args));
            };
        }
    }
    __all__.__getcm__ = __getcm__;
    
    var __getsm__ = function (self, func, quotedFuncName) {
        return func;
    }
    __all__.__getsm__ = __getsm__;
        
    // Mother of all metaclasses        
    var py_metatype = {
        __name__: 'type',
        __bases__: [],
        
        // Overridable class creation worker
        __new__: function (meta, name, bases, attribs) {
            // Create the class cls, a functor, which the class creator function will return
            var cls = function () {                     // If cls is called with arg0, arg1, etc, it calls its __new__ method with [arg0, arg1, etc]
                var args = [] .slice.apply (arguments); // It has a __new__ method, not yet but at call time, since it is copied from the parent in the loop below
                return cls.__new__ (args);              // Each Python class directly or indirectly derives from object, which has the __new__ method
            };                                          // If there are no bases in the Python source, the compiler generates [object] for this parameter
            
            // Copy all methods, including __new__, properties and static attributes from base classes to new cls object
            // The new class object will simply be the prototype of its instances
            // JavaScript prototypical single inheritance will do here, since any object has only one class
            // This has nothing to do with Python multiple inheritance, that is implemented explictly in the copy loop below
            for (var index = bases.length - 1; index >= 0; index--) {   // Reversed order, since class vars of first base should win
                var base = bases [index];
                for (var attrib in base) {
                    var descrip = Object.getOwnPropertyDescriptor (base, attrib);
                    Object.defineProperty (cls, attrib, descrip);
                }           
            }
            
            // Add class specific attributes to the created cls object
            cls.__metaclass__ = meta;
            cls.__name__ = name;
            cls.__bases__ = bases;
            
            // Add own methods, properties and own static attributes to the created cls object
            for (var attrib in attribs) {
                var descrip = Object.getOwnPropertyDescriptor (attribs, attrib);
                Object.defineProperty (cls, attrib, descrip);
            }
            // Return created cls object
            return cls;
        }
    };
    py_metatype.__metaclass__ = py_metatype;
    __all__.py_metatype = py_metatype;
    
    // Mother of all classes
    var object = {
        __init__: function (self) {},
        
        __metaclass__: py_metatype, // By default, all classes have metaclass type, since they derive from object
        __name__: 'object',
        __bases__: [],
            
        // Object creator function, is inherited by all classes (so could be global)
        __new__: function (args) {  // Args are just the constructor args       
            // In JavaScript the Python class is the prototype of the Python object
            // In this way methods and static attributes will be available both with a class and an object before the dot
            // The descriptor produced by __get__ will return the right method flavor
            var instance = Object.create (this, {__class__: {value: this, enumerable: true}});
            

            // Call constructor
            this.__init__.apply (null, [instance] .concat (args));

            // Return constructed instance
            return instance;
        }   
    };
    __all__.object = object;
    
    // Class creator facade function, calls class creation worker
    var __class__ = function (name, bases, attribs, meta) {         // Parameter meta is optional
        if (meta == undefined) {
            meta = bases [0] .__metaclass__;
        }
                
        return meta.__new__ (meta, name, bases, attribs);
    }
    __all__.__class__ = __class__;
    
    // Define __pragma__ to preserve '<all>' and '</all>', since it's never generated as a function, must be done early, so here
    var __pragma__ = function () {};
    __all__.__pragma__ = __pragma__;
    
    	__nest__ (
		__all__,
		'org.transcrypt.__base__', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var __name__ = 'org.transcrypt.__base__';
					var __Envir__ = __class__ ('__Envir__', [object], {
						__module__: __name__,
						get __init__ () {return __get__ (this, function (self) {
							self.interpreter_name = 'python';
							self.transpiler_name = 'transcrypt';
							self.transpiler_version = '3.6.61';
							self.target_subdir = '__javascript__';
						});}
					});
					var __envir__ = __Envir__ ();
					__pragma__ ('<all>')
						__all__.__Envir__ = __Envir__;
						__all__.__envir__ = __envir__;
						__all__.__name__ = __name__;
					__pragma__ ('</all>')
				}
			}
		}
	);
	__nest__ (
		__all__,
		'org.transcrypt.__standard__', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var __name__ = 'org.transcrypt.__standard__';
					var Exception = __class__ ('Exception', [object], {
						__module__: __name__,
						get __init__ () {return __get__ (this, function (self) {
							var kwargs = dict ();
							if (arguments.length) {
								var __ilastarg0__ = arguments.length - 1;
								if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
									var __allkwargs0__ = arguments [__ilastarg0__--];
									for (var __attrib0__ in __allkwargs0__) {
										switch (__attrib0__) {
											case 'self': var self = __allkwargs0__ [__attrib0__]; break;
											default: kwargs [__attrib0__] = __allkwargs0__ [__attrib0__];
										}
									}
									delete kwargs.__kwargtrans__;
								}
								var args = tuple ([].slice.apply (arguments).slice (1, __ilastarg0__ + 1));
							}
							else {
								var args = tuple ();
							}
							self.__args__ = args;
							try {
								self.stack = kwargs.error.stack;
							}
							catch (__except0__) {
								self.stack = 'No stack trace available';
							}
						});},
						get __repr__ () {return __get__ (this, function (self) {
							if (len (self.__args__)) {
								return '{}{}'.format (self.__class__.__name__, repr (tuple (self.__args__)));
							}
							else {
								return '{}()'.format (self.__class__.__name__);
							}
						});},
						get __str__ () {return __get__ (this, function (self) {
							if (len (self.__args__) > 1) {
								return str (tuple (self.__args__));
							}
							else if (len (self.__args__)) {
								return str (self.__args__ [0]);
							}
							else {
								return '';
							}
						});}
					});
					var IterableError = __class__ ('IterableError', [Exception], {
						__module__: __name__,
						get __init__ () {return __get__ (this, function (self, error) {
							Exception.__init__ (self, "Can't iterate over non-iterable", __kwargtrans__ ({error: error}));
						});}
					});
					var StopIteration = __class__ ('StopIteration', [Exception], {
						__module__: __name__,
						get __init__ () {return __get__ (this, function (self, error) {
							Exception.__init__ (self, 'Iterator exhausted', __kwargtrans__ ({error: error}));
						});}
					});
					var ValueError = __class__ ('ValueError', [Exception], {
						__module__: __name__,
						get __init__ () {return __get__ (this, function (self, message, error) {
							Exception.__init__ (self, message, __kwargtrans__ ({error: error}));
						});}
					});
					var KeyError = __class__ ('KeyError', [Exception], {
						__module__: __name__,
						get __init__ () {return __get__ (this, function (self, message, error) {
							Exception.__init__ (self, message, __kwargtrans__ ({error: error}));
						});}
					});
					var AssertionError = __class__ ('AssertionError', [Exception], {
						__module__: __name__,
						get __init__ () {return __get__ (this, function (self, message, error) {
							if (message) {
								Exception.__init__ (self, message, __kwargtrans__ ({error: error}));
							}
							else {
								Exception.__init__ (self, __kwargtrans__ ({error: error}));
							}
						});}
					});
					var NotImplementedError = __class__ ('NotImplementedError', [Exception], {
						__module__: __name__,
						get __init__ () {return __get__ (this, function (self, message, error) {
							Exception.__init__ (self, message, __kwargtrans__ ({error: error}));
						});}
					});
					var IndexError = __class__ ('IndexError', [Exception], {
						__module__: __name__,
						get __init__ () {return __get__ (this, function (self, message, error) {
							Exception.__init__ (self, message, __kwargtrans__ ({error: error}));
						});}
					});
					var AttributeError = __class__ ('AttributeError', [Exception], {
						__module__: __name__,
						get __init__ () {return __get__ (this, function (self, message, error) {
							Exception.__init__ (self, message, __kwargtrans__ ({error: error}));
						});}
					});
					var Warning = __class__ ('Warning', [Exception], {
						__module__: __name__,
					});
					var UserWarning = __class__ ('UserWarning', [Warning], {
						__module__: __name__,
					});
					var DeprecationWarning = __class__ ('DeprecationWarning', [Warning], {
						__module__: __name__,
					});
					var RuntimeWarning = __class__ ('RuntimeWarning', [Warning], {
						__module__: __name__,
					});
					var __sort__ = function (iterable, key, reverse) {
						if (typeof key == 'undefined' || (key != null && key .hasOwnProperty ("__kwargtrans__"))) {;
							var key = null;
						};
						if (typeof reverse == 'undefined' || (reverse != null && reverse .hasOwnProperty ("__kwargtrans__"))) {;
							var reverse = false;
						};
						if (arguments.length) {
							var __ilastarg0__ = arguments.length - 1;
							if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
								var __allkwargs0__ = arguments [__ilastarg0__--];
								for (var __attrib0__ in __allkwargs0__) {
									switch (__attrib0__) {
										case 'iterable': var iterable = __allkwargs0__ [__attrib0__]; break;
										case 'key': var key = __allkwargs0__ [__attrib0__]; break;
										case 'reverse': var reverse = __allkwargs0__ [__attrib0__]; break;
									}
								}
							}
						}
						else {
						}
						if (key) {
							iterable.sort ((function __lambda__ (a, b) {
								if (arguments.length) {
									var __ilastarg0__ = arguments.length - 1;
									if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
										var __allkwargs0__ = arguments [__ilastarg0__--];
										for (var __attrib0__ in __allkwargs0__) {
											switch (__attrib0__) {
												case 'a': var a = __allkwargs0__ [__attrib0__]; break;
												case 'b': var b = __allkwargs0__ [__attrib0__]; break;
											}
										}
									}
								}
								else {
								}
								return (key (a) > key (b) ? 1 : -(1));
							}));
						}
						else {
							iterable.sort ();
						}
						if (reverse) {
							iterable.reverse ();
						}
					};
					var sorted = function (iterable, key, reverse) {
						if (typeof key == 'undefined' || (key != null && key .hasOwnProperty ("__kwargtrans__"))) {;
							var key = null;
						};
						if (typeof reverse == 'undefined' || (reverse != null && reverse .hasOwnProperty ("__kwargtrans__"))) {;
							var reverse = false;
						};
						if (arguments.length) {
							var __ilastarg0__ = arguments.length - 1;
							if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
								var __allkwargs0__ = arguments [__ilastarg0__--];
								for (var __attrib0__ in __allkwargs0__) {
									switch (__attrib0__) {
										case 'iterable': var iterable = __allkwargs0__ [__attrib0__]; break;
										case 'key': var key = __allkwargs0__ [__attrib0__]; break;
										case 'reverse': var reverse = __allkwargs0__ [__attrib0__]; break;
									}
								}
							}
						}
						else {
						}
						if (py_typeof (iterable) == dict) {
							var result = copy (iterable.py_keys ());
						}
						else {
							var result = copy (iterable);
						}
						__sort__ (result, key, reverse);
						return result;
					};
					var map = function (func, iterable) {
						return function () {
							var __accu0__ = [];
							var __iterable0__ = iterable;
							for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
								var item = __iterable0__ [__index0__];
								__accu0__.append (func (item));
							}
							return __accu0__;
						} ();
					};
					var filter = function (func, iterable) {
						if (func == null) {
							var func = bool;
						}
						return function () {
							var __accu0__ = [];
							var __iterable0__ = iterable;
							for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
								var item = __iterable0__ [__index0__];
								if (func (item)) {
									__accu0__.append (item);
								}
							}
							return __accu0__;
						} ();
					};
					var __Terminal__ = __class__ ('__Terminal__', [object], {
						__module__: __name__,
						get __init__ () {return __get__ (this, function (self) {
							self.buffer = '';
							try {
								self.element = document.getElementById ('__terminal__');
							}
							catch (__except0__) {
								self.element = null;
							}
							if (self.element) {
								self.element.style.overflowX = 'auto';
								self.element.style.boxSizing = 'border-box';
								self.element.style.padding = '5px';
								self.element.innerHTML = '_';
							}
						});},
						get print () {return __get__ (this, function (self) {
							var sep = ' ';
							var end = '\n';
							if (arguments.length) {
								var __ilastarg0__ = arguments.length - 1;
								if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
									var __allkwargs0__ = arguments [__ilastarg0__--];
									for (var __attrib0__ in __allkwargs0__) {
										switch (__attrib0__) {
											case 'self': var self = __allkwargs0__ [__attrib0__]; break;
											case 'sep': var sep = __allkwargs0__ [__attrib0__]; break;
											case 'end': var end = __allkwargs0__ [__attrib0__]; break;
										}
									}
								}
								var args = tuple ([].slice.apply (arguments).slice (1, __ilastarg0__ + 1));
							}
							else {
								var args = tuple ();
							}
							self.buffer = '{}{}{}'.format (self.buffer, sep.join (function () {
								var __accu0__ = [];
								var __iterable0__ = args;
								for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
									var arg = __iterable0__ [__index0__];
									__accu0__.append (str (arg));
								}
								return __accu0__;
							} ()), end).__getslice__ (-(4096), null, 1);
							if (self.element) {
								self.element.innerHTML = self.buffer.py_replace ('\n', '<br>');
								self.element.scrollTop = self.element.scrollHeight;
							}
							else {
								console.log (sep.join (function () {
									var __accu0__ = [];
									var __iterable0__ = args;
									for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
										var arg = __iterable0__ [__index0__];
										__accu0__.append (str (arg));
									}
									return __accu0__;
								} ()));
							}
						});},
						get input () {return __get__ (this, function (self, question) {
							if (arguments.length) {
								var __ilastarg0__ = arguments.length - 1;
								if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
									var __allkwargs0__ = arguments [__ilastarg0__--];
									for (var __attrib0__ in __allkwargs0__) {
										switch (__attrib0__) {
											case 'self': var self = __allkwargs0__ [__attrib0__]; break;
											case 'question': var question = __allkwargs0__ [__attrib0__]; break;
										}
									}
								}
							}
							else {
							}
							self.print ('{}'.format (question), __kwargtrans__ ({end: ''}));
							var answer = window.prompt ('\n'.join (self.buffer.py_split ('\n').__getslice__ (-(16), null, 1)));
							self.print (answer);
							return answer;
						});}
					});
					var __terminal__ = __Terminal__ ();
					__pragma__ ('<all>')
						__all__.AssertionError = AssertionError;
						__all__.AttributeError = AttributeError;
						__all__.DeprecationWarning = DeprecationWarning;
						__all__.Exception = Exception;
						__all__.IndexError = IndexError;
						__all__.IterableError = IterableError;
						__all__.KeyError = KeyError;
						__all__.NotImplementedError = NotImplementedError;
						__all__.RuntimeWarning = RuntimeWarning;
						__all__.StopIteration = StopIteration;
						__all__.UserWarning = UserWarning;
						__all__.ValueError = ValueError;
						__all__.Warning = Warning;
						__all__.__Terminal__ = __Terminal__;
						__all__.__name__ = __name__;
						__all__.__sort__ = __sort__;
						__all__.__terminal__ = __terminal__;
						__all__.filter = filter;
						__all__.map = map;
						__all__.sorted = sorted;
					__pragma__ ('</all>')
				}
			}
		}
	);
    var __call__ = function (/* <callee>, <this>, <params>* */) {   // Needed for __base__ and __standard__ if global 'opov' switch is on
        var args = [] .slice.apply (arguments);
        if (typeof args [0] == 'object' && '__call__' in args [0]) {        // Overloaded
            return args [0] .__call__ .apply (args [1], args.slice (2));
        }
        else {                                                              // Native
            return args [0] .apply (args [1], args.slice (2));
        }
    };
    __all__.__call__ = __call__;

    // Initialize non-nested modules __base__ and __standard__ and make its names available directly and via __all__
    // They can't do that itself, because they're regular Python modules
    // The compiler recognizes their names and generates them inline rather than nesting them
    // In this way it isn't needed to import them everywhere

    // __base__

    __nest__ (__all__, '', __init__ (__all__.org.transcrypt.__base__));
    var __envir__ = __all__.__envir__;

    // __standard__

    __nest__ (__all__, '', __init__ (__all__.org.transcrypt.__standard__));

    var Exception = __all__.Exception;
    var IterableError = __all__.IterableError;
    var StopIteration = __all__.StopIteration;
    var ValueError = __all__.ValueError;
    var KeyError = __all__.KeyError;
    var AssertionError = __all__.AssertionError;
    var NotImplementedError = __all__.NotImplementedError;
    var IndexError = __all__.IndexError;
    var AttributeError = __all__.AttributeError;

    // Warnings Exceptions
    var Warning = __all__.Warning;
    var UserWarning = __all__.UserWarning;
    var DeprecationWarning = __all__.DeprecationWarning;
    var RuntimeWarning = __all__.RuntimeWarning;

    var __sort__ = __all__.__sort__;
    var sorted = __all__.sorted;

    var map = __all__.map;
    var filter = __all__.filter;

    __all__.print = __all__.__terminal__.print;
    __all__.input = __all__.__terminal__.input;

    var __terminal__ = __all__.__terminal__;
    var print = __all__.print;
    var input = __all__.input;

    // Complete __envir__, that was created in __base__, for non-stub mode
    __envir__.executor_name = __envir__.transpiler_name;

    // Make make __main__ available in browser
    var __main__ = {__file__: ''};
    __all__.main = __main__;

    // Define current exception, there's at most one exception in the air at any time
    var __except__ = null;
    __all__.__except__ = __except__;
    
     // Creator of a marked dictionary, used to pass **kwargs parameter
    var __kwargtrans__ = function (anObject) {
        anObject.__kwargtrans__ = null; // Removable marker
        anObject.constructor = Object;
        return anObject;
    }
    __all__.__kwargtrans__ = __kwargtrans__;

    // 'Oneshot' dict promotor, used to enrich __all__ and help globals () return a true dict
    var __globals__ = function (anObject) {
        if (isinstance (anObject, dict)) {  // Don't attempt to promote (enrich) again, since it will make a copy
            return anObject;
        }
        else {
            return dict (anObject)
        }
    }
    __all__.__globals__ = __globals__
    
    // Partial implementation of super () .<methodName> (<params>)
    var __super__ = function (aClass, methodName) {
        // Lean and fast, no C3 linearization, only call first implementation encountered
        // Will allow __super__ ('<methodName>') (self, <params>) rather than only <className>.<methodName> (self, <params>)
        
        for (var index = 0; index < aClass.__bases__.length; index++) {
            var base = aClass.__bases__ [index];
            if (methodName in base) {
               return base [methodName];
            }
        }

        throw new Exception ('Superclass method not found');    // !!! Improve!
    }
    __all__.__super__ = __super__
        
    // Python property installer function, no member since that would bloat classes
    var property = function (getter, setter) {  // Returns a property descriptor rather than a property
        if (!setter) {  // ??? Make setter optional instead of dummy?
            setter = function () {};
        }
        return {get: function () {return getter (this)}, set: function (value) {setter (this, value)}, enumerable: true};
    }
    __all__.property = property;
    
    // Conditional JavaScript property installer function, prevents redefinition of properties if multiple Transcrypt apps are on one page
    var __setProperty__ = function (anObject, name, descriptor) {
        if (!anObject.hasOwnProperty (name)) {
            Object.defineProperty (anObject, name, descriptor);
        }
    }
    __all__.__setProperty__ = __setProperty__
    
    // Assert function, call to it only generated when compiling with --dassert option
    function assert (condition, message) {  // Message may be undefined
        if (!condition) {
            throw AssertionError (message, new Error ());
        }
    }

    __all__.assert = assert;

    var __merge__ = function (object0, object1) {
        var result = {};
        for (var attrib in object0) {
            result [attrib] = object0 [attrib];
        }
        for (var attrib in object1) {
            result [attrib] = object1 [attrib];
        }
        return result;
    };
    __all__.__merge__ = __merge__;

    // Manipulating attributes by name
    
    var dir = function (obj) {
        var aList = [];
        for (var aKey in obj) {
            aList.push (aKey);
        }
        aList.sort ();
        return aList;
    };
    __all__.dir = dir;

    var setattr = function (obj, name, value) {
        obj [name] = value;
    };
    __all__.setattr = setattr;

    var getattr = function (obj, name) {
        return obj [name];
    };
    __all__.getattr= getattr;

    var hasattr = function (obj, name) {
        try {
            return name in obj;
        }
        catch (exception) {
            return false;
        }
    };
    __all__.hasattr = hasattr;

    var delattr = function (obj, name) {
        delete obj [name];
    };
    __all__.delattr = (delattr);

    // The __in__ function, used to mimic Python's 'in' operator
    // In addition to CPython's semantics, the 'in' operator is also allowed to work on objects, avoiding a counterintuitive separation between Python dicts and JavaScript objects
    // In general many Transcrypt compound types feature a deliberate blend of Python and JavaScript facilities, facilitating efficient integration with JavaScript libraries
    // If only Python objects and Python dicts are dealt with in a certain context, the more pythonic 'hasattr' is preferred for the objects as opposed to 'in' for the dicts
    var __in__ = function (element, container) {
        if (py_typeof (container) == dict) {        // Currently only implemented as an augmented JavaScript object
            return container.hasOwnProperty (element);
        }
        else {                                      // Parameter 'element' itself is an array, string or a plain, non-dict JavaScript object
            return (
                container.indexOf ?                 // If it has an indexOf
                container.indexOf (element) > -1 :  // it's an array or a string,
                container.hasOwnProperty (element)  // else it's a plain, non-dict JavaScript object
            );
        }
    };
    __all__.__in__ = __in__;

    // Find out if an attribute is special
    var __specialattrib__ = function (attrib) {
        return (attrib.startswith ('__') && attrib.endswith ('__')) || attrib == 'constructor' || attrib.startswith ('py_');
    };
    __all__.__specialattrib__ = __specialattrib__;

    // Compute length of any object
    var len = function (anObject) {
        if (anObject === undefined || anObject === null) {
            return 0;
        }

        if (anObject.__len__ instanceof Function) {
            return anObject.__len__ ();
        }

        if (anObject.length !== undefined) {
            return anObject.length;
        }

        var length = 0;
        for (var attr in anObject) {
            if (!__specialattrib__ (attr)) {
                length++;
            }
        }

        return length;
    };
    __all__.len = len;

    // General conversions and checks

    function __i__ (any) {  //  Convert to iterable
        return py_typeof (any) == dict ? any.py_keys () : any;
    }

    function __k__ (keyed, key) {  //  Check existence of dict key via retrieved element
        var result = keyed [key];
        if (typeof result == 'undefined') {
             throw KeyError (key, new Error());
        }
        return result;
    }

    // If the target object is somewhat true, return it. Otherwise return false.
    // Try to follow Python conventions of truthyness
    function __t__ (target) { 
        return (
            // Avoid invalid checks
            target === undefined || target === null ? false :
            
            // Take a quick shortcut if target is a simple type
            ['boolean', 'number'] .indexOf (typeof target) >= 0 ? target :
            
            // Use __bool__ (if present) to decide if target is true
            target.__bool__ instanceof Function ? (target.__bool__ () ? target : false) :
            
            // There is no __bool__, use __len__ (if present) instead
            target.__len__ instanceof Function ?  (target.__len__ () !== 0 ? target : false) :
            
            // There is no __bool__ and no __len__, declare Functions true.
            // Python objects are transpiled into instances of Function and if
            // there is no __bool__ or __len__, the object in Python is true.
            target instanceof Function ? target :
            
            // Target is something else, compute its len to decide
            len (target) !== 0 ? target :
            
            // When all else fails, declare target as false
            false
        );
    }
    __all__.__t__ = __t__;

    var bool = function (any) {     // Always truly returns a bool, rather than something truthy or falsy
        return !!__t__ (any);
    };
    bool.__name__ = 'bool';         // So it can be used as a type with a name
    __all__.bool = bool;

    var float = function (any) {
        if (any == 'inf') {
            return Infinity;
        }
        else if (any == '-inf') {
            return -Infinity;
        }
        else if (isNaN (parseFloat (any))) {    // Call to parseFloat needed to exclude '', ' ' etc.
            if (any === false) {
                return 0;
            }
            else if (any === true) {
                return 1;
            }
            else {  // Needed e.g. in autoTester.check, so "return any ? true : false" won't do
                throw ValueError ("could not convert string to float: '" + str(any) + "'", new Error ());
            }
        }
        else {
            return +any;
        }
    };
    float.__name__ = 'float';
    __all__.float = float;

    var int = function (any) {
        return float (any) | 0
    };
    int.__name__ = 'int';
    __all__.int = int;

    var py_typeof = function (anObject) {
        var aType = typeof anObject;
        if (aType == 'object') {    // Directly trying '__class__ in anObject' turns out to wreck anObject in Chrome if its a primitive
            try {
                return anObject.__class__;
            }
            catch (exception) {
                return aType;
            }
        }
        else {
            return (    // Odly, the braces are required here
                aType == 'boolean' ? bool :
                aType == 'string' ? str :
                aType == 'number' ? (anObject % 1 == 0 ? int : float) :
                null
            );
        }
    };
    __all__.py_typeof = py_typeof;

    var isinstance = function (anObject, classinfo) {
        function isA (queryClass) {
            if (queryClass == classinfo) {
                return true;
            }
            for (var index = 0; index < queryClass.__bases__.length; index++) {
                if (isA (queryClass.__bases__ [index], classinfo)) {
                    return true;
                }
            }
            return false;
        }

        if (classinfo instanceof Array) {   // Assume in most cases it isn't, then making it recursive rather than two functions saves a call
            for (var index = 0; index < classinfo.length; index++) {
                var aClass = classinfo [index];
                if (isinstance (anObject, aClass)) {
                    return true;
                }
            }
            return false;
        }

        try {                   // Most frequent use case first
            return '__class__' in anObject ? isA (anObject.__class__) : anObject instanceof classinfo;
        }
        catch (exception) {     // Using isinstance on primitives assumed rare
            var aType = py_typeof (anObject);
            return aType == classinfo || (aType == bool && classinfo == int);
        }
    };
    __all__.isinstance = isinstance;

    var callable = function (anObject) {
        if ( typeof anObject == 'object' && '__call__' in anObject ) {
            return true;
        }
        else {
            return typeof anObject === 'function';
        }
    };
    __all__.callable = callable;

    // Repr function uses __repr__ method, then __str__, then toString
    var repr = function (anObject) {
        try {
            return anObject.__repr__ ();
        }
        catch (exception) {
            try {
                return anObject.__str__ ();
            }
            catch (exception) { // anObject has no __repr__ and no __str__
                try {
                    if (anObject == null) {
                        return 'None';
                    }
                    else if (anObject.constructor == Object) {
                        var result = '{';
                        var comma = false;
                        for (var attrib in anObject) {
                            if (!__specialattrib__ (attrib)) {
                                if (attrib.isnumeric ()) {
                                    var attribRepr = attrib;                // If key can be interpreted as numerical, we make it numerical
                                }                                           // So we accept that '1' is misrepresented as 1
                                else {
                                    var attribRepr = '\'' + attrib + '\'';  // Alpha key in dict
                                }

                                if (comma) {
                                    result += ', ';
                                }
                                else {
                                    comma = true;
                                }
                                result += attribRepr + ': ' + repr (anObject [attrib]);
                            }
                        }
                        result += '}';
                        return result;
                    }
                    else {
                        return typeof anObject == 'boolean' ? anObject.toString () .capitalize () : anObject.toString ();
                    }
                }
                catch (exception) {
                    return '<object of type: ' + typeof anObject + '>';
                }
            }
        }
    };
    __all__.repr = repr;

    // Char from Unicode or ASCII
    var chr = function (charCode) {
        return String.fromCharCode (charCode);
    };
    __all__.chr = chr;

    // Unicode or ASCII from char
    var ord = function (aChar) {
        return aChar.charCodeAt (0);
    };
    __all__.ord = ord;

    // Maximum of n numbers
    var max = Math.max;
    __all__.max = max;

    // Minimum of n numbers
    var min = Math.min;
    __all__.min = min;

    // Absolute value
    var abs = Math.abs;
    __all__.abs = abs;

    // Bankers rounding
    var round = function (number, ndigits) {
        if (ndigits) {
            var scale = Math.pow (10, ndigits);
            number *= scale;
        }

        var rounded = Math.round (number);
        if (rounded - number == 0.5 && rounded % 2) {   // Has rounded up to odd, should have rounded down to even
            rounded -= 1;
        }

        if (ndigits) {
            rounded /= scale;
        }

        return rounded;
    };
    __all__.round = round;

    // BEGIN unified iterator model

    function __jsUsePyNext__ () {       // Add as 'next' method to make Python iterator JavaScript compatible
        try {
            var result = this.__next__ ();
            return {value: result, done: false};
        }
        catch (exception) {
            return {value: undefined, done: true};
        }
    }

    function __pyUseJsNext__ () {       // Add as '__next__' method to make JavaScript iterator Python compatible
        var result = this.next ();
        if (result.done) {
            throw StopIteration (new Error ());
        }
        else {
            return result.value;
        }
    }

    function py_iter (iterable) {                   // Alias for Python's iter function, produces a universal iterator / iterable, usable in Python and JavaScript
        if (typeof iterable == 'string' || '__iter__' in iterable) {    // JavaScript Array or string or Python iterable (string has no 'in')
            var result = iterable.__iter__ ();                          // Iterator has a __next__
            result.next = __jsUsePyNext__;                              // Give it a next
        }
        else if ('selector' in iterable) {                              // Assume it's a JQuery iterator
            var result = list (iterable) .__iter__ ();                  // Has a __next__
            result.next = __jsUsePyNext__;                              // Give it a next
        }
        else if ('next' in iterable) {                                  // It's a JavaScript iterator already,  maybe a generator, has a next and may have a __next__
            var result = iterable
            if (! ('__next__' in result)) {                             // If there's no danger of recursion
                result.__next__ = __pyUseJsNext__;                      // Give it a __next__
            }
        }
        else if (Symbol.iterator in iterable) {                         // It's a JavaScript iterable such as a typed array, but not an iterator
            var result = iterable [Symbol.iterator] ();                 // Has a next
            result.__next__ = __pyUseJsNext__;                          // Give it a __next__
        }
        else {
            throw IterableError (new Error ()); // No iterator at all
        }
        result [Symbol.iterator] = function () {return result;};
        return result;
    }

    function py_next (iterator) {               // Called only in a Python context, could receive Python or JavaScript iterator
        try {                                   // Primarily assume Python iterator, for max speed
            var result = iterator.__next__ ();
        }
        catch (exception) {                     // JavaScript iterators are the exception here
            var result = iterator.next ();
            if (result.done) {
                throw StopIteration (new Error ());
            }
            else {
                return result.value;
            }
        }
        if (result == undefined) {
            throw StopIteration (new Error ());
        }
        else {
            return result;
        }
    }

    function __PyIterator__ (iterable) {
        this.iterable = iterable;
        this.index = 0;
    }

    __PyIterator__.prototype.__next__ = function () {
        if (this.index < this.iterable.length) {
            return this.iterable [this.index++];
        }
        else {
            throw StopIteration (new Error ());
        }
    };

    function __JsIterator__ (iterable) {
        this.iterable = iterable;
        this.index = 0;
    }

    __JsIterator__.prototype.next = function () {
        if (this.index < this.iterable.py_keys.length) {
            return {value: this.index++, done: false};
        }
        else {
            return {value: undefined, done: true};
        }
    };

    // END unified iterator model

    // Reversed function for arrays
    var py_reversed = function (iterable) {
        iterable = iterable.slice ();
        iterable.reverse ();
        return iterable;
    };
    __all__.py_reversed = py_reversed;

    // Zip method for arrays and strings
    var zip = function () {
        var args = [] .slice.call (arguments);
        for (var i = 0; i < args.length; i++) {
            if (typeof args [i] == 'string') {
                args [i] = args [i] .split ('');
            }
            else if (!Array.isArray (args [i])) {
                args [i] = Array.from (args [i]);
            }
        }
        var shortest = args.length == 0 ? [] : args.reduce (    // Find shortest array in arguments
            function (array0, array1) {
                return array0.length < array1.length ? array0 : array1;
            }
        );
        return shortest.map (                   // Map each element of shortest array
            function (current, index) {         // To the result of this function
                return args.map (               // Map each array in arguments
                    function (current) {        // To the result of this function
                        return current [index]; // Namely it's index't entry
                    }
                );
            }
        );
    };
    __all__.zip = zip;

    // Range method, returning an array
    function range (start, stop, step) {
        if (stop == undefined) {
            // one param defined
            stop = start;
            start = 0;
        }
        if (step == undefined) {
            step = 1;
        }
        if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
            return [];
        }
        var result = [];
        for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
            result.push(i);
        }
        return result;
    };
    __all__.range = range;

    // Any, all and sum

    function any (iterable) {
        for (var index = 0; index < iterable.length; index++) {
            if (bool (iterable [index])) {
                return true;
            }
        }
        return false;
    }
    function all (iterable) {
        for (var index = 0; index < iterable.length; index++) {
            if (! bool (iterable [index])) {
                return false;
            }
        }
        return true;
    }
    function sum (iterable) {
        var result = 0;
        for (var index = 0; index < iterable.length; index++) {
            result += iterable [index];
        }
        return result;
    }

    __all__.any = any;
    __all__.all = all;
    __all__.sum = sum;

    // Enumerate method, returning a zipped list
    function enumerate (iterable) {
        return zip (range (len (iterable)), iterable);
    }
    __all__.enumerate = enumerate;

    // Shallow and deepcopy

    function copy (anObject) {
        if (anObject == null || typeof anObject == "object") {
            return anObject;
        }
        else {
            var result = {};
            for (var attrib in obj) {
                if (anObject.hasOwnProperty (attrib)) {
                    result [attrib] = anObject [attrib];
                }
            }
            return result;
        }
    }
    __all__.copy = copy;

    function deepcopy (anObject) {
        if (anObject == null || typeof anObject == "object") {
            return anObject;
        }
        else {
            var result = {};
            for (var attrib in obj) {
                if (anObject.hasOwnProperty (attrib)) {
                    result [attrib] = deepcopy (anObject [attrib]);
                }
            }
            return result;
        }
    }
    __all__.deepcopy = deepcopy;

    // List extensions to Array

    function list (iterable) {                                      // All such creators should be callable without new
        var instance = iterable ? [] .slice.apply (iterable) : [];  // Spread iterable, n.b. array.slice (), so array before dot
        // Sort is the normal JavaScript sort, Python sort is a non-member function
        return instance;
    }
    __all__.list = list;
    Array.prototype.__class__ = list;   // All arrays are lists (not only if constructed by the list ctor), unless constructed otherwise
    list.__name__ = 'list';

    /*
    Array.from = function (iterator) { // !!! remove
        result = [];
        for (item of iterator) {
            result.push (item);
        }
        return result;
    }
    */

    Array.prototype.__iter__ = function () {return new __PyIterator__ (this);};

    Array.prototype.__getslice__ = function (start, stop, step) {
        if (start < 0) {
            start = this.length + start;
        }

        if (stop == null) {
            stop = this.length;
        }
        else if (stop < 0) {
            stop = this.length + stop;
        }
        else if (stop > this.length) {
            stop = this.length;
        }

        var result = list ([]);
        for (var index = start; index < stop; index += step) {
            result.push (this [index]);
        }

        return result;
    };

    Array.prototype.__setslice__ = function (start, stop, step, source) {
        if (start < 0) {
            start = this.length + start;
        }

        if (stop == null) {
            stop = this.length;
        }
        else if (stop < 0) {
            stop = this.length + stop;
        }

        if (step == null) { // Assign to 'ordinary' slice, replace subsequence
            Array.prototype.splice.apply (this, [start, stop - start] .concat (source));
        }
        else {              // Assign to extended slice, replace designated items one by one
            var sourceIndex = 0;
            for (var targetIndex = start; targetIndex < stop; targetIndex += step) {
                this [targetIndex] = source [sourceIndex++];
            }
        }
    };

    Array.prototype.__repr__ = function () {
        if (this.__class__ == set && !this.length) {
            return 'set()';
        }

        var result = !this.__class__ || this.__class__ == list ? '[' : this.__class__ == tuple ? '(' : '{';

        for (var index = 0; index < this.length; index++) {
            if (index) {
                result += ', ';
            }
            result += repr (this [index]);
        }

        if (this.__class__ == tuple && this.length == 1) {
            result += ',';
        }

        result += !this.__class__ || this.__class__ == list ? ']' : this.__class__ == tuple ? ')' : '}';;
        return result;
    };

    Array.prototype.__str__ = Array.prototype.__repr__;

    Array.prototype.append = function (element) {
        this.push (element);
    };

    Array.prototype.py_clear = function () {
        this.length = 0;
    };

    Array.prototype.extend = function (aList) {
        this.push.apply (this, aList);
    };

    Array.prototype.insert = function (index, element) {
        this.splice (index, 0, element);
    };

    Array.prototype.remove = function (element) {
        var index = this.indexOf (element);
        if (index == -1) {
            throw ValueError ("list.remove(x): x not in list", new Error ());
        }
        this.splice (index, 1);
    };

    Array.prototype.index = function (element) {
        return this.indexOf (element);
    };

    Array.prototype.py_pop = function (index) {
        if (index == undefined) {
            return this.pop ();  // Remove last element
        }
        else {
            return this.splice (index, 1) [0];
        }
    };

    Array.prototype.py_sort = function () {
        __sort__.apply  (null, [this].concat ([] .slice.apply (arguments)));    // Can't work directly with arguments
        // Python params: (iterable, key = None, reverse = False)
        // py_sort is called with the Transcrypt kwargs mechanism, and just passes the params on to __sort__
        // __sort__ is def'ed with the Transcrypt kwargs mechanism
    };

    Array.prototype.__add__ = function (aList) {
        return list (this.concat (aList));
    };

    Array.prototype.__mul__ = function (scalar) {
        var result = this;
        for (var i = 1; i < scalar; i++) {
            result = result.concat (this);
        }
        return result;
    };

    Array.prototype.__rmul__ = Array.prototype.__mul__;

    // Tuple extensions to Array

    function tuple (iterable) {
        var instance = iterable ? [] .slice.apply (iterable) : [];
        instance.__class__ = tuple; // Not all arrays are tuples
        return instance;
    }
    __all__.tuple = tuple;
    tuple.__name__ = 'tuple';

    // Set extensions to Array
    // N.B. Since sets are unordered, set operations will occasionally alter the 'this' array by sorting it

    function set (iterable) {
        var instance = [];
        if (iterable) {
            for (var index = 0; index < iterable.length; index++) {
                instance.add (iterable [index]);
            }
        }
        instance.__class__ = set;   // Not all arrays are sets
        return instance;
    }
    __all__.set = set;
    set.__name__ = 'set';

    Array.prototype.__bindexOf__ = function (element) { // Used to turn O (n^2) into O (n log n)
    // Since sorting is lex, compare has to be lex. This also allows for mixed lists

        element += '';

        var mindex = 0;
        var maxdex = this.length - 1;

        while (mindex <= maxdex) {
            var index = (mindex + maxdex) / 2 | 0;
            var middle = this [index] + '';

            if (middle < element) {
                mindex = index + 1;
            }
            else if (middle > element) {
                maxdex = index - 1;
            }
            else {
                return index;
            }
        }

        return -1;
    };

    Array.prototype.add = function (element) {
        if (this.indexOf (element) == -1) { // Avoid duplicates in set
            this.push (element);
        }
    };

    Array.prototype.discard = function (element) {
        var index = this.indexOf (element);
        if (index != -1) {
            this.splice (index, 1);
        }
    };

    Array.prototype.isdisjoint = function (other) {
        this.sort ();
        for (var i = 0; i < other.length; i++) {
            if (this.__bindexOf__ (other [i]) != -1) {
                return false;
            }
        }
        return true;
    };

    Array.prototype.issuperset = function (other) {
        this.sort ();
        for (var i = 0; i < other.length; i++) {
            if (this.__bindexOf__ (other [i]) == -1) {
                return false;
            }
        }
        return true;
    };

    Array.prototype.issubset = function (other) {
        return set (other.slice ()) .issuperset (this); // Sort copy of 'other', not 'other' itself, since it may be an ordered sequence
    };

    Array.prototype.union = function (other) {
        var result = set (this.slice () .sort ());
        for (var i = 0; i < other.length; i++) {
            if (result.__bindexOf__ (other [i]) == -1) {
                result.push (other [i]);
            }
        }
        return result;
    };

    Array.prototype.intersection = function (other) {
        this.sort ();
        var result = set ();
        for (var i = 0; i < other.length; i++) {
            if (this.__bindexOf__ (other [i]) != -1) {
                result.push (other [i]);
            }
        }
        return result;
    };

    Array.prototype.difference = function (other) {
        var sother = set (other.slice () .sort ());
        var result = set ();
        for (var i = 0; i < this.length; i++) {
            if (sother.__bindexOf__ (this [i]) == -1) {
                result.push (this [i]);
            }
        }
        return result;
    };

    Array.prototype.symmetric_difference = function (other) {
        return this.union (other) .difference (this.intersection (other));
    };

    Array.prototype.py_update = function () {   // O (n)
        var updated = [] .concat.apply (this.slice (), arguments) .sort ();
        this.py_clear ();
        for (var i = 0; i < updated.length; i++) {
            if (updated [i] != updated [i - 1]) {
                this.push (updated [i]);
            }
        }
    };

    Array.prototype.__eq__ = function (other) { // Also used for list
        if (this.length != other.length) {
            return false;
        }
        if (this.__class__ == set) {
            this.sort ();
            other.sort ();
        }
        for (var i = 0; i < this.length; i++) {
            if (this [i] != other [i]) {
                return false;
            }
        }
        return true;
    };

    Array.prototype.__ne__ = function (other) { // Also used for list
        return !this.__eq__ (other);
    };

    Array.prototype.__le__ = function (other) {
        return this.issubset (other);
    };

    Array.prototype.__ge__ = function (other) {
        return this.issuperset (other);
    };

    Array.prototype.__lt__ = function (other) {
        return this.issubset (other) && !this.issuperset (other);
    };

    Array.prototype.__gt__ = function (other) {
        return this.issuperset (other) && !this.issubset (other);
    };

    // String extensions

    function str (stringable) {
        try {
            return stringable.__str__ ();
        }
        catch (exception) {
            try {
                return repr (stringable);
            }
            catch (exception) {
                return String (stringable); // No new, so no permanent String object but a primitive in a temporary 'just in time' wrapper
            }
        }
    };
    __all__.str = str;

    String.prototype.__class__ = str;   // All strings are str
    str.__name__ = 'str';

    String.prototype.__iter__ = function () {new __PyIterator__ (this);};

    String.prototype.__repr__ = function () {
        return (this.indexOf ('\'') == -1 ? '\'' + this + '\'' : '"' + this + '"') .py_replace ('\t', '\\t') .py_replace ('\n', '\\n');
    };

    String.prototype.__str__ = function () {
        return this;
    };

    String.prototype.capitalize = function () {
        return this.charAt (0).toUpperCase () + this.slice (1);
    };

    String.prototype.endswith = function (suffix) {
        return suffix == '' || this.slice (-suffix.length) == suffix;
    };

    String.prototype.find  = function (sub, start) {
        return this.indexOf (sub, start);
    };

    String.prototype.__getslice__ = function (start, stop, step) {
        if (start < 0) {
            start = this.length + start;
        }

        if (stop == null) {
            stop = this.length;
        }
        else if (stop < 0) {
            stop = this.length + stop;
        }

        var result = '';
        if (step == 1) {
            result = this.substring (start, stop);
        }
        else {
            for (var index = start; index < stop; index += step) {
                result = result.concat (this.charAt(index));
            }
        }
        return result;
    }

    // Since it's worthwhile for the 'format' function to be able to deal with *args, it is defined as a property
    // __get__ will produce a bound function if there's something before the dot
    // Since a call using *args is compiled to e.g. <object>.<function>.apply (null, args), the function has to be bound already
    // Otherwise it will never be, because of the null argument
    // Using 'this' rather than 'null' contradicts the requirement to be able to pass bound functions around
    // The object 'before the dot' won't be available at call time in that case, unless implicitly via the function bound to it
    // While for Python methods this mechanism is generated by the compiler, for JavaScript methods it has to be provided manually
    // Call memoizing is unattractive here, since every string would then have to hold a reference to a bound format method
    __setProperty__ (String.prototype, 'format', {
        get: function () {return __get__ (this, function (self) {
            var args = tuple ([] .slice.apply (arguments).slice (1));
            var autoIndex = 0;
            return self.replace (/\{(\w*)\}/g, function (match, key) {
                if (key == '') {
                    key = autoIndex++;
                }
                if (key == +key) {  // So key is numerical
                    return args [key] == undefined ? match : str (args [key]);
                }
                else {              // Key is a string
                    for (var index = 0; index < args.length; index++) {
                        // Find first 'dict' that has that key and the right field
                        if (typeof args [index] == 'object' && args [index][key] != undefined) {
                            return str (args [index][key]); // Return that field field
                        }
                    }
                    return match;
                }
            });
        });},
        enumerable: true
    });

    String.prototype.isalnum = function () {
        return /^[0-9a-zA-Z]{1,}$/.test(this)
    }

    String.prototype.isalpha = function () {
        return /^[a-zA-Z]{1,}$/.test(this)
    }

    String.prototype.isdecimal = function () {
        return /^[0-9]{1,}$/.test(this)
    }

    String.prototype.isdigit = function () {
        return this.isdecimal()
    }

    String.prototype.islower = function () {
        return /^[a-z]{1,}$/.test(this)
    }

    String.prototype.isupper = function () {
        return /^[A-Z]{1,}$/.test(this)
    }

    String.prototype.isspace = function () {
        return /^[\s]{1,}$/.test(this)
    }

    String.prototype.isnumeric = function () {
        return !isNaN (parseFloat (this)) && isFinite (this);
    };

    String.prototype.join = function (strings) {
        return strings.join (this);
    };

    String.prototype.lower = function () {
        return this.toLowerCase ();
    };

    String.prototype.py_replace = function (old, aNew, maxreplace) {
        return this.split (old, maxreplace) .join (aNew);
    };

    String.prototype.lstrip = function () {
        return this.replace (/^\s*/g, '');
    };

    String.prototype.rfind = function (sub, start) {
        return this.lastIndexOf (sub, start);
    };

    String.prototype.rsplit = function (sep, maxsplit) {    // Combination of general whitespace sep and positive maxsplit neither supported nor checked, expensive and rare
        if (sep == undefined || sep == null) {
            sep = /\s+/;
            var stripped = this.strip ();
        }
        else {
            var stripped = this;
        }

        if (maxsplit == undefined || maxsplit == -1) {
            return stripped.split (sep);
        }
        else {
            var result = stripped.split (sep);
            if (maxsplit < result.length) {
                var maxrsplit = result.length - maxsplit;
                return [result.slice (0, maxrsplit) .join (sep)] .concat (result.slice (maxrsplit));
            }
            else {
                return result;
            }
        }
    };

    String.prototype.rstrip = function () {
        return this.replace (/\s*$/g, '');
    };

    String.prototype.py_split = function (sep, maxsplit) {  // Combination of general whitespace sep and positive maxsplit neither supported nor checked, expensive and rare
        if (sep == undefined || sep == null) {
            sep = /\s+/;
            var stripped = this.strip ();
        }
        else {
            var stripped = this;
        }

        if (maxsplit == undefined || maxsplit == -1) {
            return stripped.split (sep);
        }
        else {
            var result = stripped.split (sep);
            if (maxsplit < result.length) {
                return result.slice (0, maxsplit).concat ([result.slice (maxsplit).join (sep)]);
            }
            else {
                return result;
            }
        }
    };

    String.prototype.startswith = function (prefix) {
        return this.indexOf (prefix) == 0;
    };

    String.prototype.strip = function () {
        return this.trim ();
    };

    String.prototype.upper = function () {
        return this.toUpperCase ();
    };

    String.prototype.__mul__ = function (scalar) {
        var result = this;
        for (var i = 1; i < scalar; i++) {
            result = result + this;
        }
        return result;
    };

    String.prototype.__rmul__ = String.prototype.__mul__;

    // Dict extensions to object

    function __keys__ () {
        var keys = [];
        for (var attrib in this) {
            if (!__specialattrib__ (attrib)) {
                keys.push (attrib);
            }
        }
        return keys;
    }

    function __items__ () {
        var items = [];
        for (var attrib in this) {
            if (!__specialattrib__ (attrib)) {
                items.push ([attrib, this [attrib]]);
            }
        }
        return items;
    }

    function __del__ (key) {
        delete this [key];
    }

    function __clear__ () {
        for (var attrib in this) {
            delete this [attrib];
        }
    }

    function __getdefault__ (aKey, aDefault) {  // Each Python object already has a function called __get__, so we call this one __getdefault__
        var result = this [aKey];
        return result == undefined ? (aDefault == undefined ? null : aDefault) : result;
    }

    function __setdefault__ (aKey, aDefault) {
        var result = this [aKey];
        if (result != undefined) {
            return result;
        }
        var val = aDefault == undefined ? null : aDefault;
        this [aKey] = val;
        return val;
    }

    function __pop__ (aKey, aDefault) {
        var result = this [aKey];
        if (result != undefined) {
            delete this [aKey];
            return result;
        } else {
            // Identify check because user could pass None
            if ( aDefault === undefined ) {
                throw KeyError (aKey, new Error());
            }
        }
        return aDefault;
    }
    
    function __popitem__ () {
        var aKey = Object.keys (this) [0];
        if (aKey == null) {
            throw KeyError ("popitem(): dictionary is empty", new Error ());
        }
        var result = tuple ([aKey, this [aKey]]);
        delete this [aKey];
        return result;
    }
    
    function __update__ (aDict) {
        for (var aKey in aDict) {
            this [aKey] = aDict [aKey];
        }
    }
    
    function __values__ () {
        var values = [];
        for (var attrib in this) {
            if (!__specialattrib__ (attrib)) {
                values.push (this [attrib]);
            }
        }
        return values;

    }
    
    function __dgetitem__ (aKey) {
        return this [aKey];
    }
    
    function __dsetitem__ (aKey, aValue) {
        this [aKey] = aValue;
    }

    function dict (objectOrPairs) {
        var instance = {};
        if (!objectOrPairs || objectOrPairs instanceof Array) { // It's undefined or an array of pairs
            if (objectOrPairs) {
                for (var index = 0; index < objectOrPairs.length; index++) {
                    var pair = objectOrPairs [index];
                    if ( !(pair instanceof Array) || pair.length != 2) {
                        throw ValueError(
                            "dict update sequence element #" + index +
                            " has length " + pair.length +
                            "; 2 is required", new Error());
                    }
                    var key = pair [0];
                    var val = pair [1];
                    if (!(objectOrPairs instanceof Array) && objectOrPairs instanceof Object) {
                         // User can potentially pass in an object
                         // that has a hierarchy of objects. This
                         // checks to make sure that these objects
                         // get converted to dict objects instead of
                         // leaving them as js objects.
                         
                         if (!isinstance (objectOrPairs, dict)) {
                             val = dict (val);
                         }
                    }
                    instance [key] = val;
                }
            }
        }
        else {
            if (isinstance (objectOrPairs, dict)) {
                // Passed object is a dict already so we need to be a little careful
                // N.B. - this is a shallow copy per python std - so
                // it is assumed that children have already become
                // python objects at some point.
                
                var aKeys = objectOrPairs.py_keys ();
                for (var index = 0; index < aKeys.length; index++ ) {
                    var key = aKeys [index];
                    instance [key] = objectOrPairs [key];
                }
            } else if (objectOrPairs instanceof Object) {
                // Passed object is a JavaScript object but not yet a dict, don't copy it
                instance = objectOrPairs;
            } else {
                // We have already covered Array so this indicates
                // that the passed object is not a js object - i.e.
                // it is an int or a string, which is invalid.
                
                throw ValueError ("Invalid type of object for dict creation", new Error ());
            }
        }

        // Trancrypt interprets e.g. {aKey: 'aValue'} as a Python dict literal rather than a JavaScript object literal
        // So dict literals rather than bare Object literals will be passed to JavaScript libraries
        // Some JavaScript libraries call all enumerable callable properties of an object that's passed to them
        // So the properties of a dict should be non-enumerable
        __setProperty__ (instance, '__class__', {value: dict, enumerable: false, writable: true});
        __setProperty__ (instance, 'py_keys', {value: __keys__, enumerable: false});
        __setProperty__ (instance, '__iter__', {value: function () {new __PyIterator__ (this.py_keys ());}, enumerable: false});
        __setProperty__ (instance, Symbol.iterator, {value: function () {new __JsIterator__ (this.py_keys ());}, enumerable: false});
        __setProperty__ (instance, 'py_items', {value: __items__, enumerable: false});
        __setProperty__ (instance, 'py_del', {value: __del__, enumerable: false});
        __setProperty__ (instance, 'py_clear', {value: __clear__, enumerable: false});
        __setProperty__ (instance, 'py_get', {value: __getdefault__, enumerable: false});
        __setProperty__ (instance, 'py_setdefault', {value: __setdefault__, enumerable: false});
        __setProperty__ (instance, 'py_pop', {value: __pop__, enumerable: false});
        __setProperty__ (instance, 'py_popitem', {value: __popitem__, enumerable: false});
        __setProperty__ (instance, 'py_update', {value: __update__, enumerable: false});
        __setProperty__ (instance, 'py_values', {value: __values__, enumerable: false});
        __setProperty__ (instance, '__getitem__', {value: __dgetitem__, enumerable: false});    // Needed since compound keys necessarily
        __setProperty__ (instance, '__setitem__', {value: __dsetitem__, enumerable: false});    // trigger overloading to deal with slices
        return instance;
    }

    __all__.dict = dict;
    dict.__name__ = 'dict';
    
    // Docstring setter

    function __setdoc__ (docString) {
        this.__doc__ = docString;
        return this;
    }

    // Python classes, methods and functions are all translated to JavaScript functions
    __setProperty__ (Function.prototype, '__setdoc__', {value: __setdoc__, enumerable: false});

    // General operator overloading, only the ones that make most sense in matrix and complex operations

    var __neg__ = function (a) {
        if (typeof a == 'object' && '__neg__' in a) {
            return a.__neg__ ();
        }
        else {
            return -a;
        }
    };
    __all__.__neg__ = __neg__;

    var __matmul__ = function (a, b) {
        return a.__matmul__ (b);
    };
    __all__.__matmul__ = __matmul__;

    var __pow__ = function (a, b) {
        if (typeof a == 'object' && '__pow__' in a) {
            return a.__pow__ (b);
        }
        else if (typeof b == 'object' && '__rpow__' in b) {
            return b.__rpow__ (a);
        }
        else {
            return Math.pow (a, b);
        }
    };
    __all__.pow = __pow__;

    var __jsmod__ = function (a, b) {
        if (typeof a == 'object' && '__mod__' in a) {
            return a.__mod__ (b);
        }
        else if (typeof b == 'object' && '__rpow__' in b) {
            return b.__rmod__ (a);
        }
        else {
            return a % b;
        }
    };
    __all__.__jsmod__ = __jsmod__;
    
    var __mod__ = function (a, b) {
        if (typeof a == 'object' && '__mod__' in a) {
            return a.__mod__ (b);
        }
        else if (typeof b == 'object' && '__rpow__' in b) {
            return b.__rmod__ (a);
        }
        else {
            return ((a % b) + b) % b;
        }
    };
    __all__.mod = __mod__;

    // Overloaded binary arithmetic
    
    var __mul__ = function (a, b) {
        if (typeof a == 'object' && '__mul__' in a) {
            return a.__mul__ (b);
        }
        else if (typeof b == 'object' && '__rmul__' in b) {
            return b.__rmul__ (a);
        }
        else if (typeof a == 'string') {
            return a.__mul__ (b);
        }
        else if (typeof b == 'string') {
            return b.__rmul__ (a);
        }
        else {
            return a * b;
        }
    };
    __all__.__mul__ = __mul__;

    var __truediv__ = function (a, b) {
        if (typeof a == 'object' && '__truediv__' in a) {
            return a.__truediv__ (b);
        }
        else if (typeof b == 'object' && '__rtruediv__' in b) {
            return b.__rtruediv__ (a);
        }
        else if (typeof a == 'object' && '__div__' in a) {
            return a.__div__ (b);
        }
        else if (typeof b == 'object' && '__rdiv__' in b) {
            return b.__rdiv__ (a);
        }
        else {
            return a / b;
        }
    };
    __all__.__truediv__ = __truediv__;

    var __floordiv__ = function (a, b) {
        if (typeof a == 'object' && '__floordiv__' in a) {
            return a.__floordiv__ (b);
        }
        else if (typeof b == 'object' && '__rfloordiv__' in b) {
            return b.__rfloordiv__ (a);
        }
        else if (typeof a == 'object' && '__div__' in a) {
            return a.__div__ (b);
        }
        else if (typeof b == 'object' && '__rdiv__' in b) {
            return b.__rdiv__ (a);
        }
        else {
            return Math.floor (a / b);
        }
    };
    __all__.__floordiv__ = __floordiv__;

    var __add__ = function (a, b) {
        if (typeof a == 'object' && '__add__' in a) {
            return a.__add__ (b);
        }
        else if (typeof b == 'object' && '__radd__' in b) {
            return b.__radd__ (a);
        }
        else {
            return a + b;
        }
    };
    __all__.__add__ = __add__;

    var __sub__ = function (a, b) {
        if (typeof a == 'object' && '__sub__' in a) {
            return a.__sub__ (b);
        }
        else if (typeof b == 'object' && '__rsub__' in b) {
            return b.__rsub__ (a);
        }
        else {
            return a - b;
        }
    };
    __all__.__sub__ = __sub__;

    // Overloaded binary bitwise
    
    var __lshift__ = function (a, b) {
        if (typeof a == 'object' && '__lshift__' in a) {
            return a.__lshift__ (b);
        }
        else if (typeof b == 'object' && '__rlshift__' in b) {
            return b.__rlshift__ (a);
        }
        else {
            return a << b;
        }
    };
    __all__.__lshift__ = __lshift__;

    var __rshift__ = function (a, b) {
        if (typeof a == 'object' && '__rshift__' in a) {
            return a.__rshift__ (b);
        }
        else if (typeof b == 'object' && '__rrshift__' in b) {
            return b.__rrshift__ (a);
        }
        else {
            return a >> b;
        }
    };
    __all__.__rshift__ = __rshift__;

    var __or__ = function (a, b) {
        if (typeof a == 'object' && '__or__' in a) {
            return a.__or__ (b);
        }
        else if (typeof b == 'object' && '__ror__' in b) {
            return b.__ror__ (a);
        }
        else {
            return a | b;
        }
    };
    __all__.__or__ = __or__;

    var __xor__ = function (a, b) {
        if (typeof a == 'object' && '__xor__' in a) {
            return a.__xor__ (b);
        }
        else if (typeof b == 'object' && '__rxor__' in b) {
            return b.__rxor__ (a);
        }
        else {
            return a ^ b;
        }
    };
    __all__.__xor__ = __xor__;

    var __and__ = function (a, b) {
        if (typeof a == 'object' && '__and__' in a) {
            return a.__and__ (b);
        }
        else if (typeof b == 'object' && '__rand__' in b) {
            return b.__rand__ (a);
        }
        else {
            return a & b;
        }
    };
    __all__.__and__ = __and__;

    // Overloaded binary compare
    
    var __eq__ = function (a, b) {
        if (typeof a == 'object' && '__eq__' in a) {
            return a.__eq__ (b);
        }
        else {
            return a == b;
        }
    };
    __all__.__eq__ = __eq__;

    var __ne__ = function (a, b) {
        if (typeof a == 'object' && '__ne__' in a) {
            return a.__ne__ (b);
        }
        else {
            return a != b
        }
    };
    __all__.__ne__ = __ne__;

    var __lt__ = function (a, b) {
        if (typeof a == 'object' && '__lt__' in a) {
            return a.__lt__ (b);
        }
        else {
            return a < b;
        }
    };
    __all__.__lt__ = __lt__;

    var __le__ = function (a, b) {
        if (typeof a == 'object' && '__le__' in a) {
            return a.__le__ (b);
        }
        else {
            return a <= b;
        }
    };
    __all__.__le__ = __le__;

    var __gt__ = function (a, b) {
        if (typeof a == 'object' && '__gt__' in a) {
            return a.__gt__ (b);
        }
        else {
            return a > b;
        }
    };
    __all__.__gt__ = __gt__;

    var __ge__ = function (a, b) {
        if (typeof a == 'object' && '__ge__' in a) {
            return a.__ge__ (b);
        }
        else {
            return a >= b;
        }
    };
    __all__.__ge__ = __ge__;
    
    // Overloaded augmented general
    
    var __imatmul__ = function (a, b) {
        if ('__imatmul__' in a) {
            return a.__imatmul__ (b);
        }
        else {
            return a.__matmul__ (b);
        }
    };
    __all__.__imatmul__ = __imatmul__;

    var __ipow__ = function (a, b) {
        if (typeof a == 'object' && '__pow__' in a) {
            return a.__ipow__ (b);
        }
        else if (typeof a == 'object' && '__ipow__' in a) {
            return a.__pow__ (b);
        }
        else if (typeof b == 'object' && '__rpow__' in b) {
            return b.__rpow__ (a);
        }
        else {
            return Math.pow (a, b);
        }
    };
    __all__.ipow = __ipow__;

    var __ijsmod__ = function (a, b) {
        if (typeof a == 'object' && '__imod__' in a) {
            return a.__ismod__ (b);
        }
        else if (typeof a == 'object' && '__mod__' in a) {
            return a.__mod__ (b);
        }
        else if (typeof b == 'object' && '__rpow__' in b) {
            return b.__rmod__ (a);
        }
        else {
            return a % b;
        }
    };
    __all__.ijsmod__ = __ijsmod__;
    
    var __imod__ = function (a, b) {
        if (typeof a == 'object' && '__imod__' in a) {
            return a.__imod__ (b);
        }
        else if (typeof a == 'object' && '__mod__' in a) {
            return a.__mod__ (b);
        }
        else if (typeof b == 'object' && '__rpow__' in b) {
            return b.__rmod__ (a);
        }
        else {
            return ((a % b) + b) % b;
        }
    };
    __all__.imod = __imod__;
    
    // Overloaded augmented arithmetic
    
    var __imul__ = function (a, b) {
        if (typeof a == 'object' && '__imul__' in a) {
            return a.__imul__ (b);
        }
        else if (typeof a == 'object' && '__mul__' in a) {
            return a = a.__mul__ (b);
        }
        else if (typeof b == 'object' && '__rmul__' in b) {
            return a = b.__rmul__ (a);
        }
        else if (typeof a == 'string') {
            return a = a.__mul__ (b);
        }
        else if (typeof b == 'string') {
            return a = b.__rmul__ (a);
        }
        else {
            return a *= b;
        }
    };
    __all__.__imul__ = __imul__;

    var __idiv__ = function (a, b) {
        if (typeof a == 'object' && '__idiv__' in a) {
            return a.__idiv__ (b);
        }
        else if (typeof a == 'object' && '__div__' in a) {
            return a = a.__div__ (b);
        }
        else if (typeof b == 'object' && '__rdiv__' in b) {
            return a = b.__rdiv__ (a);
        }
        else {
            return a /= b;
        }
    };
    __all__.__idiv__ = __idiv__;

    var __iadd__ = function (a, b) {
        if (typeof a == 'object' && '__iadd__' in a) {
            return a.__iadd__ (b);
        }
        else if (typeof a == 'object' && '__add__' in a) {
            return a = a.__add__ (b);
        }
        else if (typeof b == 'object' && '__radd__' in b) {
            return a = b.__radd__ (a);
        }
        else {
            return a += b;
        }
    };
    __all__.__iadd__ = __iadd__;

    var __isub__ = function (a, b) {
        if (typeof a == 'object' && '__isub__' in a) {
            return a.__isub__ (b);
        }
        else if (typeof a == 'object' && '__sub__' in a) {
            return a = a.__sub__ (b);
        }
        else if (typeof b == 'object' && '__rsub__' in b) {
            return a = b.__rsub__ (a);
        }
        else {
            return a -= b;
        }
    };
    __all__.__isub__ = __isub__;

    // Overloaded augmented bitwise
    
    var __ilshift__ = function (a, b) {
        if (typeof a == 'object' && '__ilshift__' in a) {
            return a.__ilshift__ (b);
        }
        else if (typeof a == 'object' && '__lshift__' in a) {
            return a = a.__lshift__ (b);
        }
        else if (typeof b == 'object' && '__rlshift__' in b) {
            return a = b.__rlshift__ (a);
        }
        else {
            return a <<= b;
        }
    };
    __all__.__ilshift__ = __ilshift__;

    var __irshift__ = function (a, b) {
        if (typeof a == 'object' && '__irshift__' in a) {
            return a.__irshift__ (b);
        }
        else if (typeof a == 'object' && '__rshift__' in a) {
            return a = a.__rshift__ (b);
        }
        else if (typeof b == 'object' && '__rrshift__' in b) {
            return a = b.__rrshift__ (a);
        }
        else {
            return a >>= b;
        }
    };
    __all__.__irshift__ = __irshift__;

    var __ior__ = function (a, b) {
        if (typeof a == 'object' && '__ior__' in a) {
            return a.__ior__ (b);
        }
        else if (typeof a == 'object' && '__or__' in a) {
            return a = a.__or__ (b);
        }
        else if (typeof b == 'object' && '__ror__' in b) {
            return a = b.__ror__ (a);
        }
        else {
            return a |= b;
        }
    };
    __all__.__ior__ = __ior__;

    var __ixor__ = function (a, b) {
        if (typeof a == 'object' && '__ixor__' in a) {
            return a.__ixor__ (b);
        }
        else if (typeof a == 'object' && '__xor__' in a) {
            return a = a.__xor__ (b);
        }
        else if (typeof b == 'object' && '__rxor__' in b) {
            return a = b.__rxor__ (a);
        }
        else {
            return a ^= b;
        }
    };
    __all__.__ixor__ = __ixor__;

    var __iand__ = function (a, b) {
        if (typeof a == 'object' && '__iand__' in a) {
            return a.__iand__ (b);
        }
        else if (typeof a == 'object' && '__and__' in a) {
            return a = a.__and__ (b);
        }
        else if (typeof b == 'object' && '__rand__' in b) {
            return a = b.__rand__ (a);
        }
        else {
            return a &= b;
        }
    };
    __all__.__iand__ = __iand__;
    
    // Indices and slices

    var __getitem__ = function (container, key) {                           // Slice c.q. index, direct generated call to runtime switch
        if (typeof container == 'object' && '__getitem__' in container) {
            return container.__getitem__ (key);                             // Overloaded on container
        }
        else {
            return container [key];                                         // Container must support bare JavaScript brackets
        }
    };
    __all__.__getitem__ = __getitem__;

    var __setitem__ = function (container, key, value) {                    // Slice c.q. index, direct generated call to runtime switch
        if (typeof container == 'object' && '__setitem__' in container) {
            container.__setitem__ (key, value);                             // Overloaded on container
        }
        else {
            container [key] = value;                                        // Container must support bare JavaScript brackets
        }
    };
    __all__.__setitem__ = __setitem__;

    var __getslice__ = function (container, lower, upper, step) {           // Slice only, no index, direct generated call to runtime switch
        if (typeof container == 'object' && '__getitem__' in container) {
            return container.__getitem__ ([lower, upper, step]);            // Container supports overloaded slicing c.q. indexing
        }
        else {
            return container.__getslice__ (lower, upper, step);             // Container only supports slicing injected natively in prototype
        }
    };
    __all__.__getslice__ = __getslice__;

    var __setslice__ = function (container, lower, upper, step, value) {    // Slice, no index, direct generated call to runtime switch
        if (typeof container == 'object' && '__setitem__' in container) {
            container.__setitem__ ([lower, upper, step], value);            // Container supports overloaded slicing c.q. indexing
        }
        else {
            container.__setslice__ (lower, upper, step, value);             // Container only supports slicing injected natively in prototype
        }
    };
    __all__.__setslice__ = __setslice__;
	__nest__ (
		__all__,
		'random', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var __name__ = 'random';
					var _array = function () {
						var __accu0__ = [];
						for (var i = 0; i < 624; i++) {
							__accu0__.append (0);
						}
						return __accu0__;
					} ();
					var _index = 0;
					var _bitmask1 = Math.pow (2, 32) - 1;
					var _bitmask2 = Math.pow (2, 31);
					var _bitmask3 = Math.pow (2, 31) - 1;
					var _fill_array = function () {
						for (var i = 0; i < 624; i++) {
							var y = (_array [i] & _bitmask2) + (_array [__mod__ (i + 1, 624)] & _bitmask3);
							_array [i] = _array [__mod__ (i + 397, 624)] ^ y >> 1;
							if (__mod__ (y, 2) != 0) {
								_array [i] ^= 2567483615;
							}
						}
					};
					var _random_integer = function () {
						if (_index == 0) {
							_fill_array ();
						}
						var y = _array [_index];
						y ^= y >> 11;
						y ^= y << 7 & 2636928640;
						y ^= y << 15 & 4022730752;
						y ^= y >> 18;
						_index = __mod__ (_index + 1, 624);
						return y;
					};
					var seed = function (x) {
						if (typeof x == 'undefined' || (x != null && x .hasOwnProperty ("__kwargtrans__"))) {;
							var x = int (_bitmask3 * Math.random ());
						};
						_array [0] = x;
						for (var i = 1; i < 624; i++) {
							_array [i] = (1812433253 * _array [i - 1] ^ (_array [i - 1] >> 30) + i) & _bitmask1;
						}
					};
					var randint = function (a, b) {
						return a + __mod__ (_random_integer (), (b - a) + 1);
					};
					var choice = function (seq) {
						return seq [randint (0, len (seq) - 1)];
					};
					var random = function () {
						return _random_integer () / _bitmask3;
					};
					seed ();
					__pragma__ ('<all>')
						__all__.__name__ = __name__;
						__all__._array = _array;
						__all__._bitmask1 = _bitmask1;
						__all__._bitmask2 = _bitmask2;
						__all__._bitmask3 = _bitmask3;
						__all__._fill_array = _fill_array;
						__all__._index = _index;
						__all__._random_integer = _random_integer;
						__all__.choice = choice;
						__all__.randint = randint;
						__all__.random = random;
						__all__.seed = seed;
					__pragma__ ('</all>')
				}
			}
		}
	);
	__nest__ (
		__all__,
		'time', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var __name__ = 'time';
					var __date = new Date (0);
					var __now = new Date ();
					var __weekdays = list ([]);
					var __weekdays_long = list ([]);
					var __d = new Date (1467662339080);
					for (var i = 0; i < 7; i++) {
						var __iterable0__ = tuple ([tuple ([__weekdays, 'short']), tuple ([__weekdays_long, 'long'])]);
						for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
							var __left0__ = __iterable0__ [__index0__];
							var l = __left0__ [0];
							var s = __left0__ [1];
							l.append (__d.toLocaleString (window.navigator.language, dict ({'weekday': s})).lower ());
						}
						__d.setDate (__d.getDate () + 1);
					}
					var __months = list ([]);
					var __months_long = list ([]);
					var __d = new Date (946681200000.0);
					for (var i = 0; i < 12; i++) {
						var __iterable0__ = tuple ([tuple ([__months, 'short']), tuple ([__months_long, 'long'])]);
						for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
							var __left0__ = __iterable0__ [__index0__];
							var l = __left0__ [0];
							var s = __left0__ [1];
							l.append (__d.toLocaleString (window.navigator.language, dict ({'month': s})).lower ());
						}
						__d.setMonth (__d.getMonth () + 1);
					}
					var __lu = dict ({'Y': 0, 'm': 1, 'd': 2, 'H': 3, 'M': 4, 'S': 5});
					var _lsplit = function (s, sep, maxsplit) {
						if (maxsplit == 0) {
							return list ([s]);
						}
						var py_split = s.py_split (sep);
						if (!(maxsplit)) {
							return py_split;
						}
						var ret = py_split.slice (0, maxsplit, 1);
						if (len (ret) == len (py_split)) {
							return ret;
						}
						ret.append (sep.join (py_split.__getslice__ (maxsplit, null, 1)));
						return ret;
					};
					var _local_time_tuple = function (jd) {
						var res = tuple ([jd.getFullYear (), jd.getMonth () + 1, jd.getDate (), jd.getHours (), jd.getMinutes (), jd.getSeconds (), (jd.getDay () > 0 ? jd.getDay () - 1 : 6), _day_of_year (jd, true), _daylight_in_effect (jd), jd.getMilliseconds ()]);
						return res;
					};
					var _utc_time_tuple = function (jd) {
						var res = tuple ([jd.getUTCFullYear (), jd.getUTCMonth () + 1, jd.getUTCDate (), jd.getUTCHours (), jd.getUTCMinutes (), jd.getUTCSeconds (), jd.getUTCDay () - 1, _day_of_year (jd, false), 0, jd.getUTCMilliseconds ()]);
						return res;
					};
					var _day_of_year = function (jd, local) {
						var day_offs = 0;
						if (jd.getHours () + (jd.getTimezoneOffset () * 60) / 3600 < 0) {
							var day_offs = -(1);
						}
						var was = jd.getTime ();
						var cur = jd.setHours (23);
						jd.setUTCDate (1);
						jd.setUTCMonth (0);
						jd.setUTCHours (0);
						jd.setUTCMinutes (0);
						jd.setUTCSeconds (0);
						var res = round ((cur - jd) / 86400000);
						if (!(local)) {
							res += day_offs;
						}
						if (res == 0) {
							var res = 365;
							jd.setTime (jd.getTime () - 86400);
							var last_year = jd.getUTCFullYear ();
							if (_is_leap (last_year)) {
								var res = 366;
							}
						}
						jd.setTime (was);
						return res;
					};
					var _is_leap = function (year) {
						return __mod__ (year, 4) == 0 && (__mod__ (year, 100) != 0 || __mod__ (year, 400) == 0);
					};
					var __jan_jun_tz = function (t, func) {
						var was = t.getTime ();
						t.setDate (1);
						var res = list ([]);
						var __iterable0__ = tuple ([0, 6]);
						for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
							var m = __iterable0__ [__index0__];
							t.setMonth (m);
							if (!(func)) {
								res.append (t.getTimezoneOffset ());
							}
							else {
								res.append (func (t));
							}
						}
						t.setTime (was);
						return res;
					};
					var _daylight = function (t) {
						var jj = __jan_jun_tz (t);
						if (jj [0] != jj [1]) {
							return 1;
						}
						return 0;
					};
					var _daylight_in_effect = function (t) {
						var jj = __jan_jun_tz (t);
						if (min (jj [0], jj [1]) == t.getTimezoneOffset ()) {
							return 1;
						}
						return 0;
					};
					var _timezone = function (t) {
						var jj = __jan_jun_tz (t);
						return max (jj [0], jj [1]);
					};
					var __tzn = function (t) {
						try {
							return str (t).py_split ('(') [1].py_split (')') [0];
						}
						catch (__except0__) {
							return 'n.a.';
						}
					};
					var _tzname = function (t) {
						var cn = __tzn (t);
						var ret = list ([cn, cn]);
						var jj = __jan_jun_tz (t, __tzn);
						var ind = 0;
						if (!(_daylight_in_effect (t))) {
							var ind = 1;
						}
						var __iterable0__ = jj;
						for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
							var i = __iterable0__ [__index0__];
							if (i != cn) {
								ret [ind] = i;
							}
						}
						return tuple (ret);
					};
					var altzone = __now.getTimezoneOffset ();
					if (!(_daylight_in_effect (__now))) {
						var _jj = __jan_jun_tz (__now);
						var altzone = (altzone == _jj [1] ? _jj [0] : _jj [1]);
					}
					var altzone = altzone * 60;
					var timezone = _timezone (__now) * 60;
					var daylight = _daylight (__now);
					var tzname = _tzname (__now);
					var time = function () {
						return Date.now () / 1000;
					};
					var asctime = function (t) {
						return strftime ('%a %b %d %H:%M:%S %Y', t);
					};
					var mktime = function (t) {
						var d = new Date (t [0], t [1] - 1, t [2], t [3], t [4], t [5], 0);
						return (d - 0) / 1000;
					};
					var ctime = function (seconds) {
						if (!(seconds)) {
							var seconds = time ();
						}
						return asctime (localtime (seconds));
					};
					var localtime = function (seconds) {
						if (!(seconds)) {
							var seconds = time ();
						}
						return gmtime (seconds, true);
					};
					var gmtime = function (seconds, localtime) {
						if (!(seconds)) {
							var seconds = time ();
						}
						var millis = seconds * 1000;
						__date.setTime (millis);
						if (localtime) {
							var t = _local_time_tuple (__date);
						}
						else {
							var t = _utc_time_tuple (__date);
						}
						return t.__getslice__ (0, 9, 1);
					};
					var strptime = function (string, format) {
						if (!(format)) {
							var format = '%a %b %d %H:%M:%S %Y';
						}
						var __left0__ = tuple ([string, format]);
						var ts = __left0__ [0];
						var fmt = __left0__ [1];
						var get_next = function (fmt) {
							var get_sep = function (fmt) {
								var res = list ([]);
								if (!(fmt)) {
									return tuple (['', '']);
								}
								for (var i = 0; i < len (fmt) - 1; i++) {
									var c = fmt [i];
									if (c == '%') {
										break;
									}
									res.append (c);
								}
								return tuple ([''.join (res), fmt.__getslice__ (i, null, 1)]);
							};
							var __left0__ = tuple ([null, null, null]);
							var d = __left0__ [0];
							var sep = __left0__ [1];
							var f = __left0__ [2];
							if (fmt) {
								if (fmt [0] == '%') {
									var d = fmt [1];
									var __left0__ = get_sep (fmt.__getslice__ (2, null, 1));
									var sep = __left0__ [0];
									var f = __left0__ [1];
								}
								else {
									var __left0__ = get_sep (fmt);
									var sep = __left0__ [0];
									var f = __left0__ [1];
								}
							}
							return tuple ([d, sep, f]);
						};
						var dir_val = dict ({});
						while (ts) {
							var __left0__ = get_next (fmt);
							var d = __left0__ [0];
							var sep = __left0__ [1];
							var fmt = __left0__ [2];
							if (sep == '') {
								var lv = null;
								if (d) {
									var l = -(1);
									if (d == 'Y') {
										var l = 4;
									}
									else if (d == 'a') {
										var l = len (__weekdays [0]);
									}
									else if (d == 'A') {
										var l = len (__weekdays_long [0]);
									}
									else if (d == 'b') {
										var l = len (__months [0]);
									}
									else if (__in__ (d, tuple (['d', 'm', 'H', 'M', 'S']))) {
										var l = 2;
									}
									if (l > -(1)) {
										var lv = list ([ts.__getslice__ (0, l, 1), ts.__getslice__ (l, null, 1)]);
									}
								}
								if (!(lv)) {
									var lv = list ([ts, '']);
								}
							}
							else {
								var lv = _lsplit (ts, sep, 1);
							}
							if (d == null) {
								var ts = lv [1];
								continue;
							}
							var __left0__ = tuple ([lv [1], lv [0]]);
							var ts = __left0__ [0];
							dir_val [d] = __left0__ [1];
							if (fmt == '') {
								break;
							}
						}
						var t = list ([1900, 1, 1, 0, 0, 0, 0, 1, -(1)]);
						var ignore_keys = list ([]);
						var have_weekday = false;
						var __iterable0__ = dir_val.py_items ();
						for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
							var __left0__ = __iterable0__ [__index0__];
							var d = __left0__ [0];
							var v = __left0__ [1];
							if (__in__ (d, ignore_keys)) {
								continue;
							}
							if (d == 'p') {
								continue;
							}
							if (__in__ (d, __lu.py_keys ())) {
								t [__lu [d]] = int (v);
								continue;
							}
							if (__in__ (d, tuple (['a', 'A', 'b', 'B']))) {
								var v = v.lower ();
							}
							if (d == 'm') {
								ignore_keys.append ('b');
								ignore_keys.append ('B');
							}
							if (d == 'a') {
								if (!(__in__ (v, __weekdays))) {
									var __except0__ = ValueError ('Weekday unknown in your locale');
									__except0__.__cause__ = null;
									throw __except0__;
								}
								var have_weekday = true;
								t [6] = __weekdays.index (v);
							}
							else if (d == 'A') {
								if (!(__in__ (v, __weekdays_long))) {
									var __except0__ = ValueError ('Weekday unknown in your locale');
									__except0__.__cause__ = null;
									throw __except0__;
								}
								var have_weekday = true;
								t [6] = __weekdays_long.index (v);
							}
							else if (d == 'b') {
								if (!(__in__ (v, __months))) {
									var __except0__ = ValueError ('Month unknown in your locale');
									__except0__.__cause__ = null;
									throw __except0__;
								}
								t [1] = __months.index (v) + 1;
							}
							else if (d == 'B') {
								if (!(__in__ (v, __months_long))) {
									var __except0__ = ValueError ('Month unknown in your locale');
									__except0__.__cause__ = null;
									throw __except0__;
								}
								t [1] = __months_long.index (v) + 1;
							}
							else if (d == 'I') {
								var ampm = dir_val ['p'] || 'am';
								var ampm = ampm.lower ();
								var v = int (v);
								if (v == 12) {
									var v = 0;
								}
								else if (v > 12) {
									var __except0__ = ValueError (((("time data '" + string) + "' does not match format '") + format) + "'");
									__except0__.__cause__ = null;
									throw __except0__;
								}
								if (ampm == 'pm') {
									v += 12;
								}
								t [__lu ['H']] = v;
							}
							else if (d == 'y') {
								t [0] = 2000 + int (v);
							}
							else if (d == 'Z') {
								if (__in__ (v.lower (), list (['gmt', 'utc']))) {
									t [-(1)] = 0;
								}
							}
						}
						var __date = new Date (0);
						__date.setUTCFullYear (t [0]);
						__date.setUTCMonth (t [1] - 1);
						__date.setUTCDate (t [2]);
						__date.setUTCHours (t [3]);
						t [7] = _day_of_year (__date);
						if (!(have_weekday)) {
							t [6] = __date.getUTCDay () - 1;
						}
						return t;
					};
					var strftime = function (format, t) {
						var zf2 = function (v) {
							if (v < 10) {
								return '0' + str (v);
							}
							return v;
						};
						if (!(t)) {
							var t = localtime ();
						}
						var f = format;
						var __iterable0__ = __lu.py_keys ();
						for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
							var d = __iterable0__ [__index0__];
							var k = '%' + d;
							if (!(__in__ (k, f))) {
								continue;
							}
							var v = zf2 (t [__lu [d]]);
							var f = f.py_replace (k, v);
						}
						var __iterable0__ = tuple ([tuple (['b', __months, 1]), tuple (['B', __months_long, 1]), tuple (['a', __weekdays, 6]), tuple (['A', __weekdays_long, 6])]);
						for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
							var __left0__ = __iterable0__ [__index0__];
							var d = __left0__ [0];
							var l = __left0__ [1];
							var pos = __left0__ [2];
							var p = t [pos];
							if (pos == 1) {
								var p = p - 1;
							}
							var v = l [p].capitalize ();
							var f = f.py_replace ('%' + d, v);
						}
						if (__in__ ('%p', f)) {
							if (t [3] > 11) {
								var ap = 'PM';
							}
							else {
								var ap = 'AM';
							}
							var f = f.py_replace ('%p', ap);
						}
						if (__in__ ('%y', f)) {
							var f = f.py_replace ('%y', str (t [0]).__getslice__ (-(2), null, 1));
						}
						if (__in__ ('%I', f)) {
							var v = t [3];
							if (v == 0) {
								var v = 12;
							}
							else if (v > 12) {
								var v = v - 12;
							}
							var f = f.py_replace ('%I', zf2 (v));
						}
						return f;
					};
					__pragma__ ('<all>')
						__all__.__d = __d;
						__all__.__date = __date;
						__all__.__jan_jun_tz = __jan_jun_tz;
						__all__.__lu = __lu;
						__all__.__months = __months;
						__all__.__months_long = __months_long;
						__all__.__name__ = __name__;
						__all__.__now = __now;
						__all__.__tzn = __tzn;
						__all__.__weekdays = __weekdays;
						__all__.__weekdays_long = __weekdays_long;
						__all__._day_of_year = _day_of_year;
						__all__._daylight = _daylight;
						__all__._daylight_in_effect = _daylight_in_effect;
						__all__._is_leap = _is_leap;
						__all__._jj = _jj;
						__all__._local_time_tuple = _local_time_tuple;
						__all__._lsplit = _lsplit;
						__all__._timezone = _timezone;
						__all__._tzname = _tzname;
						__all__._utc_time_tuple = _utc_time_tuple;
						__all__.altzone = altzone;
						__all__.asctime = asctime;
						__all__.ctime = ctime;
						__all__.daylight = daylight;
						__all__.gmtime = gmtime;
						__all__.i = i;
						__all__.l = l;
						__all__.localtime = localtime;
						__all__.mktime = mktime;
						__all__.s = s;
						__all__.strftime = strftime;
						__all__.strptime = strptime;
						__all__.time = time;
						__all__.timezone = timezone;
						__all__.tzname = tzname;
					__pragma__ ('</all>')
				}
			}
		}
	);
	(function () {
		var random = {};
		var time = {};
		var __name__ = '__main__';
		__nest__ (time, '', __init__ (__world__.time));
		__nest__ (random, '', __init__ (__world__.random));
		var hanFavor = 0;
		var chewFavor = 0;
		var r2Favor = 0;
		var c3Favor = 0;
		var lukeFavor = 0;
		var vaderFavor = 0;
		var landoFavor = 0;
		var fightAdvantage = 0;
		var runAdvantage = 0;
		var choiceDict = dict ({'choiceOne': 0, 'choiceTwo': 0, 'c3Returned': false, 'landoDead': false, 'hanDead': false, 'chewbaccaDead': false, 'landoJoins': false, 'vaderWounded': false, 'vaderDead': false, 'lukeDead': false, 'hitLuke': false, 'chanceShot': false, 'fightVader': false, 'leiaDead': false, 'leiaWounded': false});
		var printPauseLines = function (lines) {
			var __iterable0__ = lines;
			for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
				var __left0__ = __iterable0__ [__index0__];
				var line = __left0__ [0];
				var pause = __left0__ [1];
				print (line);
				time.sleep (pause);
			}
		};
		var askQuestionYesNo = function (question) {
			var answer = input (question + ' [y/n] ');
			return __in__ (answer, list (['y', 'Y', 'yes', 'YES', 'yes']));
		};
		var askQuestionAnswerChoices = function (question, listOfOptions) {
			for (var i = 0; i < len (listOfOptions); i++) {
				print (((str (i) + '.') + ' ') + lines);
			}
			var answer = int (input ('Select a option number'));
			return answer;
		};
		printPauseLines (list ([tuple (['', 0]), tuple (['These will be a list of controls for the game. Feel free to scroll up and reference these controls at anytime:', 0]), tuple (['Key for Yes: Press the letter y', 0]), tuple (['Key for No: Press the letter n', 0]), tuple (['Press the y or n key when prompted and then press enter to continue when asked questions.', 0]), tuple (['', 0])]));
		var pauseAns = askQuestionYesNo ('Do you want to have zero pauses between lines? This is mostly for debugging, but feel free to say yes if you want to play through the whole thing again without waiting.');
		if (pauseAns == true) {
			var zeroTime = 0;
			var oneTime = 0;
			var twoTime = 0;
			var threeTime = 0;
			var fourTime = 0;
			var fiveTime = 0;
		}
		else {
			var zeroTime = 0;
			var oneTime = 1 * 2;
			var twoTime = 2 * 2;
			var threeTime = 3 * 1.5;
			var fourTime = 4 * 1.5;
			var fiveTime = 5 * 2;
		}
		printPauseLines (list ([tuple (['', 0]), tuple (['Welcome to a very simple text based adventure game for Star Wars.', twoTime]), tuple (['Much of this will read like a short story with interactions at certain points.', twoTime]), tuple (['However, there are actually multiple endings to this story. This gives this replayability, and allows for multiple playthroughs that I encourage.', twoTime]), tuple (['To create a complex inventory system, more than X amount of branches, etc. is too much for a relatively novice programmer like me.', twoTime]), tuple (['Today, I will take you on an adventure that you may be familiar with that is set in a galaxy far, far away.', twoTime]), tuple (['This will be a really simple text-based adventure game set during Episode 5 -- The Empire Strikes Back.', twoTime]), tuple (['The scene we will be focusing on today is Cloud City. More specifically, we will be focusing on the fight against Darth Vader and changing events leading up to it.', twoTime]), tuple (["I really don't want to spoil the fun so let us get into it.", zeroTime]), tuple (['', 0])]));
		print ('');
		if (askQuestionYesNo ('Do you want to continue to the next section?') == true) {
			// pass;
		}
		else {
			// pass;
		}
		printPauseLines (list ([tuple (['', zeroTime]), tuple (['-----------------------------------------------------------------', zeroTime]), tuple (['', 0]), tuple (['A long time ago in a galaxy far,', zeroTime]), tuple (['far away...', fiveTime])]));
		print ('\n                  ________________.  ___     .______\n                 /                | /   \\    |   _  \n                 \\   \\    |  |    /  /_\\  \\  |      /\n            .-----)   |   |  |   /  _____  \\ |  |\\  \\-------.\n            |________/    |__|  /__/     \\__\\| _| `.________|\n             ____    __    ____  ___     .______    ________.\n             \\   \\  /  \\  /   / /   \\    |   _  \\  /        |\n              \\   \\/    \\/   / /  ^  \\   |  |_)  ||   (-----`\n               \\            / /  /_\\  \\  |      /  \\   \n                 \\__/  \\__/ /__/     \\__\\|__| `._______/\n        ');
		printPauseLines (list ([tuple (['', zeroTime]), tuple (['REBELLION! War between the Rebels and the Galatic Empire rages on after the destruction of the Death Star. Three years after the Battle of Yavin, the Empire ', fourTime]), tuple (["discovered the Rebels' operation base on Hoth. With a hasty evacuation, we find our heroes separated on different planets and journeys. Luke Skywalker is on Dagobah ", fourTime]), tuple (['training to become the next Jedi, and the rest of the crew -- Princess Leia, Chewbacca, Han Solo, R2-D2, and C-3P0 -- find themselves in Cloud City on the planet Bespin.', fourTime]), tuple (['However, they do not know the dangers that await them...', zeroTime])]));
		print ('');
		if (askQuestionYesNo ('Do you want to continue to the next section?') == true) {
			// pass;
		}
		else {
			// pass;
		}
		printPauseLines (list ([tuple (['', zeroTime]), tuple (['-----------------------------------------------------------------', zeroTime]), tuple (['', 0])]));
		print ("\n\n          //||   ||\\\n         // ||   || \\\n        //  ||___||  \\\n       /     |   |     \\    _\n      /    __|   |__    \\  /_\n    /.~ __\\  |   |  /   ~.|   |\n   /  /      \\|   |/ .-~    _.-'\n  |           +---+  \\  _.-~  |\n  `=----.____/  #  \\____.----='\n   [::::::::|  (_)  |::::::::]\n  .=----~~~~~\\     /~~~~~----=.\n  |          /`---'\\          |\n   \\  \\     /       \\     /  /\n    `.     /         \\     .'\n      `.  /._________.\\  .'\n        `--._________.--'\n        ");
		printPauseLines (list ([tuple (['', 0]), tuple (['Already landing on this docking pad made me feel uneasy. Han was confident his "friend" would allow us to freely land and greet us somewhat kindly, but I already had a bad feeling about this place.', twoTime]), tuple (['Watching from a distance, I see Han and Chewy wait as their friend -- Lando Calrissian -- approach them with a stern face. He was a smuggler just like Han, but he had settled down in Cloud City', threeTime]), tuple (['and gained influence here. When I saw Lando get close and suddenly move fast toward Han, I quickly readied myself for what was going to come. However, I found myself not needing to get myself worked up.', threeTime]), tuple (["Lando simply came in for a big hug. I didn't let my guard down though, something was telling me to be cautious. As I was thinking that, I found myself being called over together with R2-D2 and C-3PO", threeTime]), tuple (['to Lando.', oneTime])]));
		printPauseLines (list ([tuple (['', 0]), tuple (['Lando: Oh what do we have here... What do I have the pleasure of having this beautiful lady arriving at my facility?', twoTime]), tuple (['', 0]), tuple (['I relay my name -- Leia -- in a friendly but assertive tone.', oneTime]), tuple (['After saying my name, I realized this first introduction was the same as all others. He is looking at me, but only what he is interested in on the outside.', twoTime]), tuple (['Typical, treating me as a beauty and not paying to any other part of me other than what make men attracted to women.', twoTime]), tuple (["Why can't I just have an introduction that doesn't involve a person commenting on my looks? I use to take it as a compliment, but now I", twoTime]), tuple (['realize that most men are looking at me simply because of my looks. As this was running through my hand, I noticed Lando grab my hand and go for a kiss on my hand as a gesture.', twoTime]), tuple (['', 0])]));
		var acceptLandoGest = askQuestionYesNo ("Do you accept Lando's hand kiss gesture? You may not like the gesture, but there could be benefits and consequences with either option.");
		if (acceptLandoGest == true) {
			printPauseLines (list ([tuple (['', 0]), tuple (["Lando slowly kisses my hand looks back into my eyes. I catch out of the corner of my eye that Han looks away in disgust, but Lando doesn't see with the obvious", twoTime]), tuple (['smile on his face looking at me. He continues to talk to the whole group.', oneTime])]));
			landoFavor++;
			hanFavor--;
		}
		else {
			printPauseLines (list ([tuple (['', 0]), tuple (["I quickly and gracefully take my hand out of Lando's hand. His face shows for a couple of seconds a transition of realization, disbelief, and then embarrasment.", twoTime]), tuple (["I notice out of the corner of my eye a quick grin by Han that Lando doesn't see, but it disappears as Lando gets back on track and talks to the whole group.", twoTime])]));
			landoFavor--;
			hanFavor++;
		}
		printPauseLines (list ([tuple (['', 0]), tuple (["As Lando was talking to the whole crew, I couldn't pay full attention after seeing the men behind Lando with such serious faces that made me uneasy. I thought I caught a glimpse of a dark figure in the door behind him", twoTime]), tuple (['with a strange aura surrounding him, but before I could make anything of it, I got interrupted in thought by Lando with his loud voice. He was talking to all 5 of us, but he was looking directly at me', oneTime]), tuple (['', 0])]));
		if (landoFavor > 0) {
			print ('Lando: Well I am excitied to continue show you all around the facility and to your quarters.');
		}
		else {
			print ('Lando: Let us go ahead and um look through the facility, and then I can show you all your quarters.');
		}
		printPauseLines (list ([tuple (['', 0]), tuple (['After saying those words, we followed him into the facility to get a quick tour as we made our ways to our temporary quarters.', oneTime]), tuple (['Despite my instinct that this place spelled trouble, I felt like I had to delve deeper and I was attracted to this place. As if something bad, but siginifcant was about to occur soon...', twoTime]), tuple (['', 0])]));
		print ('');
		if (askQuestionYesNo ('Do you want to continue to the next section?') == true) {
			// pass;
		}
		else {
			// pass;
		}
		printPauseLines (list ([tuple (['', zeroTime]), tuple (['-----------------------------------------------------------------', zeroTime]), tuple (['', 0])]));
		print ('\n\n         /---\n        | @ @:|\n        |  " :|\n         \\_-_/\n       _.d._.b.__\n   +"i\\  |\\_/|  /i"+\n   [_| \\ |   | / |_]\n  .\' |  ):===:(  | `.\n  |:.\'+-" | | "-+`.:|\n  |_| |-. |_|   | |_|\n  \\:\\ |-\' /+\\   ! |:|\n   \\ \\|n._\\+/_.n| / /\n    \\XT::::-::::T/ /\n     "l-. `"\' .-lXX\n      |: \\   / :|\n      |:  i-i  :|\n      |:  | |  :| \n      |:  | |  :|\n     \\|;_ | |__;|/\n      (__() ()__)      \n      |:  | |  :|       \n\n    ');
		printPauseLines (list ([tuple (['', 0]), tuple (['Even though the interior looks just as nice the beautiful scenery ontop of the landing pad, the walls and machines passing by sent an unwelcoming chill through my body. I counted', twoTime]), tuple (['my steps and the doors around us as Han and Lando were talking and in the lead. However, in my own thought, I realized C-3PO and R2 were having their usual banter.', twoTime]), tuple (["I don't mind droids as much as other people. It seems Han, Chewy, and I were the only ones that seemed to truly like them. Oh I forgot someone -- Luke. He loves droids, especially R2-D2. I wonder what he is up to right now...", twoTime]), tuple (['Most other people view droids as a tool for their own use, but I think we feel much more emotion toward them. ', twoTime]), tuple (["Well I know Han isn't too fond of C-3PO. With all this thought of Luke and droids, I realize we have stopped.", twoTime]), tuple (['While Lando disappears into another room talking with other people, I see Han and Chewy walk toward the back of the group to talk to me while we wait here for him to return.', twoTime]), tuple (['', 0]), tuple (["Leia: So this was your fantastic idea, coming here? I guess we didn't have a real choice with the Empire and a bounty hunter chasing us, but this place still makes me feel uneasy.", twoTime]), tuple (["Han Solo: Relax Leia. I don't like this place either, but what what other choice do we have? Come on Chewy back me up.", twoTime]), tuple (['', 0]), tuple (["As Chewbacca replied, I realized something was wrong. I didn't hear the banter from the droids anymore. I quickly look over to where they were, but realized R2 is the only one there.", twoTime]), tuple (["I ask R2 where he went, but I couldn't get anything of it that I could understand. It seemed like Luke was the only person who could actually understand these droids...", twoTime]), tuple (['I dismiss the thought of Luke, and get to the task at hand. I hastily walk back over to Han and Chewy, and explain that C-3PO is gone.', twoTime]), tuple (['', 0]), tuple (["Han Solo: Do you think that we should go look for him? I'm sure we can just find him later. He probably is off babling his mouth off to some other droids or Lando's assistants.", twoTime]), tuple (['', 0])]));
		if (askQuestionYesNo ('Do you want to go and search for C-3PO? This may seem be a distraction, simple innocence by the droid, or something much more...') == true) {
			if (hanFavor > 0) {
				printPauseLines (list ([tuple (['Leia: I think that we should search for C-3P0!', oneTime]), tuple (["Han Solo: All right, well keep your voice down. I know that Lando won't like us snooping around. I will go with you.", oneTime]), tuple (['I have a bad feeling about this. Chewy, you go off and find Lando, and try to give us as much time as possible buddy until he realizes we are gone.', oneTime]), tuple (['R2, you are coming with us.', oneTime])]));
				r2Favor++;
				choiceDict ['choiceOne'] = 1;
			}
			else if (hanFavor < 0) {
				printPauseLines (list ([tuple (['Leia: I think we should search for C-3PO!', oneTime]), tuple (['Han Solo: Fine Princess, you go with R2 to search for 3PO. I will stay with Chewy and we will find Lando. Buy both you and R2 time to find the droid and get back here.', oneTime]), tuple (['Go ahead and get a move on.', oneTime])]));
				r2Favor++;
				hanFavor--;
				choiceDict ['choiceOne'] = 2;
			}
		}
		else {
			printPauseLines (list ([tuple (["Leia: I think it is best we don't trouble Lando for now. The place may be trouble, so we should wait it out and see any dangers. It could also be a safe place from the Empire", twoTime]), tuple (['so I think that this is another good reason not to potentially anger Lando right now.', oneTime]), tuple (["Han Solo: I agree. I don't trust Lando, he is my friend after all, but this is the best chance we have to have some safety from the Empire and that bounty hunter for however long we have.", twoTime])]));
			r2Favor--;
			hanFavor++;
			choiceDict ['choiceOne'] = 0;
		}
		print ('');
		if (askQuestionYesNo ('Do you want to continue to the next section?') == true) {
			// pass;
		}
		else {
			// pass;
		}
		printPauseLines (list ([tuple (['', zeroTime]), tuple (['-----------------------------------------------------------------', zeroTime]), tuple (['', 0])]));
		if (choiceDict ['choiceOne'] == 1) {
			printPauseLines (list ([tuple (['', 0]), tuple (['R2, Han, and I went off to find the droid. I felt bad for leaving Chewbacca behind to distract Lando, but it should only take a few moments to find him. I could still feel', twoTime]), tuple (['a sort of weight on me while traversing through this part of Cloud City. It seemed like everything was out of the reach of the Empire, which is true after all since the Empire has not taken control', twoTime]), tuple (["of this planet and city yet. However, ever person and character I encountered did not feel truly free. I can't quite describe it, but I got the sense of an oppression weighing down on the people. After", twoTime]), tuple (['walking around searching nooks, crannies, alleys, and other areas C-3PO might have been, I felt a sudden dread when I approached a fork leading into two paths. I heard footsteps on the left with the heaviness', twoTime]), tuple (['of droids, but the right path peaked my interest with a distant sound of a ship landing and heavy footsteps.', twoTime]), tuple (['', 0]), tuple (['Han Solo: So Princess, which way do you think C-3PO went? It seems like the left path with all the droid sounds coming over there. Maybe he wanted to talk to more droids or something.', twoTime]), tuple (['', 0])]));
			if (askQuestionYesNo ('Do you want to go on the left path where the droid sounds are? It is probably where C-3PO is, but you may discover more if you take the right path. Choose wisely.') == true) {
				printPauseLines (list ([tuple (['', 0]), tuple (['Leia: We should go left. I agree, it is our best bet of finding C-3PO, and I have a feeling there is too much danger on the other path.', twoTime])]));
				r2Favor++;
				hanFavor++;
				choiceDict ['choiceTwo'] = 1;
			}
			else {
				printPauseLines (list ([tuple (['', 0]), tuple (['Leia: Something is telling me to take the right path. Before you say anything, I know, C-3PO is probably to the left, but I think we need to investiage what is going on the other path. You two stay here and I will go on ahead.', twoTime])]));
				r2Favor--;
				fightAdvantage -= 2;
				choiceDict ['choiceTwo'] = 2;
			}
		}
		else if (choiceDict ['choiceOne'] == 2) {
			printPauseLines (list ([tuple (['', 0]), tuple (['R2 and I went off to find the droid. I felt bad for leaving Han and Chewbacca behind to distract Lando, but it should only take a few moments to find him. I could still feel', twoTime]), tuple (['a sort of weight on me while traversing through this part of Cloud City. It seemed like everything was out of the reach of the Empire, which is true after all since the Empire has not taken control', twoTime]), tuple (["of this planet and city yet. However, ever person and character I encountered did not feel truly free. I can't quite describe it, but I got the sense of an oppression weighing down on the people. After", twoTime]), tuple (['walking around searching nooks, crannies, alleys, and other areas C-3PO might have been, I felt a sudden dread when I approached a fork leading into two paths. I heard footsteps on the left with the heaviness', twoTime]), tuple (['of droids, but the right path peaked my interest with a distant sound of a ship landing and heavy footsteps.', twoTime]), tuple (['', 0]), tuple (['I came to a decision point. Should I go left toward the droid sounds or right toward this mystery?', twoTime]), tuple (['', 0])]));
			if (askQuestionYesNo ('Do you want to go on the left path where the droid sounds are? It is probably where C-3PO is, but you may discover more if you take the right path. Choose wisely.') == true) {
				printPauseLines (list ([tuple (['', 0]), tuple (['I decided to go left. It seemed that is where C-3PO might be and that is my objective for now. But I cannot shake the feeling of the other path, as I point my self left...', twoTime])]));
				r2Favor++;
				choiceDict ['choiceTwo'] = 1;
			}
			else {
				printPauseLines (list ([tuple (['', 0]), tuple (["I decided to go right, and I tell R2 to stay put. Even though my current objective is to find C-3PO, I can't shake the feeling and attraction I am feeling toward this other path...", twoTime])]));
				r2Favor--;
				choiceDict ['choiceTwo'] = 2;
			}
		}
		print ('');
		if (askQuestionYesNo ('Do you want to continue to the next section?') == true) {
			// pass;
		}
		else {
			// pass;
		}
		printPauseLines (list ([tuple (['', zeroTime]), tuple (['-----------------------------------------------------------------', zeroTime]), tuple (['', 0])]));
		print ('\n\n\n                                     /~\\                           \n                                    |o o)             \n                                    _\\=/_                          \n                    ___        #   /  _  \\   #                     \n                   /() \\        \\ //|/.\\|\\//                      \n                 _|_____|_       \\/  \\_/  \\/                       \n                | | === | |         |\\ /|                          \n                |_|  O  |_|         \\_ _/                          \n                 ||  O  ||          | | |                          \n                 ||__*__||          | | |                          \n                |~ \\___/ ~|         []|[]                          \n                /=\\ /=\\ /=\\         | | |                          \n________________[_]_[_]_[_]________/_]_[_\\_________________________\n\n');
		if (choiceDict ['choiceOne'] == 1 && choiceDict ['choiceTwo'] == 1) {
			printPauseLines (list ([tuple (['We find C-3PO, but in a terrible condition. He was broken up into multiple pieces. Ravaged and scavenged for parts and some of his parts blasted apart. I still believed that we could repair him, especially', twoTime]), tuple (["with the help of Chewy and Luke if we ever reunite. I couldn't take him back alone, but since Han was there we were able to do it together. We took him to the Falcon quickly afterwards,", twoTime]), tuple (['and then met back up with Chewbacca afterwards. Curiously enough, Lando did not seem to have returned even once since Han, R2, and I have been gone. So we just waited for him like nothing ever happened.', twoTime])]));
			r2Favor += 2;
			choiceDict ['c3Returned'] = true;
		}
		else if (choiceDict ['choiceOne'] == 2 && choiceDict ['choiceTwo'] == 1) {
			printPauseLines (list ([tuple (['R2 and I find C-3PO, but in a terrible condition. He was broken up into multiple pieces. Ravaged and scavenged for parts and some of his parts blasted apart. I still believed that we could repair him, especially', twoTime]), tuple (["with the help of Chewy and Luke if we ever reunite. I couldn't take him back alone, there were too many pieces and some too heavy for myself. Regretfully, I had to leave him in a realitvely safe location until", twoTime]), tuple (['I could come back later for him. R2 and I quickly went back to Chewbacca and Han. They told me, curiously enough, Lando did not seem to have returned even once since Han, R2, and I have been gone.', twoTime]), tuple (['So we just waited for him like nothing ever happened.', oneTime])]));
			r2Favor -= 2;
			choiceDict ['c3Returned'] = false;
		}
		if (choiceDict ['choiceTwo'] != 2) {
			printPauseLines (list ([tuple (['Lando came back from his talk soon afterwards. Despite our thoughts that we would be heading to our quarters, especially since it was late in the evening, he suggested that we should eat dinner.', twoTime]), tuple (['Before we could voice any objections or ask why, we found his men standing behind us and more men appear with him. They were ready to "escort" us to our what I am sure to be our lovely meal...', twoTime])]));
		}
		print ('');
		if (askQuestionYesNo ('Do you want to continue to the next section?') == true) {
			// pass;
		}
		else {
			// pass;
		}
		printPauseLines (list ([tuple (['', zeroTime]), tuple (['-----------------------------------------------------------------', zeroTime]), tuple (['', 0])]));
		print ("\n\n ____\n/___/\n |     _______\n |  ,-'       `-,\n | /             \n|]|_______________|\n| ||___       ___||\n| |    `-. .-'    |\n \\`-,    | |    ,-'\n  |  \\   | |   /  |\n  |   \\  | |  /   |\n  |    | | | |    |\n  |,_  | | | |  _,|\n     `-|_|-|_|-'\n\n      ");
		if (choiceDict ['choiceTwo'] != 2 && landoFavor <= 0) {
			printPauseLines (list ([tuple (['', 0]), tuple (['We got to the door of the dinning hall. I already knew something bad was about to happen, but before I could stop or voice any sort of concern I was frozen in fear. I felt this fear before, this aura before,', twoTime]), tuple (['on the Death Star when I was imprisioned. And this fear was the aura I felt earlier when on the landing pad... I realized too late the real danger we were in when Lando opened the door.', twoTime]), tuple (['There sitting at the head of the table was Darth Vader in his menacing suit. More machine than man in a twisted way. Next to him was Boba Fett, the bounty hunter that has been chasing up.', twoTime]), tuple (["All of our eyes lit up and Han immediatley pulled out his blaster to shoot Darth Vader, but he deflected the shots and took Han's blaster. With a squad of stormtroopers appearing behind us.", twoTime])]));
			if (hanFavor > 0) {
				printPauseLines (list ([tuple (['', 0]), tuple (['Darth Vader: I am glad all of you can join us.', oneTime]), tuple (['Lando: They arrived right before you did. I am sorry, there is nothing that I could do.', oneTime]), tuple (['Darth Vader: Fett, go ahead and collect your prize. Troopers, transport the Princess, the Wookiee, and the droids to our ship. They have served their purpose. Now I must go and meet a certain someone.', twoTime]), tuple (['', 0]), tuple (['I knew immediately that he meant Luke. That is what the ship landing was earlier, and I am sure he wanted revenge on him destroying his base. I had to get to him. Darth Vader disappeared and we were being escorted', twoTime]), tuple (['by Boba Fett and some stormtroopers. I signaled Han and the others that we would try to fight them. As we turned the corner, Chewbacca let out a mighty Wookiee roar, distracting everyone. Han knocked out the', twoTime]), tuple (['bounty hunter Fett, then we finished up the rest of them while Lando ran off. I discussed with them that I know Luke was here, fighting Vader, and I knew I had to go get him. While Han protested, looking at me with', twoTime]), tuple (['endearing and concerned eyes, he finally gave up and listened to me. I told them that they should go to the ship, prepare it, and get ready to pick up me and Luke.', twoTime]), tuple (["Now I was alone and I followed Vader, he didn't go too far. He was pretty slow with all the machinery. I found him entering a dark room, and I paused before I entered. I knew that these next few moments will determine the fate", twoTime]), tuple (['of the crew and the galaxy.', oneTime])]));
				choiceDict ['landoDead'] = true;
			}
			else if (hanFavor <= 0) {
				printPauseLines (list ([tuple (['', 0]), tuple (['Darth Vader: I am glad all of you can join us.', oneTime]), tuple (['Lando: They arrived right before you did. I am sorry, there is nothing that I could do.', oneTime]), tuple (['Darth Vader: Fett, go ahead and collect your prize. Troopers, transport the Princess, the Wookiee, and the droids to our ship. They have served their purpose. Now I must go and meet a certain someone.', twoTime]), tuple (['', 0]), tuple (['I knew immediately that he meant Luke. That is what the ship landing was earlier, and I am sure he wanted revenge on him destroying his base. I had to get to him. Darth Vader disappeared and we were being escorted', twoTime]), tuple (['by Boba Fett and some stormtroopers. I signaled Han and the others that we would try to fight them. As we turned the corner, Chewbacca let out a mighty Wookiee roar, distracting everyone. Han should have went for the', twoTime]), tuple (["bounty hunter Fett first, but he I saw him immedaitley go to Lando. He gets a good blaster shot to Lando's back as he ran away, but he took too distractred and Boba Fett got shot Han. A moment of shock went across everyone.", twoTime]), tuple (['Chewy immediatley went toward the bounty hunter, and despite getting shot multiple times by him, tore his limbs apart as a raging wookiee would. He quickly fell to the floor though, and it was just me and R2 left.', twoTime]), tuple (['Despite being filled with grief and anger, I told R2 to go to the ship and prep it while I go off to find Luke and stop Vader. I quickly pursued Darth Vader and found him entering a dark room. I paused before I entered.', twoTime]), tuple (['since I knew that these next few moments would be fateful.', oneTime])]));
				choiceDict ['landoDead'] = true;
				choiceDict ['hanDead'] = true;
				choiceDict ['chewbaccaDead'] = true;
			}
		}
		else if (choiceDict ['choiceTwo'] != 2 && landoFavor >= 0) {
			printPauseLines (list ([tuple (['', 0]), tuple (['A few moments before we got to the door to the dinning hall. We suddenly stop and Lando turns around to tell us what is about to happen. He explains the Empire arrived before us, and have been using us as bait to attract', twoTime]), tuple (['Luke to Cloud City so Darth Vader could capture him. Realizing the danger we were in, I told them that I had to go off and find Luke and stop Vader. While Han protested, beliving that we should fight him together', twoTime]), tuple (['he finally gave up and listened to me. I told them that they should go to the ship, prepare it, and get ready to pick up me and Luke.', twoTime]), tuple (['Now I was alone and I followed Vader. I remember hearing the area where the ship landed earlier, and I found Vader entering a dark room, and I paused before I entered. I knew that these next few moments will determine the fate', twoTime]), tuple (['of the crew and the galaxy.', oneTime])]));
		}
		if (choiceDict ['choiceTwo'] == 2) {
			printPauseLines (list ([tuple (['I followed down the right path and I encountered a dark figure entering an equally dark room. The door slamming behind him sounded just like any other door, but it echoed in my mind danger.', twoTime]), tuple (['I still pursued onwards till I reached the door. I paused before I entered since I knew that these next few moments would be fateful.', oneTime])]));
		}
		print ('');
		if (askQuestionYesNo ('Do you want to continue to the next section?') == true) {
			// pass;
		}
		else {
			// pass;
		}
		printPauseLines (list ([tuple (['', zeroTime]), tuple (['-----------------------------------------------------------------', zeroTime]), tuple (['', 0])]));
		print ("\n\n                                   __          __        _.xxxxxx.\n                   [xxxxxxxxxxxxxx|##|xxxxxxxx|##|xxxxxxXXXXXXXXX|\n   ____            [XXXXXXXXXXXXXXXXXXXXX/.\\||||||XXXXXXXXXXXXXXX|\n  |::: `-------.-.__[=========---___/::::|::::::|::::||X O^XXXXXX|\n  |::::::::::::|2|%%%%%%%%%%%%\\::::::::::|::::::|::::||X /\n  |::::,-------|_|~~~~~~~~~~~~~`---=====-------------':||  5\n   ~~~~                       |===|:::::|::::::::|::====:\\O\n                              |===|:::::|:.----.:|:||::||:|\n                              |=3=|::4::`'::::::`':||__||:|\n                              |===|:::::::/  ))\\:::`----':/\n                              `===|::::::|  // //~`######b\n                                  `--------=====/  ######B\n                                                   `######b\n                                                    #######b\n                                                    #######B\n                                                    `#######b\n                                                     #######P\n                                                      `#####B\n    ");
		printPauseLines (list ([tuple (['', 0]), tuple (['I entered the dark room steeling myself for whatever was to come. I traced my eyes around the room. Fog from pipes was filling parts of this enormous room, in the center there was a circle that seemed like it could fit a person.', twoTime]), tuple (['While I was scanning the room, I hear the sound of two blades come to life. One blue light and one red light bleeding throughout the room from two sources on the other side of the room. I quickly made my way over there', twoTime]), tuple (['with blaster in hand.', twoTime]), tuple (['As I approach my eyes adjust to the darkness of the room. I can hear the blades crashing against each other, and the grunting of a young man and a machine fighting each other.', twoTime]), tuple (['I get closer and I noticed they do not sense my presence. Both are too engrossed in their battle. Adrenaline rushing through me and fear holing me, I have to decide whether I should use my blaster.', twoTime]), tuple (['', 0])]));
		if (askQuestionYesNo ('Do you choose to aim and shoot your blaster at Vader? You could hit Vader, potentially killing him or at least wounding him and allowing you and Luke to escape; however, you may miss or hit Luke. Choose wisely.') == true) {
			choiceDict ['chanceShot'] = true;
			var chanceHit = random.randint (0, 8);
			if (chanceHit == 0) {
				printPauseLines (list ([tuple (['', 0]), tuple (['You let your emotion from this whole adventure and this fear present in you get to you right now. You hit Luke, and he turns around with a shock on his face, and then falls over.', twoTime])]));
				choiceDict ['lukeDead'] = true;
				choiceDict ['hitLuke'] = true;
			}
			else if (chanceHit == 8) {
				var chanceHitTwo = random.randint (0, 8);
				if (chanceHitTwo == 8) {
					printPauseLines (list ([tuple (['', 0]), tuple (['Despite all odds, fear, you let your emotions go and concentrate. You hit Darth Vader in his most vital part by surprise. It appears to have killed him. Luke turns around and you slowly lower your blaster.', twoTime]) ('', 0)]));
					choiceDict ['lukeDead'] = false;
					choiceDict ['vaderDead'] = true;
				}
				else {
					printPauseLines (list ([tuple (['', 0]), tuple (['You are able to deal with this pressure and are able to concentrate greatly. You hit Darth Vader, and he appears to be stunned. Vader falls over and seems to be wounded. Luke turns around and you slowly lower your blaster.', twoTime]), tuple (['', 0])]));
					choiceDict ['lukeDead'] = false;
					choiceDict ['vaderWounded'] = true;
				}
			}
			else {
				printPauseLines (list ([tuple (['', 0]), tuple (["You let a blaster shot out, but it is without precision. It misses both of them, but this proves fatal to Luke. Darth Vader slices through Luke like bread, and the latter's lightsaber rolls toward you.", twoTime]), tuple (['', 0])]));
				choiceDict ['lukeDead'] = true;
			}
		}
		else {
			printPauseLines (list ([tuple (['', 0]), tuple (['You lower your weapon, but this proved to be fatal. There was a pause in the battle, and both Vader and Luke sense that you are there. This distracts Luke as he turns around to call to you, but Darth Vader uses', twoTime]), tuple (['this opportunity to slice through Luke like bread.', oneTime]), tuple (['', 0])]));
			choiceDict ['lukeDead'] = true;
			choiceDict ['chanceShot'] = false;
		}
		print ('');
		if (askQuestionYesNo ('Do you want to continue to the next section?') == true) {
			// pass;
		}
		else {
			// pass;
		}
		printPauseLines (list ([tuple (['', zeroTime]), tuple (['-----------------------------------------------------------------', zeroTime]), tuple (['', 0])]));
		print ('\n\n          _________\n          III| |III\n        IIIII| |IIIII\n       IIIIII| |IIIIII\n       IIIIII| |IIIIII\n      IIIIIII| |IIIIIII\n      IIIIIII\\ /IIIIIII\n     II (___)| |(___) II\n    II  \\    /D\\    /  II\n   II  \\ \\  /| |\\  / /  II\n  II    \\_\\/|| ||\\/_/    II\n II     / O-------O \\     II\nII_____/   \\|||||/   \\_____II\n      /               \n    ');
		if (choiceDict ['lukeDead'] == true) {
			if (choiceDict ['hitLuke'] == true) {
				printPauseLines (list ([tuple (['Luke: Le--', oneTime]), tuple (['', 0]), tuple (["Luke's separated parts fall down the stairs before me. His blue lightsaber seemed to have turned off and rolled to my feet. I was staring down at his pieces and saber when I suddenly looked up due to the immense", twoTime]), tuple (['feeling coming from the top of the stairs. I realize what has happened, and I get hit in the gut with dread. What have I just done? Fear, anger, and doubt are starting to fill me. Fear most of all. I know I need', twoTime]), tuple (['to get out of here. I am going to run and get back to the others.', twoTime])]));
				choiceDict ['fightVader'] = false;
			}
			else if (choiceDict ['chanceShot'] == true) {
				printPauseLines (list ([tuple (['Luke: Le--', oneTime]), tuple (['', 0]), tuple (["Luke's separated parts fall down the stairs before me. His blue lightsaber seemed to have turned off and rolled to my feet. I was staring down at his pieces and saber when I suddenly looked up due to the immense", twoTime]), tuple (['feeling coming from the top of the stairs. Despite not being able to see his eyes, Darth Vader was staring me down and I was frozen. Despite what I had happened, I knew I had to make a choice. Luke always believed', twoTime]), tuple (['in the Force. Maybe this was my time to pick up the mantle. He once told me that the great Jedi Knight Obi-Wan said that the Force flows through all. Maybe I should let it flow through me.', twoTime]), tuple (["It could be the key to my sucess in this battle, and I think Darth Vader knows feels the Force flowing through me. However, even though I discovered this now, I don't really know how to control it. I could leave and make", twoTime]), tuple (['a hasty retreat. Do I run or do I stay and fight this monster?', oneTime])]));
				if (choiceDict ['choiceTwo'] == 2) {
					print ('');
					print ('You came in here without any knowledge what may happen to you. This makes you more unprepared despite whatever choice you make.');
					fightAdvantage--;
					runAdvantage--;
				}
				print ('');
				if (askQuestionYesNo ('Do you choose to take up the lightsaber and fight Vader? Or would you rather live to fight another day after seeing his power? Enter y to fight or n to retreat.') == true) {
					printPauseLines (list ([tuple (["Despite the fear in the air weighing in, you grab the lightsaber. Even though you have never picked up a lightsaber, you feel like you've been through this before. Because you took the shot, you are feeling", twoTime]), tuple (['fully confident and you can feel the force flow through you.', oneTime])]));
					choiceDict ['fightVader'] = true;
					fightAdvantage += 2;
				}
				else {
					printPauseLines (list ([tuple (["You do not want to let Luke's death to be in vain. You choose to run, but not so you can cower rather you choose to run to fight another day. However, it will be more tough for you to escape since you took the shot", twoTime])]));
					choiceDict ['fightVader'] = false;
					runAdvantage--;
				}
			}
			else if (choiceDict ['chanceShot'] == false) {
				printPauseLines (list ([tuple (['Luke: Le--', oneTime]), tuple (['', 0]), tuple (["Luke's separated parts fall down the stairs before me. His blue lightsaber seemed to have turned off and rolled to my feet. I was staring down at his pieces and saber when I suddenly looked up due to the immense", twoTime]), tuple (['feeling coming from the top of the stairs. Despite not being able to see his eyes, Darth Vader was staring me down and I was frozen. Despite what I had happened, I knew I had to make a choice. Luke always believed', twoTime]), tuple (['in the force. Maybe this was my time to pick up the mantle, he once told me that the great Jedi Knight Obi-Wan said that the force flows through all. Maybe I should let it flow through me.', twoTime]), tuple (["It could be the key to my sucess in this battle, and I think Darth Vader knows feels the Force flowing through me. However, even though I discovered this now, I don't really know how to control it. I could leave and make", twoTime]), tuple (['a hasty retreat. Do I run or do I stay and fight this monster?', oneTime])]));
				print ('');
				if (askQuestionYesNo ('Do you choose to take up the lightsaber and fight Vader? Or would you rather live to fight another day after seeing his power?') == true) {
					printPauseLines (list ([tuple (["Despite the fear in the air weighing in, you grab the lightsaber. Even though you have never picked up a lightsaber, you feel like you've been through this before. You are confident and you can feel the Force flow through you.", twoTime]), tuple (['However, since you did not take the shot, you have some doubt in the back of your head that will affect you in your fight.', twoTime])]));
					choiceDict ['fightVader'] = true;
					fightAdvantage--;
				}
				else {
					printPauseLines (list ([tuple (["You do not want to let Luke's death to be in vain. You choose to run, but not so you can cower. You choose to run to fight another day. Since you did not take the shot, there is a better opportunity for you", twoTime]), tuple (['to make a run for it', oneTime])]));
					choiceDict ['fightVader'] = false;
					runAdvantage += 2;
				}
			}
		}
		print ('');
		if (askQuestionYesNo ('Do you want to continue to the last section (epilouge)?') == true) {
			// pass;
		}
		else {
			// pass;
		}
		printPauseLines (list ([tuple (['', zeroTime]), tuple (['-----------------------------------------------------------------', zeroTime]), tuple (['', 0])]));
		print ('\n\n               .-~|\n              /   |\n       =============\n        |         |\n        |         |\n        |         |\n        \\---------/\n         )-------(\n         (-------)\n         )-------(\n         (-------)\n         )-------(\n         (-------)\n         )-------(--+\n        /---------\\ |\n        | | | | | | |\n        | | | | | | |\n        | | | | | | |\n        | | | | | |-+\n        | | | | | |\n        | | | | | |\n        | | | | | |\n        | | | | | |\n        | | | | | |\n        | | | | | |\n        | | | | | |\n        | | | | | |\n        |_|_|_|_|_|\n\n    ');
		if (choiceDict ['lukeDead'] == false) {
			if (choiceDict ['vaderDead'] == true) {
				printPauseLines (list ([tuple (['You and Luke reunite and embrace each other. Both of you quickly still realize there is danger here, and so you quickly leave to join the others on the Falcon. With Darth Vader dead, you have scored a tremendous victory', twoTime]), tuple (['against all odds. You triumphently return to the ship with Luke, you have a positive outlook on what awaits next...', twoTime])]));
			}
			else if (choiceDict ['vaderWounded'] == true) {
				printPauseLines (list ([tuple (['You and Luke reunite and embrace each other. Both of you quickly still realize there is danger here, and so you quickly leave to join the others on the Falcon. With Darth Vader wounded, you have scored a great victory', twoTime]), tuple (['against all odds. You know that you and your friends are not completely safe, but you do not want to sour your recent victory. You triumphently return to the ship with Luke, you have a positive outlook on what awaits next...', twoTime])]));
			}
		}
		if (choiceDict ['fightVader'] == true) {
			var chanceWin = random.randint (0, 10);
			var chanceWin = chanceWin + fightAdvantage;
			if (chanceWin > 8) {
				printPauseLines (list ([tuple (['You choose to fight Vader. A valiant choice with an equal valiant effort. You feel the force flow through you, and, despite this being the first time you picked up the weapon, the lightsaber feels like an extension of your body.', twoTime]), tuple (['You battle for what felt like hours when really it lasted 5 minutes. You are able to wear him out, and are able to mortally wound him. You realize the battle is over, and you quickly retreat with your new found lightsaber and powers in the Force.', twoTime]), tuple (["You scored a major victory against the Empire, against all odds. You defeated the great Darth Vader. The Emperor's monster who has terroized the people and hunted the Jedi for ages. Now, you leave the room, but what happens", twoTime]), tuple (['next remains to be seen...', twoTime])]));
				choiceDict ['vaderDead'] = true;
			}
			else {
				printPauseLines (list ([tuple (['You choose to fight Vader. A valiant effort. You feel the force flow through you, and, despite this being the first time you picked up the weapon, the lightsaber feels like an extension of your body. You battle for what felt like hours', twoTime]), tuple (['However, you realize that you are still too much of a novice and get worn out. The veteran Darth Vader takes the upperhand and is able to cut off your hand which was holding the lightsaber. Despite being in great pain,', twoTime]), tuple (['you realize the battle is over for you. You are able to find a quick escape. Somehow you are able to find the Falcon, and you climb aboard.', twoTime]), tuple (['But you are wounded physically, emotionally, and you have taken a wound to your pride. What awaits next remains to be seen...', twoTime])]));
				choiceDict ['leiaWounded'] = true;
			}
		}
		else if (choiceDict ['fightVader'] == false && choiceDict ['lukeDead'] == true) {
			printPauseLines (list ([tuple (['', 0]), tuple (['As you are preparing to leave you notice that Luke lightsaber is still very close to you. You can choose to pick it up, but time is precious since you are trying to get away from this monster.', twoTime])]));
			if (askQuestionYesNo ("Do you choose to pick up the lightsaber? You don't encounter these every day, and this could help in the future in the war against the Empire. However, this could also cost you your life.") == true) {
				printPauseLines (list ([tuple (['', 0]), tuple (['You choose to take it. You know that this is an important relic of the past that will still greatly help the future. You believe that there are other force wielders out there, and you know this will be a great asset.', twoTime])]));
				runAdvantage--;
			}
			else {
				printPauseLines (list ([tuple (['', 0]), tuple (['You choose to leave it behind. You place a need to escape more important than some material object.', twoTime])]));
				runAdvantage++;
			}
			var chanceRun = random.randint (0, 10);
			var chanceRun = chanceRun + runAdvantage;
			if (chanceRun > 5) {
				printPauseLines (list ([tuple (['You choose to run from Vader. A wise choice as you know that his power is far too great, and there would be a great risk of failure if you attack. You are able to dodge objects that he is throwing with great power and reach', twoTime]), tuple (['the door. As he is trying to close the door with the Force, you are able to sprint and jump outside. Knowing that you can outrun him, you sprint all the way back to the ship where the rest await. As you get on the Falcon, the', twoTime]), tuple (["adrenaline dies down, and you realize what has transpired. You sit on the ship's ramp in grief and you truly do not know what awaits you in the future...", twoTime])]));
			}
			else {
				printPauseLines (list ([tuple (['You choose to run from Vader. A wise choice as you know that his power is far too great, and there would be a great risk of failure if you attack. You are able to dodge objects that he is throwing with great power and reach', twoTime]), tuple (['the door. However, as the door reaches ever so close, a piece of shrapnel from metal pierces your leg. You let out a great cry in pain, and Darth Vader approaches you. With the realization what is going to happen next,', twoTime]), tuple (['you close your eyes and wonder what will happen to your friends as the piercing sound of the lightsaber reaches ever closer to you...', twoTime])]));
				choiceDict ['leiaDead'] = true;
			}
		}
		print ('');
		if (askQuestionYesNo ('Do you want to continue to the next section (credits and list of decisions made)?') == true) {
			// pass;
		}
		else {
			// pass;
		}
		print ('');
		printPauseLines (list ([tuple (['', zeroTime]), tuple (['-----------------------------------------------------------------', zeroTime]), tuple (['', 0])]));
		printPauseLines (list ([tuple (['', 0]), tuple (['That is the end of the game! I hope you enjoyed it and feel free to replay through it to see if you get a different outcome! I believe there are 4 different endings, and various choices in between that affect which ending you get.', 0]), tuple (['Please let me know what you think of the game! Email me at jpaz7@gatech.edu if you have any suggestion or really enjoyed it. Thank you for playing!', 0]), tuple (['Credits and Behind the Scenes Statistics:', 0]), tuple (['-Programmed in Python 3.6', 0]), tuple (['-Programmed, created, and written by Jeramie Paz', 0]), tuple (['-More than 5,000 words in the code (due to different branches/choices) according to Microsoft Word', 0]), tuple (['-Over 1000 lines of code (1008)', 0]), tuple (['-ASCII Star Wars art found online at: http://www.chris.com/ascii/index.php?art=movies/star%20wars', 0]), tuple (['', 0]), tuple (["-Author's Note: There is more I wanted to do, such as making Han going with you more significant if you go off to find C-3PO, but that would have easily added on like 200 more lines of code and it would make it too complex.", 0]), tuple (['I hope to add it in the future if I polish this up. Also, I know for sure there are many spelling and grammar mistakes so I will go ahead and apologize for that.', 0]), tuple (['', 0]), tuple (['*If you replay through this, then just note that certain choices help your chances at the end or even change it overall. Email me if you like to know about all the various endings.', 0]), tuple (["*Depending on certain choices you've made and your luck in the shot with against Darth Vader, you may have skipped literally a little over a third of the game.", 0]), tuple (['', 0]), tuple (['I will now list off all the choice/options that were avaliable to potential get your mind going if you do a replay!', 0])]));
		if (choiceDict ['choiceOne'] == 1) {
			print ('Because you did not let Lando kiss your hand, Han went with you and R2 to find C-3PO.');
		}
		if (choiceDict ['choiceOne'] == 2) {
			print ('Because you did let Lando kiss your hand, Han did not go with you and R2 to find C-3P0.');
		}
		if (choiceDict ['choiceOne'] == 0) {
			print ('You did not choose to search for C-3PO.');
		}
		if (choiceDict ['choiceTwo'] == 1) {
			print ('You chose to stick to the objective and find C-3PO by taking the left path.');
		}
		if (choiceDict ['choiceTwo'] == 2) {
			print ('You chose to let curiosty get to you and took the right path to where danger awaited.');
		}
		if (choiceDict ['landoDead'] == false) {
			print ('Lando did not die.');
		}
		else {
			print ('Lando died.');
		}
		if (choiceDict ['hanDead'] == false) {
			print ('Han Solo did not die.');
		}
		else {
			print ('Han Solo died.');
		}
		if (choiceDict ['chewbaccaDead'] == false) {
			print ('Chewbacca did not die.');
		}
		else {
			print ('Chewbacca died.');
		}
		if (choiceDict ['landoJoins'] == false) {
			print ('Lando did not help and did not join the crew.');
		}
		else {
			print ('Lando did help before reaching Darth Vader and did join the crew.');
		}
		if (choiceDict ['vaderWounded'] == true) {
			print ('Vader was wounded by Leia.');
		}
		if (choiceDict ['vaderDead'] == true) {
			print ('Darth Vader died at the hands of Leia');
			print ('Note: This was a very very very slim chance this happened. If this did, congrats!');
		}
		if (choiceDict ['chanceShot'] == true) {
			print ('You decided to take the shot against Darth Vader.');
		}
		else if (choiceDict ['hitLuke'] == true) {
			print ('You decided to run out of grief and fear for hitting Luke.');
		}
		else {
			print ('You decided to not take the shot against Darth Vader.');
		}
		if (choiceDict ['lukeDead'] == true) {
			print ('Luke died either by blaster shot or Darth Vader.');
		}
		if (choiceDict ['fightVader'] == true) {
			print ('You chose to fight Darth Vader.');
		}
		else {
			print ('You decided to run from the fight against Vader.');
		}
		if (choiceDict ['leiaWounded'] == true) {
			print ('You were wounded emotionally, mentally, and physically by Darth Vader.');
		}
		if (choiceDict ['leiaDead'] == true) {
			print ('You died at the hands of Darth Vader.');
		}
		print ('');
		if (askQuestionYesNo ('Do you want to stop this program?') == true) {
			// pass;
		}
		else {
			// pass;
		}
		__pragma__ ('<use>' +
			'random' +
			'time' +
		'</use>')
		__pragma__ ('<all>')
			__all__.__name__ = __name__;
			__all__.acceptLandoGest = acceptLandoGest;
			__all__.askQuestionAnswerChoices = askQuestionAnswerChoices;
			__all__.askQuestionYesNo = askQuestionYesNo;
			__all__.c3Favor = c3Favor;
			__all__.chanceHit = chanceHit;
			__all__.chanceHitTwo = chanceHitTwo;
			__all__.chanceRun = chanceRun;
			__all__.chanceWin = chanceWin;
			__all__.chewFavor = chewFavor;
			__all__.choiceDict = choiceDict;
			__all__.fightAdvantage = fightAdvantage;
			__all__.fiveTime = fiveTime;
			__all__.fourTime = fourTime;
			__all__.hanFavor = hanFavor;
			__all__.landoFavor = landoFavor;
			__all__.lukeFavor = lukeFavor;
			__all__.oneTime = oneTime;
			__all__.pauseAns = pauseAns;
			__all__.printPauseLines = printPauseLines;
			__all__.r2Favor = r2Favor;
			__all__.runAdvantage = runAdvantage;
			__all__.threeTime = threeTime;
			__all__.twoTime = twoTime;
			__all__.vaderFavor = vaderFavor;
			__all__.zeroTime = zeroTime;
		__pragma__ ('</all>')
	}) ();
   return __all__;
}
window ['A3TextAdventureSW'] = A3TextAdventureSW ();
