! function(e) {
    if ("object" == typeof exports && "undefined" != typeof module) module.exports = e();
    else if ("function" == typeof define && define.amd) define([], e);
    else {
        ("undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this).localforage = e()
    }
}(function() {
    return function e(t, n, r) {
        function o(a, u) {
            if (!n[a]) {
                if (!t[a]) {
                    var s = "function" == typeof require && require;
                    if (!u && s) return s(a, !0);
                    if (i) return i(a, !0);
                    var c = new Error("Cannot find module '" + a + "'");
                    throw c.code = "MODULE_NOT_FOUND", c
                }
                var l = n[a] = {
                    exports: {}
                };
                t[a][0].call(l.exports, function(e) {
                    var n = t[a][1][e];
                    return o(n || e)
                }, l, l.exports, e, t, n, r)
            }
            return n[a].exports
        }
        for (var i = "function" == typeof require && require, a = 0; a < r.length; a++) o(r[a]);
        return o
    }({
        1: [function(e, t, n) {
            (function(e) {
                "use strict";
                var n, r, o = e.MutationObserver || e.WebKitMutationObserver;
                if (o) {
                    var i = 0,
                        a = new o(l),
                        u = e.document.createTextNode("");
                    a.observe(u, {
                        characterData: !0
                    }), n = function() {
                        u.data = i = ++i % 2
                    }
                } else if (e.setImmediate || void 0 === e.MessageChannel) n = "document" in e && "onreadystatechange" in e.document.createElement("script") ? function() {
                    var t = e.document.createElement("script");
                    t.onreadystatechange = function() {
                        l(), t.onreadystatechange = null, t.parentNode.removeChild(t), t = null
                    }, e.document.documentElement.appendChild(t)
                } : function() {
                    setTimeout(l, 0)
                };
                else {
                    var s = new e.MessageChannel;
                    s.port1.onmessage = l, n = function() {
                        s.port2.postMessage(0)
                    }
                }
                var c = [];

                function l() {
                    var e, t;
                    r = !0;
                    for (var n = c.length; n;) {
                        for (t = c, c = [], e = -1; ++e < n;) t[e]();
                        n = c.length
                    }
                    r = !1
                }
                t.exports = function(e) {
                    1 !== c.push(e) || r || n()
                }
            }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        }, {}],
        2: [function(e, t, n) {
            "use strict";
            var r = e(1);

            function o() {}
            var i = {},
                a = ["REJECTED"],
                u = ["FULFILLED"],
                s = ["PENDING"];

            function c(e) {
                if ("function" != typeof e) throw new TypeError("resolver must be a function");
                this.state = s, this.queue = [], this.outcome = void 0, e !== o && m(this, e)
            }

            function l(e, t, n) {
                this.promise = e, "function" == typeof t && (this.onFulfilled = t, this.callFulfilled = this.otherCallFulfilled), "function" == typeof n && (this.onRejected = n, this.callRejected = this.otherCallRejected)
            }

            function d(e, t, n) {
                r(function() {
                    var r;
                    try {
                        r = t(n)
                    } catch (t) {
                        return i.reject(e, t)
                    }
                    r === e ? i.reject(e, new TypeError("Cannot resolve promise with itself")) : i.resolve(e, r)
                })
            }

            function f(e) {
                var t = e && e.then;
                if (e && ("object" == typeof e || "function" == typeof e) && "function" == typeof t) return function() {
                    t.apply(e, arguments)
                }
            }

            function m(e, t) {
                var n = !1;

                function r(t) {
                    n || (n = !0, i.reject(e, t))
                }

                function o(t) {
                    n || (n = !0, i.resolve(e, t))
                }
                var a = p(function() {
                    t(o, r)
                });
                "error" === a.status && r(a.value)
            }

            function p(e, t) {
                var n = {};
                try {
                    n.value = e(t), n.status = "success"
                } catch (e) {
                    n.status = "error", n.value = e
                }
                return n
            }
            t.exports = c, c.prototype.catch = function(e) {
                return this.then(null, e)
            }, c.prototype.then = function(e, t) {
                if ("function" != typeof e && this.state === u || "function" != typeof t && this.state === a) return this;
                var n = new this.constructor(o);
                this.state !== s ? d(n, this.state === u ? e : t, this.outcome) : this.queue.push(new l(n, e, t));
                return n
            }, l.prototype.callFulfilled = function(e) {
                i.resolve(this.promise, e)
            }, l.prototype.otherCallFulfilled = function(e) {
                d(this.promise, this.onFulfilled, e)
            }, l.prototype.callRejected = function(e) {
                i.reject(this.promise, e)
            }, l.prototype.otherCallRejected = function(e) {
                d(this.promise, this.onRejected, e)
            }, i.resolve = function(e, t) {
                var n = p(f, t);
                if ("error" === n.status) return i.reject(e, n.value);
                var r = n.value;
                if (r) m(e, r);
                else {
                    e.state = u, e.outcome = t;
                    for (var o = -1, a = e.queue.length; ++o < a;) e.queue[o].callFulfilled(t)
                }
                return e
            }, i.reject = function(e, t) {
                e.state = a, e.outcome = t;
                for (var n = -1, r = e.queue.length; ++n < r;) e.queue[n].callRejected(t);
                return e
            }, c.resolve = function(e) {
                if (e instanceof this) return e;
                return i.resolve(new this(o), e)
            }, c.reject = function(e) {
                var t = new this(o);
                return i.reject(t, e)
            }, c.all = function(e) {
                var t = this;
                if ("[object Array]" !== Object.prototype.toString.call(e)) return this.reject(new TypeError("must be an array"));
                var n = e.length,
                    r = !1;
                if (!n) return this.resolve([]);
                var a = new Array(n),
                    u = 0,
                    s = -1,
                    c = new this(o);
                for (; ++s < n;) l(e[s], s);
                return c;

                function l(e, o) {
                    t.resolve(e).then(function(e) {
                        a[o] = e, ++u !== n || r || (r = !0, i.resolve(c, a))
                    }, function(e) {
                        r || (r = !0, i.reject(c, e))
                    })
                }
            }, c.race = function(e) {
                var t = this;
                if ("[object Array]" !== Object.prototype.toString.call(e)) return this.reject(new TypeError("must be an array"));
                var n = e.length,
                    r = !1;
                if (!n) return this.resolve([]);
                var a = -1,
                    u = new this(o);
                for (; ++a < n;) s = e[a], t.resolve(s).then(function(e) {
                    r || (r = !0, i.resolve(u, e))
                }, function(e) {
                    r || (r = !0, i.reject(u, e))
                });
                var s;
                return u
            }
        }, {
            1: 1
        }],
        3: [function(e, t, n) {
            (function(t) {
                "use strict";
                "function" != typeof t.Promise && (t.Promise = e(2))
            }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        }, {
            2: 2
        }],
        4: [function(e, t, n) {
            "use strict";
            var r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                return typeof e
            } : function(e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            };
            var o = function() {
                try {
                    if ("undefined" != typeof indexedDB) return indexedDB;
                    if ("undefined" != typeof webkitIndexedDB) return webkitIndexedDB;
                    if ("undefined" != typeof mozIndexedDB) return mozIndexedDB;
                    if ("undefined" != typeof OIndexedDB) return OIndexedDB;
                    if ("undefined" != typeof msIndexedDB) return msIndexedDB
                } catch (e) {
                    return
                }
            }();

            function i(e, t) {
                e = e || [], t = t || {};
                try {
                    return new Blob(e, t)
                } catch (o) {
                    if ("TypeError" !== o.name) throw o;
                    for (var n = new("undefined" != typeof BlobBuilder ? BlobBuilder : "undefined" != typeof MSBlobBuilder ? MSBlobBuilder : "undefined" != typeof MozBlobBuilder ? MozBlobBuilder : WebKitBlobBuilder), r = 0; r < e.length; r += 1) n.append(e[r]);
                    return n.getBlob(t.type)
                }
            }
            "undefined" == typeof Promise && e(3);
            var a = Promise;

            function u(e, t) {
                t && e.then(function(e) {
                    t(null, e)
                }, function(e) {
                    t(e)
                })
            }

            function s(e, t, n) {
                "function" == typeof t && e.then(t), "function" == typeof n && e.catch(n)
            }

            function c(e) {
                return "string" != typeof e && (console.warn(e + " used as a key, but it is not a string."), e = String(e)), e
            }

            function l() {
                if (arguments.length && "function" == typeof arguments[arguments.length - 1]) return arguments[arguments.length - 1]
            }
            var d = "local-forage-detect-blob-support",
                f = void 0,
                m = {},
                p = Object.prototype.toString,
                h = "readonly",
                _ = "readwrite";

            function v(e) {
                return "boolean" == typeof f ? a.resolve(f) : function(e) {
                    return new a(function(t) {
                        var n = e.transaction(d, _),
                            r = i([""]);
                        n.objectStore(d).put(r, "key"), n.onabort = function(e) {
                            e.preventDefault(), e.stopPropagation(), t(!1)
                        }, n.oncomplete = function() {
                            var e = navigator.userAgent.match(/Chrome\/(\d+)/),
                                n = navigator.userAgent.match(/Edge\//);
                            t(n || !e || parseInt(e[1], 10) >= 43)
                        }
                    }).catch(function() {
                        return !1
                    })
                }(e).then(function(e) {
                    return f = e
                })
            }

            function S(e) {
                var t = m[e.name],
                    n = {};
                n.promise = new a(function(e, t) {
                    n.resolve = e, n.reject = t
                }), t.deferredOperations.push(n), t.dbReady ? t.dbReady = t.dbReady.then(function() {
                    return n.promise
                }) : t.dbReady = n.promise
            }

            function y(e) {
                var t = m[e.name].deferredOperations.pop();
                if (t) return t.resolve(), t.promise
            }

            function g(e, t) {
                var n = m[e.name].deferredOperations.pop();
                if (n) return n.reject(t), n.promise
            }

            function F(e, t) {
                return new a(function(n, r) {
                    if (m[e.name] = m[e.name] || {
                            forages: [],
                            db: null,
                            dbReady: null,
                            deferredOperations: []
                        }, e.db) {
                        if (!t) return n(e.db);
                        S(e), e.db.close()
                    }
                    var i = [e.name];
                    t && i.push(e.version);
                    var a = o.open.apply(o, i);
                    t && (a.onupgradeneeded = function(t) {
                        var n = a.result;
                        try {
                            n.createObjectStore(e.storeName), t.oldVersion <= 1 && n.createObjectStore(d)
                        } catch (n) {
                            if ("ConstraintError" !== n.name) throw n;
                            console.warn('The database "' + e.name + '" has been upgraded from version ' + t.oldVersion + " to version " + t.newVersion + ', but the storage "' + e.storeName + '" already exists.')
                        }
                    }), a.onerror = function(e) {
                        e.preventDefault(), r(a.error)
                    }, a.onsuccess = function() {
                        n(a.result), y(e)
                    }
                })
            }

            function w(e) {
                return F(e, !1)
            }

            function E(e) {
                return F(e, !0)
            }

            function b(e, t) {
                if (!e.db) return !0;
                var n = !e.db.objectStoreNames.contains(e.storeName),
                    r = e.version < e.db.version,
                    o = e.version > e.db.version;
                if (r && (e.version !== t && console.warn('The database "' + e.name + "\" can't be downgraded from version " + e.db.version + " to version " + e.version + "."), e.version = e.db.version), o || n) {
                    if (n) {
                        var i = e.db.version + 1;
                        i > e.version && (e.version = i)
                    }
                    return !0
                }
                return !1
            }

            function M(e) {
                return i([function(e) {
                    for (var t = e.length, n = new ArrayBuffer(t), r = new Uint8Array(n), o = 0; o < t; o++) r[o] = e.charCodeAt(o);
                    return n
                }(atob(e.data))], {
                    type: e.type
                })
            }

            function A(e) {
                return e && e.__local_forage_encoded_blob
            }

            function k(e) {
                var t = this,
                    n = t._initReady().then(function() {
                        var e = m[t._dbInfo.name];
                        if (e && e.dbReady) return e.dbReady
                    });
                return s(n, e, e), n
            }

            function T(e, t, n, r) {
                void 0 === r && (r = 1);
                try {
                    var o = e.db.transaction(e.storeName, t);
                    n(null, o)
                } catch (o) {
                    if (r > 0 && (!e.db || "InvalidStateError" === o.name || "NotFoundError" === o.name)) return a.resolve().then(function() {
                        if (!e.db || "NotFoundError" === o.name && !e.db.objectStoreNames.contains(e.storeName) && e.version <= e.db.version) return e.db && (e.version = e.db.version + 1), E(e)
                    }).then(function() {
                        return function(e) {
                            S(e);
                            for (var t = m[e.name], n = t.forages, r = 0; r < n.length; r++) {
                                var o = n[r];
                                o._dbInfo.db && (o._dbInfo.db.close(), o._dbInfo.db = null)
                            }
                            return e.db = null, w(e).then(function(t) {
                                return e.db = t, b(e) ? E(e) : t
                            }).then(function(r) {
                                e.db = t.db = r;
                                for (var o = 0; o < n.length; o++) n[o]._dbInfo.db = r
                            }).catch(function(t) {
                                throw g(e, t), t
                            })
                        }(e).then(function() {
                            T(e, t, n, r - 1)
                        })
                    }).catch(n);
                    n(o)
                }
            }
            var P = {
                _driver: "asyncStorage",
                _initStorage: function(e) {
                    var t = this,
                        n = {
                            db: null
                        };
                    if (e)
                        for (var r in e) n[r] = e[r];
                    var o = m[n.name];
                    o || (o = {
                        forages: [],
                        db: null,
                        dbReady: null,
                        deferredOperations: []
                    }, m[n.name] = o), o.forages.push(t), t._initReady || (t._initReady = t.ready, t.ready = k);
                    var i = [];

                    function u() {
                        return a.resolve()
                    }
                    for (var s = 0; s < o.forages.length; s++) {
                        var c = o.forages[s];
                        c !== t && i.push(c._initReady().catch(u))
                    }
                    var l = o.forages.slice(0);
                    return a.all(i).then(function() {
                        return n.db = o.db, w(n)
                    }).then(function(e) {
                        return n.db = e, b(n, t._defaultConfig.version) ? E(n) : e
                    }).then(function(e) {
                        n.db = o.db = e, t._dbInfo = n;
                        for (var r = 0; r < l.length; r++) {
                            var i = l[r];
                            i !== t && (i._dbInfo.db = n.db, i._dbInfo.version = n.version)
                        }
                    })
                },
                _support: function() {
                    try {
                        if (!o) return !1;
                        var e = "undefined" != typeof openDatabase && /(Safari|iPhone|iPad|iPod)/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent) && !/BlackBerry/.test(navigator.platform),
                            t = "function" == typeof fetch && -1 !== fetch.toString().indexOf("[native code");
                        return (!e || t) && "undefined" != typeof indexedDB && "undefined" != typeof IDBKeyRange
                    } catch (e) {
                        return !1
                    }
                }(),
                iterate: function(e, t) {
                    var n = this,
                        r = new a(function(t, r) {
                            n.ready().then(function() {
                                T(n._dbInfo, h, function(o, i) {
                                    if (o) return r(o);
                                    try {
                                        var a = i.objectStore(n._dbInfo.storeName).openCursor(),
                                            u = 1;
                                        a.onsuccess = function() {
                                            var n = a.result;
                                            if (n) {
                                                var r = n.value;
                                                A(r) && (r = M(r));
                                                var o = e(r, n.key, u++);
                                                void 0 !== o ? t(o) : n.continue()
                                            } else t()
                                        }, a.onerror = function() {
                                            r(a.error)
                                        }
                                    } catch (e) {
                                        r(e)
                                    }
                                })
                            }).catch(r)
                        });
                    return u(r, t), r
                },
                getItem: function(e, t) {
                    var n = this;
                    e = c(e);
                    var r = new a(function(t, r) {
                        n.ready().then(function() {
                            T(n._dbInfo, h, function(o, i) {
                                if (o) return r(o);
                                try {
                                    var a = i.objectStore(n._dbInfo.storeName).get(e);
                                    a.onsuccess = function() {
                                        var e = a.result;
                                        void 0 === e && (e = null), A(e) && (e = M(e)), t(e)
                                    }, a.onerror = function() {
                                        r(a.error)
                                    }
                                } catch (e) {
                                    r(e)
                                }
                            })
                        }).catch(r)
                    });
                    return u(r, t), r
                },
                setItem: function(e, t, n) {
                    var r = this;
                    e = c(e);
                    var o = new a(function(n, o) {
                        var i;
                        r.ready().then(function() {
                            return i = r._dbInfo, "[object Blob]" === p.call(t) ? v(i.db).then(function(e) {
                                return e ? t : (n = t, new a(function(e, t) {
                                    var r = new FileReader;
                                    r.onerror = t, r.onloadend = function(t) {
                                        var r = btoa(t.target.result || "");
                                        e({
                                            __local_forage_encoded_blob: !0,
                                            data: r,
                                            type: n.type
                                        })
                                    }, r.readAsBinaryString(n)
                                }));
                                var n
                            }) : t
                        }).then(function(t) {
                            T(r._dbInfo, _, function(i, a) {
                                if (i) return o(i);
                                try {
                                    var u = a.objectStore(r._dbInfo.storeName);
                                    null === t && (t = void 0);
                                    var s = u.put(t, e);
                                    a.oncomplete = function() {
                                        void 0 === t && (t = null), n(t)
                                    }, a.onabort = a.onerror = function() {
                                        var e = s.error ? s.error : s.transaction.error;
                                        o(e)
                                    }
                                } catch (e) {
                                    o(e)
                                }
                            })
                        }).catch(o)
                    });
                    return u(o, n), o
                },
                removeItem: function(e, t) {
                    var n = this;
                    e = c(e);
                    var r = new a(function(t, r) {
                        n.ready().then(function() {
                            T(n._dbInfo, _, function(o, i) {
                                if (o) return r(o);
                                try {
                                    var a = i.objectStore(n._dbInfo.storeName).delete(e);
                                    i.oncomplete = function() {
                                        t()
                                    }, i.onerror = function() {
                                        r(a.error)
                                    }, i.onabort = function() {
                                        var e = a.error ? a.error : a.transaction.error;
                                        r(e)
                                    }
                                } catch (e) {
                                    r(e)
                                }
                            })
                        }).catch(r)
                    });
                    return u(r, t), r
                },
                clear: function(e) {
                    var t = this,
                        n = new a(function(e, n) {
                            t.ready().then(function() {
                                T(t._dbInfo, _, function(r, o) {
                                    if (r) return n(r);
                                    try {
                                        var i = o.objectStore(t._dbInfo.storeName).clear();
                                        o.oncomplete = function() {
                                            e()
                                        }, o.onabort = o.onerror = function() {
                                            var e = i.error ? i.error : i.transaction.error;
                                            n(e)
                                        }
                                    } catch (e) {
                                        n(e)
                                    }
                                })
                            }).catch(n)
                        });
                    return u(n, e), n
                },
                length: function(e) {
                    var t = this,
                        n = new a(function(e, n) {
                            t.ready().then(function() {
                                T(t._dbInfo, h, function(r, o) {
                                    if (r) return n(r);
                                    try {
                                        var i = o.objectStore(t._dbInfo.storeName).count();
                                        i.onsuccess = function() {
                                            e(i.result)
                                        }, i.onerror = function() {
                                            n(i.error)
                                        }
                                    } catch (e) {
                                        n(e)
                                    }
                                })
                            }).catch(n)
                        });
                    return u(n, e), n
                },
                key: function(e, t) {
                    var n = this,
                        r = new a(function(t, r) {
                            e < 0 ? t(null) : n.ready().then(function() {
                                T(n._dbInfo, h, function(o, i) {
                                    if (o) return r(o);
                                    try {
                                        var a = i.objectStore(n._dbInfo.storeName),
                                            u = !1,
                                            s = a.openCursor();
                                        s.onsuccess = function() {
                                            var n = s.result;
                                            n ? 0 === e ? t(n.key) : u ? t(n.key) : (u = !0, n.advance(e)) : t(null)
                                        }, s.onerror = function() {
                                            r(s.error)
                                        }
                                    } catch (e) {
                                        r(e)
                                    }
                                })
                            }).catch(r)
                        });
                    return u(r, t), r
                },
                keys: function(e) {
                    var t = this,
                        n = new a(function(e, n) {
                            t.ready().then(function() {
                                T(t._dbInfo, h, function(r, o) {
                                    if (r) return n(r);
                                    try {
                                        var i = o.objectStore(t._dbInfo.storeName).openCursor(),
                                            a = [];
                                        i.onsuccess = function() {
                                            var t = i.result;
                                            t ? (a.push(t.key), t.continue()) : e(a)
                                        }, i.onerror = function() {
                                            n(i.error)
                                        }
                                    } catch (e) {
                                        n(e)
                                    }
                                })
                            }).catch(n)
                        });
                    return u(n, e), n
                },
                dropInstance: function(e, t) {
                    t = l.apply(this, arguments);
                    var n, r = this.config();
                    if ((e = "function" != typeof e && e || {}).name || (e.name = e.name || r.name, e.storeName = e.storeName || r.storeName), e.name) {
                        var i = e.name === r.name && this._dbInfo.db ? a.resolve(this._dbInfo.db) : w(e).then(function(t) {
                            var n = m[e.name],
                                r = n.forages;
                            n.db = t;
                            for (var o = 0; o < r.length; o++) r[o]._dbInfo.db = t;
                            return t
                        });
                        n = e.storeName ? i.then(function(t) {
                            if (t.objectStoreNames.contains(e.storeName)) {
                                var n = t.version + 1;
                                S(e);
                                var r = m[e.name],
                                    i = r.forages;
                                t.close();
                                for (var u = 0; u < i.length; u++) {
                                    var s = i[u];
                                    s._dbInfo.db = null, s._dbInfo.version = n
                                }
                                return new a(function(t, r) {
                                    var i = o.open(e.name, n);
                                    i.onerror = function(e) {
                                        i.result.close(), r(e)
                                    }, i.onupgradeneeded = function() {
                                        i.result.deleteObjectStore(e.storeName)
                                    }, i.onsuccess = function() {
                                        var e = i.result;
                                        e.close(), t(e)
                                    }
                                }).then(function(e) {
                                    r.db = e;
                                    for (var t = 0; t < i.length; t++) {
                                        var n = i[t];
                                        n._dbInfo.db = e, y(n._dbInfo)
                                    }
                                }).catch(function(t) {
                                    throw (g(e, t) || a.resolve()).catch(function() {}), t
                                })
                            }
                        }) : i.then(function(t) {
                            S(e);
                            var n = m[e.name],
                                r = n.forages;
                            t.close();
                            for (var i = 0; i < r.length; i++) r[i]._dbInfo.db = null;
                            return new a(function(t, n) {
                                var r = o.deleteDatabase(e.name);
                                r.onerror = r.onblocked = function(e) {
                                    var t = r.result;
                                    t && t.close(), n(e)
                                }, r.onsuccess = function() {
                                    var e = r.result;
                                    e && e.close(), t(e)
                                }
                            }).then(function(e) {
                                n.db = e;
                                for (var t = 0; t < r.length; t++) y(r[t]._dbInfo)
                            }).catch(function(t) {
                                throw (g(e, t) || a.resolve()).catch(function() {}), t
                            })
                        })
                    } else n = a.reject("Invalid arguments");
                    return u(n, t), n
                }
            };
            var D = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
                R = "~~local_forage_type~",
                I = /^~~local_forage_type~([^~]+)~/,
                N = "__lfsc__:",
                H = N.length,
                x = "arbf",
                C = "blob",
                O = "si08",
                B = "ui08",
                L = "uic8",
                j = "si16",
                U = "si32",
                z = "ur16",
                Y = "ui32",
                W = "fl32",
                q = "fl64",
                G = H + x.length,
                K = Object.prototype.toString;

            function V(e) {
                var t, n, r, o, i, a = .75 * e.length,
                    u = e.length,
                    s = 0;
                "=" === e[e.length - 1] && (a--, "=" === e[e.length - 2] && a--);
                var c = new ArrayBuffer(a),
                    l = new Uint8Array(c);
                for (t = 0; t < u; t += 4) n = D.indexOf(e[t]), r = D.indexOf(e[t + 1]), o = D.indexOf(e[t + 2]), i = D.indexOf(e[t + 3]), l[s++] = n << 2 | r >> 4, l[s++] = (15 & r) << 4 | o >> 2, l[s++] = (3 & o) << 6 | 63 & i;
                return c
            }

            function X(e) {
                var t, n = new Uint8Array(e),
                    r = "";
                for (t = 0; t < n.length; t += 3) r += D[n[t] >> 2], r += D[(3 & n[t]) << 4 | n[t + 1] >> 4], r += D[(15 & n[t + 1]) << 2 | n[t + 2] >> 6], r += D[63 & n[t + 2]];
                return n.length % 3 == 2 ? r = r.substring(0, r.length - 1) + "=" : n.length % 3 == 1 && (r = r.substring(0, r.length - 2) + "=="), r
            }
            var J = {
                serialize: function(e, t) {
                    var n = "";
                    if (e && (n = K.call(e)), e && ("[object ArrayBuffer]" === n || e.buffer && "[object ArrayBuffer]" === K.call(e.buffer))) {
                        var r, o = N;
                        e instanceof ArrayBuffer ? (r = e, o += x) : (r = e.buffer, "[object Int8Array]" === n ? o += O : "[object Uint8Array]" === n ? o += B : "[object Uint8ClampedArray]" === n ? o += L : "[object Int16Array]" === n ? o += j : "[object Uint16Array]" === n ? o += z : "[object Int32Array]" === n ? o += U : "[object Uint32Array]" === n ? o += Y : "[object Float32Array]" === n ? o += W : "[object Float64Array]" === n ? o += q : t(new Error("Failed to get type for BinaryArray"))), t(o + X(r))
                    } else if ("[object Blob]" === n) {
                        var i = new FileReader;
                        i.onload = function() {
                            var n = R + e.type + "~" + X(this.result);
                            t(N + C + n)
                        }, i.readAsArrayBuffer(e)
                    } else try {
                        t(JSON.stringify(e))
                    } catch (n) {
                        console.error("Couldn't convert value into a JSON string: ", e), t(null, n)
                    }
                },
                deserialize: function(e) {
                    if (e.substring(0, H) !== N) return JSON.parse(e);
                    var t, n = e.substring(G),
                        r = e.substring(H, G);
                    if (r === C && I.test(n)) {
                        var o = n.match(I);
                        t = o[1], n = n.substring(o[0].length)
                    }
                    var a = V(n);
                    switch (r) {
                        case x:
                            return a;
                        case C:
                            return i([a], {
                                type: t
                            });
                        case O:
                            return new Int8Array(a);
                        case B:
                            return new Uint8Array(a);
                        case L:
                            return new Uint8ClampedArray(a);
                        case j:
                            return new Int16Array(a);
                        case z:
                            return new Uint16Array(a);
                        case U:
                            return new Int32Array(a);
                        case Y:
                            return new Uint32Array(a);
                        case W:
                            return new Float32Array(a);
                        case q:
                            return new Float64Array(a);
                        default:
                            throw new Error("Unkown type: " + r)
                    }
                },
                stringToBuffer: V,
                bufferToString: X
            };

            function Q(e, t, n, r) {
                e.executeSql("CREATE TABLE IF NOT EXISTS " + t.storeName + " (id INTEGER PRIMARY KEY, key unique, value)", [], n, r)
            }

            function $(e, t, n, r, o, i) {
                e.executeSql(n, r, o, function(e, a) {
                    a.code === a.SYNTAX_ERR ? e.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name = ?", [t.storeName], function(e, u) {
                        u.rows.length ? i(e, a) : Q(e, t, function() {
                            e.executeSql(n, r, o, i)
                        }, i)
                    }, i) : i(e, a)
                }, i)
            }
            var Z = {
                _driver: "webSQLStorage",
                _initStorage: function(e) {
                    var t = this,
                        n = {
                            db: null
                        };
                    if (e)
                        for (var r in e) n[r] = "string" != typeof e[r] ? e[r].toString() : e[r];
                    var o = new a(function(e, r) {
                        try {
                            n.db = openDatabase(n.name, String(n.version), n.description, n.size)
                        } catch (e) {
                            return r(e)
                        }
                        n.db.transaction(function(o) {
                            Q(o, n, function() {
                                t._dbInfo = n, e()
                            }, function(e, t) {
                                r(t)
                            })
                        }, r)
                    });
                    return n.serializer = J, o
                },
                _support: "function" == typeof openDatabase,
                iterate: function(e, t) {
                    var n = this,
                        r = new a(function(t, r) {
                            n.ready().then(function() {
                                var o = n._dbInfo;
                                o.db.transaction(function(n) {
                                    $(n, o, "SELECT * FROM " + o.storeName, [], function(n, r) {
                                        for (var i = r.rows, a = i.length, u = 0; u < a; u++) {
                                            var s = i.item(u),
                                                c = s.value;
                                            if (c && (c = o.serializer.deserialize(c)), void 0 !== (c = e(c, s.key, u + 1))) return void t(c)
                                        }
                                        t()
                                    }, function(e, t) {
                                        r(t)
                                    })
                                })
                            }).catch(r)
                        });
                    return u(r, t), r
                },
                getItem: function(e, t) {
                    var n = this;
                    e = c(e);
                    var r = new a(function(t, r) {
                        n.ready().then(function() {
                            var o = n._dbInfo;
                            o.db.transaction(function(n) {
                                $(n, o, "SELECT * FROM " + o.storeName + " WHERE key = ? LIMIT 1", [e], function(e, n) {
                                    var r = n.rows.length ? n.rows.item(0).value : null;
                                    r && (r = o.serializer.deserialize(r)), t(r)
                                }, function(e, t) {
                                    r(t)
                                })
                            })
                        }).catch(r)
                    });
                    return u(r, t), r
                },
                setItem: function(e, t, n) {
                    return function e(t, n, r, o) {
                        var i = this;
                        t = c(t);
                        var s = new a(function(a, u) {
                            i.ready().then(function() {
                                void 0 === n && (n = null);
                                var s = n,
                                    c = i._dbInfo;
                                c.serializer.serialize(n, function(n, l) {
                                    l ? u(l) : c.db.transaction(function(e) {
                                        $(e, c, "INSERT OR REPLACE INTO " + c.storeName + " (key, value) VALUES (?, ?)", [t, n], function() {
                                            a(s)
                                        }, function(e, t) {
                                            u(t)
                                        })
                                    }, function(n) {
                                        if (n.code === n.QUOTA_ERR) {
                                            if (o > 0) return void a(e.apply(i, [t, s, r, o - 1]));
                                            u(n)
                                        }
                                    })
                                })
                            }).catch(u)
                        });
                        return u(s, r), s
                    }.apply(this, [e, t, n, 1])
                },
                removeItem: function(e, t) {
                    var n = this;
                    e = c(e);
                    var r = new a(function(t, r) {
                        n.ready().then(function() {
                            var o = n._dbInfo;
                            o.db.transaction(function(n) {
                                $(n, o, "DELETE FROM " + o.storeName + " WHERE key = ?", [e], function() {
                                    t()
                                }, function(e, t) {
                                    r(t)
                                })
                            })
                        }).catch(r)
                    });
                    return u(r, t), r
                },
                clear: function(e) {
                    var t = this,
                        n = new a(function(e, n) {
                            t.ready().then(function() {
                                var r = t._dbInfo;
                                r.db.transaction(function(t) {
                                    $(t, r, "DELETE FROM " + r.storeName, [], function() {
                                        e()
                                    }, function(e, t) {
                                        n(t)
                                    })
                                })
                            }).catch(n)
                        });
                    return u(n, e), n
                },
                length: function(e) {
                    var t = this,
                        n = new a(function(e, n) {
                            t.ready().then(function() {
                                var r = t._dbInfo;
                                r.db.transaction(function(t) {
                                    $(t, r, "SELECT COUNT(key) as c FROM " + r.storeName, [], function(t, n) {
                                        var r = n.rows.item(0).c;
                                        e(r)
                                    }, function(e, t) {
                                        n(t)
                                    })
                                })
                            }).catch(n)
                        });
                    return u(n, e), n
                },
                key: function(e, t) {
                    var n = this,
                        r = new a(function(t, r) {
                            n.ready().then(function() {
                                var o = n._dbInfo;
                                o.db.transaction(function(n) {
                                    $(n, o, "SELECT key FROM " + o.storeName + " WHERE id = ? LIMIT 1", [e + 1], function(e, n) {
                                        var r = n.rows.length ? n.rows.item(0).key : null;
                                        t(r)
                                    }, function(e, t) {
                                        r(t)
                                    })
                                })
                            }).catch(r)
                        });
                    return u(r, t), r
                },
                keys: function(e) {
                    var t = this,
                        n = new a(function(e, n) {
                            t.ready().then(function() {
                                var r = t._dbInfo;
                                r.db.transaction(function(t) {
                                    $(t, r, "SELECT key FROM " + r.storeName, [], function(t, n) {
                                        for (var r = [], o = 0; o < n.rows.length; o++) r.push(n.rows.item(o).key);
                                        e(r)
                                    }, function(e, t) {
                                        n(t)
                                    })
                                })
                            }).catch(n)
                        });
                    return u(n, e), n
                },
                dropInstance: function(e, t) {
                    t = l.apply(this, arguments);
                    var n = this.config();
                    (e = "function" != typeof e && e || {}).name || (e.name = e.name || n.name, e.storeName = e.storeName || n.storeName);
                    var r, o = this;
                    return u(r = e.name ? new a(function(t) {
                        var r;
                        r = e.name === n.name ? o._dbInfo.db : openDatabase(e.name, "", "", 0), e.storeName ? t({
                            db: r,
                            storeNames: [e.storeName]
                        }) : t(function(e) {
                            return new a(function(t, n) {
                                e.transaction(function(r) {
                                    r.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name <> '__WebKitDatabaseInfoTable__'", [], function(n, r) {
                                        for (var o = [], i = 0; i < r.rows.length; i++) o.push(r.rows.item(i).name);
                                        t({
                                            db: e,
                                            storeNames: o
                                        })
                                    }, function(e, t) {
                                        n(t)
                                    })
                                }, function(e) {
                                    n(e)
                                })
                            })
                        }(r))
                    }).then(function(e) {
                        return new a(function(t, n) {
                            e.db.transaction(function(r) {
                                function o(e) {
                                    return new a(function(t, n) {
                                        r.executeSql("DROP TABLE IF EXISTS " + e, [], function() {
                                            t()
                                        }, function(e, t) {
                                            n(t)
                                        })
                                    })
                                }
                                for (var i = [], u = 0, s = e.storeNames.length; u < s; u++) i.push(o(e.storeNames[u]));
                                a.all(i).then(function() {
                                    t()
                                }).catch(function(e) {
                                    n(e)
                                })
                            }, function(e) {
                                n(e)
                            })
                        })
                    }) : a.reject("Invalid arguments"), t), r
                }
            };

            function ee(e, t) {
                var n = e.name + "/";
                return e.storeName !== t.storeName && (n += e.storeName + "/"), n
            }

            function te() {
                return ! function() {
                    try {
                        return localStorage.setItem("_localforage_support_test", !0), localStorage.removeItem("_localforage_support_test"), !1
                    } catch (e) {
                        return !0
                    }
                }() || localStorage.length > 0
            }
            var ne = {
                    _driver: "localStorageWrapper",
                    _initStorage: function(e) {
                        var t = {};
                        if (e)
                            for (var n in e) t[n] = e[n];
                        return t.keyPrefix = ee(e, this._defaultConfig), te() ? (this._dbInfo = t, t.serializer = J, a.resolve()) : a.reject()
                    },
                    _support: function() {
                        try {
                            return "undefined" != typeof localStorage && "setItem" in localStorage && !!localStorage.setItem
                        } catch (e) {
                            return !1
                        }
                    }(),
                    iterate: function(e, t) {
                        var n = this,
                            r = n.ready().then(function() {
                                for (var t = n._dbInfo, r = t.keyPrefix, o = r.length, i = localStorage.length, a = 1, u = 0; u < i; u++) {
                                    var s = localStorage.key(u);
                                    if (0 === s.indexOf(r)) {
                                        var c = localStorage.getItem(s);
                                        if (c && (c = t.serializer.deserialize(c)), void 0 !== (c = e(c, s.substring(o), a++))) return c
                                    }
                                }
                            });
                        return u(r, t), r
                    },
                    getItem: function(e, t) {
                        var n = this;
                        e = c(e);
                        var r = n.ready().then(function() {
                            var t = n._dbInfo,
                                r = localStorage.getItem(t.keyPrefix + e);
                            return r && (r = t.serializer.deserialize(r)), r
                        });
                        return u(r, t), r
                    },
                    setItem: function(e, t, n) {
                        var r = this;
                        e = c(e);
                        var o = r.ready().then(function() {
                            void 0 === t && (t = null);
                            var n = t;
                            return new a(function(o, i) {
                                var a = r._dbInfo;
                                a.serializer.serialize(t, function(t, r) {
                                    if (r) i(r);
                                    else try {
                                        localStorage.setItem(a.keyPrefix + e, t), o(n)
                                    } catch (e) {
                                        "QuotaExceededError" !== e.name && "NS_ERROR_DOM_QUOTA_REACHED" !== e.name || i(e), i(e)
                                    }
                                })
                            })
                        });
                        return u(o, n), o
                    },
                    removeItem: function(e, t) {
                        var n = this;
                        e = c(e);
                        var r = n.ready().then(function() {
                            var t = n._dbInfo;
                            localStorage.removeItem(t.keyPrefix + e)
                        });
                        return u(r, t), r
                    },
                    clear: function(e) {
                        var t = this,
                            n = t.ready().then(function() {
                                for (var e = t._dbInfo.keyPrefix, n = localStorage.length - 1; n >= 0; n--) {
                                    var r = localStorage.key(n);
                                    0 === r.indexOf(e) && localStorage.removeItem(r)
                                }
                            });
                        return u(n, e), n
                    },
                    length: function(e) {
                        var t = this.keys().then(function(e) {
                            return e.length
                        });
                        return u(t, e), t
                    },
                    key: function(e, t) {
                        var n = this,
                            r = n.ready().then(function() {
                                var t, r = n._dbInfo;
                                try {
                                    t = localStorage.key(e)
                                } catch (e) {
                                    t = null
                                }
                                return t && (t = t.substring(r.keyPrefix.length)), t
                            });
                        return u(r, t), r
                    },
                    keys: function(e) {
                        var t = this,
                            n = t.ready().then(function() {
                                for (var e = t._dbInfo, n = localStorage.length, r = [], o = 0; o < n; o++) {
                                    var i = localStorage.key(o);
                                    0 === i.indexOf(e.keyPrefix) && r.push(i.substring(e.keyPrefix.length))
                                }
                                return r
                            });
                        return u(n, e), n
                    },
                    dropInstance: function(e, t) {
                        if (t = l.apply(this, arguments), !(e = "function" != typeof e && e || {}).name) {
                            var n = this.config();
                            e.name = e.name || n.name, e.storeName = e.storeName || n.storeName
                        }
                        var r, o = this;
                        return u(r = e.name ? new a(function(t) {
                            e.storeName ? t(ee(e, o._defaultConfig)) : t(e.name + "/")
                        }).then(function(e) {
                            for (var t = localStorage.length - 1; t >= 0; t--) {
                                var n = localStorage.key(t);
                                0 === n.indexOf(e) && localStorage.removeItem(n)
                            }
                        }) : a.reject("Invalid arguments"), t), r
                    }
                },
                re = function(e, t) {
                    for (var n, r, o = e.length, i = 0; i < o;) {
                        if ((n = e[i]) === (r = t) || "number" == typeof n && "number" == typeof r && isNaN(n) && isNaN(r)) return !0;
                        i++
                    }
                    return !1
                },
                oe = Array.isArray || function(e) {
                    return "[object Array]" === Object.prototype.toString.call(e)
                },
                ie = {},
                ae = {},
                ue = {
                    INDEXEDDB: P,
                    WEBSQL: Z,
                    LOCALSTORAGE: ne
                },
                se = [ue.INDEXEDDB._driver, ue.WEBSQL._driver, ue.LOCALSTORAGE._driver],
                ce = ["dropInstance"],
                le = ["clear", "getItem", "iterate", "key", "keys", "length", "removeItem", "setItem"].concat(ce),
                de = {
                    description: "",
                    driver: se.slice(),
                    name: "localforage",
                    size: 4980736,
                    storeName: "keyvaluepairs",
                    version: 1
                };

            function fe(e, t) {
                e[t] = function() {
                    var n = arguments;
                    return e.ready().then(function() {
                        return e[t].apply(e, n)
                    })
                }
            }

            function me() {
                for (var e = 1; e < arguments.length; e++) {
                    var t = arguments[e];
                    if (t)
                        for (var n in t) t.hasOwnProperty(n) && (oe(t[n]) ? arguments[0][n] = t[n].slice() : arguments[0][n] = t[n])
                }
                return arguments[0]
            }
            var pe = new(function() {
                function e(t) {
                    for (var n in function(e, t) {
                            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                        }(this, e), ue)
                        if (ue.hasOwnProperty(n)) {
                            var r = ue[n],
                                o = r._driver;
                            this[n] = o, ie[o] || this.defineDriver(r)
                        } this._defaultConfig = me({}, de), this._config = me({}, this._defaultConfig, t), this._driverSet = null, this._initDriver = null, this._ready = !1, this._dbInfo = null, this._wrapLibraryMethodsWithReady(), this.setDriver(this._config.driver).catch(function() {})
                }
                return e.prototype.config = function(e) {
                    if ("object" === (void 0 === e ? "undefined" : r(e))) {
                        if (this._ready) return new Error("Can't call config() after localforage has been used.");
                        for (var t in e) {
                            if ("storeName" === t && (e[t] = e[t].replace(/\W/g, "_")), "version" === t && "number" != typeof e[t]) return new Error("Database version must be a number.");
                            this._config[t] = e[t]
                        }
                        return !("driver" in e && e.driver) || this.setDriver(this._config.driver)
                    }
                    return "string" == typeof e ? this._config[e] : this._config
                }, e.prototype.defineDriver = function(e, t, n) {
                    var r = new a(function(t, n) {
                        try {
                            var r = e._driver,
                                o = new Error("Custom driver not compliant; see https://mozilla.github.io/localForage/#definedriver");
                            if (!e._driver) return void n(o);
                            for (var i = le.concat("_initStorage"), s = 0, c = i.length; s < c; s++) {
                                var l = i[s];
                                if ((!re(ce, l) || e[l]) && "function" != typeof e[l]) return void n(o)
                            }! function() {
                                for (var t = function(e) {
                                        return function() {
                                            var t = new Error("Method " + e + " is not implemented by the current driver"),
                                                n = a.reject(t);
                                            return u(n, arguments[arguments.length - 1]), n
                                        }
                                    }, n = 0, r = ce.length; n < r; n++) {
                                    var o = ce[n];
                                    e[o] || (e[o] = t(o))
                                }
                            }();
                            var d = function(n) {
                                ie[r] && console.info("Redefining LocalForage driver: " + r), ie[r] = e, ae[r] = n, t()
                            };
                            "_support" in e ? e._support && "function" == typeof e._support ? e._support().then(d, n) : d(!!e._support) : d(!0)
                        } catch (e) {
                            n(e)
                        }
                    });
                    return s(r, t, n), r
                }, e.prototype.driver = function() {
                    return this._driver || null
                }, e.prototype.getDriver = function(e, t, n) {
                    var r = ie[e] ? a.resolve(ie[e]) : a.reject(new Error("Driver not found."));
                    return s(r, t, n), r
                }, e.prototype.getSerializer = function(e) {
                    var t = a.resolve(J);
                    return s(t, e), t
                }, e.prototype.ready = function(e) {
                    var t = this,
                        n = t._driverSet.then(function() {
                            return null === t._ready && (t._ready = t._initDriver()), t._ready
                        });
                    return s(n, e, e), n
                }, e.prototype.setDriver = function(e, t, n) {
                    var r = this;
                    oe(e) || (e = [e]);
                    var o = this._getSupportedDrivers(e);

                    function i() {
                        r._config.driver = r.driver()
                    }

                    function u(e) {
                        return r._extend(e), i(), r._ready = r._initStorage(r._config), r._ready
                    }
                    var c = null !== this._driverSet ? this._driverSet.catch(function() {
                        return a.resolve()
                    }) : a.resolve();
                    return this._driverSet = c.then(function() {
                        var e = o[0];
                        return r._dbInfo = null, r._ready = null, r.getDriver(e).then(function(e) {
                            r._driver = e._driver, i(), r._wrapLibraryMethodsWithReady(), r._initDriver = function(e) {
                                return function() {
                                    var t = 0;
                                    return function n() {
                                        for (; t < e.length;) {
                                            var o = e[t];
                                            return t++, r._dbInfo = null, r._ready = null, r.getDriver(o).then(u).catch(n)
                                        }
                                        i();
                                        var s = new Error("No available storage method found.");
                                        return r._driverSet = a.reject(s), r._driverSet
                                    }()
                                }
                            }(o)
                        })
                    }).catch(function() {
                        i();
                        var e = new Error("No available storage method found.");
                        return r._driverSet = a.reject(e), r._driverSet
                    }), s(this._driverSet, t, n), this._driverSet
                }, e.prototype.supports = function(e) {
                    return !!ae[e]
                }, e.prototype._extend = function(e) {
                    me(this, e)
                }, e.prototype._getSupportedDrivers = function(e) {
                    for (var t = [], n = 0, r = e.length; n < r; n++) {
                        var o = e[n];
                        this.supports(o) && t.push(o)
                    }
                    return t
                }, e.prototype._wrapLibraryMethodsWithReady = function() {
                    for (var e = 0, t = le.length; e < t; e++) fe(this, le[e])
                }, e.prototype.createInstance = function(t) {
                    return new e(t)
                }, e
            }());
            t.exports = pe
        }, {
            3: 3
        }]
    }, {}, [4])(4)
});
var player = document.querySelector("desmond-player");
if (player) {
    var shadow = player.attachShadow({
        mode: "open"
    });
    shadow.innerHTML = '<div id="player">\n        <canvas id="top" width="256" height="192"></canvas>\n        <canvas id="bottom" width="256" height="192"></canvas>';
    var getFileBlob = function(e, t) {
            var n = new XMLHttpRequest;
            n.open("GET", e), n.responseType = "blob", n.addEventListener("load", function() {
                t(n.response)
            }), n.send()
        },
        blobToFile = function(e, t) {
            return e.lastModifiedDate = new Date, e.name = t, e
        },
        getFileObject = function(e, t) {
            getFileBlob(e, function(e) {
                t(blobToFile(e, "test.jpg"))
            })
        };

    function loadURL(e) {
        getFileObject(e, function(e) {
            console.log(e), tryLoadROM(e), status()
        })
    }

    function status() {
        console.log("loaded")
    }
    player.loadURL = function(e) {
        loadURL(e)
    };
    player.loadBlob = function(e) {
        tryLoadROM(e);
    };
    var plugins = {},
        config = {
            swapTopBottom: !1,
            swapTopBottomL: !1,
            powerSave: !0,
            micWhenR: !0,
            vkEnabled: !0
        };

    function loadConfig() {
        var e = JSON.parse(window.localStorage.config || "{}");
        for (var t in e) config[t] = e[t]
    }

    function uiSaveConfig() {
        window.localStorage.config = JSON.stringify(config)
    }

    function uiMenuBack() {
        uiSaveConfig(), emuIsGameLoaded ? uiSwitchTo("player") : uiSwitchTo("welcome")
    }

    function uiSaveBackup() {
        localforage.getItem("sav-" + gameID).then(e => {
            var t = new Blob([e], {
                    type: "application/binary"
                }),
                n = document.createElement("a");
            n.href = window.URL.createObjectURL(t), n.download = "sav-" + gameID + ".dsv", n.click()
        })
    }
    async function uiSaveRestore() {
        var e = $id("restore-file").files[0];
        if (e)
            if (e.size > 2306867.2) alert("Too large! It should not be a save file.");
            else {
                var t = new Uint8Array(await e.arrayBuffer());
                localforage.setItem("sav-" + gameID, t).then(() => {
                    alert("Save file loaded."), location.reload()
                })
            }
    }

    function $id(e) {
        return document.getElementById(e)
    }
    loadConfig(), window.onerror = function(e, t, n, r, o) {
        var i = r ? "\ncolumn: " + r : "";
        return alert("Error: " + e + "\nurl: " + t + "\nline: " + n + (i += o ? "\nerror: " + o : "")), window.onerror = console.log, !0
    };
    var isIOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform),
        isWebApp = navigator.standalone || !1,
        isSaveSupported = !0,
        isSaveNagAppeared = !1;
    if (isIOS && !isWebApp) {
        isSaveSupported = !1;
        var divIosHint = $id("ios-hint");
        divIosHint.hidden = !1, divIosHint.style = "position: absolute; bottom: " + divIosHint.clientHeight + "px;"
    }
    var emuKeyState = new Array(14);
    const e = ["right", "left", "down", "up", "select", "start", "b", "a", "y", "x", "l", "r", "debug", "lid"];
    for (var vkStickPos, vkMap = {}, vkState = {}, keyNameToKeyId = {}, i = 0; i < e.length; i++) keyNameToKeyId[e[i]] = i;
    var isLandscape = !1;
    const t = [39, 37, 40, 38, 16, 13, 90, 88, 65, 83, 81, 87, -1, 8];
    var audioContext, audioBuffer, audioWorkletNode, fbSize, emuGameID = "unknown",
        emuIsRunning = !1,
        emuIsGameLoaded = !1,
        fileInput = $id("rom"),
        romSize = 0,
        FB = [0, 0],
        screenCanvas = [shadow.getElementById("top"), shadow.getElementById("bottom")],
        ctx2d = screenCanvas.map(e => e.getContext("2d", {
            alpha: !1
        })),
        tmpAudioBuffer = new Int16Array(32768),
        frameCount = 0,
        touched = 0,
        touchX = 0,
        touchY = 0,
        prevSaveFlag = 0,
        lastTwoFrameTime = 10;

    function callPlugin(e, t) {
        for (var n in plugins) plugins[n].handler && plugins[n].handler(e, t)
    }

    function showMsg(e) {
        document.getElementById("msg-text").innerText = e, document.getElementById("msg-layer").hidden = !1, setTimeout(function() {
            document.getElementById("msg-layer").hidden = !0
        }, 1e3)
    }

    function emuRunFrame() {
        processGamepadInput();
        for (var e = 0, t = 0; t < 14; t++) emuKeyState[t] && (e |= 1 << t);
        if (emuKeyState[11] && (console.log("mic"), e |= 16384), config.powerSave && Module._runFrame(0, e, touched, touchX, touchY), Module._runFrame(1, e, touched, touchX, touchY), ctx2d[0].putImageData(FB[0], 0, 0), ctx2d[1].putImageData(FB[1], 0, 0), audioWorkletNode) try {
            var n = Module._fillAudioBuffer(4096);
            tmpAudioBuffer.set(audioBuffer.subarray(0, 2 * n)), audioWorkletNode.port.postMessage(tmpAudioBuffer.subarray(0, 2 * n))
        } catch (e) {
            console.log(e)
        }
        frameCount += 1
    }

    function wasmReady() {
        Module._setSampleRate(47860)
    }

    function checkSaveGame() {
        var e = Module._savUpdateChangeFlag();
        if (0 == e && 1 == prevSaveFlag) {
            var t = Module._savGetSize();
            if (t > 0 && isSaveSupported) {
                var n = Module._savGetPointer(0),
                    r = new Uint8Array(t);
                r.set(Module.HEAPU8.subarray(n, n + t)), localforage.setItem("sav-" + gameID, r), showMsg("Auto saving...")
            }
        }
        prevSaveFlag = e
    }
    async function tryLoadROM(e) {
        if (e && !(e.size < 1024)) {
            var t = new Uint8Array(await e.slice(0, 1024).arrayBuffer());
            gameID = "";
            for (var n = 0; n < 16; n++) gameID += 0 == t[n] ? " " : String.fromCharCode(t[n]);
            "#" == gameID[12] && (gameID = e.name), console.log("gameID", gameID), romSize = e.size;
            var r = Module._prepareRomBuffer(romSize);
            console.log(romSize, r), Module.HEAPU8.set(new Uint8Array(await e.arrayBuffer()), r);
            var o = await localforage.getItem("sav-" + gameID);
            if (o && Module.HEAPU8.set(o, Module._savGetPointer(o.length)), Module._savUpdateChangeFlag(), 1 == Module._loadROM(romSize)) {
                ptrFrontBuffer = Module._getSymbol(5);
                var i = Module._getSymbol(4);
                for (n = 0; n < 2; n++) FB[n] = new ImageData(new Uint8ClampedArray(Module.HEAPU8.buffer).subarray(i + 196608 * n, i + 196608 * (n + 1)), 256, 192);
                var a = Module._getSymbol(6);
                audioBuffer = new Int16Array(Module.HEAPU8.buffer).subarray(a / 2, a / 2 + 32768), console.log("Start!!!"), emuIsGameLoaded = !0, emuIsRunning = !0, shadow.querySelector("#player").hidden = !1, callPlugin("loaded", gameID)
            } else alert("LoadROM failed.")
        }
    }

    function tryInitSound() {
        try {
            if (audioContext) return void("running" != audioContext.state && audioContext.resume());
            (audioContext = new(window.AudioContext || window.webkitAudioContext)({
                latencyHint: 1e-4,
                sampleRate: 48e3
            })).audioWorklet ? audioContext.audioWorklet.addModule(URL.createObjectURL(new Blob(["class MyAudioWorklet extends AudioWorkletProcessor {\n    constructor() {\n        super()\n        this.FIFO_CAP = 5000\n        this.fifo0 = new Int16Array(this.FIFO_CAP)\n        this.fifo1 = new Int16Array(this.FIFO_CAP)\n        this.fifoHead = 0\n        this.fifoLen = 0\n        this.port.onmessage = (e) => {\n            //console.log(this.fifoLen)\n            var buf = e.data\n            var samplesReceived = buf.length / 2\n            if (this.fifoLen + samplesReceived >= this.FIFO_CAP) {\n                console.log('o')\n                return\n            }\n\n            for (var i = 0; i < buf.length; i+=2) {\n                this.fifoEnqueue(buf[i], buf[i+1])\n            }\n        }\n    }\n\n    fifoDequeue() {\n        this.fifoHead += 1\n        this.fifoHead %= this.FIFO_CAP\n        this.fifoLen -= 1\n    }\n\n    fifoEnqueue(a, b) {\n        const pos = (this.fifoHead + this.fifoLen) % this.FIFO_CAP\n        this.fifo0[pos] = a\n        this.fifo1[pos] = b\n        this.fifoLen += 1\n    }\n\n    process(inputs, outputs, parameters) {\n        const output = outputs[0]\n        const chan0 = output[0]\n        const chan1 = output[1]\n\n        for (var i = 0; i < chan0.length; i++) {\n            if (this.fifoLen < 1) {\n                console.log(\"u\")\n                break\n            }\n            chan0[i] = this.fifo0[this.fifoHead] / 32768.0\n            chan1[i] = this.fifo1[this.fifoHead] / 32768.0\n            this.fifoDequeue()\n        }\n        return true\n    }\n}\n\nregisterProcessor('my-worklet', MyAudioWorklet)"], {
                type: "text/javascript"
            }))).then(() => {
                (audioWorkletNode = new AudioWorkletNode(audioContext, "my-worklet", {
                    outputChannelCount: [2]
                })).connect(audioContext.destination)
            }) : alert("AudioWorklet is not supported in your browser..."), audioContext.resume()
        } catch (e) {
            console.log(e)
        }
    }
    var prevRunFrameTime = performance.now();

    function emuLoop() {
        if (window.requestAnimationFrame(emuLoop), emuIsRunning) {
            if (config.powerSave && performance.now() - prevRunFrameTime < 32) return;
            prevRunFrameTime = performance.now(), emuRunFrame()
        }
    }
    emuLoop();
    var stickTouchID = null,
        tpadTouchID = null;

    function isPointInRect(e, t, n) {
        return e >= n.x && e < n.x + n.width && t >= n.y && t < n.y + n.height
    }

    function clamp01(e) {
        return e < 0 ? 0 : e > 1 ? 1 : e
    }

    function handleTouch(t) {
        if (tryInitSound(), emuIsRunning) {
            t.preventDefault(), t.stopPropagation();
            for (var n = !1, r = 0, o = 0, i = !1, a = vkStickPos[0], u = vkStickPos[1], s = vkStickPos[2], c = vkStickPos[3], l = .4 * s, d = null, f = null, m = screenCanvas[1].getBoundingClientRect(), p = 0; p < emuKeyState.length; p++) emuKeyState[p] = !1;
            for (var h in vkState) vkState[h][1] = 0;
            for (p = 0; p < t.touches.length; p++) {
                var _ = t.touches[p],
                    v = _.identifier;
                h = (g = document.elementFromPoint(_.clientX, _.clientY)) ? g.getAttribute("data-k") : null;
                if (v === stickTouchID || g == vkMap.stick && v != tpadTouchID) {
                    !0, vkState.stick[1] = 1;
                    var S = _.clientX,
                        y = _.clientY;
                    S < u - l && (emuKeyState[1] = !0), S > u + l && (emuKeyState[0] = !0), y < a - l && (emuKeyState[3] = !0), y > a + l && (emuKeyState[2] = !0), S = Math.max(u - s / 2, S), S = Math.min(u + s / 2, S), y = Math.max(a - c / 2, y), u = S, a = y = Math.min(a + c / 2, y), i = !0, d = v
                } else v === tpadTouchID || isPointInRect(_.clientX, _.clientY, m) && !h ? (n = !0, r = 256 * clamp01((_.clientX - m.x) / m.width), o = 192 * clamp01((_.clientY - m.y) / m.height), f = v) : h && (vkState[h][1] = 1)
            }
            for (var h in touched = n ? 1 : 0, touchX = r, touchY = o, vkState)
                if (vkState[h][0] != vkState[h][1]) {
                    var g = vkMap[h];
                    vkState[h][0] = vkState[h][1], vkState[h][1] ? (g.classList.add("vk-touched"), "menu" == h && uiSwitchTo("menu")) : (g.classList.remove("vk-touched"), "stick" == h && (i = !0))
                } for (p = 0; p < emuKeyState.length; p++) {
                h = e[p];
                vkState[h] && vkState[h][1] && (emuKeyState[p] = !0)
            }
            i && (vkMap.stick.style = makeVKStyle(a - s / 2, u - s / 2, s, c, vkStickPos[4])), stickTouchID = d, tpadTouchID = f
        }
    }

    function convertKeyCode(e) {
        for (var n = 0; n < 14; n++)
            if (e == t[n]) return n;
        return -1
    } ["touchstart", "touchmove", "touchend", "touchcancel", "touchenter", "touchleave"].forEach(e => {
        window.addEventListener(e, handleTouch)
    }), window.onmousedown = window.onmouseup = window.onmousemove = (e => {
        if (emuIsRunning) {
            "mousedown" == e.type && tryInitSound();
            var t = screenCanvas[1].getBoundingClientRect();
            e.preventDefault(), e.stopPropagation();
            var n = 0 != e.buttons && isPointInRect(e.clientX, e.clientY, t),
                r = (e.clientX - t.x) / t.width * 256,
                o = (e.clientY - t.y) / t.height * 192;
            touched = n ? 1 : 0, touchX = r, touchY = o
        }
    }), window.onkeydown = window.onkeyup = (e => {
        if (emuIsRunning) {
            e.preventDefault();
            var t = "keydown" === e.type,
                n = convertKeyCode(e.keyCode);
            n >= 0 && (emuKeyState[n] = t), 27 == e.keyCode && uiSwitchTo("menu")
        }
    });
    var currentConnectedGamepad = -1,
        gamePadKeyMap = {
            a: 1,
            b: 0,
            x: 3,
            y: 2,
            l: 4,
            r: 5,
            select: 9,
            start: 16,
            up: 12,
            down: 13,
            left: 14,
            right: 15
        };

    function processGamepadInput() {
        if (!(currentConnectedGamepad < 0)) {
            var e = navigator.getGamepads()[currentConnectedGamepad];
            if (!e) return showMsg("Gamepad disconnected."), void(currentConnectedGamepad = -1);
            for (var t = 0; t < emuKeyState.length; t++) emuKeyState[t] = !1;
            for (var n in gamePadKeyMap) e.buttons[gamePadKeyMap[n]].pressed && (emuKeyState[keyNameToKeyId[n]] = !0);
            e.axes[0] < -.5 && (emuKeyState[keyNameToKeyId.left] = !0), e.axes[0] > .5 && (emuKeyState[keyNameToKeyId.right] = !0), e.axes[1] < -.5 && (emuKeyState[keyNameToKeyId.up] = !0), e.axes[1] > .5 && (emuKeyState[keyNameToKeyId.down] = !0)
        }
    }

    function whatsNew() {
        alert("\n1. Added setting option to hide the virtual keyboard.\n")
    }
    window.addEventListener("gamepadconnected", function(e) {
        console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.", e.gamepad.index, e.gamepad.id, e.gamepad.buttons.length, e.gamepad.axes.length), showMsg("Gamepad connected."), currentConnectedGamepad = e.gamepad.index
    })
} else console.log("No Desmond player found!");
var key, Module = void 0 !== Module ? Module : {},
    moduleOverrides = {};
for (key in Module) Module.hasOwnProperty(key) && (moduleOverrides[key] = Module[key]);
var read_, readAsync, readBinary, setWindowTitle, nodeFS, nodePath, arguments_ = [],
    thisProgram = "./this.program",
    quit_ = function(e, t) {
        throw t
    },
    ENVIRONMENT_IS_WEB = "object" == typeof window,
    ENVIRONMENT_IS_WORKER = "function" == typeof importScripts,
    ENVIRONMENT_IS_NODE = "object" == typeof process && "object" == typeof process.versions && "string" == typeof process.versions.node,
    scriptDirectory = "";

function locateFile(e) {
    return Module.locateFile ? Module.locateFile(e, scriptDirectory) : scriptDirectory + e
}
ENVIRONMENT_IS_NODE ? (scriptDirectory = ENVIRONMENT_IS_WORKER ? require("path").dirname(scriptDirectory) + "/" : __dirname + "/", read_ = function(e, t) {
    return nodeFS || (nodeFS = require("fs")), nodePath || (nodePath = require("path")), e = nodePath.normalize(e), nodeFS.readFileSync(e, t ? null : "utf8")
}, readBinary = function(e) {
    var t = read_(e, !0);
    return t.buffer || (t = new Uint8Array(t)), assert(t.buffer), t
}, readAsync = function(e, t, n) {
    nodeFS || (nodeFS = require("fs")), nodePath || (nodePath = require("path")), e = nodePath.normalize(e), nodeFS.readFile(e, function(e, r) {
        e ? n(e) : t(r.buffer)
    })
}, process.argv.length > 1 && (thisProgram = process.argv[1].replace(/\\/g, "/")), arguments_ = process.argv.slice(2), "undefined" != typeof module && (module.exports = Module), process.on("uncaughtException", function(e) {
    if (!(e instanceof ExitStatus)) throw e
}), process.on("unhandledRejection", abort), quit_ = function(e, t) {
    if (keepRuntimeAlive()) throw process.exitCode = e, t;
    process.exit(e)
}, Module.inspect = function() {
    return "[Emscripten Module object]"
}) : (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) && (ENVIRONMENT_IS_WORKER ? scriptDirectory = self.location.href : "undefined" != typeof document && document.currentScript && (scriptDirectory = document.currentScript.src), scriptDirectory = 0 !== scriptDirectory.indexOf("blob:") ? scriptDirectory.substr(0, scriptDirectory.lastIndexOf("/") + 1) : "", read_ = function(e) {
    var t = new XMLHttpRequest;
    return t.open("GET", e, !1), t.send(null), t.responseText
}, ENVIRONMENT_IS_WORKER && (readBinary = function(e) {
    var t = new XMLHttpRequest;
    return t.open("GET", e, !1), t.responseType = "arraybuffer", t.send(null), new Uint8Array(t.response)
}), readAsync = function(e, t, n) {
    var r = new XMLHttpRequest;
    r.open("GET", e, !0), r.responseType = "arraybuffer", r.onload = function() {
        200 == r.status || 0 == r.status && r.response ? t(r.response) : n()
    }, r.onerror = n, r.send(null)
}, setWindowTitle = function(e) {
    document.title = e
});
var out = Module.print || console.log.bind(console),
    err = Module.printErr || console.warn.bind(console);
for (key in moduleOverrides) moduleOverrides.hasOwnProperty(key) && (Module[key] = moduleOverrides[key]);
moduleOverrides = null, Module.arguments && (arguments_ = Module.arguments), Module.thisProgram && (thisProgram = Module.thisProgram), Module.quit && (quit_ = Module.quit);
var wasmBinary, tempRet0 = 0,
    setTempRet0 = function(e) {
        tempRet0 = e
    };
Module.wasmBinary && (wasmBinary = Module.wasmBinary);
var wasmMemory, noExitRuntime = Module.noExitRuntime || !0;
"object" != typeof WebAssembly && abort("no native wasm support detected");
var EXITSTATUS, ABORT = !1;

function assert(e, t) {
    e || abort("Assertion failed: " + t)
}
var buffer, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64, UTF8Decoder = "undefined" != typeof TextDecoder ? new TextDecoder("utf8") : void 0;

function UTF8ArrayToString(e, t, n) {
    for (var r = t + n, o = t; e[o] && !(o >= r);) ++o;
    if (o - t > 16 && e.subarray && UTF8Decoder) return UTF8Decoder.decode(e.subarray(t, o));
    for (var i = ""; t < o;) {
        var a = e[t++];
        if (128 & a) {
            var u = 63 & e[t++];
            if (192 != (224 & a)) {
                var s = 63 & e[t++];
                if ((a = 224 == (240 & a) ? (15 & a) << 12 | u << 6 | s : (7 & a) << 18 | u << 12 | s << 6 | 63 & e[t++]) < 65536) i += String.fromCharCode(a);
                else {
                    var c = a - 65536;
                    i += String.fromCharCode(55296 | c >> 10, 56320 | 1023 & c)
                }
            } else i += String.fromCharCode((31 & a) << 6 | u)
        } else i += String.fromCharCode(a)
    }
    return i
}

function UTF8ToString(e, t) {
    return e ? UTF8ArrayToString(HEAPU8, e, t) : ""
}

function stringToUTF8Array(e, t, n, r) {
    if (!(r > 0)) return 0;
    for (var o = n, i = n + r - 1, a = 0; a < e.length; ++a) {
        var u = e.charCodeAt(a);
        if (u >= 55296 && u <= 57343) u = 65536 + ((1023 & u) << 10) | 1023 & e.charCodeAt(++a);
        if (u <= 127) {
            if (n >= i) break;
            t[n++] = u
        } else if (u <= 2047) {
            if (n + 1 >= i) break;
            t[n++] = 192 | u >> 6, t[n++] = 128 | 63 & u
        } else if (u <= 65535) {
            if (n + 2 >= i) break;
            t[n++] = 224 | u >> 12, t[n++] = 128 | u >> 6 & 63, t[n++] = 128 | 63 & u
        } else {
            if (n + 3 >= i) break;
            t[n++] = 240 | u >> 18, t[n++] = 128 | u >> 12 & 63, t[n++] = 128 | u >> 6 & 63, t[n++] = 128 | 63 & u
        }
    }
    return t[n] = 0, n - o
}

function stringToUTF8(e, t, n) {
    return stringToUTF8Array(e, HEAPU8, t, n)
}

function lengthBytesUTF8(e) {
    for (var t = 0, n = 0; n < e.length; ++n) {
        var r = e.charCodeAt(n);
        r >= 55296 && r <= 57343 && (r = 65536 + ((1023 & r) << 10) | 1023 & e.charCodeAt(++n)), r <= 127 ? ++t : t += r <= 2047 ? 2 : r <= 65535 ? 3 : 4
    }
    return t
}

function allocateUTF8(e) {
    var t = lengthBytesUTF8(e) + 1,
        n = _malloc(t);
    return n && stringToUTF8Array(e, HEAP8, n, t), n
}

function writeArrayToMemory(e, t) {
    HEAP8.set(e, t)
}

function writeAsciiToMemory(e, t, n) {
    for (var r = 0; r < e.length; ++r) HEAP8[t++ >> 0] = e.charCodeAt(r);
    n || (HEAP8[t >> 0] = 0)
}

function updateGlobalBufferAndViews(e) {
    buffer = e, Module.HEAP8 = HEAP8 = new Int8Array(e), Module.HEAP16 = HEAP16 = new Int16Array(e), Module.HEAP32 = HEAP32 = new Int32Array(e), Module.HEAPU8 = HEAPU8 = new Uint8Array(e), Module.HEAPU16 = HEAPU16 = new Uint16Array(e), Module.HEAPU32 = HEAPU32 = new Uint32Array(e), Module.HEAPF32 = HEAPF32 = new Float32Array(e), Module.HEAPF64 = HEAPF64 = new Float64Array(e)
}
var wasmTable, INITIAL_MEMORY = Module.INITIAL_MEMORY || 629145600,
    __ATPRERUN__ = [],
    __ATINIT__ = [],
    __ATMAIN__ = [],
    __ATPOSTRUN__ = [],
    runtimeInitialized = !1,
    runtimeExited = !1,
    runtimeKeepaliveCounter = 0;

function keepRuntimeAlive() {
    return noExitRuntime || runtimeKeepaliveCounter > 0
}

function preRun() {
    if (Module.preRun)
        for ("function" == typeof Module.preRun && (Module.preRun = [Module.preRun]); Module.preRun.length;) addOnPreRun(Module.preRun.shift());
    callRuntimeCallbacks(__ATPRERUN__)
}

function initRuntime() {
    runtimeInitialized = !0, Module.noFSInit || FS.init.initialized || FS.init(), FS.ignorePermissions = !1, TTY.init(), callRuntimeCallbacks(__ATINIT__)
}

function preMain() {
    callRuntimeCallbacks(__ATMAIN__)
}

function exitRuntime() {
    runtimeExited = !0
}

function postRun() {
    if (Module.postRun)
        for ("function" == typeof Module.postRun && (Module.postRun = [Module.postRun]); Module.postRun.length;) addOnPostRun(Module.postRun.shift());
    callRuntimeCallbacks(__ATPOSTRUN__)
}

function addOnPreRun(e) {
    __ATPRERUN__.unshift(e)
}

function addOnInit(e) {
    __ATINIT__.unshift(e)
}

function addOnPostRun(e) {
    __ATPOSTRUN__.unshift(e)
}
var runDependencies = 0,
    runDependencyWatcher = null,
    dependenciesFulfilled = null;

function getUniqueRunDependency(e) {
    return e
}

function addRunDependency(e) {
    runDependencies++, Module.monitorRunDependencies && Module.monitorRunDependencies(runDependencies)
}

function removeRunDependency(e) {
    if (runDependencies--, Module.monitorRunDependencies && Module.monitorRunDependencies(runDependencies), 0 == runDependencies && (null !== runDependencyWatcher && (clearInterval(runDependencyWatcher), runDependencyWatcher = null), dependenciesFulfilled)) {
        var t = dependenciesFulfilled;
        dependenciesFulfilled = null, t()
    }
}

function abort(e) {
    throw Module.onAbort && Module.onAbort(e), err(e += ""), ABORT = !0, EXITSTATUS = 1, e = "abort(" + e + "). Build with -s ASSERTIONS=1 for more info.", new WebAssembly.RuntimeError(e)
}
Module.preloadedImages = {}, Module.preloadedAudios = {};
var wasmBinaryFile, tempDouble, tempI64, dataURIPrefix = "data:application/octet-stream;base64,";

function isDataURI(e) {
    return e.startsWith(dataURIPrefix)
}

function isFileURI(e) {
    return e.startsWith("file://")
}

function getBinary(e) {
    try {
        if (e == wasmBinaryFile && wasmBinary) return new Uint8Array(wasmBinary);
        if (readBinary) return readBinary(e);
        throw "both async and sync fetching of the wasm failed"
    } catch (e) {
        abort(e)
    }
}

function getBinaryPromise() {
    if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)) {
        if ("function" == typeof fetch && !isFileURI(wasmBinaryFile)) return fetch(wasmBinaryFile, {
            credentials: "same-origin"
        }).then(function(e) {
            if (!e.ok) throw "failed to load wasm binary file at '" + wasmBinaryFile + "'";
            return e.arrayBuffer()
        }).catch(function() {
            return getBinary(wasmBinaryFile)
        });
        if (readAsync) return new Promise(function(e, t) {
            readAsync(wasmBinaryFile, function(t) {
                e(new Uint8Array(t))
            }, t)
        })
    }
    return Promise.resolve().then(function() {
        return getBinary(wasmBinaryFile)
    })
}

function createWasm() {
    var e = {
        a: asmLibraryArg
    };

    function t(e, t) {
        var n = e.exports;
        Module.asm = n, updateGlobalBufferAndViews((wasmMemory = Module.asm.v).buffer), wasmTable = Module.asm.T, addOnInit(Module.asm.w), removeRunDependency("wasm-instantiate")
    }

    function n(e) {
        t(e.instance)
    }

    function r(t) {
        return getBinaryPromise().then(function(t) {
            return WebAssembly.instantiate(t, e)
        }).then(function(e) {
            return e
        }).then(t, function(e) {
            err("failed to asynchronously prepare wasm: " + e), abort(e)
        })
    }
    if (addRunDependency("wasm-instantiate"), Module.instantiateWasm) try {
        return Module.instantiateWasm(e, t)
    } catch (e) {
        return err("Module.instantiateWasm callback failed with error: " + e), !1
    }
    return wasmBinary || "function" != typeof WebAssembly.instantiateStreaming || isDataURI(wasmBinaryFile) || isFileURI(wasmBinaryFile) || "function" != typeof fetch ? r(n) : fetch(wasmBinaryFile, {
        credentials: "same-origin"
    }).then(function(t) {
        return WebAssembly.instantiateStreaming(t, e).then(n, function(e) {
            return err("wasm streaming compile failed: " + e), err("falling back to ArrayBuffer instantiation"), r(n)
        })
    }), {}
}
isDataURI(wasmBinaryFile = "desmond.wasm") || (wasmBinaryFile = locateFile(wasmBinaryFile));
var ASM_CONSTS = {
    436609: function() {
        wasmReady()
    }
};

function callRuntimeCallbacks(e) {
    for (; e.length > 0;) {
        var t = e.shift();
        if ("function" != typeof t) {
            var n = t.func;
            "number" == typeof n ? void 0 === t.arg ? wasmTable.get(n)() : wasmTable.get(n)(t.arg) : n(void 0 === t.arg ? null : t.arg)
        } else t(Module)
    }
}

function demangle(e) {
    return e
}

function demangleAll(e) {
    return e.replace(/\b_Z[\w\d_]+/g, function(e) {
        var t = demangle(e);
        return e === t ? e : t + " [" + e + "]"
    })
}

function handleException(e) {
    if (e instanceof ExitStatus || "unwind" == e) return EXITSTATUS;
    err("exception thrown: " + e), quit_(1, e)
}

function jsStackTrace() {
    var e = new Error;
    if (!e.stack) {
        try {
            throw new Error
        } catch (t) {
            e = t
        }
        if (!e.stack) return "(no stack trace available)"
    }
    return e.stack.toString()
}

function stackTrace() {
    var e = jsStackTrace();
    return Module.extraStackTrace && (e += "\n" + Module.extraStackTrace()), demangleAll(e)
}

function ___assert_fail(e, t, n, r) {
    abort("Assertion failed: " + UTF8ToString(e) + ", at: " + [t ? UTF8ToString(t) : "unknown filename", n, r ? UTF8ToString(r) : "unknown function"])
}

function ___cxa_allocate_exception(e) {
    return _malloc(e + 16) + 16
}

function _atexit(e, t) {}

function ___cxa_atexit(e, t) {
    return _atexit(e, t)
}

function ExceptionInfo(e) {
    this.excPtr = e, this.ptr = e - 16, this.set_type = function(e) {
        HEAP32[this.ptr + 4 >> 2] = e
    }, this.get_type = function() {
        return HEAP32[this.ptr + 4 >> 2]
    }, this.set_destructor = function(e) {
        HEAP32[this.ptr + 8 >> 2] = e
    }, this.get_destructor = function() {
        return HEAP32[this.ptr + 8 >> 2]
    }, this.set_refcount = function(e) {
        HEAP32[this.ptr >> 2] = e
    }, this.set_caught = function(e) {
        e = e ? 1 : 0, HEAP8[this.ptr + 12 >> 0] = e
    }, this.get_caught = function() {
        return 0 != HEAP8[this.ptr + 12 >> 0]
    }, this.set_rethrown = function(e) {
        e = e ? 1 : 0, HEAP8[this.ptr + 13 >> 0] = e
    }, this.get_rethrown = function() {
        return 0 != HEAP8[this.ptr + 13 >> 0]
    }, this.init = function(e, t) {
        this.set_type(e), this.set_destructor(t), this.set_refcount(0), this.set_caught(!1), this.set_rethrown(!1)
    }, this.add_ref = function() {
        var e = HEAP32[this.ptr >> 2];
        HEAP32[this.ptr >> 2] = e + 1
    }, this.release_ref = function() {
        var e = HEAP32[this.ptr >> 2];
        return HEAP32[this.ptr >> 2] = e - 1, 1 === e
    }
}
Module.callRuntimeCallbacks = callRuntimeCallbacks, Module.demangle = demangle, Module.demangleAll = demangleAll, Module.handleException = handleException, Module.jsStackTrace = jsStackTrace, Module.stackTrace = stackTrace, Module.___assert_fail = ___assert_fail, Module.___cxa_allocate_exception = ___cxa_allocate_exception, Module._atexit = _atexit, Module.___cxa_atexit = ___cxa_atexit, Module.ExceptionInfo = ExceptionInfo;
var exceptionLast = 0;
Module.exceptionLast = exceptionLast;
var uncaughtExceptionCount = 0;

function ___cxa_throw(e, t, n) {
    throw new ExceptionInfo(e).init(t, n), exceptionLast = e, uncaughtExceptionCount++, e
}

function _tzset_impl() {
    var e = (new Date).getFullYear(),
        t = new Date(e, 0, 1),
        n = new Date(e, 6, 1),
        r = t.getTimezoneOffset(),
        o = n.getTimezoneOffset(),
        i = Math.max(r, o);

    function a(e) {
        var t = e.toTimeString().match(/\(([A-Za-z ]+)\)$/);
        return t ? t[1] : "GMT"
    }
    HEAP32[__get_timezone() >> 2] = 60 * i, HEAP32[__get_daylight() >> 2] = Number(r != o);
    var u = a(t),
        s = a(n),
        c = allocateUTF8(u),
        l = allocateUTF8(s);
    o < r ? (HEAP32[__get_tzname() >> 2] = c, HEAP32[__get_tzname() + 4 >> 2] = l) : (HEAP32[__get_tzname() >> 2] = l, HEAP32[__get_tzname() + 4 >> 2] = c)
}

function _tzset() {
    _tzset.called || (_tzset.called = !0, _tzset_impl())
}

function _localtime_r(e, t) {
    _tzset();
    var n = new Date(1e3 * HEAP32[e >> 2]);
    HEAP32[t >> 2] = n.getSeconds(), HEAP32[t + 4 >> 2] = n.getMinutes(), HEAP32[t + 8 >> 2] = n.getHours(), HEAP32[t + 12 >> 2] = n.getDate(), HEAP32[t + 16 >> 2] = n.getMonth(), HEAP32[t + 20 >> 2] = n.getFullYear() - 1900, HEAP32[t + 24 >> 2] = n.getDay();
    var r = new Date(n.getFullYear(), 0, 1),
        o = (n.getTime() - r.getTime()) / 864e5 | 0;
    HEAP32[t + 28 >> 2] = o, HEAP32[t + 36 >> 2] = -60 * n.getTimezoneOffset();
    var i = new Date(n.getFullYear(), 6, 1).getTimezoneOffset(),
        a = r.getTimezoneOffset(),
        u = 0 | (i != a && n.getTimezoneOffset() == Math.min(a, i));
    HEAP32[t + 32 >> 2] = u;
    var s = HEAP32[__get_tzname() + (u ? 4 : 0) >> 2];
    return HEAP32[t + 40 >> 2] = s, t
}

function ___localtime_r(e, t) {
    return _localtime_r(e, t)
}

function setErrNo(e) {
    return HEAP32[___errno_location() >> 2] = e, e
}
Module.uncaughtExceptionCount = uncaughtExceptionCount, Module.___cxa_throw = ___cxa_throw, Module._tzset_impl = _tzset_impl, Module._tzset = _tzset, Module._localtime_r = _localtime_r, Module.___localtime_r = ___localtime_r, Module.setErrNo = setErrNo;
var PATH = {
    splitPath: function(e) {
        return /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/.exec(e).slice(1)
    },
    normalizeArray: function(e, t) {
        for (var n = 0, r = e.length - 1; r >= 0; r--) {
            var o = e[r];
            "." === o ? e.splice(r, 1) : ".." === o ? (e.splice(r, 1), n++) : n && (e.splice(r, 1), n--)
        }
        if (t)
            for (; n; n--) e.unshift("..");
        return e
    },
    normalize: function(e) {
        var t = "/" === e.charAt(0),
            n = "/" === e.substr(-1);
        return (e = PATH.normalizeArray(e.split("/").filter(function(e) {
            return !!e
        }), !t).join("/")) || t || (e = "."), e && n && (e += "/"), (t ? "/" : "") + e
    },
    dirname: function(e) {
        var t = PATH.splitPath(e),
            n = t[0],
            r = t[1];
        return n || r ? (r && (r = r.substr(0, r.length - 1)), n + r) : "."
    },
    basename: function(e) {
        if ("/" === e) return "/";
        var t = (e = (e = PATH.normalize(e)).replace(/\/$/, "")).lastIndexOf("/");
        return -1 === t ? e : e.substr(t + 1)
    },
    extname: function(e) {
        return PATH.splitPath(e)[3]
    },
    join: function() {
        var e = Array.prototype.slice.call(arguments, 0);
        return PATH.normalize(e.join("/"))
    },
    join2: function(e, t) {
        return PATH.normalize(e + "/" + t)
    }
};

function getRandomDevice() {
    if ("object" == typeof crypto && "function" == typeof crypto.getRandomValues) {
        var e = new Uint8Array(1);
        return function() {
            return crypto.getRandomValues(e), e[0]
        }
    }
    if (ENVIRONMENT_IS_NODE) try {
        var t = require("crypto");
        return function() {
            return t.randomBytes(1)[0]
        }
    } catch (e) {}
    return function() {
        abort("randomDevice")
    }
}
Module.PATH = PATH, Module.getRandomDevice = getRandomDevice;
var PATH_FS = {
    resolve: function() {
        for (var e = "", t = !1, n = arguments.length - 1; n >= -1 && !t; n--) {
            var r = n >= 0 ? arguments[n] : FS.cwd();
            if ("string" != typeof r) throw new TypeError("Arguments to path.resolve must be strings");
            if (!r) return "";
            e = r + "/" + e, t = "/" === r.charAt(0)
        }
        return (t ? "/" : "") + (e = PATH.normalizeArray(e.split("/").filter(function(e) {
            return !!e
        }), !t).join("/")) || "."
    },
    relative: function(e, t) {
        function n(e) {
            for (var t = 0; t < e.length && "" === e[t]; t++);
            for (var n = e.length - 1; n >= 0 && "" === e[n]; n--);
            return t > n ? [] : e.slice(t, n - t + 1)
        }
        e = PATH_FS.resolve(e).substr(1), t = PATH_FS.resolve(t).substr(1);
        for (var r = n(e.split("/")), o = n(t.split("/")), i = Math.min(r.length, o.length), a = i, u = 0; u < i; u++)
            if (r[u] !== o[u]) {
                a = u;
                break
            } var s = [];
        for (u = a; u < r.length; u++) s.push("..");
        return (s = s.concat(o.slice(a))).join("/")
    }
};
Module.PATH_FS = PATH_FS;
var TTY = {
    ttys: [],
    init: function() {},
    shutdown: function() {},
    register: function(e, t) {
        TTY.ttys[e] = {
            input: [],
            output: [],
            ops: t
        }, FS.registerDevice(e, TTY.stream_ops)
    },
    stream_ops: {
        open: function(e) {
            var t = TTY.ttys[e.node.rdev];
            if (!t) throw new FS.ErrnoError(43);
            e.tty = t, e.seekable = !1
        },
        close: function(e) {
            e.tty.ops.flush(e.tty)
        },
        flush: function(e) {
            e.tty.ops.flush(e.tty)
        },
        read: function(e, t, n, r, o) {
            if (!e.tty || !e.tty.ops.get_char) throw new FS.ErrnoError(60);
            for (var i = 0, a = 0; a < r; a++) {
                var u;
                try {
                    u = e.tty.ops.get_char(e.tty)
                } catch (e) {
                    throw new FS.ErrnoError(29)
                }
                if (void 0 === u && 0 === i) throw new FS.ErrnoError(6);
                if (null == u) break;
                i++, t[n + a] = u
            }
            return i && (e.node.timestamp = Date.now()), i
        },
        write: function(e, t, n, r, o) {
            if (!e.tty || !e.tty.ops.put_char) throw new FS.ErrnoError(60);
            try {
                for (var i = 0; i < r; i++) e.tty.ops.put_char(e.tty, t[n + i])
            } catch (e) {
                throw new FS.ErrnoError(29)
            }
            return r && (e.node.timestamp = Date.now()), i
        }
    },
    default_tty_ops: {
        get_char: function(e) {
            if (!e.input.length) {
                var t = null;
                if (ENVIRONMENT_IS_NODE) {
                    var n = Buffer.alloc(256),
                        r = 0;
                    try {
                        r = nodeFS.readSync(process.stdin.fd, n, 0, 256, null)
                    } catch (e) {
                        if (!e.toString().includes("EOF")) throw e;
                        r = 0
                    }
                    t = r > 0 ? n.slice(0, r).toString("utf-8") : null
                } else "undefined" != typeof window && "function" == typeof window.prompt ? null !== (t = window.prompt("Input: ")) && (t += "\n") : "function" == typeof readline && null !== (t = readline()) && (t += "\n");
                if (!t) return null;
                e.input = intArrayFromString(t, !0)
            }
            return e.input.shift()
        },
        put_char: function(e, t) {
            null === t || 10 === t ? (out(UTF8ArrayToString(e.output, 0)), e.output = []) : 0 != t && e.output.push(t)
        },
        flush: function(e) {
            e.output && e.output.length > 0 && (out(UTF8ArrayToString(e.output, 0)), e.output = [])
        }
    },
    default_tty1_ops: {
        put_char: function(e, t) {
            null === t || 10 === t ? (err(UTF8ArrayToString(e.output, 0)), e.output = []) : 0 != t && e.output.push(t)
        },
        flush: function(e) {
            e.output && e.output.length > 0 && (err(UTF8ArrayToString(e.output, 0)), e.output = [])
        }
    }
};

function zeroMemory(e, t) {
    HEAPU8.fill(0, e, e + t)
}

function alignMemory(e, t) {
    return Math.ceil(e / t) * t
}

function mmapAlloc(e) {
    abort()
}
Module.TTY = TTY, Module.zeroMemory = zeroMemory, Module.alignMemory = alignMemory, Module.mmapAlloc = mmapAlloc;
var MEMFS = {
    ops_table: null,
    mount: function(e) {
        return MEMFS.createNode(null, "/", 16895, 0)
    },
    createNode: function(e, t, n, r) {
        if (FS.isBlkdev(n) || FS.isFIFO(n)) throw new FS.ErrnoError(63);
        MEMFS.ops_table || (MEMFS.ops_table = {
            dir: {
                node: {
                    getattr: MEMFS.node_ops.getattr,
                    setattr: MEMFS.node_ops.setattr,
                    lookup: MEMFS.node_ops.lookup,
                    mknod: MEMFS.node_ops.mknod,
                    rename: MEMFS.node_ops.rename,
                    unlink: MEMFS.node_ops.unlink,
                    rmdir: MEMFS.node_ops.rmdir,
                    readdir: MEMFS.node_ops.readdir,
                    symlink: MEMFS.node_ops.symlink
                },
                stream: {
                    llseek: MEMFS.stream_ops.llseek
                }
            },
            file: {
                node: {
                    getattr: MEMFS.node_ops.getattr,
                    setattr: MEMFS.node_ops.setattr
                },
                stream: {
                    llseek: MEMFS.stream_ops.llseek,
                    read: MEMFS.stream_ops.read,
                    write: MEMFS.stream_ops.write,
                    allocate: MEMFS.stream_ops.allocate,
                    mmap: MEMFS.stream_ops.mmap,
                    msync: MEMFS.stream_ops.msync
                }
            },
            link: {
                node: {
                    getattr: MEMFS.node_ops.getattr,
                    setattr: MEMFS.node_ops.setattr,
                    readlink: MEMFS.node_ops.readlink
                },
                stream: {}
            },
            chrdev: {
                node: {
                    getattr: MEMFS.node_ops.getattr,
                    setattr: MEMFS.node_ops.setattr
                },
                stream: FS.chrdev_stream_ops
            }
        });
        var o = FS.createNode(e, t, n, r);
        return FS.isDir(o.mode) ? (o.node_ops = MEMFS.ops_table.dir.node, o.stream_ops = MEMFS.ops_table.dir.stream, o.contents = {}) : FS.isFile(o.mode) ? (o.node_ops = MEMFS.ops_table.file.node, o.stream_ops = MEMFS.ops_table.file.stream, o.usedBytes = 0, o.contents = null) : FS.isLink(o.mode) ? (o.node_ops = MEMFS.ops_table.link.node, o.stream_ops = MEMFS.ops_table.link.stream) : FS.isChrdev(o.mode) && (o.node_ops = MEMFS.ops_table.chrdev.node, o.stream_ops = MEMFS.ops_table.chrdev.stream), o.timestamp = Date.now(), e && (e.contents[t] = o, e.timestamp = o.timestamp), o
    },
    getFileDataAsTypedArray: function(e) {
        return e.contents ? e.contents.subarray ? e.contents.subarray(0, e.usedBytes) : new Uint8Array(e.contents) : new Uint8Array(0)
    },
    expandFileStorage: function(e, t) {
        var n = e.contents ? e.contents.length : 0;
        if (!(n >= t)) {
            t = Math.max(t, n * (n < 1048576 ? 2 : 1.125) >>> 0), 0 != n && (t = Math.max(t, 256));
            var r = e.contents;
            e.contents = new Uint8Array(t), e.usedBytes > 0 && e.contents.set(r.subarray(0, e.usedBytes), 0)
        }
    },
    resizeFileStorage: function(e, t) {
        if (e.usedBytes != t)
            if (0 == t) e.contents = null, e.usedBytes = 0;
            else {
                var n = e.contents;
                e.contents = new Uint8Array(t), n && e.contents.set(n.subarray(0, Math.min(t, e.usedBytes))), e.usedBytes = t
            }
    },
    node_ops: {
        getattr: function(e) {
            var t = {};
            return t.dev = FS.isChrdev(e.mode) ? e.id : 1, t.ino = e.id, t.mode = e.mode, t.nlink = 1, t.uid = 0, t.gid = 0, t.rdev = e.rdev, FS.isDir(e.mode) ? t.size = 4096 : FS.isFile(e.mode) ? t.size = e.usedBytes : FS.isLink(e.mode) ? t.size = e.link.length : t.size = 0, t.atime = new Date(e.timestamp), t.mtime = new Date(e.timestamp), t.ctime = new Date(e.timestamp), t.blksize = 4096, t.blocks = Math.ceil(t.size / t.blksize), t
        },
        setattr: function(e, t) {
            void 0 !== t.mode && (e.mode = t.mode), void 0 !== t.timestamp && (e.timestamp = t.timestamp), void 0 !== t.size && MEMFS.resizeFileStorage(e, t.size)
        },
        lookup: function(e, t) {
            throw FS.genericErrors[44]
        },
        mknod: function(e, t, n, r) {
            return MEMFS.createNode(e, t, n, r)
        },
        rename: function(e, t, n) {
            if (FS.isDir(e.mode)) {
                var r;
                try {
                    r = FS.lookupNode(t, n)
                } catch (e) {}
                if (r)
                    for (var o in r.contents) throw new FS.ErrnoError(55)
            }
            delete e.parent.contents[e.name], e.parent.timestamp = Date.now(), e.name = n, t.contents[n] = e, t.timestamp = e.parent.timestamp, e.parent = t
        },
        unlink: function(e, t) {
            delete e.contents[t], e.timestamp = Date.now()
        },
        rmdir: function(e, t) {
            var n = FS.lookupNode(e, t);
            for (var r in n.contents) throw new FS.ErrnoError(55);
            delete e.contents[t], e.timestamp = Date.now()
        },
        readdir: function(e) {
            var t = [".", ".."];
            for (var n in e.contents) e.contents.hasOwnProperty(n) && t.push(n);
            return t
        },
        symlink: function(e, t, n) {
            var r = MEMFS.createNode(e, t, 41471, 0);
            return r.link = n, r
        },
        readlink: function(e) {
            if (!FS.isLink(e.mode)) throw new FS.ErrnoError(28);
            return e.link
        }
    },
    stream_ops: {
        read: function(e, t, n, r, o) {
            var i = e.node.contents;
            if (o >= e.node.usedBytes) return 0;
            var a = Math.min(e.node.usedBytes - o, r);
            if (a > 8 && i.subarray) t.set(i.subarray(o, o + a), n);
            else
                for (var u = 0; u < a; u++) t[n + u] = i[o + u];
            return a
        },
        write: function(e, t, n, r, o, i) {
            if (!r) return 0;
            var a = e.node;
            if (a.timestamp = Date.now(), t.subarray && (!a.contents || a.contents.subarray)) {
                if (i) return a.contents = t.subarray(n, n + r), a.usedBytes = r, r;
                if (0 === a.usedBytes && 0 === o) return a.contents = t.slice(n, n + r), a.usedBytes = r, r;
                if (o + r <= a.usedBytes) return a.contents.set(t.subarray(n, n + r), o), r
            }
            if (MEMFS.expandFileStorage(a, o + r), a.contents.subarray && t.subarray) a.contents.set(t.subarray(n, n + r), o);
            else
                for (var u = 0; u < r; u++) a.contents[o + u] = t[n + u];
            return a.usedBytes = Math.max(a.usedBytes, o + r), r
        },
        llseek: function(e, t, n) {
            var r = t;
            if (1 === n ? r += e.position : 2 === n && FS.isFile(e.node.mode) && (r += e.node.usedBytes), r < 0) throw new FS.ErrnoError(28);
            return r
        },
        allocate: function(e, t, n) {
            MEMFS.expandFileStorage(e.node, t + n), e.node.usedBytes = Math.max(e.node.usedBytes, t + n)
        },
        mmap: function(e, t, n, r, o, i) {
            if (0 !== t) throw new FS.ErrnoError(28);
            if (!FS.isFile(e.node.mode)) throw new FS.ErrnoError(43);
            var a, u, s = e.node.contents;
            if (2 & i || s.buffer !== buffer) {
                if ((r > 0 || r + n < s.length) && (s = s.subarray ? s.subarray(r, r + n) : Array.prototype.slice.call(s, r, r + n)), u = !0, !(a = mmapAlloc(n))) throw new FS.ErrnoError(48);
                HEAP8.set(s, a)
            } else u = !1, a = s.byteOffset;
            return {
                ptr: a,
                allocated: u
            }
        },
        msync: function(e, t, n, r, o) {
            if (!FS.isFile(e.node.mode)) throw new FS.ErrnoError(43);
            if (2 & o) return 0;
            MEMFS.stream_ops.write(e, t, 0, r, n, !1);
            return 0
        }
    }
};

function asyncLoad(e, t, n, r) {
    var o = r ? "" : getUniqueRunDependency("al " + e);
    readAsync(e, function(n) {
        assert(n, 'Loading data file "' + e + '" failed (no arrayBuffer).'), t(new Uint8Array(n)), o && removeRunDependency(o)
    }, function(t) {
        if (!n) throw 'Loading data file "' + e + '" failed.';
        n()
    }), o && addRunDependency(o)
}
Module.MEMFS = MEMFS, Module.asyncLoad = asyncLoad;
var FS = {
    root: null,
    mounts: [],
    devices: {},
    streams: [],
    nextInode: 1,
    nameTable: null,
    currentPath: "/",
    initialized: !1,
    ignorePermissions: !0,
    ErrnoError: null,
    genericErrors: {},
    filesystems: null,
    syncFSRequests: 0,
    lookupPath: function(e, t) {
        if (t = t || {}, !(e = PATH_FS.resolve(FS.cwd(), e))) return {
            path: "",
            node: null
        };
        var n = {
            follow_mount: !0,
            recurse_count: 0
        };
        for (var r in n) void 0 === t[r] && (t[r] = n[r]);
        if (t.recurse_count > 8) throw new FS.ErrnoError(32);
        for (var o = PATH.normalizeArray(e.split("/").filter(function(e) {
                return !!e
            }), !1), i = FS.root, a = "/", u = 0; u < o.length; u++) {
            var s = u === o.length - 1;
            if (s && t.parent) break;
            if (i = FS.lookupNode(i, o[u]), a = PATH.join2(a, o[u]), FS.isMountpoint(i) && (!s || s && t.follow_mount) && (i = i.mounted.root), !s || t.follow)
                for (var c = 0; FS.isLink(i.mode);) {
                    var l = FS.readlink(a);
                    if (a = PATH_FS.resolve(PATH.dirname(a), l), i = FS.lookupPath(a, {
                            recurse_count: t.recurse_count
                        }).node, c++ > 40) throw new FS.ErrnoError(32)
                }
        }
        return {
            path: a,
            node: i
        }
    },
    getPath: function(e) {
        for (var t;;) {
            if (FS.isRoot(e)) {
                var n = e.mount.mountpoint;
                return t ? "/" !== n[n.length - 1] ? n + "/" + t : n + t : n
            }
            t = t ? e.name + "/" + t : e.name, e = e.parent
        }
    },
    hashName: function(e, t) {
        for (var n = 0, r = 0; r < t.length; r++) n = (n << 5) - n + t.charCodeAt(r) | 0;
        return (e + n >>> 0) % FS.nameTable.length
    },
    hashAddNode: function(e) {
        var t = FS.hashName(e.parent.id, e.name);
        e.name_next = FS.nameTable[t], FS.nameTable[t] = e
    },
    hashRemoveNode: function(e) {
        var t = FS.hashName(e.parent.id, e.name);
        if (FS.nameTable[t] === e) FS.nameTable[t] = e.name_next;
        else
            for (var n = FS.nameTable[t]; n;) {
                if (n.name_next === e) {
                    n.name_next = e.name_next;
                    break
                }
                n = n.name_next
            }
    },
    lookupNode: function(e, t) {
        var n = FS.mayLookup(e);
        if (n) throw new FS.ErrnoError(n, e);
        for (var r = FS.hashName(e.id, t), o = FS.nameTable[r]; o; o = o.name_next) {
            var i = o.name;
            if (o.parent.id === e.id && i === t) return o
        }
        return FS.lookup(e, t)
    },
    createNode: function(e, t, n, r) {
        var o = new FS.FSNode(e, t, n, r);
        return FS.hashAddNode(o), o
    },
    destroyNode: function(e) {
        FS.hashRemoveNode(e)
    },
    isRoot: function(e) {
        return e === e.parent
    },
    isMountpoint: function(e) {
        return !!e.mounted
    },
    isFile: function(e) {
        return 32768 == (61440 & e)
    },
    isDir: function(e) {
        return 16384 == (61440 & e)
    },
    isLink: function(e) {
        return 40960 == (61440 & e)
    },
    isChrdev: function(e) {
        return 8192 == (61440 & e)
    },
    isBlkdev: function(e) {
        return 24576 == (61440 & e)
    },
    isFIFO: function(e) {
        return 4096 == (61440 & e)
    },
    isSocket: function(e) {
        return 49152 == (49152 & e)
    },
    flagModes: {
        r: 0,
        "r+": 2,
        w: 577,
        "w+": 578,
        a: 1089,
        "a+": 1090
    },
    modeStringToFlags: function(e) {
        var t = FS.flagModes[e];
        if (void 0 === t) throw new Error("Unknown file open mode: " + e);
        return t
    },
    flagsToPermissionString: function(e) {
        var t = ["r", "w", "rw"][3 & e];
        return 512 & e && (t += "w"), t
    },
    nodePermissions: function(e, t) {
        return FS.ignorePermissions ? 0 : (!t.includes("r") || 292 & e.mode) && (!t.includes("w") || 146 & e.mode) && (!t.includes("x") || 73 & e.mode) ? 0 : 2
    },
    mayLookup: function(e) {
        var t = FS.nodePermissions(e, "x");
        return t || (e.node_ops.lookup ? 0 : 2)
    },
    mayCreate: function(e, t) {
        try {
            FS.lookupNode(e, t);
            return 20
        } catch (e) {}
        return FS.nodePermissions(e, "wx")
    },
    mayDelete: function(e, t, n) {
        var r;
        try {
            r = FS.lookupNode(e, t)
        } catch (e) {
            return e.errno
        }
        var o = FS.nodePermissions(e, "wx");
        if (o) return o;
        if (n) {
            if (!FS.isDir(r.mode)) return 54;
            if (FS.isRoot(r) || FS.getPath(r) === FS.cwd()) return 10
        } else if (FS.isDir(r.mode)) return 31;
        return 0
    },
    mayOpen: function(e, t) {
        return e ? FS.isLink(e.mode) ? 32 : FS.isDir(e.mode) && ("r" !== FS.flagsToPermissionString(t) || 512 & t) ? 31 : FS.nodePermissions(e, FS.flagsToPermissionString(t)) : 44
    },
    MAX_OPEN_FDS: 4096,
    nextfd: function(e, t) {
        e = e || 0, t = t || FS.MAX_OPEN_FDS;
        for (var n = e; n <= t; n++)
            if (!FS.streams[n]) return n;
        throw new FS.ErrnoError(33)
    },
    getStream: function(e) {
        return FS.streams[e]
    },
    createStream: function(e, t, n) {
        FS.FSStream || (FS.FSStream = function() {}, FS.FSStream.prototype = {
            object: {
                get: function() {
                    return this.node
                },
                set: function(e) {
                    this.node = e
                }
            },
            isRead: {
                get: function() {
                    return 1 != (2097155 & this.flags)
                }
            },
            isWrite: {
                get: function() {
                    return 0 != (2097155 & this.flags)
                }
            },
            isAppend: {
                get: function() {
                    return 1024 & this.flags
                }
            }
        });
        var r = new FS.FSStream;
        for (var o in e) r[o] = e[o];
        e = r;
        var i = FS.nextfd(t, n);
        return e.fd = i, FS.streams[i] = e, e
    },
    closeStream: function(e) {
        FS.streams[e] = null
    },
    chrdev_stream_ops: {
        open: function(e) {
            var t = FS.getDevice(e.node.rdev);
            e.stream_ops = t.stream_ops, e.stream_ops.open && e.stream_ops.open(e)
        },
        llseek: function() {
            throw new FS.ErrnoError(70)
        }
    },
    major: function(e) {
        return e >> 8
    },
    minor: function(e) {
        return 255 & e
    },
    makedev: function(e, t) {
        return e << 8 | t
    },
    registerDevice: function(e, t) {
        FS.devices[e] = {
            stream_ops: t
        }
    },
    getDevice: function(e) {
        return FS.devices[e]
    },
    getMounts: function(e) {
        for (var t = [], n = [e]; n.length;) {
            var r = n.pop();
            t.push(r), n.push.apply(n, r.mounts)
        }
        return t
    },
    syncfs: function(e, t) {
        "function" == typeof e && (t = e, e = !1), FS.syncFSRequests++, FS.syncFSRequests > 1 && err("warning: " + FS.syncFSRequests + " FS.syncfs operations in flight at once, probably just doing extra work");
        var n = FS.getMounts(FS.root.mount),
            r = 0;

        function o(e) {
            return FS.syncFSRequests--, t(e)
        }

        function i(e) {
            if (e) return i.errored ? void 0 : (i.errored = !0, o(e));
            ++r >= n.length && o(null)
        }
        n.forEach(function(t) {
            if (!t.type.syncfs) return i(null);
            t.type.syncfs(t, e, i)
        })
    },
    mount: function(e, t, n) {
        var r, o = "/" === n,
            i = !n;
        if (o && FS.root) throw new FS.ErrnoError(10);
        if (!o && !i) {
            var a = FS.lookupPath(n, {
                follow_mount: !1
            });
            if (n = a.path, r = a.node, FS.isMountpoint(r)) throw new FS.ErrnoError(10);
            if (!FS.isDir(r.mode)) throw new FS.ErrnoError(54)
        }
        var u = {
                type: e,
                opts: t,
                mountpoint: n,
                mounts: []
            },
            s = e.mount(u);
        return s.mount = u, u.root = s, o ? FS.root = s : r && (r.mounted = u, r.mount && r.mount.mounts.push(u)), s
    },
    unmount: function(e) {
        var t = FS.lookupPath(e, {
            follow_mount: !1
        });
        if (!FS.isMountpoint(t.node)) throw new FS.ErrnoError(28);
        var n = t.node,
            r = n.mounted,
            o = FS.getMounts(r);
        Object.keys(FS.nameTable).forEach(function(e) {
            for (var t = FS.nameTable[e]; t;) {
                var n = t.name_next;
                o.includes(t.mount) && FS.destroyNode(t), t = n
            }
        }), n.mounted = null;
        var i = n.mount.mounts.indexOf(r);
        n.mount.mounts.splice(i, 1)
    },
    lookup: function(e, t) {
        return e.node_ops.lookup(e, t)
    },
    mknod: function(e, t, n) {
        var r = FS.lookupPath(e, {
                parent: !0
            }).node,
            o = PATH.basename(e);
        if (!o || "." === o || ".." === o) throw new FS.ErrnoError(28);
        var i = FS.mayCreate(r, o);
        if (i) throw new FS.ErrnoError(i);
        if (!r.node_ops.mknod) throw new FS.ErrnoError(63);
        return r.node_ops.mknod(r, o, t, n)
    },
    create: function(e, t) {
        return t = void 0 !== t ? t : 438, t &= 4095, t |= 32768, FS.mknod(e, t, 0)
    },
    mkdir: function(e, t) {
        return t = void 0 !== t ? t : 511, t &= 1023, t |= 16384, FS.mknod(e, t, 0)
    },
    mkdirTree: function(e, t) {
        for (var n = e.split("/"), r = "", o = 0; o < n.length; ++o)
            if (n[o]) {
                r += "/" + n[o];
                try {
                    FS.mkdir(r, t)
                } catch (e) {
                    if (20 != e.errno) throw e
                }
            }
    },
    mkdev: function(e, t, n) {
        return void 0 === n && (n = t, t = 438), t |= 8192, FS.mknod(e, t, n)
    },
    symlink: function(e, t) {
        if (!PATH_FS.resolve(e)) throw new FS.ErrnoError(44);
        var n = FS.lookupPath(t, {
            parent: !0
        }).node;
        if (!n) throw new FS.ErrnoError(44);
        var r = PATH.basename(t),
            o = FS.mayCreate(n, r);
        if (o) throw new FS.ErrnoError(o);
        if (!n.node_ops.symlink) throw new FS.ErrnoError(63);
        return n.node_ops.symlink(n, r, e)
    },
    rename: function(e, t) {
        var n, r, o = PATH.dirname(e),
            i = PATH.dirname(t),
            a = PATH.basename(e),
            u = PATH.basename(t);
        if (n = FS.lookupPath(e, {
                parent: !0
            }).node, r = FS.lookupPath(t, {
                parent: !0
            }).node, !n || !r) throw new FS.ErrnoError(44);
        if (n.mount !== r.mount) throw new FS.ErrnoError(75);
        var s, c = FS.lookupNode(n, a),
            l = PATH_FS.relative(e, i);
        if ("." !== l.charAt(0)) throw new FS.ErrnoError(28);
        if ("." !== (l = PATH_FS.relative(t, o)).charAt(0)) throw new FS.ErrnoError(55);
        try {
            s = FS.lookupNode(r, u)
        } catch (e) {}
        if (c !== s) {
            var d = FS.isDir(c.mode),
                f = FS.mayDelete(n, a, d);
            if (f) throw new FS.ErrnoError(f);
            if (f = s ? FS.mayDelete(r, u, d) : FS.mayCreate(r, u)) throw new FS.ErrnoError(f);
            if (!n.node_ops.rename) throw new FS.ErrnoError(63);
            if (FS.isMountpoint(c) || s && FS.isMountpoint(s)) throw new FS.ErrnoError(10);
            if (r !== n && (f = FS.nodePermissions(n, "w"))) throw new FS.ErrnoError(f);
            FS.hashRemoveNode(c);
            try {
                n.node_ops.rename(c, r, u)
            } catch (e) {
                throw e
            } finally {
                FS.hashAddNode(c)
            }
        }
    },
    rmdir: function(e) {
        var t = FS.lookupPath(e, {
                parent: !0
            }).node,
            n = PATH.basename(e),
            r = FS.lookupNode(t, n),
            o = FS.mayDelete(t, n, !0);
        if (o) throw new FS.ErrnoError(o);
        if (!t.node_ops.rmdir) throw new FS.ErrnoError(63);
        if (FS.isMountpoint(r)) throw new FS.ErrnoError(10);
        t.node_ops.rmdir(t, n), FS.destroyNode(r)
    },
    readdir: function(e) {
        var t = FS.lookupPath(e, {
            follow: !0
        }).node;
        if (!t.node_ops.readdir) throw new FS.ErrnoError(54);
        return t.node_ops.readdir(t)
    },
    unlink: function(e) {
        var t = FS.lookupPath(e, {
                parent: !0
            }).node,
            n = PATH.basename(e),
            r = FS.lookupNode(t, n),
            o = FS.mayDelete(t, n, !1);
        if (o) throw new FS.ErrnoError(o);
        if (!t.node_ops.unlink) throw new FS.ErrnoError(63);
        if (FS.isMountpoint(r)) throw new FS.ErrnoError(10);
        t.node_ops.unlink(t, n), FS.destroyNode(r)
    },
    readlink: function(e) {
        var t = FS.lookupPath(e).node;
        if (!t) throw new FS.ErrnoError(44);
        if (!t.node_ops.readlink) throw new FS.ErrnoError(28);
        return PATH_FS.resolve(FS.getPath(t.parent), t.node_ops.readlink(t))
    },
    stat: function(e, t) {
        var n = FS.lookupPath(e, {
            follow: !t
        }).node;
        if (!n) throw new FS.ErrnoError(44);
        if (!n.node_ops.getattr) throw new FS.ErrnoError(63);
        return n.node_ops.getattr(n)
    },
    lstat: function(e) {
        return FS.stat(e, !0)
    },
    chmod: function(e, t, n) {
        var r;
        "string" == typeof e ? r = FS.lookupPath(e, {
            follow: !n
        }).node : r = e;
        if (!r.node_ops.setattr) throw new FS.ErrnoError(63);
        r.node_ops.setattr(r, {
            mode: 4095 & t | -4096 & r.mode,
            timestamp: Date.now()
        })
    },
    lchmod: function(e, t) {
        FS.chmod(e, t, !0)
    },
    fchmod: function(e, t) {
        var n = FS.getStream(e);
        if (!n) throw new FS.ErrnoError(8);
        FS.chmod(n.node, t)
    },
    chown: function(e, t, n, r) {
        var o;
        "string" == typeof e ? o = FS.lookupPath(e, {
            follow: !r
        }).node : o = e;
        if (!o.node_ops.setattr) throw new FS.ErrnoError(63);
        o.node_ops.setattr(o, {
            timestamp: Date.now()
        })
    },
    lchown: function(e, t, n) {
        FS.chown(e, t, n, !0)
    },
    fchown: function(e, t, n) {
        var r = FS.getStream(e);
        if (!r) throw new FS.ErrnoError(8);
        FS.chown(r.node, t, n)
    },
    truncate: function(e, t) {
        if (t < 0) throw new FS.ErrnoError(28);
        var n;
        "string" == typeof e ? n = FS.lookupPath(e, {
            follow: !0
        }).node : n = e;
        if (!n.node_ops.setattr) throw new FS.ErrnoError(63);
        if (FS.isDir(n.mode)) throw new FS.ErrnoError(31);
        if (!FS.isFile(n.mode)) throw new FS.ErrnoError(28);
        var r = FS.nodePermissions(n, "w");
        if (r) throw new FS.ErrnoError(r);
        n.node_ops.setattr(n, {
            size: t,
            timestamp: Date.now()
        })
    },
    ftruncate: function(e, t) {
        var n = FS.getStream(e);
        if (!n) throw new FS.ErrnoError(8);
        if (0 == (2097155 & n.flags)) throw new FS.ErrnoError(28);
        FS.truncate(n.node, t)
    },
    utime: function(e, t, n) {
        var r = FS.lookupPath(e, {
            follow: !0
        }).node;
        r.node_ops.setattr(r, {
            timestamp: Math.max(t, n)
        })
    },
    open: function(e, t, n, r, o) {
        if ("" === e) throw new FS.ErrnoError(44);
        var i;
        if (n = void 0 === n ? 438 : n, n = 64 & (t = "string" == typeof t ? FS.modeStringToFlags(t) : t) ? 4095 & n | 32768 : 0, "object" == typeof e) i = e;
        else {
            e = PATH.normalize(e);
            try {
                i = FS.lookupPath(e, {
                    follow: !(131072 & t)
                }).node
            } catch (e) {}
        }
        var a = !1;
        if (64 & t)
            if (i) {
                if (128 & t) throw new FS.ErrnoError(20)
            } else i = FS.mknod(e, n, 0), a = !0;
        if (!i) throw new FS.ErrnoError(44);
        if (FS.isChrdev(i.mode) && (t &= -513), 65536 & t && !FS.isDir(i.mode)) throw new FS.ErrnoError(54);
        if (!a) {
            var u = FS.mayOpen(i, t);
            if (u) throw new FS.ErrnoError(u)
        }
        512 & t && FS.truncate(i, 0), t &= -131713;
        var s = FS.createStream({
            node: i,
            path: FS.getPath(i),
            flags: t,
            seekable: !0,
            position: 0,
            stream_ops: i.stream_ops,
            ungotten: [],
            error: !1
        }, r, o);
        return s.stream_ops.open && s.stream_ops.open(s), !Module.logReadFiles || 1 & t || (FS.readFiles || (FS.readFiles = {}), e in FS.readFiles || (FS.readFiles[e] = 1)), s
    },
    close: function(e) {
        if (FS.isClosed(e)) throw new FS.ErrnoError(8);
        e.getdents && (e.getdents = null);
        try {
            e.stream_ops.close && e.stream_ops.close(e)
        } catch (e) {
            throw e
        } finally {
            FS.closeStream(e.fd)
        }
        e.fd = null
    },
    isClosed: function(e) {
        return null === e.fd
    },
    llseek: function(e, t, n) {
        if (FS.isClosed(e)) throw new FS.ErrnoError(8);
        if (!e.seekable || !e.stream_ops.llseek) throw new FS.ErrnoError(70);
        if (0 != n && 1 != n && 2 != n) throw new FS.ErrnoError(28);
        return e.position = e.stream_ops.llseek(e, t, n), e.ungotten = [], e.position
    },
    read: function(e, t, n, r, o) {
        if (r < 0 || o < 0) throw new FS.ErrnoError(28);
        if (FS.isClosed(e)) throw new FS.ErrnoError(8);
        if (1 == (2097155 & e.flags)) throw new FS.ErrnoError(8);
        if (FS.isDir(e.node.mode)) throw new FS.ErrnoError(31);
        if (!e.stream_ops.read) throw new FS.ErrnoError(28);
        var i = void 0 !== o;
        if (i) {
            if (!e.seekable) throw new FS.ErrnoError(70)
        } else o = e.position;
        var a = e.stream_ops.read(e, t, n, r, o);
        return i || (e.position += a), a
    },
    write: function(e, t, n, r, o, i) {
        if (r < 0 || o < 0) throw new FS.ErrnoError(28);
        if (FS.isClosed(e)) throw new FS.ErrnoError(8);
        if (0 == (2097155 & e.flags)) throw new FS.ErrnoError(8);
        if (FS.isDir(e.node.mode)) throw new FS.ErrnoError(31);
        if (!e.stream_ops.write) throw new FS.ErrnoError(28);
        e.seekable && 1024 & e.flags && FS.llseek(e, 0, 2);
        var a = void 0 !== o;
        if (a) {
            if (!e.seekable) throw new FS.ErrnoError(70)
        } else o = e.position;
        var u = e.stream_ops.write(e, t, n, r, o, i);
        return a || (e.position += u), u
    },
    allocate: function(e, t, n) {
        if (FS.isClosed(e)) throw new FS.ErrnoError(8);
        if (t < 0 || n <= 0) throw new FS.ErrnoError(28);
        if (0 == (2097155 & e.flags)) throw new FS.ErrnoError(8);
        if (!FS.isFile(e.node.mode) && !FS.isDir(e.node.mode)) throw new FS.ErrnoError(43);
        if (!e.stream_ops.allocate) throw new FS.ErrnoError(138);
        e.stream_ops.allocate(e, t, n)
    },
    mmap: function(e, t, n, r, o, i) {
        if (0 != (2 & o) && 0 == (2 & i) && 2 != (2097155 & e.flags)) throw new FS.ErrnoError(2);
        if (1 == (2097155 & e.flags)) throw new FS.ErrnoError(2);
        if (!e.stream_ops.mmap) throw new FS.ErrnoError(43);
        return e.stream_ops.mmap(e, t, n, r, o, i)
    },
    msync: function(e, t, n, r, o) {
        return e && e.stream_ops.msync ? e.stream_ops.msync(e, t, n, r, o) : 0
    },
    munmap: function(e) {
        return 0
    },
    ioctl: function(e, t, n) {
        if (!e.stream_ops.ioctl) throw new FS.ErrnoError(59);
        return e.stream_ops.ioctl(e, t, n)
    },
    readFile: function(e, t) {
        if ((t = t || {}).flags = t.flags || 0, t.encoding = t.encoding || "binary", "utf8" !== t.encoding && "binary" !== t.encoding) throw new Error('Invalid encoding type "' + t.encoding + '"');
        var n, r = FS.open(e, t.flags),
            o = FS.stat(e).size,
            i = new Uint8Array(o);
        return FS.read(r, i, 0, o, 0), "utf8" === t.encoding ? n = UTF8ArrayToString(i, 0) : "binary" === t.encoding && (n = i), FS.close(r), n
    },
    writeFile: function(e, t, n) {
        (n = n || {}).flags = n.flags || 577;
        var r = FS.open(e, n.flags, n.mode);
        if ("string" == typeof t) {
            var o = new Uint8Array(lengthBytesUTF8(t) + 1),
                i = stringToUTF8Array(t, o, 0, o.length);
            FS.write(r, o, 0, i, void 0, n.canOwn)
        } else {
            if (!ArrayBuffer.isView(t)) throw new Error("Unsupported data type");
            FS.write(r, t, 0, t.byteLength, void 0, n.canOwn)
        }
        FS.close(r)
    },
    cwd: function() {
        return FS.currentPath
    },
    chdir: function(e) {
        var t = FS.lookupPath(e, {
            follow: !0
        });
        if (null === t.node) throw new FS.ErrnoError(44);
        if (!FS.isDir(t.node.mode)) throw new FS.ErrnoError(54);
        var n = FS.nodePermissions(t.node, "x");
        if (n) throw new FS.ErrnoError(n);
        FS.currentPath = t.path
    },
    createDefaultDirectories: function() {
        FS.mkdir("/tmp"), FS.mkdir("/home"), FS.mkdir("/home/web_user")
    },
    createDefaultDevices: function() {
        FS.mkdir("/dev"), FS.registerDevice(FS.makedev(1, 3), {
            read: function() {
                return 0
            },
            write: function(e, t, n, r, o) {
                return r
            }
        }), FS.mkdev("/dev/null", FS.makedev(1, 3)), TTY.register(FS.makedev(5, 0), TTY.default_tty_ops), TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops), FS.mkdev("/dev/tty", FS.makedev(5, 0)), FS.mkdev("/dev/tty1", FS.makedev(6, 0));
        var e = getRandomDevice();
        FS.createDevice("/dev", "random", e), FS.createDevice("/dev", "urandom", e), FS.mkdir("/dev/shm"), FS.mkdir("/dev/shm/tmp")
    },
    createSpecialDirectories: function() {
        FS.mkdir("/proc");
        var e = FS.mkdir("/proc/self");
        FS.mkdir("/proc/self/fd"), FS.mount({
            mount: function() {
                var t = FS.createNode(e, "fd", 16895, 73);
                return t.node_ops = {
                    lookup: function(e, t) {
                        var n = +t,
                            r = FS.getStream(n);
                        if (!r) throw new FS.ErrnoError(8);
                        var o = {
                            parent: null,
                            mount: {
                                mountpoint: "fake"
                            },
                            node_ops: {
                                readlink: function() {
                                    return r.path
                                }
                            }
                        };
                        return o.parent = o, o
                    }
                }, t
            }
        }, {}, "/proc/self/fd")
    },
    createStandardStreams: function() {
        Module.stdin ? FS.createDevice("/dev", "stdin", Module.stdin) : FS.symlink("/dev/tty", "/dev/stdin"), Module.stdout ? FS.createDevice("/dev", "stdout", null, Module.stdout) : FS.symlink("/dev/tty", "/dev/stdout"), Module.stderr ? FS.createDevice("/dev", "stderr", null, Module.stderr) : FS.symlink("/dev/tty1", "/dev/stderr");
        FS.open("/dev/stdin", 0), FS.open("/dev/stdout", 1), FS.open("/dev/stderr", 1)
    },
    ensureErrnoError: function() {
        FS.ErrnoError || (FS.ErrnoError = function(e, t) {
            this.node = t, this.setErrno = function(e) {
                this.errno = e
            }, this.setErrno(e), this.message = "FS error"
        }, FS.ErrnoError.prototype = new Error, FS.ErrnoError.prototype.constructor = FS.ErrnoError, [44].forEach(function(e) {
            FS.genericErrors[e] = new FS.ErrnoError(e), FS.genericErrors[e].stack = "<generic error, no stack>"
        }))
    },
    staticInit: function() {
        FS.ensureErrnoError(), FS.nameTable = new Array(4096), FS.mount(MEMFS, {}, "/"), FS.createDefaultDirectories(), FS.createDefaultDevices(), FS.createSpecialDirectories(), FS.filesystems = {
            MEMFS: MEMFS
        }
    },
    init: function(e, t, n) {
        FS.init.initialized = !0, FS.ensureErrnoError(), Module.stdin = e || Module.stdin, Module.stdout = t || Module.stdout, Module.stderr = n || Module.stderr, FS.createStandardStreams()
    },
    quit: function() {
        FS.init.initialized = !1;
        var e = Module._fflush;
        e && e(0);
        for (var t = 0; t < FS.streams.length; t++) {
            var n = FS.streams[t];
            n && FS.close(n)
        }
    },
    getMode: function(e, t) {
        var n = 0;
        return e && (n |= 365), t && (n |= 146), n
    },
    findObject: function(e, t) {
        var n = FS.analyzePath(e, t);
        return n.exists ? n.object : null
    },
    analyzePath: function(e, t) {
        try {
            e = (r = FS.lookupPath(e, {
                follow: !t
            })).path
        } catch (e) {}
        var n = {
            isRoot: !1,
            exists: !1,
            error: 0,
            name: null,
            path: null,
            object: null,
            parentExists: !1,
            parentPath: null,
            parentObject: null
        };
        try {
            var r = FS.lookupPath(e, {
                parent: !0
            });
            n.parentExists = !0, n.parentPath = r.path, n.parentObject = r.node, n.name = PATH.basename(e), r = FS.lookupPath(e, {
                follow: !t
            }), n.exists = !0, n.path = r.path, n.object = r.node, n.name = r.node.name, n.isRoot = "/" === r.path
        } catch (e) {
            n.error = e.errno
        }
        return n
    },
    createPath: function(e, t, n, r) {
        e = "string" == typeof e ? e : FS.getPath(e);
        for (var o = t.split("/").reverse(); o.length;) {
            var i = o.pop();
            if (i) {
                var a = PATH.join2(e, i);
                try {
                    FS.mkdir(a)
                } catch (e) {}
                e = a
            }
        }
        return a
    },
    createFile: function(e, t, n, r, o) {
        var i = PATH.join2("string" == typeof e ? e : FS.getPath(e), t),
            a = FS.getMode(r, o);
        return FS.create(i, a)
    },
    createDataFile: function(e, t, n, r, o, i) {
        var a = t ? PATH.join2("string" == typeof e ? e : FS.getPath(e), t) : e,
            u = FS.getMode(r, o),
            s = FS.create(a, u);
        if (n) {
            if ("string" == typeof n) {
                for (var c = new Array(n.length), l = 0, d = n.length; l < d; ++l) c[l] = n.charCodeAt(l);
                n = c
            }
            FS.chmod(s, 146 | u);
            var f = FS.open(s, 577);
            FS.write(f, n, 0, n.length, 0, i), FS.close(f), FS.chmod(s, u)
        }
        return s
    },
    createDevice: function(e, t, n, r) {
        var o = PATH.join2("string" == typeof e ? e : FS.getPath(e), t),
            i = FS.getMode(!!n, !!r);
        FS.createDevice.major || (FS.createDevice.major = 64);
        var a = FS.makedev(FS.createDevice.major++, 0);
        return FS.registerDevice(a, {
            open: function(e) {
                e.seekable = !1
            },
            close: function(e) {
                r && r.buffer && r.buffer.length && r(10)
            },
            read: function(e, t, r, o, i) {
                for (var a = 0, u = 0; u < o; u++) {
                    var s;
                    try {
                        s = n()
                    } catch (e) {
                        throw new FS.ErrnoError(29)
                    }
                    if (void 0 === s && 0 === a) throw new FS.ErrnoError(6);
                    if (null == s) break;
                    a++, t[r + u] = s
                }
                return a && (e.node.timestamp = Date.now()), a
            },
            write: function(e, t, n, o, i) {
                for (var a = 0; a < o; a++) try {
                    r(t[n + a])
                } catch (e) {
                    throw new FS.ErrnoError(29)
                }
                return o && (e.node.timestamp = Date.now()), a
            }
        }), FS.mkdev(o, i, a)
    },
    forceLoadFile: function(e) {
        if (e.isDevice || e.isFolder || e.link || e.contents) return !0;
        if ("undefined" != typeof XMLHttpRequest) throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
        if (!read_) throw new Error("Cannot load without read() or XMLHttpRequest.");
        try {
            e.contents = intArrayFromString(read_(e.url), !0), e.usedBytes = e.contents.length
        } catch (e) {
            throw new FS.ErrnoError(29)
        }
    },
    createLazyFile: function(e, t, n, r, o) {
        function i() {
            this.lengthKnown = !1, this.chunks = []
        }
        if (i.prototype.get = function(e) {
                if (!(e > this.length - 1 || e < 0)) {
                    var t = e % this.chunkSize,
                        n = e / this.chunkSize | 0;
                    return this.getter(n)[t]
                }
            }, i.prototype.setDataGetter = function(e) {
                this.getter = e
            }, i.prototype.cacheLength = function() {
                var e = new XMLHttpRequest;
                if (e.open("HEAD", n, !1), e.send(null), !(e.status >= 200 && e.status < 300 || 304 === e.status)) throw new Error("Couldn't load " + n + ". Status: " + e.status);
                var t, r = Number(e.getResponseHeader("Content-length")),
                    o = (t = e.getResponseHeader("Accept-Ranges")) && "bytes" === t,
                    i = (t = e.getResponseHeader("Content-Encoding")) && "gzip" === t,
                    a = 1048576;
                o || (a = r);
                var u = this;
                u.setDataGetter(function(e) {
                    var t = e * a,
                        o = (e + 1) * a - 1;
                    if (o = Math.min(o, r - 1), void 0 === u.chunks[e] && (u.chunks[e] = function(e, t) {
                            if (e > t) throw new Error("invalid range (" + e + ", " + t + ") or no bytes requested!");
                            if (t > r - 1) throw new Error("only " + r + " bytes available! programmer error!");
                            var o = new XMLHttpRequest;
                            if (o.open("GET", n, !1), r !== a && o.setRequestHeader("Range", "bytes=" + e + "-" + t), "undefined" != typeof Uint8Array && (o.responseType = "arraybuffer"), o.overrideMimeType && o.overrideMimeType("text/plain; charset=x-user-defined"), o.send(null), !(o.status >= 200 && o.status < 300 || 304 === o.status)) throw new Error("Couldn't load " + n + ". Status: " + o.status);
                            return void 0 !== o.response ? new Uint8Array(o.response || []) : intArrayFromString(o.responseText || "", !0)
                        }(t, o)), void 0 === u.chunks[e]) throw new Error("doXHR failed!");
                    return u.chunks[e]
                }), !i && r || (a = r = 1, r = this.getter(0).length, a = r, out("LazyFiles on gzip forces download of the whole file when length is accessed")), this._length = r, this._chunkSize = a, this.lengthKnown = !0
            }, "undefined" != typeof XMLHttpRequest) {
            if (!ENVIRONMENT_IS_WORKER) throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
            var a = new i;
            Object.defineProperties(a, {
                length: {
                    get: function() {
                        return this.lengthKnown || this.cacheLength(), this._length
                    }
                },
                chunkSize: {
                    get: function() {
                        return this.lengthKnown || this.cacheLength(), this._chunkSize
                    }
                }
            });
            var u = {
                isDevice: !1,
                contents: a
            }
        } else u = {
            isDevice: !1,
            url: n
        };
        var s = FS.createFile(e, t, u, r, o);
        u.contents ? s.contents = u.contents : u.url && (s.contents = null, s.url = u.url), Object.defineProperties(s, {
            usedBytes: {
                get: function() {
                    return this.contents.length
                }
            }
        });
        var c = {};
        return Object.keys(s.stream_ops).forEach(function(e) {
            var t = s.stream_ops[e];
            c[e] = function() {
                return FS.forceLoadFile(s), t.apply(null, arguments)
            }
        }), c.read = function(e, t, n, r, o) {
            FS.forceLoadFile(s);
            var i = e.node.contents;
            if (o >= i.length) return 0;
            var a = Math.min(i.length - o, r);
            if (i.slice)
                for (var u = 0; u < a; u++) t[n + u] = i[o + u];
            else
                for (u = 0; u < a; u++) t[n + u] = i.get(o + u);
            return a
        }, s.stream_ops = c, s
    },
    createPreloadedFile: function(e, t, n, r, o, i, a, u, s, c) {
        Browser.init();
        var l = t ? PATH_FS.resolve(PATH.join2(e, t)) : e,
            d = getUniqueRunDependency("cp " + l);

        function f(n) {
            function f(n) {
                c && c(), u || FS.createDataFile(e, t, n, r, o, s), i && i(), removeRunDependency(d)
            }
            var m = !1;
            Module.preloadPlugins.forEach(function(e) {
                m || e.canHandle(l) && (e.handle(n, l, f, function() {
                    a && a(), removeRunDependency(d)
                }), m = !0)
            }), m || f(n)
        }
        addRunDependency(d), "string" == typeof n ? asyncLoad(n, function(e) {
            f(e)
        }, a) : f(n)
    },
    indexedDB: function() {
        return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB
    },
    DB_NAME: function() {
        return "EM_FS_" + window.location.pathname
    },
    DB_VERSION: 20,
    DB_STORE_NAME: "FILE_DATA",
    saveFilesToDB: function(e, t, n) {
        t = t || function() {}, n = n || function() {};
        var r = FS.indexedDB();
        try {
            var o = r.open(FS.DB_NAME(), FS.DB_VERSION)
        } catch (e) {
            return n(e)
        }
        o.onupgradeneeded = function() {
            out("creating db"), o.result.createObjectStore(FS.DB_STORE_NAME)
        }, o.onsuccess = function() {
            var r = o.result.transaction([FS.DB_STORE_NAME], "readwrite"),
                i = r.objectStore(FS.DB_STORE_NAME),
                a = 0,
                u = 0,
                s = e.length;

            function c() {
                0 == u ? t() : n()
            }
            e.forEach(function(e) {
                var t = i.put(FS.analyzePath(e).object.contents, e);
                t.onsuccess = function() {
                    ++a + u == s && c()
                }, t.onerror = function() {
                    a + ++u == s && c()
                }
            }), r.onerror = n
        }, o.onerror = n
    },
    loadFilesFromDB: function(e, t, n) {
        t = t || function() {}, n = n || function() {};
        var r = FS.indexedDB();
        try {
            var o = r.open(FS.DB_NAME(), FS.DB_VERSION)
        } catch (e) {
            return n(e)
        }
        o.onupgradeneeded = n, o.onsuccess = function() {
            var r = o.result;
            try {
                var i = r.transaction([FS.DB_STORE_NAME], "readonly")
            } catch (e) {
                return void n(e)
            }
            var a = i.objectStore(FS.DB_STORE_NAME),
                u = 0,
                s = 0,
                c = e.length;

            function l() {
                0 == s ? t() : n()
            }
            e.forEach(function(e) {
                var t = a.get(e);
                t.onsuccess = function() {
                    FS.analyzePath(e).exists && FS.unlink(e), FS.createDataFile(PATH.dirname(e), PATH.basename(e), t.result, !0, !0, !0), ++u + s == c && l()
                }, t.onerror = function() {
                    u + ++s == c && l()
                }
            }), i.onerror = n
        }, o.onerror = n
    }
};
Module.FS = FS;
var SYSCALLS = {
    mappings: {},
    DEFAULT_POLLMASK: 5,
    umask: 511,
    calculateAt: function(e, t, n) {
        if ("/" === t[0]) return t;
        var r;
        if (-100 === e) r = FS.cwd();
        else {
            var o = FS.getStream(e);
            if (!o) throw new FS.ErrnoError(8);
            r = o.path
        }
        if (0 == t.length) {
            if (!n) throw new FS.ErrnoError(44);
            return r
        }
        return PATH.join2(r, t)
    },
    doStat: function(e, t, n) {
        try {
            var r = e(t)
        } catch (e) {
            if (e && e.node && PATH.normalize(t) !== PATH.normalize(FS.getPath(e.node))) return -54;
            throw e
        }
        return HEAP32[n >> 2] = r.dev, HEAP32[n + 4 >> 2] = 0, HEAP32[n + 8 >> 2] = r.ino, HEAP32[n + 12 >> 2] = r.mode, HEAP32[n + 16 >> 2] = r.nlink, HEAP32[n + 20 >> 2] = r.uid, HEAP32[n + 24 >> 2] = r.gid, HEAP32[n + 28 >> 2] = r.rdev, HEAP32[n + 32 >> 2] = 0, tempI64 = [r.size >>> 0, (tempDouble = r.size, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? (0 | Math.min(+Math.floor(tempDouble / 4294967296), 4294967295)) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[n + 40 >> 2] = tempI64[0], HEAP32[n + 44 >> 2] = tempI64[1], HEAP32[n + 48 >> 2] = 4096, HEAP32[n + 52 >> 2] = r.blocks, HEAP32[n + 56 >> 2] = r.atime.getTime() / 1e3 | 0, HEAP32[n + 60 >> 2] = 0, HEAP32[n + 64 >> 2] = r.mtime.getTime() / 1e3 | 0, HEAP32[n + 68 >> 2] = 0, HEAP32[n + 72 >> 2] = r.ctime.getTime() / 1e3 | 0, HEAP32[n + 76 >> 2] = 0, tempI64 = [r.ino >>> 0, (tempDouble = r.ino, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? (0 | Math.min(+Math.floor(tempDouble / 4294967296), 4294967295)) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[n + 80 >> 2] = tempI64[0], HEAP32[n + 84 >> 2] = tempI64[1], 0
    },
    doMsync: function(e, t, n, r, o) {
        var i = HEAPU8.slice(e, e + n);
        FS.msync(t, i, o, n, r)
    },
    doMkdir: function(e, t) {
        return "/" === (e = PATH.normalize(e))[e.length - 1] && (e = e.substr(0, e.length - 1)), FS.mkdir(e, t, 0), 0
    },
    doMknod: function(e, t, n) {
        switch (61440 & t) {
            case 32768:
            case 8192:
            case 24576:
            case 4096:
            case 49152:
                break;
            default:
                return -28
        }
        return FS.mknod(e, t, n), 0
    },
    doReadlink: function(e, t, n) {
        if (n <= 0) return -28;
        var r = FS.readlink(e),
            o = Math.min(n, lengthBytesUTF8(r)),
            i = HEAP8[t + o];
        return stringToUTF8(r, t, n + 1), HEAP8[t + o] = i, o
    },
    doAccess: function(e, t) {
        if (-8 & t) return -28;
        var n;
        if (!(n = FS.lookupPath(e, {
                follow: !0
            }).node)) return -44;
        var r = "";
        return 4 & t && (r += "r"), 2 & t && (r += "w"), 1 & t && (r += "x"), r && FS.nodePermissions(n, r) ? -2 : 0
    },
    doDup: function(e, t, n) {
        var r = FS.getStream(n);
        return r && FS.close(r), FS.open(e, t, 0, n, n).fd
    },
    doReadv: function(e, t, n, r) {
        for (var o = 0, i = 0; i < n; i++) {
            var a = HEAP32[t + 8 * i >> 2],
                u = HEAP32[t + (8 * i + 4) >> 2],
                s = FS.read(e, HEAP8, a, u, r);
            if (s < 0) return -1;
            if (o += s, s < u) break
        }
        return o
    },
    doWritev: function(e, t, n, r) {
        for (var o = 0, i = 0; i < n; i++) {
            var a = HEAP32[t + 8 * i >> 2],
                u = HEAP32[t + (8 * i + 4) >> 2],
                s = FS.write(e, HEAP8, a, u, r);
            if (s < 0) return -1;
            o += s
        }
        return o
    },
    varargs: void 0,
    get: function() {
        return SYSCALLS.varargs += 4, HEAP32[SYSCALLS.varargs - 4 >> 2]
    },
    getStr: function(e) {
        return UTF8ToString(e)
    },
    getStreamFromFD: function(e) {
        var t = FS.getStream(e);
        if (!t) throw new FS.ErrnoError(8);
        return t
    },
    get64: function(e, t) {
        return e
    }
};

function ___sys_fcntl64(e, t, n) {
    SYSCALLS.varargs = n;
    try {
        var r = SYSCALLS.getStreamFromFD(e);
        switch (t) {
            case 0:
                return (o = SYSCALLS.get()) < 0 ? -28 : FS.open(r.path, r.flags, 0, o).fd;
            case 1:
            case 2:
                return 0;
            case 3:
                return r.flags;
            case 4:
                var o = SYSCALLS.get();
                return r.flags |= o, 0;
            case 12:
                o = SYSCALLS.get();
                return HEAP16[o + 0 >> 1] = 2, 0;
            case 13:
            case 14:
                return 0;
            case 16:
            case 8:
                return -28;
            case 9:
                return setErrNo(28), -1;
            default:
                return -28
        }
    } catch (e) {
        return void 0 !== FS && e instanceof FS.ErrnoError || abort(e), -e.errno
    }
}

function ___sys_ftruncate64(e, t, n, r) {
    try {
        var o = SYSCALLS.get64(n, r);
        return FS.ftruncate(e, o), 0
    } catch (e) {
        return void 0 !== FS && e instanceof FS.ErrnoError || abort(e), -e.errno
    }
}

function ___sys_ioctl(e, t, n) {
    SYSCALLS.varargs = n;
    try {
        var r = SYSCALLS.getStreamFromFD(e);
        switch (t) {
            case 21509:
            case 21505:
                return r.tty ? 0 : -59;
            case 21510:
            case 21511:
            case 21512:
            case 21506:
            case 21507:
            case 21508:
                return r.tty ? 0 : -59;
            case 21519:
                if (!r.tty) return -59;
                var o = SYSCALLS.get();
                return HEAP32[o >> 2] = 0, 0;
            case 21520:
                return r.tty ? -28 : -59;
            case 21531:
                o = SYSCALLS.get();
                return FS.ioctl(r, t, o);
            case 21523:
            case 21524:
                return r.tty ? 0 : -59;
            default:
                abort("bad ioctl syscall " + t)
        }
    } catch (e) {
        return void 0 !== FS && e instanceof FS.ErrnoError || abort(e), -e.errno
    }
}

function ___sys_open(e, t, n) {
    SYSCALLS.varargs = n;
    try {
        var r = SYSCALLS.getStr(e),
            o = n ? SYSCALLS.get() : 0;
        return FS.open(r, t, o).fd
    } catch (e) {
        return void 0 !== FS && e instanceof FS.ErrnoError || abort(e), -e.errno
    }
}

function _abort() {
    abort()
}
Module.SYSCALLS = SYSCALLS, Module.___sys_fcntl64 = ___sys_fcntl64, Module.___sys_ftruncate64 = ___sys_ftruncate64, Module.___sys_ioctl = ___sys_ioctl, Module.___sys_open = ___sys_open, Module._abort = _abort;
var readAsmConstArgsArray = [];

function readAsmConstArgs(e, t) {
    var n;
    for (readAsmConstArgsArray.length = 0, t >>= 2; n = HEAPU8[e++];) {
        var r = n < 105;
        r && 1 & t && t++, readAsmConstArgsArray.push(r ? HEAPF64[t++ >> 1] : HEAP32[t]), ++t
    }
    return readAsmConstArgsArray
}

function _emscripten_asm_const_int(e, t, n) {
    var r = readAsmConstArgs(t, n);
    return ASM_CONSTS[e].apply(null, r)
}

function _emscripten_memcpy_big(e, t, n) {
    HEAPU8.copyWithin(e, t, t + n)
}

function abortOnCannotGrowMemory(e) {
    abort("OOM")
}

function _emscripten_resize_heap(e) {
    HEAPU8.length;
    abortOnCannotGrowMemory(e >>>= 0)
}
Module.readAsmConstArgsArray = readAsmConstArgsArray, Module.readAsmConstArgs = readAsmConstArgs, Module._emscripten_asm_const_int = _emscripten_asm_const_int, Module._emscripten_memcpy_big = _emscripten_memcpy_big, Module.abortOnCannotGrowMemory = abortOnCannotGrowMemory, Module._emscripten_resize_heap = _emscripten_resize_heap;
var ENV = {};

function getExecutableName() {
    return thisProgram || "./this.program"
}

function getEnvStrings() {
    if (!getEnvStrings.strings) {
        var e = {
            USER: "web_user",
            LOGNAME: "web_user",
            PATH: "/",
            PWD: "/",
            HOME: "/home/web_user",
            LANG: ("object" == typeof navigator && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8",
            _: getExecutableName()
        };
        for (var t in ENV) void 0 === ENV[t] ? delete e[t] : e[t] = ENV[t];
        var n = [];
        for (var t in e) n.push(t + "=" + e[t]);
        getEnvStrings.strings = n
    }
    return getEnvStrings.strings
}

function _environ_get(e, t) {
    var n = 0;
    return getEnvStrings().forEach(function(r, o) {
        var i = t + n;
        HEAP32[e + 4 * o >> 2] = i, writeAsciiToMemory(r, i), n += r.length + 1
    }), 0
}

function _environ_sizes_get(e, t) {
    var n = getEnvStrings();
    HEAP32[e >> 2] = n.length;
    var r = 0;
    return n.forEach(function(e) {
        r += e.length + 1
    }), HEAP32[t >> 2] = r, 0
}

function _fd_close(e) {
    try {
        var t = SYSCALLS.getStreamFromFD(e);
        return FS.close(t), 0
    } catch (e) {
        return void 0 !== FS && e instanceof FS.ErrnoError || abort(e), e.errno
    }
}

function _fd_read(e, t, n, r) {
    try {
        var o = SYSCALLS.getStreamFromFD(e),
            i = SYSCALLS.doReadv(o, t, n);
        return HEAP32[r >> 2] = i, 0
    } catch (e) {
        return void 0 !== FS && e instanceof FS.ErrnoError || abort(e), e.errno
    }
}

function _fd_seek(e, t, n, r, o) {
    try {
        var i = SYSCALLS.getStreamFromFD(e),
            a = 4294967296 * n + (t >>> 0);
        return a <= -9007199254740992 || a >= 9007199254740992 ? -61 : (FS.llseek(i, a, r), tempI64 = [i.position >>> 0, (tempDouble = i.position, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? (0 | Math.min(+Math.floor(tempDouble / 4294967296), 4294967295)) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[o >> 2] = tempI64[0], HEAP32[o + 4 >> 2] = tempI64[1], i.getdents && 0 === a && 0 === r && (i.getdents = null), 0)
    } catch (e) {
        return void 0 !== FS && e instanceof FS.ErrnoError || abort(e), e.errno
    }
}

function _fd_write(e, t, n, r) {
    try {
        var o = SYSCALLS.getStreamFromFD(e),
            i = SYSCALLS.doWritev(o, t, n);
        return HEAP32[r >> 2] = i, 0
    } catch (e) {
        return void 0 !== FS && e instanceof FS.ErrnoError || abort(e), e.errno
    }
}

function _setTempRet0(e) {
    setTempRet0(e)
}

function __isLeapYear(e) {
    return e % 4 == 0 && (e % 100 != 0 || e % 400 == 0)
}

function __arraySum(e, t) {
    for (var n = 0, r = 0; r <= t; n += e[r++]);
    return n
}
Module.ENV = ENV, Module.getExecutableName = getExecutableName, Module.getEnvStrings = getEnvStrings, Module._environ_get = _environ_get, Module._environ_sizes_get = _environ_sizes_get, Module._fd_close = _fd_close, Module._fd_read = _fd_read, Module._fd_seek = _fd_seek, Module._fd_write = _fd_write, Module._setTempRet0 = _setTempRet0, Module.__isLeapYear = __isLeapYear, Module.__arraySum = __arraySum;
var __MONTH_DAYS_LEAP = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
Module.__MONTH_DAYS_LEAP = __MONTH_DAYS_LEAP;
var __MONTH_DAYS_REGULAR = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function __addDays(e, t) {
    for (var n = new Date(e.getTime()); t > 0;) {
        var r = __isLeapYear(n.getFullYear()),
            o = n.getMonth(),
            i = (r ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR)[o];
        if (!(t > i - n.getDate())) return n.setDate(n.getDate() + t), n;
        t -= i - n.getDate() + 1, n.setDate(1), o < 11 ? n.setMonth(o + 1) : (n.setMonth(0), n.setFullYear(n.getFullYear() + 1))
    }
    return n
}

function _strftime(e, t, n, r) {
    var o = HEAP32[r + 40 >> 2],
        i = {
            tm_sec: HEAP32[r >> 2],
            tm_min: HEAP32[r + 4 >> 2],
            tm_hour: HEAP32[r + 8 >> 2],
            tm_mday: HEAP32[r + 12 >> 2],
            tm_mon: HEAP32[r + 16 >> 2],
            tm_year: HEAP32[r + 20 >> 2],
            tm_wday: HEAP32[r + 24 >> 2],
            tm_yday: HEAP32[r + 28 >> 2],
            tm_isdst: HEAP32[r + 32 >> 2],
            tm_gmtoff: HEAP32[r + 36 >> 2],
            tm_zone: o ? UTF8ToString(o) : ""
        },
        a = UTF8ToString(n),
        u = {
            "%c": "%a %b %d %H:%M:%S %Y",
            "%D": "%m/%d/%y",
            "%F": "%Y-%m-%d",
            "%h": "%b",
            "%r": "%I:%M:%S %p",
            "%R": "%H:%M",
            "%T": "%H:%M:%S",
            "%x": "%m/%d/%y",
            "%X": "%H:%M:%S",
            "%Ec": "%c",
            "%EC": "%C",
            "%Ex": "%m/%d/%y",
            "%EX": "%H:%M:%S",
            "%Ey": "%y",
            "%EY": "%Y",
            "%Od": "%d",
            "%Oe": "%e",
            "%OH": "%H",
            "%OI": "%I",
            "%Om": "%m",
            "%OM": "%M",
            "%OS": "%S",
            "%Ou": "%u",
            "%OU": "%U",
            "%OV": "%V",
            "%Ow": "%w",
            "%OW": "%W",
            "%Oy": "%y"
        };
    for (var s in u) a = a.replace(new RegExp(s, "g"), u[s]);
    var c = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        l = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    function d(e, t, n) {
        for (var r = "number" == typeof e ? e.toString() : e || ""; r.length < t;) r = n[0] + r;
        return r
    }

    function f(e, t) {
        return d(e, t, "0")
    }

    function m(e, t) {
        function n(e) {
            return e < 0 ? -1 : e > 0 ? 1 : 0
        }
        var r;
        return 0 === (r = n(e.getFullYear() - t.getFullYear())) && 0 === (r = n(e.getMonth() - t.getMonth())) && (r = n(e.getDate() - t.getDate())), r
    }

    function p(e) {
        switch (e.getDay()) {
            case 0:
                return new Date(e.getFullYear() - 1, 11, 29);
            case 1:
                return e;
            case 2:
                return new Date(e.getFullYear(), 0, 3);
            case 3:
                return new Date(e.getFullYear(), 0, 2);
            case 4:
                return new Date(e.getFullYear(), 0, 1);
            case 5:
                return new Date(e.getFullYear() - 1, 11, 31);
            case 6:
                return new Date(e.getFullYear() - 1, 11, 30)
        }
    }

    function h(e) {
        var t = __addDays(new Date(e.tm_year + 1900, 0, 1), e.tm_yday),
            n = new Date(t.getFullYear(), 0, 4),
            r = new Date(t.getFullYear() + 1, 0, 4),
            o = p(n),
            i = p(r);
        return m(o, t) <= 0 ? m(i, t) <= 0 ? t.getFullYear() + 1 : t.getFullYear() : t.getFullYear() - 1
    }
    var _ = {
        "%a": function(e) {
            return c[e.tm_wday].substring(0, 3)
        },
        "%A": function(e) {
            return c[e.tm_wday]
        },
        "%b": function(e) {
            return l[e.tm_mon].substring(0, 3)
        },
        "%B": function(e) {
            return l[e.tm_mon]
        },
        "%C": function(e) {
            return f((e.tm_year + 1900) / 100 | 0, 2)
        },
        "%d": function(e) {
            return f(e.tm_mday, 2)
        },
        "%e": function(e) {
            return d(e.tm_mday, 2, " ")
        },
        "%g": function(e) {
            return h(e).toString().substring(2)
        },
        "%G": function(e) {
            return h(e)
        },
        "%H": function(e) {
            return f(e.tm_hour, 2)
        },
        "%I": function(e) {
            var t = e.tm_hour;
            return 0 == t ? t = 12 : t > 12 && (t -= 12), f(t, 2)
        },
        "%j": function(e) {
            return f(e.tm_mday + __arraySum(__isLeapYear(e.tm_year + 1900) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, e.tm_mon - 1), 3)
        },
        "%m": function(e) {
            return f(e.tm_mon + 1, 2)
        },
        "%M": function(e) {
            return f(e.tm_min, 2)
        },
        "%n": function() {
            return "\n"
        },
        "%p": function(e) {
            return e.tm_hour >= 0 && e.tm_hour < 12 ? "AM" : "PM"
        },
        "%S": function(e) {
            return f(e.tm_sec, 2)
        },
        "%t": function() {
            return "\t"
        },
        "%u": function(e) {
            return e.tm_wday || 7
        },
        "%U": function(e) {
            var t = new Date(e.tm_year + 1900, 0, 1),
                n = 0 === t.getDay() ? t : __addDays(t, 7 - t.getDay()),
                r = new Date(e.tm_year + 1900, e.tm_mon, e.tm_mday);
            if (m(n, r) < 0) {
                var o = __arraySum(__isLeapYear(r.getFullYear()) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, r.getMonth() - 1) - 31,
                    i = 31 - n.getDate() + o + r.getDate();
                return f(Math.ceil(i / 7), 2)
            }
            return 0 === m(n, t) ? "01" : "00"
        },
        "%V": function(e) {
            var t, n = new Date(e.tm_year + 1900, 0, 4),
                r = new Date(e.tm_year + 1901, 0, 4),
                o = p(n),
                i = p(r),
                a = __addDays(new Date(e.tm_year + 1900, 0, 1), e.tm_yday);
            return m(a, o) < 0 ? "53" : m(i, a) <= 0 ? "01" : (t = o.getFullYear() < e.tm_year + 1900 ? e.tm_yday + 32 - o.getDate() : e.tm_yday + 1 - o.getDate(), f(Math.ceil(t / 7), 2))
        },
        "%w": function(e) {
            return e.tm_wday
        },
        "%W": function(e) {
            var t = new Date(e.tm_year, 0, 1),
                n = 1 === t.getDay() ? t : __addDays(t, 0 === t.getDay() ? 1 : 7 - t.getDay() + 1),
                r = new Date(e.tm_year + 1900, e.tm_mon, e.tm_mday);
            if (m(n, r) < 0) {
                var o = __arraySum(__isLeapYear(r.getFullYear()) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, r.getMonth() - 1) - 31,
                    i = 31 - n.getDate() + o + r.getDate();
                return f(Math.ceil(i / 7), 2)
            }
            return 0 === m(n, t) ? "01" : "00"
        },
        "%y": function(e) {
            return (e.tm_year + 1900).toString().substring(2)
        },
        "%Y": function(e) {
            return e.tm_year + 1900
        },
        "%z": function(e) {
            var t = e.tm_gmtoff,
                n = t >= 0;
            return t = (t = Math.abs(t) / 60) / 60 * 100 + t % 60, (n ? "+" : "-") + String("0000" + t).slice(-4)
        },
        "%Z": function(e) {
            return e.tm_zone
        },
        "%%": function() {
            return "%"
        }
    };
    for (var s in _) a.includes(s) && (a = a.replace(new RegExp(s, "g"), _[s](i)));
    var v = intArrayFromString(a, !1);
    return v.length > t ? 0 : (writeArrayToMemory(v, e), v.length - 1)
}

function _strftime_l(e, t, n, r) {
    return _strftime(e, t, n, r)
}

function _time(e) {
    var t = Date.now() / 1e3 | 0;
    return e && (HEAP32[e >> 2] = t), t
}
Module.__MONTH_DAYS_REGULAR = __MONTH_DAYS_REGULAR, Module.__addDays = __addDays, Module._strftime = _strftime, Module._strftime_l = _strftime_l, Module._time = _time;
var FSNode = function(e, t, n, r) {
        e || (e = this), this.parent = e, this.mount = e.mount, this.mounted = null, this.id = FS.nextInode++, this.name = t, this.mode = n, this.node_ops = {}, this.stream_ops = {}, this.rdev = r
    },
    readMode = 365,
    writeMode = 146;

function intArrayFromString(e, t, n) {
    var r = n > 0 ? n : lengthBytesUTF8(e) + 1,
        o = new Array(r),
        i = stringToUTF8Array(e, o, 0, o.length);
    return t && (o.length = i), o
}
Object.defineProperties(FSNode.prototype, {
    read: {
        get: function() {
            return (this.mode & readMode) === readMode
        },
        set: function(e) {
            e ? this.mode |= readMode : this.mode &= ~readMode
        }
    },
    write: {
        get: function() {
            return (this.mode & writeMode) === writeMode
        },
        set: function(e) {
            e ? this.mode |= writeMode : this.mode &= ~writeMode
        }
    },
    isFolder: {
        get: function() {
            return FS.isDir(this.mode)
        }
    },
    isDevice: {
        get: function() {
            return FS.isChrdev(this.mode)
        }
    }
}), FS.FSNode = FSNode, FS.staticInit();
var calledRun, asmLibraryArg = {
        a: ___assert_fail,
        c: ___cxa_allocate_exception,
        b: ___cxa_throw,
        u: ___localtime_r,
        g: ___sys_fcntl64,
        t: ___sys_ftruncate64,
        r: ___sys_ioctl,
        s: ___sys_open,
        e: _abort,
        m: _emscripten_asm_const_int,
        l: _emscripten_memcpy_big,
        d: _emscripten_resize_heap,
        q: _environ_get,
        p: _environ_sizes_get,
        f: _fd_close,
        o: _fd_read,
        k: _fd_seek,
        n: _fd_write,
        j: _setTempRet0,
        i: _strftime_l,
        h: _time
    },
    asm = createWasm(),
    ___wasm_call_ctors = Module.___wasm_call_ctors = function() {
        return (___wasm_call_ctors = Module.___wasm_call_ctors = Module.asm.w).apply(null, arguments)
    },
    _malloc = Module._malloc = function() {
        return (_malloc = Module._malloc = Module.asm.x).apply(null, arguments)
    },
    _realloc = Module._realloc = function() {
        return (_realloc = Module._realloc = Module.asm.y).apply(null, arguments)
    },
    _setSampleRate = Module._setSampleRate = function() {
        return (_setSampleRate = Module._setSampleRate = Module.asm.z).apply(null, arguments)
    },
    _main = Module._main = function() {
        return (_main = Module._main = Module.asm.A).apply(null, arguments)
    },
    _prepareRomBuffer = Module._prepareRomBuffer = function() {
        return (_prepareRomBuffer = Module._prepareRomBuffer = Module.asm.B).apply(null, arguments)
    },
    _getSymbol = Module._getSymbol = function() {
        return (_getSymbol = Module._getSymbol = Module.asm.C).apply(null, arguments)
    },
    _loadROM = Module._loadROM = function() {
        return (_loadROM = Module._loadROM = Module.asm.D).apply(null, arguments)
    },
    _savGetSize = Module._savGetSize = function() {
        return (_savGetSize = Module._savGetSize = Module.asm.E).apply(null, arguments)
    },
    _savGetPointer = Module._savGetPointer = function() {
        return (_savGetPointer = Module._savGetPointer = Module.asm.F).apply(null, arguments)
    },
    _savUpdateChangeFlag = Module._savUpdateChangeFlag = function() {
        return (_savUpdateChangeFlag = Module._savUpdateChangeFlag = Module.asm.G).apply(null, arguments)
    },
    _runFrame = Module._runFrame = function() {
        return (_runFrame = Module._runFrame = Module.asm.H).apply(null, arguments)
    },
    _fillAudioBuffer = Module._fillAudioBuffer = function() {
        return (_fillAudioBuffer = Module._fillAudioBuffer = Module.asm.I).apply(null, arguments)
    },
    _zlibCompress = Module._zlibCompress = function() {
        return (_zlibCompress = Module._zlibCompress = Module.asm.J).apply(null, arguments)
    },
    _zlibDecompress = Module._zlibDecompress = function() {
        return (_zlibDecompress = Module._zlibDecompress = Module.asm.K).apply(null, arguments)
    },
    ___errno_location = Module.___errno_location = function() {
        return (___errno_location = Module.___errno_location = Module.asm.L).apply(null, arguments)
    },
    _htons = Module._htons = function() {
        return (_htons = Module._htons = Module.asm.M).apply(null, arguments)
    },
    __get_tzname = Module.__get_tzname = function() {
        return (__get_tzname = Module.__get_tzname = Module.asm.N).apply(null, arguments)
    },
    __get_daylight = Module.__get_daylight = function() {
        return (__get_daylight = Module.__get_daylight = Module.asm.O).apply(null, arguments)
    },
    __get_timezone = Module.__get_timezone = function() {
        return (__get_timezone = Module.__get_timezone = Module.asm.P).apply(null, arguments)
    },
    stackSave = Module.stackSave = function() {
        return (stackSave = Module.stackSave = Module.asm.Q).apply(null, arguments)
    },
    stackRestore = Module.stackRestore = function() {
        return (stackRestore = Module.stackRestore = Module.asm.R).apply(null, arguments)
    },
    stackAlloc = Module.stackAlloc = function() {
        return (stackAlloc = Module.stackAlloc = Module.asm.S).apply(null, arguments)
    },
    dynCall_jiji = Module.dynCall_jiji = function() {
        return (dynCall_jiji = Module.dynCall_jiji = Module.asm.U).apply(null, arguments)
    },
    dynCall_viijii = Module.dynCall_viijii = function() {
        return (dynCall_viijii = Module.dynCall_viijii = Module.asm.V).apply(null, arguments)
    },
    dynCall_iiiiij = Module.dynCall_iiiiij = function() {
        return (dynCall_iiiiij = Module.dynCall_iiiiij = Module.asm.W).apply(null, arguments)
    },
    dynCall_iiiiijj = Module.dynCall_iiiiijj = function() {
        return (dynCall_iiiiijj = Module.dynCall_iiiiijj = Module.asm.X).apply(null, arguments)
    },
    dynCall_iiiiiijj = Module.dynCall_iiiiiijj = function() {
        return (dynCall_iiiiiijj = Module.dynCall_iiiiiijj = Module.asm.Y).apply(null, arguments)
    };

function ExitStatus(e) {
    this.name = "ExitStatus", this.message = "Program terminated with exit(" + e + ")", this.status = e
}
var calledMain = !1;

function callMain(e) {
    var t = Module._main;
    try {
        var n = t(0, 0);
        return exit(n, !0), n
    } catch (e) {
        return handleException(e)
    } finally {
        calledMain = !0
    }
}

function run(e) {
    function t() {
        calledRun || (calledRun = !0, Module.calledRun = !0, ABORT || (initRuntime(), preMain(), Module.onRuntimeInitialized && Module.onRuntimeInitialized(), shouldRunNow && callMain(e), postRun()))
    }
    e = e || arguments_, runDependencies > 0 || (preRun(), runDependencies > 0 || (Module.setStatus ? (Module.setStatus("Running..."), setTimeout(function() {
        setTimeout(function() {
            Module.setStatus("")
        }, 1), t()
    }, 1)) : t()))
}

function exit(e, t) {
    EXITSTATUS = e, keepRuntimeAlive() || exitRuntime(), procExit(e)
}

function procExit(e) {
    EXITSTATUS = e, keepRuntimeAlive() || (Module.onExit && Module.onExit(e), ABORT = !0), quit_(e, new ExitStatus(e))
}
if (dependenciesFulfilled = function e() {
        calledRun || run(), calledRun || (dependenciesFulfilled = e)
    }, Module.run = run, Module.preInit)
    for ("function" == typeof Module.preInit && (Module.preInit = [Module.preInit]); Module.preInit.length > 0;) Module.preInit.pop()();
var shouldRunNow = !0;
Module.noInitialRun && (shouldRunNow = !1), run();
