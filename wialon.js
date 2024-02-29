(function(){

if (!window.qx) window.qx = {};

qx.$$start = new Date();

if (!qx.$$environment) qx.$$environment = {};
var envinfo = {"qx.application":"wialon.Application","qx.debug":false,"qx.debug.databinding":false,"qx.debug.dispose":false,"qx.debug.io":false,"qx.debug.ui.queue":false,"qx.optimization.basecalls":true,"qx.optimization.comments":true,"qx.optimization.privates":true,"qx.optimization.strings":true,"qx.optimization.variables":true,"qx.optimization.variants":true,"qx.revision":"","qx.theme":"qx.theme.Modern","qx.version":"4.1"};
for (var k in envinfo) qx.$$environment[k] = envinfo[k];

if (!qx.$$libraries) qx.$$libraries = {};
var libinfo = {"__out__":{"sourceUri":"script"},"qx":{"resourceUri":"resource","sourceUri":"script","sourceViewUri":"https://github.com/qooxdoo/qooxdoo/blob/%{qxGitBranch}/framework/source/class/%{classFilePath}#L%{lineNumber}"},"wialon":{"resourceUri":"resource","sourceUri":"script"}};
for (var k in libinfo) qx.$$libraries[k] = libinfo[k];

qx.$$resources = {};
qx.$$translations = {"C":null};
qx.$$locales = {"C":null};
qx.$$packageData = {};
qx.$$g = {}

qx.$$loader = {
  parts : {"boot":[0]},
  packages : {"0":{"uris":["__out__:wialon.84eacba037fd.js"]}},
  urisBefore : [],
  cssBefore : [],
  boot : "boot",
  closureParts : {},
  bootIsInline : true,
  addNoCacheParam : false,

  decodeUris : function(compressedUris)
  {
    var libs = qx.$$libraries;
    var uris = [];
    for (var i=0; i<compressedUris.length; i++)
    {
      var uri = compressedUris[i].split(":");
      var euri;
      if (uri.length==2 && uri[0] in libs) {
        var prefix = libs[uri[0]].sourceUri;
        euri = prefix + "/" + uri[1];
      } else {
        euri = compressedUris[i];
      }
      if (qx.$$loader.addNoCacheParam) {
        euri += "?nocache=" + Math.random();
      }
      euri = euri.replace("../", "");
euri = euri.replace("source", "");
if (euri.substr(0, 1) != "/")
	euri = "/" + euri;
euri = "/wsdk" + euri;
if (typeof wialonSDKExternalUrl != "undefined")
	euri = wialonSDKExternalUrl + euri;
      uris.push(euri);
    }
    return uris;
  }
};

var readyStateValue = {"complete" : true};
if (document.documentMode && document.documentMode < 10 ||
    (typeof window.ActiveXObject !== "undefined" && !document.documentMode)) {
  readyStateValue["loaded"] = true;
}

function loadScript(uri, callback) {
  var elem = document.createElement("script");
  elem.charset = "utf-8";
  elem.src = uri;
  elem.onreadystatechange = elem.onload = function() {
    if (!this.readyState || readyStateValue[this.readyState]) {
      elem.onreadystatechange = elem.onload = null;
      if (typeof callback === "function") {
        callback();
      }
    }
  };

  if (isLoadParallel) {
    elem.async = null;
  }

  var head = document.getElementsByTagName("head")[0];
  head.appendChild(elem);
}

function loadCss(uri) {
  var elem = document.createElement("link");
  elem.rel = "stylesheet";
  elem.type= "text/css";
  elem.href= uri;
  var head = document.getElementsByTagName("head")[0];
  head.appendChild(elem);
}

var isWebkit = /AppleWebKit\/([^ ]+)/.test(navigator.userAgent);
var isLoadParallel = 'async' in document.createElement('script');

function loadScriptList(list, callback) {
  if (list.length == 0) {
    callback();
    return;
  }

  var item;

  if (isLoadParallel) {
    while (list.length) {
      item = list.shift();
      if (list.length) {
        loadScript(item);
      } else {
        loadScript(item, callback);
      }
    }
  } else {
    item = list.shift();
    loadScript(item,  function() {
      if (isWebkit) {
        // force async, else Safari fails with a "maximum recursion depth exceeded"
        window.setTimeout(function() {
          loadScriptList(list, callback);
        }, 0);
      } else {
        loadScriptList(list, callback);
      }
    });
  }
}

var fireContentLoadedEvent = function() {
  qx.$$domReady = true;
  document.removeEventListener('DOMContentLoaded', fireContentLoadedEvent, false);
};
if (document.addEventListener) {
  document.addEventListener('DOMContentLoaded', fireContentLoadedEvent, false);
}

qx.$$loader.importPackageData = function (dataMap, callback) {
  if (dataMap["resources"]){
    var resMap = dataMap["resources"];
    for (var k in resMap) qx.$$resources[k] = resMap[k];
  }
  if (dataMap["locales"]){
    var locMap = dataMap["locales"];
    var qxlocs = qx.$$locales;
    for (var lang in locMap){
      if (!qxlocs[lang]) qxlocs[lang] = locMap[lang];
      else
        for (var k in locMap[lang]) qxlocs[lang][k] = locMap[lang][k];
    }
  }
  if (dataMap["translations"]){
    var trMap   = dataMap["translations"];
    var qxtrans = qx.$$translations;
    for (var lang in trMap){
      if (!qxtrans[lang]) qxtrans[lang] = trMap[lang];
      else
        for (var k in trMap[lang]) qxtrans[lang][k] = trMap[lang][k];
    }
  }
  if (callback){
    callback(dataMap);
  }
}

qx.$$loader.signalStartup = function ()
{
  qx.$$loader.scriptLoaded = true;
  if (window.qx && qx.event && qx.event.handler && qx.event.handler.Application) {
    qx.event.handler.Application.onScriptLoaded();
    qx.$$loader.applicationHandlerReady = true;
  } else {
    qx.$$loader.applicationHandlerReady = false;
  }
}

// Load all stuff
qx.$$loader.init = function(){
  var l=qx.$$loader;
  if (l.cssBefore.length>0) {
    for (var i=0, m=l.cssBefore.length; i<m; i++) {
      loadCss(l.cssBefore[i]);
    }
  }
  if (l.urisBefore.length>0){
    loadScriptList(l.urisBefore, function(){
      l.initUris();
    });
  } else {
    l.initUris();
  }
}

// Load qooxdoo boot stuff
qx.$$loader.initUris = function(){
  var l=qx.$$loader;
  var bootPackageHash=l.parts[l.boot][0];
  if (l.bootIsInline){
    l.importPackageData(qx.$$packageData[bootPackageHash]);
    l.signalStartup();
  } else {
    loadScriptList(l.decodeUris(l.packages[l.parts[l.boot][0]].uris), function(){
      // Opera needs this extra time to parse the scripts
      window.setTimeout(function(){
        l.importPackageData(qx.$$packageData[bootPackageHash] || {});
        l.signalStartup();
      }, 0);
    });
  }
}
})();

qx.$$packageData['0']={"locales":{},"resources":{},"translations":{"C":{}}};

(function(){

  var b = ".prototype",c = "function",d = "Boolean",e = "Error",f = "Object.keys requires an object as argument.",g = "constructor",h = "warn",j = "default",k = "Null",m = "hasOwnProperty",n = "Undefined",o = "string",p = "Object",q = "toLocaleString",r = "error",s = "toString",t = "qx.debug",u = "()",v = "RegExp",w = "String",x = "info",y = "BROKEN_IE",z = "isPrototypeOf",A = "Date",B = "",C = "qx.Bootstrap",D = "Function",E = "]",F = "Cannot call super class. Method is not derived: ",G = "Array",H = "[Class ",I = "valueOf",J = "Number",K = "Class",L = "debug",M = "ES5",N = ".",O = "propertyIsEnumerable",P = "object";
  if(!window.qx){

    window.qx = {
    };
  };
  qx.Bootstrap = {
    genericToString : function(){

      return H + this.classname + E;
    },
    createNamespace : function(name, Q){

      var T = name.split(N);
      var S = T[0];
      var parent = qx.$$namespaceRoot && qx.$$namespaceRoot[S] ? qx.$$namespaceRoot : window;
      for(var i = 0,R = T.length - 1;i < R;i++,S = T[i]){

        if(!parent[S]){

          parent = parent[S] = {
          };
        } else {

          parent = parent[S];
        };
      };
      parent[S] = Q;
      return S;
    },
    setDisplayName : function(V, U, name){

      V.displayName = U + N + name + u;
    },
    setDisplayNames : function(X, W){

      for(var name in X){

        var Y = X[name];
        if(Y instanceof Function){

          Y.displayName = W + N + name + u;
        };
      };
    },
    base : function(ba, bb){

      if(qx.Bootstrap.DEBUG){

        if(!qx.Bootstrap.isFunction(ba.callee.base)){

          throw new Error(F + ba.callee.displayName);
        };
      };
      if(arguments.length === 1){

        return ba.callee.base.call(this);
      } else {

        return ba.callee.base.apply(this, Array.prototype.slice.call(arguments, 1));
      };
    },
    define : function(name, bm){

      if(!bm){

        bm = {
          statics : {
          }
        };
      };
      var bi;
      var be = null;
      qx.Bootstrap.setDisplayNames(bm.statics, name);
      if(bm.members || bm.extend){

        qx.Bootstrap.setDisplayNames(bm.members, name + b);
        bi = bm.construct || new Function;
        if(bm.extend){

          this.extendClass(bi, bi, bm.extend, name, bg);
        };
        var bd = bm.statics || {
        };
        for(var i = 0,bf = qx.Bootstrap.keys(bd),l = bf.length;i < l;i++){

          var bc = bf[i];
          bi[bc] = bd[bc];
        };
        be = bi.prototype;
        be.base = qx.Bootstrap.base;
        be.name = be.classname = name;
        var bk = bm.members || {
        };
        var bc,bj;
        for(var i = 0,bf = qx.Bootstrap.keys(bk),l = bf.length;i < l;i++){

          bc = bf[i];
          bj = bk[bc];
          if(bj instanceof Function && be[bc]){

            bj.base = be[bc];
          };
          be[bc] = bj;
        };
      } else {

        bi = bm.statics || {
        };
        if(qx.Bootstrap.$$registry && qx.Bootstrap.$$registry[name]){

          var bl = qx.Bootstrap.$$registry[name];
          if(this.keys(bi).length !== 0){

            if(bm.defer){

              bm.defer(bi, be);
            };
            for(var bh in bi){

              bl[bh] = bi[bh];
            };
            return bl;
          };
        };
      };
      bi.$$type = K;
      if(!bi.hasOwnProperty(s)){

        bi.toString = this.genericToString;
      };
      var bg = name ? this.createNamespace(name, bi) : B;
      bi.name = bi.classname = name;
      bi.basename = bg;
      bi.$$events = bm.events;
      if(bm.defer){

        bm.defer(bi, be);
      };
      if(name != null){

        qx.Bootstrap.$$registry[name] = bi;
      };
      return bi;
    }
  };
  qx.Bootstrap.define(C, {
    statics : {
      LOADSTART : qx.$$start || new Date(),
      DEBUG : (function(){

        var bn = true;
        if(qx.$$environment && qx.$$environment[t] === false){

          bn = false;
        };
        return bn;
      })(),
      getEnvironmentSetting : function(bo){

        if(qx.$$environment){

          return qx.$$environment[bo];
        };
      },
      setEnvironmentSetting : function(bp, bq){

        if(!qx.$$environment){

          qx.$$environment = {
          };
        };
        if(qx.$$environment[bp] === undefined){

          qx.$$environment[bp] = bq;
        };
      },
      createNamespace : qx.Bootstrap.createNamespace,
      setRoot : function(br){

        qx.$$namespaceRoot = br;
      },
      base : qx.Bootstrap.base,
      define : qx.Bootstrap.define,
      setDisplayName : qx.Bootstrap.setDisplayName,
      setDisplayNames : qx.Bootstrap.setDisplayNames,
      genericToString : qx.Bootstrap.genericToString,
      extendClass : function(clazz, construct, superClass, name, basename){

        var superproto = superClass.prototype;
        var helper = new Function();
        helper.prototype = superproto;
        var proto = new helper();
        clazz.prototype = proto;
        proto.name = proto.classname = name;
        proto.basename = basename;
        construct.base = superClass;
        clazz.superclass = superClass;
        construct.self = clazz.constructor = proto.constructor = clazz;
      },
      getByName : function(name){

        return qx.Bootstrap.$$registry[name];
      },
      $$registry : {
      },
      objectGetLength : function(bs){

        return qx.Bootstrap.keys(bs).length;
      },
      objectMergeWith : function(bu, bt, bw){

        if(bw === undefined){

          bw = true;
        };
        for(var bv in bt){

          if(bw || bu[bv] === undefined){

            bu[bv] = bt[bv];
          };
        };
        return bu;
      },
      __a : [z, m, q, s, I, O, g],
      keys : ({
        "ES5" : Object.keys,
        "BROKEN_IE" : function(bx){

          if(bx === null || (typeof bx != P && typeof bx != c)){

            throw new TypeError(f);
          };
          var by = [];
          var bA = Object.prototype.hasOwnProperty;
          for(var bB in bx){

            if(bA.call(bx, bB)){

              by.push(bB);
            };
          };
          var bz = qx.Bootstrap.__a;
          for(var i = 0,a = bz,l = a.length;i < l;i++){

            if(bA.call(bx, a[i])){

              by.push(a[i]);
            };
          };
          return by;
        },
        "default" : function(bC){

          if(bC === null || (typeof bC != P && typeof bC != c)){

            throw new TypeError(f);
          };
          var bD = [];
          var bE = Object.prototype.hasOwnProperty;
          for(var bF in bC){

            if(bE.call(bC, bF)){

              bD.push(bF);
            };
          };
          return bD;
        }
      })[typeof (Object.keys) == c ? M : (function(){

        for(var bG in {
          toString : 1
        }){

          return bG;
        };
      })() !== s ? y : j],
      __b : {
        "[object String]" : w,
        "[object Array]" : G,
        "[object Object]" : p,
        "[object RegExp]" : v,
        "[object Number]" : J,
        "[object Boolean]" : d,
        "[object Date]" : A,
        "[object Function]" : D,
        "[object Error]" : e
      },
      bind : function(bI, self, bJ){

        var bH = Array.prototype.slice.call(arguments, 2, arguments.length);
        return function(){

          var bK = Array.prototype.slice.call(arguments, 0, arguments.length);
          return bI.apply(self, bH.concat(bK));
        };
      },
      firstUp : function(bL){

        return bL.charAt(0).toUpperCase() + bL.substr(1);
      },
      firstLow : function(bM){

        return bM.charAt(0).toLowerCase() + bM.substr(1);
      },
      getClass : function(bO){

        if(bO === undefined){

          return n;
        } else if(bO === null){

          return k;
        };
        var bN = Object.prototype.toString.call(bO);
        return (qx.Bootstrap.__b[bN] || bN.slice(8, -1));
      },
      isString : function(bP){

        return (bP !== null && (typeof bP === o || qx.Bootstrap.getClass(bP) == w || bP instanceof String || (!!bP && !!bP.$$isString)));
      },
      isArray : function(bQ){

        return (bQ !== null && (bQ instanceof Array || (bQ && qx.data && qx.data.IListData && qx.util.OOUtil.hasInterface(bQ.constructor, qx.data.IListData)) || qx.Bootstrap.getClass(bQ) == G || (!!bQ && !!bQ.$$isArray)));
      },
      isObject : function(bR){

        return (bR !== undefined && bR !== null && qx.Bootstrap.getClass(bR) == p);
      },
      isFunction : function(bS){

        return qx.Bootstrap.getClass(bS) == D;
      },
      $$logs : [],
      debug : function(bU, bT){

        qx.Bootstrap.$$logs.push([L, arguments]);
      },
      info : function(bW, bV){

        qx.Bootstrap.$$logs.push([x, arguments]);
      },
      warn : function(bY, bX){

        qx.Bootstrap.$$logs.push([h, arguments]);
      },
      error : function(cb, ca){

        qx.Bootstrap.$$logs.push([r, arguments]);
      },
      trace : function(cc){
      }
    }
  });
})();
(function(){

  var a = "qx.util.OOUtil";
  qx.Bootstrap.define(a, {
    statics : {
      classIsDefined : function(name){

        return qx.Bootstrap.getByName(name) !== undefined;
      },
      getPropertyDefinition : function(b, name){

        while(b){

          if(b.$$properties && b.$$properties[name]){

            return b.$$properties[name];
          };
          b = b.superclass;
        };
        return null;
      },
      hasProperty : function(c, name){

        return !!qx.util.OOUtil.getPropertyDefinition(c, name);
      },
      getEventType : function(d, name){

        var d = d.constructor;
        while(d.superclass){

          if(d.$$events && d.$$events[name] !== undefined){

            return d.$$events[name];
          };
          d = d.superclass;
        };
        return null;
      },
      supportsEvent : function(e, name){

        return !!qx.util.OOUtil.getEventType(e, name);
      },
      getByInterface : function(h, f){

        var g,i,l;
        while(h){

          if(h.$$implements){

            g = h.$$flatImplements;
            for(i = 0,l = g.length;i < l;i++){

              if(g[i] === f){

                return h;
              };
            };
          };
          h = h.superclass;
        };
        return null;
      },
      hasInterface : function(k, j){

        return !!qx.util.OOUtil.getByInterface(k, j);
      },
      getMixins : function(n){

        var m = [];
        while(n){

          if(n.$$includes){

            m.push.apply(m, n.$$flatIncludes);
          };
          n = n.superclass;
        };
        return m;
      }
    }
  });
})();
(function(){

  var a = "qx.core.Environment",b = "default",c = ' type)',d = "&",e = "qx/static/blank.html",f = "true",g = "|",h = "qx.core.Environment for a list of predefined keys.",j = "false",k = '] found, and no default ("default") given',l = ":",m = '" (',n = ' in variants [',o = ".",p = "qx.allowUrlSettings",q = 'No match for variant "',r = " is not a valid key. Please see the API-doc of ",s = "qxenv";
  qx.Bootstrap.define(a, {
    statics : {
      _checks : {
      },
      _asyncChecks : {
      },
      __c : {
      },
      _checksMap : {
      },
      _defaults : {
        "true" : true,
        "qx.allowUrlSettings" : false,
        "qx.allowUrlVariants" : false,
        "qx.debug.property.level" : 0,
        "qx.debug" : true,
        "qx.debug.ui.queue" : true,
        "qx.aspects" : false,
        "qx.dynlocale" : true,
        "qx.dyntheme" : true,
        "qx.blankpage" : e,
        "qx.debug.databinding" : false,
        "qx.debug.dispose" : false,
        "qx.optimization.basecalls" : false,
        "qx.optimization.comments" : false,
        "qx.optimization.privates" : false,
        "qx.optimization.strings" : false,
        "qx.optimization.variables" : false,
        "qx.optimization.variants" : false,
        "module.databinding" : true,
        "module.logger" : true,
        "module.property" : true,
        "module.events" : true,
        "qx.nativeScrollBars" : false
      },
      get : function(w){

        if(this.__c[w] != undefined){

          return this.__c[w];
        };
        var y = this._checks[w];
        if(y){

          var u = y();
          this.__c[w] = u;
          return u;
        };
        var t = this._getClassNameFromEnvKey(w);
        if(t[0] != undefined){

          var x = t[0];
          var v = t[1];
          var u = x[v]();
          this.__c[w] = u;
          return u;
        };
        if(qx.Bootstrap.DEBUG){

          qx.Bootstrap.warn(w + r + h);
          qx.Bootstrap.trace(this);
        };
      },
      _getClassNameFromEnvKey : function(D){

        var F = this._checksMap;
        if(F[D] != undefined){

          var A = F[D];
          var E = A.lastIndexOf(o);
          if(E > -1){

            var C = A.slice(0, E);
            var z = A.slice(E + 1);
            var B = qx.Bootstrap.getByName(C);
            if(B != undefined){

              return [B, z];
            };
          };
        };
        return [undefined, undefined];
      },
      getAsync : function(H, K, self){

        var L = this;
        if(this.__c[H] != undefined){

          window.setTimeout(function(){

            K.call(self, L.__c[H]);
          }, 0);
          return;
        };
        var I = this._asyncChecks[H];
        if(I){

          I(function(N){

            L.__c[H] = N;
            K.call(self, N);
          });
          return;
        };
        var G = this._getClassNameFromEnvKey(H);
        if(G[0] != undefined){

          var J = G[0];
          var M = G[1];
          J[M](function(O){

            L.__c[H] = O;
            K.call(self, O);
          });
          return;
        };
        if(qx.Bootstrap.DEBUG){

          qx.Bootstrap.warn(H + r + h);
          qx.Bootstrap.trace(this);
        };
      },
      select : function(Q, P){

        return this.__d(this.get(Q), P);
      },
      selectAsync : function(S, R, self){

        this.getAsync(S, function(T){

          var U = this.__d(S, R);
          U.call(self, T);
        }, this);
      },
      __d : function(Y, X){

        var W = X[Y];
        if(X.hasOwnProperty(Y)){

          return W;
        };
        for(var ba in X){

          if(ba.indexOf(g) != -1){

            var V = ba.split(g);
            for(var i = 0;i < V.length;i++){

              if(V[i] == Y){

                return X[ba];
              };
            };
          };
        };
        if(X[b] !== undefined){

          return X[b];
        };
        if(qx.Bootstrap.DEBUG){

          throw new Error(q + Y + m + (typeof Y) + c + n + qx.Bootstrap.keys(X) + k);
        };
      },
      filter : function(bb){

        var bd = [];
        for(var bc in bb){

          if(this.get(bc)){

            bd.push(bb[bc]);
          };
        };
        return bd;
      },
      invalidateCacheKey : function(be){

        delete this.__c[be];
      },
      add : function(bg, bf){

        if(this._checks[bg] == undefined){

          if(bf instanceof Function){

            if(!this._checksMap[bg] && bf.displayName){

              this._checksMap[bg] = bf.displayName.substr(0, bf.displayName.length - 2);
            };
            this._checks[bg] = bf;
          } else {

            this._checks[bg] = this.__g(bf);
          };
        };
      },
      addAsync : function(bi, bh){

        if(this._checks[bi] == undefined){

          this._asyncChecks[bi] = bh;
        };
      },
      getChecks : function(){

        return this._checks;
      },
      getAsyncChecks : function(){

        return this._asyncChecks;
      },
      _initDefaultQxValues : function(){

        var bj = function(bl){

          return function(){

            return bl;
          };
        };
        for(var bk in this._defaults){

          this.add(bk, bj(this._defaults[bk]));
        };
      },
      __e : function(){

        if(qx && qx.$$environment){

          for(var bm in qx.$$environment){

            var bn = qx.$$environment[bm];
            this._checks[bm] = this.__g(bn);
          };
        };
      },
      __f : function(){

        if(window.document && window.document.location){

          var bo = window.document.location.search.slice(1).split(d);
          for(var i = 0;i < bo.length;i++){

            var br = bo[i].split(l);
            if(br.length != 3 || br[0] != s){

              continue;
            };
            var bp = br[1];
            var bq = decodeURIComponent(br[2]);
            if(bq == f){

              bq = true;
            } else if(bq == j){

              bq = false;
            } else if(/^(\d|\.)+$/.test(bq)){

              bq = parseFloat(bq);
            };;
            this._checks[bp] = this.__g(bq);
          };
        };
      },
      __g : function(bs){

        return qx.Bootstrap.bind(function(bt){

          return bt;
        }, null, bs);
      }
    },
    defer : function(bu){

      bu._initDefaultQxValues();
      bu.__e();
      if(bu.get(p) === true){

        bu.__f();
      };
    }
  });
})();
(function(){

  var a = "ecmascript.array.lastindexof",b = "function",c = "stack",d = "ecmascript.array.map",f = "ecmascript.date.now",g = "ecmascript.array.reduce",h = "e",i = "qx.bom.client.EcmaScript",j = "ecmascript.object.keys",k = "ecmascript.error.stacktrace",l = "ecmascript.string.trim",m = "ecmascript.array.indexof",n = "stacktrace",o = "ecmascript.error.toString",p = "[object Error]",q = "ecmascript.array.foreach",r = "ecmascript.function.bind",s = "ecmascript.array.reduceright",t = "ecmascript.array.some",u = "ecmascript.array.filter",v = "ecmascript.array.every";
  qx.Bootstrap.define(i, {
    statics : {
      getStackTrace : function(){

        var w;
        var e = new Error(h);
        w = e.stack ? c : e.stacktrace ? n : null;
        if(!w){

          try{

            throw e;
          } catch(x) {

            e = x;
          };
        };
        return e.stacktrace ? n : e.stack ? c : null;
      },
      getArrayIndexOf : function(){

        return !!Array.prototype.indexOf;
      },
      getArrayLastIndexOf : function(){

        return !!Array.prototype.lastIndexOf;
      },
      getArrayForEach : function(){

        return !!Array.prototype.forEach;
      },
      getArrayFilter : function(){

        return !!Array.prototype.filter;
      },
      getArrayMap : function(){

        return !!Array.prototype.map;
      },
      getArraySome : function(){

        return !!Array.prototype.some;
      },
      getArrayEvery : function(){

        return !!Array.prototype.every;
      },
      getArrayReduce : function(){

        return !!Array.prototype.reduce;
      },
      getArrayReduceRight : function(){

        return !!Array.prototype.reduceRight;
      },
      getErrorToString : function(){

        return typeof Error.prototype.toString == b && Error.prototype.toString() !== p;
      },
      getFunctionBind : function(){

        return typeof Function.prototype.bind === b;
      },
      getObjectKeys : function(){

        return !!Object.keys;
      },
      getDateNow : function(){

        return !!Date.now;
      },
      getStringTrim : function(){

        return typeof String.prototype.trim === b;
      }
    },
    defer : function(y){

      qx.core.Environment.add(m, y.getArrayIndexOf);
      qx.core.Environment.add(a, y.getArrayLastIndexOf);
      qx.core.Environment.add(q, y.getArrayForEach);
      qx.core.Environment.add(u, y.getArrayFilter);
      qx.core.Environment.add(d, y.getArrayMap);
      qx.core.Environment.add(t, y.getArraySome);
      qx.core.Environment.add(v, y.getArrayEvery);
      qx.core.Environment.add(g, y.getArrayReduce);
      qx.core.Environment.add(s, y.getArrayReduceRight);
      qx.core.Environment.add(f, y.getDateNow);
      qx.core.Environment.add(o, y.getErrorToString);
      qx.core.Environment.add(k, y.getStackTrace);
      qx.core.Environment.add(r, y.getFunctionBind);
      qx.core.Environment.add(j, y.getObjectKeys);
      qx.core.Environment.add(l, y.getStringTrim);
    }
  });
})();
(function(){

  var a = "function",b = "ecmascript.array.lastindexof",c = "ecmascript.array.map",d = "ecmascript.array.filter",e = "Length is 0 and no second argument given",f = "qx.lang.normalize.Array",g = "ecmascript.array.indexof",h = "First argument is not callable",j = "ecmascript.array.reduce",k = "ecmascript.array.foreach",m = "ecmascript.array.reduceright",n = "ecmascript.array.some",o = "ecmascript.array.every";
  qx.Bootstrap.define(f, {
    statics : {
      indexOf : function(p, q){

        if(q == null){

          q = 0;
        } else if(q < 0){

          q = Math.max(0, this.length + q);
        };
        for(var i = q;i < this.length;i++){

          if(this[i] === p){

            return i;
          };
        };
        return -1;
      },
      lastIndexOf : function(r, s){

        if(s == null){

          s = this.length - 1;
        } else if(s < 0){

          s = Math.max(0, this.length + s);
        };
        for(var i = s;i >= 0;i--){

          if(this[i] === r){

            return i;
          };
        };
        return -1;
      },
      forEach : function(t, u){

        var l = this.length;
        for(var i = 0;i < l;i++){

          var v = this[i];
          if(v !== undefined){

            t.call(u || window, v, i, this);
          };
        };
      },
      filter : function(z, w){

        var x = [];
        var l = this.length;
        for(var i = 0;i < l;i++){

          var y = this[i];
          if(y !== undefined){

            if(z.call(w || window, y, i, this)){

              x.push(this[i]);
            };
          };
        };
        return x;
      },
      map : function(D, A){

        var B = [];
        var l = this.length;
        for(var i = 0;i < l;i++){

          var C = this[i];
          if(C !== undefined){

            B[i] = D.call(A || window, C, i, this);
          };
        };
        return B;
      },
      some : function(E, F){

        var l = this.length;
        for(var i = 0;i < l;i++){

          var G = this[i];
          if(G !== undefined){

            if(E.call(F || window, G, i, this)){

              return true;
            };
          };
        };
        return false;
      },
      every : function(H, I){

        var l = this.length;
        for(var i = 0;i < l;i++){

          var J = this[i];
          if(J !== undefined){

            if(!H.call(I || window, J, i, this)){

              return false;
            };
          };
        };
        return true;
      },
      reduce : function(K, L){

        if(typeof K !== a){

          throw new TypeError(h);
        };
        if(L === undefined && this.length === 0){

          throw new TypeError(e);
        };
        var M = L === undefined ? this[0] : L;
        for(var i = L === undefined ? 1 : 0;i < this.length;i++){

          if(i in this){

            M = K.call(undefined, M, this[i], i, this);
          };
        };
        return M;
      },
      reduceRight : function(N, O){

        if(typeof N !== a){

          throw new TypeError(h);
        };
        if(O === undefined && this.length === 0){

          throw new TypeError(e);
        };
        var P = O === undefined ? this[this.length - 1] : O;
        for(var i = O === undefined ? this.length - 2 : this.length - 1;i >= 0;i--){

          if(i in this){

            P = N.call(undefined, P, this[i], i, this);
          };
        };
        return P;
      }
    },
    defer : function(Q){

      if(!qx.core.Environment.get(g)){

        Array.prototype.indexOf = Q.indexOf;
      };
      if(!qx.core.Environment.get(b)){

        Array.prototype.lastIndexOf = Q.lastIndexOf;
      };
      if(!qx.core.Environment.get(k)){

        Array.prototype.forEach = Q.forEach;
      };
      if(!qx.core.Environment.get(d)){

        Array.prototype.filter = Q.filter;
      };
      if(!qx.core.Environment.get(c)){

        Array.prototype.map = Q.map;
      };
      if(!qx.core.Environment.get(n)){

        Array.prototype.some = Q.some;
      };
      if(!qx.core.Environment.get(o)){

        Array.prototype.every = Q.every;
      };
      if(!qx.core.Environment.get(j)){

        Array.prototype.reduce = Q.reduce;
      };
      if(!qx.core.Environment.get(m)){

        Array.prototype.reduceRight = Q.reduceRight;
      };
    }
  });
})();
(function(){

  var a = "qx.Mixin",b = ".prototype",c = "]",d = 'Conflict between mixin "',e = "constructor",f = "Array",g = '"!',h = '" and "',j = "destruct",k = '" in property "',m = "Mixin",n = '" in member "',o = "[Mixin ";
  qx.Bootstrap.define(a, {
    statics : {
      define : function(name, q){

        if(q){

          if(q.include && !(qx.Bootstrap.getClass(q.include) === f)){

            q.include = [q.include];
          };
          {
          };
          var r = q.statics ? q.statics : {
          };
          qx.Bootstrap.setDisplayNames(r, name);
          for(var p in r){

            if(r[p] instanceof Function){

              r[p].$$mixin = r;
            };
          };
          if(q.construct){

            r.$$constructor = q.construct;
            qx.Bootstrap.setDisplayName(q.construct, name, e);
          };
          if(q.include){

            r.$$includes = q.include;
          };
          if(q.properties){

            r.$$properties = q.properties;
          };
          if(q.members){

            r.$$members = q.members;
            qx.Bootstrap.setDisplayNames(q.members, name + b);
          };
          for(var p in r.$$members){

            if(r.$$members[p] instanceof Function){

              r.$$members[p].$$mixin = r;
            };
          };
          if(q.events){

            r.$$events = q.events;
          };
          if(q.destruct){

            r.$$destructor = q.destruct;
            qx.Bootstrap.setDisplayName(q.destruct, name, j);
          };
        } else {

          var r = {
          };
        };
        r.$$type = m;
        r.name = name;
        r.toString = this.genericToString;
        r.basename = qx.Bootstrap.createNamespace(name, r);
        this.$$registry[name] = r;
        return r;
      },
      checkCompatibility : function(t){

        var u = this.flatten(t);
        var v = u.length;
        if(v < 2){

          return true;
        };
        var w = {
        };
        var x = {
        };
        var z = {
        };
        var y;
        for(var i = 0;i < v;i++){

          y = u[i];
          for(var s in y.events){

            if(z[s]){

              throw new Error(d + y.name + h + z[s] + n + s + g);
            };
            z[s] = y.name;
          };
          for(var s in y.properties){

            if(w[s]){

              throw new Error(d + y.name + h + w[s] + k + s + g);
            };
            w[s] = y.name;
          };
          for(var s in y.members){

            if(x[s]){

              throw new Error(d + y.name + h + x[s] + n + s + g);
            };
            x[s] = y.name;
          };
        };
        return true;
      },
      isCompatible : function(B, C){

        var A = qx.util.OOUtil.getMixins(C);
        A.push(B);
        return qx.Mixin.checkCompatibility(A);
      },
      getByName : function(name){

        return this.$$registry[name];
      },
      isDefined : function(name){

        return this.getByName(name) !== undefined;
      },
      getTotalNumber : function(){

        return qx.Bootstrap.objectGetLength(this.$$registry);
      },
      flatten : function(D){

        if(!D){

          return [];
        };
        var E = D.concat();
        for(var i = 0,l = D.length;i < l;i++){

          if(D[i].$$includes){

            E.push.apply(E, this.flatten(D[i].$$includes));
          };
        };
        return E;
      },
      genericToString : function(){

        return o + this.name + c;
      },
      $$registry : {
      },
      __h : null,
      __i : function(name, F){
      }
    }
  });
})();
(function(){

  var a = "&v=1",b = "",c = "wialon.item.MPoi",d = "?b=",e = "undefined",f = "string",g = "resource/upload_poi_image";
  qx.Mixin.define(c, {
    members : {
      getPoiImageUrl : function(h, i){

        if(typeof i == e || !i)i = 32;
        if(h.icon)return wialon.core.Session.getInstance().getBaseUrl() + h.icon + d + i + a;
        return b;
      },
      setPoiImage : function(k, j, l){

        if(typeof j == f)return wialon.core.Uploader.getInstance().uploadFiles([], g, {
          fileUrl : j,
          itemId : this.getId(),
          poiId : k.id
        }, l, true); else if(j === null || j === undefined)return wialon.core.Uploader.getInstance().uploadFiles([], g, {
          fileUrl : b,
          itemId : this.getId(),
          poiId : k.id
        }, l, true);;
        return wialon.core.Uploader.getInstance().uploadFiles([j], g, {
          itemId : this.getId(),
          poiId : k.id
        }, l, true);
      }
    }
  });
})();
(function(){

  var a = '',b = "ecmascript.string.trim",c = "qx.lang.normalize.String";
  qx.Bootstrap.define(c, {
    statics : {
      trim : function(){

        return this.replace(/^\s+|\s+$/g, a);
      }
    },
    defer : function(d){

      if(!qx.core.Environment.get(b)){

        String.prototype.trim = d.trim;
      };
    }
  });
})();
(function(){

  var a = "ecmascript.object.keys",b = "qx.lang.normalize.Object";
  qx.Bootstrap.define(b, {
    statics : {
      keys : qx.Bootstrap.keys
    },
    defer : function(c){

      if(!qx.core.Environment.get(a)){

        Object.keys = c.keys;
      };
    }
  });
})();
(function(){

  var a = "qx.lang.normalize.Function",b = "ecmascript.function.bind",c = "function",d = "Function.prototype.bind called on incompatible ";
  qx.Bootstrap.define(a, {
    statics : {
      bind : function(i){

        var e = Array.prototype.slice;
        var h = this;
        if(typeof h != c){

          throw new TypeError(d + h);
        };
        var f = e.call(arguments, 1);
        var g = function(){

          if(this instanceof g){

            var F = function(){
            };
            F.prototype = h.prototype;
            var self = new F;
            var j = h.apply(self, f.concat(e.call(arguments)));
            if(Object(j) === j){

              return j;
            };
            return self;
          } else {

            return h.apply(i, f.concat(e.call(arguments)));
          };
        };
        return g;
      }
    },
    defer : function(k){

      if(!qx.core.Environment.get(b)){

        Function.prototype.bind = k.bind;
      };
    }
  });
})();
(function(){

  var a = "ecmascript.error.toString",b = "qx.lang.normalize.Error",c = ": ",d = "Error",e = "";
  qx.Bootstrap.define(b, {
    statics : {
      toString : function(){

        var name = this.name || d;
        var f = this.message || e;
        if(name === e && f === e){

          return d;
        };
        if(name === e){

          return f;
        };
        if(f === e){

          return name;
        };
        return name + c + f;
      }
    },
    defer : function(g){

      if(!qx.core.Environment.get(a)){

        Error.prototype.toString = g.toString;
      };
    }
  });
})();
(function(){

  var a = "qx.lang.normalize.Date",b = "ecmascript.date.now";
  qx.Bootstrap.define(a, {
    statics : {
      now : function(){

        return +new Date();
      }
    },
    defer : function(c){

      if(!qx.core.Environment.get(b)){

        Date.now = c.now;
      };
    }
  });
})();
(function(){

  var b = '!==inherit){',c = 'qx.lang.Type.isString(value) && qx.util.ColorUtil.isValidPropertyValue(value)',d = 'value !== null && qx.theme.manager.Font.getInstance().isDynamic(value)',e = "set",f = ';',g = "resetThemed",h = 'value !== null && value.nodeType === 9 && value.documentElement',j = '===value)return value;',k = 'value !== null && value.$$type === "Mixin"',m = 'return init;',n = 'var init=this.',o = 'value !== null && value.nodeType === 1 && value.attributes',p = "var parent = this.getLayoutParent();",q = "Error in property ",r = 'var a=this._getChildren();if(a)for(var i=0,l=a.length;i<l;i++){',s = "property",t = "();",u = '.validate.call(this, value);',v = 'qx.core.Assert.assertInstance(value, Date, msg) || true',w = 'else{',x = "if (!parent) return;",y = " in method ",z = 'qx.core.Assert.assertInstance(value, Error, msg) || true',A = '=computed;',B = 'Undefined value is not allowed!',C = '(backup);',D = 'else ',E = '=true;',F = 'if(old===undefined)old=this.',G = 'if(computed===inherit){',H = 'old=computed=this.',I = "inherit",J = 'if(this.',K = 'return this.',L = 'else if(this.',M = 'Is invalid!',N = 'if(value===undefined)prop.error(this,2,"',O = '", "',P = 'var computed, old=this.',Q = 'else if(computed===undefined)',R = 'delete this.',S = "resetRuntime",T = "': ",U = " of class ",V = 'value !== null && value.nodeType !== undefined',W = '===undefined)return;',X = 'value !== null && qx.theme.manager.Decoration.getInstance().isValidPropertyValue(value)',Y = "reset",ba = "string",bb = "')){",bc = "module.events",bd = "return this.",be = 'qx.core.Assert.assertPositiveInteger(value, msg) || true',bf = 'else this.',bg = 'value=this.',bh = '","',bi = 'if(init==qx.core.Property.$$inherit)init=null;',bj = "get",bk = 'value !== null && value.$$type === "Interface"',bl = 'var inherit=prop.$$inherit;',bm = "', qx.event.type.Data, [computed, old]",bn = "var value = parent.",bo = "$$useinit_",bp = 'computed=undefined;delete this.',bq = "(value);",br = 'this.',bs = 'Requires exactly one argument!',bt = '",value);',bu = 'computed=value;',bv = '}else{',bw = "$$runtime_",bx = "setThemed",by = ';}',bz = '(value);',bA = "$$user_",bB = '!==undefined)',bC = '){',bD = 'qx.core.Assert.assertArray(value, msg) || true',bE = 'if(computed===undefined||computed===inherit){',bF = ";",bG = 'qx.core.Assert.assertPositiveNumber(value, msg) || true',bH = ".prototype",bI = "Boolean",bJ = ")}",bK = "(a[",bL = '(computed, old, "',bM = "setRuntime",bN = 'return value;',bO = "this.",bP = 'if(init==qx.core.Property.$$inherit)throw new Error("Inheritable property ',bQ = "if(reg.hasListener(this, '",bR = 'Does not allow any arguments!',bS = ')a[i].',bT = "()",bU = "var a=arguments[0] instanceof Array?arguments[0]:arguments;",bV = '.$$properties.',bW = 'value !== null && value.$$type === "Theme"',bX = 'old=this.',bY = "var reg=qx.event.Registration;",ca = "())",cb = '=value;',cc = 'return null;',cd = 'qx.core.Assert.assertObject(value, msg) || true',ce = '");',cf = 'if(old===computed)return value;',cg = 'qx.core.Assert.assertString(value, msg) || true',ch = 'if(old===undefined)old=null;',ci = 'var pa=this.getLayoutParent();if(pa)computed=pa.',cj = "if (value===undefined) value = parent.",ck = 'value !== null && value.$$type === "Class"',cl = 'qx.core.Assert.assertFunction(value, msg) || true',cm = '!==undefined&&',cn = 'var computed, old;',co = 'var backup=computed;',cp = ".",cq = '}',cr = "object",cs = "$$init_",ct = "$$theme_",cu = '!==undefined){',cv = 'if(computed===undefined)computed=null;',cw = "Unknown reason: ",cx = "init",cy = 'qx.core.Assert.assertMap(value, msg) || true',cz = "qx.aspects",cA = 'qx.core.Assert.assertNumber(value, msg) || true',cB = 'if((computed===undefined||computed===inherit)&&',cC = "reg.fireEvent(this, '",cD = 'Null value is not allowed!',cE = 'qx.core.Assert.assertInteger(value, msg) || true',cF = "value",cG = "shorthand",cH = 'computed=this.',cI = 'qx.core.Assert.assertInstance(value, RegExp, msg) || true',cJ = 'value !== null && value.type !== undefined',cK = 'value !== null && value.document',cL = "",cM = 'throw new Error("Property ',cN = "(!this.",cO = 'qx.core.Assert.assertBoolean(value, msg) || true',cP = 'if(a[i].',cQ = ' of an instance of ',cR = "toggle",cS = "refresh",cT = "$$inherit_",cU = 'var prop=qx.core.Property;',cV = "boolean",cW = " with incoming value '",cX = "a=qx.lang.Array.fromShortHand(qx.lang.Array.fromArguments(a));",cY = 'if(computed===undefined||computed==inherit)computed=null;',da = "qx.core.Property",db = "is",dc = ' is not (yet) ready!");',dd = "]);",de = 'Could not change or apply init value after constructing phase!';
  qx.Bootstrap.define(da, {
    statics : {
      __j : function(){

        if(qx.core.Environment.get(bc)){

          qx.event.type.Data;
          qx.event.dispatch.Direct;
        };
      },
      __k : {
        "Boolean" : cO,
        "String" : cg,
        "Number" : cA,
        "Integer" : cE,
        "PositiveNumber" : bG,
        "PositiveInteger" : be,
        "Error" : z,
        "RegExp" : cI,
        "Object" : cd,
        "Array" : bD,
        "Map" : cy,
        "Function" : cl,
        "Date" : v,
        "Node" : V,
        "Element" : o,
        "Document" : h,
        "Window" : cK,
        "Event" : cJ,
        "Class" : ck,
        "Mixin" : k,
        "Interface" : bk,
        "Theme" : bW,
        "Color" : c,
        "Decorator" : X,
        "Font" : d
      },
      __l : {
        "Node" : true,
        "Element" : true,
        "Document" : true,
        "Window" : true,
        "Event" : true
      },
      $$inherit : I,
      $$store : {
        runtime : {
        },
        user : {
        },
        theme : {
        },
        inherit : {
        },
        init : {
        },
        useinit : {
        }
      },
      $$method : {
        get : {
        },
        set : {
        },
        reset : {
        },
        init : {
        },
        refresh : {
        },
        setRuntime : {
        },
        resetRuntime : {
        },
        setThemed : {
        },
        resetThemed : {
        }
      },
      $$allowedKeys : {
        name : ba,
        dereference : cV,
        inheritable : cV,
        nullable : cV,
        themeable : cV,
        refine : cV,
        init : null,
        apply : ba,
        event : ba,
        check : null,
        transform : ba,
        deferredInit : cV,
        validate : null
      },
      $$allowedGroupKeys : {
        name : ba,
        group : cr,
        mode : ba,
        themeable : cV
      },
      $$inheritable : {
      },
      __m : function(dh){

        var df = this.__n(dh);
        if(!df.length){

          var dg = function(){
          };
        } else {

          dg = this.__o(df);
        };
        dh.prototype.$$refreshInheritables = dg;
      },
      __n : function(di){

        var dj = [];
        while(di){

          var dk = di.$$properties;
          if(dk){

            for(var name in this.$$inheritable){

              if(dk[name] && dk[name].inheritable){

                dj.push(name);
              };
            };
          };
          di = di.superclass;
        };
        return dj;
      },
      __o : function(inheritables){

        var inherit = this.$$store.inherit;
        var init = this.$$store.init;
        var refresh = this.$$method.refresh;
        var code = [p, x];
        for(var i = 0,l = inheritables.length;i < l;i++){

          var name = inheritables[i];
          code.push(bn, inherit[name], bF, cj, init[name], bF, bO, refresh[name], bq);
        };
        return new Function(code.join(cL));
      },
      attachRefreshInheritables : function(dl){

        dl.prototype.$$refreshInheritables = function(){

          qx.core.Property.__m(dl);
          return this.$$refreshInheritables();
        };
      },
      attachMethods : function(dn, name, dm){

        dm.group ? this.__p(dn, dm, name) : this.__q(dn, dm, name);
      },
      __p : function(clazz, config, name){

        var upname = qx.Bootstrap.firstUp(name);
        var members = clazz.prototype;
        var themeable = config.themeable === true;
        {
        };
        var setter = [];
        var resetter = [];
        if(themeable){

          var styler = [];
          var unstyler = [];
        };
        var argHandler = bU;
        setter.push(argHandler);
        if(themeable){

          styler.push(argHandler);
        };
        if(config.mode == cG){

          var shorthand = cX;
          setter.push(shorthand);
          if(themeable){

            styler.push(shorthand);
          };
        };
        for(var i = 0,a = config.group,l = a.length;i < l;i++){

          {
          };
          setter.push(bO, this.$$method.set[a[i]], bK, i, dd);
          resetter.push(bO, this.$$method.reset[a[i]], t);
          if(themeable){

            {
            };
            styler.push(bO, this.$$method.setThemed[a[i]], bK, i, dd);
            unstyler.push(bO, this.$$method.resetThemed[a[i]], t);
          };
        };
        this.$$method.set[name] = e + upname;
        members[this.$$method.set[name]] = new Function(setter.join(cL));
        this.$$method.reset[name] = Y + upname;
        members[this.$$method.reset[name]] = new Function(resetter.join(cL));
        if(themeable){

          this.$$method.setThemed[name] = bx + upname;
          members[this.$$method.setThemed[name]] = new Function(styler.join(cL));
          this.$$method.resetThemed[name] = g + upname;
          members[this.$$method.resetThemed[name]] = new Function(unstyler.join(cL));
        };
      },
      __q : function(clazz, config, name){

        var upname = qx.Bootstrap.firstUp(name);
        var members = clazz.prototype;
        {
        };
        if(config.dereference === undefined && typeof config.check === ba){

          config.dereference = this.__r(config.check);
        };
        var method = this.$$method;
        var store = this.$$store;
        store.runtime[name] = bw + name;
        store.user[name] = bA + name;
        store.theme[name] = ct + name;
        store.init[name] = cs + name;
        store.inherit[name] = cT + name;
        store.useinit[name] = bo + name;
        method.get[name] = bj + upname;
        members[method.get[name]] = function(){

          return qx.core.Property.executeOptimizedGetter(this, clazz, name, bj);
        };
        method.set[name] = e + upname;
        members[method.set[name]] = function(dp){

          return qx.core.Property.executeOptimizedSetter(this, clazz, name, e, arguments);
        };
        method.reset[name] = Y + upname;
        members[method.reset[name]] = function(){

          return qx.core.Property.executeOptimizedSetter(this, clazz, name, Y);
        };
        if(config.inheritable || config.apply || config.event || config.deferredInit){

          method.init[name] = cx + upname;
          members[method.init[name]] = function(dq){

            return qx.core.Property.executeOptimizedSetter(this, clazz, name, cx, arguments);
          };
          {
          };
        };
        if(config.inheritable){

          method.refresh[name] = cS + upname;
          members[method.refresh[name]] = function(dr){

            return qx.core.Property.executeOptimizedSetter(this, clazz, name, cS, arguments);
          };
          {
          };
        };
        method.setRuntime[name] = bM + upname;
        members[method.setRuntime[name]] = function(ds){

          return qx.core.Property.executeOptimizedSetter(this, clazz, name, bM, arguments);
        };
        method.resetRuntime[name] = S + upname;
        members[method.resetRuntime[name]] = function(){

          return qx.core.Property.executeOptimizedSetter(this, clazz, name, S);
        };
        if(config.themeable){

          method.setThemed[name] = bx + upname;
          members[method.setThemed[name]] = function(dt){

            return qx.core.Property.executeOptimizedSetter(this, clazz, name, bx, arguments);
          };
          method.resetThemed[name] = g + upname;
          members[method.resetThemed[name]] = function(){

            return qx.core.Property.executeOptimizedSetter(this, clazz, name, g);
          };
          {
          };
        };
        if(config.check === bI){

          members[cR + upname] = new Function(bd + method.set[name] + cN + method.get[name] + ca);
          members[db + upname] = new Function(bd + method.get[name] + bT);
          {
          };
        };
        {
        };
      },
      __r : function(du){

        return !!this.__l[du];
      },
      __s : {
        '0' : de,
        '1' : bs,
        '2' : B,
        '3' : bR,
        '4' : cD,
        '5' : M
      },
      error : function(dv, dB, dA, dw, dx){

        var dy = dv.constructor.classname;
        var dz = q + dA + U + dy + y + this.$$method[dw][dA] + cW + dx + T;
        throw new Error(dz + (this.__s[dB] || cw + dB));
      },
      __t : function(instance, members, name, variant, code, args){

        var store = this.$$method[variant][name];
        {

          members[store] = new Function(cF, code.join(cL));
        };
        if(qx.core.Environment.get(cz)){

          members[store] = qx.core.Aspect.wrap(instance.classname + cp + store, members[store], s);
        };
        qx.Bootstrap.setDisplayName(members[store], instance.classname + bH, store);
        if(args === undefined){

          return instance[store]();
        } else {

          return instance[store](args[0]);
        };
      },
      executeOptimizedGetter : function(dF, dE, name, dD){

        var dH = dE.$$properties[name];
        var dG = dE.prototype;
        var dC = [];
        var dI = this.$$store;
        dC.push(J, dI.runtime[name], bB);
        dC.push(K, dI.runtime[name], f);
        if(dH.inheritable){

          dC.push(L, dI.inherit[name], bB);
          dC.push(K, dI.inherit[name], f);
          dC.push(D);
        };
        dC.push(J, dI.user[name], bB);
        dC.push(K, dI.user[name], f);
        if(dH.themeable){

          dC.push(L, dI.theme[name], bB);
          dC.push(K, dI.theme[name], f);
        };
        if(dH.deferredInit && dH.init === undefined){

          dC.push(L, dI.init[name], bB);
          dC.push(K, dI.init[name], f);
        };
        dC.push(D);
        if(dH.init !== undefined){

          if(dH.inheritable){

            dC.push(n, dI.init[name], f);
            if(dH.nullable){

              dC.push(bi);
            } else if(dH.init !== undefined){

              dC.push(K, dI.init[name], f);
            } else {

              dC.push(bP, name, cQ, dE.classname, dc);
            };
            dC.push(m);
          } else {

            dC.push(K, dI.init[name], f);
          };
        } else if(dH.inheritable || dH.nullable){

          dC.push(cc);
        } else {

          dC.push(cM, name, cQ, dE.classname, dc);
        };
        return this.__t(dF, dG, name, dD, dC);
      },
      executeOptimizedSetter : function(dP, dO, name, dN, dM){

        var dR = dO.$$properties[name];
        var dQ = dO.prototype;
        var dK = [];
        var dJ = dN === e || dN === bx || dN === bM || (dN === cx && dR.init === undefined);
        var dL = dR.apply || dR.event || dR.inheritable;
        var dS = this.__u(dN, name);
        this.__v(dK, dR, name, dN, dJ);
        if(dJ){

          this.__w(dK, dO, dR, name);
        };
        if(dL){

          this.__x(dK, dJ, dS, dN);
        };
        if(dR.inheritable){

          dK.push(bl);
        };
        {
        };
        if(!dL){

          this.__z(dK, name, dN, dJ);
        } else {

          this.__A(dK, dR, name, dN, dJ);
        };
        if(dR.inheritable){

          this.__B(dK, dR, name, dN);
        } else if(dL){

          this.__C(dK, dR, name, dN);
        };
        if(dL){

          this.__D(dK, dR, name, dN);
          if(dR.inheritable && dQ._getChildren){

            this.__E(dK, name);
          };
        };
        if(dJ){

          dK.push(bN);
        };
        return this.__t(dP, dQ, name, dN, dK, dM);
      },
      __u : function(dT, name){

        if(dT === bM || dT === S){

          var dU = this.$$store.runtime[name];
        } else if(dT === bx || dT === g){

          dU = this.$$store.theme[name];
        } else if(dT === cx){

          dU = this.$$store.init[name];
        } else {

          dU = this.$$store.user[name];
        };;
        return dU;
      },
      __v : function(dX, dV, name, dY, dW){

        {

          if(!dV.nullable || dV.check || dV.inheritable){

            dX.push(cU);
          };
          if(dY === e){

            dX.push(N, name, bh, dY, bt);
          };
        };
      },
      __w : function(ea, ec, eb, name){

        if(eb.transform){

          ea.push(bg, eb.transform, bz);
        };
        if(eb.validate){

          if(typeof eb.validate === ba){

            ea.push(br, eb.validate, bz);
          } else if(eb.validate instanceof Function){

            ea.push(ec.classname, bV, name);
            ea.push(u);
          };
        };
      },
      __x : function(ee, ed, eg, ef){

        var eh = (ef === Y || ef === g || ef === S);
        if(ed){

          ee.push(J, eg, j);
        } else if(eh){

          ee.push(J, eg, W);
        };
      },
      __y : undefined,
      __z : function(ej, name, ek, ei){

        if(ek === bM){

          ej.push(br, this.$$store.runtime[name], cb);
        } else if(ek === S){

          ej.push(J, this.$$store.runtime[name], bB);
          ej.push(R, this.$$store.runtime[name], f);
        } else if(ek === e){

          ej.push(br, this.$$store.user[name], cb);
        } else if(ek === Y){

          ej.push(J, this.$$store.user[name], bB);
          ej.push(R, this.$$store.user[name], f);
        } else if(ek === bx){

          ej.push(br, this.$$store.theme[name], cb);
        } else if(ek === g){

          ej.push(J, this.$$store.theme[name], bB);
          ej.push(R, this.$$store.theme[name], f);
        } else if(ek === cx && ei){

          ej.push(br, this.$$store.init[name], cb);
        };;;;;;
      },
      __A : function(en, el, name, eo, em){

        if(el.inheritable){

          en.push(P, this.$$store.inherit[name], f);
        } else {

          en.push(cn);
        };
        en.push(J, this.$$store.runtime[name], cu);
        if(eo === bM){

          en.push(cH, this.$$store.runtime[name], cb);
        } else if(eo === S){

          en.push(R, this.$$store.runtime[name], f);
          en.push(J, this.$$store.user[name], bB);
          en.push(cH, this.$$store.user[name], f);
          en.push(L, this.$$store.theme[name], bB);
          en.push(cH, this.$$store.theme[name], f);
          en.push(L, this.$$store.init[name], cu);
          en.push(cH, this.$$store.init[name], f);
          en.push(br, this.$$store.useinit[name], E);
          en.push(cq);
        } else {

          en.push(H, this.$$store.runtime[name], f);
          if(eo === e){

            en.push(br, this.$$store.user[name], cb);
          } else if(eo === Y){

            en.push(R, this.$$store.user[name], f);
          } else if(eo === bx){

            en.push(br, this.$$store.theme[name], cb);
          } else if(eo === g){

            en.push(R, this.$$store.theme[name], f);
          } else if(eo === cx && em){

            en.push(br, this.$$store.init[name], cb);
          };;;;
        };
        en.push(cq);
        en.push(L, this.$$store.user[name], cu);
        if(eo === e){

          if(!el.inheritable){

            en.push(bX, this.$$store.user[name], f);
          };
          en.push(cH, this.$$store.user[name], cb);
        } else if(eo === Y){

          if(!el.inheritable){

            en.push(bX, this.$$store.user[name], f);
          };
          en.push(R, this.$$store.user[name], f);
          en.push(J, this.$$store.runtime[name], bB);
          en.push(cH, this.$$store.runtime[name], f);
          en.push(J, this.$$store.theme[name], bB);
          en.push(cH, this.$$store.theme[name], f);
          en.push(L, this.$$store.init[name], cu);
          en.push(cH, this.$$store.init[name], f);
          en.push(br, this.$$store.useinit[name], E);
          en.push(cq);
        } else {

          if(eo === bM){

            en.push(cH, this.$$store.runtime[name], cb);
          } else if(el.inheritable){

            en.push(cH, this.$$store.user[name], f);
          } else {

            en.push(H, this.$$store.user[name], f);
          };
          if(eo === bx){

            en.push(br, this.$$store.theme[name], cb);
          } else if(eo === g){

            en.push(R, this.$$store.theme[name], f);
          } else if(eo === cx && em){

            en.push(br, this.$$store.init[name], cb);
          };;
        };
        en.push(cq);
        if(el.themeable){

          en.push(L, this.$$store.theme[name], cu);
          if(!el.inheritable){

            en.push(bX, this.$$store.theme[name], f);
          };
          if(eo === bM){

            en.push(cH, this.$$store.runtime[name], cb);
          } else if(eo === e){

            en.push(cH, this.$$store.user[name], cb);
          } else if(eo === bx){

            en.push(cH, this.$$store.theme[name], cb);
          } else if(eo === g){

            en.push(R, this.$$store.theme[name], f);
            en.push(J, this.$$store.init[name], cu);
            en.push(cH, this.$$store.init[name], f);
            en.push(br, this.$$store.useinit[name], E);
            en.push(cq);
          } else if(eo === cx){

            if(em){

              en.push(br, this.$$store.init[name], cb);
            };
            en.push(cH, this.$$store.theme[name], f);
          } else if(eo === cS){

            en.push(cH, this.$$store.theme[name], f);
          };;;;;
          en.push(cq);
        };
        en.push(L, this.$$store.useinit[name], bC);
        if(!el.inheritable){

          en.push(bX, this.$$store.init[name], f);
        };
        if(eo === cx){

          if(em){

            en.push(cH, this.$$store.init[name], cb);
          } else {

            en.push(cH, this.$$store.init[name], f);
          };
        } else if(eo === e || eo === bM || eo === bx || eo === cS){

          en.push(R, this.$$store.useinit[name], f);
          if(eo === bM){

            en.push(cH, this.$$store.runtime[name], cb);
          } else if(eo === e){

            en.push(cH, this.$$store.user[name], cb);
          } else if(eo === bx){

            en.push(cH, this.$$store.theme[name], cb);
          } else if(eo === cS){

            en.push(cH, this.$$store.init[name], f);
          };;;
        };
        en.push(cq);
        if(eo === e || eo === bM || eo === bx || eo === cx){

          en.push(w);
          if(eo === bM){

            en.push(cH, this.$$store.runtime[name], cb);
          } else if(eo === e){

            en.push(cH, this.$$store.user[name], cb);
          } else if(eo === bx){

            en.push(cH, this.$$store.theme[name], cb);
          } else if(eo === cx){

            if(em){

              en.push(cH, this.$$store.init[name], cb);
            } else {

              en.push(cH, this.$$store.init[name], f);
            };
            en.push(br, this.$$store.useinit[name], E);
          };;;
          en.push(cq);
        };
      },
      __B : function(eq, ep, name, er){

        eq.push(bE);
        if(er === cS){

          eq.push(bu);
        } else {

          eq.push(ci, this.$$store.inherit[name], f);
        };
        eq.push(cB);
        eq.push(br, this.$$store.init[name], cm);
        eq.push(br, this.$$store.init[name], b);
        eq.push(cH, this.$$store.init[name], f);
        eq.push(br, this.$$store.useinit[name], E);
        eq.push(bv);
        eq.push(R, this.$$store.useinit[name], by);
        eq.push(cq);
        eq.push(cf);
        eq.push(G);
        eq.push(bp, this.$$store.inherit[name], f);
        eq.push(cq);
        eq.push(Q);
        eq.push(R, this.$$store.inherit[name], f);
        eq.push(bf, this.$$store.inherit[name], A);
        eq.push(co);
        if(ep.init !== undefined && er !== cx){

          eq.push(F, this.$$store.init[name], bF);
        } else {

          eq.push(ch);
        };
        eq.push(cY);
      },
      __C : function(et, es, name, eu){

        if(eu !== e && eu !== bM && eu !== bx){

          et.push(cv);
        };
        et.push(cf);
        if(es.init !== undefined && eu !== cx){

          et.push(F, this.$$store.init[name], bF);
        } else {

          et.push(ch);
        };
      },
      __D : function(ew, ev, name, ex){

        if(ev.apply){

          ew.push(br, ev.apply, bL, name, O, ex, ce);
        };
        if(ev.event){

          ew.push(bY, bQ, ev.event, bb, cC, ev.event, bm, bJ);
        };
      },
      __E : function(ey, name){

        ey.push(r);
        ey.push(cP, this.$$method.refresh[name], bS, this.$$method.refresh[name], C);
        ey.push(cq);
      }
    }
  });
})();
(function(){

  var a = "qx.data.MBinding";
  qx.Mixin.define(a, {
    construct : function(){

      this.__F = this.toHashCode();
    },
    members : {
      __F : null,
      bind : function(b, e, c, d){

        return qx.data.SingleValueBinding.bind(this, b, e, c, d);
      },
      removeBinding : function(f){

        qx.data.SingleValueBinding.removeBindingFromObject(this, f);
      },
      removeRelatedBindings : function(g){

        qx.data.SingleValueBinding.removeRelatedBindings(this, g);
      },
      removeAllBindings : function(){

        qx.data.SingleValueBinding.removeAllBindingsForObject(this);
      },
      getBindings : function(){

        return qx.data.SingleValueBinding.getAllBindingsForObject(this);
      }
    },
    destruct : function(){

      this.$$hash = this.__F;
      this.removeAllBindings();
      delete this.$$hash;
    }
  });
})();
(function(){

  var a = "qx.core.Aspect",b = "before",c = "*",d = "static";
  qx.Bootstrap.define(a, {
    statics : {
      __G : [],
      wrap : function(h, l, j){

        var m = [];
        var e = [];
        var k = this.__G;
        var g;
        for(var i = 0;i < k.length;i++){

          g = k[i];
          if((g.type == null || j == g.type || g.type == c) && (g.name == null || h.match(g.name))){

            g.pos == -1 ? m.push(g.fcn) : e.push(g.fcn);
          };
        };
        if(m.length === 0 && e.length === 0){

          return l;
        };
        var f = function(){

          for(var i = 0;i < m.length;i++){

            m[i].call(this, h, l, j, arguments);
          };
          var n = l.apply(this, arguments);
          for(var i = 0;i < e.length;i++){

            e[i].call(this, h, l, j, arguments, n);
          };
          return n;
        };
        if(j !== d){

          f.self = l.self;
          f.base = l.base;
        };
        l.wrapper = f;
        f.original = l;
        return f;
      },
      addAdvice : function(q, o, p, name){

        this.__G.push({
          fcn : q,
          pos : o === b ? -1 : 1,
          type : p,
          name : name
        });
      }
    }
  });
})();
(function(){

  var a = 'Implementation of method "',b = '"',c = "function",d = '" is not supported by Class "',e = "Boolean",f = "qx.Interface",g = 'The event "',h = '" required by interface "',j = '" is missing in class "',k = '"!',m = 'The property "',n = "Interface",o = "toggle",p = "]",q = "[Interface ",r = "is",s = "Array",t = 'Implementation of member "';
  qx.Bootstrap.define(f, {
    statics : {
      define : function(name, v){

        if(v){

          if(v.extend && !(qx.Bootstrap.getClass(v.extend) === s)){

            v.extend = [v.extend];
          };
          {
          };
          var u = v.statics ? v.statics : {
          };
          if(v.extend){

            u.$$extends = v.extend;
          };
          if(v.properties){

            u.$$properties = v.properties;
          };
          if(v.members){

            u.$$members = v.members;
          };
          if(v.events){

            u.$$events = v.events;
          };
        } else {

          var u = {
          };
        };
        u.$$type = n;
        u.name = name;
        u.toString = this.genericToString;
        u.basename = qx.Bootstrap.createNamespace(name, u);
        qx.Interface.$$registry[name] = u;
        return u;
      },
      getByName : function(name){

        return this.$$registry[name];
      },
      isDefined : function(name){

        return this.getByName(name) !== undefined;
      },
      getTotalNumber : function(){

        return qx.Bootstrap.objectGetLength(this.$$registry);
      },
      flatten : function(x){

        if(!x){

          return [];
        };
        var w = x.concat();
        for(var i = 0,l = x.length;i < l;i++){

          if(x[i].$$extends){

            w.push.apply(w, this.flatten(x[i].$$extends));
          };
        };
        return w;
      },
      __H : function(B, C, y, F, D){

        var z = y.$$members;
        if(z){

          for(var E in z){

            if(qx.Bootstrap.isFunction(z[E])){

              var H = this.__I(C, E);
              var A = H || qx.Bootstrap.isFunction(B[E]);
              if(!A){

                if(D){

                  throw new Error(a + E + j + C.classname + h + y.name + b);
                } else {

                  return false;
                };
              };
              var G = F === true && !H && !qx.util.OOUtil.hasInterface(C, y);
              if(G){

                B[E] = this.__L(y, B[E], E, z[E]);
              };
            } else {

              if(typeof B[E] === undefined){

                if(typeof B[E] !== c){

                  if(D){

                    throw new Error(t + E + j + C.classname + h + y.name + b);
                  } else {

                    return false;
                  };
                };
              };
            };
          };
        };
        if(!D){

          return true;
        };
      },
      __I : function(L, I){

        var N = I.match(/^(is|toggle|get|set|reset)(.*)$/);
        if(!N){

          return false;
        };
        var K = qx.Bootstrap.firstLow(N[2]);
        var M = qx.util.OOUtil.getPropertyDefinition(L, K);
        if(!M){

          return false;
        };
        var J = N[0] == r || N[0] == o;
        if(J){

          return qx.util.OOUtil.getPropertyDefinition(L, K).check == e;
        };
        return true;
      },
      __J : function(R, O, P){

        if(O.$$properties){

          for(var Q in O.$$properties){

            if(!qx.util.OOUtil.getPropertyDefinition(R, Q)){

              if(P){

                throw new Error(m + Q + d + R.classname + k);
              } else {

                return false;
              };
            };
          };
        };
        if(!P){

          return true;
        };
      },
      __K : function(V, S, T){

        if(S.$$events){

          for(var U in S.$$events){

            if(!qx.util.OOUtil.supportsEvent(V, U)){

              if(T){

                throw new Error(g + U + d + V.classname + k);
              } else {

                return false;
              };
            };
          };
        };
        if(!T){

          return true;
        };
      },
      assertObject : function(Y, W){

        var ba = Y.constructor;
        this.__H(Y, ba, W, false, true);
        this.__J(ba, W, true);
        this.__K(ba, W, true);
        var X = W.$$extends;
        if(X){

          for(var i = 0,l = X.length;i < l;i++){

            this.assertObject(Y, X[i]);
          };
        };
      },
      assert : function(bd, bb, be){

        this.__H(bd.prototype, bd, bb, be, true);
        this.__J(bd, bb, true);
        this.__K(bd, bb, true);
        var bc = bb.$$extends;
        if(bc){

          for(var i = 0,l = bc.length;i < l;i++){

            this.assert(bd, bc[i], be);
          };
        };
      },
      objectImplements : function(bh, bf){

        var bi = bh.constructor;
        if(!this.__H(bh, bi, bf) || !this.__J(bi, bf) || !this.__K(bi, bf)){

          return false;
        };
        var bg = bf.$$extends;
        if(bg){

          for(var i = 0,l = bg.length;i < l;i++){

            if(!this.objectImplements(bh, bg[i])){

              return false;
            };
          };
        };
        return true;
      },
      classImplements : function(bl, bj){

        if(!this.__H(bl.prototype, bl, bj) || !this.__J(bl, bj) || !this.__K(bl, bj)){

          return false;
        };
        var bk = bj.$$extends;
        if(bk){

          for(var i = 0,l = bk.length;i < l;i++){

            if(!this.has(bl, bk[i])){

              return false;
            };
          };
        };
        return true;
      },
      genericToString : function(){

        return q + this.name + p;
      },
      $$registry : {
      },
      __L : function(bo, bn, bp, bm){
      },
      __h : null,
      __i : function(name, bq){
      }
    }
  });
})();
(function(){

  var b = ".prototype",c = "$$init_",d = "constructor",e = "Property module disabled.",f = "extend",g = "module.property",h = "singleton",j = "qx.event.type.Data",k = "module.events",m = "qx.aspects",n = "toString",o = 'extend',p = "Array",q = "static",r = "",s = "Events module not enabled.",t = "]",u = "Class",v = "qx.Class",w = '"extend" parameter is null or undefined',x = "[Class ",y = "destructor",z = "destruct",A = ".",B = "member";
  qx.Bootstrap.define(v, {
    statics : {
      __M : qx.core.Environment.get(g) ? qx.core.Property : null,
      define : function(name, F){

        if(!F){

          F = {
          };
        };
        if(F.include && !(qx.Bootstrap.getClass(F.include) === p)){

          F.include = [F.include];
        };
        if(F.implement && !(qx.Bootstrap.getClass(F.implement) === p)){

          F.implement = [F.implement];
        };
        var C = false;
        if(!F.hasOwnProperty(f) && !F.type){

          F.type = q;
          C = true;
        };
        {
        };
        var D = this.__P(name, F.type, F.extend, F.statics, F.construct, F.destruct, F.include);
        if(F.extend){

          if(F.properties){

            this.__R(D, F.properties, true);
          };
          if(F.members){

            this.__T(D, F.members, true, true, false);
          };
          if(F.events){

            this.__Q(D, F.events, true);
          };
          if(F.include){

            for(var i = 0,l = F.include.length;i < l;i++){

              this.__X(D, F.include[i], false);
            };
          };
        } else if(F.hasOwnProperty(o) && false){

          throw new Error(w);
        };
        if(F.environment){

          for(var E in F.environment){

            qx.core.Environment.add(E, F.environment[E]);
          };
        };
        if(F.implement){

          for(var i = 0,l = F.implement.length;i < l;i++){

            this.__V(D, F.implement[i]);
          };
        };
        {
        };
        if(F.defer){

          F.defer.self = D;
          F.defer(D, D.prototype, {
            add : function(name, G){

              var H = {
              };
              H[name] = G;
              qx.Class.__R(D, H, true);
            }
          });
        };
        return D;
      },
      undefine : function(name){

        delete this.$$registry[name];
        var K = name.split(A);
        var J = [window];
        for(var i = 0;i < K.length;i++){

          J.push(J[i][K[i]]);
        };
        for(var i = J.length - 1;i >= 1;i--){

          var I = J[i];
          var parent = J[i - 1];
          if(qx.Bootstrap.isFunction(I) || qx.Bootstrap.objectGetLength(I) === 0){

            delete parent[K[i - 1]];
          } else {

            break;
          };
        };
      },
      isDefined : qx.util.OOUtil.classIsDefined,
      getTotalNumber : function(){

        return qx.Bootstrap.objectGetLength(this.$$registry);
      },
      getByName : qx.Bootstrap.getByName,
      include : function(M, L){

        {
        };
        qx.Class.__X(M, L, false);
      },
      patch : function(O, N){

        {
        };
        qx.Class.__X(O, N, true);
      },
      isSubClassOf : function(Q, P){

        if(!Q){

          return false;
        };
        if(Q == P){

          return true;
        };
        if(Q.prototype instanceof P){

          return true;
        };
        return false;
      },
      getPropertyDefinition : qx.util.OOUtil.getPropertyDefinition,
      getProperties : function(S){

        var R = [];
        while(S){

          if(S.$$properties){

            R.push.apply(R, Object.keys(S.$$properties));
          };
          S = S.superclass;
        };
        return R;
      },
      getByProperty : function(T, name){

        while(T){

          if(T.$$properties && T.$$properties[name]){

            return T;
          };
          T = T.superclass;
        };
        return null;
      },
      hasProperty : qx.util.OOUtil.hasProperty,
      getEventType : qx.util.OOUtil.getEventType,
      supportsEvent : qx.util.OOUtil.supportsEvent,
      hasOwnMixin : function(V, U){

        return V.$$includes && V.$$includes.indexOf(U) !== -1;
      },
      getByMixin : function(Y, X){

        var W,i,l;
        while(Y){

          if(Y.$$includes){

            W = Y.$$flatIncludes;
            for(i = 0,l = W.length;i < l;i++){

              if(W[i] === X){

                return Y;
              };
            };
          };
          Y = Y.superclass;
        };
        return null;
      },
      getMixins : qx.util.OOUtil.getMixins,
      hasMixin : function(bb, ba){

        return !!this.getByMixin(bb, ba);
      },
      hasOwnInterface : function(bd, bc){

        return bd.$$implements && bd.$$implements.indexOf(bc) !== -1;
      },
      getByInterface : qx.util.OOUtil.getByInterface,
      getInterfaces : function(bf){

        var be = [];
        while(bf){

          if(bf.$$implements){

            be.push.apply(be, bf.$$flatImplements);
          };
          bf = bf.superclass;
        };
        return be;
      },
      hasInterface : qx.util.OOUtil.hasInterface,
      implementsInterface : function(bh, bg){

        var bi = bh.constructor;
        if(this.hasInterface(bi, bg)){

          return true;
        };
        if(qx.Interface.objectImplements(bh, bg)){

          return true;
        };
        if(qx.Interface.classImplements(bi, bg)){

          return true;
        };
        return false;
      },
      getInstance : function(){

        if(!this.$$instance){

          this.$$allowconstruct = true;
          this.$$instance = new this();
          delete this.$$allowconstruct;
        };
        return this.$$instance;
      },
      genericToString : function(){

        return x + this.classname + t;
      },
      $$registry : qx.Bootstrap.$$registry,
      __h : null,
      __N : null,
      __i : function(name, bj){
      },
      __O : function(bk){
      },
      __P : function(name, bu, bt, bl, br, bp, bo){

        var bq;
        if(!bt && qx.core.Environment.get(m) == false){

          bq = bl || {
          };
          qx.Bootstrap.setDisplayNames(bq, name);
        } else {

          bq = {
          };
          if(bt){

            if(!br){

              br = this.__Y();
            };
            if(this.__ba(bt, bo)){

              bq = this.__bb(br, name, bu);
            } else {

              bq = br;
            };
            if(bu === h){

              bq.getInstance = this.getInstance;
            };
            qx.Bootstrap.setDisplayName(br, name, d);
          };
          if(bl){

            qx.Bootstrap.setDisplayNames(bl, name);
            var bs;
            for(var i = 0,a = Object.keys(bl),l = a.length;i < l;i++){

              bs = a[i];
              var bm = bl[bs];
              if(qx.core.Environment.get(m)){

                if(bm instanceof Function){

                  bm = qx.core.Aspect.wrap(name + A + bs, bm, q);
                };
                bq[bs] = bm;
              } else {

                bq[bs] = bm;
              };
            };
          };
        };
        var bn = name ? qx.Bootstrap.createNamespace(name, bq) : r;
        bq.name = bq.classname = name;
        bq.basename = bn;
        bq.$$type = u;
        if(bu){

          bq.$$classtype = bu;
        };
        if(!bq.hasOwnProperty(n)){

          bq.toString = this.genericToString;
        };
        if(bt){

          qx.Bootstrap.extendClass(bq, br, bt, name, bn);
          if(bp){

            if(qx.core.Environment.get(m)){

              bp = qx.core.Aspect.wrap(name, bp, y);
            };
            bq.$$destructor = bp;
            qx.Bootstrap.setDisplayName(bp, name, z);
          };
        };
        this.$$registry[name] = bq;
        return bq;
      },
      __Q : function(bv, bw, by){

        {

          var bx,bx;
        };
        if(bv.$$events){

          for(var bx in bw){

            bv.$$events[bx] = bw[bx];
          };
        } else {

          bv.$$events = bw;
        };
      },
      __R : function(bA, bD, bB){

        if(!qx.core.Environment.get(g)){

          throw new Error(e);
        };
        var bC;
        if(bB === undefined){

          bB = false;
        };
        var bz = bA.prototype;
        for(var name in bD){

          bC = bD[name];
          {
          };
          bC.name = name;
          if(!bC.refine){

            if(bA.$$properties === undefined){

              bA.$$properties = {
              };
            };
            bA.$$properties[name] = bC;
          };
          if(bC.init !== undefined){

            bA.prototype[c + name] = bC.init;
          };
          if(bC.event !== undefined){

            if(!qx.core.Environment.get(k)){

              throw new Error(s);
            };
            var event = {
            };
            event[bC.event] = j;
            this.__Q(bA, event, bB);
          };
          if(bC.inheritable){

            this.__M.$$inheritable[name] = true;
            if(!bz.$$refreshInheritables){

              this.__M.attachRefreshInheritables(bA);
            };
          };
          if(!bC.refine){

            this.__M.attachMethods(bA, name, bC);
          };
        };
      },
      __S : null,
      __T : function(bL, bE, bG, bI, bK){

        var bF = bL.prototype;
        var bJ,bH;
        qx.Bootstrap.setDisplayNames(bE, bL.classname + b);
        for(var i = 0,a = Object.keys(bE),l = a.length;i < l;i++){

          bJ = a[i];
          bH = bE[bJ];
          {
          };
          if(bI !== false && bH instanceof Function && bH.$$type == null){

            if(bK == true){

              bH = this.__U(bH, bF[bJ]);
            } else {

              if(bF[bJ]){

                bH.base = bF[bJ];
              };
              bH.self = bL;
            };
            if(qx.core.Environment.get(m)){

              bH = qx.core.Aspect.wrap(bL.classname + A + bJ, bH, B);
            };
          };
          bF[bJ] = bH;
        };
      },
      __U : function(bM, bN){

        if(bN){

          return function(){

            var bP = bM.base;
            bM.base = bN;
            var bO = bM.apply(this, arguments);
            bM.base = bP;
            return bO;
          };
        } else {

          return bM;
        };
      },
      __V : function(bS, bQ){

        {
        };
        var bR = qx.Interface.flatten([bQ]);
        if(bS.$$implements){

          bS.$$implements.push(bQ);
          bS.$$flatImplements.push.apply(bS.$$flatImplements, bR);
        } else {

          bS.$$implements = [bQ];
          bS.$$flatImplements = bR;
        };
      },
      __W : function(bU){

        var name = bU.classname;
        var bT = this.__bb(bU, name, bU.$$classtype);
        for(var i = 0,a = Object.keys(bU),l = a.length;i < l;i++){

          bV = a[i];
          bT[bV] = bU[bV];
        };
        bT.prototype = bU.prototype;
        var bX = bU.prototype;
        for(var i = 0,a = Object.keys(bX),l = a.length;i < l;i++){

          bV = a[i];
          var bY = bX[bV];
          if(bY && bY.self == bU){

            bY.self = bT;
          };
        };
        for(var bV in this.$$registry){

          var bW = this.$$registry[bV];
          if(!bW){

            continue;
          };
          if(bW.base == bU){

            bW.base = bT;
          };
          if(bW.superclass == bU){

            bW.superclass = bT;
          };
          if(bW.$$original){

            if(bW.$$original.base == bU){

              bW.$$original.base = bT;
            };
            if(bW.$$original.superclass == bU){

              bW.$$original.superclass = bT;
            };
          };
        };
        qx.Bootstrap.createNamespace(name, bT);
        this.$$registry[name] = bT;
        return bT;
      },
      __X : function(cf, cd, cc){

        {
        };
        if(this.hasMixin(cf, cd)){

          return;
        };
        var ca = cf.$$original;
        if(cd.$$constructor && !ca){

          cf = this.__W(cf);
        };
        var cb = qx.Mixin.flatten([cd]);
        var ce;
        for(var i = 0,l = cb.length;i < l;i++){

          ce = cb[i];
          if(ce.$$events){

            this.__Q(cf, ce.$$events, cc);
          };
          if(ce.$$properties){

            this.__R(cf, ce.$$properties, cc);
          };
          if(ce.$$members){

            this.__T(cf, ce.$$members, cc, cc, cc);
          };
        };
        if(cf.$$includes){

          cf.$$includes.push(cd);
          cf.$$flatIncludes.push.apply(cf.$$flatIncludes, cb);
        } else {

          cf.$$includes = [cd];
          cf.$$flatIncludes = cb;
        };
      },
      __Y : function(){

        function cg(){

          cg.base.apply(this, arguments);
        };
        return cg;
      },
      __ba : function(ci, ch){

        {
        };
        if(ci && ci.$$includes){

          var cj = ci.$$flatIncludes;
          for(var i = 0,l = cj.length;i < l;i++){

            if(cj[i].$$constructor){

              return true;
            };
          };
        };
        if(ch){

          var ck = qx.Mixin.flatten(ch);
          for(var i = 0,l = ck.length;i < l;i++){

            if(ck[i].$$constructor){

              return true;
            };
          };
        };
        return false;
      },
      __bb : function(cm, name, cl){

        var co = function(){

          var cr = co;
          {
          };
          var cp = cr.$$original.apply(this, arguments);
          if(cr.$$includes){

            var cq = cr.$$flatIncludes;
            for(var i = 0,l = cq.length;i < l;i++){

              if(cq[i].$$constructor){

                cq[i].$$constructor.apply(this, arguments);
              };
            };
          };
          {
          };
          return cp;
        };
        if(qx.core.Environment.get(m)){

          var cn = qx.core.Aspect.wrap(name, co, d);
          co.$$original = cm;
          co.constructor = cn;
          co = cn;
        };
        co.$$original = cm;
        cm.wrapper = co;
        return co;
      }
    },
    defer : function(){

      if(qx.core.Environment.get(m)){

        for(var cs in qx.Bootstrap.$$registry){

          var ct = qx.Bootstrap.$$registry[cs];
          for(var cu in ct){

            if(ct[cu] instanceof Function){

              ct[cu] = qx.core.Aspect.wrap(cs + A + cu, ct[cu], q);
            };
          };
        };
      };
    }
  });
})();
(function(){

  var a = ". Error message: ",b = "Boolean",c = ").",d = "set",f = "deepBinding",g = ") to the object '",h = "item",k = "Please use only one array at a time: ",l = "Integer",m = "reset",n = " of object ",p = "qx.data.SingleValueBinding",q = "Binding property ",r = "Failed so set value ",s = "change",t = "Binding could not be found!",u = "get",v = "^",w = " does not work.",x = "String",y = "Binding from '",z = "",A = "PositiveNumber",B = "]",C = "[",D = ".",E = "PositiveInteger",F = 'No number or \'last\' value hast been given in an array binding: ',G = "' (",H = " on ",I = "Binding does not exist!",J = "Number",K = ".[",L = "Date",M = " not possible: No event available. ",N = "last";
  qx.Class.define(p, {
    statics : {
      __bc : {
      },
      __bd : {
      },
      bind : function(R, bf, bd, T, bc){

        {
        };
        var bg = this.__bf(R, bf, bd, T, bc);
        var V = bf.split(D);
        var Q = this.__bn(V);
        var ba = [];
        var U = [];
        var W = [];
        var bb = [];
        var S = R;
        try{

          for(var i = 0;i < V.length;i++){

            if(Q[i] !== z){

              bb.push(s);
            } else {

              bb.push(this.__bg(S, V[i]));
            };
            ba[i] = S;
            if(i == V.length - 1){

              if(Q[i] !== z){

                var bi = Q[i] === N ? S.length - 1 : Q[i];
                var P = S.getItem(bi);
                this.__bm(P, bd, T, bc, R);
                W[i] = this.__bo(S, bb[i], bd, T, bc, Q[i]);
              } else {

                if(V[i] != null && S[u + qx.lang.String.firstUp(V[i])] != null){

                  var P = S[u + qx.lang.String.firstUp(V[i])]();
                  this.__bm(P, bd, T, bc, R);
                };
                W[i] = this.__bo(S, bb[i], bd, T, bc);
              };
            } else {

              var O = {
                index : i,
                propertyNames : V,
                sources : ba,
                listenerIds : W,
                arrayIndexValues : Q,
                targetObject : bd,
                targetPropertyChain : T,
                options : bc,
                listeners : U
              };
              var Y = qx.lang.Function.bind(this.__be, this, O);
              U.push(Y);
              W[i] = S.addListener(bb[i], Y);
            };
            if(S[u + qx.lang.String.firstUp(V[i])] == null){

              S = undefined;
            } else if(Q[i] !== z){

              var bi = Q[i] === N ? S.length - 1 : Q[i];
              S = S[u + qx.lang.String.firstUp(V[i])](bi);
            } else {

              S = S[u + qx.lang.String.firstUp(V[i])]();
              if(S === null && (V.length - 1) != i){

                S = undefined;
              };
            };
            if(!S){

              this.__bm(S, bd, T, bc, R);
              break;
            };
          };
        } catch(bj) {

          for(var i = 0;i < ba.length;i++){

            if(ba[i] && W[i]){

              ba[i].removeListenerById(W[i]);
            };
          };
          var X = bg.targets;
          var be = bg.listenerIds;
          for(var i = 0;i < X.length;i++){

            if(X[i] && be[i]){

              X[i].removeListenerById(be[i]);
            };
          };
          throw bj;
        };
        var bh = {
          type : f,
          listenerIds : W,
          sources : ba,
          targetListenerIds : bg.listenerIds,
          targets : bg.targets
        };
        this.__bp(bh, R, bf, bd, T);
        return bh;
      },
      __be : function(bq){

        if(bq.options && bq.options.onUpdate){

          bq.options.onUpdate(bq.sources[bq.index], bq.targetObject);
        };
        for(var j = bq.index + 1;j < bq.propertyNames.length;j++){

          var bo = bq.sources[j];
          bq.sources[j] = null;
          if(!bo){

            continue;
          };
          bo.removeListenerById(bq.listenerIds[j]);
        };
        var bo = bq.sources[bq.index];
        for(var j = bq.index + 1;j < bq.propertyNames.length;j++){

          if(bq.arrayIndexValues[j - 1] !== z){

            bo = bo[u + qx.lang.String.firstUp(bq.propertyNames[j - 1])](bq.arrayIndexValues[j - 1]);
          } else {

            bo = bo[u + qx.lang.String.firstUp(bq.propertyNames[j - 1])]();
          };
          bq.sources[j] = bo;
          if(!bo){

            if(bq.options && bq.options.converter){

              var bk = false;
              if(bq.options.ignoreConverter){

                var br = bq.propertyNames.slice(0, j).join(D);
                var bp = br.match(new RegExp(v + bq.options.ignoreConverter));
                bk = bp ? bp.length > 0 : false;
              };
              if(!bk){

                this.__bi(bq.targetObject, bq.targetPropertyChain, bq.options.converter());
              } else {

                this.__bh(bq.targetObject, bq.targetPropertyChain);
              };
            } else {

              this.__bh(bq.targetObject, bq.targetPropertyChain);
            };
            break;
          };
          if(j == bq.propertyNames.length - 1){

            if(qx.Class.implementsInterface(bo, qx.data.IListData)){

              var bs = bq.arrayIndexValues[j] === N ? bo.length - 1 : bq.arrayIndexValues[j];
              var bl = bo.getItem(bs);
              this.__bm(bl, bq.targetObject, bq.targetPropertyChain, bq.options, bq.sources[bq.index]);
              bq.listenerIds[j] = this.__bo(bo, s, bq.targetObject, bq.targetPropertyChain, bq.options, bq.arrayIndexValues[j]);
            } else {

              if(bq.propertyNames[j] != null && bo[u + qx.lang.String.firstUp(bq.propertyNames[j])] != null){

                var bl = bo[u + qx.lang.String.firstUp(bq.propertyNames[j])]();
                this.__bm(bl, bq.targetObject, bq.targetPropertyChain, bq.options, bq.sources[bq.index]);
              };
              var bm = this.__bg(bo, bq.propertyNames[j]);
              bq.listenerIds[j] = this.__bo(bo, bm, bq.targetObject, bq.targetPropertyChain, bq.options);
            };
          } else {

            if(bq.listeners[j] == null){

              var bn = qx.lang.Function.bind(this.__be, this, bq);
              bq.listeners.push(bn);
            };
            if(qx.Class.implementsInterface(bo, qx.data.IListData)){

              var bm = s;
            } else {

              var bm = this.__bg(bo, bq.propertyNames[j]);
            };
            bq.listenerIds[j] = bo.addListener(bm, bq.listeners[j]);
          };
        };
      },
      __bf : function(bu, bC, bG, by, bA){

        var bx = by.split(D);
        var bv = this.__bn(bx);
        var bF = [];
        var bE = [];
        var bz = [];
        var bD = [];
        var bw = bG;
        for(var i = 0;i < bx.length - 1;i++){

          if(bv[i] !== z){

            bD.push(s);
          } else {

            try{

              bD.push(this.__bg(bw, bx[i]));
            } catch(e) {

              break;
            };
          };
          bF[i] = bw;
          var bB = function(){

            for(var j = i + 1;j < bx.length - 1;j++){

              var bJ = bF[j];
              bF[j] = null;
              if(!bJ){

                continue;
              };
              bJ.removeListenerById(bz[j]);
            };
            var bJ = bF[i];
            for(var j = i + 1;j < bx.length - 1;j++){

              var bH = qx.lang.String.firstUp(bx[j - 1]);
              if(bv[j - 1] !== z){

                var bK = bv[j - 1] === N ? bJ.getLength() - 1 : bv[j - 1];
                bJ = bJ[u + bH](bK);
              } else {

                bJ = bJ[u + bH]();
              };
              bF[j] = bJ;
              if(bE[j] == null){

                bE.push(bB);
              };
              if(qx.Class.implementsInterface(bJ, qx.data.IListData)){

                var bI = s;
              } else {

                try{

                  var bI = qx.data.SingleValueBinding.__bg(bJ, bx[j]);
                } catch(e) {

                  break;
                };
              };
              bz[j] = bJ.addListener(bI, bE[j]);
            };
            qx.data.SingleValueBinding.updateTarget(bu, bC, bG, by, bA);
          };
          bE.push(bB);
          bz[i] = bw.addListener(bD[i], bB);
          var bt = qx.lang.String.firstUp(bx[i]);
          if(bw[u + bt] == null){

            bw = null;
          } else if(bv[i] !== z){

            bw = bw[u + bt](bv[i]);
          } else {

            bw = bw[u + bt]();
          };
          if(!bw){

            break;
          };
        };
        return {
          listenerIds : bz,
          targets : bF
        };
      },
      updateTarget : function(bL, bO, bQ, bM, bP){

        var bN = this.resolvePropertyChain(bL, bO);
        bN = qx.data.SingleValueBinding.__bq(bN, bQ, bM, bP, bL);
        this.__bi(bQ, bM, bN);
      },
      resolvePropertyChain : function(o, bR){

        var bS = this.__bk(bR);
        return this.__bl(o, bS, bS.length);
      },
      __bg : function(bU, bV){

        var bT = this.__br(bU, bV);
        if(bT == null){

          if(qx.Class.supportsEvent(bU.constructor, bV)){

            bT = bV;
          } else if(qx.Class.supportsEvent(bU.constructor, s + qx.lang.String.firstUp(bV))){

            bT = s + qx.lang.String.firstUp(bV);
          } else {

            throw new qx.core.AssertionError(q + bV + n + bU + M);
          };
        };
        return bT;
      },
      __bh : function(cb, bY){

        var ca = this.__bk(bY);
        var bX = this.__bl(cb, ca);
        if(bX != null){

          var cc = ca[ca.length - 1];
          var bW = this.__bj(cc);
          if(bW){

            this.__bi(cb, bY, null);
            return;
          };
          if(bX[m + qx.lang.String.firstUp(cc)] != undefined){

            bX[m + qx.lang.String.firstUp(cc)]();
          } else {

            bX[d + qx.lang.String.firstUp(cc)](null);
          };
        };
      },
      __bi : function(ci, cf, cg){

        var ch = this.__bk(cf);
        var ce = this.__bl(ci, ch);
        if(ce){

          var cj = ch[ch.length - 1];
          var cd = this.__bj(cj);
          if(cd){

            if(cd === N){

              cd = ce.length - 1;
            };
            ce.setItem(cd, cg);
          } else {

            ce[d + qx.lang.String.firstUp(cj)](cg);
          };
        };
      },
      __bj : function(cm){

        var ck = /^\[(\d+|last)\]$/;
        var cl = cm.match(ck);
        if(cl){

          return cl[1];
        };
        return null;
      },
      __bk : function(cn){

        return cn.replace(/\[/g, K).split(D).filter(function(co){

          return co !== z;
        });
      },
      __bl : function(cu, cp, cq){

        cq = cq || cp.length - 1;
        var cs = cu;
        for(var i = 0;i < cq;i++){

          try{

            var ct = cp[i];
            var cr = this.__bj(ct);
            if(cr){

              if(cr === N){

                cr = cs.length - 1;
              };
              cs = cs.getItem(cr);
            } else {

              cs = cs[u + qx.lang.String.firstUp(ct)]();
            };
          } catch(cv) {

            return null;
          };
        };
        return cs;
      },
      __bm : function(cA, cw, cy, cz, cx){

        cA = this.__bq(cA, cw, cy, cz, cx);
        if(cA === undefined){

          this.__bh(cw, cy);
        };
        if(cA !== undefined){

          try{

            this.__bi(cw, cy, cA);
            if(cz && cz.onUpdate){

              cz.onUpdate(cx, cw, cA);
            };
          } catch(e) {

            if(!(e instanceof qx.core.ValidationError)){

              throw e;
            };
            if(cz && cz.onSetFail){

              cz.onSetFail(e);
            } else {

              qx.log.Logger.warn(r + cA + H + cw + a + e);
            };
          };
        };
      },
      __bn : function(cB){

        var cC = [];
        for(var i = 0;i < cB.length;i++){

          var name = cB[i];
          if(qx.lang.String.endsWith(name, B)){

            var cD = name.substring(name.indexOf(C) + 1, name.indexOf(B));
            if(name.indexOf(B) != name.length - 1){

              throw new Error(k + name + w);
            };
            if(cD !== N){

              if(cD == z || isNaN(parseInt(cD, 10))){

                throw new Error(F + name + w);
              };
            };
            if(name.indexOf(C) != 0){

              cB[i] = name.substring(0, name.indexOf(C));
              cC[i] = z;
              cC[i + 1] = cD;
              cB.splice(i + 1, 0, h);
              i++;
            } else {

              cC[i] = cD;
              cB.splice(i, 1, h);
            };
          } else {

            cC[i] = z;
          };
        };
        return cC;
      },
      __bo : function(cE, cH, cM, cK, cI, cG){

        {

          var cF;
        };
        var cJ = function(cP, e){

          if(cP !== z){

            if(cP === N){

              cP = cE.length - 1;
            };
            var cQ = cE.getItem(cP);
            if(cQ === undefined){

              qx.data.SingleValueBinding.__bh(cM, cK);
            };
            var cO = e.getData().start;
            var cN = e.getData().end;
            if(cP < cO || cP > cN){

              return;
            };
          } else {

            var cQ = e.getData();
          };
          {
          };
          cQ = qx.data.SingleValueBinding.__bq(cQ, cM, cK, cI, cE);
          {
          };
          try{

            if(cQ !== undefined){

              qx.data.SingleValueBinding.__bi(cM, cK, cQ);
            } else {

              qx.data.SingleValueBinding.__bh(cM, cK);
            };
            if(cI && cI.onUpdate){

              cI.onUpdate(cE, cM, cQ);
            };
          } catch(cR) {

            if(!(cR instanceof qx.core.ValidationError)){

              throw cR;
            };
            if(cI && cI.onSetFail){

              cI.onSetFail(cR);
            } else {

              qx.log.Logger.warn(r + cQ + H + cM + a + cR);
            };
          };
        };
        if(!cG){

          cG = z;
        };
        cJ = qx.lang.Function.bind(cJ, cE, cG);
        var cL = cE.addListener(cH, cJ);
        return cL;
      },
      __bp : function(cX, cS, cV, cY, cW){

        var cT;
        cT = cS.toHashCode();
        if(this.__bc[cT] === undefined){

          this.__bc[cT] = [];
        };
        var cU = [cX, cS, cV, cY, cW];
        this.__bc[cT].push(cU);
        cT = cY.toHashCode();
        if(this.__bd[cT] === undefined){

          this.__bd[cT] = [];
        };
        this.__bd[cT].push(cU);
      },
      __bq : function(dd, dj, dc, df, da){

        if(df && df.converter){

          var dg;
          if(dj.getModel){

            dg = dj.getModel();
          };
          return df.converter(dd, dg, da, dj);
        } else {

          var de = this.__bk(dc);
          var db = this.__bl(dj, de);
          var dk = dc.substring(dc.lastIndexOf(D) + 1, dc.length);
          if(db == null){

            return dd;
          };
          var dh = qx.Class.getPropertyDefinition(db.constructor, dk);
          var di = dh == null ? z : dh.check;
          return this.__bs(dd, di);
        };
      },
      __br : function(dl, dn){

        var dm = qx.Class.getPropertyDefinition(dl.constructor, dn);
        if(dm == null){

          return null;
        };
        return dm.event;
      },
      __bs : function(dr, dq){

        var dp = qx.lang.Type.getClass(dr);
        if((dp == J || dp == x) && (dq == l || dq == E)){

          dr = parseInt(dr, 10);
        };
        if((dp == b || dp == J || dp == L) && dq == x){

          dr = dr + z;
        };
        if((dp == J || dp == x) && (dq == J || dq == A)){

          dr = parseFloat(dr);
        };
        return dr;
      },
      removeBindingFromObject : function(ds, dw){

        if(dw.type == f){

          for(var i = 0;i < dw.sources.length;i++){

            if(dw.sources[i]){

              dw.sources[i].removeListenerById(dw.listenerIds[i]);
            };
          };
          for(var i = 0;i < dw.targets.length;i++){

            if(dw.targets[i]){

              dw.targets[i].removeListenerById(dw.targetListenerIds[i]);
            };
          };
        } else {

          ds.removeListenerById(dw);
        };
        var dv = this.getAllBindingsForObject(ds);
        if(dv != undefined){

          for(var i = 0;i < dv.length;i++){

            if(dv[i][0] == dw){

              var dt = dv[i][3];
              if(this.__bd[dt.toHashCode()]){

                qx.lang.Array.remove(this.__bd[dt.toHashCode()], dv[i]);
              };
              var du = dv[i][1];
              if(this.__bc[du.toHashCode()]){

                qx.lang.Array.remove(this.__bc[du.toHashCode()], dv[i]);
              };
              return;
            };
          };
        };
        throw new Error(t);
      },
      removeAllBindingsForObject : function(dy){

        {
        };
        var dx = this.getAllBindingsForObject(dy);
        if(dx != undefined){

          for(var i = dx.length - 1;i >= 0;i--){

            this.removeBindingFromObject(dy, dx[i][0]);
          };
        };
      },
      removeRelatedBindings : function(dA, dB){

        {
        };
        var dD = this.getAllBindingsForObject(dA);
        if(dD != undefined){

          for(var i = dD.length - 1;i >= 0;i--){

            var dC = dD[i][1];
            var dz = dD[i][3];
            if(dC === dB || dz === dB){

              this.removeBindingFromObject(dA, dD[i][0]);
            };
          };
        };
      },
      getAllBindingsForObject : function(dF){

        var dG = dF.toHashCode();
        if(this.__bc[dG] === undefined){

          this.__bc[dG] = [];
        };
        var dH = this.__bc[dG];
        var dE = this.__bd[dG] ? this.__bd[dG] : [];
        return qx.lang.Array.unique(dH.concat(dE));
      },
      removeAllBindings : function(){

        for(var dJ in this.__bc){

          var dI = qx.core.ObjectRegistry.fromHashCode(dJ);
          if(dI == null){

            delete this.__bc[dJ];
            continue;
          };
          this.removeAllBindingsForObject(dI);
        };
        this.__bc = {
        };
      },
      getAllBindings : function(){

        return this.__bc;
      },
      showBindingInLog : function(dL, dN){

        var dM;
        for(var i = 0;i < this.__bc[dL.toHashCode()].length;i++){

          if(this.__bc[dL.toHashCode()][i][0] == dN){

            dM = this.__bc[dL.toHashCode()][i];
            break;
          };
        };
        if(dM === undefined){

          var dK = I;
        } else {

          var dK = y + dM[1] + G + dM[2] + g + dM[3] + G + dM[4] + c;
        };
        qx.log.Logger.debug(dK);
      },
      showAllBindingsInLog : function(){

        for(var dP in this.__bc){

          var dO = qx.core.ObjectRegistry.fromHashCode(dP);
          for(var i = 0;i < this.__bc[dP].length;i++){

            this.showBindingInLog(dO, this.__bc[dP][i][0]);
          };
        };
      }
    }
  });
})();
(function(){

  var a = "qx.util.RingBuffer";
  qx.Bootstrap.define(a, {
    extend : Object,
    construct : function(b){

      this.setMaxEntries(b || 50);
    },
    members : {
      __bt : 0,
      __bu : 0,
      __bv : false,
      __bw : 0,
      __bx : null,
      __by : null,
      setMaxEntries : function(c){

        this.__by = c;
        this.clear();
      },
      getMaxEntries : function(){

        return this.__by;
      },
      addEntry : function(d){

        this.__bx[this.__bt] = d;
        this.__bt = this.__bz(this.__bt, 1);
        var e = this.getMaxEntries();
        if(this.__bu < e){

          this.__bu++;
        };
        if(this.__bv && (this.__bw < e)){

          this.__bw++;
        };
      },
      mark : function(){

        this.__bv = true;
        this.__bw = 0;
      },
      clearMark : function(){

        this.__bv = false;
      },
      getAllEntries : function(){

        return this.getEntries(this.getMaxEntries(), false);
      },
      getEntries : function(f, j){

        if(f > this.__bu){

          f = this.__bu;
        };
        if(j && this.__bv && (f > this.__bw)){

          f = this.__bw;
        };
        if(f > 0){

          var h = this.__bz(this.__bt, -1);
          var g = this.__bz(h, -f + 1);
          var i;
          if(g <= h){

            i = this.__bx.slice(g, h + 1);
          } else {

            i = this.__bx.slice(g, this.__bu).concat(this.__bx.slice(0, h + 1));
          };
        } else {

          i = [];
        };
        return i;
      },
      clear : function(){

        this.__bx = new Array(this.getMaxEntries());
        this.__bu = 0;
        this.__bw = 0;
        this.__bt = 0;
      },
      __bz : function(n, l){

        var k = this.getMaxEntries();
        var m = (n + l) % k;
        if(m < 0){

          m += k;
        };
        return m;
      }
    }
  });
})();
(function(){

  var a = "qx.log.appender.RingBuffer";
  qx.Bootstrap.define(a, {
    extend : qx.util.RingBuffer,
    construct : function(b){

      this.setMaxMessages(b || 50);
    },
    members : {
      setMaxMessages : function(c){

        this.setMaxEntries(c);
      },
      getMaxMessages : function(){

        return this.getMaxEntries();
      },
      process : function(d){

        this.addEntry(d);
      },
      getAllLogEvents : function(){

        return this.getAllEntries();
      },
      retrieveLogEvents : function(e, f){

        return this.getEntries(e, f);
      },
      clearHistory : function(){

        this.clear();
      }
    }
  });
})();
(function(){

  var a = "qx.lang.Type",b = "Error",c = "RegExp",d = "Date",e = "Number",f = "Boolean";
  qx.Bootstrap.define(a, {
    statics : {
      getClass : qx.Bootstrap.getClass,
      isString : qx.Bootstrap.isString,
      isArray : qx.Bootstrap.isArray,
      isObject : qx.Bootstrap.isObject,
      isFunction : qx.Bootstrap.isFunction,
      isRegExp : function(g){

        return this.getClass(g) == c;
      },
      isNumber : function(h){

        return (h !== null && (this.getClass(h) == e || h instanceof Number));
      },
      isBoolean : function(i){

        return (i !== null && (this.getClass(i) == f || i instanceof Boolean));
      },
      isDate : function(j){

        return (j !== null && (this.getClass(j) == d || j instanceof Date));
      },
      isError : function(k){

        return (k !== null && (this.getClass(k) == b || k instanceof Error));
      }
    }
  });
})();
(function(){

  var a = "mshtml",b = "engine.name",c = "[object Array]",d = "qx.lang.Array",e = "Cannot clean-up map entry doneObjects[",f = "]",g = "qx",h = "number",j = "][",k = "string";
  qx.Bootstrap.define(d, {
    statics : {
      cast : function(m, o, p){

        if(m.constructor === o){

          return m;
        };
        if(qx.data && qx.data.IListData){

          if(qx.Class && qx.Class.hasInterface(m, qx.data.IListData)){

            var m = m.toArray();
          };
        };
        var n = new o;
        if((qx.core.Environment.get(b) == a)){

          if(m.item){

            for(var i = p || 0,l = m.length;i < l;i++){

              n.push(m[i]);
            };
            return n;
          };
        };
        if(Object.prototype.toString.call(m) === c && p == null){

          n.push.apply(n, m);
        } else {

          n.push.apply(n, Array.prototype.slice.call(m, p || 0));
        };
        return n;
      },
      fromArguments : function(q, r){

        return Array.prototype.slice.call(q, r || 0);
      },
      fromCollection : function(t){

        if((qx.core.Environment.get(b) == a)){

          if(t.item){

            var s = [];
            for(var i = 0,l = t.length;i < l;i++){

              s[i] = t[i];
            };
            return s;
          };
        };
        return Array.prototype.slice.call(t, 0);
      },
      fromShortHand : function(u){

        var w = u.length;
        var v = qx.lang.Array.clone(u);
        switch(w){case 1:
        v[1] = v[2] = v[3] = v[0];
        break;case 2:
        v[2] = v[0];case 3:
        v[3] = v[1];};
        return v;
      },
      clone : function(x){

        return x.concat();
      },
      insertAt : function(y, z, i){

        y.splice(i, 0, z);
        return y;
      },
      insertBefore : function(A, C, B){

        var i = A.indexOf(B);
        if(i == -1){

          A.push(C);
        } else {

          A.splice(i, 0, C);
        };
        return A;
      },
      insertAfter : function(D, F, E){

        var i = D.indexOf(E);
        if(i == -1 || i == (D.length - 1)){

          D.push(F);
        } else {

          D.splice(i + 1, 0, F);
        };
        return D;
      },
      removeAt : function(G, i){

        return G.splice(i, 1)[0];
      },
      removeAll : function(H){

        H.length = 0;
        return this;
      },
      append : function(J, I){

        {
        };
        Array.prototype.push.apply(J, I);
        return J;
      },
      exclude : function(M, L){

        {
        };
        for(var i = 0,N = L.length,K;i < N;i++){

          K = M.indexOf(L[i]);
          if(K != -1){

            M.splice(K, 1);
          };
        };
        return M;
      },
      remove : function(O, P){

        var i = O.indexOf(P);
        if(i != -1){

          O.splice(i, 1);
          return P;
        };
      },
      contains : function(Q, R){

        return Q.indexOf(R) !== -1;
      },
      equals : function(T, S){

        var length = T.length;
        if(length !== S.length){

          return false;
        };
        for(var i = 0;i < length;i++){

          if(T[i] !== S[i]){

            return false;
          };
        };
        return true;
      },
      sum : function(U){

        var V = 0;
        for(var i = 0,l = U.length;i < l;i++){

          if(U[i] != undefined){

            V += U[i];
          };
        };
        return V;
      },
      max : function(W){

        {
        };
        var i,Y = W.length,X = W[0];
        for(i = 1;i < Y;i++){

          if(W[i] > X){

            X = W[i];
          };
        };
        return X === undefined ? null : X;
      },
      min : function(ba){

        {
        };
        var i,bc = ba.length,bb = ba[0];
        for(i = 1;i < bc;i++){

          if(ba[i] < bb){

            bb = ba[i];
          };
        };
        return bb === undefined ? null : bb;
      },
      unique : function(bf){

        var bp = [],be = {
        },bi = {
        },bk = {
        };
        var bj,bd = 0;
        var bn = g + Date.now();
        var bg = false,bl = false,bo = false;
        for(var i = 0,bm = bf.length;i < bm;i++){

          bj = bf[i];
          if(bj === null){

            if(!bg){

              bg = true;
              bp.push(bj);
            };
          } else if(bj === undefined){
          } else if(bj === false){

            if(!bl){

              bl = true;
              bp.push(bj);
            };
          } else if(bj === true){

            if(!bo){

              bo = true;
              bp.push(bj);
            };
          } else if(typeof bj === k){

            if(!be[bj]){

              be[bj] = 1;
              bp.push(bj);
            };
          } else if(typeof bj === h){

            if(!bi[bj]){

              bi[bj] = 1;
              bp.push(bj);
            };
          } else {

            var bh = bj[bn];
            if(bh == null){

              bh = bj[bn] = bd++;
            };
            if(!bk[bh]){

              bk[bh] = bj;
              bp.push(bj);
            };
          };;;;;
        };
        for(var bh in bk){

          try{

            delete bk[bh][bn];
          } catch(bq) {

            try{

              bk[bh][bn] = null;
            } catch(br) {

              throw new Error(e + bh + j + bn + f);
            };
          };
        };
        return bp;
      },
      range : function(bu, stop, bv){

        if(arguments.length <= 1){

          stop = bu || 0;
          bu = 0;
        };
        bv = arguments[2] || 1;
        var length = Math.max(Math.ceil((stop - bu) / bv), 0);
        var bs = 0;
        var bt = Array(length);
        while(bs < length){

          bt[bs++] = bu;
          bu += bv;
        };
        return bt;
      }
    }
  });
})();
(function(){

  var a = " != ",b = "qx.core.Object",c = "Expected value to be an array but found ",d = "' (rgb(",f = ") was fired.",g = "Expected value to be an integer >= 0 but found ",h = "' to be not equal with '",j = "' to '",k = "Expected object '",m = "Called assertTrue with '",n = "Expected value to be a map but found ",o = "The function did not raise an exception!",p = "Expected value to be undefined but found ",q = "Expected value to be a DOM element but found  '",r = "Expected value to be a regular expression but found ",s = "' to implement the interface '",t = "Expected value to be null but found ",u = "Invalid argument 'type'",v = "Called assert with 'false'",w = "Assertion error! ",x = "'",y = "null",z = "' but found '",A = "'undefined'",B = ",",C = "' must must be a key of the map '",D = "Expected '",E = "The String '",F = "Expected value to be a string but found ",G = "Event (",H = "Expected value to be the CSS color '",I = "!",J = "Expected value not to be undefined but found undefined!",K = "qx.util.ColorUtil",L = ": ",M = "The raised exception does not have the expected type! ",N = ") not fired.",O = "'!",P = "qx.core.Assert",Q = "",R = "Expected value to be typeof object but found ",S = "' but found ",T = "' (identical) but found '",U = "' must have any of the values defined in the array '",V = "Expected value to be a number but found ",W = "Called assertFalse with '",X = "qx.ui.core.Widget",Y = "]",bJ = "Expected value to be a qooxdoo object but found ",bK = "' arguments.",bL = "Expected value '%1' to be in the range '%2'..'%3'!",bF = "Array[",bG = "' does not match the regular expression '",bH = "' to be not identical with '",bI = "Expected [",bP = "' arguments but found '",bQ = "', which cannot be converted to a CSS color!",bR = ", ",cg = "qx.core.AssertionError",bM = "Expected value to be a boolean but found ",bN = "Expected value not to be null but found null!",bO = "))!",bD = "Expected value to be a qooxdoo widget but found ",bU = "The value '",bE = "Expected value to be typeof '",bV = "\n Stack trace: \n",bW = "Expected value to be typeof function but found ",cb = "Expected value to be an integer but found ",bS = "Called fail().",cf = "The parameter 're' must be a string or a regular expression.",bT = ")), but found value '",bX = "qx.util.ColorUtil not available! Your code must have a dependency on 'qx.util.ColorUtil'",bY = "Expected value to be a number >= 0 but found ",ca = "Expected value to be instanceof '",cc = "], but found [",cd = "Wrong number of arguments given. Expected '",ce = "object";
  qx.Bootstrap.define(P, {
    statics : {
      __bA : true,
      __bB : function(ch, ci){

        var cm = Q;
        for(var i = 1,l = arguments.length;i < l;i++){

          cm = cm + this.__bC(arguments[i] === undefined ? A : arguments[i]);
        };
        var cl = Q;
        if(cm){

          cl = ch + L + cm;
        } else {

          cl = ch;
        };
        var ck = w + cl;
        if(qx.Class && qx.Class.isDefined(cg)){

          var cj = new qx.core.AssertionError(ch, cm);
          if(this.__bA){

            qx.Bootstrap.error(ck + bV + cj.getStackTrace());
          };
          throw cj;
        } else {

          if(this.__bA){

            qx.Bootstrap.error(ck);
          };
          throw new Error(ck);
        };
      },
      __bC : function(co){

        var cn;
        if(co === null){

          cn = y;
        } else if(qx.lang.Type.isArray(co) && co.length > 10){

          cn = bF + co.length + Y;
        } else if((co instanceof Object) && (co.toString == null)){

          cn = qx.lang.Json.stringify(co, null, 2);
        } else {

          try{

            cn = co.toString();
          } catch(e) {

            cn = Q;
          };
        };;
        return cn;
      },
      assert : function(cq, cp){

        cq == true || this.__bB(cp || Q, v);
      },
      fail : function(cr, cs){

        var ct = cs ? Q : bS;
        this.__bB(cr || Q, ct);
      },
      assertTrue : function(cv, cu){

        (cv === true) || this.__bB(cu || Q, m, cv, x);
      },
      assertFalse : function(cx, cw){

        (cx === false) || this.__bB(cw || Q, W, cx, x);
      },
      assertEquals : function(cy, cz, cA){

        cy == cz || this.__bB(cA || Q, D, cy, z, cz, O);
      },
      assertNotEquals : function(cB, cC, cD){

        cB != cC || this.__bB(cD || Q, D, cB, h, cC, O);
      },
      assertIdentical : function(cE, cF, cG){

        cE === cF || this.__bB(cG || Q, D, cE, T, cF, O);
      },
      assertNotIdentical : function(cH, cI, cJ){

        cH !== cI || this.__bB(cJ || Q, D, cH, bH, cI, O);
      },
      assertNotUndefined : function(cL, cK){

        cL !== undefined || this.__bB(cK || Q, J);
      },
      assertUndefined : function(cN, cM){

        cN === undefined || this.__bB(cM || Q, p, cN, I);
      },
      assertNotNull : function(cP, cO){

        cP !== null || this.__bB(cO || Q, bN);
      },
      assertNull : function(cR, cQ){

        cR === null || this.__bB(cQ || Q, t, cR, I);
      },
      assertJsonEquals : function(cS, cT, cU){

        this.assertEquals(qx.lang.Json.stringify(cS), qx.lang.Json.stringify(cT), cU);
      },
      assertMatch : function(cX, cW, cV){

        this.assertString(cX);
        this.assert(qx.lang.Type.isRegExp(cW) || qx.lang.Type.isString(cW), cf);
        cX.search(cW) >= 0 || this.__bB(cV || Q, E, cX, bG, cW.toString(), O);
      },
      assertArgumentsCount : function(db, dc, dd, cY){

        var da = db.length;
        (da >= dc && da <= dd) || this.__bB(cY || Q, cd, dc, j, dd, bP, da, bK);
      },
      assertEventFired : function(de, event, dh, di, dj){

        var df = false;
        var dg = function(e){

          if(di){

            di.call(de, e);
          };
          df = true;
        };
        var dk;
        try{

          dk = de.addListener(event, dg, de);
          dh.call(de);
        } catch(dl) {

          throw dl;
        }finally{

          try{

            de.removeListenerById(dk);
          } catch(dm) {
          };
        };
        df === true || this.__bB(dj || Q, G, event, N);
      },
      assertEventNotFired : function(dn, event, dr, ds){

        var dp = false;
        var dq = function(e){

          dp = true;
        };
        var dt = dn.addListener(event, dq, dn);
        dr.call();
        dp === false || this.__bB(ds || Q, G, event, f);
        dn.removeListenerById(dt);
      },
      assertException : function(dx, dw, dv, du){

        var dw = dw || Error;
        var dy;
        try{

          this.__bA = false;
          dx();
        } catch(dz) {

          dy = dz;
        }finally{

          this.__bA = true;
        };
        if(dy == null){

          this.__bB(du || Q, o);
        };
        dy instanceof dw || this.__bB(du || Q, M, dw, a, dy);
        if(dv){

          this.assertMatch(dy.toString(), dv, du);
        };
      },
      assertInArray : function(dC, dB, dA){

        dB.indexOf(dC) !== -1 || this.__bB(dA || Q, bU, dC, U, dB, x);
      },
      assertArrayEquals : function(dD, dE, dF){

        this.assertArray(dD, dF);
        this.assertArray(dE, dF);
        dF = dF || bI + dD.join(bR) + cc + dE.join(bR) + Y;
        if(dD.length !== dE.length){

          this.fail(dF, true);
        };
        for(var i = 0;i < dD.length;i++){

          if(dD[i] !== dE[i]){

            this.fail(dF, true);
          };
        };
      },
      assertKeyInMap : function(dI, dH, dG){

        dH[dI] !== undefined || this.__bB(dG || Q, bU, dI, C, dH, x);
      },
      assertFunction : function(dK, dJ){

        qx.lang.Type.isFunction(dK) || this.__bB(dJ || Q, bW, dK, I);
      },
      assertString : function(dM, dL){

        qx.lang.Type.isString(dM) || this.__bB(dL || Q, F, dM, I);
      },
      assertBoolean : function(dO, dN){

        qx.lang.Type.isBoolean(dO) || this.__bB(dN || Q, bM, dO, I);
      },
      assertNumber : function(dQ, dP){

        (qx.lang.Type.isNumber(dQ) && isFinite(dQ)) || this.__bB(dP || Q, V, dQ, I);
      },
      assertPositiveNumber : function(dS, dR){

        (qx.lang.Type.isNumber(dS) && isFinite(dS) && dS >= 0) || this.__bB(dR || Q, bY, dS, I);
      },
      assertInteger : function(dU, dT){

        (qx.lang.Type.isNumber(dU) && isFinite(dU) && dU % 1 === 0) || this.__bB(dT || Q, cb, dU, I);
      },
      assertPositiveInteger : function(dX, dV){

        var dW = (qx.lang.Type.isNumber(dX) && isFinite(dX) && dX % 1 === 0 && dX >= 0);
        dW || this.__bB(dV || Q, g, dX, I);
      },
      assertInRange : function(eb, ec, ea, dY){

        (eb >= ec && eb <= ea) || this.__bB(dY || Q, qx.lang.String.format(bL, [eb, ec, ea]));
      },
      assertObject : function(ee, ed){

        var ef = ee !== null && (qx.lang.Type.isObject(ee) || typeof ee === ce);
        ef || this.__bB(ed || Q, R, (ee), I);
      },
      assertArray : function(eh, eg){

        qx.lang.Type.isArray(eh) || this.__bB(eg || Q, c, eh, I);
      },
      assertMap : function(ej, ei){

        qx.lang.Type.isObject(ej) || this.__bB(ei || Q, n, ej, I);
      },
      assertRegExp : function(el, ek){

        qx.lang.Type.isRegExp(el) || this.__bB(ek || Q, r, el, I);
      },
      assertType : function(eo, en, em){

        this.assertString(en, u);
        typeof (eo) === en || this.__bB(em || Q, bE, en, S, eo, I);
      },
      assertInstance : function(er, es, ep){

        var eq = es.classname || es + Q;
        er instanceof es || this.__bB(ep || Q, ca, eq, S, er, I);
      },
      assertInterface : function(ev, eu, et){

        qx.Class && qx.Class.implementsInterface(ev, eu) || this.__bB(et || Q, k, ev, s, eu, O);
      },
      assertCssColor : function(eC, ez, eB){

        var ew = qx.Class ? qx.Class.getByName(K) : null;
        if(!ew){

          throw new Error(bX);
        };
        var ey = ew.stringToRgb(eC);
        try{

          var eA = ew.stringToRgb(ez);
        } catch(eE) {

          this.__bB(eB || Q, H, eC, d, ey.join(B), bT, ez, bQ);
        };
        var eD = ey[0] == eA[0] && ey[1] == eA[1] && ey[2] == eA[2];
        eD || this.__bB(eB || Q, H, ey, d, ey.join(B), bT, ez, d, eA.join(B), bO);
      },
      assertElement : function(eG, eF){

        !!(eG && eG.nodeType === 1) || this.__bB(eF || Q, q, eG, O);
      },
      assertQxObject : function(eI, eH){

        this.__bD(eI, b) || this.__bB(eH || Q, bJ, eI, I);
      },
      assertQxWidget : function(eK, eJ){

        this.__bD(eK, X) || this.__bB(eJ || Q, bD, eK, I);
      },
      __bD : function(eM, eL){

        if(!eM){

          return false;
        };
        var eN = eM.constructor;
        while(eN){

          if(eN.classname === eL){

            return true;
          };
          eN = eN.superclass;
        };
        return false;
      }
    }
  });
})();
(function(){

  var a = "-",b = "]",c = '\\u',d = "undefined",e = "",f = '\\$1',g = "0041-005A0061-007A00AA00B500BA00C0-00D600D8-00F600F8-02C102C6-02D102E0-02E402EC02EE0370-037403760377037A-037D03860388-038A038C038E-03A103A3-03F503F7-0481048A-05250531-055605590561-058705D0-05EA05F0-05F20621-064A066E066F0671-06D306D506E506E606EE06EF06FA-06FC06FF07100712-072F074D-07A507B107CA-07EA07F407F507FA0800-0815081A082408280904-0939093D09500958-0961097109720979-097F0985-098C098F09900993-09A809AA-09B009B209B6-09B909BD09CE09DC09DD09DF-09E109F009F10A05-0A0A0A0F0A100A13-0A280A2A-0A300A320A330A350A360A380A390A59-0A5C0A5E0A72-0A740A85-0A8D0A8F-0A910A93-0AA80AAA-0AB00AB20AB30AB5-0AB90ABD0AD00AE00AE10B05-0B0C0B0F0B100B13-0B280B2A-0B300B320B330B35-0B390B3D0B5C0B5D0B5F-0B610B710B830B85-0B8A0B8E-0B900B92-0B950B990B9A0B9C0B9E0B9F0BA30BA40BA8-0BAA0BAE-0BB90BD00C05-0C0C0C0E-0C100C12-0C280C2A-0C330C35-0C390C3D0C580C590C600C610C85-0C8C0C8E-0C900C92-0CA80CAA-0CB30CB5-0CB90CBD0CDE0CE00CE10D05-0D0C0D0E-0D100D12-0D280D2A-0D390D3D0D600D610D7A-0D7F0D85-0D960D9A-0DB10DB3-0DBB0DBD0DC0-0DC60E01-0E300E320E330E40-0E460E810E820E840E870E880E8A0E8D0E94-0E970E99-0E9F0EA1-0EA30EA50EA70EAA0EAB0EAD-0EB00EB20EB30EBD0EC0-0EC40EC60EDC0EDD0F000F40-0F470F49-0F6C0F88-0F8B1000-102A103F1050-1055105A-105D106110651066106E-10701075-1081108E10A0-10C510D0-10FA10FC1100-1248124A-124D1250-12561258125A-125D1260-1288128A-128D1290-12B012B2-12B512B8-12BE12C012C2-12C512C8-12D612D8-13101312-13151318-135A1380-138F13A0-13F41401-166C166F-167F1681-169A16A0-16EA1700-170C170E-17111720-17311740-17511760-176C176E-17701780-17B317D717DC1820-18771880-18A818AA18B0-18F51900-191C1950-196D1970-19741980-19AB19C1-19C71A00-1A161A20-1A541AA71B05-1B331B45-1B4B1B83-1BA01BAE1BAF1C00-1C231C4D-1C4F1C5A-1C7D1CE9-1CEC1CEE-1CF11D00-1DBF1E00-1F151F18-1F1D1F20-1F451F48-1F4D1F50-1F571F591F5B1F5D1F5F-1F7D1F80-1FB41FB6-1FBC1FBE1FC2-1FC41FC6-1FCC1FD0-1FD31FD6-1FDB1FE0-1FEC1FF2-1FF41FF6-1FFC2071207F2090-209421022107210A-211321152119-211D212421262128212A-212D212F-2139213C-213F2145-2149214E218321842C00-2C2E2C30-2C5E2C60-2CE42CEB-2CEE2D00-2D252D30-2D652D6F2D80-2D962DA0-2DA62DA8-2DAE2DB0-2DB62DB8-2DBE2DC0-2DC62DC8-2DCE2DD0-2DD62DD8-2DDE2E2F300530063031-3035303B303C3041-3096309D-309F30A1-30FA30FC-30FF3105-312D3131-318E31A0-31B731F0-31FF3400-4DB54E00-9FCBA000-A48CA4D0-A4FDA500-A60CA610-A61FA62AA62BA640-A65FA662-A66EA67F-A697A6A0-A6E5A717-A71FA722-A788A78BA78CA7FB-A801A803-A805A807-A80AA80C-A822A840-A873A882-A8B3A8F2-A8F7A8FBA90A-A925A930-A946A960-A97CA984-A9B2A9CFAA00-AA28AA40-AA42AA44-AA4BAA60-AA76AA7AAA80-AAAFAAB1AAB5AAB6AAB9-AABDAAC0AAC2AADB-AADDABC0-ABE2AC00-D7A3D7B0-D7C6D7CB-D7FBF900-FA2DFA30-FA6DFA70-FAD9FB00-FB06FB13-FB17FB1DFB1F-FB28FB2A-FB36FB38-FB3CFB3EFB40FB41FB43FB44FB46-FBB1FBD3-FD3DFD50-FD8FFD92-FDC7FDF0-FDFBFE70-FE74FE76-FEFCFF21-FF3AFF41-FF5AFF66-FFBEFFC2-FFC7FFCA-FFCFFFD2-FFD7FFDA-FFDC",h = "\\\\",j = '-',k = "g",l = "\\\"",m = "qx.lang.String",n = "(^|[^",o = "0",p = "%",q = '"',r = ' ',s = '\n',t = "])[";
  qx.Bootstrap.define(m, {
    statics : {
      __bE : g,
      __bF : null,
      __bG : {
      },
      camelCase : function(v){

        var u = this.__bG[v];
        if(!u){

          u = v.replace(/\-([a-z])/g, function(x, w){

            return w.toUpperCase();
          });
          if(v.indexOf(a) >= 0){

            this.__bG[v] = u;
          };
        };
        return u;
      },
      hyphenate : function(z){

        var y = this.__bG[z];
        if(!y){

          y = z.replace(/[A-Z]/g, function(A){

            return (j + A.charAt(0).toLowerCase());
          });
          if(z.indexOf(a) == -1){

            this.__bG[z] = y;
          };
        };
        return y;
      },
      capitalize : function(C){

        if(this.__bF === null){

          var B = c;
          this.__bF = new RegExp(n + this.__bE.replace(/[0-9A-F]{4}/g, function(D){

            return B + D;
          }) + t + this.__bE.replace(/[0-9A-F]{4}/g, function(E){

            return B + E;
          }) + b, k);
        };
        return C.replace(this.__bF, function(F){

          return F.toUpperCase();
        });
      },
      clean : function(G){

        return G.replace(/\s+/g, r).trim();
      },
      trimLeft : function(H){

        return H.replace(/^\s+/, e);
      },
      trimRight : function(I){

        return I.replace(/\s+$/, e);
      },
      startsWith : function(K, J){

        return K.indexOf(J) === 0;
      },
      endsWith : function(M, L){

        return M.substring(M.length - L.length, M.length) === L;
      },
      repeat : function(N, O){

        return N.length > 0 ? new Array(O + 1).join(N) : e;
      },
      pad : function(Q, length, P){

        var R = length - Q.length;
        if(R > 0){

          if(typeof P === d){

            P = o;
          };
          return this.repeat(P, R) + Q;
        } else {

          return Q;
        };
      },
      firstUp : qx.Bootstrap.firstUp,
      firstLow : qx.Bootstrap.firstLow,
      contains : function(T, S){

        return T.indexOf(S) != -1;
      },
      format : function(U, V){

        var W = U;
        var i = V.length;
        while(i--){

          W = W.replace(new RegExp(p + (i + 1), k), function(){

            return V[i] + e;
          });
        };
        return W;
      },
      escapeRegexpChars : function(X){

        return X.replace(/([.*+?^${}()|[\]\/\\])/g, f);
      },
      toArray : function(Y){

        return Y.split(/\B|\b/g);
      },
      stripTags : function(ba){

        return ba.replace(/<\/?[^>]+>/gi, e);
      },
      stripScripts : function(bd, bc){

        var be = e;
        var bb = bd.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, function(){

          be += arguments[1] + s;
          return e;
        });
        if(bc === true){

          qx.lang.Function.globalEval(be);
        };
        return bb;
      },
      quote : function(bf){

        return q + bf.replace(/\\/g, h).replace(/\"/g, l) + q;
      }
    }
  });
})();
(function(){

  var a = 'anonymous()',b = "()",c = "qx.globalErrorHandling",d = "qx.lang.Function",e = ".",f = ".prototype.",g = ".constructor()";
  qx.Bootstrap.define(d, {
    statics : {
      getCaller : function(h){

        return h.caller ? h.caller.callee : h.callee.caller;
      },
      getName : function(i){

        if(i.displayName){

          return i.displayName;
        };
        if(i.$$original || i.wrapper || i.classname){

          return i.classname + g;
        };
        if(i.$$mixin){

          for(var j in i.$$mixin.$$members){

            if(i.$$mixin.$$members[j] == i){

              return i.$$mixin.name + f + j + b;
            };
          };
          for(var j in i.$$mixin){

            if(i.$$mixin[j] == i){

              return i.$$mixin.name + e + j + b;
            };
          };
        };
        if(i.self){

          var l = i.self.constructor;
          if(l){

            for(var j in l.prototype){

              if(l.prototype[j] == i){

                return l.classname + f + j + b;
              };
            };
            for(var j in l){

              if(l[j] == i){

                return l.classname + e + j + b;
              };
            };
          };
        };
        var k = i.toString().match(/function\s*(\w*)\s*\(.*/);
        if(k && k.length >= 1 && k[1]){

          return k[1] + b;
        };
        return a;
      },
      globalEval : function(data){

        if(window.execScript){

          return window.execScript(data);
        } else {

          return eval.call(window, data);
        };
      },
      create : function(n, m){

        {
        };
        if(!m){

          return n;
        };
        if(!(m.self || m.args || m.delay != null || m.periodical != null || m.attempt)){

          return n;
        };
        return function(event){

          {
          };
          var p = qx.lang.Array.fromArguments(arguments);
          if(m.args){

            p = m.args.concat(p);
          };
          if(m.delay || m.periodical){

            var o = function(){

              return n.apply(m.self || this, p);
            };
            if(qx.core.Environment.get(c)){

              o = qx.event.GlobalError.observeMethod(o);
            };
            if(m.delay){

              return window.setTimeout(o, m.delay);
            };
            if(m.periodical){

              return window.setInterval(o, m.periodical);
            };
          } else if(m.attempt){

            var q = false;
            try{

              q = n.apply(m.self || this, p);
            } catch(r) {
            };
            return q;
          } else {

            return n.apply(m.self || this, p);
          };
        };
      },
      bind : function(s, self, t){

        return this.create(s, {
          self : self,
          args : arguments.length > 2 ? qx.lang.Array.fromArguments(arguments, 2) : null
        });
      },
      curry : function(u, v){

        return this.create(u, {
          args : arguments.length > 1 ? qx.lang.Array.fromArguments(arguments, 1) : null
        });
      },
      listener : function(x, self, y){

        if(arguments.length < 3){

          return function(event){

            return x.call(self || this, event || window.event);
          };
        } else {

          var w = qx.lang.Array.fromArguments(arguments, 2);
          return function(event){

            var z = [event || window.event];
            z.push.apply(z, w);
            x.apply(self || this, z);
          };
        };
      },
      attempt : function(A, self, B){

        return this.create(A, {
          self : self,
          attempt : true,
          args : arguments.length > 2 ? qx.lang.Array.fromArguments(arguments, 2) : null
        })();
      },
      delay : function(D, C, self, E){

        return this.create(D, {
          delay : C,
          self : self,
          args : arguments.length > 3 ? qx.lang.Array.fromArguments(arguments, 3) : null
        })();
      },
      periodical : function(G, F, self, H){

        return this.create(G, {
          periodical : F,
          self : self,
          args : arguments.length > 3 ? qx.lang.Array.fromArguments(arguments, 3) : null
        })();
      }
    }
  });
})();
(function(){

  var a = "qx.globalErrorHandling",b = "qx.event.GlobalError";
  qx.Bootstrap.define(b, {
    statics : {
      __bH : null,
      __bI : null,
      __bJ : null,
      __bK : function(){

        if(qx.core && qx.core.Environment){

          return qx.core.Environment.get(a);
        } else {

          return !!qx.Bootstrap.getEnvironmentSetting(a);
        };
      },
      setErrorHandler : function(c, d){

        this.__bH = c || null;
        this.__bJ = d || window;
        if(this.__bK()){

          if(c && window.onerror){

            var e = qx.Bootstrap.bind(this.__bL, this);
            if(this.__bI == null){

              this.__bI = window.onerror;
            };
            var self = this;
            window.onerror = function(f, g, h){

              self.__bI(f, g, h);
              e(f, g, h);
            };
          };
          if(c && !window.onerror){

            window.onerror = qx.Bootstrap.bind(this.__bL, this);
          };
          if(this.__bH == null){

            if(this.__bI != null){

              window.onerror = this.__bI;
              this.__bI = null;
            } else {

              window.onerror = null;
            };
          };
        };
      },
      __bL : function(i, j, k){

        if(this.__bH){

          this.handleError(new qx.core.WindowError(i, j, k));
        };
      },
      observeMethod : function(l){

        if(this.__bK()){

          var self = this;
          return function(){

            if(!self.__bH){

              return l.apply(this, arguments);
            };
            try{

              return l.apply(this, arguments);
            } catch(m) {

              self.handleError(new qx.core.GlobalError(m, arguments));
            };
          };
        } else {

          return l;
        };
      },
      handleError : function(n){

        if(this.__bH){

          this.__bH.call(this.__bJ, n);
        };
      }
    },
    defer : function(o){

      if(qx.core && qx.core.Environment){

        qx.core.Environment.add(a, true);
      } else {

        qx.Bootstrap.setEnvironmentSetting(a, true);
      };
      o.setErrorHandler(null, null);
    }
  });
})();
(function(){

  var a = "",b = "qx.core.WindowError";
  qx.Bootstrap.define(b, {
    extend : Error,
    construct : function(c, e, f){

      var d = Error.call(this, c);
      if(d.stack){

        this.stack = d.stack;
      };
      if(d.stacktrace){

        this.stacktrace = d.stacktrace;
      };
      this.__bM = c;
      this.__bN = e || a;
      this.__bO = f === undefined ? -1 : f;
    },
    members : {
      __bM : null,
      __bN : null,
      __bO : null,
      toString : function(){

        return this.__bM;
      },
      getUri : function(){

        return this.__bN;
      },
      getLineNumber : function(){

        return this.__bO;
      }
    }
  });
})();
(function(){

  var a = "GlobalError: ",b = "qx.core.GlobalError";
  qx.Bootstrap.define(b, {
    extend : Error,
    construct : function(e, c){

      if(qx.Bootstrap.DEBUG){

        qx.core.Assert.assertNotUndefined(e);
      };
      this.__bM = a + (e && e.message ? e.message : e);
      var d = Error.call(this, this.__bM);
      if(d.stack){

        this.stack = d.stack;
      };
      if(d.stacktrace){

        this.stacktrace = d.stacktrace;
      };
      this.__bP = c;
      this.__bQ = e;
    },
    members : {
      __bQ : null,
      __bP : null,
      __bM : null,
      toString : function(){

        return this.__bM;
      },
      getArguments : function(){

        return this.__bP;
      },
      getSourceException : function(){

        return this.__bQ;
      }
    },
    destruct : function(){

      this.__bQ = null;
      this.__bP = null;
      this.__bM = null;
    }
  });
})();
(function(){

  var a = "\x00\b\n\f\r\t",b = "-",c = "function",d = "[null,null,null]",e = "T",f = "+",g = ",\n",h = "constructor",i = "{\n",j = '"+275760-09-13T00:00:00.000Z"',k = "true",l = "\\n",m = "false",n = '"-271821-04-20T00:00:00.000Z"',o = "json",p = 'object',q = '""',r = "qx.lang.Json",s = "{}",t = "hasOwnProperty",u = "@",v = "prototype",w = 'hasOwnProperty',x = '"',y = "toLocaleString",z = "0",A = 'function',B = "",C = '\\"',D = "\t",E = "string",F = "}",G = "\r",H = "toJSON",I = ":",J = "[\n 1,\n 2\n]",K = "\\f",L = '"1969-12-31T23:59:59.999Z"',M = "/",N = "\\b",O = "Z",P = "\\t",Q = "\b",R = "[object Number]",S = "isPrototypeOf",T = "{",U = "toString",V = "0x",W = "[1]",X = "\\r",Y = "]",bO = ",",bP = "null",bQ = "\\u00",bK = "\n",bL = "json-stringify",bM = "[]",bN = "1",bU = "000000",bV = "[object Boolean]",bW = "valueOf",cm = "\\\\",bR = "[object String]",bS = "json-parse",bT = "bug-string-char-index",bG = "[object Array]",ca = "$",bJ = "[\n",cb = '"-000001-01-01T00:00:00.000Z"',cc = "[",bI = "[null]",bX = "\\",cl = "[object Date]",bY = '{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}',cd = "a",ce = " ",cf = ".",ci = "[object Function]",cj = "01",ck = '"\t"',bH = "propertyIsEnumerable",cg = "\f",ch = "object";
  qx.Bootstrap.define(r, {
    statics : {
      stringify : null,
      parse : null
    }
  });
  (function(){

    var co;
    var cn;
    var cp;
    (function(window){

      var cr = {
      }.toString,cG,cQ,cC;
      var cy = typeof cp === c && cp.amd,cx = typeof cn == ch && cn;
      if(cx || cy){

        if(typeof JSON == ch && JSON){

          if(cx){

            cx.stringify = JSON.stringify;
            cx.parse = JSON.parse;
          } else {

            cx = JSON;
          };
        } else if(cy){

          cx = window.JSON = {
          };
        };
      } else {

        cx = window.JSON || (window.JSON = {
        });
      };
      var cU = new Date(-3509827334573292);
      try{

        cU = cU.getUTCFullYear() == -109252 && cU.getUTCMonth() === 0 && cU.getUTCDate() === 1 && cU.getUTCHours() == 10 && cU.getUTCMinutes() == 37 && cU.getUTCSeconds() == 6 && cU.getUTCMilliseconds() == 708;
      } catch(da) {
      };
      function cJ(name){

        if(name == bT){

          return cd[0] != cd;
        };
        var de,dd = bY,dh = name == o;
        if(dh || name == bL || name == bS){

          if(name == bL || dh){

            var db = cx.stringify,dg = typeof db == c && cU;
            if(dg){

              (de = function(){

                return 1;
              }).toJSON = de;
              try{

                dg = db(0) === z && db(new Number()) === z && db(new String()) == q && db(cr) === cC && db(cC) === cC && db() === cC && db(de) === bN && db([de]) == W && db([cC]) == bI && db(null) == bP && db([cC, cr, null]) == d && db({
                  "a" : [de, true, false, null, a]
                }) == dd && db(null, de) === bN && db([1, 2], null, 1) == J && db(new Date(-8.64e15)) == n && db(new Date(8.64e15)) == j && db(new Date(-621987552e5)) == cb && db(new Date(-1)) == L;
              } catch(di) {

                dg = false;
              };
            };
            if(!dh){

              return dg;
            };
          };
          if(name == bS || dh){

            var df = cx.parse;
            if(typeof df == c){

              try{

                if(df(z) === 0 && !df(false)){

                  de = df(dd);
                  var dc = de[cd].length == 5 && de[cd][0] === 1;
                  if(dc){

                    try{

                      dc = !df(ck);
                    } catch(dj) {
                    };
                    if(dc){

                      try{

                        dc = df(cj) !== 1;
                      } catch(dk) {
                      };
                    };
                  };
                };
              } catch(dl) {

                dc = false;
              };
            };
            if(!dh){

              return dc;
            };
          };
          return dg && dc;
        };
      };
      if(!cJ(o)){

        var cV = ci;
        var cN = cl;
        var cv = R;
        var cY = bR;
        var cR = bG;
        var cF = bV;
        var cE = cJ(bT);
        if(!cU){

          var cD = Math.floor;
          var cM = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
          var cX = function(dm, dn){

            return cM[dn] + 365 * (dm - 1970) + cD((dm - 1969 + (dn = +(dn > 1))) / 4) - cD((dm - 1901 + dn) / 100) + cD((dm - 1601 + dn) / 400);
          };
        };
        if(!(cG = {
        }.hasOwnProperty)){

          cG = function(dp){

            var dq = {
            },dr;
            if((dq.__bR = null, dq.__bR = {
              "toString" : 1
            }, dq).toString != cr){

              cG = function(ds){

                var dt = this.__bR,du = ds in (this.__bR = null, this);
                this.__bR = dt;
                return du;
              };
            } else {

              dr = dq.constructor;
              cG = function(dv){

                var parent = (this.constructor || dr).prototype;
                return dv in this && !(dv in parent && this[dv] === parent[dv]);
              };
            };
            dq = null;
            return cG.call(this, dp);
          };
        };
        var cH = {
          'boolean' : 1,
          'number' : 1,
          'string' : 1,
          'undefined' : 1
        };
        var cP = function(dy, dw){

          var dx = typeof dy[dw];
          return dx == p ? !!dy[dw] : !cH[dx];
        };
        cQ = function(dz, dA){

          var dF = 0,dE,dC,dD,dB;
          (dE = function(){

            this.valueOf = 0;
          }).prototype.valueOf = 0;
          dC = new dE();
          for(dD in dC){

            if(cG.call(dC, dD)){

              dF++;
            };
          };
          dE = dC = null;
          if(!dF){

            dC = [bW, U, y, bH, S, t, h];
            dB = function(dH, dI){

              var dJ = cr.call(dH) == cV,dK,length;
              var dG = !dJ && typeof dH.constructor != A && cP(dH, w) ? dH.hasOwnProperty : cG;
              for(dK in dH){

                if(!(dJ && dK == v) && dG.call(dH, dK)){

                  dI(dK);
                };
              };
              for(length = dC.length;dK = dC[--length];dG.call(dH, dK) && dI(dK));
            };
          } else if(dF == 2){

            dB = function(dP, dL){

              var dO = {
              },dM = cr.call(dP) == cV,dN;
              for(dN in dP){

                if(!(dM && dN == v) && !cG.call(dO, dN) && (dO[dN] = 1) && cG.call(dP, dN)){

                  dL(dN);
                };
              };
            };
          } else {

            dB = function(dT, dQ){

              var dR = cr.call(dT) == cV,dS,dU;
              for(dS in dT){

                if(!(dR && dS == v) && cG.call(dT, dS) && !(dU = dS === h)){

                  dQ(dS);
                };
              };
              if(dU || cG.call(dT, (dS = h))){

                dQ(dS);
              };
            };
          };
          return dB(dz, dA);
        };
        if(!cJ(bL)){

          var cT = {
            '92' : cm,
            '34' : C,
            '8' : N,
            '12' : K,
            '10' : l,
            '13' : X,
            '9' : P
          };
          var cI = bU;
          var cW = function(dV, dW){

            return (cI + (dW || 0)).slice(-dV);
          };
          var cB = bQ;
          var cL = function(dY){

            var eb = x,dX = 0,length = dY.length,ec = length > 10 && cE,ea;
            if(ec){

              ea = dY.split(B);
            };
            for(;dX < length;dX++){

              var ed = dY.charCodeAt(dX);
              switch(ed){case 8:case 9:case 10:case 12:case 13:case 34:case 92:
              eb += cT[ed];
              break;default:
              if(ed < 32){

                eb += cB + cW(2, ed.toString(16));
                break;
              };
              eb += ec ? ea[dX] : cE ? dY.charAt(dX) : dY[dX];};
            };
            return eb + x;
          };
          var cs = function(ez, eo, ew, el, ek, ex, es){

            var et = eo[ez],ev,ei,ef,er,ey,ep,eA,en,em,ee,eu,ej,length,eg,eq,eh;
            try{

              et = eo[ez];
            } catch(eB) {
            };
            if(typeof et == ch && et){

              ev = cr.call(et);
              if(ev == cN && !cG.call(et, H)){

                if(et > -1 / 0 && et < 1 / 0){

                  if(cX){

                    er = cD(et / 864e5);
                    for(ei = cD(er / 365.2425) + 1970 - 1;cX(ei + 1, 0) <= er;ei++);
                    for(ef = cD((er - cX(ei, 0)) / 30.42);cX(ei, ef + 1) <= er;ef++);
                    er = 1 + er - cX(ei, ef);
                    ey = (et % 864e5 + 864e5) % 864e5;
                    ep = cD(ey / 36e5) % 24;
                    eA = cD(ey / 6e4) % 60;
                    en = cD(ey / 1e3) % 60;
                    em = ey % 1e3;
                  } else {

                    ei = et.getUTCFullYear();
                    ef = et.getUTCMonth();
                    er = et.getUTCDate();
                    ep = et.getUTCHours();
                    eA = et.getUTCMinutes();
                    en = et.getUTCSeconds();
                    em = et.getUTCMilliseconds();
                  };
                  et = (ei <= 0 || ei >= 1e4 ? (ei < 0 ? b : f) + cW(6, ei < 0 ? -ei : ei) : cW(4, ei)) + b + cW(2, ef + 1) + b + cW(2, er) + e + cW(2, ep) + I + cW(2, eA) + I + cW(2, en) + cf + cW(3, em) + O;
                } else {

                  et = null;
                };
              } else if(typeof et.toJSON == c && ((ev != cv && ev != cY && ev != cR) || cG.call(et, H))){

                et = et.toJSON(ez);
              };
            };
            if(ew){

              et = ew.call(eo, ez, et);
            };
            if(et === null){

              return bP;
            };
            ev = cr.call(et);
            if(ev == cF){

              return B + et;
            } else if(ev == cv){

              return et > -1 / 0 && et < 1 / 0 ? B + et : bP;
            } else if(ev == cY){

              return cL(B + et);
            };;
            if(typeof et == ch){

              for(length = es.length;length--;){

                if(es[length] === et){

                  throw TypeError();
                };
              };
              es.push(et);
              ee = [];
              eg = ex;
              ex += ek;
              if(ev == cR){

                for(ej = 0,length = et.length;ej < length;eq || (eq = true),ej++){

                  eu = cs(ej, et, ew, el, ek, ex, es);
                  ee.push(eu === cC ? bP : eu);
                };
                eh = eq ? (ek ? bJ + ex + ee.join(g + ex) + bK + eg + Y : (cc + ee.join(bO) + Y)) : bM;
              } else {

                cQ(el || et, function(eC){

                  var eD = cs(eC, et, ew, el, ek, ex, es);
                  if(eD !== cC){

                    ee.push(cL(eC) + I + (ek ? ce : B) + eD);
                  };
                  eq || (eq = true);
                });
                eh = eq ? (ek ? i + ex + ee.join(g + ex) + bK + eg + F : (T + ee.join(bO) + F)) : s;
              };
              es.pop();
              return eh;
            };
          };
          cx.stringify = function(eK, eJ, eL){

            var eF,eG,eI;
            if(typeof eJ == c || typeof eJ == ch && eJ){

              if(cr.call(eJ) == cV){

                eG = eJ;
              } else if(cr.call(eJ) == cR){

                eI = {
                };
                for(var eE = 0,length = eJ.length,eH;eE < length;eH = eJ[eE++],((cr.call(eH) == cY || cr.call(eH) == cv) && (eI[eH] = 1)));
              };
            };
            if(eL){

              if(cr.call(eL) == cv){

                if((eL -= eL % 1) > 0){

                  for(eF = B,eL > 10 && (eL = 10);eF.length < eL;eF += ce);
                };
              } else if(cr.call(eL) == cY){

                eF = eL.length <= 10 ? eL : eL.slice(0, 10);
              };
            };
            return cs(B, (eH = {
            }, eH[B] = eK, eH), eG, eI, eF, B, []);
          };
        };
        if(!cJ(bS)){

          var cA = String.fromCharCode;
          var cz = {
            '92' : bX,
            '34' : x,
            '47' : M,
            '98' : Q,
            '116' : D,
            '110' : bK,
            '102' : cg,
            '114' : G
          };
          var cq,cu;
          var cw = function(){

            cq = cu = null;
            throw SyntaxError();
          };
          var cS = function(){

            var eO = cu,length = eO.length,eN,eM,eQ,eP,eR;
            while(cq < length){

              eR = eO.charCodeAt(cq);
              switch(eR){case 9:case 10:case 13:case 32:
              cq++;
              break;case 123:case 125:case 91:case 93:case 58:case 44:
              eN = cE ? eO.charAt(cq) : eO[cq];
              cq++;
              return eN;case 34:
              for(eN = u,cq++;cq < length;){

                eR = eO.charCodeAt(cq);
                if(eR < 32){

                  cw();
                } else if(eR == 92){

                  eR = eO.charCodeAt(++cq);
                  switch(eR){case 92:case 34:case 47:case 98:case 116:case 110:case 102:case 114:
                  eN += cz[eR];
                  cq++;
                  break;case 117:
                  eM = ++cq;
                  for(eQ = cq + 4;cq < eQ;cq++){

                    eR = eO.charCodeAt(cq);
                    if(!(eR >= 48 && eR <= 57 || eR >= 97 && eR <= 102 || eR >= 65 && eR <= 70)){

                      cw();
                    };
                  };
                  eN += cA(V + eO.slice(eM, cq));
                  break;default:
                  cw();};
                } else {

                  if(eR == 34){

                    break;
                  };
                  eR = eO.charCodeAt(cq);
                  eM = cq;
                  while(eR >= 32 && eR != 92 && eR != 34){

                    eR = eO.charCodeAt(++cq);
                  };
                  eN += eO.slice(eM, cq);
                };
              };
              if(eO.charCodeAt(cq) == 34){

                cq++;
                return eN;
              };
              cw();default:
              eM = cq;
              if(eR == 45){

                eP = true;
                eR = eO.charCodeAt(++cq);
              };
              if(eR >= 48 && eR <= 57){

                if(eR == 48 && ((eR = eO.charCodeAt(cq + 1)), eR >= 48 && eR <= 57)){

                  cw();
                };
                eP = false;
                for(;cq < length && ((eR = eO.charCodeAt(cq)), eR >= 48 && eR <= 57);cq++);
                if(eO.charCodeAt(cq) == 46){

                  eQ = ++cq;
                  for(;eQ < length && ((eR = eO.charCodeAt(eQ)), eR >= 48 && eR <= 57);eQ++);
                  if(eQ == cq){

                    cw();
                  };
                  cq = eQ;
                };
                eR = eO.charCodeAt(cq);
                if(eR == 101 || eR == 69){

                  eR = eO.charCodeAt(++cq);
                  if(eR == 43 || eR == 45){

                    cq++;
                  };
                  for(eQ = cq;eQ < length && ((eR = eO.charCodeAt(eQ)), eR >= 48 && eR <= 57);eQ++);
                  if(eQ == cq){

                    cw();
                  };
                  cq = eQ;
                };
                return +eO.slice(eM, cq);
              };
              if(eP){

                cw();
              };
              if(eO.slice(cq, cq + 4) == k){

                cq += 4;
                return true;
              } else if(eO.slice(cq, cq + 5) == m){

                cq += 5;
                return false;
              } else if(eO.slice(cq, cq + 4) == bP){

                cq += 4;
                return null;
              };;
              cw();};
            };
            return ca;
          };
          var cK = function(eU){

            var eT,eS;
            if(eU == ca){

              cw();
            };
            if(typeof eU == E){

              if((cE ? eU.charAt(0) : eU[0]) == u){

                return eU.slice(1);
              };
              if(eU == cc){

                eT = [];
                for(;;eS || (eS = true)){

                  eU = cS();
                  if(eU == Y){

                    break;
                  };
                  if(eS){

                    if(eU == bO){

                      eU = cS();
                      if(eU == Y){

                        cw();
                      };
                    } else {

                      cw();
                    };
                  };
                  if(eU == bO){

                    cw();
                  };
                  eT.push(cK(eU));
                };
                return eT;
              } else if(eU == T){

                eT = {
                };
                for(;;eS || (eS = true)){

                  eU = cS();
                  if(eU == F){

                    break;
                  };
                  if(eS){

                    if(eU == bO){

                      eU = cS();
                      if(eU == F){

                        cw();
                      };
                    } else {

                      cw();
                    };
                  };
                  if(eU == bO || typeof eU != E || (cE ? eU.charAt(0) : eU[0]) != u || cS() != I){

                    cw();
                  };
                  eT[eU.slice(1)] = cK(cS());
                };
                return eT;
              };
              cw();
            };
            return eU;
          };
          var cO = function(eV, eW, eX){

            var eY = ct(eV, eW, eX);
            if(eY === cC){

              delete eV[eW];
            } else {

              eV[eW] = eY;
            };
          };
          var ct = function(fa, fb, fd){

            var fc = fa[fb],length;
            if(typeof fc == ch && fc){

              if(cr.call(fc) == cR){

                for(length = fc.length;length--;){

                  cO(fc, length, fd);
                };
              } else {

                cQ(fc, function(fe){

                  cO(fc, fe, fd);
                });
              };
            };
            return fd.call(fa, fb, fc);
          };
          cx.parse = function(ff, fi){

            var fg,fh;
            cq = 0;
            cu = B + ff;
            fg = cK(cS());
            if(cS() != ca){

              cw();
            };
            cq = cu = null;
            return fi && cr.call(fi) == cV ? ct((fh = {
            }, fh[B] = fg, fh), B, fi) : fg;
          };
        };
      };
      if(cy){

        cp(function(){

          return cx;
        });
      };
    }(this));
  }());
  qx.lang.Json.stringify = window.JSON.stringify;
  qx.lang.Json.parse = window.JSON.parse;
})();
(function(){

  var a = ": ",b = "qx.type.BaseError",c = "",d = "error";
  qx.Bootstrap.define(b, {
    extend : Error,
    construct : function(e, f){

      var g = Error.call(this, f);
      if(g.stack){

        this.stack = g.stack;
      };
      if(g.stacktrace){

        this.stacktrace = g.stacktrace;
      };
      this.__bS = e || c;
      this.message = f || qx.type.BaseError.DEFAULTMESSAGE;
    },
    statics : {
      DEFAULTMESSAGE : d
    },
    members : {
      __bT : null,
      __bS : null,
      message : null,
      getComment : function(){

        return this.__bS;
      },
      toString : function(){

        return this.__bS + (this.message ? a + this.message : c);
      }
    }
  });
})();
(function(){

  var a = "qx.core.AssertionError";
  qx.Bootstrap.define(a, {
    extend : qx.type.BaseError,
    construct : function(b, c){

      qx.type.BaseError.call(this, b, c);
      this.__bU = qx.dev.StackTrace.getStackTrace();
    },
    members : {
      __bU : null,
      getStackTrace : function(){

        return this.__bU;
      }
    }
  });
})();
(function(){

  var a = "anonymous",b = "...",c = "qx.dev.StackTrace",d = "",e = "\n",f = "?",g = "/source/class/",h = "Error created at",j = "ecmascript.error.stacktrace",k = "Backtrace:",l = "stack",m = ":",n = ".",o = "function",p = "prototype",q = "stacktrace";
  qx.Bootstrap.define(c, {
    statics : {
      FILENAME_TO_CLASSNAME : null,
      FORMAT_STACKTRACE : null,
      getStackTrace : function(){

        var t = [];
        try{

          throw new Error();
        } catch(G) {

          if(qx.dev.StackTrace.hasEnvironmentCheck && qx.core.Environment.get(j)){

            var y = qx.dev.StackTrace.getStackTraceFromError(G);
            var B = qx.dev.StackTrace.getStackTraceFromCaller(arguments);
            qx.lang.Array.removeAt(y, 0);
            t = B.length > y.length ? B : y;
            for(var i = 0;i < Math.min(B.length, y.length);i++){

              var w = B[i];
              if(w.indexOf(a) >= 0){

                continue;
              };
              var s = null;
              var C = w.split(n);
              var v = /(.*?)\(/.exec(C[C.length - 1]);
              if(v && v.length == 2){

                s = v[1];
                C.pop();
              };
              if(C[C.length - 1] == p){

                C.pop();
              };
              var E = C.join(n);
              var u = y[i];
              var F = u.split(m);
              var A = F[0];
              var z = F[1];
              var r;
              if(F[2]){

                r = F[2];
              };
              var x = null;
              if(qx.Class && qx.Class.getByName(A)){

                x = A;
              } else {

                x = E;
              };
              var D = x;
              if(s){

                D += n + s;
              };
              D += m + z;
              if(r){

                D += m + r;
              };
              t[i] = D;
            };
          } else {

            t = this.getStackTraceFromCaller(arguments);
          };
        };
        return t;
      },
      getStackTraceFromCaller : function(K){

        var J = [];
        var M = qx.lang.Function.getCaller(K);
        var H = {
        };
        while(M){

          var L = qx.lang.Function.getName(M);
          J.push(L);
          try{

            M = M.caller;
          } catch(N) {

            break;
          };
          if(!M){

            break;
          };
          var I = qx.core.ObjectRegistry.toHashCode(M);
          if(H[I]){

            J.push(b);
            break;
          };
          H[I] = M;
        };
        return J;
      },
      getStackTraceFromError : function(bd){

        var T = [];
        var R,S,ba,Q,P,bf,bb;
        var bc = qx.dev.StackTrace.hasEnvironmentCheck ? qx.core.Environment.get(j) : null;
        if(bc === l){

          if(!bd.stack){

            return T;
          };
          R = /@(.+):(\d+)$/gm;
          while((S = R.exec(bd.stack)) != null){

            bb = S[1];
            Q = S[2];
            ba = this.__bV(bb);
            T.push(ba + m + Q);
          };
          if(T.length > 0){

            return this.__bX(T);
          };
          R = /at (.*)/gm;
          var be = /\((.*?)(:[^\/].*)\)/;
          var Y = /(.*?)(:[^\/].*)/;
          while((S = R.exec(bd.stack)) != null){

            var X = be.exec(S[1]);
            if(!X){

              X = Y.exec(S[1]);
            };
            if(X){

              ba = this.__bV(X[1]);
              T.push(ba + X[2]);
            } else {

              T.push(S[1]);
            };
          };
        } else if(bc === q){

          var U = bd.stacktrace;
          if(!U){

            return T;
          };
          if(U.indexOf(h) >= 0){

            U = U.split(h)[0];
          };
          R = /line\ (\d+?),\ column\ (\d+?)\ in\ (?:.*?)\ in\ (.*?):[^\/]/gm;
          while((S = R.exec(U)) != null){

            Q = S[1];
            P = S[2];
            bb = S[3];
            ba = this.__bV(bb);
            T.push(ba + m + Q + m + P);
          };
          if(T.length > 0){

            return this.__bX(T);
          };
          R = /Line\ (\d+?)\ of\ linked\ script\ (.*?)$/gm;
          while((S = R.exec(U)) != null){

            Q = S[1];
            bb = S[2];
            ba = this.__bV(bb);
            T.push(ba + m + Q);
          };
        } else if(bd.message && bd.message.indexOf(k) >= 0){

          var W = bd.message.split(k)[1].trim();
          var V = W.split(e);
          for(var i = 0;i < V.length;i++){

            var O = V[i].match(/\s*Line ([0-9]+) of.* (\S.*)/);
            if(O && O.length >= 2){

              Q = O[1];
              bf = this.__bV(O[2]);
              T.push(bf + m + Q);
            };
          };
        } else if(bd.sourceURL && bd.line){

          T.push(this.__bV(bd.sourceURL) + m + bd.line);
        };;;
        return this.__bX(T);
      },
      __bV : function(bh){

        if(typeof qx.dev.StackTrace.FILENAME_TO_CLASSNAME == o){

          var bg = qx.dev.StackTrace.FILENAME_TO_CLASSNAME(bh);
          {
          };
          return bg;
        };
        return qx.dev.StackTrace.__bW(bh);
      },
      __bW : function(bk){

        var bl = g;
        var bi = bk.indexOf(bl);
        var bm = bk.indexOf(f);
        if(bm >= 0){

          bk = bk.substring(0, bm);
        };
        var bj = (bi == -1) ? bk : bk.substring(bi + bl.length).replace(/\//g, n).replace(/\.js$/, d);
        return bj;
      },
      __bX : function(bn){

        if(typeof qx.dev.StackTrace.FORMAT_STACKTRACE == o){

          bn = qx.dev.StackTrace.FORMAT_STACKTRACE(bn);
          {
          };
        };
        return bn;
      }
    },
    defer : function(bo){

      bo.hasEnvironmentCheck = qx.bom && qx.bom.client && qx.bom.client.EcmaScript && qx.bom.client.EcmaScript.getStackTrace;
    }
  });
})();
(function(){

  var c = "-",d = "",e = "qx.core.ObjectRegistry",f = "Disposed ",g = "$$hash",h = "-0",j = " objects",k = "Could not dispose object ",m = ": ";
  qx.Bootstrap.define(e, {
    statics : {
      inShutDown : false,
      __G : {
      },
      __bY : 0,
      __ca : [],
      __cb : d,
      __cc : {
      },
      register : function(n){

        var q = this.__G;
        if(!q){

          return;
        };
        var p = n.$$hash;
        if(p == null){

          var o = this.__ca;
          if(o.length > 0 && true){

            p = o.pop();
          } else {

            p = (this.__bY++) + this.__cb;
          };
          n.$$hash = p;
          {
          };
        };
        {
        };
        q[p] = n;
      },
      unregister : function(r){

        var s = r.$$hash;
        if(s == null){

          return;
        };
        var t = this.__G;
        if(t && t[s]){

          delete t[s];
          this.__ca.push(s);
        };
        try{

          delete r.$$hash;
        } catch(u) {

          if(r.removeAttribute){

            r.removeAttribute(g);
          };
        };
      },
      toHashCode : function(v){

        {
        };
        var x = v.$$hash;
        if(x != null){

          return x;
        };
        var w = this.__ca;
        if(w.length > 0){

          x = w.pop();
        } else {

          x = (this.__bY++) + this.__cb;
        };
        return v.$$hash = x;
      },
      clearHashCode : function(y){

        {
        };
        var z = y.$$hash;
        if(z != null){

          this.__ca.push(z);
          try{

            delete y.$$hash;
          } catch(A) {

            if(y.removeAttribute){

              y.removeAttribute(g);
            };
          };
        };
      },
      fromHashCode : function(B){

        return this.__G[B] || null;
      },
      shutdown : function(){

        this.inShutDown = true;
        var D = this.__G;
        var F = [];
        for(var C in D){

          F.push(C);
        };
        F.sort(function(a, b){

          return parseInt(b, 10) - parseInt(a, 10);
        });
        var E,i = 0,l = F.length;
        while(true){

          try{

            for(;i < l;i++){

              C = F[i];
              E = D[C];
              if(E && E.dispose){

                E.dispose();
              };
            };
          } catch(G) {

            qx.Bootstrap.error(this, k + E.toString() + m + G, G);
            if(i !== l){

              i++;
              continue;
            };
          };
          break;
        };
        qx.Bootstrap.debug(this, f + l + j);
        delete this.__G;
      },
      getRegistry : function(){

        return this.__G;
      },
      getNextHash : function(){

        return this.__bY;
      },
      getPostId : function(){

        return this.__cb;
      },
      getStackTraces : function(){

        return this.__cc;
      }
    },
    defer : function(H){

      if(window && window.top){

        var frames = window.top.frames;
        for(var i = 0;i < frames.length;i++){

          if(frames[i] === window){

            H.__cb = c + (i + 1);
            return;
          };
        };
      };
      H.__cb = h;
    }
  });
})();
(function(){

  var a = "[object Opera]",b = "function",c = "[^\\.0-9]",d = "4.0",e = "gecko",f = "1.9.0.0",g = "Version/",h = "9.0",i = "8.0",j = "Gecko",k = "Maple",l = "AppleWebKit/",m = "Trident",n = "Unsupported client: ",o = "",p = "opera",q = "engine.version",r = "! Assumed gecko version 1.9.0.0 (Firefox 3.0).",s = "mshtml",t = "engine.name",u = "webkit",v = "5.0",w = ".",x = "qx.bom.client.Engine";
  qx.Bootstrap.define(x, {
    statics : {
      getVersion : function(){

        var A = window.navigator.userAgent;
        var B = o;
        if(qx.bom.client.Engine.__cd()){

          if(/Opera[\s\/]([0-9]+)\.([0-9])([0-9]*)/.test(A)){

            if(A.indexOf(g) != -1){

              var D = A.match(/Version\/(\d+)\.(\d+)/);
              B = D[1] + w + D[2].charAt(0) + w + D[2].substring(1, D[2].length);
            } else {

              B = RegExp.$1 + w + RegExp.$2;
              if(RegExp.$3 != o){

                B += w + RegExp.$3;
              };
            };
          };
        } else if(qx.bom.client.Engine.__ce()){

          if(/AppleWebKit\/([^ ]+)/.test(A)){

            B = RegExp.$1;
            var C = RegExp(c).exec(B);
            if(C){

              B = B.slice(0, C.index);
            };
          };
        } else if(qx.bom.client.Engine.__cg() || qx.bom.client.Engine.__cf()){

          if(/rv\:([^\);]+)(\)|;)/.test(A)){

            B = RegExp.$1;
          };
        } else if(qx.bom.client.Engine.__ch()){

          var z = /Trident\/([^\);]+)(\)|;)/.test(A);
          if(/MSIE\s+([^\);]+)(\)|;)/.test(A)){

            B = RegExp.$1;
            if(B < 8 && z){

              if(RegExp.$1 == d){

                B = i;
              } else if(RegExp.$1 == v){

                B = h;
              };
            };
          } else if(z){

            var D = /\brv\:(\d+?\.\d+?)\b/.exec(A);
            if(D){

              B = D[1];
            };
          };
        } else {

          var y = window.qxFail;
          if(y && typeof y === b){

            B = y().FULLVERSION;
          } else {

            B = f;
            qx.Bootstrap.warn(n + A + r);
          };
        };;;
        return B;
      },
      getName : function(){

        var name;
        if(qx.bom.client.Engine.__cd()){

          name = p;
        } else if(qx.bom.client.Engine.__ce()){

          name = u;
        } else if(qx.bom.client.Engine.__cg() || qx.bom.client.Engine.__cf()){

          name = e;
        } else if(qx.bom.client.Engine.__ch()){

          name = s;
        } else {

          var E = window.qxFail;
          if(E && typeof E === b){

            name = E().NAME;
          } else {

            name = e;
            qx.Bootstrap.warn(n + window.navigator.userAgent + r);
          };
        };;;
        return name;
      },
      __cd : function(){

        return window.opera && Object.prototype.toString.call(window.opera) == a;
      },
      __ce : function(){

        return window.navigator.userAgent.indexOf(l) != -1;
      },
      __cf : function(){

        return window.navigator.userAgent.indexOf(k) != -1;
      },
      __cg : function(){

        return window.navigator.mozApps && window.navigator.product === j && window.navigator.userAgent.indexOf(k) == -1 && window.navigator.userAgent.indexOf(m) == -1;
      },
      __ch : function(){

        return window.navigator.cpuClass && (/MSIE\s+([^\);]+)(\)|;)/.test(window.navigator.userAgent) || /Trident\/\d+?\.\d+?/.test(window.navigator.userAgent));
      }
    },
    defer : function(F){

      qx.core.Environment.add(q, F.getVersion);
      qx.core.Environment.add(t, F.getName);
    }
  });
})();
(function(){

  var a = "qx.log.Logger",b = "[",c = "...(+",d = "array",e = ")",f = "info",g = "node",h = "instance",j = "string",k = "null",m = "error",n = "#",o = "class",p = ": ",q = "warn",r = "document",s = "{...(",t = "",u = "number",v = "stringify",w = "]",x = "date",y = "unknown",z = "function",A = "text[",B = "[...(",C = "boolean",D = "\n",E = ")}",F = "debug",G = ")]",H = "map",I = "undefined",J = "object";
  qx.Bootstrap.define(a, {
    statics : {
      __ci : F,
      setLevel : function(K){

        this.__ci = K;
      },
      getLevel : function(){

        return this.__ci;
      },
      setTreshold : function(L){

        this.__cl.setMaxMessages(L);
      },
      getTreshold : function(){

        return this.__cl.getMaxMessages();
      },
      __cj : {
      },
      __ck : 0,
      register : function(P){

        if(P.$$id){

          return;
        };
        var M = this.__ck++;
        this.__cj[M] = P;
        P.$$id = M;
        var N = this.__cm;
        var O = this.__cl.getAllLogEvents();
        for(var i = 0,l = O.length;i < l;i++){

          if(N[O[i].level] >= N[this.__ci]){

            P.process(O[i]);
          };
        };
      },
      unregister : function(Q){

        var R = Q.$$id;
        if(R == null){

          return;
        };
        delete this.__cj[R];
        delete Q.$$id;
      },
      debug : function(T, S){

        qx.log.Logger.__cn(F, arguments);
      },
      info : function(V, U){

        qx.log.Logger.__cn(f, arguments);
      },
      warn : function(X, W){

        qx.log.Logger.__cn(q, arguments);
      },
      error : function(ba, Y){

        qx.log.Logger.__cn(m, arguments);
      },
      trace : function(bb){

        var bc = qx.dev.StackTrace.getStackTrace();
        qx.log.Logger.__cn(f, [(typeof bb !== I ? [bb].concat(bc) : bc).join(D)]);
      },
      deprecatedMethodWarning : function(bf, bd){

        {

          var be;
        };
      },
      deprecatedClassWarning : function(bi, bg){

        {

          var bh;
        };
      },
      deprecatedEventWarning : function(bl, event, bj){

        {

          var bk;
        };
      },
      deprecatedMixinWarning : function(bn, bm){

        {

          var bo;
        };
      },
      deprecatedConstantWarning : function(bs, bq, bp){

        {

          var self,br;
        };
      },
      deprecateMethodOverriding : function(bv, bu, bw, bt){

        {

          var bx;
        };
      },
      clear : function(){

        this.__cl.clearHistory();
      },
      __cl : new qx.log.appender.RingBuffer(50),
      __cm : {
        debug : 0,
        info : 1,
        warn : 2,
        error : 3
      },
      __cn : function(bz, bB){

        var bE = this.__cm;
        if(bE[bz] < bE[this.__ci]){

          return;
        };
        var by = bB.length < 2 ? null : bB[0];
        var bD = by ? 1 : 0;
        var bA = [];
        for(var i = bD,l = bB.length;i < l;i++){

          bA.push(this.__cp(bB[i], true));
        };
        var bF = new Date;
        var bG = {
          time : bF,
          offset : bF - qx.Bootstrap.LOADSTART,
          level : bz,
          items : bA,
          win : window
        };
        if(by){

          if(by.$$hash !== undefined){

            bG.object = by.$$hash;
          } else if(by.$$type){

            bG.clazz = by;
          } else if(by.constructor){

            bG.clazz = by.constructor;
          };;
        };
        this.__cl.process(bG);
        var bC = this.__cj;
        for(var bH in bC){

          bC[bH].process(bG);
        };
      },
      __co : function(bJ){

        if(bJ === undefined){

          return I;
        } else if(bJ === null){

          return k;
        };
        if(bJ.$$type){

          return o;
        };
        var bI = typeof bJ;
        if(bI === z || bI == j || bI === u || bI === C){

          return bI;
        } else if(bI === J){

          if(bJ.nodeType){

            return g;
          } else if(bJ instanceof Error || (bJ.name && bJ.message)){

            return m;
          } else if(bJ.classname){

            return h;
          } else if(bJ instanceof Array){

            return d;
          } else if(bJ instanceof Date){

            return x;
          } else {

            return H;
          };;;;
        };
        if(bJ.toString){

          return v;
        };
        return y;
      },
      __cp : function(bP, bO){

        var bS = this.__co(bP);
        var bM = y;
        var bL = [];
        switch(bS){case k:case I:
        bM = bS;
        break;case j:case u:case C:case x:
        bM = bP;
        break;case g:
        if(bP.nodeType === 9){

          bM = r;
        } else if(bP.nodeType === 3){

          bM = A + bP.nodeValue + w;
        } else if(bP.nodeType === 1){

          bM = bP.nodeName.toLowerCase();
          if(bP.id){

            bM += n + bP.id;
          };
        } else {

          bM = g;
        };;
        break;case z:
        bM = qx.lang.Function.getName(bP) || bS;
        break;case h:
        bM = bP.basename + b + bP.$$hash + w;
        break;case o:case v:
        bM = bP.toString();
        break;case m:
        bL = qx.dev.StackTrace.getStackTraceFromError(bP);
        bM = (bP.basename ? bP.basename + p : t) + bP.toString();
        break;case d:
        if(bO){

          bM = [];
          for(var i = 0,l = bP.length;i < l;i++){

            if(bM.length > 20){

              bM.push(c + (l - i) + e);
              break;
            };
            bM.push(this.__cp(bP[i], false));
          };
        } else {

          bM = B + bP.length + G;
        };
        break;case H:
        if(bO){

          var bK;
          var bR = [];
          for(var bQ in bP){

            bR.push(bQ);
          };
          bR.sort();
          bM = [];
          for(var i = 0,l = bR.length;i < l;i++){

            if(bM.length > 20){

              bM.push(c + (l - i) + e);
              break;
            };
            bQ = bR[i];
            bK = this.__cp(bP[bQ], false);
            bK.key = bQ;
            bM.push(bK);
          };
        } else {

          var bN = 0;
          for(var bQ in bP){

            bN++;
          };
          bM = s + bN + E;
        };
        break;};
        return {
          type : bS,
          text : bM,
          trace : bL
        };
      }
    },
    defer : function(bT){

      var bU = qx.Bootstrap.$$logs;
      for(var i = 0;i < bU.length;i++){

        bT.__cn(bU[i][0], bU[i][1]);
      };
      qx.Bootstrap.debug = bT.debug;
      qx.Bootstrap.info = bT.info;
      qx.Bootstrap.warn = bT.warn;
      qx.Bootstrap.error = bT.error;
      qx.Bootstrap.trace = bT.trace;
    }
  });
})();
(function(){

  var a = "qx.event.type.Data",b = "qx.event.type.Event",c = "qx.data.IListData";
  qx.Interface.define(c, {
    events : {
      "change" : a,
      "changeLength" : b
    },
    members : {
      getItem : function(d){
      },
      setItem : function(e, f){
      },
      splice : function(g, h, i){
      },
      contains : function(j){
      },
      getLength : function(){
      },
      toArray : function(){
      }
    }
  });
})();
(function(){

  var a = "qx.core.ValidationError";
  qx.Class.define(a, {
    extend : qx.type.BaseError
  });
})();
(function(){

  var a = "qx.core.MProperty",b = "get",c = "reset",d = "No such property: ",e = "set";
  qx.Mixin.define(a, {
    members : {
      set : function(g, h){

        var f = qx.core.Property.$$method.set;
        if(qx.Bootstrap.isString(g)){

          if(!this[f[g]]){

            if(this[e + qx.Bootstrap.firstUp(g)] != undefined){

              this[e + qx.Bootstrap.firstUp(g)](h);
              return this;
            };
            throw new Error(d + g);
          };
          return this[f[g]](h);
        } else {

          for(var i in g){

            if(!this[f[i]]){

              if(this[e + qx.Bootstrap.firstUp(i)] != undefined){

                this[e + qx.Bootstrap.firstUp(i)](g[i]);
                continue;
              };
              throw new Error(d + i);
            };
            this[f[i]](g[i]);
          };
          return this;
        };
      },
      get : function(k){

        var j = qx.core.Property.$$method.get;
        if(!this[j[k]]){

          if(this[b + qx.Bootstrap.firstUp(k)] != undefined){

            return this[b + qx.Bootstrap.firstUp(k)]();
          };
          throw new Error(d + k);
        };
        return this[j[k]]();
      },
      reset : function(m){

        var l = qx.core.Property.$$method.reset;
        if(!this[l[m]]){

          if(this[c + qx.Bootstrap.firstUp(m)] != undefined){

            this[c + qx.Bootstrap.firstUp(m)]();
            return;
          };
          throw new Error(d + m);
        };
        this[l[m]]();
      }
    }
  });
})();
(function(){

  var a = "info",b = "debug",c = "warn",d = "qx.core.MLogging",e = "error";
  qx.Mixin.define(d, {
    members : {
      __cq : qx.log.Logger,
      debug : function(f){

        this.__cr(b, arguments);
      },
      info : function(g){

        this.__cr(a, arguments);
      },
      warn : function(h){

        this.__cr(c, arguments);
      },
      error : function(i){

        this.__cr(e, arguments);
      },
      trace : function(){

        this.__cq.trace(this);
      },
      __cr : function(j, l){

        var k = qx.lang.Array.fromArguments(l);
        k.unshift(this);
        this.__cq[j].apply(this.__cq, k);
      }
    }
  });
})();
(function(){

  var a = "function",b = 'loadeddata',c = "pointerover",d = 'pause',f = "transitionend",g = "gecko",h = "browser.name",j = 'timeupdate',k = 'canplay',m = "HTMLEvents",n = 'loadedmetadata',o = "css.transition",p = "mobile safari",q = "return;",r = "browser.documentmode",s = "safari",t = 'play',u = 'ended',v = "",w = "qx.bom.Event",x = 'playing',y = "mouseover",z = "end-event",A = "mshtml",B = "engine.name",C = 'progress',D = "webkit",E = 'volumechange',F = 'seeked',G = "on",H = "undefined";
  qx.Bootstrap.define(w, {
    statics : {
      addNativeListener : function(L, K, I, J){

        if(L.addEventListener){

          L.addEventListener(K, I, !!J);
        } else if(L.attachEvent){

          L.attachEvent(G + K, I);
        } else if(typeof L[G + K] != H){

          L[G + K] = I;
        } else {

          {
          };
        };;
      },
      removeNativeListener : function(P, O, M, N){

        if(P.removeEventListener){

          P.removeEventListener(O, M, !!N);
        } else if(P.detachEvent){

          try{

            P.detachEvent(G + O, M);
          } catch(e) {

            if(e.number !== -2146828218){

              throw e;
            };
          };
        } else if(typeof P[G + O] != H){

          P[G + O] = null;
        } else {

          {
          };
        };;
      },
      getTarget : function(e){

        return e.target || e.srcElement;
      },
      getRelatedTarget : function(e){

        if(e.relatedTarget !== undefined){

          if((qx.core.Environment.get(B) == g)){

            try{

              e.relatedTarget && e.relatedTarget.nodeType;
            } catch(Q) {

              return null;
            };
          };
          return e.relatedTarget;
        } else if(e.fromElement !== undefined && (e.type === y || e.type === c)){

          return e.fromElement;
        } else if(e.toElement !== undefined){

          return e.toElement;
        } else {

          return null;
        };;
      },
      preventDefault : function(e){

        if(e.preventDefault){

          e.preventDefault();
        } else {

          try{

            e.keyCode = 0;
          } catch(R) {
          };
          e.returnValue = false;
        };
      },
      stopPropagation : function(e){

        if(e.stopPropagation){

          e.stopPropagation();
        } else {

          e.cancelBubble = true;
        };
      },
      fire : function(U, S){

        if(document.createEvent){

          var T = document.createEvent(m);
          T.initEvent(S, true, true);
          return !U.dispatchEvent(T);
        } else {

          var T = document.createEventObject();
          return U.fireEvent(G + S, T);
        };
      },
      supportsEvent : function(V, be){

        var ba = qx.core.Environment.get(h);
        var bb = qx.core.Environment.get(B);
        if(be.toLowerCase().indexOf(f) != -1 && bb === A && qx.core.Environment.get(r) > 9){

          return true;
        };
        var bc = [p, s];
        if(bb === D && bc.indexOf(ba) > -1){

          var W = [b, C, j, F, k, t, x, d, n, u, E];
          if(W.indexOf(be.toLowerCase()) > -1){

            return true;
          };
        };
        if(V != window && be.toLowerCase().indexOf(f) != -1){

          var bd = qx.core.Environment.get(o);
          return (bd && bd[z] == be);
        };
        var X = G + be.toLowerCase();
        var Y = (X in V);
        if(!Y){

          Y = typeof V[X] == a;
          if(!Y && V.setAttribute){

            V.setAttribute(X, q);
            Y = typeof V[X] == a;
            V.removeAttribute(X);
          };
        };
        return Y;
      },
      getEventName : function(bf, bi){

        var bg = [v].concat(qx.bom.Style.VENDOR_PREFIXES);
        for(var i = 0,l = bg.length;i < l;i++){

          var bh = bg[i].toLowerCase();
          if(qx.bom.Event.supportsEvent(bf, bh + bi)){

            return bh ? bh + qx.lang.String.firstUp(bi) : bi;
          };
        };
        return null;
      }
    }
  });
})();
(function(){

  var a = "qx.bom.client.CssTransition",b = "E",c = "transitionEnd",d = "e",e = "nd",f = "transition",g = "css.transition",h = "Trans";
  qx.Bootstrap.define(a, {
    statics : {
      getTransitionName : function(){

        return qx.bom.Style.getPropertyName(f);
      },
      getSupport : function(){

        var name = qx.bom.client.CssTransition.getTransitionName();
        if(!name){

          return null;
        };
        var i = qx.bom.Event.getEventName(window, c);
        i = i == c ? i.toLowerCase() : i;
        if(!i){

          i = name + (name.indexOf(h) > 0 ? b : d) + e;
        };
        return {
          name : name,
          "end-event" : i
        };
      }
    },
    defer : function(j){

      qx.core.Environment.add(g, j.getSupport);
    }
  });
})();
(function(){

  var a = "-",b = "qx.bom.Style",c = "",d = '-',e = "Webkit",f = "ms",g = ":",h = ";",j = "Moz",k = "O",m = "string",n = "Khtml";
  qx.Bootstrap.define(b, {
    statics : {
      VENDOR_PREFIXES : [e, j, k, f, n],
      __cs : {
      },
      __ct : null,
      getPropertyName : function(q){

        var o = document.documentElement.style;
        if(o[q] !== undefined){

          return q;
        };
        for(var i = 0,l = this.VENDOR_PREFIXES.length;i < l;i++){

          var p = this.VENDOR_PREFIXES[i] + qx.lang.String.firstUp(q);
          if(o[p] !== undefined){

            return p;
          };
        };
        return null;
      },
      getCssName : function(r){

        var s = this.__cs[r];
        if(!s){

          s = r.replace(/[A-Z]/g, function(t){

            return (d + t.charAt(0).toLowerCase());
          });
          if((/^ms/.test(s))){

            s = a + s;
          };
          this.__cs[r] = s;
        };
        return s;
      },
      getAppliedStyle : function(A, x, z, v){

        var C = qx.bom.Style.getCssName(x);
        var w = qx.dom.Node.getWindow(A);
        var u = (v !== false) ? [null].concat(this.VENDOR_PREFIXES) : [null];
        for(var i = 0,l = u.length;i < l;i++){

          var y = false;
          var B = u[i] ? a + u[i].toLowerCase() + a + z : z;
          if(qx.bom.Style.__ct){

            y = qx.bom.Style.__ct.call(w, C, B);
          } else {

            A.style.cssText += C + g + B + h;
            y = (typeof A.style[x] == m && A.style[x] !== c);
          };
          if(y){

            return B;
          };
        };
        return null;
      }
    },
    defer : function(D){

      if(window.CSS && window.CSS.supports){

        qx.bom.Style.__ct = window.CSS.supports.bind(window.CSS);
      } else if(window.supportsCSS){

        qx.bom.Style.__ct = window.supportsCSS.bind(window);
      };
    }
  });
})();
(function(){

  var b = "qx.dom.Node",c = "";
  qx.Bootstrap.define(b, {
    statics : {
      ELEMENT : 1,
      ATTRIBUTE : 2,
      TEXT : 3,
      CDATA_SECTION : 4,
      ENTITY_REFERENCE : 5,
      ENTITY : 6,
      PROCESSING_INSTRUCTION : 7,
      COMMENT : 8,
      DOCUMENT : 9,
      DOCUMENT_TYPE : 10,
      DOCUMENT_FRAGMENT : 11,
      NOTATION : 12,
      getDocument : function(d){

        return d.nodeType === this.DOCUMENT ? d : d.ownerDocument || d.document;
      },
      getWindow : function(e){

        if(e.nodeType == null){

          return e;
        };
        if(e.nodeType !== this.DOCUMENT){

          e = e.ownerDocument;
        };
        return e.defaultView || e.parentWindow;
      },
      getDocumentElement : function(f){

        return this.getDocument(f).documentElement;
      },
      getBodyElement : function(g){

        return this.getDocument(g).body;
      },
      isNode : function(h){

        return !!(h && h.nodeType != null);
      },
      isElement : function(j){

        return !!(j && j.nodeType === this.ELEMENT);
      },
      isDocument : function(k){

        return !!(k && k.nodeType === this.DOCUMENT);
      },
      isDocumentFragment : function(l){

        return !!(l && l.nodeType === this.DOCUMENT_FRAGMENT);
      },
      isText : function(m){

        return !!(m && m.nodeType === this.TEXT);
      },
      isWindow : function(n){

        return !!(n && n.history && n.location && n.document);
      },
      isNodeName : function(o, p){

        if(!p || !o || !o.nodeName){

          return false;
        };
        return p.toLowerCase() == qx.dom.Node.getName(o);
      },
      getName : function(q){

        if(!q || !q.nodeName){

          return null;
        };
        return q.nodeName.toLowerCase();
      },
      getText : function(r){

        if(!r || !r.nodeType){

          return null;
        };
        switch(r.nodeType){case 1:
        var i,a = [],s = r.childNodes,length = s.length;
        for(i = 0;i < length;i++){

          a[i] = this.getText(s[i]);
        };
        return a.join(c);case 2:case 3:case 4:
        return r.nodeValue;};
        return null;
      },
      isBlockNode : function(t){

        if(!qx.dom.Node.isElement(t)){

          return false;
        };
        t = qx.dom.Node.getName(t);
        return /^(body|form|textarea|fieldset|ul|ol|dl|dt|dd|li|div|hr|p|h[1-6]|quote|pre|table|thead|tbody|tfoot|tr|td|th|iframe|address|blockquote)$/.test(t);
      }
    }
  });
})();
(function(){

  var a = "rim_tabletos",b = "10.1",c = "Darwin",d = "10.3",e = "os.version",f = "10.7",g = "2003",h = ")",i = "iPhone",j = "android",k = "unix",l = "ce",m = "7",n = "SymbianOS",o = "10.5",p = "os.name",q = "10.9",r = "|",s = "MacPPC",t = "95",u = "iPod",v = "10.8",w = "\.",x = "Win64",y = "linux",z = "me",A = "10.2",B = "Macintosh",C = "Android",D = "Windows",E = "98",F = "ios",G = "vista",H = "8",I = "blackberry",J = "2000",K = "8.1",L = "(",M = "",N = "win",O = "Linux",P = "10.6",Q = "BSD",R = "10.0",S = "10.4",T = "Mac OS X",U = "iPad",V = "X11",W = "xp",X = "symbian",Y = "qx.bom.client.OperatingSystem",bo = "g",bp = "Win32",bq = "osx",bk = "webOS",bl = "RIM Tablet OS",bm = "BlackBerry",bn = "nt4",br = ".",bs = "MacIntel",bt = "webos";
  qx.Bootstrap.define(Y, {
    statics : {
      getName : function(){

        if(!navigator){

          return M;
        };
        var bu = navigator.platform || M;
        var bv = navigator.userAgent || M;
        if(bu.indexOf(D) != -1 || bu.indexOf(bp) != -1 || bu.indexOf(x) != -1){

          return N;
        } else if(bu.indexOf(B) != -1 || bu.indexOf(s) != -1 || bu.indexOf(bs) != -1 || bu.indexOf(T) != -1){

          return bq;
        } else if(bv.indexOf(bl) != -1){

          return a;
        } else if(bv.indexOf(bk) != -1){

          return bt;
        } else if(bu.indexOf(u) != -1 || bu.indexOf(i) != -1 || bu.indexOf(U) != -1){

          return F;
        } else if(bv.indexOf(C) != -1){

          return j;
        } else if(bu.indexOf(O) != -1){

          return y;
        } else if(bu.indexOf(V) != -1 || bu.indexOf(Q) != -1 || bu.indexOf(c) != -1){

          return k;
        } else if(bu.indexOf(n) != -1){

          return X;
        } else if(bu.indexOf(bm) != -1){

          return I;
        };;;;;;;;;
        return M;
      },
      __cu : {
        "Windows NT 6.3" : K,
        "Windows NT 6.2" : H,
        "Windows NT 6.1" : m,
        "Windows NT 6.0" : G,
        "Windows NT 5.2" : g,
        "Windows NT 5.1" : W,
        "Windows NT 5.0" : J,
        "Windows 2000" : J,
        "Windows NT 4.0" : bn,
        "Win 9x 4.90" : z,
        "Windows CE" : l,
        "Windows 98" : E,
        "Win98" : E,
        "Windows 95" : t,
        "Win95" : t,
        "Mac OS X 10_9" : q,
        "Mac OS X 10.9" : q,
        "Mac OS X 10_8" : v,
        "Mac OS X 10.8" : v,
        "Mac OS X 10_7" : f,
        "Mac OS X 10.7" : f,
        "Mac OS X 10_6" : P,
        "Mac OS X 10.6" : P,
        "Mac OS X 10_5" : o,
        "Mac OS X 10.5" : o,
        "Mac OS X 10_4" : S,
        "Mac OS X 10.4" : S,
        "Mac OS X 10_3" : d,
        "Mac OS X 10.3" : d,
        "Mac OS X 10_2" : A,
        "Mac OS X 10.2" : A,
        "Mac OS X 10_1" : b,
        "Mac OS X 10.1" : b,
        "Mac OS X 10_0" : R,
        "Mac OS X 10.0" : R
      },
      getVersion : function(){

        var bw = qx.bom.client.OperatingSystem.__cv(navigator.userAgent);
        if(bw == null){

          bw = qx.bom.client.OperatingSystem.__cw(navigator.userAgent);
        };
        if(bw != null){

          return bw;
        } else {

          return M;
        };
      },
      __cv : function(bx){

        var bA = [];
        for(var bz in qx.bom.client.OperatingSystem.__cu){

          bA.push(bz);
        };
        var bB = new RegExp(L + bA.join(r).replace(/\./g, w) + h, bo);
        var by = bB.exec(bx);
        if(by && by[1]){

          return qx.bom.client.OperatingSystem.__cu[by[1]];
        };
        return null;
      },
      __cw : function(bF){

        var bG = bF.indexOf(C) != -1;
        var bC = bF.match(/(iPad|iPhone|iPod)/i) ? true : false;
        if(bG){

          var bE = new RegExp(/ Android (\d+(?:\.\d+)+)/i);
          var bH = bE.exec(bF);
          if(bH && bH[1]){

            return bH[1];
          };
        } else if(bC){

          var bI = new RegExp(/(CPU|iPhone|iPod) OS (\d+)_(\d+)(?:_(\d+))*\s+/);
          var bD = bI.exec(bF);
          if(bD && bD[2] && bD[3]){

            if(bD[4]){

              return bD[2] + br + bD[3] + br + bD[4];
            } else {

              return bD[2] + br + bD[3];
            };
          };
        };
        return null;
      }
    },
    defer : function(bJ){

      qx.core.Environment.add(p, bJ.getName);
      qx.core.Environment.add(e, bJ.getVersion);
    }
  });
})();
(function(){

  var a = "CSS1Compat",b = "IEMobile",c = " OPR/",d = "msie",e = "android",f = "operamini",g = "gecko",h = "maple",i = "AdobeAIR|Titanium|Fluid|Chrome|Android|Epiphany|Konqueror|iCab|iPad|iPhone|OmniWeb|Maxthon|Pre|PhantomJS|Mobile Safari|Safari",j = "browser.quirksmode",k = "browser.name",l = "trident",m = "mobile chrome",n = ")(/| )([0-9]+\.[0-9])",o = "iemobile",p = "prism|Fennec|Camino|Kmeleon|Galeon|Netscape|SeaMonkey|Namoroka|Firefox",q = "IEMobile|Maxthon|MSIE|Trident",r = "opera mobi",s = "Mobile Safari",t = "Maple",u = "operamobile",v = "ie",w = "mobile safari",x = "qx.bom.client.Browser",y = "(Maple )([0-9]+\.[0-9]+\.[0-9]*)",z = "",A = "opera mini",B = "(",C = "browser.version",D = "opera",E = "ce",F = ")(/|)?([0-9]+\.[0-9])?",G = "mshtml",H = "Opera Mini|Opera Mobi|Opera",I = "webkit",J = "browser.documentmode",K = "5.0",L = "Mobile/";
  qx.Bootstrap.define(x, {
    statics : {
      getName : function(){

        var O = navigator.userAgent;
        var P = new RegExp(B + qx.bom.client.Browser.__cx + F);
        var N = O.match(P);
        if(!N){

          return z;
        };
        var name = N[1].toLowerCase();
        var M = qx.bom.client.Engine.getName();
        if(M === I){

          if(name === e){

            name = m;
          } else if(O.indexOf(s) !== -1 || O.indexOf(L) !== -1){

            name = w;
          } else if(O.indexOf(c) != -1){

            name = D;
          };;
        } else if(M === G){

          if(name === d || name === l){

            name = v;
            if(qx.bom.client.OperatingSystem.getVersion() === E){

              name = o;
            };
            var P = new RegExp(b);
            if(O.match(P)){

              name = o;
            };
          };
        } else if(M === D){

          if(name === r){

            name = u;
          } else if(name === A){

            name = f;
          };
        } else if(M === g){

          if(O.indexOf(t) !== -1){

            name = h;
          };
        };;;
        return name;
      },
      getVersion : function(){

        var S = navigator.userAgent;
        var T = new RegExp(B + qx.bom.client.Browser.__cx + n);
        var Q = S.match(T);
        if(!Q){

          return z;
        };
        var name = Q[1].toLowerCase();
        var R = Q[3];
        if(S.match(/Version(\/| )([0-9]+\.[0-9])/)){

          R = RegExp.$2;
        };
        if(qx.bom.client.Engine.getName() == G){

          R = qx.bom.client.Engine.getVersion();
          if(name === d && qx.bom.client.OperatingSystem.getVersion() == E){

            R = K;
          };
        };
        if(qx.bom.client.Browser.getName() == h){

          T = new RegExp(y);
          Q = S.match(T);
          if(!Q){

            return z;
          };
          R = Q[2];
        };
        if(qx.bom.client.Engine.getName() == I || qx.bom.client.Browser.getName() == D){

          if(S.match(/OPR(\/| )([0-9]+\.[0-9])/)){

            R = RegExp.$2;
          };
        };
        return R;
      },
      getDocumentMode : function(){

        if(document.documentMode){

          return document.documentMode;
        };
        return 0;
      },
      getQuirksMode : function(){

        if(qx.bom.client.Engine.getName() == G && parseFloat(qx.bom.client.Engine.getVersion()) >= 8){

          return qx.bom.client.Engine.DOCUMENT_MODE === 5;
        } else {

          return document.compatMode !== a;
        };
      },
      __cx : {
        "webkit" : i,
        "gecko" : p,
        "mshtml" : q,
        "opera" : H
      }[qx.bom.client.Engine.getName()]
    },
    defer : function(U){

      qx.core.Environment.add(k, U.getName);
      qx.core.Environment.add(C, U.getVersion);
      qx.core.Environment.add(J, U.getDocumentMode);
      qx.core.Environment.add(j, U.getQuirksMode);
    }
  });
})();
(function(){

  var a = "__cD",b = "UNKNOWN_",c = "|bubble",d = "",e = "_",f = "c",g = "|",h = "unload",j = "|capture",k = "DOM_",m = "WIN_",n = "QX_",o = "qx.event.Manager",p = "capture",q = "__cC",r = "DOCUMENT_";
  qx.Class.define(o, {
    extend : Object,
    construct : function(s, t){

      this.__cy = s;
      this.__cz = qx.core.ObjectRegistry.toHashCode(s);
      this.__cA = t;
      if(s.qx !== qx){

        var self = this;
        qx.bom.Event.addNativeListener(s, h, qx.event.GlobalError.observeMethod(function(){

          qx.bom.Event.removeNativeListener(s, h, arguments.callee);
          self.dispose();
        }));
      };
      this.__cB = {
      };
      this.__cC = {
      };
      this.__cD = {
      };
      this.__cE = {
      };
    },
    statics : {
      __cF : 0,
      getNextUniqueId : function(){

        return (this.__cF++) + d;
      }
    },
    members : {
      __cA : null,
      __cB : null,
      __cD : null,
      __cG : null,
      __cC : null,
      __cE : null,
      __cy : null,
      __cz : null,
      getWindow : function(){

        return this.__cy;
      },
      getWindowId : function(){

        return this.__cz;
      },
      getHandler : function(v){

        var u = this.__cC[v.classname];
        if(u){

          return u;
        };
        return this.__cC[v.classname] = new v(this);
      },
      getDispatcher : function(x){

        var w = this.__cD[x.classname];
        if(w){

          return w;
        };
        return this.__cD[x.classname] = new x(this, this.__cA);
      },
      getListeners : function(z, D, y){

        var B = z.$$hash || qx.core.ObjectRegistry.toHashCode(z);
        var E = this.__cB[B];
        if(!E){

          return null;
        };
        var C = D + (y ? j : c);
        var A = E[C];
        return A ? A.concat() : null;
      },
      getAllListeners : function(){

        return this.__cB;
      },
      serializeListeners : function(G){

        var K = G.$$hash || qx.core.ObjectRegistry.toHashCode(G);
        var O = this.__cB[K];
        var J = [];
        if(O){

          var H,N,F,I,L;
          for(var M in O){

            H = M.indexOf(g);
            N = M.substring(0, H);
            F = M.charAt(H + 1) == f;
            I = O[M];
            for(var i = 0,l = I.length;i < l;i++){

              L = I[i];
              J.push({
                self : L.context,
                handler : L.handler,
                type : N,
                capture : F
              });
            };
          };
        };
        return J;
      },
      toggleAttachedEvents : function(R, Q){

        var U = R.$$hash || qx.core.ObjectRegistry.toHashCode(R);
        var X = this.__cB[U];
        if(X){

          var S,W,P,T;
          for(var V in X){

            S = V.indexOf(g);
            W = V.substring(0, S);
            P = V.charCodeAt(S + 1) === 99;
            T = X[V];
            if(Q){

              this.__cH(R, W, P);
            } else {

              this.__cI(R, W, P);
            };
          };
        };
      },
      hasListener : function(ba, be, Y){

        {
        };
        var bc = ba.$$hash || qx.core.ObjectRegistry.toHashCode(ba);
        var bf = this.__cB[bc];
        if(!bf){

          return false;
        };
        var bd = be + (Y ? j : c);
        var bb = bf[bd];
        return !!(bb && bb.length > 0);
      },
      importListeners : function(bg, bi){

        {
        };
        var bm = bg.$$hash || qx.core.ObjectRegistry.toHashCode(bg);
        var bo = this.__cB[bm] = {
        };
        var bk = qx.event.Manager;
        for(var bh in bi){

          var bl = bi[bh];
          var bn = bl.type + (bl.capture ? j : c);
          var bj = bo[bn];
          if(!bj){

            bj = bo[bn] = [];
            this.__cH(bg, bl.type, bl.capture);
          };
          bj.push({
            handler : bl.listener,
            context : bl.self,
            unique : bl.unique || (bk.__cF++) + d
          });
        };
      },
      addListener : function(br, by, bt, self, bp){

        {

          var bv;
        };
        var bq = br.$$hash || qx.core.ObjectRegistry.toHashCode(br);
        var bz = this.__cB[bq];
        if(!bz){

          bz = this.__cB[bq] = {
          };
        };
        var bu = by + (bp ? j : c);
        var bs = bz[bu];
        if(!bs){

          bs = bz[bu] = [];
        };
        if(bs.length === 0){

          this.__cH(br, by, bp);
        };
        var bx = (qx.event.Manager.__cF++) + d;
        var bw = {
          handler : bt,
          context : self,
          unique : bx
        };
        bs.push(bw);
        return bu + g + bx;
      },
      findHandler : function(bE, bN){

        var bL = false,bD = false,bO = false,bA = false;
        var bK;
        if(bE.nodeType === 1){

          bL = true;
          bK = k + bE.tagName.toLowerCase() + e + bN;
        } else if(bE.nodeType === 9){

          bA = true;
          bK = r + bN;
        } else if(bE == this.__cy){

          bD = true;
          bK = m + bN;
        } else if(bE.classname){

          bO = true;
          bK = n + bE.classname + e + bN;
        } else {

          bK = b + bE + e + bN;
        };;;
        var bC = this.__cE;
        if(bC[bK]){

          return bC[bK];
        };
        var bJ = this.__cA.getHandlers();
        var bF = qx.event.IEventHandler;
        var bH,bI,bG,bB;
        for(var i = 0,l = bJ.length;i < l;i++){

          bH = bJ[i];
          bG = bH.SUPPORTED_TYPES;
          if(bG && !bG[bN]){

            continue;
          };
          bB = bH.TARGET_CHECK;
          if(bB){

            var bM = false;
            if(bL && ((bB & bF.TARGET_DOMNODE) != 0)){

              bM = true;
            } else if(bD && ((bB & bF.TARGET_WINDOW) != 0)){

              bM = true;
            } else if(bO && ((bB & bF.TARGET_OBJECT) != 0)){

              bM = true;
            } else if(bA && ((bB & bF.TARGET_DOCUMENT) != 0)){

              bM = true;
            };;;
            if(!bM){

              continue;
            };
          };
          bI = this.getHandler(bJ[i]);
          if(bH.IGNORE_CAN_HANDLE || bI.canHandleEvent(bE, bN)){

            bC[bK] = bI;
            return bI;
          };
        };
        return null;
      },
      __cH : function(bS, bR, bP){

        var bQ = this.findHandler(bS, bR);
        if(bQ){

          bQ.registerEvent(bS, bR, bP);
          return;
        };
        {
        };
      },
      removeListener : function(bV, cc, bX, self, bT){

        {

          var ca;
        };
        var bU = bV.$$hash || qx.core.ObjectRegistry.toHashCode(bV);
        var cd = this.__cB[bU];
        if(!cd){

          return false;
        };
        var bY = cc + (bT ? j : c);
        var bW = cd[bY];
        if(!bW){

          return false;
        };
        var cb;
        for(var i = 0,l = bW.length;i < l;i++){

          cb = bW[i];
          if(cb.handler === bX && cb.context === self){

            qx.lang.Array.removeAt(bW, i);
            if(bW.length == 0){

              this.__cI(bV, cc, bT);
            };
            return true;
          };
        };
        return false;
      },
      removeListenerById : function(cg, co){

        {

          var ck;
        };
        var ci = co.split(g);
        var cn = ci[0];
        var ce = ci[1].charCodeAt(0) == 99;
        var cm = ci[2];
        var cf = cg.$$hash || qx.core.ObjectRegistry.toHashCode(cg);
        var cp = this.__cB[cf];
        if(!cp){

          return false;
        };
        var cj = cn + (ce ? j : c);
        var ch = cp[cj];
        if(!ch){

          return false;
        };
        var cl;
        for(var i = 0,l = ch.length;i < l;i++){

          cl = ch[i];
          if(cl.unique === cm){

            qx.lang.Array.removeAt(ch, i);
            if(ch.length == 0){

              this.__cI(cg, cn, ce);
            };
            return true;
          };
        };
        return false;
      },
      removeAllListeners : function(cr){

        var ct = cr.$$hash || qx.core.ObjectRegistry.toHashCode(cr);
        var cw = this.__cB[ct];
        if(!cw){

          return false;
        };
        var cs,cv,cq;
        for(var cu in cw){

          if(cw[cu].length > 0){

            cs = cu.split(g);
            cv = cs[0];
            cq = cs[1] === p;
            this.__cI(cr, cv, cq);
          };
        };
        delete this.__cB[ct];
        return true;
      },
      deleteAllListeners : function(cx){

        delete this.__cB[cx];
      },
      __cI : function(cB, cA, cy){

        var cz = this.findHandler(cB, cA);
        if(cz){

          cz.unregisterEvent(cB, cA, cy);
          return;
        };
        {
        };
      },
      dispatchEvent : function(cD, event){

        {

          var cH;
        };
        var cI = event.getType();
        if(!event.getBubbles() && !this.hasListener(cD, cI)){

          qx.event.Pool.getInstance().poolObject(event);
          return true;
        };
        if(!event.getTarget()){

          event.setTarget(cD);
        };
        var cG = this.__cA.getDispatchers();
        var cF;
        var cC = false;
        for(var i = 0,l = cG.length;i < l;i++){

          cF = this.getDispatcher(cG[i]);
          if(cF.canDispatchEvent(cD, event, cI)){

            cF.dispatchEvent(cD, event, cI);
            cC = true;
            break;
          };
        };
        if(!cC){

          {
          };
          return true;
        };
        var cE = event.getDefaultPrevented();
        qx.event.Pool.getInstance().poolObject(event);
        return !cE;
      },
      dispose : function(){

        this.__cA.removeManager(this);
        qx.util.DisposeUtil.disposeMap(this, q);
        qx.util.DisposeUtil.disposeMap(this, a);
        this.__cB = this.__cy = this.__cG = null;
        this.__cA = this.__cE = null;
      }
    }
  });
})();
(function(){

  var a = " is a singleton! Please use disposeSingleton instead.",b = "undefined",c = "qx.util.DisposeUtil",d = " of object: ",e = "!",f = " has non disposable entries: ",g = "The map field: ",h = "The array field: ",j = "The object stored in key ",k = "Has no disposable object under key: ";
  qx.Class.define(c, {
    statics : {
      disposeObjects : function(n, m, o){

        var name;
        for(var i = 0,l = m.length;i < l;i++){

          name = m[i];
          if(n[name] == null || !n.hasOwnProperty(name)){

            continue;
          };
          if(!qx.core.ObjectRegistry.inShutDown){

            if(n[name].dispose){

              if(!o && n[name].constructor.$$instance){

                throw new Error(j + name + a);
              } else {

                n[name].dispose();
              };
            } else {

              throw new Error(k + name + e);
            };
          };
          n[name] = null;
        };
      },
      disposeArray : function(q, p){

        var r = q[p];
        if(!r){

          return;
        };
        if(qx.core.ObjectRegistry.inShutDown){

          q[p] = null;
          return;
        };
        try{

          var s;
          for(var i = r.length - 1;i >= 0;i--){

            s = r[i];
            if(s){

              s.dispose();
            };
          };
        } catch(t) {

          throw new Error(h + p + d + q + f + t);
        };
        r.length = 0;
        q[p] = null;
      },
      disposeMap : function(v, u){

        var w = v[u];
        if(!w){

          return;
        };
        if(qx.core.ObjectRegistry.inShutDown){

          v[u] = null;
          return;
        };
        try{

          var y;
          for(var x in w){

            y = w[x];
            if(w.hasOwnProperty(x) && y){

              y.dispose();
            };
          };
        } catch(z) {

          throw new Error(g + u + d + v + f + z);
        };
        v[u] = null;
      },
      disposeTriggeredBy : function(A, C){

        var B = C.dispose;
        C.dispose = function(){

          B.call(C);
          A.dispose();
        };
      },
      destroyContainer : function(E){

        {
        };
        var D = [];
        this._collectContainerChildren(E, D);
        var F = D.length;
        for(var i = F - 1;i >= 0;i--){

          D[i].destroy();
        };
        E.destroy();
      },
      _collectContainerChildren : function(I, H){

        var J = I.getChildren();
        for(var i = 0;i < J.length;i++){

          var G = J[i];
          H.push(G);
          if(this.__cJ(G)){

            this._collectContainerChildren(G, H);
          };
        };
      },
      __cJ : function(L){

        var K = [];
        if(qx.ui.mobile && L instanceof qx.ui.mobile.core.Widget){

          K = [qx.ui.mobile.container.Composite];
        } else {

          K = [qx.ui.container.Composite, qx.ui.container.Scroll, qx.ui.container.SlideBar, qx.ui.container.Stack];
        };
        for(var i = 0,l = K.length;i < l;i++){

          if(typeof K[i] !== b && qx.Class.isSubClassOf(L.constructor, K[i])){

            return true;
          };
        };
        return false;
      }
    }
  });
})();
(function(){

  var c = "qx.event.Registration";
  qx.Class.define(c, {
    statics : {
      __cK : {
      },
      getManager : function(f){

        if(f == null){

          {
          };
          f = window;
        } else if(f.nodeType){

          f = qx.dom.Node.getWindow(f);
        } else if(!qx.dom.Node.isWindow(f)){

          f = window;
        };;
        var e = f.$$hash || qx.core.ObjectRegistry.toHashCode(f);
        var d = this.__cK[e];
        if(!d){

          d = new qx.event.Manager(f, this);
          this.__cK[e] = d;
        };
        return d;
      },
      removeManager : function(g){

        var h = g.getWindowId();
        delete this.__cK[h];
      },
      addListener : function(l, k, i, self, j){

        return this.getManager(l).addListener(l, k, i, self, j);
      },
      removeListener : function(p, o, m, self, n){

        return this.getManager(p).removeListener(p, o, m, self, n);
      },
      removeListenerById : function(q, r){

        return this.getManager(q).removeListenerById(q, r);
      },
      removeAllListeners : function(s){

        return this.getManager(s).removeAllListeners(s);
      },
      deleteAllListeners : function(u){

        var t = u.$$hash;
        if(t){

          this.getManager(u).deleteAllListeners(t);
        };
      },
      hasListener : function(x, w, v){

        return this.getManager(x).hasListener(x, w, v);
      },
      serializeListeners : function(y){

        return this.getManager(y).serializeListeners(y);
      },
      createEvent : function(B, C, A){

        {
        };
        if(C == null){

          C = qx.event.type.Event;
        };
        var z = qx.event.Pool.getInstance().getObject(C);
        A ? z.init.apply(z, A) : z.init();
        if(B){

          z.setType(B);
        };
        return z;
      },
      dispatchEvent : function(D, event){

        return this.getManager(D).dispatchEvent(D, event);
      },
      fireEvent : function(E, F, H, G){

        {

          var I;
        };
        var J = this.createEvent(F, H || null, G);
        return this.getManager(E).dispatchEvent(E, J);
      },
      fireNonBubblingEvent : function(K, P, N, M){

        {
        };
        var O = this.getManager(K);
        if(!O.hasListener(K, P, false)){

          return true;
        };
        var L = this.createEvent(P, N || null, M);
        return O.dispatchEvent(K, L);
      },
      PRIORITY_FIRST : -32000,
      PRIORITY_NORMAL : 0,
      PRIORITY_LAST : 32000,
      __cC : [],
      addHandler : function(Q){

        {
        };
        this.__cC.push(Q);
        this.__cC.sort(function(a, b){

          return a.PRIORITY - b.PRIORITY;
        });
      },
      getHandlers : function(){

        return this.__cC;
      },
      __cD : [],
      addDispatcher : function(S, R){

        {
        };
        this.__cD.push(S);
        this.__cD.sort(function(a, b){

          return a.PRIORITY - b.PRIORITY;
        });
      },
      getDispatchers : function(){

        return this.__cD;
      }
    }
  });
})();
(function(){

  var a = "qx.core.MEvent";
  qx.Mixin.define(a, {
    members : {
      __cL : qx.event.Registration,
      addListener : function(d, b, self, c){

        if(!this.$$disposed){

          return this.__cL.addListener(this, d, b, self, c);
        };
        return null;
      },
      addListenerOnce : function(h, f, self, g){

        var i = function(e){

          this.removeListener(h, f, this, g);
          f.call(self || this, e);
        };
        if(!f.$$wrapped_callback){

          f.$$wrapped_callback = {
          };
        };
        f.$$wrapped_callback[h + this.$$hash] = i;
        return this.addListener(h, i, this, g);
      },
      removeListener : function(l, j, self, k){

        if(!this.$$disposed){

          if(j.$$wrapped_callback && j.$$wrapped_callback[l + this.$$hash]){

            var m = j.$$wrapped_callback[l + this.$$hash];
            delete j.$$wrapped_callback[l + this.$$hash];
            j = m;
          };
          return this.__cL.removeListener(this, l, j, self, k);
        };
        return false;
      },
      removeListenerById : function(n){

        if(!this.$$disposed){

          return this.__cL.removeListenerById(this, n);
        };
        return false;
      },
      hasListener : function(p, o){

        return this.__cL.hasListener(this, p, o);
      },
      dispatchEvent : function(q){

        if(!this.$$disposed){

          return this.__cL.dispatchEvent(this, q);
        };
        return true;
      },
      fireEvent : function(s, t, r){

        if(!this.$$disposed){

          return this.__cL.fireEvent(this, s, t, r);
        };
        return true;
      },
      fireNonBubblingEvent : function(v, w, u){

        if(!this.$$disposed){

          return this.__cL.fireNonBubblingEvent(this, v, w, u);
        };
        return true;
      },
      fireDataEvent : function(z, A, x, y){

        if(!this.$$disposed){

          if(x === undefined){

            x = null;
          };
          return this.__cL.fireNonBubblingEvent(this, z, qx.event.type.Data, [A, x, !!y]);
        };
        return true;
      }
    }
  });
})();
(function(){

  var a = "qx.core.MAssert";
  qx.Mixin.define(a, {
    members : {
      assert : function(c, b){

        qx.core.Assert.assert(c, b);
      },
      fail : function(d, e){

        qx.core.Assert.fail(d, e);
      },
      assertTrue : function(g, f){

        qx.core.Assert.assertTrue(g, f);
      },
      assertFalse : function(i, h){

        qx.core.Assert.assertFalse(i, h);
      },
      assertEquals : function(j, k, l){

        qx.core.Assert.assertEquals(j, k, l);
      },
      assertNotEquals : function(m, n, o){

        qx.core.Assert.assertNotEquals(m, n, o);
      },
      assertIdentical : function(p, q, r){

        qx.core.Assert.assertIdentical(p, q, r);
      },
      assertNotIdentical : function(s, t, u){

        qx.core.Assert.assertNotIdentical(s, t, u);
      },
      assertNotUndefined : function(w, v){

        qx.core.Assert.assertNotUndefined(w, v);
      },
      assertUndefined : function(y, x){

        qx.core.Assert.assertUndefined(y, x);
      },
      assertNotNull : function(A, z){

        qx.core.Assert.assertNotNull(A, z);
      },
      assertNull : function(C, B){

        qx.core.Assert.assertNull(C, B);
      },
      assertJsonEquals : function(D, E, F){

        qx.core.Assert.assertJsonEquals(D, E, F);
      },
      assertMatch : function(I, H, G){

        qx.core.Assert.assertMatch(I, H, G);
      },
      assertArgumentsCount : function(L, K, M, J){

        qx.core.Assert.assertArgumentsCount(L, K, M, J);
      },
      assertEventFired : function(P, event, Q, N, O){

        qx.core.Assert.assertEventFired(P, event, Q, N, O);
      },
      assertEventNotFired : function(T, event, R, S){

        qx.core.Assert.assertEventNotFired(T, event, R, S);
      },
      assertException : function(V, W, X, U){

        qx.core.Assert.assertException(V, W, X, U);
      },
      assertInArray : function(bb, ba, Y){

        qx.core.Assert.assertInArray(bb, ba, Y);
      },
      assertArrayEquals : function(bc, bd, be){

        qx.core.Assert.assertArrayEquals(bc, bd, be);
      },
      assertKeyInMap : function(bh, bg, bf){

        qx.core.Assert.assertKeyInMap(bh, bg, bf);
      },
      assertFunction : function(bj, bi){

        qx.core.Assert.assertFunction(bj, bi);
      },
      assertString : function(bl, bk){

        qx.core.Assert.assertString(bl, bk);
      },
      assertBoolean : function(bn, bm){

        qx.core.Assert.assertBoolean(bn, bm);
      },
      assertNumber : function(bp, bo){

        qx.core.Assert.assertNumber(bp, bo);
      },
      assertPositiveNumber : function(br, bq){

        qx.core.Assert.assertPositiveNumber(br, bq);
      },
      assertInteger : function(bt, bs){

        qx.core.Assert.assertInteger(bt, bs);
      },
      assertPositiveInteger : function(bv, bu){

        qx.core.Assert.assertPositiveInteger(bv, bu);
      },
      assertInRange : function(by, bz, bx, bw){

        qx.core.Assert.assertInRange(by, bz, bx, bw);
      },
      assertObject : function(bB, bA){

        qx.core.Assert.assertObject(bB, bA);
      },
      assertArray : function(bD, bC){

        qx.core.Assert.assertArray(bD, bC);
      },
      assertMap : function(bF, bE){

        qx.core.Assert.assertMap(bF, bE);
      },
      assertRegExp : function(bH, bG){

        qx.core.Assert.assertRegExp(bH, bG);
      },
      assertType : function(bK, bJ, bI){

        qx.core.Assert.assertType(bK, bJ, bI);
      },
      assertInstance : function(bM, bN, bL){

        qx.core.Assert.assertInstance(bM, bN, bL);
      },
      assertInterface : function(bQ, bP, bO){

        qx.core.Assert.assertInterface(bQ, bP, bO);
      },
      assertCssColor : function(bR, bT, bS){

        qx.core.Assert.assertCssColor(bR, bT, bS);
      },
      assertElement : function(bV, bU){

        qx.core.Assert.assertElement(bV, bU);
      },
      assertQxObject : function(bX, bW){

        qx.core.Assert.assertQxObject(bX, bW);
      },
      assertQxWidget : function(ca, bY){

        qx.core.Assert.assertQxWidget(ca, bY);
      }
    }
  });
})();
(function(){

  var a = "module.events",b = "Cloning only possible with properties.",c = "qx.core.Object",d = "module.property",e = "]",f = "[",g = "Object";
  qx.Class.define(c, {
    extend : Object,
    include : qx.core.Environment.filter({
      "module.databinding" : qx.data.MBinding,
      "module.logger" : qx.core.MLogging,
      "module.events" : qx.core.MEvent,
      "module.property" : qx.core.MProperty
    }),
    construct : function(){

      qx.core.ObjectRegistry.register(this);
    },
    statics : {
      $$type : g
    },
    members : {
      __M : qx.core.Environment.get(d) ? qx.core.Property : null,
      toHashCode : function(){

        return this.$$hash;
      },
      toString : function(){

        return this.classname + f + this.$$hash + e;
      },
      base : function(h, j){

        {
        };
        if(arguments.length === 1){

          return h.callee.base.call(this);
        } else {

          return h.callee.base.apply(this, Array.prototype.slice.call(arguments, 1));
        };
      },
      self : function(k){

        return k.callee.self;
      },
      clone : function(){

        if(!qx.core.Environment.get(d)){

          throw new Error(b);
        };
        var n = this.constructor;
        var m = new n;
        var p = qx.Class.getProperties(n);
        var o = this.__M.$$store.user;
        var q = this.__M.$$method.set;
        var name;
        for(var i = 0,l = p.length;i < l;i++){

          name = p[i];
          if(this.hasOwnProperty(o[name])){

            m[q[name]](this[o[name]]);
          };
        };
        return m;
      },
      __cM : null,
      setUserData : function(r, s){

        if(!this.__cM){

          this.__cM = {
          };
        };
        this.__cM[r] = s;
      },
      getUserData : function(u){

        if(!this.__cM){

          return null;
        };
        var t = this.__cM[u];
        return t === undefined ? null : t;
      },
      isDisposed : function(){

        return this.$$disposed || false;
      },
      dispose : function(){

        if(this.$$disposed){

          return;
        };
        this.$$disposed = true;
        this.$$instance = null;
        this.$$allowconstruct = null;
        {
        };
        var x = this.constructor;
        var v;
        while(x.superclass){

          if(x.$$destructor){

            x.$$destructor.call(this);
          };
          if(x.$$includes){

            v = x.$$flatIncludes;
            for(var i = 0,l = v.length;i < l;i++){

              if(v[i].$$destructor){

                v[i].$$destructor.call(this);
              };
            };
          };
          x = x.superclass;
        };
        {

          var y,w;
        };
      },
      _disposeObjects : function(z){

        qx.util.DisposeUtil.disposeObjects(this, arguments);
      },
      _disposeSingletonObjects : function(A){

        qx.util.DisposeUtil.disposeObjects(this, arguments, true);
      },
      _disposeArray : function(B){

        qx.util.DisposeUtil.disposeArray(this, B);
      },
      _disposeMap : function(C){

        qx.util.DisposeUtil.disposeMap(this, C);
      }
    },
    environment : {
      "qx.debug.dispose.level" : 0
    },
    destruct : function(){

      if(qx.core.Environment.get(a)){

        if(!qx.core.ObjectRegistry.inShutDown){

          qx.event.Registration.removeAllListeners(this);
        } else {

          qx.event.Registration.deleteAllListeners(this);
        };
      };
      qx.core.ObjectRegistry.unregister(this);
      this.__cM = null;
      if(qx.core.Environment.get(d)){

        var F = this.constructor;
        var J;
        var K = this.__M.$$store;
        var H = K.user;
        var I = K.theme;
        var D = K.inherit;
        var G = K.useinit;
        var E = K.init;
        while(F){

          J = F.$$properties;
          if(J){

            for(var name in J){

              if(J[name].dereference){

                this[H[name]] = this[I[name]] = this[D[name]] = this[G[name]] = this[E[name]] = undefined;
              };
            };
          };
          F = F.superclass;
        };
      };
    }
  });
})();
(function(){

  var a = "qx.event.type.Event";
  qx.Class.define(a, {
    extend : qx.core.Object,
    statics : {
      CAPTURING_PHASE : 1,
      AT_TARGET : 2,
      BUBBLING_PHASE : 3
    },
    members : {
      init : function(c, b){

        {
        };
        this._type = null;
        this._target = null;
        this._currentTarget = null;
        this._relatedTarget = null;
        this._originalTarget = null;
        this._stopPropagation = false;
        this._preventDefault = false;
        this._bubbles = !!c;
        this._cancelable = !!b;
        this._timeStamp = (new Date()).getTime();
        this._eventPhase = null;
        return this;
      },
      clone : function(d){

        if(d){

          var e = d;
        } else {

          var e = qx.event.Pool.getInstance().getObject(this.constructor);
        };
        e._type = this._type;
        e._target = this._target;
        e._currentTarget = this._currentTarget;
        e._relatedTarget = this._relatedTarget;
        e._originalTarget = this._originalTarget;
        e._stopPropagation = this._stopPropagation;
        e._bubbles = this._bubbles;
        e._preventDefault = this._preventDefault;
        e._cancelable = this._cancelable;
        return e;
      },
      stop : function(){

        if(this._bubbles){

          this.stopPropagation();
        };
        if(this._cancelable){

          this.preventDefault();
        };
      },
      stopPropagation : function(){

        {
        };
        this._stopPropagation = true;
      },
      getPropagationStopped : function(){

        return !!this._stopPropagation;
      },
      preventDefault : function(){

        {
        };
        this._preventDefault = true;
      },
      getDefaultPrevented : function(){

        return !!this._preventDefault;
      },
      getType : function(){

        return this._type;
      },
      setType : function(f){

        this._type = f;
      },
      getEventPhase : function(){

        return this._eventPhase;
      },
      setEventPhase : function(g){

        this._eventPhase = g;
      },
      getTimeStamp : function(){

        return this._timeStamp;
      },
      getTarget : function(){

        return this._target;
      },
      setTarget : function(h){

        this._target = h;
      },
      getCurrentTarget : function(){

        return this._currentTarget || this._target;
      },
      setCurrentTarget : function(i){

        this._currentTarget = i;
      },
      getRelatedTarget : function(){

        return this._relatedTarget;
      },
      setRelatedTarget : function(j){

        this._relatedTarget = j;
      },
      getOriginalTarget : function(){

        return this._originalTarget;
      },
      setOriginalTarget : function(k){

        this._originalTarget = k;
      },
      getBubbles : function(){

        return this._bubbles;
      },
      setBubbles : function(l){

        this._bubbles = l;
      },
      isCancelable : function(){

        return this._cancelable;
      },
      setCancelable : function(m){

        this._cancelable = m;
      }
    },
    destruct : function(){

      this._target = this._currentTarget = this._relatedTarget = this._originalTarget = null;
    }
  });
})();
(function(){

  var a = "qx.util.ObjectPool",b = "Class needs to be defined!",c = "Object is already pooled: ",d = "Integer";
  qx.Class.define(a, {
    extend : qx.core.Object,
    construct : function(e){

      qx.core.Object.call(this);
      this.__cN = {
      };
      if(e != null){

        this.setSize(e);
      };
    },
    properties : {
      size : {
        check : d,
        init : Infinity
      }
    },
    members : {
      __cN : null,
      getObject : function(h){

        if(this.$$disposed){

          return new h;
        };
        if(!h){

          throw new Error(b);
        };
        var f = null;
        var g = this.__cN[h.classname];
        if(g){

          f = g.pop();
        };
        if(f){

          f.$$pooled = false;
        } else {

          f = new h;
        };
        return f;
      },
      poolObject : function(k){

        if(!this.__cN){

          return;
        };
        var j = k.classname;
        var m = this.__cN[j];
        if(k.$$pooled){

          throw new Error(c + k);
        };
        if(!m){

          this.__cN[j] = m = [];
        };
        if(m.length > this.getSize()){

          if(k.destroy){

            k.destroy();
          } else {

            k.dispose();
          };
          return;
        };
        k.$$pooled = true;
        m.push(k);
      }
    },
    destruct : function(){

      var p = this.__cN;
      var n,o,i,l;
      for(n in p){

        o = p[n];
        for(i = 0,l = o.length;i < l;i++){

          o[i].dispose();
        };
      };
      delete this.__cN;
    }
  });
})();
(function(){

  var a = "singleton",b = "qx.event.Pool";
  qx.Class.define(b, {
    extend : qx.util.ObjectPool,
    type : a,
    construct : function(){

      qx.util.ObjectPool.call(this, 30);
    }
  });
})();
(function(){

  var a = "qx.event.type.Data";
  qx.Class.define(a, {
    extend : qx.event.type.Event,
    members : {
      __cO : null,
      __cP : null,
      init : function(c, d, b){

        qx.event.type.Event.prototype.init.call(this, false, b);
        this.__cO = c;
        this.__cP = d;
        return this;
      },
      clone : function(e){

        var f = qx.event.type.Event.prototype.clone.call(this, e);
        f.__cO = this.__cO;
        f.__cP = this.__cP;
        return f;
      },
      getData : function(){

        return this.__cO;
      },
      getOldData : function(){

        return this.__cP;
      }
    },
    destruct : function(){

      this.__cO = this.__cP = null;
    }
  });
})();
(function(){

  var a = "qx.event.IEventHandler";
  qx.Interface.define(a, {
    statics : {
      TARGET_DOMNODE : 1,
      TARGET_WINDOW : 2,
      TARGET_OBJECT : 4,
      TARGET_DOCUMENT : 8
    },
    members : {
      canHandleEvent : function(c, b){
      },
      registerEvent : function(f, e, d){
      },
      unregisterEvent : function(i, h, g){
      }
    }
  });
})();
(function(){

  var a = "qx.event.handler.Object";
  qx.Class.define(a, {
    extend : qx.core.Object,
    implement : qx.event.IEventHandler,
    statics : {
      PRIORITY : qx.event.Registration.PRIORITY_LAST,
      SUPPORTED_TYPES : null,
      TARGET_CHECK : qx.event.IEventHandler.TARGET_OBJECT,
      IGNORE_CAN_HANDLE : false
    },
    members : {
      canHandleEvent : function(c, b){

        return qx.Class.supportsEvent(c.constructor, b);
      },
      registerEvent : function(f, e, d){
      },
      unregisterEvent : function(i, h, g){
      }
    },
    defer : function(j){

      qx.event.Registration.addHandler(j);
    }
  });
})();
(function(){

  var a = "qx.event.IEventDispatcher";
  qx.Interface.define(a, {
    members : {
      canDispatchEvent : function(c, event, b){

        this.assertInstance(event, qx.event.type.Event);
        this.assertString(b);
      },
      dispatchEvent : function(e, event, d){

        this.assertInstance(event, qx.event.type.Event);
        this.assertString(d);
      }
    }
  });
})();
(function(){

  var a = "qx.event.dispatch.Direct";
  qx.Class.define(a, {
    extend : qx.core.Object,
    implement : qx.event.IEventDispatcher,
    construct : function(b){

      this._manager = b;
    },
    statics : {
      PRIORITY : qx.event.Registration.PRIORITY_LAST
    },
    members : {
      canDispatchEvent : function(d, event, c){

        return !event.getBubbles();
      },
      dispatchEvent : function(e, event, k){

        {

          var j,f;
        };
        event.setEventPhase(qx.event.type.Event.AT_TARGET);
        var g = this._manager.getListeners(e, k, false);
        if(g){

          for(var i = 0,l = g.length;i < l;i++){

            var h = g[i].context || e;
            {
            };
            g[i].handler.call(h, event);
          };
        };
      }
    },
    defer : function(m){

      qx.event.Registration.addDispatcher(m);
    }
  });
})();
(function(){

  var a = 'action',b = "unit/update_sensor",c = "resource/update_poi",d = "unit_commands",f = "unitSensors",g = "adminField",h = "itemProfileFields",j = "resource/update_drivers_group",l = "u",m = "https://geocode-maps.wialon.com",n = "zonesGroup",o = "item/delete_item",p = "singleton",q = "resourcePois",r = 'zl',s = "ftp",t = "resourceZoneGroups",u = "item/update_admin_field",v = "&svc=file/get&params=",w = "script",x = "avl_evts:request",y = "core/check_items_billing",z = "resource/get_job_data",A = "qx.event.type.Event",B = "//",C = "item/update_profile_field",D = "resource/get_poi_data",E = "ujb",F = "token/login",G = "token/update",H = "jobs",I = "file/list",J = "__db",K = "__df",L = "unitFuelSettings",M = "local",N = "route/get_round_data",O = "flds",P = "core/get_hw_types",Q = 'driver',R = "userNotification",S = "si",T = "order_routes",U = "core/search_item",V = "profileField",W = "=",X = 'tags',Y = "core/create_resource",fv = "core/create_user",fr = "?sid=",fw = "number",fs = "firmware",ft = "customField",fp = "core/create_unit",fu = "https://search-maps.wialon.com",fB = "; ",fC = "usnf",fD = "notifications",fE = "token/list",fx = "itemAdminFields",fy = "routeSchedules",fz = "core/login",fA = "route/update_round",fI = "string",gm = "account/get_business_spheres",fJ = "core/create_auth_hash",fK = "poi",fF = "ud",fG = "core/update_data_flags",hn = "serviceInterval",fH = "core/create_retranslator",fL = "resourceReports",fM = "core/reset_password_perform",fN = "unitReportSettings",fS = "sensor",fT = "qx.event.type.Data",fU = 'trailer',fO = "__de",fP = "https://render-maps.wialon.com",fQ = "/avl_evts",fR = "core/create_route",ga = "round",gb = "rr",gc = "core/create_unit_group",gd = "unf",fV = "item/update_ftp_property",fW = "aflds",fX = "mapps",fY = 'resource/update_zone',gh = "core/get_account_data",gi = "d",hw = 'resource/update_trailer',gj = "fileUploaded",ge = "avl_evts",gf = '.all',hu = "resourceDrivers",gg = "commandDefinition",gk = 'drvrs',gl = "unitServiceIntervals",gx = "resource/update_zones_group",gw = "function",gv = "tagsgr",gB = "rep",gA = "report/update_report",gz = "resource/update_job",gy = "rs",gq = "report",gp = "wialon.js",go = "en",gn = "itemCreated",gu = "unitEventRegistrar",gt = "orders",gs = 'undefined',gr = 'tag',gI = "user/update_user_notification",gH = "[\\?&]callback=([^&#]*)",gG = "serverUpdated",gF = 'resource/get_zone_data',gM = "unitCommandDefinitions",gL = 'trigger',gK = "user/send_sms",gJ = "core/get_hw_cmds",gE = "file/read",gD = 'trlrs',gC = "account/get_account_data",gX = "/wialon/ajax.html",gW = "resourceDriverGroups",gV = "lang",hc = "m",hb = "resource/update_trailers_group",ha = "report/get_report_tables",gY = "resourceAccounts",gQ = "resourceTags",gP = "mobileApps",gO = "account/list_change_accounts",gN = "notification",gU = "unit/update_command_definition",gT = "itemIcon",gS = "order/route_update",gR = "schedule",hi = "route/update_schedule",hh = "col",hg = '',hf = "1.51",hm = "file/library",hl = "statsFinished",hk = 'resource/update_tag',hj = "itemFtpProps",he = "core/search_items",hd = "core/duplicate",ex = "https://routing-maps.wialon.com",ew = "trlrsgr",hx = "FtpProp",eu = "order/update",ev = "trailersGroup",et = "mobileApp",hv = "object",er = "sensu",es = "resource/update_notification",eq = "unitDriveRankSettings",hs = "orderRoute",eo = "wialon.core.Session",ep = "featuresUpdated",en = "item/update_custom_field",eG = "unit/update_service_interval",eH = "invalidSession",eE = "drvrsgr",eF = "resourceJobs",eC = "core/use_auth_hash",eD = "resourceTrailers",eB = "routeRounds",em = "resourceTrailerGroups",ez = "core/logout",eA = "driversGroup",ey = "core/set_session_property",eU = "resourceNotifications",eS = "resource/update_tags_group",eT = "order",eQ = "job",eR = "resourceOrders",eP = "core/check_accessors",hq = "core/reset_password_request",eN = "resource/get_notification_data",eO = '.',eM = 'zone',ht = "report/get_report_data",eK = "unitMessagesFilter",eL = "cml",eI = "/",eJ = "&svc=core/export_file&params=",fd = "tagsGroup",fe = "unitTripDetector",fb = "",fc = "__cX",eY = "resourceZones",fa = "userNotifications",eX = 'resource/update_driver',hp = "unit_sensors",eV = "sens",eW = "Can't parse avl_evts json, possible wrong chars in responce. Data is ignored.",fo = "itemDeleted",ho = "unitsUpdated",fq = "itemCustomFields",fl = "unitEvents",fk = "reporttemplates",fn = 'u',fm = 'notifications',fh = "pflds",fg = "user/update_mobile_app",fj = "undefined",fi = '/',ff = "zg";
  qx.Class.define(eo, {
    extend : qx.core.Object,
    type : p,
    construct : function(){

      qx.core.Object.call(this);
      this.__cQ = {
      };
      this.__cR = {
      };
      this._libraries = {
      };
    },
    members : {
      __cS : 0,
      __cT : fb,
      __cU : 0,
      __cV : null,
      __cW : 0,
      __cX : null,
      __cY : 0,
      __da : null,
      __db : null,
      __dc : null,
      __cQ : null,
      __cR : null,
      _libraries : null,
      __dd : fb,
      __de : null,
      __df : null,
      __dg : fb,
      __dh : false,
      __di : fb,
      __dj : fb,
      __dk : fb,
      __dl : {
      },
      __dm : null,
      __gi : [H, fD, fk, d, hp],
      __dn : fb,
      __do : hf,
      __dp : fb,
      __dq : null,
      __dr : 0,
      __ds : 0,
      __dt : fb,
      __du : fb,
      __dv : {
      },
      __dw : fb,
      __dx : fP,
      __dy : fu,
      __dz : m,
      __dA : ex,
      __gj : fb,
      __gk : fb,
      __gl : fb,
      __dB : gX,
      __dC : false,
      __dD : false,
      __dE : false,
      __dF : null,
      __dG : null,
      __dH : null,
      __dI : null,
      __dJ : null,
      __dK : null,
      initSession : function(hA, hz, hy, hD, hB, hE){

        if(this.__cS)return false;
        wialon.item.Item.registerProperties();
        wialon.item.User.registerProperties();
        wialon.item.Unit.registerProperties();
        wialon.item.Resource.registerProperties();
        wialon.item.UnitGroup.registerProperties();
        wialon.item.Retranslator.registerProperties();
        wialon.item.Route.registerProperties();
        this.__dg = hA;
        this.__dw = hA;
        if(typeof hz != fj)this.__di = hz;
        if(typeof hy != fj && !isNaN(parseInt(hy))){

          var hC = parseInt(hy);
          if(hC & 0x800)this.__dh = true;
        };
        if(typeof hD != fj)this.__dk = hD;
        this.__de = new wialon.render.Renderer;
        this.__df = new wialon.core.MessagesLoader;
        this.__cS = 1;
        if(hB)this.__dn = hB;
        if(hE){

          if(hE.apiPath)this.__dB = hE.apiPath;
          if(hE.gisUrl)this.__dw = hE.gisUrl;
          this.__dC = !!hE.ignoreBaseUrl;
          this.__dD = !!hE.whiteLabel;
          this.__dF = hE.logger;
          this.__dG = hE.loginSiteName;
          this.__dE = hE.requestWebSites;
        };
        return true;
      },
      isInitialized : function(){

        return this.__cS;
      },
      getToken : function(){

        return this.__dq;
      },
      getVersion : function(){

        return this.__dn;
      },
      getJsVersion : function(){

        return this.__do;
      },
      getAjaxVersion : function(){

        return this.__dp;
      },
      getHiddenLogin : function(){

        return this.__dr;
      },
      getAuthUser : function(){

        return this.__dd;
      },
      isLocal : function(){

        return this.__ds;
      },
      getHwGatewayIp : function(){

        return this.__dt;
      },
      getHwGatewayDns : function(){

        return this.__du;
      },
      getEnv : function(hF){

        if(hF)return this.__dv[hF];
        return this.__dv;
      },
      getClasses : function(){

        return this.__da;
      },
      login : function(hJ, hH, hI, hG){

        hG = wialon.util.Helper.wrapCallback(hG);
        if(this.__cX || !this.__cS){

          hG(2);
          return;
        };
        return wialon.core.Remote.getInstance().remoteCall(fz, {
          user : hJ,
          password : hH,
          operateAs : hI,
          loginHash : this.__dj,
          appName : this.__di,
          checkService : this.__dk
        }, qx.lang.Function.bind(this.__dS, this, hG));
      },
      loginAuthHash : function(hO, hN, hL){

        var hK = fb;
        if(hN && typeof hN == gw)hL = hN; else if(hN && typeof hN == fI)hK = hN;;
        hL = wialon.util.Helper.wrapCallback(hL);
        if(this.__cX || !this.__cS){

          hL(2);
          return;
        };
        var hM = {
          authHash : hO,
          operateAs : hK,
          appName : this.__di,
          checkService : this.__dk
        };
        if(this.__dG)hM.siteName = this.__dG;
        if(this.__dE)hM.webSite = 1;
        return wialon.core.Remote.getInstance().remoteCall(eC, hM, qx.lang.Function.bind(this.__dS, this, hL));
      },
      loginToken : function(hR, hT, hQ){

        var hP = fb;
        if(hT && typeof hT == gw)hQ = hT; else if(hT && typeof hT == fI)hP = hT;;
        hQ = wialon.util.Helper.wrapCallback(hQ);
        if(this.__cX || !this.__cS){

          hQ(2);
          return;
        };
        var hS = {
          token : hR,
          operateAs : hP,
          appName : this.__di,
          checkService : this.__dk
        };
        if(this.__dG)hS.siteName = this.__dG;
        if(this.__dE)hS.webSite = 1;
        return wialon.core.Remote.getInstance().remoteCall(F, hS, qx.lang.Function.bind(this.__dS, this, hQ));
      },
      duplicate : function(ib, hX, hU, ia, hV){

        var hY = 0;
        if(hV)hY = 1;
        ia = wialon.util.Helper.wrapCallback(ia);
        if(this.__cX || !this.__cS){

          ia(2);
          return;
        };
        this.__cT = ib;
        var hW = {
          operateAs : hX,
          continueCurrentSession : hU,
          checkService : this.__dk,
          restore : hY,
          appName : this.__di
        };
        if(this.__dG)hW.siteName = this.__dG;
        if(this.__dE)hW.webSite = 1;
        return wialon.core.Remote.getInstance().remoteCall(hd, hW, qx.lang.Function.bind(this.__dS, this, ia));
      },
      logout : function(ic){

        ic = wialon.util.Helper.wrapCallback(ic);
        if(!this.__cX){

          ic(2);
          return;
        };
        return wialon.core.Remote.getInstance().remoteCall(ez, null, qx.lang.Function.bind(function(ie, ig){

          if(ie){

            ic(ie);
            return;
          };
          this.__dO();
          ic(0);
        }, this));
      },
      createAuthHash : function(ih){

        ih = wialon.util.Helper.wrapCallback(ih);
        if(!this.__cX){

          ih(2);
          return;
        };
        return wialon.core.Remote.getInstance().remoteCall(fJ, {
        }, ih);
      },
      updateSessionProperty : function(ij, ii){

        return wialon.core.Remote.getInstance().remoteCall(ey, {
          prop_name : ij.propName,
          prop_value : ij.propValue
        }, wialon.util.Helper.wrapCallback(ii));
      },
      updateToken : function(ik, il, im){

        im = wialon.util.Helper.wrapCallback(im);
        return wialon.core.Remote.getInstance().remoteCall(G, {
          callMode : ik,
          h : il.h,
          app : il.app,
          at : il.at,
          dur : il.dur,
          fl : il.fl,
          p : il.p,
          items : il.items,
          deleteAll : il.deleteAll,
          userId : il.userId
        }, im);
      },
      listTokens : function(ip, io){

        return wialon.core.Remote.getInstance().remoteCall(fE, {
          app : ip.app,
          userId : ip.userId
        }, wialon.util.Helper.wrapCallback(io));
      },
      updateDataFlags : function(ir, iq){

        iq = wialon.util.Helper.wrapCallback(iq);
        if(!this.__cX || typeof ir != hv){

          iq(2);
          return;
        };
        return wialon.core.Remote.getInstance().remoteCall(fG, {
          spec : ir
        }, qx.lang.Function.bind(this.__dT, this, iq));
      },
      searchItems : function(iw, iv, is, iu, it, ix, iy){

        ix = wialon.util.Helper.wrapCallback(ix);
        if(!this.__cX || typeof iw != hv){

          ix(2, null);
          return;
        };
        return wialon.core.Remote.getInstance().remoteCall(he, {
          spec : iw,
          force : iv ? 1 : 0,
          flags : is,
          from : iu,
          to : it
        }, qx.lang.Function.bind(this.__dU, this, ix), iy);
      },
      searchItem : function(iB, iz, iA){

        iA = wialon.util.Helper.wrapCallback(iA);
        if(!this.__cX){

          iA(2, null);
          return;
        };
        return wialon.core.Remote.getInstance().remoteCall(U, {
          id : iB,
          flags : iz
        }, qx.lang.Function.bind(this.__dV, this, iA));
      },
      loadLibrary : function(iE){

        var iC = wialon.core.Session.getInstance();
        if(typeof this._libraries[iE] != fj)return true;
        if(iE == fa)wialon.item.PluginsManager.bindPropItem(wialon.item.User, fC, R, gI); else if(iE == fq)wialon.item.PluginsManager.bindPropItem(wialon.item.Item, O, ft, en); else if(iE == hj)wialon.item.PluginsManager.bindPropItem(wialon.item.Item, s, hx, fV); else if(iE == fx)wialon.item.PluginsManager.bindPropItem(wialon.item.Item, fW, g, u); else if(iE == h)wialon.item.PluginsManager.bindPropItem(wialon.item.Item, fh, V, C); else if(iE == gT){

          qx.Class.include(wialon.item.Unit, wialon.item.MIcon);
          qx.Class.include(wialon.item.UnitGroup, wialon.item.MIcon);
        } else if(iE == gM)wialon.item.PluginsManager.bindPropItem(wialon.item.Unit, eL, gg, gU); else if(iE == f){

          wialon.item.PluginsManager.bindPropItem(wialon.item.Unit, eV, fS, b);
          qx.Class.include(wialon.item.Unit, wialon.item.MUnitSensor);
        } else if(iE == gl)wialon.item.PluginsManager.bindPropItem(wialon.item.Unit, S, hn, eG); else if(iE == fe)qx.Class.include(wialon.item.Unit, wialon.item.MUnitTripDetector); else if(iE == eK)qx.Class.include(wialon.item.Unit, wialon.item.MUnitMessagesFilter); else if(iE == gu)qx.Class.include(wialon.item.Unit, wialon.item.MUnitEventRegistrar); else if(iE == fN)qx.Class.include(wialon.item.Unit, wialon.item.MUnitReportSettings); else if(iE == eq)qx.Class.include(wialon.item.Unit, wialon.item.MUnitDriveRankSettings); else if(iE == L)qx.Class.include(wialon.item.Unit, wialon.item.MUnitFuelSettings); else if(iE == eU)wialon.item.PluginsManager.bindPropItem(wialon.item.Resource, gd, gN, es, eN); else if(iE == eF)wialon.item.PluginsManager.bindPropItem(wialon.item.Resource, E, eQ, gz, z); else if(iE == eY){

          qx.Class.include(wialon.item.Resource, wialon.item.MZone);
          wialon.item.PluginsManager.bindPropItem(wialon.item.Resource, {
            propName : r,
            itemName : eM,
            ajaxPath : fY,
            extAjaxPath : gF,
            preProcessUpdateCallObj : function(iH){

              var iG = iC.getCoordinatesTransformer();
              if(!iG)return iH;
              return iD(iG.reverse.bind(iG), iH);
            },
            preProcessPropObj : function(iJ){

              var iI = iC.getCoordinatesTransformer();
              if(!iI)return iJ;
              return iD(iI.direct.bind(iI), iJ);
            }
          });
        } else if(iE == t){

          qx.Class.include(wialon.item.Resource, wialon.item.MZone);
          wialon.item.PluginsManager.bindPropItem(wialon.item.Resource, ff, n, gx);
        } else if(iE == q){

          qx.Class.include(wialon.item.Resource, wialon.item.MPoi);
          wialon.item.PluginsManager.bindPropItem(wialon.item.Resource, fK, fK, c, D);
        } else if(iE == hu){

          qx.Class.include(wialon.item.Resource, wialon.item.MDriver);
          wialon.item.MDriver.registerDriverProperties();
          wialon.item.PluginsManager.bindPropItem(wialon.item.Resource, {
            propName : gk,
            itemName : Q,
            ajaxPath : eX,
            preProcessPropObj : iF
          });
        } else if(iE == gW){

          qx.Class.include(wialon.item.Resource, wialon.item.MDriver);
          wialon.item.MDriver.registerDriverProperties();
          wialon.item.PluginsManager.bindPropItem(wialon.item.Resource, eE, eA, j);
        } else if(iE == eD){

          qx.Class.include(wialon.item.Resource, wialon.item.MDriver);
          wialon.item.MDriver.registerDriverProperties();
          wialon.item.PluginsManager.bindPropItem(wialon.item.Resource, {
            propName : gD,
            itemName : fU,
            ajaxPath : hw,
            preProcessPropObj : iF
          });
        } else if(iE == em){

          qx.Class.include(wialon.item.Resource, wialon.item.MDriver);
          wialon.item.MDriver.registerDriverProperties();
          wialon.item.PluginsManager.bindPropItem(wialon.item.Resource, ew, ev, hb);
        } else if(iE == gY){

          qx.Class.include(wialon.item.Resource, wialon.item.MAccount);
          wialon.item.MAccount.registerAccountProperties();
        } else if(iE == fL){

          qx.Class.include(wialon.item.Resource, wialon.item.MReport);
          wialon.item.PluginsManager.bindPropItem(wialon.item.Resource, gB, gq, gA, ht);
        } else if(iE == eB)wialon.item.PluginsManager.bindPropItem(wialon.item.Route, gb, ga, fA, N); else if(iE == fy)wialon.item.PluginsManager.bindPropItem(wialon.item.Route, gy, gR, hi); else if(iE == fl)qx.Class.include(wialon.item.Unit, wialon.item.MUnitEvents); else if(iE == gP)wialon.item.PluginsManager.bindPropItem(wialon.item.User, fX, et, fg); else if(iE == eR){

          qx.Class.include(wialon.item.Resource, wialon.item.MOrder);
          wialon.item.PluginsManager.bindPropItem(wialon.item.Resource, gt, eT, eu);
          qx.Class.include(wialon.item.Resource, wialon.item.MOrderRoute);
          wialon.item.PluginsManager.bindPropItem(wialon.item.Resource, T, hs, gS);
        } else if(iE == gQ){

          qx.Class.include(wialon.item.Resource, wialon.item.MTag);
          wialon.item.MTag.registerTagProperties();
          wialon.item.PluginsManager.bindPropItem(wialon.item.Resource, gv, fd, eS);
          wialon.item.PluginsManager.bindPropItem(wialon.item.Resource, {
            propName : X,
            itemName : gr,
            ajaxPath : hk,
            preProcessPropObj : iF
          });
        } else return false;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
        this._libraries[iE] = 1;
        return true;
        function iD(iT, iK){

          var iQ = 1.002;
          if(!iK)return iK;
          var iN = false;
          var iR = iK.p;
          var iS = iK.b;
          if(iS){

            var iU = iT({
              x : iS.cen_x,
              y : iS.cen_y
            });
            var iP = iU.x !== iS.cen_y || iU.y !== iS.cen_y;
            if(iP){

              var iM = (iS.min_x - iS.cen_x) * iQ;
              var iO = (iS.max_x - iS.cen_x) * iQ;
              var iL = (iS.min_y - iS.cen_y) * iQ;
              var iV = (iS.max_y - iS.cen_y) * iQ;
              iN = true;
              iS = {
                cen_x : iU.x,
                cen_y : iU.y,
                min_x : iU.x + iM,
                max_x : iU.x + iO,
                min_y : iU.y + iL,
                max_y : iU.y + iV
              };
            };
          };
          if(Array.isArray(iR)){

            iN = true;
            iR = iK.p.map(function(iW){

              return iT(iW);
            });
          };
          if(iN){

            iK = Object.assign({
            }, iK, {
              b : iS,
              p : iR
            });
          };
          return iK;
        };
        function iF(iY){

          var iX = iC.getCoordinatesTransformer();
          if(!iX)return iY;
          if(!iY || !iY.pos)return iY;
          var ja = iX.direct(iY.pos);
          if(ja !== iY.pos){

            iY = Object.assign({
            }, iY, {
              pos : ja
            });
          };
          return iY;
        };
      },
      getHwTypes : function(jc, jb){

        var jd = {
        };
        if(jc && typeof jc == gw)jb = jc; else if(jc && typeof jc == hv)jd = jc;;
        if(!this.__cX){

          jb(2);
          return;
        };
        return wialon.core.Remote.getInstance().remoteCall(P, {
          filterType : jd.filterType,
          filterValue : jd.filterValue,
          includeType : jd.includeType
        }, wialon.util.Helper.wrapCallback(jb));
      },
      getHwCommands : function(je, jf, jg){

        jg = wialon.util.Helper.wrapCallback(jg);
        if(!this.__cX){

          jg(2);
          return;
        };
        return wialon.core.Remote.getInstance().remoteCall(gJ, {
          deviceTypeId : je,
          unitId : jf
        }, jg);
      },
      getHwCommandTemplates : function(jj, jh){

        var ji = {
        };
        if(jj && typeof jj == hv){

          ji = jj;
          jh = wialon.util.Helper.wrapCallback(jh);
        } else {

          ji.deviceTypeId = arguments[0];
          ji.unitId = arguments[1];
          ji.lang = go;
          jh = wialon.util.Helper.wrapCallback(arguments[2]);
        };
        if(!this.__cX){

          jh(2);
          return;
        };
        return wialon.core.Remote.getInstance().remoteCall(gJ, {
          deviceTypeId : ji.deviceTypeId,
          unitId : ji.unitId,
          template : 1,
          lang : ji.lang
        }, jh);
      },
      createUnit : function(jn, name, jl, jk, jm){

        jm = wialon.util.Helper.wrapCallback(jm);
        if(!this.__cX){

          jm(2);
          return;
        };
        return wialon.core.Remote.getInstance().remoteCall(fp, {
          creatorId : jn.getId(),
          name : name,
          hwTypeId : jl,
          dataFlags : jk
        }, qx.lang.Function.bind(this.__dV, this, jm));
      },
      createUser : function(jp, name, js, jo, jr, jq){

        jq = jq || 0;
        jr = wialon.util.Helper.wrapCallback(jr);
        if(!this.__cX){

          jr(2);
          return;
        };
        return wialon.core.Remote.getInstance().remoteCall(fv, {
          creatorId : jp.getId(),
          name : name,
          password : js,
          dataFlags : jo,
          logInvalid : jq
        }, qx.lang.Function.bind(this.__dV, this, jr));
      },
      createUnitGroup : function(jv, name, jt, ju){

        ju = wialon.util.Helper.wrapCallback(ju);
        if(!this.__cX){

          ju(2);
          return;
        };
        return wialon.core.Remote.getInstance().remoteCall(gc, {
          creatorId : jv.getId(),
          name : name,
          dataFlags : jt
        }, qx.lang.Function.bind(this.__dV, this, ju));
      },
      createRetranslator : function(jz, name, jy, jw, jx){

        jx = wialon.util.Helper.wrapCallback(jx);
        if(!this.__cX){

          jx(2);
          return;
        };
        return wialon.core.Remote.getInstance().remoteCall(fH, {
          creatorId : jz.getId(),
          name : name,
          config : jy,
          dataFlags : jw
        }, qx.lang.Function.bind(this.__dV, this, jx));
      },
      createRoute : function(jC, name, jA, jB){

        jB = wialon.util.Helper.wrapCallback(jB);
        if(!this.__cX){

          jB(2);
          return;
        };
        return wialon.core.Remote.getInstance().remoteCall(fR, {
          creatorId : jC.getId(),
          name : name,
          dataFlags : jA
        }, qx.lang.Function.bind(this.__dV, this, jB));
      },
      createResource : function(jG, name, jD, jF, jE){

        jE = wialon.util.Helper.wrapCallback(jE);
        if(!this.__cX){

          jE(2);
          return;
        };
        if(typeof jF == gw){

          jE = jF;
          jF = 0;
        };
        return wialon.core.Remote.getInstance().remoteCall(Y, {
          creatorId : jG.getId(),
          name : name,
          skipCreatorCheck : jF,
          dataFlags : jD
        }, qx.lang.Function.bind(this.__dV, this, jE));
      },
      deleteItem : function(jK, jH, jI){

        var jJ = {
          itemId : jK.getId()
        };
        if(jI){

          jJ.reason = jI;
        };
        jH = wialon.util.Helper.wrapCallback(jH);
        return wialon.core.Remote.getInstance().remoteCall(o, jJ, qx.lang.Function.bind(this.__dW, this, jH, jK.getId()));
      },
      updateItem : function(jM, jN){

        if(!jM || !jN)return;
        if(jN.tp === fF){

          if(jN.pos){

            if(typeof jN.pos.t === fj)jN.pos.t = jN.t;
            if(typeof jN.pos.f === fj)jN.pos.f = jN.f;
            if(typeof jN.pos.lc === fj)jN.pos.lc = jN.lc;
          };
        };
        for(var jL in jN){

          switch(jL){case eV:case er:
          continue;};
          jO.call(this, jL);
        };
        if(Object.prototype.hasOwnProperty.call(jN, eV))jO.call(this, eV);
        if(Object.prototype.hasOwnProperty.call(jN, er))jO.call(this, er);
        function jO(jP){

          var jQ = this.__cQ[jP];
          if(typeof jQ === gw){

            jQ(jM, jN[jP]);
          };
        };
      },
      getIconsLibrary : function(jR, jT, jU){

        var jS = 0;
        if(typeof jU != fj)jS = jT; else jU = jT;
        wialon.core.Remote.getInstance().remoteCall(hm, {
          type : jR,
          flags : jS
        }, wialon.util.Helper.wrapCallback(jU));
      },
      getFirmwareLibrary : function(jW, jV){

        wialon.core.Remote.getInstance().remoteCall(I, {
          itemId : 0,
          storageType : 1,
          path : fs,
          mask : jW,
          recursive : true,
          fullPath : true
        }, wialon.util.Helper.wrapCallback(jV));
      },
      getLibraryFile : function(jX){

        var jY = {
          itemId : 0,
          storageType : 1,
          path : jX
        };
        return wialon.core.Session.getInstance().getBaseUrl() + this.__dB + fr + wialon.core.Session.getInstance().getId() + v + wialon.util.Json.stringify(jY);
      },
      readLibraryFile : function(ka, kb){

        wialon.core.Remote.getInstance().remoteCall(gE, {
          itemId : 0,
          storageType : 1,
          path : ka
        }, wialon.util.Helper.wrapCallback(kb));
      },
      resetPasswordRequest : function(kj, ki, kf, kh, ke){

        ke = wialon.util.Helper.wrapCallback(ke);
        if(!this.__cS){

          ke(2);
          return;
        };
        var kd = document.cookie.split(fB);
        var kc = go;
        for(var i = 0;i < kd.length;i++){

          var kg = kd[i].split(W);
          if(kg.length == 2 && kg[0] == gV){

            kc = kg[1];
            break;
          };
        };
        return wialon.core.Remote.getInstance().remoteCall(hq, {
          user : kj,
          email : ki,
          emailFrom : kf,
          url : kh,
          lang : kc
        }, ke);
      },
      resetPasswordPerform : function(km, kl, kk){

        kk = wialon.util.Helper.wrapCallback(kk);
        if(!this.__cS){

          kk(2);
          return;
        };
        return wialon.core.Remote.getInstance().remoteCall(fM, {
          user : km,
          code : kl
        }, kk);
      },
      sendSms : function(ko, kp, kn){

        return wialon.core.Remote.getInstance().remoteCall(gK, {
          phoneNumber : ko,
          smsText : kp
        }, wialon.util.Helper.wrapCallback(kn));
      },
      getAccountData : function(kr, kq){

        return wialon.core.Remote.getInstance().remoteCall(gh, {
          type : kr ? 2 : 1
        }, wialon.util.Helper.wrapCallback(kq));
      },
      getAccountsData : function(kt, ku, ks){

        if(typeof (ku) == gw){

          ks = ku;
          ku = 2;
        };
        return wialon.core.Remote.getInstance().remoteCall(gC, {
          itemId : kt,
          type : ku
        }, wialon.util.Helper.wrapCallback(ks));
      },
      checkItemsBilling : function(kv, kw, kx, ky){

        return wialon.core.Remote.getInstance().remoteCall(y, {
          items : kv,
          serviceName : kw,
          accessFlags : kx
        }, wialon.util.Helper.wrapCallback(ky));
      },
      checkAccessors : function(kA, kz){

        return wialon.core.Remote.getInstance().remoteCall(eP, kA, wialon.util.Helper.wrapCallback(kz));
      },
      listChangeAccount : function(kC, kB){

        return wialon.core.Remote.getInstance().remoteCall(gO, {
          dataFlags : kC.dataFlags,
          units : kC.units
        }, wialon.util.Helper.wrapCallback(kB));
      },
      getBusinessSpheres : function(kD, kE){

        var kF = {
        };
        kD && (kF.lang = kD);
        return wialon.core.Remote.getInstance().remoteCall(gm, kF, wialon.util.Helper.wrapCallback(kE));
      },
      getReportTables : function(kG){

        return wialon.core.Remote.getInstance().remoteCall(ha, {
        }, wialon.util.Helper.wrapCallback(kG));
      },
      setLoginHash : function(kH){

        this.__dj = kH;
      },
      getExportListUrl : function(kJ){

        var kI = qx.lang.Object.clone(kJ);
        return wialon.core.Session.getInstance().getBaseUrl() + this.__dB + fr + wialon.core.Session.getInstance().getId() + eJ + encodeURIComponent(wialon.util.Json.stringify(kI));
      },
      getCurrUser : function(){

        return this.__cX;
      },
      getServerTime : function(){

        return this.__cY;
      },
      getItem : function(kK){

        if(!this.__db)return null;
        var kL = this.__db[parseInt(kK)];
        if(typeof kL != gs)return kL;
        return null;
      },
      getItems : function(kO){

        if(!this.__db || !this.__dc)return null;
        if(typeof kO == fj || kO == fb){

          var kN = new Array;
          for(var kM in this.__db)kN.push(this.__db[kM]);
          return kN;
        } else {

          var kP = this.__dc[kO];
          if(typeof kP != fj)return kP;
        };
        return (new Array);
      },
      registerConstructor : function(kQ, kR){

        if(typeof this.__cR[kQ] != fj)return;
        this.__cR[kQ] = kR;
      },
      registerProperty : function(kS, kT){

        if(typeof this.__cQ[kS] != fj)return;
        this.__cQ[kS] = kT;
      },
      getBaseUrl : function(){

        return this.__dg;
      },
      setBaseUrl : function(kU){

        this.__dg = kU;
        this.__dw = kU;
        wialon.core.Remote.getInstance().setRequestsBaseUrl();
      },
      getEvtPollInterval : function(){

        return this.__cU;
      },
      setEvtPollInterval : function(kV){

        if(this.__cU !== kV){

          this.__cU = kV;
          if(this.__cV){

            clearTimeout(this.__cV);
            var kY = Date.now() - this.__cW;
            if(kY < 0){

              kY = 0;
            };
            var kW = kV * 1000;
            if(kY >= kW){

              this.__dL();
            } else {

              var kX = kW - kY;
              if(kX < 0){

                kX = 0;
              };
              this.__cV = qx.lang.Function.delay(this.__dL, kX, this);
            };
          };
        };
      },
      getBaseGisUrl : function(la){

        if(!this.__dh && this.__dw != fb){

          var lb = this.__dw.split(B);
          if(lb.length >= 2){

            var lc = {
              render : this.__dx,
              search : this.__dy,
              geocode : this.__dz,
              routing : this.__dA
            }[la];
            if(lc){

              return lc + fi + lb[1];
            };
          };
        };
        return this.__dw;
      },
      getGisSid : function(){

        return this.__gj;
      },
      getVideoServiceUrl : function(){

        return this.__gk;
      },
      getVideoServiceBaseUrl : function(){

        return this.__gl;
      },
      getId : function(){

        return this.__cT;
      },
      getRenderer : function(){

        return this.__de;
      },
      getMessagesLoader : function(){

        return this.__df;
      },
      getFeatures : function(){

        return this.__dm;
      },
      getBhphFeatures : function(){

        return this.__gi;
      },
      checkFeature : function(lf, lh){

        var le = this.checkFullFeature(lf);
        if(lh || this.__gi.indexOf(lf) === -1){

          return le;
        };
        if(lf === fm && !le){

          var ld = this.checkSubfeatures(lf, gL);
          var lg = this.checkSubfeatures(lf, a);
          if(!lg || !ld){

            return 0;
          } else if(lg === -1 || ld === -1){

            return -1;
          };
          return 1;
        };
        return le || this.checkSubfeatures(lf);
      },
      checkFullFeature : function(li){

        if(!this.__dm || typeof this.__dm.svcs == fj || !li)return 0;
        if(typeof this.__dm.svcs[li] == fj){

          if(this.__dm.unlim == 1)return 1;
          return 0;
        };
        var lj = this.__dm.svcs[li];
        if(lj == 1)return 1; else if(lj == 0)return -1;;
        return 0;
      },
      checkSubfeatures : function(lp, lk){

        if(!this.__dm || typeof this.__dm.svcs == fj || !lp)return 0;
        var lm = this.checkFullFeature(lp + gf);
        if(!lm){

          return 0;
        } else if(lm === -1){

          return -1;
        };
        var ln = this.getSubfeatures(lp, lk);
        var ll = 0;
        var lo = 0;
        var lq = Object.keys(ln).length;
        for(var name in ln){

          var status = ln[name];
          if(status === 0){

            ll++;
          } else if(status === 1){

            lo++;
          };
        };
        if(!lq || ll === lq){

          return 0;
        } else if(lo === 0){

          return -1;
        };
        return 1;
      },
      getSubfeatures : function(lw, lr){

        if(!lw){

          return {
          };
        };
        var ls = lw + gf;
        if(!this.checkFullFeature(ls)){

          return {
          };
        };
        var lx = new RegExp(lw + (lr ? eO + lr : hg) + eO);
        var lu = {
        };
        var lt = this.getFeatures().svcs;
        for(var lv in lt){

          if(lx.test(lv) && lv !== ls){

            lu[lv] = this.checkFullFeature(lv);
          };
        };
        return lu;
      },
      __dL : function(){

        this.__cV = null;
        this.__cW = Date.now();
        if(!this.__cT || !this.__cU || typeof wialon === fj)return;
        if(this.__dF && (typeof this.__dF.info === gw)){

          try{

            this.__dF.info({
              type : x
            });
          } catch(e) {

            console.error(e);
          };
        };
        wialon.core.Remote.getInstance().ajaxRequest(fQ, {
          sid : this.__cT
        }, qx.lang.Function.bind(this.__dM, this, this.__cT), 60);
      },
      __dM : function(lA, ly, lz){

        if(this.__dF && (typeof this.__dF.info === gw)){

          try{

            this.__dF.info({
              type : ge,
              code : ly,
              result : lz
            });
          } catch(e) {

            console.error(e);
          };
        };
        if(ly != 0){

          if(ly == 1){

            if(this.__dO(lA))this.fireEvent(eH);
          } else if(this.__cU){

            if(!this.__cV)this.__cV = qx.lang.Function.delay(this.__dL, this.__cU * 1000, this);
          };
          return;
        };
        if(this.__cU){

          if(!this.__cV)this.__cV = qx.lang.Function.delay(this.__dL, this.__cU * 1000, this);
        };
        this.__cY = lz.tm;
        if(this.__dI){

          try{

            this.__dI(lz);
          } catch(e) {

            this.__bA(e);
          };
        } else {

          for(var i = 0;i < lz.events.length;i++){

            this.emitRawServerEvent(lz.events[i]);
          };
          this.fireEvent(gG);
        };
        if(lz.units_update){

          this.fireDataEvent(ho, lz.units_update, null);
        };
      },
      emitRawServerEvent : function(lF){

        var lE;
        var i;
        try{

          if(lF.i > 0){

            lE = this.getItem(lF.i);
            if(lE && typeof lE != fj){

              if(lF.t == l)this.updateItem(lE, lF.d); else if(lF.t == hc)lE.handleMessage(lF.d); else if(lF.t == gi)this._onItemDeleted(lE);;;
            } else {

              if(lF && (typeof lF.i === fw) && (lF.t === fn)){

                var lD = this.__dl[lF.i];
                if(!lD){

                  lD = [];
                  this.__dl[lF.i] = lD;
                };
                lD.push(lF);
              };
            };
          } else if(lF.i == -1){

            this.fireDataEvent(gj, lF.d, null);
          } else if(lF.i == -2){

            if(this.__dO(this.getId()))this.fireEvent(eH);
          } else if(lF.i == -3){

            this.__dm = lF.d;
            this.fireEvent(ep);
          } else if(lF.i == -4){

            this.fireDataEvent(hl, lF.d, null);
          } else if(lF.i == -5){

            var lG = lF.d;
            if(typeof lG.r != fj && lG.r.length){

              for(i = 0;i < lG.r.length;i++){

                lE = this.getItem(lG.r[i]);
                if(lE){

                  this._onItemDeleted(lE);
                };
              };
            };
            if(typeof lG.a != fj && lG.a.length){

              var lC = [];
              for(i = 0;i < lG.a.length;i++){

                var lH = lG.a[i].ids;
                for(var k = 0;k < lH.length;k++){

                  var lB = lH[k];
                  lE = this.getItem(lB);
                  if(!lE){

                    lC.push(lB);
                  };
                };
              };
              if(lC.length){

                this.checkNewItems({
                  ids : lC
                });
              };
            };
          };;;;;
        } catch(e) {

          this.__bA(e);
        };
      },
      __dN : {
      },
      checkNewItems : function(lL, lI){

        var lM = lL.ids,lJ = lL.updateDataFlagsSpec;
        var lK = wialon.core.Session.getInstance();
        lM = lM.filter(qx.lang.Function.bind(function(lN){

          if(this.__dN[lN])return false;
          if(this.getItem(lN))return false;
          this.__dN[lN] = true;
          return true;
        }, this));
        if(!lJ){

          if(!lM.length){

            if(typeof lI === gw)lI(null);
            return;
          };
          lJ = [{
            type : hh,
            data : lM,
            flags : wialon.item.Item.dataFlag.base,
            mode : 1
          }];
        };
        this.updateDataFlags(lJ, qx.lang.Function.bind(function(lP){

          lM.forEach(qx.lang.Function.bind(function(lQ){

            delete this.__dN[lQ];
          }, this));
          if(lP){

            if(typeof lI === gw)lI(lP);
            return;
          };
          var lO = [];
          lM.forEach(qx.lang.Function.bind(function(lS){

            var lR = this.getItem(lS);
            if(!lR)return;
            lO.push(lR);
          }, this));
          this.fireDataEvent(gn, lO, null);
          if(typeof lI === gw)lI(null);
        }, this));
      },
      parseSessionData : function(lU){

        if(!lU || this.__cX)return false;
        this.__cT = lU.eid;
        this.__cU = 2;
        this.__cY = lU.tm;
        this.__dd = lU.au;
        this.__ds = (lU.api && lU.api.indexOf(M) >= 0) ? 1 : 0;
        if(lU.wsdk_version)this.__dp = lU.wsdk_version;
        if(lU.hl)this.__dr = lU.hl;
        this.__da = {
        };
        for(var lT in lU.classes)this.__da[lU.classes[lT]] = lT;
        this.__db = {
        };
        this.__dc = {
        };
        this.__cX = this.__dP(lU.user, wialon.item.User.defaultDataFlags());
        this.__dQ(this.__cX);
        if(lU.token){

          try{

            this.__dq = wialon.util.Json.parse(lU.token);
            if(lU.th)this.__dq.th = lU.th;
            if(this.__dq.p)this.__dq.p = wialon.util.Json.parse(this.__dq.p);
          } catch(e) {

            console.log(eW);
          };
        };
        if(typeof lU.features != fj)this.__dm = lU.features;
        if(lU.gis_render){

          this.__dx = lU.gis_render.replace(/\/+$/, hg);
        };
        if(lU.gis_geocode){

          this.__dz = lU.gis_geocode.replace(/\/+$/, hg);
        };
        if(lU.gis_search){

          this.__dy = lU.gis_search.replace(/\/+$/, hg);
        };
        if(lU.gis_routing){

          this.__dA = lU.gis_routing.replace(/\/+$/, hg);
        };
        if(lU.gis_sid){

          this.__gj = lU.gis_sid.replace(/\/+$/, hg);
        };
        if(lU.video_service_url){

          this.__gk = lU.video_service_url.replace(/\/+$/, hg);
        };
        if(lU.video_service_base_url){

          this.__gl = lU.video_service_base_url.replace(/\/+$/, hg);
        };
        if(typeof lU.base_url != fj && lU.base_url != fb && lU.base_url != this.getBaseUrl()){

          this.__dw = lU.base_url;
          if(!this.__dC){

            this.setBaseUrl(lU.base_url);
          };
        };
        wialon.core.Remote.getInstance().updateGisSenders();
        this.__dt = lU.hw_gw_ip || fb;
        this.__du = lU.hw_gw_dns || fb;
        if(typeof lU.env != fj && lU.env)this.__dv = lU.env;
        this.__dJ = lU.web_site;
        this.__dK = lU.web_cms_manager_site;
        if(this.__cU){

          if(!this.__cV)this.__cV = qx.lang.Function.delay(this.__dL, this.__cU * 1000, this);
        };
        return true;
      },
      getApiPath : function(){

        return this.__dB;
      },
      isWhiteLabel : function(){

        return this.__dD;
      },
      getLogger : function(){

        return this.__dF;
      },
      getCoordinatesTransformer : function(){

        return this.__dH;
      },
      setCoordinatesTransformer : function(lV){

        this.__dH = lV;
      },
      setRawServerEventsHandler : function(lW){

        this.__dI = lW;
      },
      getWebSite : function(){

        return this.__dJ;
      },
      getWebManagerSite : function(){

        return this.__dK;
      },
      __bA : function(e){

        if(this.__dF && typeof this.__dF.error === gw){

          try{

            this.__dF.error({
              exception : e
            });
          } catch(lX) {

            console.error(lX);
          };
        } else {

          console.error(e);
        };
      },
      __dO : function(lY){

        if(lY && lY != this.__cT)return false;
        this.__cS = 0;
        this.__cT = fb;
        this.__cX = null;
        this.__db = null;
        this.__dc = null;
        this.__cU = 0;
        this.__de = null;
        this.__df = null;
        this.__dg = fb;
        this.__dh = false;
        this.__cQ = {
        };
        this.__cR = {
        };
        this.__dd = fb;
        this._libraries = {
        };
        this._disposeMap(J);
        this._disposeObjects(fc);
        this.__da = null;
        this.__dm = null;
        this.__ds = 0;
        this.__dt = fb;
        this.__du = fb;
        this.__dv = {
        };
        this.__gj = fb;
        this.__gk = fb;
        this.__gl = fb;
        return true;
      },
      __dP : function(md, mc){

        if(!md || !mc)return null;
        md.tp = this.__da[md.cls];
        if(typeof md.tp == fj)return null;
        var mb;
        var me = this.__cR[md.tp];
        if(typeof me == fj)return null;
        mb = new me(md, mc);
        this.updateItem(mb, md);
        var ma = mb && this.__dl[mb.getId()];
        if(ma){

          delete this.__dl[mb.getId()];
          ma.forEach(qx.lang.Function.bind(function(mf){

            this.updateItem(mb, mf.d);
          }, this));
        };
        return mb;
      },
      __dQ : function(mg){

        if(!mg || !this.__db)return;
        this.__db[mg.getId()] = mg;
        var mh = this.__dc[mg.getType()];
        if(typeof mh == fj){

          this.__dc[mg.getType()] = new Array;
          mh = this.__dc[mg.getType()];
        };
        mh.push(mg);
      },
      __dR : function(mi){

        if(!mi)return;
        if(typeof this.__db[mi.getId()] != fj)delete this.__db[mi.getId()];
        var mj = this.__dc[mi.getType()];
        if(typeof mj != fj)qx.lang.Array.remove(mj, mi);
        mi.dispose();
      },
      _onItemDeleted : function(mk){

        if(!mk)return;
        mk.fireEvent(fo);
        this.__dR(mk);
      },
      __dS : function(ml, mm, mn){

        if(mm || !mn){

          ml(mm, mn);
          return;
        };
        if(this.parseSessionData(mn))ml(0); else ml(6);
      },
      __dT : function(mr, mp, mu){

        if(mp || !mu){

          mr(mp);
          return;
        };
        for(var i = 0;i < mu.length;i++){

          var ms = mu[i].f;
          var mo = mu[i].i;
          var mq = mu[i].d;
          var mt = this.__db[mo];
          if(typeof mt == fj && ms != 0 && mq){

            var mt = this.__dP(mq, ms);
            if(mt)this.__dQ(mt);
          } else {

            if(ms == 0)this.__dR(mt); else {

              if(typeof mt == fj)return;
              if(mq)this.updateItem(mt, mq);
              mt.setDataFlags(ms);
            };
          };
          mq = null;
        };
        mr(0);
      },
      __dU : function(mw, mv, mz){

        if(mv || !mz){

          mw(mv, null);
          return;
        };
        var mx = {
          searchSpec : mz.searchSpec,
          dataFlags : mz.dataFlags,
          totalItemsCount : mz.totalItemsCount,
          indexFrom : mz.indexFrom,
          indexTo : mz.indexTo,
          items : []
        };
        for(var i = 0;i < mz.items.length;i++){

          var my = this.__dP(mz.items[i], mz.dataFlags);
          if(my)mx.items.push(my);
          qx.core.ObjectRegistry.unregister(my);
        };
        mw(0, mx);
        return mx;
      },
      __dV : function(mD, mB, mC){

        if(mB || !mC){

          mD(mB, mC);
          return;
        };
        var mA = this.__dP(mC.item, mC.flags);
        qx.core.ObjectRegistry.unregister(mA);
        mD((mA === null ? 6 : 0), mA);
        return mA;
      },
      __dW : function(mF, mE, mG){

        if(!mG){

          var mH = this.getItem(mE);
          if(mH){

            mH.fireEvent(fo);
            this.__dR(mH);
          };
        };
        mF(mG);
      }
    },
    destruct : function(){

      this.__dO();
      this._disposeObjects(fc, fO, K);
    },
    events : {
      "serverUpdated" : A,
      "invalidSession" : A,
      "fileUploaded" : fT,
      "featuresUpdated" : A,
      "unitsUpdated" : fT
    },
    statics : {
      exportDataFlag : {
        userName : 0x0001,
        userCreatorName : 0x0002,
        userAccount : 0x0004,
        userBillingPlan : 0x0008,
        userLastVisit : 0x0010,
        unitName : 0x0001,
        unitCreatorName : 0x0002,
        unitAccount : 0x0004,
        unitDeviceType : 0x0008,
        unitUid : 0x0010,
        unitPhone : 0x0020,
        unitLastMsg : 0x0040,
        unitCreated : 0x0080,
        unitCustomFields : 0x0100,
        unitGroups : 0x0200,
        unitDeactivation : 0x0400,
        unitGroupName : 0x0001,
        unitGroupCreatorName : 0x0002,
        unitGroupAccount : 0x0004,
        unitGroupUnitsCount : 0x0008,
        accountName : 0x0001,
        accountCreatorName : 0x0002,
        accountParentAccount : 0x0004,
        accountBillingPlan : 0x0008,
        accountDealer : 0x0010,
        accountUnits : 0x0020,
        accountBalance : 0x0040,
        accountDays : 0x0080,
        accountStatus : 0x0100,
        accountBlocked : 0x0200,
        accountActivatedUnits : 0x0400,
        retranslatorName : 0x0001,
        retranslatorCreatorName : 0x0002,
        retranslatorAccount : 0x0004,
        retranslatorProtocol : 0x0008,
        retranslatorServer : 0x0010,
        retranslatorState : 0x0020,
        retranslatorUnitNames : 0x0040,
        retranslatorUnitIds : 0x0080
      },
      destroyInstance : function(){

        if(this.$$instance){

          this.$$instance.dispose();
          delete this.$$instance;
        };
      }
    }
  });
  var hr = window.setInterval(function(){

    if(qx.$$loader.scriptLoaded){

      clearInterval(hr);
      var mJ = fb;
      if(document.currentScript)mJ = document.currentScript.src; else {

        var mL = document.getElementsByTagName(w);
        for(var i = 0;i < mL.length;i++)if(mL[i].src.search(gp) > 0 && mL[i].src.lastIndexOf(eI) >= 0){

          mJ = mL[i].src;
          break;
        };
      };
      var mM = gH;
      var mI = new RegExp(mM);
      var mK = mI.exec(mJ);
      if(mK != null && typeof window[mK[1]] == gw)window[mK[1]]();
    };
  }, 50);
})();
(function(){

  var a = "prp",b = "qx.event.type.Data",c = "file/mkdir",d = "item/add_log_record",e = "item/list_backups",f = "mu",g = "Integer",h = "string",i = "delete_item",j = "Object",k = "prpu",l = "bact",m = "custom_msg",n = "&svc=file/get&params=",o = "item/restore_icons",p = "qx.event.type.Event",q = "item/get_backup",r = "nm",s = "item/update_custom_property",t = "changeUserAccess",u = "update_name",v = "String",w = "changeDataFlags",x = "unitIcons",y = "",z = "changeMeasureUnits",A = "number",B = "file/write",C = "item/update_name",D = "messageRegistered",E = "item/update_ftp_property",F = "uacl",G = "file/read",H = "ct",I = "file/put",J = "changeCustomProperty",K = "changeFtpProperty",L = "file/rm",M = "wialon.item.Item",N = "item/update_measure_units",O = "changeName",P = "crt",Q = "resId",R = "update_access",S = "file/list",T = "undefined",U = "?sid=",V = "object";
  qx.Class.define(M, {
    extend : qx.core.Object,
    construct : function(X, W){

      qx.core.Object.call(this);
      this.setDataFlags(W);
      this._id = X.id;
      this._type = X.tp;
    },
    properties : {
      dataFlags : {
        init : null,
        check : g,
        event : w
      },
      name : {
        init : null,
        check : v,
        event : O
      },
      measureUnits : {
        init : 0,
        check : g,
        event : z
      },
      userAccess : {
        init : null,
        check : g,
        event : t
      },
      customProps : {
        init : null,
        check : j
      },
      creatorId : {
        init : null,
        check : g
      },
      accountId : {
        init : null,
        check : g
      },
      creationTime : {
        init : null,
        check : g
      },
      ftpProps : {
        init : null,
        check : j
      }
    },
    members : {
      _id : 0,
      _type : y,
      getId : function(){

        return this._id;
      },
      getType : function(){

        return this._type;
      },
      getCustomProperty : function(ba, bb){

        var Y = this.getCustomProps();
        if(Y){

          var bc = Y[ba];
          if(typeof bc != T)return bc;
        };
        if(typeof bb != T)return bb;
        return y;
      },
      setCustomProperty : function(be, bd){

        var bg = this.getCustomProps();
        if(bg){

          var bf = bg[be];
          if(typeof bf == T)bf = y;
          if(bd != y)bg[be] = bd; else if(bf != y)delete bg[be];;
          if(bd != bf)this.fireDataEvent(J, {
            n : be,
            v : bd
          }, {
            n : be,
            v : bf
          });
        };
      },
      getFtpProperty : function(bi, bj){

        var bh = this.getFtpProps();
        if(bh){

          var bk = bh[bi];
          if(typeof bk != T)return bk;
        };
        if(typeof bj != T)return bj;
        return y;
      },
      setFtpProperty : function(bm, bl){

        var bo = this.getFtpProps();
        if(bo){

          var bn = bo[bm];
          if(typeof bn == T)bn = y;
          if(bl != y)bo[bm] = bl; else if(bn != y)delete bo[bm];;
          if(bl != bn)this.fireDataEvent(K, {
            n : bm,
            v : bl
          }, {
            n : bm,
            v : bn
          });
        };
      },
      handleMessage : function(bp){

        this.fireDataEvent(D, bp, null);
      },
      updateCustomProperty : function(bs, br, bq){

        return wialon.core.Remote.getInstance().remoteCall(s, {
          itemId : this.getId(),
          name : bs,
          value : (typeof br == h || typeof br == A) ? br : y
        }, qx.lang.Function.bind(this.__dY, this, wialon.util.Helper.wrapCallback(bq)));
      },
      updateFtpProperty : function(bt, bu){

        if(typeof bt.ps == T){

          return wialon.core.Remote.getInstance().remoteCall(E, {
            itemId : this.getId(),
            host : bt.hs,
            login : bt.lg,
            path : bt.pt,
            check : bt.ch,
            hostingFtp : bt.tp
          }, qx.lang.Function.bind(this.__ea, this, wialon.util.Helper.wrapCallback(bu)));
        } else {

          return wialon.core.Remote.getInstance().remoteCall(E, {
            itemId : this.getId(),
            host : bt.hs,
            login : bt.lg,
            pass : bt.ps,
            path : bt.pt,
            check : bt.ch,
            hostingFtp : bt.tp
          }, qx.lang.Function.bind(this.__ea, this, wialon.util.Helper.wrapCallback(bu)));
        };
      },
      updateMeasureUnits : function(bx, bw, bv){

        return wialon.core.Remote.getInstance().remoteCall(N, {
          itemId : this.getId(),
          type : bx,
          flags : bw
        }, qx.lang.Function.bind(this._onUpdateProperties, this, wialon.util.Helper.wrapCallback(bv)));
      },
      updateName : function(name, by){

        return wialon.core.Remote.getInstance().remoteCall(C, {
          itemId : this.getId(),
          name : name
        }, qx.lang.Function.bind(this._onUpdateProperties, this, wialon.util.Helper.wrapCallback(by)));
      },
      addLogRecord : function(bz, bB, bC, bA){

        return wialon.core.Remote.getInstance().remoteCall(d, {
          itemId : this.getId(),
          action : bz,
          newValue : bB || y,
          oldValue : bC || y
        }, wialon.util.Helper.wrapCallback(bA));
      },
      fileGet : function(bD, bE){

        var bG = {
          itemId : this.getId(),
          storageType : bD,
          path : bE
        };
        var bF = wialon.core.Session.getInstance();
        return bF.getBaseUrl() + bF.getApiPath() + U + wialon.core.Session.getInstance().getId() + n + encodeURIComponent(wialon.util.Json.stringify(bG));
      },
      fileList : function(bI, bL, bJ, bH, bM, bK){

        wialon.core.Remote.getInstance().remoteCall(S, {
          itemId : this.getId(),
          storageType : bI,
          path : bL,
          mask : bJ,
          recursive : bH,
          fullPath : bM
        }, wialon.util.Helper.wrapCallback(bK));
      },
      fileRm : function(bN, bO, bP){

        wialon.core.Remote.getInstance().remoteCall(L, {
          itemId : this.getId(),
          storageType : bN,
          path : bO
        }, wialon.util.Helper.wrapCallback(bP));
      },
      fileMkdir : function(bQ, bR, bS){

        wialon.core.Remote.getInstance().remoteCall(c, {
          itemId : this.getId(),
          storageType : bQ,
          path : bR
        }, wialon.util.Helper.wrapCallback(bS));
      },
      filePut : function(bV, ca, bU, bT, bY, bW){

        var bX = {
        };
        bX.itemId = this.getId();
        bX.storageType = bV;
        bX.path = ca;
        bX.writeType = bT;
        wialon.core.Uploader.getInstance().uploadFiles([bU], I, bX, bW, true, bY);
      },
      fileRead : function(cb, ce, cd, cc){

        wialon.core.Remote.getInstance().remoteCall(G, {
          itemId : this.getId(),
          storageType : cb,
          contentType : cd,
          path : ce
        }, wialon.util.Helper.wrapCallback(cc));
      },
      fileWrite : function(ch, cj, content, cg, cf, ci){

        wialon.core.Remote.getInstance().remoteCall(B, {
          itemId : this.getId(),
          storageType : ch,
          path : cj,
          writeType : cg,
          contentType : cf,
          content : content
        }, wialon.util.Helper.wrapCallback(ci));
      },
      listBackups : function(ck){

        wialon.core.Remote.getInstance().remoteCall(e, {
          itemId : this.getId()
        }, wialon.util.Helper.wrapCallback(ck));
      },
      getBackup : function(cm, cl){

        wialon.core.Remote.getInstance().remoteCall(q, {
          itemId : this.getId(),
          fileId : cm
        }, wialon.util.Helper.wrapCallback(cl));
      },
      restoreIcons : function(co, cn){

        var cp = {
        };
        if(co && typeof co == V){

          cp = co;
          cp[Q] = this.getId();
        } else {

          cp[x] = {
          };
          cp[x][this.getId()] = co;
        };
        wialon.core.Remote.getInstance().remoteCall(o, cp, wialon.util.Helper.wrapCallback(cn));
      },
      __dY : function(cq, cr, cs){

        if(cr == 0 && cs)this.setCustomProperty(cs.n, cs.v);
        cq(cr);
      },
      __ea : function(ct, cu, cv){

        if(cu == 0 && cv)this.setFtpProps(cv);
        ct(cu);
      },
      _onUpdateProperties : function(cw, cx, cy){

        if(cx == 0 && cy)wialon.core.Session.getInstance().updateItem(this, cy);
        cw(cx);
      }
    },
    statics : {
      dataFlag : {
        base : 0x00000001,
        customProps : 0x00000002,
        billingProps : 0x00000004,
        customFields : 0x00000008,
        image : 0x00000010,
        messages : 0x00000020,
        guid : 0x00000040,
        adminFields : 0x00000080,
        profileFields : 0x00800000
      },
      accessFlag : {
        view : 0x1,
        viewProperties : 0x2,
        setAcl : 0x4,
        deleteItem : 0x8,
        editName : 0x10,
        viewCFields : 0x20,
        editCFields : 0x40,
        editOther : 0x80,
        editImage : 0x100,
        execReports : 0x200,
        editSubItems : 0x400,
        manageLog : 0x800,
        viewAFields : 0x1000,
        editAFields : 0x2000,
        viewFile : 0x4000,
        editFile : 0x8000
      },
      messageFlag : {
        typeMask : 0xFF00,
        typeUnitData : 0x0000,
        typeUnitSMS : 0x0100,
        typeUnitCmd : 0x0200,
        typeUnitEvent : 0x0600,
        typeUserLog : 0x0400,
        typeNotification : 0x0300,
        typeBalance : 0x0500,
        typeAgroCultivation : 0x0700,
        typeDriverSMS : 0x0900,
        typeLogRecord : 0x1000,
        typeOrder : 0x0B00,
        typeOther : 0xFF00
      },
      measureUnitsType : {
        si : 0x00,
        us : 0x01,
        im : 0x02,
        lat : 0x03
      },
      measureUnitsFlag : {
        setMeasureUnits : 0x00,
        convertMeasureUnits : 0x01
      },
      logMessageAction : {
        itemCustomMessage : m,
        itemUpdatedName : u,
        itemUpdatedUserAccess : R,
        itemDeleted : i
      },
      fileStorageType : {
        publicType : 1,
        protectedType : 2
      },
      fileWriteType : {
        overwrite : 0,
        append : 1,
        skip : 2
      },
      fileContentType : {
        plainText : 0,
        hexString : 1,
        base64 : 2
      },
      registerProperties : function(){

        var cz = wialon.core.Session.getInstance();
        cz.registerProperty(r, this.remoteUpdateName);
        cz.registerProperty(f, this.remoteUpdateMeasureUnits);
        cz.registerProperty(F, this.remoteUpdateUserAccess);
        cz.registerProperty(a, this.remoteUpdateCustomProps);
        cz.registerProperty(k, this.remoteUpdateCustomProp);
        cz.registerProperty(P, this.remoteUpdateCreatorId);
        cz.registerProperty(l, this.remoteUpdateAccountId);
        cz.registerProperty(H, this.remoteUpdateCreationTime);
      },
      remoteUpdateName : function(cA, cB){

        cA.setName(cB);
      },
      remoteUpdateMeasureUnits : function(cC, cD){

        cC.setMeasureUnits(cD);
      },
      remoteUpdateUserAccess : function(cE, cF){

        cE.setUserAccess(cF);
      },
      remoteUpdateCustomProps : function(cG, cH){

        cG.setCustomProps(cH);
      },
      remoteUpdateCustomProp : function(cI, cK){

        for(var cJ in cK){

          cI.setCustomProperty(cJ, cK[cJ]);
        };
      },
      remoteUpdateCreatorId : function(cL, cM){

        cL.setCreatorId(cM);
      },
      remoteUpdateAccountId : function(cN, cO){

        cN.setAccountId(cO);
      },
      remoteUpdateCreationTime : function(cP, cQ){

        cP.setCreationTime(cQ);
      }
    },
    events : {
      "changeName" : b,
      "changeDataFlags" : b,
      "changeUserAccess" : b,
      "changeCustomProperty" : b,
      "itemDeleted" : p,
      "messageRegistered" : b,
      "changeFtpProperty" : b
    }
  });
})();
(function(){

  var a = "/post.html",b = "function",c = '',d = "geocode",e = "singleton",f = "wialon.core.Remote",g = "/gis_post?3",h = "error",j = "/gis_post?1",k = "abort",l = "success",m = "search",n = ":",o = "core/batch",p = "",q = "/gis_geocode",r = "sdk",s = "/gis_search",t = "//",u = "statusError",v = "/gis_post?2",w = "?svc=",x = '/wialon',y = "routing",z = "/wialon",A = "timeout",B = "undefined",C = "object";
  qx.Class.define(f, {
    extend : qx.core.Object,
    type : e,
    construct : function(){

      qx.core.Object.call(this);
      this.setRequestsBaseUrl();
      this.queueRequest = new D(3);
    },
    members : {
      __eb : null,
      __ec : [],
      __ed : p,
      __ee : 30,
      setRequestsBaseUrl : function(){

        var E = wialon.core.Session.getInstance();
        var F = E.isWhiteLabel();
        var G = F ? c : x;
        this._req = {
        };
        this._req[r] = new wialon.core.PostMessage(this.createFullUrl(E.getBaseUrl()) + G + a);
        this.updateGisSenders();
      },
      remoteCall : function(J, M, K, N){

        K = wialon.util.Helper.wrapCallback(K);
        if(typeof N == B)N = this.__ee;
        if(this.__eb)this.__eb.push({
          svc : J,
          params : M ? M : {
          },
          callback : K,
          timeout : N
        }); else {

          var L = wialon.core.Session.getInstance();
          var H = L.getApiPath() + w + J;
          var I = {
            params : {
            }
          };
          if(M)I = {
            params : M
          };
          var self = this;
          return this.queueRequest.schedule(function(O){

            self.ajaxRequest(H, I, function(Q, P){

              K(Q, P);
              O();
            }, N, J);
          });
        };
      },
      updateGisSenders : function(){

        this.updateGisSender(m);
        this.updateGisSender(d);
        this.updateGisSender(y);
      },
      updateGisSender : function(W){

        if(!this._req){

          return;
        };
        var U = wialon.core.Session.getInstance();
        var R = {
          search : j,
          geocode : v,
          routing : g
        };
        var T = this._req[W];
        if(T && T._io && (typeof postMessage.dispose === b)){

          T.dispose();
        };
        var V = R[W];
        if(V){

          var S;
          if(U.getBaseGisUrl(W) != p){

            S = this.createFullUrl(U.getBaseGisUrl(W)) + V;
          } else {

            S = this.createFullUrl() + z + V;
          };
          this._req[W] = new wialon.core.PostMessage(S);
        };
      },
      replaceSender : function(X, Y){

        this._req[X] = Y;
      },
      startBatch : function(ba){

        if(this.__eb)return 0;
        if(ba)this.__ed = ba;
        this.__eb = new Array;
        return 1;
      },
      finishBatch : function(bb, bg, bh){

        bb = wialon.util.Helper.wrapCallback(bb);
        if(!this.__eb){

          bb(2, 2);
          return;
        };
        this.__ec.push(bb);
        if(this.__ed && bg != this.__ed){

          return;
        };
        bb = wialon.util.Helper.wrapCallback(this.__ec);
        if(!this.__eb.length){

          this.__ed = p;
          this.__ec = [];
          this.__eb = null;
          bb(0, 0);
          return;
        };
        if(!bh)bh = 0;
        var be = 0;
        var bf = [];
        var bc = [];
        for(var i = 0;i < this.__eb.length;i++){

          var bd = this.__eb[i];
          bf.push({
            svc : bd.svc,
            params : bd.params
          });
          bc.push(bd.callback);
          if(bd.timeout > be)be = bd.timeout;
        };
        this.__eb = null;
        this.__ed = p;
        this.__ec = [];
        this.remoteCall(o, {
          params : bf,
          flags : bh
        }, qx.lang.Function.bind(this.__ei, this, bb, bc), be);
      },
      ajaxRequest : function(bj, bm, bl, bn, bi){

        var bk = r;
        if(bj.match(q))bk = d; else if(bj.match(s))bk = m;;
        if(this._req[bk].supportAsync())this._req[bk].send(bj, bm, qx.lang.Function.bind(this.__ef, this, bl), qx.lang.Function.bind(this.__eg, this, bl), bn, {
        }); else {

          bm.svc = bi;
          var bo = wialon.util.Json.stringify(bm);
          bm = null;
          return this.__ef(bl, wialon.util.Json.parse(this._req[bk].send(bo)));
        };
      },
      jsonRequest : function(bp, bt, bs, bu, bv){

        var br = new qx.io.request.Jsonp(bp);
        var bq = null;
        br.setCache(false);
        if(bv)br.setCallbackName(bv);
        br.setTimeout(bu * 1000);
        if(bt){

          if(typeof bt == C)br.setRequestData(bt); else br.setRequestData({
            params : bt
          });
        };
        if(bs){

          br.addListener(l, qx.lang.Function.bind(this.__eh, this, bs, br));
          bq = qx.lang.Function.bind(this.__eg, this, bs, br);
          br.addListener(h, bq);
          br.addListener(k, bq);
          br.addListener(A, bq);
          br.addListener(u, bq);
        };
        br.send();
        br = null;
        bq = null;
      },
      setBaseUrl : function(bw){

        this.__dg = bw;
      },
      setTimeout : function(bx){

        this.__ee = bx;
      },
      getTimeout : function(){

        return this.__ee;
      },
      createFullUrl : function(by){

        if(typeof document == B)return by;
        return by ? by : document.location.protocol + t + document.location.hostname + (document.location.port.length ? n + document.location.port : p);
      },
      __ef : function(bz, bA){

        return this.__ej(bA, bz);
      },
      __eg : function(bB, bC){

        bB(5, null);
      },
      __eh : function(bD, bE){

        this.__ej(bE.getResponse(), bD);
      },
      __ei : function(bG, bI, bF, bH){

        if(bF == 0 && (!bH || !bI || bI.length != bH.length))bF = 3;
        if(bF){

          for(var i = 0;i < bI.length;i++)bI[i] ? bI[i](bF) : null;
          bG(bF, bF);
          return;
        };
        var bM = 0;
        var bL = [];
        var bK = 0;
        var bJ = [];
        for(var i = 0;i < bH.length;i++){

          bJ.push(this.__ej(bH[i], bI[i]));
          if(bH[i])bM = bH[i];
          bL.push(bH[i]);
          if(typeof bH[i].error != B)bK++;
        };
        bG(bF, bM, bK, bL);
        return bJ;
      },
      __ej : function(bO, bN){

        if(bO && typeof bO.error != B && bO.error != 0)return bN(bO.error, bO); else if(bO)return bN(0, bO); else return bN(3, null);;
      }
    },
    destruct : function(){

      if(this._req)for(var bQ in this._req)if(this._req.hasOwnProperty(bQ)){

        var bP = this._req[bQ];
        if(bP && (typeof bP.dispose === b)){

          bP.dispose();
        };
      };;
    },
    statics : {
      BatchFlag : {
        breakFailure : 0x01
      },
      destroyInstance : function(){

        if(this.$$instance){

          this.$$instance.dispose();
          delete this.$$instance;
        };
      }
    }
  });
  function D(bT){

    var bR = 0;
    var bS = [];
    this.schedule = function(bV){

      if(bR >= bT){

        bS.push(bV);
      } else {

        bR++;
        bV(bU);
      };
    };
    function bU(){

      bR--;
      if(bS.length && bR < bT){

        var bW = bS.shift();
        bR++;
        bW(bU);
      };
    };
  };
})();
(function(){

  var a = "=",b = "posthtml",c = "",d = "onmessage",e = "none",f = "sid",g = "src",h = "onload",j = "message",k = "wialon.core.PostMessage",l = '',m = "\", \"chunkedPrefix\": \"",o = "load",p = "iframe",q = ":",r = "&sid=",s = "\", \"enableChunkedResult\": true}",t = "&",u = "string",v = "{\"id\": 0, \"source\":\"",w = "object";
  qx.Class.define(k, {
    extend : qx.core.Object,
    construct : function(x){

      qx.core.Object.call(this);
      this._url = x;
      this._id = this._url;
      this._io = null;
      this._callbacks = {
      };
      this._chunkedPrefix = b + (++wialon.core.PostMessage._postMessagePrefixCounter) + q;
    },
    members : {
      send : function(A, C, z, E, D){

        if(!this._io){

          this._io = document.createElement(p);
          this._io.style.display = e;
          if(window.attachEvent)this._io.attachEvent(h, qx.lang.Function.bind(this.__er, this)); else this._io.addEventListener(o, qx.lang.Function.bind(this.__er, this), false);
          this._io.setAttribute(g, this._url);
          document.body.appendChild(this._io);
          this._messageEventHandler = qx.lang.Function.bind(this.__eo, this);
          if(window.addEventListener){

            window.addEventListener(j, this._messageEventHandler, false);
          } else {

            window.attachEvent(d, this._messageEventHandler);
          };
        };
        var F = {
          id : ++this._counter,
          url : A,
          params : this.__ek(C),
          source : this._id
        };
        var B = this._io.contentWindow;
        if(B){

          var y = wialon.util.Json.stringify(F);
          this._callbacks[this._counter] = [z, E, y, 0, D];
          if(D)this._callbacks[this._counter].push(setTimeout(qx.lang.Function.bind(this.__el, this, this._counter), D * 1000));
          if(this._frameReady)B.postMessage(y, this._url); else this._requests.push(y);
        } else E();
      },
      supportAsync : function(){

        return true;
      },
      _url : c,
      _io : null,
      _id : 0,
      _callbacks : {
      },
      _requests : [],
      _frameReady : false,
      _timeout : 0,
      _counter : 0,
      _chunkedPrefix : null,
      _chunkedResultEnabled : false,
      _chunksAwaiting : {
      },
      __eo : function(event){

        var I = event.data;
        var J = this._url && new URL(this._url).origin;
        if(event.origin != J){

          return;
        };
        if(this._chunkedResultEnabled){

          var G = this.__eq(I);
          if(!G)return;
          if(G.chunksCount === 1){

            I = G.data;
          } else {

            var L = this._chunksAwaiting[G.id];
            if(!L){

              L = {
                chunksLeft : G.chunksCount,
                chunks : []
              };
              for(var i = 0;i < G.chunksCount;i++){

                L.chunks.push(null);
              };
              this._chunksAwaiting[G.id] = L;
            };
            if(!L.chunks[G.chunkIndex]){

              L.chunks[G.chunkIndex] = G.data;
              L.chunksLeft--;
            };
            if(!L.chunksLeft){

              I = L.chunks.join(l);
              delete this._chunksAwaiting[G.id];
            } else {

              return;
            };
          };
        };
        var K = wialon.util.Json.parse(I);
        if(!K || K.source != this._id)return;
        if(!K.id){

          this._frameReady = true;
          if(K.chunkedResult){

            this._chunkedResultEnabled = true;
          };
          this.__er();
          return;
        };
        var H = this._callbacks[K.id];
        if(H){

          if(K && K.text && K.text.error && K.text.error == 1003 && H[3] < 3){

            H[3]++;
            if(H[4] && H[5]){

              clearTimeout(H[5]);
              H[5] = setTimeout(qx.lang.Function.bind(this.__el, this, this._counter), H[4] * 1000);
            };
            if(this._io.contentWindow){

              setTimeout(qx.lang.Function.bind(function(M){

                this._io.contentWindow.postMessage(M, this._url);
              }, this, H[2]), Math.random() * 1000);
              return;
            };
          };
          if(H[K.error])H[K.error](K.text);
          if(H[4] && H[5])clearTimeout(H[5]);
          delete this._callbacks[K.id];
        };
      },
      __eq : function(R){

        if(typeof R !== u)return false;
        if(R.slice(0, this._chunkedPrefix.length) !== this._chunkedPrefix)return null;
        var U = R.indexOf(q, this._chunkedPrefix.length);
        if(U < 0)return false;
        var N = R.indexOf(q, U + 1);
        if(N < 0)return false;
        var Q = R.indexOf(q, N + 1);
        if(Q < 0)return false;
        var O = parseInt(R.slice(this._chunkedPrefix.length, U), 10),S = parseInt(R.slice(U + 1, N), 10),P = parseInt(R.slice(N + 1, Q), 10),T = R.slice(Q + 1);
        if(!isFinite(O) || !isFinite(S) || !isFinite(P))return false;
        return {
          id : O,
          chunkIndex : S,
          chunksCount : P,
          data : T
        };
      },
      __er : function(){

        if(!this._frameReady){

          var V = v + this._id + m + this._chunkedPrefix + s;
          this._io.contentWindow.postMessage(V, this._url);
          return;
        };
        for(var i = 0;i < this._requests.length;i++)this._io.contentWindow.postMessage(this._requests[i], this._url);
        this._requests = [];
      },
      __el : function(X){

        var W = this._callbacks[X];
        if(W){

          if(W[1])W[1]();
          delete this._callbacks[X];
        };
      },
      __ek : function(bb){

        var Y = [];
        var ba = false;
        if(typeof bb == w){

          for(var n in bb){

            if(typeof bb[n] == w)Y.push(n + a + encodeURIComponent(wialon.util.Json.stringify(bb[n]))); else Y.push(n + a + encodeURIComponent(bb[n]));
            if(n == f)ba = true;
          };
          return Y.join(t) + (!ba ? r + wialon.core.Session.getInstance().getId() : c);
        };
        return !ba ? r + wialon.core.Session.getInstance().getId() : c;
      }
    },
    destruct : function(){

      if(this._io && this._io.parentNode){

        this._io.parentNode.removeChild(this._io);
        this._io = null;
      };
      if(this._messageEventHandler){

        if(window.addEventListener){

          window.removeEventListener(j, this._messageEventHandler);
        } else {

          window.detachEvent(d, this._messageEventHandler);
        };
        this._messageEventHandler = null;
      };
    },
    statics : {
      _postMessagePrefixCounter : 0
    }
  });
})();
(function(){

  var d = '\\u00',g = "array",h = '',j = '\\\\',k = '\\f',m = ']',n = "static",o = "wialon.util.Json",p = '"',q = "null",r = '\\"',s = ',',t = '(',u = ':',w = "",y = '\\t',z = "number",A = '\\r',B = '{',C = 'null',D = 'string',E = '\\b',F = '[',G = ')',H = '\\n',I = '}';
  qx.Class.define(o, {
    type : n,
    statics : {
      stringify : function(J){

        var f = null;
        if(isNaN(J))f = this.__ep[typeof J]; else if(J instanceof Array)f = this.__ep[g]; else f = this.__ep[z];;
        if(f)return f.apply(this, [J]);
        return w;
      },
      parse : function(json, safe){

        try{

          return JSON.parse(json);
        } catch(e) {
        };
        if(safe === undefined)safe = false;
        if(safe && !/^("(\\.|[^"\\\n\r])*?"|[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t])+?$/.test(json))return undefined;
        if(!json || json == w)return {
        };
        var res = null;
        try{

          res = qx.lang.Json.parse(json);
        } catch(e1) {

          try{

            res = eval(t + json + G);
          } catch(e) {

            try{

              res = eval(p + json + p);
            } catch(K) {

              return null;
            };
          };
        };
        return res;
      },
      compareObjects : function(L, M){

        if((L == null && M != null) || (M == null && L != null))return false;
        return this.stringify(L) == this.stringify(M);
      },
      __ep : {
        'array' : function(x){

          var a = [F],b,f,i,l = x.length,v;
          for(i = 0;i < l;i += 1){

            v = x[i];
            f = this.__ep[typeof v];
            if(f){

              v = f.apply(this, [v]);
              if(typeof v == D){

                if(b){

                  a[a.length] = s;
                };
                a[a.length] = v;
                b = true;
              };
            };
          };
          a[a.length] = m;
          return a.join(h);
        },
        'boolean' : function(x){

          return String(x);
        },
        'null' : function(x){

          return q;
        },
        'number' : function(x){

          return isFinite(x) ? String(x) : C;
        },
        'object' : function(x){

          if(x){

            if(x instanceof Array){

              return this.__ep.array.apply(this, [x]);
            };
            var a = [B],b,f,i,v;
            for(i in x){

              v = x[i];
              f = this.__ep[typeof v];
              if(f){

                v = f.apply(this, [v]);
                if(typeof v == D){

                  if(b){

                    a[a.length] = s;
                  };
                  a.push(this.__ep.string.apply(this, [i]), u, v);
                  b = true;
                };
              };
            };
            a[a.length] = I;
            return a.join(h);
          };
          return C;
        },
        'string' : function(x){

          if(/["\\\x00-\x1f]/.test(x)){

            x = x.replace(/([\x00-\x1f\\"])/g, function(a, b){

              var N = {
                '\b' : E,
                '\t' : y,
                '\n' : H,
                '\f' : k,
                '\r' : A,
                '"' : r,
                '\\' : j
              };
              var c = N[b];
              if(c){

                return c;
              };
              c = b.charCodeAt();
              return d + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
            });
          };
          return p + x + p;
        }
      }
    }
  });
})();
(function(){

  var e = "function",f = "\\+",g = "core/check_unique",h = "\\)",j = "static",l = "\\]",m = "resource/get_zones_by_point",n = "\\^",o = "\\[",p = "wialon.util.Helper",q = "*",s = "",t = "\\.",u = '$',v = "\\(",w = '^',y = "\\{",z = "\\\\",A = "\\}",B = 'string',C = "?",D = ".*",E = "\\$",F = ".",G = "undefined",H = "object";
  qx.Class.define(p, {
    type : j,
    statics : {
      filterItems : function(I, J){

        if(!I)return null;
        var K = new Array;
        for(var i = 0;i < I.length;i++){

          var L = I[i];
          if(!L || wialon.util.Number.and(L.getUserAccess(), J) != J)continue;
          K.push(L);
        };
        return K;
      },
      searchObject : function(N, M, P){

        if(!N || !M || !P)return null;
        for(var O in N){

          if(typeof N[O][M] == G || N[O][M] != P)continue;
          return N[O];
        };
        return null;
      },
      sortItems : function(bq, bg, bp, br){

        var bn = (new Date()).getTime();
        if(!bq)return null;
        if(typeof bg != e)bg = function(a){

          return a.getName();
        };
        var S = {
        },R = false,Q,Y,bc,bh,x = 0,c = 0,d = 0,X = false,bf = false,W = 0,i = 0,bd = false,bj = false,bl = false,be,T,V,U;
        be = /(\d*\.?\d+)|((-*\.*[^\d]+)+)/g;
        T = /(-?\d*\.?\d+)|((-*\.*[^-\d]+)+)/g;
        V = be;
        U = V;
        if(typeof br != G){

          if(br & 0x1)bl = true;
          if(br & 0x2)V = T;
          if(br & 0x4)U = T;
        };
        var bi = function(bt, bu){

          return bt.match(bu ? U : V);
        };
        var ba = this._containsRTL;
        var bm = this._convertArabicForth.bind(this);
        var bk = bq.some(function(bv){

          if(!bv)return false;
          var name = bg(bv);
          return ba(name);
        });
        var bs = function(bw){

          if(!bw)return null;
          bf = false;
          var bx;
          for(i = 0;i < bw.length;i++){

            if(!bf){

              W = ~~bw[i];
              x = bw[i].length;
              X = false;
              if((W + s).length != x || W != bw[i]){

                W = parseFloat(bw[i]);
                X = (W == W);
              } else X = true;
              if(i > 0 || X){

                bw[i] = [W, bw[i], x];
                bf = true;
              } else bf = false;
            } else {

              bx = bw[i];
              if(bk && (typeof bx === B)){

                bw[i] = bm(bx);
              };
              bf = false;
            };
          };
          return bw;
        };
        var bo = function(a, b, by){

          R = (by && typeof bp == e);
          bc = R ? bp(bl ? b : a) : bg(bl ? b : a);
          bh = R ? bp(bl ? a : b) : bg(bl ? a : b);
          Q = S[bc];
          if(typeof Q == G){

            Q = bs(bi(bc.toLowerCase(), by));
            S[bc] = Q;
          };
          Y = S[bh];
          if(typeof Y == G){

            Y = bs(bi(bh.toLowerCase(), by));
            S[bh] = Y;
          };
          if(!Q || !Y || !Q.length || !Y.length){

            if(!Q || !Q.length)return -1;
            if(!Y || !Y.length)return 1;
            if(!by && typeof bp == e)bo(a, b, true);
            return 0;
          };
          for(x = 0;Q[x] && Y[x];x++){

            if(typeof Q[x] == H){

              c = Q[x][0];
              bd = true;
            } else {

              c = Q[x];
              bd = false;
            };
            if(typeof Y[x] == H){

              d = Y[x][0];
              bj = true;
            } else {

              d = Y[x];
              bj = false;
            };
            if(c !== d){

              if(bd && bj)return c - d; else {

                if(bd)c = Q[x][1];
                if(bj)d = Y[x][1];
                return (c > d) ? 1 : -1;
              };
            } else if(bd && bj && Q[x][2] != Y[x][2])return Y[x][2] - Q[x][2];;
          };
          if(Q.length == Y.length && !by && typeof bp == e)return bo(a, b, true);
          return Q.length - Y.length;
        };
        bq.sort(bo);
        S = null;
        return bq;
      },
      getZonesInPoint : function(bA, bz){

        return wialon.core.Remote.getInstance().remoteCall(m, {
          spec : bA
        }, wialon.util.Helper.wrapCallback(bz));
      },
      checkUniqueName : function(bC, bB){

        return wialon.core.Remote.getInstance().remoteCall(g, bC, wialon.util.Helper.wrapCallback(bB));
      },
      wildcardCompare : function(bI, bH, bD){

        if(bI == null || bH == null)return null;
        if(bD && bH.indexOf(q) == -1 && bH.indexOf(C) == -1)bH = q + bH + q;
        var bG = bH.toLowerCase();
        bG = bG.replace(/\\/g, z);
        bG = bG.replace(/\./g, t);
        bG = bG.replace(/\?/g, F);
        bG = bG.replace(/\*/g, D);
        bG = bG.replace(/\^/g, n);
        bG = bG.replace(/\$/g, E);
        bG = bG.replace(/\+/g, f);
        bG = bG.replace(/\(/g, v);
        bG = bG.replace(/\)/g, h);
        bG = bG.replace(/\[/g, o);
        bG = bG.replace(/\]/g, l);
        bG = bG.replace(/\{/g, y);
        bG = bG.replace(/\}/g, A);
        var bE = bI.toLowerCase().match(new RegExp(w + bG + u));
        return bE != null ? true : false;
      },
      wrapCallback : function(bJ){

        return typeof bJ == e ? bJ : qx.lang.Function.bind(this.__bH, this, bJ);
      },
      countProps : function(bL){

        var bK = 0;
        for(var k in bL){

          if(bL.hasOwnProperty(k)){

            bK++;
          };
        };
        return bK;
      },
      objectsEqual : function(bM, bN){

        if(typeof (bM) !== typeof (bN)){

          return false;
        };
        if(typeof (bM) === e){

          return bM.toString() === bN.toString();
        };
        if(bM instanceof Object && bN instanceof Object){

          if(this.countProps(bM) !== this.countProps(bN)){

            return false;
          };
          var r = true;
          for(var k in bM){

            r = this.objectsEqual(bM[k], bN[k]);
            if(!r){

              return false;
            };
          };
          return true;
        } else {

          return bM === bN;
        };
      },
      __bH : function(){

        if(!arguments.length)return arguments;
        var bP = Array.prototype.slice.call(arguments, 1);
        var bO = arguments[0];
        if(!bO)return bP;
        if(!(bO instanceof Array))bO = [bO];
        for(var i = 0;i < bO.length;i++)bO[i].apply(this, bP);
        return bP;
      },
      _containsRTL : function(bQ){

        return /[\u0591-\u07FF\u200F\u202B\u202E\uFB1D-\uFDFD\uFE70-\uFEFC]/.test(bQ);
      },
      _convertArabicForth : function(bS){

        var bR = this._arabicMapForth;
        return bS.replace(/[\u0591-\u07FF\u200F\u202B\u202E\uFB1D-\uFDFD\uFE70-\uFEFC]/g, function(x){

          return bR[x] || x;
        });
      },
      _arabicMapForth : (function(){

        var bT = {
        };
        [[8207, 1425], [1768, 1426], [1767, 1456], [1764, 1457], [1763, 1458], [1762, 1459], [1761, 1460], [1760, 1461], [1759, 1462], [1757, 1463], [1756, 1464], [1755, 1465], [1754, 1466], [1753, 1467], [1752, 1468], [1751, 1470], [1750, 1471], [1807, 1472], [8238, 1473], [1770, 1474], [1771, 1475], [1772, 1478], [1773, 1479], [8235, 1480], [1856, 1481], [1859, 1482], [1860, 1483], [1863, 1484], [1864, 1485], [1865, 1486], [1866, 1487], [65139, 1488], [2042, 1489], [1425, 1490], [1600, 1491], [1426, 1492], [1564, 1493], [1562, 1494], [1561, 1495], [1560, 1496], [1559, 1497], [1558, 1498], [1557, 1499], [1556, 1500], [1555, 1501], [1554, 1502], [1553, 1503], [1552, 1504], [1541, 1505], [1540, 1506], [1539, 1507], [1538, 1508], [1537, 1509], [1536, 1510], [1861, 1511], [1857, 1512], [1858, 1513], [1862, 1514], [1456, 1515], [1457, 1516], [1458, 1517], [1459, 1518], [1460, 1519], [1461, 1520], [1462, 1521], [1463, 1522], [1479, 1523], [1464, 1524], [1466, 1525], [1465, 1526], [1467, 1527], [1474, 1528], [1473, 1529], [1468, 1530], [1471, 1531], [64286, 1532], [1611, 1533], [65137, 1534], [65136, 1535], [1612, 1536], [65138, 1537], [64606, 1538], [1613, 1539], [65140, 1540], [64607, 1541], [1614, 1542], [65143, 1543], [65142, 1544], [64754, 1545], [64608, 1546], [1615, 1547], [65145, 1548], [65144, 1549], [64755, 1550], [64609, 1551], [1616, 1552], [65147, 1553], [65146, 1554], [64756, 1555], [64610, 1556], [1617, 1557], [65149, 1558], [65148, 1559], [64611, 1560], [1618, 1561], [65151, 1562], [65150, 1563], [1619, 1564], [1620, 1565], [1621, 1566], [1631, 1567], [1622, 1568], [1623, 1569], [1624, 1570], [1625, 1571], [1626, 1572], [1627, 1573], [1628, 1574], [1629, 1575], [1630, 1576], [1648, 1577], [1809, 1578], [1840, 1579], [1841, 1580], [1842, 1581], [1843, 1582], [1844, 1583], [1845, 1584], [1846, 1585], [1847, 1586], [1848, 1587], [1849, 1588], [1850, 1589], [1851, 1590], [1852, 1591], [1853, 1592], [1854, 1593], [1855, 1594], [2027, 1595], [2028, 1596], [2029, 1597], [2030, 1598], [2031, 1599], [2032, 1600], [2033, 1601], [2034, 1602], [2035, 1603], [1548, 1604], [1549, 1605], [1643, 1606], [1644, 1607], [2040, 1608], [1563, 1609], [1566, 1610], [1795, 1611], [1796, 1612], [1797, 1613], [1798, 1614], [1799, 1615], [1800, 1616], [2041, 1617], [1567, 1618], [1801, 1619], [1748, 1620], [1793, 1621], [1794, 1622], [1792, 1623], [2039, 1624], [64830, 1625], [64831, 1626], [1645, 1627], [1642, 1628], [1545, 1629], [1546, 1630], [1470, 1631], [1472, 1632], [1475, 1633], [1478, 1634], [1523, 1635], [1524, 1636], [1802, 1637], [1803, 1638], [1804, 1639], [1805, 1640], [1544, 1641], [1550, 1642], [1551, 1643], [1758, 1644], [1769, 1645], [65021, 1646], [64434, 1647], [64435, 1648], [64436, 1649], [64437, 1650], [64438, 1651], [64439, 1652], [64440, 1653], [64441, 1654], [64442, 1655], [64443, 1656], [64444, 1657], [64445, 1658], [64446, 1659], [64447, 1660], [64448, 1661], [64449, 1662], [2038, 1663], [64297, 1664], [1542, 1665], [1543, 1666], [1547, 1667], [65020, 1668], [1632, 1669], [1776, 1670], [1984, 1671], [1633, 1672], [1985, 1673], [1777, 1674], [1634, 1675], [1778, 1676], [1986, 1677], [1779, 1678], [1987, 1679], [1635, 1680], [1988, 1681], [1636, 1682], [1780, 1683], [1637, 1684], [1989, 1685], [1781, 1686], [1990, 1687], [1638, 1688], [1782, 1689], [1991, 1690], [1783, 1691], [1639, 1692], [1640, 1693], [1784, 1694], [1992, 1695], [1641, 1696], [1785, 1697], [1993, 1698], [1488, 1699], [64289, 1700], [64302, 1701], [64303, 1702], [64304, 1703], [64335, 1704], [1489, 1705], [64305, 1706], [64332, 1707], [1490, 1708], [64306, 1709], [1491, 1710], [64290, 1711], [64307, 1712], [1492, 1713], [64291, 1714], [64308, 1715], [1493, 1716], [64331, 1717], [64309, 1718], [1520, 1719], [1521, 1720], [1494, 1721], [64310, 1722], [1495, 1723], [1496, 1724], [64312, 1725], [1497, 1726], [64285, 1727], [64313, 1728], [1522, 1729], [64287, 1730], [1499, 1731], [64292, 1732], [1498, 1733], [64315, 1734], [64314, 1735], [64333, 1736], [1500, 1737], [64293, 1738], [64316, 1739], [1502, 1740], [64294, 1741], [1501, 1742], [64318, 1743], [1504, 1744], [1503, 1745], [64320, 1746], [1505, 1747], [64321, 1748], [1506, 1749], [64288, 1750], [1508, 1751], [1507, 1752], [64324, 1753], [64323, 1754], [64334, 1755], [1510, 1756], [1509, 1757], [64326, 1758], [1511, 1759], [64327, 1760], [1512, 1761], [64295, 1762], [64328, 1763], [1513, 1764], [64299, 1765], [64298, 1766], [64329, 1767], [64301, 1768], [64300, 1769], [1514, 1770], [64296, 1771], [64330, 1772], [1569, 1773], [1652, 1774], [65152, 1775], [1789, 1776], [1570, 1777], [65154, 1778], [65153, 1779], [1571, 1780], [65156, 1781], [65155, 1782], [1650, 1783], [1649, 1784], [64337, 1785], [64336, 1786], [1572, 1787], [65158, 1788], [65157, 1789], [1573, 1790], [65160, 1791], [65159, 1792], [1651, 1793], [1907, 1794], [1908, 1795], [1574, 1796], [65163, 1797], [65164, 1798], [65162, 1799], [65161, 1800], [64491, 1801], [64490, 1802], [64663, 1803], [64512, 1804], [64664, 1805], [64513, 1806], [64665, 1807], [64612, 1808], [64613, 1809], [64666, 1810], [64735, 1811], [64614, 1812], [64514, 1813], [64615, 1814], [64667, 1815], [64736, 1816], [64493, 1817], [64492, 1818], [64495, 1819], [64494, 1820], [64499, 1821], [64498, 1822], [64497, 1823], [64496, 1824], [64501, 1825], [64500, 1826], [64507, 1827], [64616, 1828], [64506, 1829], [64515, 1830], [64505, 1831], [64617, 1832], [64516, 1833], [64504, 1834], [64503, 1835], [64502, 1836], [1575, 1837], [65166, 1838], [65165, 1839], [64828, 1840], [64829, 1841], [1653, 1842], [65011, 1843], [65010, 1844], [1646, 1845], [1576, 1846], [65169, 1847], [65170, 1848], [65168, 1849], [65167, 1850], [64668, 1851], [64517, 1852], [64669, 1853], [64518, 1854], [64962, 1855], [64670, 1856], [64519, 1857], [64926, 1858], [64618, 1859], [64619, 1860], [64671, 1861], [64737, 1862], [64620, 1863], [64520, 1864], [64621, 1865], [64672, 1866], [64738, 1867], [64622, 1868], [64521, 1869], [64623, 1870], [64522, 1871], [1659, 1872], [64340, 1873], [64341, 1874], [64339, 1875], [64338, 1876], [1662, 1877], [64344, 1878], [64345, 1879], [64343, 1880], [64342, 1881], [1664, 1882], [64348, 1883], [64349, 1884], [64347, 1885], [64346, 1886], [1872, 1887], [1873, 1888], [1874, 1889], [1875, 1890], [1876, 1891], [1877, 1892], [1878, 1893], [1577, 1894], [65172, 1895], [65171, 1896], [1578, 1897], [65175, 1898], [65176, 1899], [65174, 1900], [65173, 1901], [64673, 1902], [64523, 1903], [64848, 1904], [64928, 1905], [64927, 1906], [64674, 1907], [64524, 1908], [64850, 1909], [64849, 1910], [64851, 1911], [64675, 1912], [64525, 1913], [64852, 1914], [64930, 1915], [64929, 1916], [64624, 1917], [64625, 1918], [64676, 1919], [64739, 1920], [64626, 1921], [64526, 1922], [64853, 1923], [64854, 1924], [64855, 1925], [64932, 1926], [64931, 1927], [64627, 1928], [64677, 1929], [64740, 1930], [64628, 1931], [64527, 1932], [64629, 1933], [64528, 1934], [1579, 1935], [65179, 1936], [65180, 1937], [65178, 1938], [65177, 1939], [64529, 1940], [64630, 1941], [64631, 1942], [64678, 1943], [64741, 1944], [64632, 1945], [64530, 1946], [64633, 1947], [64742, 1948], [64634, 1949], [64531, 1950], [64635, 1951], [64532, 1952], [1657, 1953], [64360, 1954], [64361, 1955], [64359, 1956], [64358, 1957], [1658, 1958], [64352, 1959], [64353, 1960], [64351, 1961], [64350, 1962], [1660, 1963], [1661, 1964], [1663, 1965], [64356, 1966], [64357, 1967], [64355, 1968], [64354, 1969], [1580, 1970], [65183, 1971], [65184, 1972], [65182, 1973], [65181, 1974], [64679, 1975], [64533, 1976], [64934, 1977], [64958, 1978], [65019, 1979], [64680, 1980], [64534, 1981], [64857, 1982], [64856, 1983], [64935, 1984], [64933, 1985], [64797, 1986], [64769, 1987], [64798, 1988], [64770, 1989], [1667, 1990], [64376, 1991], [64377, 1992], [64375, 1993], [64374, 1994], [1668, 1995], [64372, 1996], [64373, 1997], [64371, 1998], [64370, 1999], [1670, 2000], [64380, 2001], [64381, 2002], [64379, 2003], [64378, 2004], [1727, 2005], [1671, 2006], [64384, 2007], [64385, 2008], [64383, 2009], [64382, 2010], [1581, 2011], [65187, 2012], [65188, 2013], [65186, 2014], [65185, 2015], [64681, 2016], [64535, 2017], [64959, 2018], [64682, 2019], [64536, 2020], [64859, 2021], [64858, 2022], [64795, 2023], [64767, 2024], [64796, 2025], [64768, 2026], [1582, 2027], [65191, 2028], [65192, 2029], [65190, 2030], [65189, 2031], [64683, 2032], [64537, 2033], [64538, 2034], [64684, 2035], [64539, 2036], [64799, 2037], [64771, 2038], [64800, 2039], [64772, 2040], [1665, 2041], [1666, 2042], [1669, 2043], [1879, 2044], [1880, 2045], [1902, 2046], [1903, 2047], [1906, 8207], [1916, 8235], [1583, 8238], [65194, 64285], [65193, 64286], [1584, 64287], [65196, 64288], [65195, 64289], [64603, 64290], [1672, 64291], [64393, 64292], [64392, 64293], [1673, 64294], [1674, 64295], [1675, 64296], [1676, 64297], [64389, 64298], [64388, 64299], [1677, 64300], [64387, 64301], [64386, 64302], [1678, 64303], [64391, 64304], [64390, 64305], [1679, 64306], [1680, 64307], [1774, 64308], [1881, 64309], [1882, 64310], [1585, 64311], [65198, 64312], [65197, 64313], [64604, 64314], [65014, 64315], [1586, 64316], [65200, 64317], [65199, 64318], [1681, 64319], [64397, 64320], [64396, 64321], [1682, 64322], [1683, 64323], [1684, 64324], [1685, 64325], [1686, 64326], [1687, 64327], [1688, 64328], [64395, 64329], [64394, 64330], [1689, 64331], [1775, 64332], [1883, 64333], [1899, 64334], [1900, 64335], [1905, 64336], [1587, 64337], [65203, 64338], [65204, 64339], [65202, 64340], [65201, 64341], [64685, 64342], [64820, 64343], [64540, 64344], [64861, 64345], [64862, 64346], [64686, 64347], [64821, 64348], [64541, 64349], [64860, 64350], [64687, 64351], [64822, 64352], [64542, 64353], [64936, 64354], [64966, 64355], [64810, 64356], [64782, 64357], [64688, 64358], [64743, 64359], [64543, 64360], [64865, 64361], [64864, 64362], [64863, 64363], [64867, 64364], [64866, 64365], [64817, 64366], [64744, 64367], [64791, 64368], [64763, 64369], [64792, 64370], [64764, 64371], [1588, 64372], [65207, 64373], [65208, 64374], [65206, 64375], [65205, 64376], [64813, 64377], [64823, 64378], [64805, 64379], [64777, 64380], [64873, 64381], [64814, 64382], [64824, 64383], [64806, 64384], [64778, 64385], [64872, 64386], [64871, 64387], [64938, 64388], [64815, 64389], [64825, 64390], [64807, 64391], [64779, 64392], [64809, 64393], [64781, 64394], [64816, 64395], [64745, 64396], [64808, 64397], [64780, 64398], [64875, 64399], [64874, 64400], [64877, 64401], [64876, 64402], [64818, 64403], [64746, 64404], [64793, 64405], [64765, 64406], [64794, 64407], [64766, 64408], [1690, 64409], [1691, 64410], [1692, 64411], [1786, 64412], [1884, 64413], [1901, 64414], [1904, 64415], [1917, 64416], [1918, 64417], [1589, 64418], [65211, 64419], [65212, 64420], [65210, 64421], [65209, 64422], [64689, 64423], [64544, 64424], [64869, 64425], [64868, 64426], [64937, 64427], [64690, 64428], [64811, 64429], [64783, 64430], [65013, 64431], [65017, 64432], [65018, 64433], [65008, 64434], [64691, 64435], [64545, 64436], [64965, 64437], [64870, 64438], [64801, 64439], [64773, 64440], [64802, 64441], [64774, 64442], [1590, 64443], [65215, 64444], [65216, 64445], [65214, 64446], [65213, 64447], [64692, 64448], [64546, 64449], [64693, 64450], [64547, 64451], [64878, 64452], [64939, 64453], [64694, 64454], [64548, 64455], [64880, 64456], [64879, 64457], [64812, 64458], [64784, 64459], [64695, 64460], [64549, 64461], [64803, 64462], [64775, 64463], [64804, 64464], [64776, 64465], [1693, 64466], [1694, 64467], [1787, 64468], [1591, 64469], [65219, 64470], [65220, 64471], [65218, 64472], [65217, 64473], [64696, 64474], [64550, 64475], [64819, 64476], [64826, 64477], [64551, 64478], [64882, 64479], [64881, 64480], [64883, 64481], [64884, 64482], [64785, 64483], [64757, 64484], [64786, 64485], [64758, 64486], [1592, 64487], [65223, 64488], [65224, 64489], [65222, 64490], [65221, 64491], [64697, 64492], [64827, 64493], [64552, 64494], [1695, 64495], [1593, 64496], [65227, 64497], [65228, 64498], [65226, 64499], [65225, 64500], [64698, 64501], [64553, 64502], [64964, 64503], [64885, 64504], [65015, 64505], [64699, 64506], [64554, 64507], [64887, 64508], [64886, 64509], [64888, 64510], [64950, 64511], [64787, 64512], [64759, 64513], [64788, 64514], [64760, 64515], [1594, 64516], [65231, 64517], [65232, 64518], [65230, 64519], [65229, 64520], [64700, 64521], [64555, 64522], [64701, 64523], [64556, 64524], [64889, 64525], [64891, 64526], [64890, 64527], [64789, 64528], [64761, 64529], [64790, 64530], [64762, 64531], [1696, 64532], [1788, 64533], [1885, 64534], [1886, 64535], [1887, 64536], [1601, 64537], [65235, 64538], [65236, 64539], [65234, 64540], [65233, 64541], [64702, 64542], [64557, 64543], [64703, 64544], [64558, 64545], [64704, 64546], [64559, 64547], [64893, 64548], [64892, 64549], [64705, 64550], [64560, 64551], [64961, 64552], [64636, 64553], [64561, 64554], [64637, 64555], [64562, 64556], [1697, 64557], [1698, 64558], [1699, 64559], [1700, 64560], [64364, 64561], [64365, 64562], [64363, 64563], [64362, 64564], [1701, 64565], [1702, 64566], [64368, 64567], [64369, 64568], [64367, 64569], [64366, 64570], [1888, 64571], [1889, 64572], [1647, 64573], [1602, 64574], [65239, 64575], [65240, 64576], [65238, 64577], [65237, 64578], [64706, 64579], [64563, 64580], [65009, 64581], [64707, 64582], [64564, 64583], [64948, 64584], [64894, 64585], [64895, 64586], [64946, 64587], [64638, 64588], [64565, 64589], [64639, 64590], [64566, 64591], [1703, 64592], [1704, 64593], [1603, 64594], [65243, 64595], [65244, 64596], [65242, 64597], [65241, 64598], [64640, 64599], [64567, 64600], [64708, 64601], [64568, 64602], [64709, 64603], [64569, 64604], [64710, 64605], [64570, 64606], [64711, 64607], [64747, 64608], [64641, 64609], [64571, 64610], [64712, 64611], [64748, 64612], [64642, 64613], [64572, 64614], [64963, 64615], [64955, 64616], [64951, 64617], [64643, 64618], [64573, 64619], [64644, 64620], [64574, 64621], [1705, 64622], [64400, 64623], [64401, 64624], [64399, 64625], [64398, 64626], [1706, 64627], [1707, 64628], [1708, 64629], [1919, 64630], [1709, 64631], [64469, 64632], [64470, 64633], [64468, 64634], [64467, 64635], [1710, 64636], [1711, 64637], [64404, 64638], [64405, 64639], [64403, 64640], [64402, 64641], [1712, 64642], [1713, 64643], [64412, 64644], [64413, 64645], [64411, 64646], [64410, 64647], [1714, 64648], [1715, 64649], [64408, 64650], [64409, 64651], [64407, 64652], [64406, 64653], [1716, 64654], [1890, 64655], [1595, 64656], [1596, 64657], [1891, 64658], [1892, 64659], [1604, 64660], [65247, 64661], [65248, 64662], [65246, 64663], [65245, 64664], [65270, 64665], [65269, 64666], [65272, 64667], [65271, 64668], [65274, 64669], [65273, 64670], [65276, 64671], [65275, 64672], [64713, 64673], [64575, 64674], [64899, 64675], [64900, 64676], [64954, 64677], [64956, 64678], [64940, 64679], [64714, 64680], [64576, 64681], [64949, 64682], [64896, 64683], [64898, 64684], [64897, 64685], [64715, 64686], [64577, 64687], [64902, 64688], [64901, 64689], [64716, 64690], [64749, 64691], [64645, 64692], [64578, 64693], [64904, 64694], [64903, 64695], [64941, 64696], [64717, 64697], [64646, 64698], [64579, 64699], [64647, 64700], [64580, 64701], [1717, 64702], [1718, 64703], [1719, 64704], [1720, 64705], [1898, 64706], [1605, 64707], [65251, 64708], [65252, 64709], [65250, 64710], [65249, 64711], [1790, 64712], [64648, 64713], [64718, 64714], [64581, 64715], [64908, 64716], [64914, 64717], [64909, 64718], [64960, 64719], [64719, 64720], [64582, 64721], [64905, 64722], [64906, 64723], [65012, 64724], [64907, 64725], [64720, 64726], [64583, 64727], [64910, 64728], [64911, 64729], [64953, 64730], [64721, 64731], [64649, 64732], [64584, 64733], [64945, 64734], [64585, 64735], [64586, 64736], [1893, 64737], [1894, 64738], [1606, 64739], [65255, 64740], [65256, 64741], [65254, 64742], [65253, 64743], [64722, 64744], [64587, 64745], [64952, 64746], [64957, 64747], [64920, 64748], [64919, 64749], [64921, 64750], [64967, 64751], [64723, 64752], [64588, 64753], [64917, 64754], [64918, 64755], [64947, 64756], [64724, 64757], [64589, 64758], [64650, 64759], [64651, 64760], [64725, 64761], [64750, 64762], [64652, 64763], [64590, 64764], [64923, 64765], [64922, 64766], [64653, 64767], [64726, 64768], [64751, 64769], [64654, 64770], [64591, 64771], [64655, 64772], [64592, 64773], [1722, 64774], [64415, 64775], [64414, 64776], [1723, 64777], [64418, 64778], [64419, 64779], [64417, 64780], [64416, 64781], [1724, 64782], [1725, 64783], [1721, 64784], [1895, 64785], [1896, 64786], [1897, 64787], [1607, 64788], [65259, 64789], [65260, 64790], [65258, 64791], [65257, 64792], [64729, 64793], [64727, 64794], [64593, 64795], [64728, 64796], [64594, 64797], [64915, 64798], [64916, 64799], [64595, 64800], [64596, 64801], [1726, 64802], [64428, 64803], [64429, 64804], [64427, 64805], [64426, 64806], [1729, 64807], [64424, 64808], [64425, 64809], [64423, 64810], [64422, 64811], [1730, 64812], [1731, 64813], [1791, 64814], [1749, 64815], [1728, 64816], [64421, 64817], [64420, 64818], [1608, 64819], [1765, 64820], [65262, 64821], [65261, 64822], [1654, 64823], [65016, 64824], [1732, 64825], [1733, 64826], [64481, 64827], [64480, 64828], [1734, 64829], [64474, 64830], [64473, 64831], [1735, 64832], [64472, 64833], [64471, 64834], [1655, 64835], [64477, 64836], [1736, 64837], [64476, 64838], [64475, 64839], [1737, 64840], [64483, 64841], [64482, 64842], [1738, 64843], [1739, 64844], [64479, 64845], [64478, 64846], [1743, 64847], [1912, 64848], [1913, 64849], [1609, 64850], [64488, 64851], [64489, 64852], [65264, 64853], [65263, 64854], [64656, 64855], [64605, 64856], [1610, 64857], [1766, 64858], [65267, 64859], [65268, 64860], [65266, 64861], [65265, 64862], [1656, 64863], [64730, 64864], [64597, 64865], [64943, 64866], [64731, 64867], [64598, 64868], [64942, 64869], [64732, 64870], [64599, 64871], [64657, 64872], [64658, 64873], [64733, 64874], [64752, 64875], [64659, 64876], [64600, 64877], [64925, 64878], [64924, 64879], [64944, 64880], [64660, 64881], [64734, 64882], [64753, 64883], [64661, 64884], [64601, 64885], [64662, 64886], [64602, 64887], [1740, 64888], [64510, 64889], [64511, 64890], [64509, 64891], [64508, 64892], [1741, 64893], [1742, 64894], [1744, 64895], [64486, 64896], [64487, 64897], [64485, 64898], [64484, 64899], [1745, 64900], [1597, 64901], [1598, 64902], [1599, 64903], [1568, 64904], [1909, 64905], [1910, 64906], [1911, 64907], [1746, 64908], [64431, 64909], [64430, 64910], [1747, 64911], [64433, 64912], [64432, 64913], [1914, 64914], [1915, 64915], [1808, 64916], [1810, 64917], [1837, 64918], [1811, 64919], [1812, 64920], [1838, 64921], [1814, 64922], [1813, 64923], [1839, 64924], [1815, 64925], [1816, 64926], [1817, 64927], [1869, 64928], [1818, 64929], [1819, 64930], [1820, 64931], [1821, 64932], [1822, 64933], [1823, 64934], [1870, 64935], [1824, 64936], [1825, 64937], [1826, 64938], [1827, 64939], [1828, 64940], [1829, 64941], [1830, 64942], [1831, 64943], [1871, 64944], [1832, 64945], [1833, 64946], [1834, 64947], [1835, 64948], [1836, 64949], [1920, 64950], [1945, 64951], [1946, 64952], [1921, 64953], [1922, 64954], [1923, 64955], [1948, 64956], [1924, 64957], [1925, 64958], [1926, 64959], [1927, 64960], [1954, 64961], [1955, 64962], [1928, 64963], [1957, 64964], [1929, 64965], [1930, 64966], [1931, 64967], [1947, 64968], [1932, 64969], [1944, 64970], [1952, 64971], [1953, 64972], [1933, 64973], [1934, 64974], [1956, 64975], [1935, 64976], [1936, 64977], [1949, 64978], [1950, 64979], [1951, 64980], [1937, 64981], [1938, 64982], [1939, 64983], [1940, 64984], [1941, 64985], [1942, 64986], [1943, 64987], [1969, 64988], [1958, 64989], [1959, 64990], [1960, 64991], [1961, 64992], [1962, 64993], [1963, 64994], [1964, 64995], [1965, 64996], [1966, 64997], [1967, 64998], [1968, 64999], [1994, 65000], [1995, 65001], [1996, 65002], [1997, 65003], [1998, 65004], [1999, 65005], [2000, 65006], [2001, 65007], [2002, 65008], [2003, 65009], [2004, 65010], [2005, 65011], [2006, 65012], [2024, 65013], [2007, 65014], [2025, 65015], [2008, 65016], [2009, 65017], [2026, 65018], [2010, 65019], [2011, 65020], [2012, 65021], [2013, 65136], [2014, 65137], [2015, 65138], [2016, 65139], [2017, 65140], [2018, 65141], [2019, 65142], [2020, 65143], [2021, 65144], [2022, 65145], [2023, 65146], [2036, 65147], [2037, 65148], [1480, 65149], [1481, 65150], [1482, 65151], [1483, 65152], [1484, 65153], [1485, 65154], [1486, 65155], [1487, 65156], [1515, 65157], [1516, 65158], [1517, 65159], [1518, 65160], [1519, 65161], [1525, 65162], [1526, 65163], [1527, 65164], [1528, 65165], [1529, 65166], [1530, 65167], [1531, 65168], [1532, 65169], [1533, 65170], [1534, 65171], [1535, 65172], [1565, 65173], [1806, 65174], [1867, 65175], [1868, 65176], [1970, 65177], [1971, 65178], [1972, 65179], [1973, 65180], [1974, 65181], [1975, 65182], [1976, 65183], [1977, 65184], [1978, 65185], [1979, 65186], [1980, 65187], [1981, 65188], [1982, 65189], [1983, 65190], [2043, 65191], [2044, 65192], [2045, 65193], [2046, 65194], [2047, 65195], [64311, 65196], [64317, 65197], [64319, 65198], [64322, 65199], [64325, 65200], [64450, 65201], [64451, 65202], [64452, 65203], [64453, 65204], [64454, 65205], [64455, 65206], [64456, 65207], [64457, 65208], [64458, 65209], [64459, 65210], [64460, 65211], [64461, 65212], [64462, 65213], [64463, 65214], [64464, 65215], [64465, 65216], [64466, 65217], [64832, 65218], [64833, 65219], [64834, 65220], [64835, 65221], [64836, 65222], [64837, 65223], [64838, 65224], [64839, 65225], [64840, 65226], [64841, 65227], [64842, 65228], [64843, 65229], [64844, 65230], [64845, 65231], [64846, 65232], [64847, 65233], [64912, 65234], [64913, 65235], [64968, 65236], [64969, 65237], [64970, 65238], [64971, 65239], [64972, 65240], [64973, 65241], [64974, 65242], [64975, 65243], [64976, 65244], [64977, 65245], [64978, 65246], [64979, 65247], [64980, 65248], [64981, 65249], [64982, 65250], [64983, 65251], [64984, 65252], [64985, 65253], [64986, 65254], [64987, 65255], [64988, 65256], [64989, 65257], [64990, 65258], [64991, 65259], [64992, 65260], [64993, 65261], [64994, 65262], [64995, 65263], [64996, 65264], [64997, 65265], [64998, 65266], [64999, 65267], [65000, 65268], [65001, 65269], [65002, 65270], [65003, 65271], [65004, 65272], [65005, 65273], [65006, 65274], [65007, 65275], [65141, 65276]].forEach(function(bU){

          bT[String.fromCharCode(bU[0])] = String.fromCharCode(bU[1]);
        });
        return bT;
      })()
    }
  });
})();
(function(){

  var a = "number",b = "wialon.util.Number",c = "static",d = "string";
  qx.Class.define(b, {
    type : c,
    statics : {
      or : function(g){

        var f = this.__es();
        for(var i = 0;i < arguments.length;i++){

          var e = this.__es(arguments[i]);
          f[0] = (f[0] | e[0]) >>> 0;
          f[1] = (f[1] | e[1]) >>> 0;
        };
        return f[0] * 0x100000000 + f[1];
      },
      xor : function(k){

        var j = this.__es();
        for(var i = 0;i < arguments.length;i++){

          var h = this.__es(arguments[i]);
          j[0] = (j[0] ^ h[0]) >>> 0;
          j[1] = (j[1] ^ h[1]) >>> 0;
        };
        return j[0] * 0x100000000 + j[1];
      },
      and : function(n){

        var m = [0xFFFFFFFF, 0xFFFFFFFF];
        for(var i = 0;i < arguments.length;i++){

          var l = this.__es(arguments[i]);
          m[0] = (m[0] & l[0]) >>> 0;
          m[1] = (m[1] & l[1]) >>> 0;
        };
        return m[0] * 0x100000000 + m[1];
      },
      not : function(o){

        var p = this.__es(o);
        p[0] = ((~p[0]) & 0x1FFFFF) >>> 0;
        p[1] = (~p[1]) >>> 0;
        return p[0] * 0x100000000 + p[1];
      },
      exclude : function(s){

        if(!arguments.length)return 0;
        var r = this.__es(arguments[0]);
        for(var i = 1;i < arguments.length;i++){

          var q = this.__es(this.not(arguments[i]));
          r[0] = (r[0] & q[0]) >>> 0;
          r[1] = (r[1] & q[1]) >>> 0;
        };
        return r[0] * 0x100000000 + r[1];
      },
      umax : function(){

        return 0x1FFFFFFFFFFFFF;
      },
      __es : function(u){

        var v = [0, 0];
        if(typeof u == a){

          if(u == -1)return [0x1FFFFF, 0xFFFFFFFF];
          if(u < 0)u = 0x1FFFFFFFFFFFFF + 1 + u;
          u = u.toString(16);
        };
        if(typeof u == d && u.length && u.length <= 16){

          var t = [0, 0];
          for(var i = u.length;i > 0;i--)v[u.length - i < 8 ? 1 : 0] |= parseInt(u[i - 1], 16) << (((u.length - i) * 4) % 32);
        };
        v[0] = v[0] >>> 0;
        v[1] = v[1] >>> 0;
        return v;
      }
    }
  });
})();
(function(){

  var a = "loadEnd",b = "qx.io.request.AbstractRequest",c = "changePhase",d = "GET",f = "sent",g = "qx.event.type.Data",h = "qx.io.request.authentication.IAuthentication",i = "error",j = "fail",k = "loading",l = "load",m = "qx.event.type.Event",n = "abort",o = "success",p = "String",q = "",r = "opened",s = "POST",t = "statusError",u = "readyStateChange",v = "Abstract method call",w = "abstract",x = "unsent",y = "changeResponse",z = "Number",A = "Content-Type",B = "timeout",C = "undefined";
  qx.Class.define(b, {
    type : w,
    extend : qx.core.Object,
    construct : function(D){

      qx.core.Object.call(this);
      if(D !== undefined){

        this.setUrl(D);
      };
      this.__et = {
      };
      var E = this._transport = this._createTransport();
      this._setPhase(x);
      this.__eu = qx.lang.Function.bind(this._onReadyStateChange, this);
      this.__ev = qx.lang.Function.bind(this._onLoad, this);
      this.__ew = qx.lang.Function.bind(this._onLoadEnd, this);
      this.__ex = qx.lang.Function.bind(this._onAbort, this);
      this.__ey = qx.lang.Function.bind(this._onTimeout, this);
      this.__ez = qx.lang.Function.bind(this._onError, this);
      E.onreadystatechange = this.__eu;
      E.onload = this.__ev;
      E.onloadend = this.__ew;
      E.onabort = this.__ex;
      E.ontimeout = this.__ey;
      E.onerror = this.__ez;
    },
    events : {
      "readyStateChange" : m,
      "success" : m,
      "load" : m,
      "loadEnd" : m,
      "abort" : m,
      "timeout" : m,
      "error" : m,
      "statusError" : m,
      "fail" : m,
      "changeResponse" : g,
      "changePhase" : g
    },
    properties : {
      url : {
        check : p
      },
      timeout : {
        check : z,
        nullable : true,
        init : 0
      },
      requestData : {
        check : function(F){

          return qx.lang.Type.isString(F) || qx.Class.isSubClassOf(F.constructor, qx.core.Object) || qx.lang.Type.isObject(F) || qx.lang.Type.isArray(F);
        },
        nullable : true
      },
      authentication : {
        check : h,
        nullable : true
      }
    },
    members : {
      __eu : null,
      __ev : null,
      __ew : null,
      __ex : null,
      __ey : null,
      __ez : null,
      __eA : null,
      __eB : null,
      __eC : null,
      __et : null,
      __eD : null,
      _transport : null,
      _createTransport : function(){

        throw new Error(v);
      },
      _getConfiguredUrl : function(){
      },
      _getConfiguredRequestHeaders : function(){
      },
      _getParsedResponse : function(){

        throw new Error(v);
      },
      _getMethod : function(){

        return d;
      },
      _isAsync : function(){

        return true;
      },
      send : function(){

        var K = this._transport,G,J,H,I;
        G = this._getConfiguredUrl();
        if(/\#/.test(G)){

          G = G.replace(/\#.*/, q);
        };
        K.timeout = this.getTimeout();
        J = this._getMethod();
        H = this._isAsync();
        {
        };
        K.open(J, G, H);
        this._setPhase(r);
        I = this._serializeData(this.getRequestData());
        this._setRequestHeaders();
        {
        };
        J == d ? K.send() : K.send(I);
        this._setPhase(f);
      },
      abort : function(){

        {
        };
        this.__eB = true;
        this.__eC = n;
        this._transport.abort();
      },
      _setRequestHeaders : function(){

        var M = this._transport,L = this._getAllRequestHeaders();
        for(var N in L){

          M.setRequestHeader(N, L[N]);
        };
      },
      _getAllRequestHeaders : function(){

        var O = {
        };
        qx.lang.Object.mergeWith(O, this._getConfiguredRequestHeaders());
        qx.lang.Object.mergeWith(O, this.__eE());
        qx.lang.Object.mergeWith(O, this.__eD);
        qx.lang.Object.mergeWith(O, this.__et);
        return O;
      },
      __eE : function(){

        var Q = this.getAuthentication(),P = {
        };
        if(Q){

          Q.getAuthHeaders().forEach(function(R){

            P[R.key] = R.value;
          });
          return P;
        };
      },
      setRequestHeader : function(S, T){

        this.__et[S] = T;
      },
      getRequestHeader : function(U){

        return this.__et[U];
      },
      removeRequestHeader : function(V){

        if(this.__et[V]){

          delete this.__et[V];
        };
      },
      getTransport : function(){

        return this._transport;
      },
      getReadyState : function(){

        return this._transport.readyState;
      },
      getPhase : function(){

        return this.__eC;
      },
      getStatus : function(){

        return this._transport.status;
      },
      getStatusText : function(){

        return this._transport.statusText;
      },
      getResponseText : function(){

        return this._transport.responseText;
      },
      getAllResponseHeaders : function(){

        return this._transport.getAllResponseHeaders();
      },
      getResponseHeader : function(W){

        return this._transport.getResponseHeader(W);
      },
      overrideResponseContentType : function(X){

        return this._transport.overrideMimeType(X);
      },
      getResponseContentType : function(){

        return this.getResponseHeader(A);
      },
      isDone : function(){

        return this.getReadyState() === 4;
      },
      getResponse : function(){

        return this.__eA;
      },
      _setResponse : function(ba){

        var Y = ba;
        if(this.__eA !== ba){

          this.__eA = ba;
          this.fireEvent(y, qx.event.type.Data, [this.__eA, Y]);
        };
      },
      _onReadyStateChange : function(){

        var bb = this.getReadyState();
        {
        };
        this.fireEvent(u);
        if(this.__eB){

          return;
        };
        if(bb === 3){

          this._setPhase(k);
        };
        if(this.isDone()){

          this.__eF();
        };
      },
      __eF : function(){

        {
        };
        this._setPhase(l);
        if(qx.util.Request.isSuccessful(this.getStatus())){

          {
          };
          this._setResponse(this._getParsedResponse());
          this._fireStatefulEvent(o);
        } else {

          try{

            this._setResponse(this._getParsedResponse());
          } catch(e) {
          };
          if(this.getStatus() !== 0){

            this._fireStatefulEvent(t);
            this.fireEvent(j);
          };
        };
      },
      _onLoad : function(){

        this.fireEvent(l);
      },
      _onLoadEnd : function(){

        this.fireEvent(a);
      },
      _onAbort : function(){

        this._fireStatefulEvent(n);
      },
      _onTimeout : function(){

        this._fireStatefulEvent(B);
        this.fireEvent(j);
      },
      _onError : function(){

        this.fireEvent(i);
        this.fireEvent(j);
      },
      _fireStatefulEvent : function(bc){

        {
        };
        this._setPhase(bc);
        this.fireEvent(bc);
      },
      _setPhase : function(bd){

        var be = this.__eC;
        {
        };
        this.__eC = bd;
        this.fireDataEvent(c, bd, be);
      },
      _serializeData : function(bh){

        var bf = typeof this.getMethod !== C && this.getMethod() == s,bg = /application\/.*\+?json/.test(this.getRequestHeader(A));
        if(!bh){

          return null;
        };
        if(qx.lang.Type.isString(bh)){

          return bh;
        };
        if(qx.Class.isSubClassOf(bh.constructor, qx.core.Object)){

          return qx.util.Serializer.toUriParameter(bh);
        };
        if(bg && (qx.lang.Type.isObject(bh) || qx.lang.Type.isArray(bh))){

          return qx.lang.Json.stringify(bh);
        };
        if(qx.lang.Type.isObject(bh)){

          return qx.util.Uri.toParameter(bh, bf);
        };
      }
    },
    environment : {
      "qx.debug.io" : false
    },
    destruct : function(){

      var bj = this._transport,bi = function(){
      };
      if(this._transport){

        bj.onreadystatechange = bj.onload = bj.onloadend = bj.onabort = bj.ontimeout = bj.onerror = bi;
        window.setTimeout(function(){

          bj.dispose();
        }, 0);
      };
    }
  });
})();
(function(){

  var a = "file",b = "+",c = "strict",d = "anchor",e = "div",f = "query",g = "source",h = "password",j = "host",k = "protocol",l = "user",n = "directory",p = "loose",q = "relative",r = "queryKey",s = "qx.util.Uri",t = "",u = "path",v = "authority",w = '">0</a>',x = "&",y = "port",z = '<a href="',A = "userInfo",B = "?",C = "=";
  qx.Bootstrap.define(s, {
    statics : {
      parseUri : function(F, E){

        var G = {
          key : [g, k, v, A, l, h, j, y, q, u, n, a, f, d],
          q : {
            name : r,
            parser : /(?:^|&)([^&=]*)=?([^&]*)/g
          },
          parser : {
            strict : /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
            loose : /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
          }
        };
        var o = G,m = G.parser[E ? c : p].exec(F),D = {
        },i = 14;
        while(i--){

          D[o.key[i]] = m[i] || t;
        };
        D[o.q.name] = {
        };
        D[o.key[12]].replace(o.q.parser, function(I, J, H){

          if(J){

            D[o.q.name][J] = H;
          };
        });
        return D;
      },
      appendParamsToUrl : function(K, L){

        if(L === undefined){

          return K;
        };
        {
        };
        if(qx.lang.Type.isObject(L)){

          L = qx.util.Uri.toParameter(L);
        };
        if(!L){

          return K;
        };
        return K += /\?/.test(K) ? x + L : B + L;
      },
      toParameter : function(M, Q){

        var P,O = [];
        for(P in M){

          if(M.hasOwnProperty(P)){

            var N = M[P];
            if(N instanceof Array){

              for(var i = 0;i < N.length;i++){

                this.__eG(P, N[i], O, Q);
              };
            } else {

              this.__eG(P, N, O, Q);
            };
          };
        };
        return O.join(x);
      },
      __eG : function(U, V, T, S){

        var R = window.encodeURIComponent;
        if(S){

          T.push(R(U).replace(/%20/g, b) + C + R(V).replace(/%20/g, b));
        } else {

          T.push(R(U) + C + R(V));
        };
      },
      getAbsolute : function(X){

        var W = document.createElement(e);
        W.innerHTML = z + X + w;
        return W.firstChild.href;
      }
    }
  });
})();
(function(){

  var a = "qx.util.Serializer",b = '\\\\',c = '\\f',d = '"',e = "null",f = '\\"',g = "}",h = "get",j = "{",k = '\\r',l = "",m = '\\t',n = "]",o = "Class",p = "Interface",q = "[",r = "Mixin",s = '":',t = "&",u = '\\b',v = "=",w = '\\n',x = ",";
  qx.Class.define(a, {
    statics : {
      toUriParameter : function(z, C, y){

        var E = l;
        var B = qx.util.PropertyUtil.getAllProperties(z.constructor);
        for(var name in B){

          if(B[name].group != undefined){

            continue;
          };
          var A = z[h + qx.lang.String.firstUp(name)]();
          if(qx.lang.Type.isArray(A)){

            var D = qx.data && qx.data.IListData && qx.Class.hasInterface(A && A.constructor, qx.data.IListData);
            for(var i = 0;i < A.length;i++){

              var F = D ? A.getItem(i) : A[i];
              E += this.__eH(name, F, C);
            };
          } else if(qx.lang.Type.isDate(A) && y != null){

            E += this.__eH(name, y.format(A), C);
          } else {

            E += this.__eH(name, A, C);
          };
        };
        return E.substring(0, E.length - 1);
      },
      __eH : function(name, I, G){

        if(I && I.$$type == o){

          I = I.classname;
        };
        if(I && (I.$$type == p || I.$$type == r)){

          I = I.name;
        };
        if(I instanceof qx.core.Object && G != null){

          var H = encodeURIComponent(G(I));
          if(H === undefined){

            var H = encodeURIComponent(I);
          };
        } else {

          var H = encodeURIComponent(I);
        };
        return encodeURIComponent(name) + v + H + t;
      },
      toNativeObject : function(L, N, K){

        var O;
        if(L == null){

          return null;
        };
        if(qx.data && qx.data.IListData && qx.Class.hasInterface(L.constructor, qx.data.IListData)){

          O = [];
          for(var i = 0;i < L.getLength();i++){

            O.push(qx.util.Serializer.toNativeObject(L.getItem(i), N, K));
          };
          return O;
        };
        if(qx.lang.Type.isArray(L)){

          O = [];
          for(var i = 0;i < L.length;i++){

            O.push(qx.util.Serializer.toNativeObject(L[i], N, K));
          };
          return O;
        };
        if(L.$$type == o){

          return L.classname;
        };
        if(L.$$type == p || L.$$type == r){

          return L.name;
        };
        if(L instanceof qx.core.Object){

          if(N != null){

            var J = N(L);
            if(J != undefined){

              return J;
            };
          };
          O = {
          };
          var Q = qx.util.PropertyUtil.getAllProperties(L.constructor);
          for(var name in Q){

            if(Q[name].group != undefined){

              continue;
            };
            var M = L[h + qx.lang.String.firstUp(name)]();
            O[name] = qx.util.Serializer.toNativeObject(M, N, K);
          };
          return O;
        };
        if(qx.lang.Type.isDate(L) && K != null){

          return K.format(L);
        };
        if(qx.locale && qx.locale.LocalizedString && L instanceof qx.locale.LocalizedString){

          return L.toString();
        };
        if(qx.lang.Type.isObject(L)){

          O = {
          };
          for(var P in L){

            O[P] = qx.util.Serializer.toNativeObject(L[P], N, K);
          };
          return O;
        };
        return L;
      },
      toJson : function(T, V, S){

        var W = l;
        if(T == null){

          return e;
        };
        if(qx.data && qx.data.IListData && qx.Class.hasInterface(T.constructor, qx.data.IListData)){

          W += q;
          for(var i = 0;i < T.getLength();i++){

            W += qx.util.Serializer.toJson(T.getItem(i), V, S) + x;
          };
          if(W != q){

            W = W.substring(0, W.length - 1);
          };
          return W + n;
        };
        if(qx.lang.Type.isArray(T)){

          W += q;
          for(var i = 0;i < T.length;i++){

            W += qx.util.Serializer.toJson(T[i], V, S) + x;
          };
          if(W != q){

            W = W.substring(0, W.length - 1);
          };
          return W + n;
        };
        if(T.$$type == o){

          return d + T.classname + d;
        };
        if(T.$$type == p || T.$$type == r){

          return d + T.name + d;
        };
        if(T instanceof qx.core.Object){

          if(V != null){

            var R = V(T);
            if(R != undefined){

              return d + R + d;
            };
          };
          W += j;
          var Y = qx.util.PropertyUtil.getAllProperties(T.constructor);
          for(var name in Y){

            if(Y[name].group != undefined){

              continue;
            };
            var U = T[h + qx.lang.String.firstUp(name)]();
            W += d + name + s + qx.util.Serializer.toJson(U, V, S) + x;
          };
          if(W != j){

            W = W.substring(0, W.length - 1);
          };
          return W + g;
        };
        if(qx.locale && qx.locale.LocalizedString && T instanceof qx.locale.LocalizedString){

          T = T.toString();
        };
        if(qx.lang.Type.isDate(T) && S != null){

          return d + S.format(T) + d;
        };
        if(qx.lang.Type.isObject(T)){

          W += j;
          for(var X in T){

            W += d + X + s + qx.util.Serializer.toJson(T[X], V, S) + x;
          };
          if(W != j){

            W = W.substring(0, W.length - 1);
          };
          return W + g;
        };
        if(qx.lang.Type.isString(T)){

          T = T.replace(/([\\])/g, b);
          T = T.replace(/(["])/g, f);
          T = T.replace(/([\r])/g, k);
          T = T.replace(/([\f])/g, c);
          T = T.replace(/([\n])/g, w);
          T = T.replace(/([\t])/g, m);
          T = T.replace(/([\b])/g, u);
          return d + T + d;
        };
        if(qx.lang.Type.isDate(T) || qx.lang.Type.isRegExp(T)){

          return d + T + d;
        };
        return T + l;
      }
    }
  });
})();
(function(){

  var a = "$$theme_",b = "$$user_",c = "qx.util.PropertyUtil",d = "$$init_";
  qx.Class.define(c, {
    statics : {
      getProperties : function(e){

        return e.$$properties;
      },
      getAllProperties : function(j){

        var g = {
        };
        var f = j;
        while(f != qx.core.Object){

          var i = this.getProperties(f);
          for(var h in i){

            g[h] = i[h];
          };
          f = f.superclass;
        };
        return g;
      },
      getUserValue : function(l, k){

        return l[b + k];
      },
      setUserValue : function(n, m, o){

        n[b + m] = o;
      },
      deleteUserValue : function(q, p){

        delete (q[b + p]);
      },
      getInitValue : function(s, r){

        return s[d + r];
      },
      setInitValue : function(u, t, v){

        u[d + t] = v;
      },
      deleteInitValue : function(x, w){

        delete (x[d + w]);
      },
      getThemeValue : function(z, y){

        return z[a + y];
      },
      setThemeValue : function(B, A, C){

        B[a + A] = C;
      },
      deleteThemeValue : function(E, D){

        delete (E[a + D]);
      },
      setThemed : function(H, G, I){

        var F = qx.core.Property.$$method.setThemed;
        H[F[G]](I);
      },
      resetThemed : function(K, J){

        var L = qx.core.Property.$$method.resetThemed;
        K[L[J]]();
      }
    }
  });
})();
(function(){

  var a = "HEAD",b = "CONNECT",c = "OPTIONS",d = "PUT",e = "GET",f = "PATCH",g = "//",h = "DELETE",i = "POST",j = "TRACE",k = "qx.util.Request";
  qx.Bootstrap.define(k, {
    statics : {
      isCrossDomain : function(l){

        var n = qx.util.Uri.parseUri(l),location = window.location;
        if(!location){

          return false;
        };
        var m = location.protocol;
        if(!(l.indexOf(g) !== -1)){

          return false;
        };
        if(m.substr(0, m.length - 1) == n.protocol && location.host === n.host && location.port === n.port){

          return false;
        };
        return true;
      },
      isSuccessful : function(status){

        return (status >= 200 && status < 300 || status === 304);
      },
      isMethod : function(p){

        var o = [e, i, d, h, a, c, j, b, f];
        return (o.indexOf(p) !== -1) ? true : false;
      },
      methodAllowsRequestBody : function(q){

        return !((/^(GET|HEAD)$/).test(q));
      }
    }
  });
})();
(function(){

  var a = '[object Boolean]',b = '[object String]',c = 'constructor',d = '[object Date]',e = '[object Number]',f = 'object',g = "qx.lang.Object",h = '[object RegExp]',j = '[object Array]';
  qx.Bootstrap.define(g, {
    statics : {
      empty : function(k){

        {
        };
        for(var m in k){

          if(k.hasOwnProperty(m)){

            delete k[m];
          };
        };
      },
      isEmpty : function(n){

        {
        };
        for(var o in n){

          return false;
        };
        return true;
      },
      getLength : qx.Bootstrap.objectGetLength,
      getValues : function(q){

        {
        };
        var r = [];
        var p = Object.keys(q);
        for(var i = 0,l = p.length;i < l;i++){

          r.push(q[p[i]]);
        };
        return r;
      },
      mergeWith : qx.Bootstrap.objectMergeWith,
      clone : function(s, v){

        if(qx.lang.Type.isObject(s)){

          var t = {
          };
          for(var u in s){

            if(v){

              t[u] = qx.lang.Object.clone(s[u], v);
            } else {

              t[u] = s[u];
            };
          };
          return t;
        } else if(qx.lang.Type.isArray(s)){

          var t = [];
          for(var i = 0;i < s.length;i++){

            if(v){

              t[i] = qx.lang.Object.clone(s[i], v);
            } else {

              t[i] = s[i];
            };
          };
          return t;
        };
        return s;
      },
      equals : function(w, x){

        return qx.lang.Object.__eI(w, x, [], []);
      },
      __eI : function(E, A, y, z){

        if(E === A){

          return E !== 0 || 1 / E == 1 / A;
        };
        if(E == null || A == null){

          return E === A;
        };
        var D = Object.prototype.toString.call(E);
        if(D != Object.prototype.toString.call(A)){

          return false;
        };
        switch(D){case b:
        return E == String(A);case e:
        return E != +E ? A != +A : (E == 0 ? 1 / E == 1 / A : E == +A);case d:case a:
        return +E == +A;case h:
        return E.source == A.source && E.global == A.global && E.multiline == A.multiline && E.ignoreCase == A.ignoreCase;};
        if(typeof E != f || typeof A != f){

          return false;
        };
        var length = y.length;
        while(length--){

          if(y[length] == E){

            return z[length] == A;
          };
        };
        var C = E.constructor,B = A.constructor;
        if(C !== B && !(qx.Bootstrap.isFunction(C) && (C instanceof C) && qx.Bootstrap.isFunction(B) && (B instanceof B)) && (c in E && c in A)){

          return false;
        };
        y.push(E);
        z.push(A);
        var H = 0,F = true;
        if(D == j){

          H = E.length;
          F = H == A.length;
          if(F){

            while(H--){

              if(!(F = qx.lang.Object.__eI(E[H], A[H], y, z))){

                break;
              };
            };
          };
        } else {

          for(var G in E){

            if(Object.prototype.hasOwnProperty.call(E, G)){

              H++;
              if(!(F = Object.prototype.hasOwnProperty.call(A, G) && qx.lang.Object.__eI(E[G], A[G], y, z))){

                break;
              };
            };
          };
          if(F){

            for(G in A){

              if(Object.prototype.hasOwnProperty.call(A, G) && !(H--)){

                break;
              };
            };
            F = !H;
          };
        };
        y.pop();
        z.pop();
        return F;
      },
      invert : function(I){

        {
        };
        var J = {
        };
        for(var K in I){

          J[I[K].toString()] = K;
        };
        return J;
      },
      getKeyFromValue : function(L, M){

        {
        };
        for(var N in L){

          if(L.hasOwnProperty(N) && L[N] === M){

            return N;
          };
        };
        return null;
      },
      contains : function(O, P){

        {
        };
        return this.getKeyFromValue(O, P) !== null;
      },
      fromArray : function(Q){

        {
        };
        var R = {
        };
        for(var i = 0,l = Q.length;i < l;i++){

          {
          };
          R[Q[i].toString()] = true;
        };
        return R;
      }
    }
  });
})();
(function(){

  var a = "qx.io.request.Jsonp",b = "qx.event.type.Event",c = "Boolean";
  qx.Class.define(a, {
    extend : qx.io.request.AbstractRequest,
    events : {
      "success" : b,
      "load" : b,
      "statusError" : b
    },
    properties : {
      cache : {
        check : c,
        init : true
      }
    },
    members : {
      _createTransport : function(){

        return new qx.bom.request.Jsonp();
      },
      _getConfiguredUrl : function(){

        var d = this.getUrl(),e;
        if(this.getRequestData()){

          e = this._serializeData(this.getRequestData());
          d = qx.util.Uri.appendParamsToUrl(d, e);
        };
        if(!this.getCache()){

          d = qx.util.Uri.appendParamsToUrl(d, {
            nocache : new Date().valueOf()
          });
        };
        return d;
      },
      _getParsedResponse : function(){

        return this._transport.responseJson;
      },
      setCallbackParam : function(f){

        this._transport.setCallbackParam(f);
      },
      setCallbackName : function(name){

        this._transport.setCallbackName(name);
      }
    }
  });
})();
(function(){

  var a = "url: ",b = "qx.debug.io",c = "qx.bom.request.Script",d = "Invalid state",e = "head",f = "error",g = "loadend",h = "qx.debug",i = "script",j = "load",k = "Unknown response headers",l = "browser.documentmode",m = "abort",n = "",o = "Received native readyState: loaded",p = "readystatechange",q = "Response header cannot be determined for ",r = "requests made with script transport.",s = "opera",t = "unknown",u = "Open native request with ",v = "Response headers cannot be determined for",w = "mshtml",x = "engine.name",y = "Detected error",z = "Send native request",A = "on",B = "timeout",C = "Unknown environment key at this phase",D = "Received native load";
  qx.Bootstrap.define(c, {
    construct : function(){

      this.__eR();
      this.__eJ = qx.Bootstrap.bind(this._onNativeLoad, this);
      this.__eK = qx.Bootstrap.bind(this._onNativeError, this);
      this.__ey = qx.Bootstrap.bind(this._onTimeout, this);
      this.__eL = document.head || document.getElementsByTagName(e)[0] || document.documentElement;
      this._emitter = new qx.event.Emitter();
      this.timeout = this.__eT() ? 0 : 15000;
    },
    events : {
      "readystatechange" : c,
      "error" : c,
      "loadend" : c,
      "timeout" : c,
      "abort" : c,
      "load" : c
    },
    members : {
      readyState : null,
      status : null,
      statusText : null,
      timeout : null,
      __eM : null,
      on : function(name, E, F){

        this._emitter.on(name, E, F);
        return this;
      },
      open : function(H, G){

        if(this.__eP){

          return;
        };
        this.__eR();
        this.__eB = null;
        this.__eN = G;
        if(this.__eW(b)){

          qx.Bootstrap.debug(qx.bom.request.Script, u + a + G);
        };
        this._readyStateChange(1);
      },
      setRequestHeader : function(I, J){

        if(this.__eP){

          return null;
        };
        var K = {
        };
        if(this.readyState !== 1){

          throw new Error(d);
        };
        K[I] = J;
        this.__eN = qx.util.Uri.appendParamsToUrl(this.__eN, K);
        return this;
      },
      send : function(){

        if(this.__eP){

          return null;
        };
        var M = this.__eU(),L = this.__eL,N = this;
        if(this.timeout > 0){

          this.__eO = window.setTimeout(this.__ey, this.timeout);
        };
        if(this.__eW(b)){

          qx.Bootstrap.debug(qx.bom.request.Script, z);
        };
        L.insertBefore(M, L.firstChild);
        window.setTimeout(function(){

          N._readyStateChange(2);
          N._readyStateChange(3);
        });
        return this;
      },
      abort : function(){

        if(this.__eP){

          return null;
        };
        this.__eB = true;
        this.__eV();
        this._emit(m);
        return this;
      },
      _emit : function(event){

        this[A + event]();
        this._emitter.emit(event, this);
      },
      onreadystatechange : function(){
      },
      onload : function(){
      },
      onloadend : function(){
      },
      onerror : function(){
      },
      onabort : function(){
      },
      ontimeout : function(){
      },
      getResponseHeader : function(O){

        if(this.__eP){

          return null;
        };
        if(this.__eW(h)){

          qx.Bootstrap.debug(q + r);
        };
        return t;
      },
      getAllResponseHeaders : function(){

        if(this.__eP){

          return null;
        };
        if(this.__eW(h)){

          qx.Bootstrap.debug(v + r);
        };
        return k;
      },
      setDetermineSuccess : function(P){

        this.__eM = P;
      },
      dispose : function(){

        var Q = this.__eQ;
        if(!this.__eP){

          if(Q){

            Q.onload = Q.onreadystatechange = null;
            this.__eV();
          };
          if(this.__eO){

            window.clearTimeout(this.__eO);
          };
          this.__eP = true;
        };
      },
      isDisposed : function(){

        return !!this.__eP;
      },
      _getUrl : function(){

        return this.__eN;
      },
      _getScriptElement : function(){

        return this.__eQ;
      },
      _onTimeout : function(){

        this.__eS();
        if(!this.__eT()){

          this._emit(f);
        };
        this._emit(B);
        if(!this.__eT()){

          this._emit(g);
        };
      },
      _onNativeLoad : function(){

        var S = this.__eQ,R = this.__eM,T = this;
        if(this.__eB){

          return;
        };
        if(this.__eW(x) === w && this.__eW(l) < 9){

          if(!(/loaded|complete/).test(S.readyState)){

            return;
          } else {

            if(this.__eW(b)){

              qx.Bootstrap.debug(qx.bom.request.Script, o);
            };
          };
        };
        if(this.__eW(b)){

          qx.Bootstrap.debug(qx.bom.request.Script, D);
        };
        if(R){

          if(!this.status){

            this.status = R() ? 200 : 500;
          };
        };
        if(this.status === 500){

          if(this.__eW(b)){

            qx.Bootstrap.debug(qx.bom.request.Script, y);
          };
        };
        if(this.__eO){

          window.clearTimeout(this.__eO);
        };
        window.setTimeout(function(){

          T._success();
          T._readyStateChange(4);
          T._emit(j);
          T._emit(g);
        });
      },
      _onNativeError : function(){

        this.__eS();
        this._emit(f);
        this._emit(g);
      },
      __eQ : null,
      __eL : null,
      __eN : n,
      __eJ : null,
      __eK : null,
      __ey : null,
      __eO : null,
      __eB : null,
      __eP : null,
      __eR : function(){

        this.readyState = 0;
        this.status = 0;
        this.statusText = n;
      },
      _readyStateChange : function(U){

        this.readyState = U;
        this._emit(p);
      },
      _success : function(){

        this.__eV();
        this.readyState = 4;
        if(!this.status){

          this.status = 200;
        };
        this.statusText = n + this.status;
      },
      __eS : function(){

        this.__eV();
        this.readyState = 4;
        this.status = 0;
        this.statusText = null;
      },
      __eT : function(){

        var W = this.__eW(x) === w && this.__eW(l) < 9;
        var V = this.__eW(x) === s;
        return !(W || V);
      },
      __eU : function(){

        var X = this.__eQ = document.createElement(i);
        X.src = this.__eN;
        X.onerror = this.__eK;
        X.onload = this.__eJ;
        if(this.__eW(x) === w && this.__eW(l) < 9){

          X.onreadystatechange = this.__eJ;
        };
        return X;
      },
      __eV : function(){

        var Y = this.__eQ;
        if(Y && Y.parentNode){

          this.__eL.removeChild(Y);
        };
      },
      __eW : function(ba){

        if(qx && qx.core && qx.core.Environment){

          return qx.core.Environment.get(ba);
        } else {

          if(ba === x){

            return qx.bom.client.Engine.getName();
          };
          if(ba === l){

            return qx.bom.client.Browser.getDocumentMode();
          };
          if(ba == b){

            return false;
          };
          throw new Error(C);
        };
      }
    },
    defer : function(){

      if(qx && qx.core && qx.core.Environment){

        qx.core.Environment.add(b, false);
      };
    }
  });
})();
(function(){

  var a = "qx.event.Emitter",b = "*";
  qx.Bootstrap.define(a, {
    extend : Object,
    statics : {
      __eX : []
    },
    members : {
      __eY : null,
      __fa : null,
      on : function(name, c, d){

        var e = qx.event.Emitter.__eX.length;
        this.__fb(name).push({
          listener : c,
          ctx : d,
          id : e,
          name : name
        });
        qx.event.Emitter.__eX.push({
          name : name,
          listener : c,
          ctx : d
        });
        return e;
      },
      once : function(name, f, g){

        var h = qx.event.Emitter.__eX.length;
        this.__fb(name).push({
          listener : f,
          ctx : g,
          once : true,
          id : h
        });
        qx.event.Emitter.__eX.push({
          name : name,
          listener : f,
          ctx : g
        });
        return h;
      },
      off : function(name, m, k){

        var l = this.__fb(name);
        for(var i = l.length - 1;i >= 0;i--){

          var n = l[i];
          if(n.listener == m && n.ctx == k){

            l.splice(i, 1);
            qx.event.Emitter.__eX[n.id] = null;
            return n.id;
          };
        };
        return null;
      },
      offById : function(p){

        var o = qx.event.Emitter.__eX[p];
        if(o){

          this.off(o.name, o.listener, o.ctx);
        };
        return null;
      },
      addListener : function(name, q, r){

        return this.on(name, q, r);
      },
      addListenerOnce : function(name, s, t){

        return this.once(name, s, t);
      },
      removeListener : function(name, u, v){

        this.off(name, u, v);
      },
      removeListenerById : function(w){

        this.offById(w);
      },
      emit : function(name, A){

        var x = this.__fb(name).concat();
        var y = [];
        for(var i = 0;i < x.length;i++){

          var z = x[i];
          z.listener.call(z.ctx, A);
          if(z.once){

            y.push(z);
          };
        };
        y.forEach(function(B){

          var C = this.__fb(name);
          var D = C.indexOf(B);
          C.splice(D, 1);
        }.bind(this));
        x = this.__fb(b);
        for(var i = x.length - 1;i >= 0;i--){

          var z = x[i];
          z.listener.call(z.ctx, A);
        };
      },
      getListeners : function(){

        return this.__eY;
      },
      getEntryById : function(F){

        for(var name in this.__eY){

          var E = this.__eY[name];
          for(var i = 0,j = E.length;i < j;i++){

            if(E[i].id === F){

              return E[i];
            };
          };
        };
      },
      __fb : function(name){

        if(this.__eY == null){

          this.__eY = {
          };
        };
        if(this.__eY[name] == null){

          this.__eY[name] = [];
        };
        return this.__eY[name];
      }
    }
  });
})();
(function(){

  var a = "qx.bom.request.Jsonp",b = "callback",c = "open",d = "dispose",e = "",f = "_onNativeLoad",g = "qx",h = ".callback",i = "qx.bom.request.Jsonp.";
  qx.Bootstrap.define(a, {
    extend : qx.bom.request.Script,
    construct : function(){

      qx.bom.request.Script.apply(this);
      this.__fk();
    },
    members : {
      responseJson : null,
      __ck : null,
      __fc : null,
      __fd : null,
      __fe : null,
      __ff : null,
      __fg : null,
      __eP : null,
      __fh : e,
      open : function(o, k){

        if(this.__eP){

          return;
        };
        var m = {
        },l,n,j = this;
        this.responseJson = null;
        this.__fe = false;
        l = this.__fc || b;
        n = this.__fd || this.__fh + i + this.__ck + h;
        if(!this.__fd){

          this.constructor[this.__ck] = this;
        } else {

          if(!window[this.__fd]){

            this.__ff = true;
            window[this.__fd] = function(p){

              j.callback(p);
            };
          } else {

            {
            };
          };
        };
        {
        };
        m[l] = n;
        this.__fg = k = qx.util.Uri.appendParamsToUrl(k, m);
        this.__fj(c, [o, k]);
      },
      callback : function(q){

        if(this.__eP){

          return;
        };
        this.__fe = true;
        {
        };
        this.responseJson = q;
        this.constructor[this.__ck] = undefined;
        this.__fi();
      },
      setCallbackParam : function(r){

        this.__fc = r;
        return this;
      },
      setCallbackName : function(name){

        this.__fd = name;
        return this;
      },
      setPrefix : function(s){

        this.__fh = s;
      },
      getGeneratedUrl : function(){

        return this.__fg;
      },
      dispose : function(){

        this.__fi();
        this.__fj(d);
      },
      _onNativeLoad : function(){

        this.status = this.__fe ? 200 : 500;
        this.__fj(f);
      },
      __fi : function(){

        if(this.__ff && window[this.__fd]){

          window[this.__fd] = undefined;
          this.__ff = false;
        };
      },
      __fj : function(u, t){

        qx.bom.request.Script.prototype[u].apply(this, t || []);
      },
      __fk : function(){

        this.__ck = g + (new Date().valueOf()) + (e + Math.random()).substring(2, 5);
      }
    }
  });
})();
(function(){

  var a = "function",b = "action",c = "wialon.core.Uploader",d = "input",e = "singleton",g = "eventHash",h = "max_http_buff",j = ">",k = "fileUploaded",l = "onload",m = "multipart/form-data",n = "load",o = "hidden",p = "enctype",q = "target",r = "name",s = "",t = "&sid=",u = "method",v = "form",w = "POST",x = "params",y = "?svc=",z = "none",A = "<",B = "jUploadFrame",C = "iframe",D = "jUploadForm",E = "undefined",F = "id",G = "hash",H = "object";
  qx.Class.define(c, {
    extend : qx.core.Object,
    type : e,
    members : {
      __fl : null,
      __fm : {
      },
      __fn : 1024 * 1024 * 64,
      uploadFiles : function(I, bb, S, R, W, bc){

        this.__fn = wialon.core.Session.getInstance().getEnv(h) || this.__fn;
        R = wialon.util.Helper.wrapCallback(R);
        if(!(I instanceof Array))return R(4);
        var P = (new Date()).getTime();
        var L = D + P;
        var X = B + P;
        var M = wialon.core.Session.getInstance();
        var ba = M.getBaseUrl() + M.getApiPath() + y + bb + t + M.getId();
        var V = document.createElement(v);
        if(!S)S = {
        };
        S[g] = L;
        var T = document.createElement(d);
        T.name = x;
        T.type = o;
        T.value = (wialon.util.Json.stringify(S).replace(/&lt;/g, A).replace(/&gt;/g, j));
        V.appendChild(T);
        var T = document.createElement(d);
        T.name = g;
        T.type = o;
        T.value = L;
        V.appendChild(T);
        var J = document.createElement(C);
        V.setAttribute(b, ba);
        V.setAttribute(u, w);
        V.setAttribute(r, L);
        V.setAttribute(F, L);
        V.setAttribute(p, m);
        V.style.display = z;
        var O = 0;
        for(var i = 0;i < I.length;i++){

          var N = I[i];
          var U = document.getElementById(N.id);
          var Q = 0;
          if(U && typeof U.files == H && U.files.length){

            var f = U.files[0];
            Q = typeof f.fileSize != E ? f.fileSize : (typeof f.size != E ? f.size : 0);
          };
          N.parentNode.insertBefore(N.cloneNode(true), N);
          N.setAttribute(F, s);
          V.appendChild(N);
          O += Q;
        };
        document.body.appendChild(V);
        J.setAttribute(F, X);
        J.setAttribute(r, X);
        J.style.display = z;
        document.body.appendChild(J);
        var K = qx.lang.Function.bind(this.__fo, this, {
          callback : R,
          io : J,
          form : V,
          phase : 0
        });
        if(O > this.__fn){

          K();
          return;
        };
        if(!W){

          if(window.attachEvent)J.attachEvent(l, K); else J.addEventListener(n, K, false);
        } else {

          if(!this.__fl)this.__fl = M.addListener(k, this.__fp, this);
          this.__fm[L] = K;
        };
        V.setAttribute(q, X);
        V.submit();
        if(bc && W){

          var Y = qx.lang.Function.bind(function(){

            if(typeof this.__fm[L] == a)this.__fm[L]();
          }, this);
          setTimeout(Y, bc * 1000);
        };
        return true;
      },
      __fo : function(bd, event){

        bd.io.parentNode.removeChild(bd.io);
        bd.form.parentNode.removeChild(bd.form);
        bd.io = null;
        bd.form = null;
        if(event && typeof event.result == H)bd.callback(event.result.svc_error, event.result.svc_result); else bd.callback(event ? 0 : 6, (event && typeof event.preventDefault == a) ? null : event);
      },
      __fp : function(event){

        var bf = event.getData();
        if(!bf || typeof bf[G] == E)return;
        var be = this.__fm[bf[G]];
        if(!be)return;
        be(bf);
        delete this.__fm[bf[G]];
      }
    }
  });
})();
(function(){

  var a = "create",b = "user/update_password",c = "changeAuthParams",d = "delete_user_notify",e = "user/update_hosts_mask",f = "Integer",g = "update_user_pass",h = "Object",i = "wialon.item.User",j = "delete",k = "user/update_item_access",l = "user/get_locale",m = "user",n = "hm",o = "userAccessChanged",p = "update_hosts_mask",q = "update_user_flags",r = "ap",s = "create_user",t = "String",u = "changeLoginDate",v = "user/update_locale",w = "changeHostsMask",x = "ld",y = "user/get_items_access",z = "create_user_notify",A = "acl",B = "changeUserFlags",C = "qx.event.type.Data",D = "fl",E = "user/update_auth_params",F = "user/send_push_message",G = "user/update_users_notifications",H = "user/update_user_flags",I = "user/verify_auth",J = "object";
  qx.Class.define(i, {
    extend : wialon.item.Item,
    properties : {
      userFlags : {
        init : null,
        check : f,
        event : B
      },
      hostsMask : {
        init : null,
        check : t,
        event : w
      },
      loginDate : {
        init : null,
        check : f,
        event : u
      },
      authParams : {
        init : null,
        check : h,
        nullable : true,
        event : c
      }
    },
    members : {
      getItemsAccess : function(M, K){

        var L = {
        };
        if(M && typeof M == J)L = M; else if(arguments.length > 2){

          L.flags = 0;
          L.directAccess = arguments[0];
          L.itemSuperclass = arguments[1];
          K = arguments[2];
        };
        return wialon.core.Remote.getInstance().remoteCall(y, {
          userId : this.getId(),
          directAccess : L.directAccess,
          itemSuperclass : L.itemSuperclass,
          flags : L.flags
        }, wialon.util.Helper.wrapCallback(K));
      },
      updateItemAccess : function(N, O, P){

        return wialon.core.Remote.getInstance().remoteCall(k, {
          userId : this.getId(),
          itemId : N.getId(),
          accessMask : O
        }, wialon.util.Helper.wrapCallback(P));
      },
      updateUserFlags : function(S, R, Q){

        return wialon.core.Remote.getInstance().remoteCall(H, {
          userId : this.getId(),
          flags : S,
          flagsMask : R
        }, qx.lang.Function.bind(this._onUpdateProperties, this, wialon.util.Helper.wrapCallback(Q)));
      },
      updateHostsMask : function(U, T){

        return wialon.core.Remote.getInstance().remoteCall(e, {
          userId : this.getId(),
          hostsMask : U
        }, qx.lang.Function.bind(this._onUpdateProperties, this, wialon.util.Helper.wrapCallback(T)));
      },
      getLocale : function(V){

        return wialon.core.Remote.getInstance().remoteCall(l, {
          userId : this.getId()
        }, wialon.util.Helper.wrapCallback(V));
      },
      updateLocale : function(W, X){

        return wialon.core.Remote.getInstance().remoteCall(v, {
          userId : this.getId(),
          locale : W
        }, wialon.util.Helper.wrapCallback(X));
      },
      updatePassword : function(bb, ba, bc, Y){

        Y = Y || 0;
        return wialon.core.Remote.getInstance().remoteCall(b, {
          userId : this.getId(),
          oldPassword : bb,
          newPassword : ba,
          logInvalid : Y
        }, wialon.util.Helper.wrapCallback(bc));
      },
      sendPushMessage : function(bh, be, bg, bf, bd){

        return wialon.core.Remote.getInstance().remoteCall(F, {
          userId : this.getId(),
          appName : bh,
          message : be,
          ttl : bf,
          params : bg
        }, wialon.util.Helper.wrapCallback(bd));
      },
      verifyAuth : function(bk, bi){

        var bj = {
          userId : this.getId(),
          type : bk.type,
          destination : bk.destination
        };
        return wialon.core.Remote.getInstance().remoteCall(I, bj, wialon.util.Helper.wrapCallback(bi));
      },
      updateAuthParams : function(bn, bl){

        var bm = {
          userId : this.getId(),
          type : bn.type
        };
        if(bn.phone)bm.phone = bn.phone;
        return wialon.core.Remote.getInstance().remoteCall(E, bm, wialon.util.Helper.wrapCallback(bl));
      }
    },
    statics : {
      dataFlag : {
        flags : 0x00000100,
        notifications : 0x00000200,
        connSettings : 0x00000400,
        mobileApps : 0x00000800
      },
      accessFlag : {
        setItemsAccess : 0x100000,
        operateAs : 0x200000,
        editUserFlags : 0x400000
      },
      authParamsType : {
        email : 1,
        sms : 2
      },
      defaultDataFlags : function(){

        return wialon.item.Item.dataFlag.base | wialon.item.Item.dataFlag.customProps | wialon.item.Item.dataFlag.billingProps | wialon.item.User.dataFlag.flags;
      },
      userFlag : {
        isDisabled : 0x00000001,
        cantChangePassword : 0x00000002,
        canCreateItems : 0x00000004,
        isReadonly : 0x00000010,
        canSendSMS : 0x00000020
      },
      accessDataFlag : {
        combined : 0x00000001,
        direct : 0x00000002
      },
      logMessageAction : {
        userCreated : s,
        userUpdatedHostsMask : p,
        userUpdatedPassword : g,
        userUpdatedFlags : q,
        userCreatedNotification : z,
        userDeletedNotification : d
      },
      registerProperties : function(){

        var bo = wialon.core.Session.getInstance();
        bo.registerConstructor(m, wialon.item.User);
        bo.registerProperty(D, this.remoteUpdateUserFlags);
        bo.registerProperty(n, this.remoteUpdateHostsMask);
        bo.registerProperty(x, this.remoteUpdateLoginDate);
        bo.registerProperty(A, this.remoteUpdateAcl);
        bo.registerProperty(r, this.remoteUpdateAuthParams);
      },
      remoteUpdateUserFlags : function(bp, bq){

        bp.setUserFlags(bq);
      },
      remoteUpdateAcl : function(br, bs){

        this.fireDataEvent(o, arguments);
      },
      remoteUpdateHostsMask : function(bt, bu){

        bt.setHostsMask(bu);
      },
      remoteUpdateLoginDate : function(bv, bw){

        bv.setLoginDate(bw);
      },
      remoteUpdateAuthParams : function(bx, by){

        bx.setAuthParams(by);
      },
      createUserNotifications : function(bz, bA, bC){

        if(!bz || !bA){

          return;
        };
        var bB = Object.assign({
        }, bz);
        bB.callMode = a;
        bB.items = bA;
        return wialon.core.Remote.getInstance().remoteCall(G, bB, wialon.util.Helper.wrapCallback(bC));
      },
      deleteUserNotifications : function(bD, bE){

        if(!bD){

          return;
        };
        return wialon.core.Remote.getInstance().remoteCall(G, {
          callMode : j,
          items : bD
        }, wialon.util.Helper.wrapCallback(bE));
      }
    },
    events : {
      "changeUserFlags" : C,
      "changeHostsMask" : C,
      "changeLoginDate" : C,
      "userAccessChanged" : C,
      "changeAuthParams" : C
    }
  });
})();
(function(){

  var a = "download_file",b = "set",c = "cneh",d = "update_unit_phone",e = "changeAccessPassword",f = "update_unit_uid",g = "qx.event.type.Data",h = 'function',i = "check_config",j = "changeDeviceTypeId",k = "changeMessageParams",l = "changeDriverCode",m = "Float",n = "pos",o = "number",p = "unit/update_traffic_counter",q = "update_unit_trip_cfg",r = "update_alias",s = "unit/update_mileage_counter",t = "vp",u = "update_msgs_filter_cfg",v = "update_unit_milcounter",w = "delete_unit_msg",x = "unit/update_calc_flags",y = "bind_unit_trailer",z = "delete_alias",A = "?sid=",B = "unit/update_eh_counter",C = "&time=",D = "unit/set_active",E = "changeUniqueId2",F = "changeLastMessage",G = "unbind_unit_driver",H = "act",I = "hw",J = "update_unit_calcflags",K = "ud",L = "get",M = "&msgIndex=",N = "psw",O = "update_unit_phone2",P = "cfl",Q = "uid2",R = "avl_unit",S = "ph",T = "import_unit_msgs",U = "uid",V = "unit/exec_cmd",W = "update_unit_bytecounter",X = "create_alias",Y = "lmsg",cv = "changePhoneNumber2",cw = "changeMileageCounter",cx = 'position_deletion',cr = "changeActive",cs = "unit/reset_vrt_command_queue",ct = "&svc=unit/update_hw_params&params=",cu = "unit/update_access_password",cC = "function",cD = "delete_service_interval",cE = "changeTrafficCounter",cF = "wialon.item.Unit",cy = "unit/get_vrt_command_queue",cz = "update_unit_report_cfg",cA = "changeVideoParams",cB = "Object",cJ = "changeNetConn",dk = "unit/update_unique_id2",dI = "changePhoneNumber",cK = "/avl_msg_photo.jpeg?sid=",cG = "unit/update_activity_settings",cH = "update_unit_pass",dD = "cmds",cI = "ph2",cL = "changeUniqueId",cM = "changeCalcFlags",cN = "unbind_unit_trailer",cS = "unit/update_device_type",cT = "unit/update_phone",cU = 'number',cO = "bind_unit_driver",cP = "update_unit_hw",cQ = "prms",cR = "account/change_account",cY = "object",da = "changeEngineHoursCounter",dF = "unit/update_phone2",db = "changeDeactivationTime",cV = "cnkb",cW = "update_unit_ehcounter",dE = "unit/get_activity_settings",cX = "update_sensor",df = "Integer",dg = "changePosition",dH = "update_unit_fuel_cfg",dh = "update_unit_uid2",dc = "Array",dd = 'position_validation',dG = "String",de = "netconn",di = "",dj = "update_service_interval",dw = "cnm",dv = "changeCommands",du = "v1311",dA = "create_sensor",dz = "drv",dy = "unit/get_command_definition_data",dx = "unit/update_hw_params",dp = "update_unit_hw_config",dn = "delete_sensor",dm = "/adfurl",dl = "create_service_interval",dt = "import_unit_cfg",ds = "dactt",dr = "&unitIndex=",dq = "delete_unit_msgs",dC = "create_unit",dB = "undefined";
  qx.Class.define(cF, {
    extend : wialon.item.Item,
    properties : {
      uniqueId : {
        init : null,
        check : dG,
        event : cL
      },
      uniqueId2 : {
        init : null,
        check : dG,
        event : E
      },
      deviceTypeId : {
        init : null,
        check : df,
        event : j
      },
      phoneNumber : {
        init : null,
        check : dG,
        event : dI
      },
      phoneNumber2 : {
        init : null,
        check : dG,
        event : cv
      },
      accessPassword : {
        init : null,
        check : dG,
        event : e
      },
      commands : {
        init : null,
        check : dc,
        event : dv
      },
      position : {
        init : null,
        check : cB,
        event : dg,
        nullable : true
      },
      lastMessage : {
        init : null,
        check : cB,
        event : F,
        nullable : true
      },
      prevMessage : {
        init : null,
        check : cB,
        nullable : true
      },
      driverCode : {
        init : null,
        check : dG,
        event : l
      },
      calcFlags : {
        init : null,
        check : df,
        event : cM
      },
      mileageCounter : {
        init : null,
        check : df,
        event : cw
      },
      engineHoursCounter : {
        init : null,
        check : m,
        event : da
      },
      trafficCounter : {
        init : null,
        check : df,
        event : cE
      },
      messageParams : {
        init : null,
        check : cB,
        event : k,
        nullable : true
      },
      netConn : {
        init : 0,
        check : df,
        event : cJ
      },
      activity : {
        init : 1,
        check : df,
        event : cr
      },
      deactivationTime : {
        init : 0,
        check : df,
        event : db
      },
      videoParams : {
        init : null,
        check : cB,
        event : cA
      }
    },
    members : {
      remoteCommand : function(dK, dJ, dL, dO, dN, dM){

        if(dN && typeof dN == cC){

          dM = dN;
          dN = 0;
        };
        return wialon.core.Remote.getInstance().remoteCall(V, {
          itemId : this.getId(),
          commandName : dK,
          linkType : dJ,
          param : dL,
          timeout : dO,
          flags : dN
        }, wialon.util.Helper.wrapCallback(dM));
      },
      remoteCommandDefinitions : function(dQ, dP){

        return wialon.core.Remote.getInstance().remoteCall(dy, {
          itemId : this.getId(),
          col : dQ.commands
        }, wialon.util.Helper.wrapCallback(dP));
      },
      getVirtualCommandsQueue : function(dR){

        return wialon.core.Remote.getInstance().remoteCall(cy, {
          itemId : this.getId()
        }, wialon.util.Helper.wrapCallback(dR));
      },
      resetVirtualCommandsQueue : function(dS){

        return wialon.core.Remote.getInstance().remoteCall(cs, {
          itemId : this.getId()
        }, wialon.util.Helper.wrapCallback(dS));
      },
      updateDeviceSettings : function(dV, dU, dT){

        return wialon.core.Remote.getInstance().remoteCall(cS, {
          itemId : this.getId(),
          deviceTypeId : dV,
          uniqueId : dU
        }, qx.lang.Function.bind(this._onUpdateProperties, this, wialon.util.Helper.wrapCallback(dT)));
      },
      updateUniqueId2 : function(dW, dX){

        return wialon.core.Remote.getInstance().remoteCall(dk, {
          itemId : this.getId(),
          uniqueId2 : dW
        }, qx.lang.Function.bind(this._onUpdateProperties, this, wialon.util.Helper.wrapCallback(dX)));
      },
      updatePhoneNumber : function(ea, dY){

        return wialon.core.Remote.getInstance().remoteCall(cT, {
          itemId : this.getId(),
          phoneNumber : ea
        }, qx.lang.Function.bind(this._onUpdateProperties, this, wialon.util.Helper.wrapCallback(dY)));
      },
      updatePhoneNumber2 : function(ec, eb){

        return wialon.core.Remote.getInstance().remoteCall(dF, {
          itemId : this.getId(),
          phoneNumber : ec
        }, qx.lang.Function.bind(this._onUpdateProperties, this, wialon.util.Helper.wrapCallback(eb)));
      },
      updateAccessPassword : function(ee, ed){

        return wialon.core.Remote.getInstance().remoteCall(cu, {
          itemId : this.getId(),
          accessPassword : ee
        }, qx.lang.Function.bind(this._onUpdateProperties, this, wialon.util.Helper.wrapCallback(ed)));
      },
      updateMileageCounter : function(eg, ef){

        return wialon.core.Remote.getInstance().remoteCall(s, {
          itemId : this.getId(),
          newValue : eg
        }, qx.lang.Function.bind(this._onUpdateProperties, this, wialon.util.Helper.wrapCallback(ef)));
      },
      updateEngineHoursCounter : function(ei, eh){

        return wialon.core.Remote.getInstance().remoteCall(B, {
          itemId : this.getId(),
          newValue : ei
        }, qx.lang.Function.bind(this._onUpdateProperties, this, wialon.util.Helper.wrapCallback(eh)));
      },
      updateTrafficCounter : function(ek, el, ej){

        return wialon.core.Remote.getInstance().remoteCall(p, {
          itemId : this.getId(),
          newValue : ek,
          regReset : el || 0
        }, qx.lang.Function.bind(this._onUpdateProperties, this, wialon.util.Helper.wrapCallback(ej)));
      },
      updateCalcFlags : function(en, em){

        return wialon.core.Remote.getInstance().remoteCall(x, {
          itemId : this.getId(),
          newValue : en
        }, qx.lang.Function.bind(this._onUpdateProperties, this, wialon.util.Helper.wrapCallback(em)));
      },
      updateActive : function(ep, eo){

        return wialon.core.Remote.getInstance().remoteCall(D, {
          itemId : this.getId(),
          active : ep
        }, qx.lang.Function.bind(this._onUpdateProperties, this, wialon.util.Helper.wrapCallback(eo)));
      },
      setActive : function(eq){

        this.updateActivity(eq);
      },
      getActive : function(){

        var er = this.getActivity();
        if(er === null)return 1; else return er;
      },
      changeAccount : function(et, es){

        return wialon.core.Remote.getInstance().remoteCall(cR, {
          itemId : this.getId(),
          resourceId : et.resourceId
        }, wialon.util.Helper.wrapCallback(es));
      },
      handleMessage : function(ey){

        if(ey && ey.tp == K){

          var ex = this.getLastMessage();
          var eA = this.getPosition();
          var ev = ey.f & wialon.item.Unit.dataMessageFlag.lbsFlag;
          var ez = 0;
          if(eA)ez = eA.f & wialon.item.Unit.dataMessageFlag.lbsFlag;
          if(!ex || ex.t < ey.t){

            if(!ex){

              this.setLastMessage(ey);
              this.setPrevMessage(ex);
            } else {

              var ew = qx.lang.Object.clone(ey);
              if(ey.p)ew.p = qx.lang.Object.clone(ey.p);
              if(wialon.core.Session.getInstance().getVersion() == du){

                qx.lang.Object.mergeWith(ew, ex, 0);
                if(ex.p)qx.lang.Object.mergeWith(ew.p, ex.p, 0);
              };
              if(ew.pos && (!eA || !ev || (eA.lc != ey.lc && (ez || (ey.t - eA.t >= 300))))){
              } else {

                if(eA){

                  ew.pos = qx.lang.Object.clone(eA);
                  ew.pos._noPosition = true;
                } else {

                  ew.pos = null;
                };
              };
              this.setLastMessage(ew);
              this.setPrevMessage(ex);
            };
          };
          if(ey.pos && (!eA || !eA.t || eA.t < ey.t)){

            if(!eA || !ev || !eA.t || (eA.lc != ey.lc && (ez || (ey.t - eA.t >= 300)))){

              var eu = qx.lang.Object.clone(ey.pos);
              eu.t = ey.t;
              eu.f = ey.f;
              eu.lc = ey.lc;
              wialon.item.Unit.__fr(this, eu);
              this.__fq(eu);
            };
          };
        };
        wialon.item.Item.prototype.handleMessage.call(this, ey);
      },
      getMessageImageUrl : function(eD, eB, eC){

        if(!eC)eC = di;
        return wialon.core.Session.getInstance().getBaseUrl() + dm + eC + cK + wialon.core.Session.getInstance().getId() + C + eD + dr + this.getId() + M + eB;
      },
      downloadHwParamFile : function(eG, eH, eE){

        var eF = wialon.core.Session.getInstance();
        return eF.getBaseUrl() + eF.getApiPath() + A + eF.getId() + ct + qx.lang.Json.stringify({
          itemId : this.getId(),
          hwId : eG,
          fileId : eH,
          action : a
        });
      },
      updateHwParams : function(eJ, eK, eI, eL){

        if(eI && eI.length && (typeof eK.full_data != dB && !eK.full_data))wialon.core.Uploader.getInstance().uploadFiles(eI, dx, {
          itemId : this.getId(),
          hwId : eJ,
          params_data : eK,
          action : b
        }, wialon.util.Helper.wrapCallback(eL), true, 30000); else return wialon.core.Remote.getInstance().remoteCall(dx, {
          itemId : this.getId(),
          hwId : eJ,
          params_data : eK,
          action : b
        }, wialon.util.Helper.wrapCallback(eL));
      },
      getDriverActivitySettings : function(eM){

        return wialon.core.Remote.getInstance().remoteCall(dE, {
          itemId : this.getId()
        }, wialon.util.Helper.wrapCallback(eM));
      },
      updateDriverActivitySettings : function(eO, eN){

        return wialon.core.Remote.getInstance().remoteCall(cG, {
          itemId : this.getId(),
          type : eO
        }, wialon.util.Helper.wrapCallback(eN));
      },
      __fq : function(eR){

        var eQ = wialon.core.Session.getInstance();
        var eP = eQ.getCoordinatesTransformer();
        if(eP){

          eR = eP.direct(eR);
        };
        this.setPosition(eR);
      }
    },
    statics : {
      dataFlag : {
        restricted : 0x00000100,
        commands : 0x00000200,
        lastMessage : 0x00000400,
        driverCode : 0x00000800,
        sensors : 0x00001000,
        counters : 0x00002000,
        routeControl : 0x00004000,
        maintenance : 0x00008000,
        log : 0x00010000,
        reportSettings : 0x00020000,
        other : 0x00040000,
        commandAliases : 0x00080000,
        messageParams : 0x00100000,
        netConn : 0x00200000,
        lastPosition : 0x00400000
      },
      accessFlag : {
        editDevice : 0x100000,
        viewDevice : 0x4000000,
        editSensors : 0x200000,
        editCounters : 0x400000,
        deleteMessages : 0x800000,
        executeCommands : 0x1000000,
        registerEvents : 0x2000000,
        viewServiceIntervals : 0x10000000,
        editServiceIntervals : 0x20000000,
        importMessages : 0x40000000,
        exportMessages : 0x80000000,
        viewCmdAliases : 0x400000000,
        editCmdAliases : 0x800000000,
        editReportSettings : 0x4000000000,
        monitorState : 0x8000000000
      },
      calcFlag : {
        mileageMask : 0xF,
        mileageGps : 0x0,
        mileageAbsOdometer : 0x1,
        mileageRelOdometer : 0x2,
        mileageGpsIgn : 0x3,
        engineHoursMask : 0xF0,
        engineHoursIgn : 0x10,
        engineHoursAbs : 0x20,
        engineHoursRel : 0x40,
        mileageAuto : 0x100,
        engineHoursAuto : 0x200,
        trafficAuto : 0x400
      },
      dataMessageFlag : {
        position : 0x1,
        inputs : 0x2,
        outputs : 0x4,
        alarm : 0x10,
        driverCode : 0x20,
        imported : 0x40,
        lbsFlag : 0x20000,
        wifiFlag : 0x80000
      },
      eventMessageFlag : {
        typeMask : 0x0F,
        typeSimple : 0x0,
        typeViolation : 0x1,
        typeMaintenance : 0x2,
        typeRouteControl : 0x4,
        typeDrivingInfo : 0x8,
        maintenanceMask : 0x0,
        maintenanceService : 0x10,
        maintenanceFilling : 0x20
      },
      execCmdFlag : {
        primaryPhone : 0x01,
        secondaryPhone : 0x02,
        paramFsLink : 0x04,
        paramTempFile : 0x08,
        paramJson : 0x10
      },
      logMessageAction : {
        unitCreated : dC,
        unitUpdatedPassword : cH,
        unitUpdatedPhone : d,
        unitUpdatedPhone2 : O,
        unitUpdatedCalcFlags : J,
        unitChangeMilageCounter : v,
        unitChangeByteCounter : W,
        unitChangeEngineHoursCounter : cW,
        unitUpdatedUniqueId : f,
        unitUpdatedUniqueId2 : dh,
        unitUpdatedHwType : cP,
        unitUpdatedHwConfig : dp,
        unitUpdatedFuelConsumptionSettings : dH,
        unitUpdatedTripDetectorSettings : q,
        unitCreatedSensor : dA,
        unitUpdatedSensor : cX,
        unitDeletedSensor : dn,
        unitCreatedCommandAlias : X,
        unitUpdatedCommandAlias : r,
        unitDeletedCommandAlias : z,
        unitCreatedServiceInterval : dl,
        unitUpdatedServiceInterval : dj,
        unitDeletedServiceInterval : cD,
        unitSettingsImported : dt,
        unitMessagesImported : T,
        unitMessageDeleted : w,
        unitMessagesDeleted : dq,
        unitDriverBinded : cO,
        unitDriverUnbinded : G,
        unitTrailerBinded : y,
        unitTrailerUnbinded : cN,
        unitReportSettingsUpdated : cz,
        unitMessagesFilterSettingsUpdated : u
      },
      driverActivitySource : {
        none : 0,
        trips : 1,
        tachograph : 2
      },
      registerProperties : function(){

        var eS = wialon.core.Session.getInstance();
        eS.registerConstructor(R, wialon.item.Unit);
        eS.registerProperty(U, this.remoteUpdateUniqueId);
        eS.registerProperty(Q, this.remoteUpdateUniqueId2);
        eS.registerProperty(I, this.remoteUpdateDeviceTypeId);
        eS.registerProperty(S, this.remoteUpdatePhoneNumber);
        eS.registerProperty(cI, this.remoteUpdatePhoneNumber2);
        eS.registerProperty(N, this.remoteUpdateAccessPassword);
        eS.registerProperty(dD, this.remoteUpdateCommands);
        eS.registerProperty(n, this.remoteUpdatePosition);
        eS.registerProperty(Y, this.remoteUpdateLastMessage);
        eS.registerProperty(dz, this.remoteUpdateDriverCode);
        eS.registerProperty(P, this.remoteUpdateCalcFlags);
        eS.registerProperty(dw, this.remoteUpdateMileageCounter);
        eS.registerProperty(c, this.remoteUpdateEngineHoursCounter);
        eS.registerProperty(cV, this.remoteUpdateTrafficCounter);
        eS.registerProperty(cQ, this.remoteUpdateMessageParams);
        eS.registerProperty(de, this.remoteUpdateNetConn);
        eS.registerProperty(H, this.remoteUpdateActive);
        eS.registerProperty(ds, this.remoteUpdateDeactivationTime);
        eS.registerProperty(t, this.remoteUpdateVideoParams);
        wialon.item.MIcon.registerIconProperties();
      },
      remoteUpdateVideoParams : function(eT, eU){

        eT.setVideoParams(eU);
      },
      remoteUpdateUniqueId : function(eV, eW){

        eV.setUniqueId(eW);
      },
      remoteUpdateUniqueId2 : function(eX, eY){

        eX.setUniqueId2(eY);
      },
      remoteUpdateDeviceTypeId : function(fa, fb){

        fa.setDeviceTypeId(fb);
      },
      remoteUpdatePhoneNumber : function(fc, fd){

        fc.setPhoneNumber(fd);
      },
      remoteUpdatePhoneNumber2 : function(fe, ff){

        fe.setPhoneNumber2(ff);
      },
      remoteUpdateAccessPassword : function(fg, fh){

        fg.setAccessPassword(fh);
      },
      remoteUpdateCommands : function(fi, fj){

        fi.setCommands(fj);
      },
      remoteUpdatePosition : function(fk, fo){

        var fm = wialon.core.Session.getInstance();
        var fl = fm.getLogger();
        if(fl && (typeof fl.warn === h)){

          var fn = fk.getPosition();
          if(fn && !fo){

            fl.warn({
              type : cx,
              unit : fk
            });
          } else {

            wialon.item.Unit.__fr(fk, fo);
          };
        };
        fk.__fq(fo);
      },
      remoteUpdateLastMessage : function(fp, fq){

        fp.setLastMessage(fq);
      },
      remoteUpdateDriverCode : function(fr, fs){

        fr.setDriverCode(fs);
      },
      remoteUpdateCalcFlags : function(ft, fu){

        ft.setCalcFlags(fu);
      },
      remoteUpdateMileageCounter : function(fv, fw){

        fv.setMileageCounter(fw);
      },
      remoteUpdateEngineHoursCounter : function(fx, fy){

        fx.setEngineHoursCounter(fy);
      },
      remoteUpdateTrafficCounter : function(fz, fA){

        fz.setTrafficCounter(fA);
      },
      remoteUpdateMessageParams : function(fC, fE){

        if(typeof fE != cY)return;
        var fB = fC.getMessageParams();
        if(!fB)fB = {
        }; else fB = qx.lang.Object.clone(fB);
        for(var fD in fE){

          if(typeof fE[fD] == cY && typeof fB[fD] == cY && fE[fD].ct > fB[fD].ct){

            var fF = fB[fD].at;
            fB[fD] = fE[fD];
            if(fF > fE[fD].at)fB[fD].at = fF;
          } else if(typeof fE[fD] == cY && typeof fB[fD] == cY && fE[fD].ct == fB[fD].ct && fE[fD].at > fB[fD].at){

            fB[fD].at = fE[fD].at;
          } else if(typeof fE[fD] == cY && typeof fB[fD] == dB)fB[fD] = fE[fD]; else if(typeof fB[fD] == cY && typeof fE[fD] == o && fE[fD] > fB[fD].at)fB[fD].at = fE[fD];;;;
        };
        fC.setMessageParams(fB);
      },
      remoteUpdateNetConn : function(fG, fH){

        fG.setNetConn(fH);
      },
      remoteUpdateActive : function(fI, fJ){

        fI.setActivity(fJ);
      },
      remoteUpdateDeactivationTime : function(fK, fL){

        fK.setDeactivationTime(fL);
      },
      checkHwConfig : function(fN, fM){

        return wialon.core.Remote.getInstance().remoteCall(dx, {
          hwId : fN,
          action : i
        }, wialon.util.Helper.wrapCallback(fM));
      },
      getHwParams : function(fR, fQ, fP, fO){

        return wialon.core.Remote.getInstance().remoteCall(dx, {
          itemId : fR,
          hwId : fQ,
          fullData : fP ? 1 : 0,
          action : L
        }, wialon.util.Helper.wrapCallback(fO));
      },
      __fr : function(fW, fV){

        if(!fV)return;
        var fU = wialon.core.Session.getInstance();
        var fT = fU.getLogger();
        if(!fT || (typeof fT.warn !== h))return;
        var fS = (typeof fV.x === cU) && (typeof fV.y === cU);
        if(!fS)return;
        fS = (-90 <= fV.y && fV.y <= 90);
        if(!fS){

          fT.warn({
            type : dd,
            unit : fW,
            pos : fV
          });
        };
      }
    },
    events : {
      "changeUniqueId" : g,
      "changeUniqueId2" : g,
      "changeDeviceTypeId" : g,
      "changePhoneNumber" : g,
      "changePhoneNumber2" : g,
      "changeAccessPassword" : g,
      "changeCommands" : g,
      "changePosition" : g,
      "changeLastMessage" : g,
      "changeDriverCode" : g,
      "changeCalcFlags" : g,
      "changeMileageCounter" : g,
      "changeEngineHoursCounter" : g,
      "changeTrafficCounter" : g,
      "changeMessageParams" : g,
      "changeNetConn" : g,
      "changeActive" : g,
      "changeDeactivationTime" : g,
      "changeVideoParams" : g
    }
  });
})();
(function(){

  var a = "ugi",b = "undefined",c = "&v=1&sid=",d = "wialon.item.MIcon",e = "qx.event.type.Data",f = "number",g = "changeIconUri",h = "unit/upload_image",i = "string",j = "changeIcon",k = "img_rot",l = "?b=",m = ".png?sid=",n = "/avl_item_image/",o = "/",p = "Integer",q = "String",r = "unit/update_image",s = "uri";
  qx.Mixin.define(d, {
    properties : {
      iconCookie : {
        init : null,
        check : p,
        event : j
      },
      iconUri : {
        init : null,
        check : q,
        event : g
      }
    },
    members : {
      getIconUrl : function(w){

        if(typeof w == b || !w)w = 32;
        var v = this.getIconUri();
        var u = wialon.core.Session.getInstance();
        if(v){

          return u.getBaseUrl() + v + l + w + c + u.getId();
        };
        var t = u.getBaseUrl() + n + this.getId() + o + w + o + this.getIconCookie() + m + u.getId();
        return t;
      },
      updateIcon : function(x, y){

        if(typeof x == i)return wialon.core.Uploader.getInstance().uploadFiles([], h, {
          fileUrl : x,
          itemId : this.getId()
        }, y, true); else if(typeof x == f)return wialon.core.Remote.getInstance().remoteCall(r, {
          itemId : this.getId(),
          oldItemId : x
        }, y);;
        return wialon.core.Uploader.getInstance().uploadFiles([x], h, {
          itemId : this.getId()
        }, y, true);
      },
      updateIconLibrary : function(A, z, B){

        wialon.core.Remote.getInstance().remoteCall(r, {
          itemId : this.getId(),
          libId : A,
          path : z
        }, B);
      },
      canRotate : function(){

        return (this.getCustomProperty(k) != 0) && (wialon.util.Number.and(this.getIconCookie(), 0x1FFFFF00000000) == 0);
      },
      getIconGroupId : function(){

        if(wialon.util.Number.and(this.getIconCookie(), 0x1FFFFF00000000) != 0)return (this.getIconCookie() & 0xFFFFFFFF); else return 0;
      }
    },
    statics : {
      registerIconProperties : function(){

        var C = wialon.core.Session.getInstance();
        C.registerProperty(a, this.remoteUpdateIconCookie);
        C.registerProperty(s, this.remoteUpdateIconUri);
      },
      remoteUpdateIconCookie : function(D, E){

        D.setIconCookie(E);
      },
      remoteUpdateIconUri : function(F, G){

        F.setIconUri(G);
      }
    },
    events : {
      "changeIcon" : e,
      "changeIconUri" : e
    }
  });
})();
(function(){

  var a = "create_resource",b = "import_zones",c = "delete_notify",d = "resource/upload_tacho_file",e = "delete_poi",f = "update_driver",g = "switch_job",h = "update_driver_units",i = "avl_resource",j = "update_zone",k = "resource/update_email_template",l = "delete_drivers_group",m = "resource/get_orders_notification",n = "create_zones_group",o = "delete_report",p = "update_report",q = "delete_driver",r = "resource/get_email_template",s = "delete_zone",t = "update_poi",u = "delete_job",v = "update_notify",w = "update_drivers_group",x = "wialon.item.Resource",y = "create_drivers_group",z = "create_notify",A = "resource/update_orders_notification",B = "create_zone",C = "create_driver",D = "switch_notify",E = "create_report",F = "update_zones_group",G = "delete_zones_group",H = "update_job",I = "import_pois",J = "create_job",K = "create_poi";
  qx.Class.define(x, {
    extend : wialon.item.Item,
    members : {
      saveTachoData : function(N, M, O, L){

        return wialon.core.Remote.getInstance().remoteCall(d, {
          itemId : this.getId(),
          driverCode : N,
          guid : M,
          outputFlag : O
        }, wialon.util.Helper.wrapCallback(L));
      },
      getOrdersNotification : function(P){

        return wialon.core.Remote.getInstance().remoteCall(m, {
          resourceId : this.getId()
        }, wialon.util.Helper.wrapCallback(P));
      },
      updateOrdersNotification : function(R, Q){

        return wialon.core.Remote.getInstance().remoteCall(A, {
          resourceId : this.getId(),
          ordersNotification : R
        }, wialon.util.Helper.wrapCallback(Q));
      },
      getEmailTemplate : function(S){

        return wialon.core.Remote.getInstance().remoteCall(r, {
          resourceId : this.getId()
        }, wialon.util.Helper.wrapCallback(S));
      },
      updateEmailTemplate : function(W, T, V, U){

        return wialon.core.Remote.getInstance().remoteCall(k, {
          resourceId : this.getId(),
          subject : W,
          body : T,
          flags : V
        }, wialon.util.Helper.wrapCallback(U));
      }
    },
    statics : {
      dataFlag : {
        drivers : 0x00000100,
        jobs : 0x00000200,
        notifications : 0x00000400,
        poi : 0x00000800,
        zones : 0x00001000,
        reports : 0x00002000,
        agro : 0x01000000,
        driverUnits : 0x00004000,
        driverGroups : 0x00008000,
        trailers : 0x00010000,
        trailerGroups : 0x00020000,
        trailerUnits : 0x00040000,
        orders : 0x00080000,
        zoneGroups : 0x00100000,
        tags : 0x00200000,
        tagUnits : 0x00400000,
        tagGroups : 0x00800000
      },
      accessFlag : {
        viewNotifications : 0x100000,
        editNotifications : 0x200000,
        viewPoi : 0x400000,
        editPoi : 0x800000,
        viewZones : 0x1000000,
        editZones : 0x2000000,
        viewJobs : 0x4000000,
        editJobs : 0x8000000,
        viewReports : 0x10000000,
        editReports : 0x20000000,
        viewDrivers : 0x40000000,
        editDrivers : 0x80000000,
        manageAccount : 0x100000000,
        viewOrders : 0x200000000,
        editOrders : 0x400000000,
        viewTags : 0x800000000,
        editTags : 0x1000000000,
        agroEditCultivations : 0x10000000000,
        agroView : 0x20000000000,
        agroEdit : 0x40000000000,
        viewTrailers : 0x100000000000,
        editTrailers : 0x200000000000
      },
      logMessageAction : {
        resourceCreated : a,
        resourceCreatedZone : B,
        resourceUpdatedZone : j,
        resourceDeletedZone : s,
        resourceCreatedZonesGroup : n,
        resourceUpdatedZonesGroup : F,
        resourceDeletedZonesGroup : G,
        resourceCreatedPoi : K,
        resourceUpdatedPoi : t,
        resourceDeletedPoi : e,
        resourceCreatedJob : J,
        resourceSwitchedJob : g,
        resourceUpdatedJob : H,
        resourceDeletedJob : u,
        resourceCreatedNotification : z,
        resourceSwitchedNotification : D,
        resourceUpdatedNotification : v,
        resourceDeletedNotification : c,
        resourceCreatedDriver : C,
        resourceUpdatedDriver : f,
        resourceDeletedDriver : q,
        resourceCreatedDriversGroup : y,
        resourceUpdatedDriversGroup : w,
        resourceDeletedDriversGroup : l,
        resourceUpdatedDriverUnits : h,
        resourceCreatedReport : E,
        resourceUpdatedReport : p,
        resourceDeletedReport : o,
        resourceImportedPois : I,
        resourceImportedZones : b
      },
      remoteOptimizeFlag : {
        fitSchedule : 0x1,
        optimizeDuration : 0x2
      },
      jobFlags : {
        removeAfterLimit : 0x1
      },
      registerProperties : function(){

        var X = wialon.core.Session.getInstance();
        X.registerConstructor(i, wialon.item.Resource);
      }
    }
  });
})();
(function(){

  var a = "create_group",b = "Array",c = "u",d = "wialon.item.UnitGroup",e = "avl_unit",f = "avl_unit_group",g = "units_group",h = "qx.event.type.Data",i = "changeUnits",j = "unit_group/update_units";
  qx.Class.define(d, {
    extend : wialon.item.Item,
    properties : {
      units : {
        init : null,
        check : b,
        event : i
      }
    },
    members : {
      updateUnits : function(k, l){

        return wialon.core.Remote.getInstance().remoteCall(j, {
          itemId : this.getId(),
          units : k
        }, qx.lang.Function.bind(this._onUpdateProperties, this, wialon.util.Helper.wrapCallback(l)));
      }
    },
    statics : {
      registerProperties : function(){

        var m = wialon.core.Session.getInstance();
        m.registerConstructor(f, wialon.item.UnitGroup);
        m.registerProperty(c, this.remoteUpdateUnits);
        wialon.item.MIcon.registerIconProperties();
      },
      logMessageAction : {
        unitGroupCreated : a,
        unitGroupUnitsUpdated : g
      },
      remoteUpdateUnits : function(n, p){

        var o = n.getUnits();
        if(o && wialon.util.Json.compareObjects(p, o))return;
        n.setUnits(p);
      },
      checkUnit : function(q, s){

        if(!q || q.getType() != f || !s || s.getType() != e)return false;
        var r = q.getUnits();
        var t = s.getId();
        return (r.indexOf(t) != -1 ? true : false);
      }
    },
    events : {
      "changeUnits" : h
    }
  });
})();
(function(){

  var a = "Boolean",b = "changeOperating",c = "retranslator/update_config",d = "Integer",e = "Object",f = "retranslator/update_units",g = "changeStopTime",h = "avl_retranslator",i = "rtrc",j = "qx.event.type.Data",k = "retranslator/get_stats",l = "create_retranslator",m = "rtru",n = "switch_retranslator",o = "retranslator/update_operating",p = "rtro",q = "units_retranslator",r = "rtrst",s = "changeConfig",t = "retranslator/list",u = "changeUnits",v = "update_retranslator",w = "wialon.item.Retranslator",x = "object";
  qx.Class.define(w, {
    extend : wialon.item.Item,
    properties : {
      operating : {
        init : null,
        check : a,
        event : b
      },
      stopTime : {
        init : null,
        check : d,
        event : g
      },
      config : {
        init : null,
        check : e,
        event : s
      },
      units : {
        init : null,
        check : e,
        event : u
      }
    },
    members : {
      updateOperating : function(A, y){

        var z = {
        };
        if(A && typeof A == x)z = A; else z.operate = A;
        return wialon.core.Remote.getInstance().remoteCall(o, {
          itemId : this.getId(),
          callMode : z.callMode,
          operate : z.operate,
          timeFrom : z.timeFrom,
          timeTo : z.timeTo
        }, qx.lang.Function.bind(this._onUpdateProperties, this, wialon.util.Helper.wrapCallback(y)));
      },
      updateOperatingWithTimeout : function(F, D, E, B){

        var C;
        if(E)C = D; else C = wialon.core.Session.getInstance().getServerTime() + D;
        return wialon.core.Remote.getInstance().remoteCall(o, {
          itemId : this.getId(),
          operate : F,
          stopTime : C
        }, qx.lang.Function.bind(this._onUpdateProperties, this, wialon.util.Helper.wrapCallback(B)));
      },
      getStatistics : function(G){

        return wialon.core.Remote.getInstance().remoteCall(k, {
          itemId : this.getId()
        }, wialon.util.Helper.wrapCallback(G));
      },
      updateConfig : function(I, H){

        return wialon.core.Remote.getInstance().remoteCall(c, {
          itemId : this.getId(),
          config : I
        }, qx.lang.Function.bind(this._onUpdateProperties, this, wialon.util.Helper.wrapCallback(H)));
      },
      updateUnits : function(J, K){

        return wialon.core.Remote.getInstance().remoteCall(f, {
          itemId : this.getId(),
          units : J
        }, qx.lang.Function.bind(this._onUpdateProperties, this, wialon.util.Helper.wrapCallback(K)));
      }
    },
    statics : {
      dataFlag : {
        state : 0x00000100,
        units : 0x00000200
      },
      accessFlag : {
        editSettings : 0x100000,
        editUnits : 0x200000
      },
      logMessageAction : {
        retranslatorCreated : l,
        retranslatorUpdated : v,
        retranslatorUnitsUpdated : q,
        retranslatorSwitched : n
      },
      registerProperties : function(){

        var L = wialon.core.Session.getInstance();
        L.registerConstructor(h, wialon.item.Retranslator);
        L.registerProperty(p, this.remoteUpdateOperating);
        L.registerProperty(r, this.remoteUpdateStopTime);
        L.registerProperty(i, this.remoteUpdateConfig);
        L.registerProperty(m, this.remoteUpdateUnits);
      },
      remoteUpdateOperating : function(M, N){

        M.setOperating(N ? true : false);
      },
      remoteUpdateStopTime : function(O, P){

        O.setStopTime(P);
      },
      remoteUpdateConfig : function(Q, R){

        Q.setConfig(R ? R : {
        });
      },
      remoteUpdateUnits : function(S, U){

        var T = S.getUnits();
        if(T && wialon.util.Json.compareObjects(U, T))return;
        S.setUnits(U);
      },
      getRetranslatorTypes : function(V){

        return wialon.core.Remote.getInstance().remoteCall(t, {
        }, wialon.util.Helper.wrapCallback(V));
      }
    },
    events : {
      "changeOperating" : j,
      "changeStopTime" : j,
      "changeConfig" : j,
      "changeUnits" : j
    }
  });
})();
(function(){

  var a = "create_schedule",b = "update_route_points",c = "rpts",d = "route/get_schedule_time",e = "update_round",f = "Object",g = "update_route_cfg",h = "delete_round",i = "Array",j = "route/load_rounds",k = "update_schedule",l = "wialon.item.Route",m = "qx.event.type.Data",n = "delete_schedule",o = "create_route",p = "number",q = "route/get_all_rounds",r = "changeConfig",s = "changeCheckPoints",t = "route/update_checkpoints",u = "rcfg",v = "create_round",w = "route/update_config",z = "avl_route";
  qx.Class.define(l, {
    extend : wialon.item.Item,
    properties : {
      config : {
        init : null,
        check : f,
        nullable : true,
        event : r
      },
      checkPoints : {
        init : null,
        check : i,
        event : s
      }
    },
    members : {
      updateConfig : function(C, B){

        return wialon.core.Remote.getInstance().remoteCall(w, {
          itemId : this.getId(),
          config : C
        }, qx.lang.Function.bind(this._onUpdateProperties, this, wialon.util.Helper.wrapCallback(B)));
      },
      getNextRoundTime : function(E, F, G, D){

        return wialon.core.Remote.getInstance().remoteCall(d, {
          itemId : this.getId(),
          scheduleId : E,
          timeFrom : F,
          timeTo : G
        }, wialon.util.Helper.wrapCallback(D));
      },
      loadRoundsHistory : function(I, J, H, K){

        return wialon.core.Remote.getInstance().remoteCall(j, {
          itemId : this.getId(),
          timeFrom : I,
          timeTo : J,
          fullJson : H
        }, wialon.util.Helper.wrapCallback(K));
      },
      updateCheckPoints : function(O, L){

        var N = wialon.core.Session.getInstance();
        var M = N.getCoordinatesTransformer();
        if(M){

          O = A({
            transform : M.reverse.bind(M),
            points : O
          });
        };
        return wialon.core.Remote.getInstance().remoteCall(t, {
          itemId : this.getId(),
          checkPoints : O
        }, qx.lang.Function.bind(this._onUpdateProperties, this, wialon.util.Helper.wrapCallback(L)));
      },
      getRouteRounds : function(Q, R, P, S){

        return wialon.core.Remote.getInstance().remoteCall(q, {
          itemId : this.getId(),
          timeFrom : Q,
          timeTo : R,
          fullJson : P
        }, wialon.util.Helper.wrapCallback(S));
      }
    },
    statics : {
      dataFlag : {
        config : 0x00000100,
        checkPoints : 0x00000200,
        schedules : 0x00000400,
        rounds : 0x00000800
      },
      accessFlag : {
        editSettings : 0x100000
      },
      states : {
        stateInactive : 0x010000,
        stateFinshed : 0x020000,
        stateCheckingArrive : 0x040000,
        stateCheckingDeparture : 0x080000,
        stateTimeLate : 0x200000,
        stateTimeEarly : 0x400000,
        stateDisabled : 0x800000,
        stateAborted : 0x0100000,
        eventControlStarted : 0x1,
        eventControlFinished : 0x2,
        eventControlAborted : 0x4,
        eventPointArrived : 0x8,
        eventPointSkipped : 0x10,
        eventPointDepartured : 0x20,
        eventControlLate : 0x40,
        eventControlEarly : 0x80,
        eventControlInTime : 0x100
      },
      routePointFlag : {
        simple : 0x1,
        geozone : 0x2,
        unit : 0x4
      },
      scheduleFlag : {
        relative : 0x1,
        relativeDaily : 0x2,
        absolute : 0x4
      },
      roundFlag : {
        autoDelete : 0x2,
        allowSkipPoints : 0x10,
        generateEvents : 0x20,
        arbituaryPoints : 0x40
      },
      logMessageAction : {
        routeCreated : o,
        routeUpdatedPoints : b,
        routeUpdatedConfiguration : g,
        routeCreatedRound : v,
        routeUpdatedRound : e,
        routeDeletedRound : h,
        routeCreatedSchedule : a,
        routeUpdatedSchedule : k,
        routeDeletedSchedule : n
      },
      registerProperties : function(){

        var T = wialon.core.Session.getInstance();
        T.registerConstructor(z, wialon.item.Route);
        T.registerProperty(c, this.remoteUpdateCheckPoints);
        T.registerProperty(u, this.remoteUpdateConfig);
      },
      remoteUpdateCheckPoints : function(U, X){

        var W = wialon.core.Session.getInstance();
        var V = W.getCoordinatesTransformer();
        if(V){

          X = A({
            transform : V.direct.bind(V),
            points : X
          });
        };
        U.setCheckPoints(X);
      },
      remoteUpdateConfig : function(Y, ba){

        Y.setConfig(ba);
      }
    },
    events : {
      "changeCheckPoints" : m,
      "changeConfig" : m
    }
  });
  function A(bc){

    var bd = bc.transform;
    var bb = bc.points;
    return bb.map(function(be){

      if(!be)return be;
      var x = be.x;
      var y = be.y;
      if(typeof y !== p || typeof x !== p){

        return be;
      };
      var bg = bd({
        x : x,
        y : y
      });
      if(bg.x === x && bg.y === y){

        return be;
      };
      var bf = Object.assign({
      }, be);
      bf.x = bg.x;
      bf.y = bg.y;
      return bf;
    });
  };
})();
(function(){

  var a = "render/create_poi_layer",b = "function",c = ".png",d = "report",e = "wialon.render.Renderer",f = "__fz",g = "render/remove_all_layers",h = "Integer",j = "Object",k = "__fs",l = "qx.event.type.Event",m = "render/create_messages_layer",n = "/",o = "resource/create_zone_by_track",p = "render/remove_layer",q = "",r = "number",s = "_",t = "/avl_hittest_pos",u = 'number',v = "render/set_locale",w = "/adfurl",A = "render/enable_layer",B = "changeVersion",C = "render/create_zones_layer",D = "/avl_render/",E = "undefined",F = "object";
  qx.Class.define(e, {
    extend : qx.core.Object,
    construct : function(){

      qx.core.Object.call(this);
      this.__fs = new Array;
    },
    properties : {
      version : {
        init : 0,
        check : h,
        event : B
      },
      reportResult : {
        init : null,
        check : j,
        nullable : true,
        apply : f
      }
    },
    members : {
      __fs : null,
      __ft : Date.now(),
      getLayers : function(){

        return this.__fs;
      },
      getReportLayer : function(){

        for(var i = 0;i < this.__fs.length;i++)if(this.__fs[i].getName().substr(0, 6) == d)return this.__fs[i];;
        return null;
      },
      getTileUrl : function(x, y, z){

        return wialon.core.Session.getInstance().getBaseUrl() + w + this.__ft + s + this.getVersion() + D + x + s + y + s + (17 - z) + n + wialon.core.Session.getInstance().getId() + c;
      },
      setLocale : function(L, G, H, I){

        var J = 0;
        var K = q;
        if(H && typeof H == b){

          I = H;
        } else if(H && typeof H == r){

          J = H;
        } else if(H && typeof H == F){

          J = H.flags;
          K = H.formatDate;
        };;
        return wialon.core.Remote.getInstance().remoteCall(v, {
          tzOffset : L,
          language : G,
          flags : J,
          formatDate : K
        }, wialon.util.Helper.wrapCallback(I));
      },
      createMessagesLayer : function(N, M){

        return wialon.core.Remote.getInstance().remoteCall(m, N, qx.lang.Function.bind(this.__fu, this, wialon.util.Helper.wrapCallback(M)));
      },
      createPoiLayer : function(P, Q, R, O){

        for(var i = this.__fs.length - 1;i >= 0;i--){

          if(this.__fs[i].getName() == P){

            this.__fs[i].dispose();
            qx.lang.Array.remove(this.__fs, this.__fs[i]);
          };
        };
        return wialon.core.Remote.getInstance().remoteCall(a, {
          layerName : P,
          pois : Q,
          flags : R
        }, qx.lang.Function.bind(this.__fv, this, wialon.util.Helper.wrapCallback(O)));
      },
      createZonesLayer : function(T, S, U, V){

        for(var i = this.__fs.length - 1;i >= 0;i--){

          if(this.__fs[i].getName() == T){

            this.__fs[i].dispose();
            qx.lang.Array.remove(this.__fs, this.__fs[i]);
          };
        };
        return wialon.core.Remote.getInstance().remoteCall(C, {
          layerName : T,
          zones : S,
          flags : U
        }, qx.lang.Function.bind(this.__fv, this, wialon.util.Helper.wrapCallback(V)));
      },
      removeLayer : function(X, W){

        return wialon.core.Remote.getInstance().remoteCall(p, {
          layerName : X.getName()
        }, qx.lang.Function.bind(this.__fw, this, wialon.util.Helper.wrapCallback(W), X));
      },
      enableLayer : function(ba, bb, Y){

        return wialon.core.Remote.getInstance().remoteCall(A, {
          layerName : ba.getName(),
          enable : bb ? 1 : 0
        }, qx.lang.Function.bind(this.__fy, this, wialon.util.Helper.wrapCallback(Y), ba));
      },
      removeAllLayers : function(bc){

        return wialon.core.Remote.getInstance().remoteCall(g, {
        }, qx.lang.Function.bind(this.__fx, this, wialon.util.Helper.wrapCallback(bc)));
      },
      hitTest : function(bi, be, bd, bh, bk, bj, bg){

        var bl = 0;
        if(typeof bj == b)bg = bj; else if(typeof bj == r)bl = bj;;
        wialon.core.Remote.getInstance().ajaxRequest(wialon.core.Session.getInstance().getBaseUrl() + t, {
          sid : wialon.core.Session.getInstance().getId(),
          lat : bi,
          flags : bl,
          lon : be,
          scale : bd,
          radius : bh,
          layerName : q + bk
        }, wialon.util.Helper.wrapCallback(bf), 60);
        function bf(bq, bp){

          var bo = wialon.core.Session.getInstance();
          var bn = bo.getCoordinatesTransformer();
          if(bn && !bq && bp){

            if(bp.currMsg){

              bm(bp.currMsg);
            };
            if(bp.prevMsg){

              bm(bp.prevMsg);
            };
          };
          return bg.apply(this, arguments);
          function bm(br){

            var bt = br && br.pos;
            var bs = bt && (typeof bt.x === u) && (typeof bt.y === u);
            if(bs){

              br.pos = bn.direct(bt);
            };
          };
        };
      },
      createZoneByTrack : function(bv, bu){

        return wialon.core.Remote.getInstance().remoteCall(o, bv, wialon.util.Helper.wrapCallback(bu));
      },
      __fu : function(bw, by, bz){

        var bx = null;
        if(by == 0 && bz){

          if(typeof bz.name != E){

            bx = new wialon.render.MessagesLayer(bz);
            this.__fs.push(bx);
          };
          this.setVersion(this.getVersion() + 1);
        };
        bw(by, bx);
      },
      __fv : function(bA, bC, bD){

        var bB = null;
        if(bC == 0 && bD){

          if(typeof bD.name != E){

            bB = new wialon.render.Layer(bD);
            this.__fs.push(bB);
          };
          this.setVersion(this.getVersion() + 1);
        };
        bA(bC, bB);
      },
      __fw : function(bE, bF, bG, bH){

        if(bG){

          bE(bG);
          return;
        };
        qx.lang.Array.remove(this.__fs, bF);
        bF.dispose();
        this.setVersion(this.getVersion() + 1);
        bE(bG);
      },
      __fx : function(bI, bJ, bK){

        if(bJ){

          bI(bJ);
          return;
        };
        if(this.__fs.length){

          for(var i = 0;i < this.__fs.length;i++)this.__fs[i].dispose();
          qx.lang.Array.removeAll(this.__fs);
          this.setVersion(this.getVersion() + 1);
        };
        bI(bJ);
      },
      __fy : function(bL, bM, bN, bP){

        if(bN){

          bL(bN);
          return;
        };
        var bO = bP.enabled ? true : false;
        if(bO != bM.getEnabled()){

          bM.setEnabled(bO);
          this.setVersion(this.getVersion() + 1);
        };
        bL(bN);
      },
      __fz : function(bQ){

        var bR = false;
        for(var i = 0;i < this.__fs.length;i++)if(this.__fs[i].getName().substr(0, 6) == d){

          this.__fs.splice(i, 1);
          bR = true;
          break;
        };
        if(bQ){

          var bT = bQ.getLayerData();
          if(bT){

            var bS = bT.units ? new wialon.render.MessagesLayer(bT) : new wialon.render.Layer(bT);
            this.__fs.push(bS);
            bQ.setLayer(bS);
            bR = true;
          };
        };
        if(bR)this.setVersion(this.getVersion() + 1);
      }
    },
    statics : {
      PoiFlag : {
        renderLabels : 0x01,
        enableGroups : 0x02
      },
      Hittest : {
        full : 0x01,
        markersLayer : 0x10,
        msgsLayer : 0x20,
        shapesLayer : 0x40
      },
      ZonesFlag : {
        renderLabels : 0x01
      },
      MarkerFlag : {
        grouping : 0x0001,
        numbering : 0x0002,
        events : 0x0004,
        fillings : 0x0008,
        images : 0x0010,
        parkings : 0x0020,
        speedings : 0x0040,
        stops : 0x0080,
        thefts : 0x0100,
        usUnits : 0x0200,
        imUnits : 0x0400,
        videos : 0x0800,
        latUnits : 0x1000,
        intervals : 0x2000
      },
      OptionalFlag : {
        usMetrics : 0x01,
        imMetrics : 0x02,
        latMetrics : 0x03,
        skipBlankTiles : 0x100,
        zoomGoogle : 0x200,
        gcjCoordinates : 0x400
      }
    },
    destruct : function(){

      this._disposeArray(k);
    },
    events : {
      "changeVersion" : l
    }
  });
})();
(function(){

  var a = "wialon.render.Layer",b = "Boolean";
  qx.Class.define(a, {
    extend : qx.core.Object,
    construct : function(c){

      qx.core.Object.call(this, c);
      this._data = c;
    },
    properties : {
      enabled : {
        init : true,
        check : b
      }
    },
    members : {
      _data : null,
      getName : function(){

        return this._data.name;
      },
      getBounds : function(){

        return this._data.bounds;
      }
    }
  });
})();
(function(){

  var a = "&msgIndex=",b = "/adfurl",c = "/avl_hittest_time",d = "",e = "number",f = "&layerName=",g = "&unitIndex=",h = "/avl_msg_photo.jpeg?sid=",i = "wialon.render.MessagesLayer",j = "render/delete_message",k = "render/get_messages",l = "object";
  qx.Class.define(i, {
    extend : wialon.render.Layer,
    members : {
      getUnitsCount : function(){

        return this._data.units ? this._data.units.length : 0;
      },
      getUnitId : function(m){

        if(typeof m != e)return this._data.units[0].id;
        return this._data.units[m >= 0 ? m : 0].id;
      },
      getMaxSpeed : function(n){

        if(typeof n != e)return this._data.units[0].max_speed;
        return this._data.units[n >= 0 ? n : 0].max_speed;
      },
      getMileage : function(o){

        if(typeof o != e)return this._data.units[0].mileage;
        return this._data.units[o >= 0 ? o : 0].mileage;
      },
      getMessagesCount : function(p){

        if(typeof p != e)return this._data.units[0].msgs.count;
        return this._data.units[p >= 0 ? p : 0].msgs.count;
      },
      getFirstPoint : function(q){

        if(typeof q != e)return this._data.units[0].msgs.first;
        return this._data.units[q >= 0 ? q : 0].msgs.first;
      },
      getLastPoint : function(r){

        if(typeof r != e)return this._data.units[0].msgs.last;
        return this._data.units[r >= 0 ? r : 0].msgs.last;
      },
      getMessageImageUrl : function(u, s, t){

        if(!t)t = d;
        return wialon.core.Session.getInstance().getBaseUrl() + b + t + h + wialon.core.Session.getInstance().getId() + f + this.getName() + g + u + a + s;
      },
      getMessages : function(y, x, v, w){

        return wialon.core.Remote.getInstance().remoteCall(k, {
          layerName : this.getName(),
          indexFrom : x,
          indexTo : v,
          unitId : this.getUnitId(y)
        }, wialon.core.MessagesLoader.wrapGetMessagesCallback(w));
      },
      deleteMessage : function(B, A, z){

        return wialon.core.Remote.getInstance().remoteCall(j, {
          layerName : this.getName(),
          msgIndex : A,
          unitId : this.getUnitId(B)
        }, wialon.util.Helper.wrapCallback(z));
      },
      hitTest : function(E, C){

        var D = {
        };
        if(E && typeof E == l){

          D = E;
        } else if(arguments.length > 2){

          D.unitId = arguments[0];
          D.time = arguments[1];
          D.revert = arguments[2];
          C = arguments[arguments.length - 1];
        };
        D.sid = wialon.core.Session.getInstance().getId();
        D.layerName = this.getName();
        wialon.core.Remote.getInstance().ajaxRequest(wialon.core.Session.getInstance().getBaseUrl() + c, {
          sid : D.sid,
          layerName : D.layerName,
          unitId : D.unitId,
          time : D.time,
          revert : D.revert,
          anyMsg : D.anyMsg
        }, wialon.util.Helper.wrapCallback(C), 60);
      }
    },
    statics : {
    }
  });
})();
(function(){

  var a = "messages/get_packed_messages",b = "messages/delete_message",c = "messages/load_interval",d = "&svc=messages/get_message_file&params=",e = "wialon.core.MessagesLoader",f = "messages/load_last",g = "messages/unload",h = 'number',i = "messages/get_messages",j = "?sid=";
  qx.Class.define(e, {
    extend : qx.core.Object,
    members : {
      loadInterval : function(k, l, n, p, m, q, o){

        return wialon.core.Remote.getInstance().remoteCall(c, {
          itemId : k,
          timeFrom : l,
          timeTo : n,
          flags : p,
          flagsMask : m,
          loadCount : q
        }, wialon.util.Helper.wrapCallback(o));
      },
      loadLast : function(r, x, t, v, s, w, u){

        return wialon.core.Remote.getInstance().remoteCall(f, {
          itemId : r,
          lastTime : x,
          lastCount : t,
          flags : v,
          flagsMask : s,
          loadCount : w
        }, wialon.util.Helper.wrapCallback(u));
      },
      unload : function(y){

        return wialon.core.Remote.getInstance().remoteCall(g, {
        }, wialon.util.Helper.wrapCallback(y));
      },
      getMessages : function(B, z, A){

        return wialon.core.Remote.getInstance().remoteCall(i, {
          indexFrom : B,
          indexTo : z
        }, wialon.core.MessagesLoader.wrapGetMessagesCallback(A));
      },
      getMessageFile : function(D, E){

        var C = wialon.core.Session.getInstance();
        return C.getBaseUrl() + C.getApiPath() + j + C.getId() + d + encodeURIComponent(wialon.util.Json.stringify({
          msgIndex : D,
          fileName : E
        }));
      },
      deleteMessage : function(G, F){

        return wialon.core.Remote.getInstance().remoteCall(b, {
          msgIndex : G
        }, wialon.util.Helper.wrapCallback(F));
      },
      getPackedMessages : function(H, J, L, K, I){

        return wialon.core.Remote.getInstance().remoteCall(a, {
          itemId : H,
          timeFrom : J,
          timeTo : L,
          filtrationFlags : K
        }, wialon.util.Helper.wrapCallback(I));
      }
    },
    statics : {
      packedFiltration : {
        sats : 0x00000001
      },
      wrapGetMessagesCallback : function(M){

        return function(Q, P){

          var O = wialon.core.Session.getInstance();
          var N = O.getCoordinatesTransformer();
          if(N && !Q && Array.isArray(P)){

            P = P.map(function(R){

              var T = R && R.pos;
              var S = T && (typeof T.x === h) && (typeof T.y === h);
              if(S){

                R.pos = N.direct(T);
              };
              return R;
            });
          };
          return M.apply(this, arguments);
        };
      }
    }
  });
})();
(function(){

  var a = "function",b = 'Sensors',c = "create",d = "set",f = ';',g = '',h = 'object',j = "delete",k = "remoteCreate",l = "string",m = "static",n = "Object",o = 'monitoring_sensor',p = 'function',q = "reset_image",r = "Driver",s = "get",t = "modify",u = "number",v = "qx.event.type.Data",w = "ProfileField",y = "Poi",z = "u",A = "wialon.item.PluginsManager",B = "s",C = "Tag",D = "Data",E = "update",F = "wialon.item.M",G = "remoteUpdate",H = 'monitoring_sensor_id',I = "Zone",J = "Trailer",K = "resetImage",L = 'string',M = "mixinDef = wialon.item.M",N = "undefined",O = "object";
  qx.Class.define(A, {
    type : m,
    statics : {
      bindPropItem : function(clazz, propName, itemName, ajaxPath, extAjaxPath){

        var options;
        var preProcessPropObj;
        var preProcessUpdateCallObj;
        if(typeof propName === h && propName){

          options = propName;
          propName = options.propName;
          itemName = options.itemName;
          ajaxPath = options.ajaxPath;
          extAjaxPath = options.extAjaxPath;
          preProcessPropObj = options.preProcessPropObj;
          preProcessUpdateCallObj = options.preProcessUpdateCallObj;
        };
        var itemNameUCase = itemName.substr(0, 1).toUpperCase() + itemName.substr(1);
        var multName = itemNameUCase + B;
        var mixinBody = {
          members : {
          },
          properties : {
          },
          statics : {
          },
          events : {
          }
        };
        mixinBody.events[E + itemNameUCase] = v;
        mixinBody.properties[itemName + B] = {
          init : null,
          check : n
        };
        mixinBody.members[s + itemNameUCase] = function(R){

          var Q = this[s + multName]();
          if(!Q)return null;
          var P = Q[R];
          if(typeof P == N)return null;
          return P;
        };
        mixinBody.members[t + multName] = function(X, S, ba){

          var V = wialon.core.Session.getInstance().getItem(this.getId()) || this;
          var T = V[s + multName]();
          var U = false;
          if(X && typeof X == O){

            U = X.skipFlag;
            X = wialon.util.Helper.wrapCallback(X.callback);
          } else {

            X = wialon.util.Helper.wrapCallback(X);
          };
          var Y = null;
          if(S == 0 && T && ba instanceof Array && ba.length == 2){

            var bc = ba[0];
            Y = ba[1];
            var bb = T[bc];
            if(preProcessPropObj){

              Y = preProcessPropObj(Y);
            };
            var W = getMonitoringSensorColorTable(V);
            if(Y && W && W.sensorId === parseInt(bc, 10)){

              fixSensorColorTable(Y, W.ci);
            };
            if(typeof bb == N)bb = null;
            if(Y != null)T[bc] = Y; else if(bb && !U)delete T[bc];;
            if(!U && wialon.util.Json.stringify(Y) != wialon.util.Json.stringify(bb))V.fireDataEvent(E + itemNameUCase, Y, bb);
          };
          X(S, Y, {
            result : ba
          });
        };
        if(ajaxPath && ajaxPath.length){

          if(itemNameUCase == w){

            mixinBody.members[E + itemNameUCase] = function(name, be, bd){

              bd = wialon.util.Helper.wrapCallback(bd);
              return wialon.core.Remote.getInstance().remoteCall(ajaxPath, {
                itemId : this.getId(),
                n : name,
                v : be
              }, qx.lang.Function.bind(this[t + multName], this, bd));
            };
          } else {

            mixinBody.members[c + itemNameUCase] = function(bh, bf, bg){

              bf = wialon.util.Helper.wrapCallback(bf);
              if(bh){

                bh = qx.lang.Object.clone(bh);
                bh.itemId = this.getId();
                bh.id = 0;
                bh.callMode = c;
              };
              if(bh && preProcessUpdateCallObj){

                bh = preProcessUpdateCallObj(bh);
              };
              if(bg)wialon.core.Uploader.getInstance().uploadFiles([bg], ajaxPath, bh, qx.lang.Function.bind(this[t + multName], this, bf), true, 60); else return wialon.core.Remote.getInstance().remoteCall(ajaxPath, bh, qx.lang.Function.bind(this[t + multName], this, bf));
            };
            mixinBody.members[E + itemNameUCase] = function(bl, bj, bi, bk){

              bj = wialon.util.Helper.wrapCallback(bj);
              if(bl){

                bl = qx.lang.Object.clone(bl);
                bl.itemId = this.getId();
                bl.callMode = typeof bi == l ? bi : E;
              };
              if(bl && preProcessUpdateCallObj){

                bl = preProcessUpdateCallObj(bl);
              };
              if(bk)wialon.core.Uploader.getInstance().uploadFiles([bk], ajaxPath, bl, qx.lang.Function.bind(this[t + multName], this, bj), true, 60); else return wialon.core.Remote.getInstance().remoteCall(ajaxPath, bl, qx.lang.Function.bind(this[t + multName], this, bj));
            };
            mixinBody.members[j + itemNameUCase] = function(bo, bm, bn){

              if(typeof bn == N)bn = false;
              bm = wialon.util.Helper.wrapCallback(bm);
              return wialon.core.Remote.getInstance().remoteCall(ajaxPath, {
                itemId : this.getId(),
                id : bo,
                callMode : j
              }, qx.lang.Function.bind(this[t + multName], this, {
                callback : bm,
                skipFlag : bn
              }));
            };
            if(itemNameUCase == r || itemNameUCase == J || itemNameUCase == y || itemNameUCase == I || itemNameUCase == C){

              mixinBody.members[K + itemNameUCase] = function(br, bp, bq){

                if(typeof bq == N)bq = false;
                bp = wialon.util.Helper.wrapCallback(bp);
                return wialon.core.Remote.getInstance().remoteCall(ajaxPath, {
                  itemId : this.getId(),
                  id : br,
                  callMode : q
                }, qx.lang.Function.bind(this[t + multName], this, {
                  callback : bp,
                  skipFlag : bq
                }));
              };
            };
          };
        };
        if(extAjaxPath && extAjaxPath.length){

          mixinBody.members[s + multName + D] = function(bw, bv, bu){

            if(bv && typeof bv == a){

              bu = bv;
              bv = 0;
            };
            bu = wialon.util.Helper.wrapCallback(bu);
            var bt = {
              itemId : this.getId()
            };
            if(bw && (typeof bw.length === u)){

              bt.col = [];
              for(var i = 0;i < bw.length;i++){

                if(typeof bw[i].id == N)bt.col.push(bw[i]); else bt.col.push(bw[i].id);
              };
            };
            bt.flags = bv;
            if(preProcessPropObj){

              var bs = bu;
              bu = function(by, bx){

                if(by || !Array.isArray(bx)){

                  return bs.apply(this, arguments);
                };
                bx = bx.map(function(x){

                  return preProcessPropObj(x);
                });
                return bs.call(this, by, bx);
              };
            };
            return wialon.core.Remote.getInstance().remoteCall(extAjaxPath, bt, bu);
          };
        };
        mixinBody.statics[k + itemNameUCase] = function(bA, bz){

          var bB = getMonitoringSensorColorTable(bA);
          if(bB && bz && bz[bB.sensorId]){

            var bE = bz[bB.sensorId];
            fixSensorColorTable(bE, bB.ci);
          };
          if(preProcessPropObj){

            var bC = {
            };
            for(var bD in bz)if(Object.prototype.hasOwnProperty.call(bz, bD)){

              bC[bD] = preProcessPropObj(bz[bD]);
            };
            bz = bC;
          };
          bA[d + multName](bz);
        };
        mixinBody.statics[G + itemNameUCase] = function(bF, bG){

          bF[t + multName](null, 0, bG);
        };
        var session = wialon.core.Session.getInstance();
        session.registerProperty(propName, qx.lang.Function.bind(mixinBody.statics[k + itemNameUCase], mixinBody));
        session.registerProperty(propName + z, qx.lang.Function.bind(mixinBody.statics[G + itemNameUCase], mixinBody));
        var mixinDef = null;
        eval(M + multName);
        if(qx.Class.hasMixin(clazz, mixinDef))return;
        var propMixin = qx.Mixin.define(F + multName, mixinBody);
        qx.Class.include(clazz, propMixin);
        function getMonitoringSensorColorTable(bK){

          if(multName !== b)return null;
          if(!bK || (typeof bK.getType !== p) || (typeof bK.getCustomProperty !== p))return null;
          var bM = parseInt(bK.getCustomProperty(H), 10);
          if(!bM || !isFinite(bM))return null;
          var bL = bK.getCustomProperty(o);
          if(!bL || (typeof bL !== L))return null;
          var bH = bL.split(f);
          var bJ = {
          };
          var bN = true;
          var bI = bH.every(function(bS){

            var bQ = /^(\d+(?:\.\d+)?|-?Infinity)\s+([0-9a-fA-F]{6,8})(?:\s+(.*?))?\s*$/.exec(bS);
            if(!bQ)return false;
            var bR = parseFloat(bQ[1]);
            if(isNaN(bR))return false;
            var bO = bQ[2];
            if(bO.length === 6){

              bO = parseInt(bO, 16);
            } else if(bO.length === 8){

              bO = parseInt(bO.slice(2), 16);
            };
            if(!isFinite(bO))return false;
            var bP = bQ[3] || g;
            bJ[bR] = {
              c : bO,
              t : bP
            };
            bN = false;
            return true;
          });
          if(!bI)return null;
          if(bN)return null;
          return {
            sensorId : bM,
            ci : bJ
          };
        };
        function fixSensorColorTable(bU, bV){

          if(!bU)return;
          var bT;
          try{

            bT = JSON.parse(bU.c);
          } catch(e) {

            bT = {
            };
          };
          if(typeof bT !== h)bT = {
          };
          if(!bT.ci || bW(bT.ci)){

            bT.ci = bV;
            bU.c = JSON.stringify(bT);
          };
          function bW(bX){

            for(var bY in bX)if(Object.prototype.hasOwnProperty.call(bX, bY)){

              return false;
            };
            return true;
          };
        };
      }
    }
  });
})();
(function(){

  var a = "const0",b = "regtime",c = "sats",d = "lon",f = '_',g = "speed",h = "string",j = 'tag',k = '',l = '^',m = "d",n = ']',o = "-0123456789ABCDEFabcdefx",p = "altitude",q = '(',r = ":",s = ':',t = '*',u = '.',v = "time",w = "lat",x = 'trailer',y = '|',z = "",A = "-0123456789",B = "number",C = ')',D = "n",E = "const",F = "wialon.item.MUnitSensor",G = ' ',H = "unit/calc_last_message",I = 'driver',J = "course",K = '#',L = '/',M = '-',N = "unit/calc_sensors",O = '[',P = "-01234567",Q = "undefined",R = '+';
  qx.Mixin.define(F, {
    members : {
      calculateSensorValue : function(S, T, U){

        if(!S)return wialon.item.MUnitSensor.invalidValue;
        if(typeof T == Q || !T)T = null;
        if(typeof U == Q || !U)U = null;
        return this.__fB(S, T, U, null);
      },
      remoteCalculateLastMessage : function(W, V){

        if(!W || !(W instanceof Array))W = [];
        return wialon.core.Remote.getInstance().remoteCall(H, {
          sensors : W,
          unitId : this.getId()
        }, wialon.util.Helper.wrapCallback(V));
      },
      remoteCalculateMsgs : function(bc, bb, X, ba, Y){

        return wialon.core.Remote.getInstance().remoteCall(N, {
          source : bc,
          unitId : this.getId(),
          indexFrom : bb,
          indexTo : X,
          sensorId : ba
        }, wialon.util.Helper.wrapCallback(Y));
      },
      remoteCalculateFilteredMsgs : function(bf, be, bd, bh, bi, bg){

        return wialon.core.Remote.getInstance().remoteCall(N, {
          source : bf,
          unitId : this.getId(),
          indexFrom : be,
          indexTo : bd,
          sensorId : bh,
          width : bi
        }, wialon.util.Helper.wrapCallback(bg));
      },
      getValue : function(bj, bk){

        if(!bj)return wialon.item.MUnitSensor.invalidValue;
        return this.__fC(bj.p, bk, bj);
      },
      __fA : {
      },
      __fB : function(bu, bv, bl, bs){

        if(!bu)return wialon.item.MUnitSensor.invalidValue;
        var bn = false;
        var br = bu.id;
        if(bs){

          if(bs[br])return wialon.item.MUnitSensor.invalidValue;
        } else {

          bs = new Object;
          bn = true;
        };
        bs[br] = 1;
        var bm = k;
        var self = this;
        var bp = [I, x, j].includes(bu.t);
        if(wialon.util.Sensors.isAvailable && bp){

          bm = wialon.util.Sensors.calculate(bu.p, function(bx){

            var bz = bx.expression;
            if(!bx.math){

              var by = Object.assign({
              }, bu, {
                p : bx.expression
              });
              bz = self.__fE(by, bv, bl, bs);
            };
            if(bz === null){

              return wialon.item.MUnitSensor.invalidValue;
            };
            return String(bz) === String(wialon.item.MUnitSensor.invalidValue) && bu.p !== bx.expression && !bx.isSensorParam ? bx.expression : bz;
          });
          return bm;
        } else {

          bm = this.__fE(bu, bv, bl, bs);
        };
        var bq;
        if(typeof bm === h){

          var bt = bp;
          if(!bt){

            try{

              bq = wialon.util.Json.parse(bu.c);
            } catch(e) {
            };
            bt = bq && !!bq.text_params;
          };
          if(bt){

            return bm;
          } else {

            return wialon.item.MUnitSensor.invalidValue;
          };
        };
        if(bm != wialon.item.MUnitSensor.invalidValue)bm = this.__fD(bu, bm, bq);
        if(bu.vs && bu.vt){

          var bo = this.getSensor(bu.vs);
          if(!bo){

            delete bs[br];
            return wialon.item.MUnitSensor.invalidValue;
          };
          var bw = this.__fB(bo, bv, bl, bs);
          if(bm != wialon.item.MUnitSensor.invalidValue && bw != wialon.item.MUnitSensor.invalidValue){

            if(bu.vt == wialon.item.MUnitSensor.validation.logicalAnd){

              if(bm && bw)bm = 1; else bm = 0;
            } else if(bu.vt == wialon.item.MUnitSensor.validation.noneZero){

              if(!bw){

                delete bs[br];
                bm = wialon.item.MUnitSensor.invalidValue;
              };
            } else if(bu.vt == wialon.item.MUnitSensor.validation.mathAnd){

              bm = Math.ceil(bw) & Math.ceil(bm);
            } else if(bu.vt == wialon.item.MUnitSensor.validation.logicalOr){

              if(bm || bw)bm = 1;
            } else if(bu.vt == wialon.item.MUnitSensor.validation.mathOr){

              bm = Math.ceil(bw) | Math.ceil(bm);
            } else if(bu.vt == wialon.item.MUnitSensor.validation.summarize)bm += bw; else if(bu.vt == wialon.item.MUnitSensor.validation.subtructValidator)bm -= bw; else if(bu.vt == wialon.item.MUnitSensor.validation.subtructValue)bm = bw - bm; else if(bu.vt == wialon.item.MUnitSensor.validation.multiply)bm *= bw; else if(bu.vt == wialon.item.MUnitSensor.validation.divideValidator){

              if(bw)bm /= bw; else bm = wialon.item.MUnitSensor.invalidValue;
            } else if(bu.vt == wialon.item.MUnitSensor.validation.divideValue){

              if(bm)bm = bw / bm; else bm = wialon.item.MUnitSensor.invalidValue;
            };;;;;;;;;;
          } else if(bu.vt == wialon.item.MUnitSensor.validation.replaceOnError){

            if(bm == wialon.item.MUnitSensor.invalidValue)bm = bw;
          } else bm = wialon.item.MUnitSensor.invalidValue;;
        };
        delete bs[br];
        return bm;
      },
      __fC : function(bH, bR, bF){

        if(!bR)return wialon.item.MUnitSensor.invalidValue;
        var bE = wialon.item.MUnitSensor.invalidValue;
        var bK = bR.p;
        var bB = bH.split(r);
        bH = bB[0];
        var bG = 0;
        if(bK && typeof bK[bB[0]] != Q){

          bE = bK[bB[0]];
          if(typeof bE == h){

            var bM = A;
            var bJ = 10;
            if(typeof bB[1] != Q){

              if(bB[1] == 8){

                bM = P;
                bJ = bB[1];
              } else if(bB[1] == 16){

                bM = o;
                bJ = bB[1];
              };
              if(wialon.util.String.strspn(bE, bM) == bE.length){

                if(bM.length - 1 !== 10 || BigInt(Number.MAX_SAFE_INTEGER) >= BigInt(bE)){

                  bE = parseInt(bE, bJ);
                  bB = [];
                };
              } else {

                bE = wialon.item.MUnitSensor.invalidValue;
              };
            };
          };
        } else if(bB[1] == m){

          bG = 1;
        };
        var bI = bR.pos;
        if(bE == wialon.item.MUnitSensor.invalidValue){

          if(bH == g){

            if(!bI || (bI && bI._noPosition))return wialon.item.MUnitSensor.invalidValue;
            bE = bR.pos.s;
          } else if(bH == c){

            if(!bI || (bI && bI._noPosition))return wialon.item.MUnitSensor.invalidValue;
            bE = bR.pos.sc;
          } else if(bH == p){

            if(!bI || (bI && bI._noPosition))return wialon.item.MUnitSensor.invalidValue;
            bE = bR.pos.z;
          } else if(bH == J){

            if(!bI || (bI && bI._noPosition))return wialon.item.MUnitSensor.invalidValue;
            bE = bR.pos.c;
          } else if(bH == w){

            if(!bI || (bI && bI._noPosition))return wialon.item.MUnitSensor.invalidValue;
            bE = bR.pos.y;
          } else if(bH == d){

            if(!bI || (bI && bI._noPosition))return wialon.item.MUnitSensor.invalidValue;
            bE = bR.pos.x;
          } else if(/^in\d{0,2}$/.test(bH)){

            if(!(bR.f & 0x2))return wialon.item.MUnitSensor.invalidValue;
            var bC = parseInt(bH.substr(2), 10);
            if(isNaN(bC) || bC < 1 || bC > 32)return bR.i;
            var bP = 1 << (bC - 1);
            bE = (bR.i & bP) ? 1 : 0;
          } else if(/^out\d{0,2}$/.test(bH)){

            if(!(bR.f & 0x4))return wialon.item.MUnitSensor.invalidValue;
            var bC = parseInt(bH.substr(3), 10);
            if(isNaN(bC) || bC < 1 || bC > 32)return bR.o;
            var bP = 1 << (bC - 1);
            bE = (bR.o & bP) ? 1 : 0;
          } else if(/^const-?(?:\d+(?:\.\d+)?|\.\d+)$/.test(bH)){

            bE = parseFloat(bH.substr(5));
          } else if(bH === v){

            bE = bR.t;
          } else if(bH === b){

            if(typeof bR.rt === B){

              bE = bR.rt;
            };
          };;;;;;;;;;
        };
        if(bG == 1 && bE != wialon.item.MUnitSensor.invalidValue){

          var bQ = new Date(bE * 1000);
          var bD = Date.UTC(bQ.getFullYear(), 0, 0);
          var bO = bQ.getTime() - bD;
          var bA = 1000 * 60 * 60 * 24;
          bE = Math.floor(bO / bA);
        } else if(bB.length > 1 && bE != wialon.item.MUnitSensor.invalidValue){

          var bN = parseInt(bB[1], 10) - 1;
          if(bN < 0){

            return bE;
          };
          var bL;
          try{

            bL = BigInt(bE) & (BigInt(1) << BigInt(bN));
          } catch(e) {

            console.warn(e);
          };
          bE = bL ? 1 : 0;
        };
        return bE;
      },
      __fD : function(bX, bU, bV){

        if(!bX || isNaN(bU))return wialon.item.MUnitSensor.invalidValue;
        var bW = wialon.item.MUnitSensor.invalidValue;
        var bT = wialon.item.MUnitSensor.invalidValue;
        if(!bV){

          try{

            bV = wialon.util.Json.parse(bX.c);
          } catch(e) {
          };
        };
        if(bV && typeof bV.lower_bound == B)bW = bV.lower_bound;
        if(bV && typeof bV.upper_bound == B)bT = bV.upper_bound;
        if(bW != wialon.item.MUnitSensor.invalidValue && bT != wialon.item.MUnitSensor.invalidValue && bT <= bW){

          bW = wialon.item.MUnitSensor.invalidValue;
          bT = wialon.item.MUnitSensor.invalidValue;
        };
        if(!(bX.f & wialon.item.MUnitSensor.flags.boundsAfterCalc) && ((bW != wialon.item.MUnitSensor.invalidValue && bU < bW) || (bT != wialon.item.MUnitSensor.invalidValue && bU >= bT)))return wialon.item.MUnitSensor.invalidValue;
        var bS = bU;
        for(var i = 0;i < bX.tbl.length;i++){

          if(i != 0 && bX.tbl[i].x > bU)break;
          bS = parseFloat(bX.tbl[i].a) * parseFloat(bU) + parseFloat(bX.tbl[i].b);
        };
        if((bX.f & wialon.item.MUnitSensor.flags.boundsAfterCalc) && ((bW != wialon.item.MUnitSensor.invalidValue && bS < bW) || (bT != wialon.item.MUnitSensor.invalidValue && bS >= bT)))return wialon.item.MUnitSensor.invalidValue;
        return bS;
      },
      __fE : function(ce, cg, cc, cd){

        if(!ce || typeof ce.p != h || !ce.p.length)return wialon.item.MUnitSensor.invalidValue;
        var cb = this.__fA[ce.p];
        if(typeof cb == Q){

          cb = this.__fF(ce.p);
          if(!cb.length)return wialon.item.MUnitSensor.invalidValue;
          this.__fA[ce.p] = cb;
        };
        var cf = [];
        var bY = 0;
        for(var i = 0;i < cb.length;i++){

          var ca = cb[i];
          var ch = cf.length;
          if(ca[0] == t && ch > 1){

            if((wialon.item.MUnitSensor.invalidValue == cf[ch - 2]) || (wialon.item.MUnitSensor.invalidValue == cf[ch - 1]))cf[ch - 2] = wialon.item.MUnitSensor.invalidValue; else cf[ch - 2] = cf[ch - 2] * cf[ch - 1];
            cf.pop();
          } else if(ca[0] == L && ch > 1){

            if((wialon.item.MUnitSensor.invalidValue == cf[ch - 2]) || (wialon.item.MUnitSensor.invalidValue == cf[ch - 1]) || (cf[ch - 1] == 0))cf[ch - 2] = wialon.item.MUnitSensor.invalidValue; else cf[ch - 2] = cf[ch - 2] / cf[ch - 1];
            cf.pop();
          } else if(ca[0] == R && ch > 1){

            if((wialon.item.MUnitSensor.invalidValue == cf[ch - 2]) || (wialon.item.MUnitSensor.invalidValue == cf[ch - 1]))cf[ch - 2] = wialon.item.MUnitSensor.invalidValue; else cf[ch - 2] = cf[ch - 2] + cf[ch - 1];
            cf.pop();
          } else if(ca[0] == M){

            if(ch > 1){

              if((wialon.item.MUnitSensor.invalidValue == cf[ch - 2]) || (wialon.item.MUnitSensor.invalidValue == cf[ch - 1]))cf[ch - 2] = wialon.item.MUnitSensor.invalidValue; else cf[ch - 2] = cf[ch - 2] - cf[ch - 1];
              cf.pop();
            } else if(ch == 1)cf[ch - 1] = -cf[ch - 1];;
          } else if(ca[0] == l && ch > 1){

            if((wialon.item.MUnitSensor.invalidValue == cf[ch - 2]) || (wialon.item.MUnitSensor.invalidValue == cf[ch - 1]))cf[ch - 2] = wialon.item.MUnitSensor.invalidValue; else cf[ch - 2] = Math.pow(cf[ch - 2], cf[ch - 1]);
            cf.pop();
          } else if(ca[0] == y && ch > 1){

            if(wialon.item.MUnitSensor.invalidValue == cf[ch - 2])cf[ch - 2] = cf[ch - 1];
            cf.pop();
          } else {

            if(ca[0] == O){

              var ce = wialon.util.Helper.searchObject(this.getSensors(), D, ca.slice(1));
              if(!ce){

                cf.push(wialon.item.MUnitSensor.invalidValue);
                continue;
              };
              bY = this.__fB(ce, cg, cc, cd);
              cf.push(bY);
            } else {

              bY = wialon.item.MUnitSensor.invalidValue;
              if(ca[0] == K)bY = this.__fC(ca.slice(1), cc, ce); else bY = this.__fC(ca, cg, ce);
              if(typeof (bY) == h)return bY;
              cf.push(bY);
            };
          };;;;;
        };
        return cf.length == 1 ? cf[0] : wialon.item.MUnitSensor.invalidValue;
      },
      __fF : function(cq){

        var cm = cq.length;
        var ct = z;
        var cr = [];
        var cn = [];
        var cu = 0;
        var cp = false;
        var cv = false;
        for(var i = 0;i < cm;i++){

          if(cq[i] == G){

            if(!cu)continue;
          } else if(cq[i] == O)cp = true; else if(cq[i] == n)cp = false;;;
          var cs = cq[i].charCodeAt(0);
          var cl = (cs > 47 && cs < 58) || (cs > 64 && cs < 91) || (cs > 96 && cs < 123);
          var ci = cp || cl || cq[i] === f || cq[i] === K || cq[i] === u || cq[i] === s || cq[i] === G || (cq[i] === M && ct === E);
          if(ci){

            ct += cq[i];
            cu++;
            if(i < cm - 1)continue;
          };
          if(cu && this.__fG(ct) == -1){

            ct = ct.replace(/\s+$/, k);
            cv = false;
            cn.push(ct);
          };
          ct = cq[i];
          var ck = this.__fG(ct);
          if(ck != -1){

            if(cq[i] == M && cv)cn.push(a);
            if(cq[i] == q)cv = true; else cv = false;
            if(cr.length){

              if(cq[i] == q)cr.push(ct); else if(cq[i] == C){

                while(cr.length){

                  var co = cr[cr.length - 1];
                  cr.pop();
                  if(co[0] != q)cn.push(co); else break;
                };
              } else {

                while(cr.length){

                  var co = cr[cr.length - 1];
                  var cj = this.__fG(co);
                  if(cj >= ck){

                    if(co[0] != q && co[0] != C)cn.push(cr[cr.length - 1]);
                    cr.pop();
                  } else break;
                };
                cr.push(ct);
              };
            } else cr.push(ct);
          };
          ct = z;
          cu = 0;
        };
        while(cr.length){

          var co = cr[cr.length - 1];
          if(co[0] != C && co[0] != q)cn.push(co);
          cr.pop();
        };
        if(!cn.length)cn.push(cq);
        return cn;
      },
      __fG : function(cw){

        if(cw == z)return -1;
        switch(cw[0]){case y:
        return 5;case l:
        return 4;case t:case L:
        return 3;case M:case R:
        return 2;case C:
        return 1;case q:
        return 0;};
        return -1;
      }
    },
    statics : {
      invalidValue : -348201.3876,
      flags : {
        overflow : 0x20,
        boundsAfterCalc : 0x40
      },
      validation : {
        logicalAnd : 0x01,
        logicalOr : 0x02,
        mathAnd : 0x03,
        mathOr : 0x04,
        summarize : 0x05,
        subtructValidator : 0x06,
        subtructValue : 0x07,
        multiply : 0x08,
        divideValidator : 0x09,
        divideValue : 0x0A,
        noneZero : 0x0B,
        replaceOnError : 0x0C
      }
    }
  });
})();
(function(){

  var c = ': ',d = "+",f = 'dec',g = "^",h = "(.){1,",j = '',k = '+',m = "static",n = 'function',o = '^',p = 'invalid value',q = ',',r = "}",s = '*',t = 'Argument is invalid',u = 'Valid from 20 to 7E',v = 'invalid hex value:',w = '0x',x = 'g',y = 'rpn convert: invalid expression',z = 'valuemarker',A = ' ',B = 'Value is null',C = "*$",D = 'hex',E = '/',F = '0',G = '-',H = 'hextoascii',I = "wialon.util.Sensors";
  var M = /([a-zA-Z]{0,})\(([^\(\)]{0,})\)/gi;
  var P = [G, k];
  var K = /'(.)+'$/;
  var N = z;
  var J = (this && this.__gm) || function(R, Q, T){

    if(T || arguments.length === 2)for(var i = 0,l = Q.length,S;i < l;i++){

      if(S || !(i in Q)){

        if(!S)S = Array.prototype.slice.call(Q, 0, i);
        S[i] = Q[i];
      };
    };
    return R.concat(S || Array.prototype.slice.call(Q));
  };
  var L = function(name){

    var U = Array.prototype.slice.call(arguments, 1);
    throw new Error(name + c + U.join(A));
  };
  var O = {
    number : function(V){

      return +V;
    },
    split : function(X, W){

      if(!X){

        return [];
      };
      return X.match(new RegExp(h.concat(W || 1, r), x));
    },
    sum : function(Y){

      var ba = [];
      for(var bb = 1;bb < arguments.length;bb++){

        ba[bb - 1] = arguments[bb];
      };
      return J([], ba, true).reduce(function(bc, i){

        return (bc + O.number(i));
      }, +Y);
    },
    fill : function(be, bd){

      return (Array.from(new Array(O.number(be))).map(function(){

        return bd;
      }).join(j));
    },
    pow : function(bg, bf){

      if(bf === void 0){

        bf = 2;
      };
      return Math.pow(bg, bf || 2);
    },
    sqrt : function(bh){

      return Math.sqrt(bh);
    },
    '-' : function(a, b){

      return O.number(a) - O.number(b);
    },
    '+' : function(a, b){

      return O.number(a) + O.number(b);
    },
    ltrim : function(bj, bi){

      return bj.replace(new RegExp(g.concat(bi || F, d), x), j);
    },
    rtrim : function(bl, bk){

      return bl.replace(new RegExp((bk || F).concat(C), x), j);
    },
    lower : function(bm){

      return bm.toLowerCase();
    },
    upper : function(bn){

      return bn.toUpperCase();
    },
    reverse : function(bo){

      return O.split(bo, 1).reverse().join(j);
    },
    reverseb : function(bp){

      bp = O.lfill(bp, bp.length + bp.length % 2, 0);
      return O.split(bp, 2).reverse().join(j);
    },
    lfill : function(bq, br, symb = 0){

      return (O.fill(br, symb) + bq).slice(-Math.max(O.len(bq), br));
    },
    rfill : function(bs, bt, symb = 0){

      return O.substr(bs + (O.fill(bt, symb)), 0, Math.max(O.len(bs), O.number(bt)));
    },
    sequence : function(bu){

      var bw = [];
      for(var bv = 1;bv < arguments.length;bv++){

        bw[bv - 1] = arguments[bv];
      };
      return bw.map(function(bx){

        return bu[bx] || F;
      }).join(j);
    },
    hex : function(bz){

      var by = O.number(bz);
      return by ? by.toString(16) : L(D, p, bz);
    },
    hextoascii : function(bC){

      var bB = bC.toString();
      var bE = j;
      var bD = O.split(bB, 2);
      for(var i = 0;i < bD.length;i += 1){

        var bA = O.dec(bD[i]);
        if(bA < 32 || bA > 126){

          L(H, v + bD[i], u);
        };
        bE += String.fromCharCode(bA);
      };
      return bE;
    },
    dec : function(bH){

      var bF = w + bH;
      var bG = parseInt(bF, 16);
      return isNaN(Number(bF)) ? L(f, p, bH) : bG;
    },
    concat : function(){

      var bI = [];
      for(var bJ = 0;bJ < arguments.length;bJ++){

        bI[bJ] = arguments[bJ];
      };
      return J([], bI, true).join(j);
    },
    substr : function(bM, bK, bL){

      return bM.substr(O.number(bK), O.number(bL));
    },
    len : function(bN){

      return bN.length;
    }
  };
  qx.Class.define(I, {
    type : m,
    statics : {
      operands : O,
      isAvailable : 1,
      debug : 0,
      getValue : function(bT, bO, bR){

        var bQ = new wialon.util.Rpn({
          skipOperators : [o, E, s]
        });
        var bS = bT.match(bQ.mathregexp);
        if(!bS && bT.match(K)){

          return bT.replace(/'/g, j);
        };
        var bU = bT;
        if(typeof bO === n && !isFinite(bT)){

          bT = bO({
            expression : bU,
            math : bS,
            isSensorParam : bR
          });
        };
        if(bT && bS){

          var bP = bQ.convert(bT);
          if(bP){

            return bQ.parse(bP);
          } else {

            L(y);
          };
        };
        return bT;
      },
      calculate : function(){

        var bV = j;
        try{

          bV = this.calculateExpression.apply(this, arguments);
        } catch(e) {

          if(wialon.util.Sensors.debug){

            console.error(e.message);
          };
          bV = null;
        };
        return bV;
      },
      calculateExpression : function(cc, bW){

        var cb = cc;
        var bX = this.operands;
        var ca = this.getValue;
        while(cb){

          var bY = Array.from(cb.matchAll(M));
          if(!bY.length){

            if(cb.includes(N)){

              cb = cb.replace(N, j);
            };
            cb = ca(cb, bW);
            break;
          };
          bY.forEach(function(cg){

            var cd = cg[0];
            var name = cg[1];
            var ce = cg[2];
            var cf = F;
            if(P.includes(name)){

              ce = cd.replaceAll(name, q);
            };
            var ch = ce.split(q).map(function(i){

              return i.trim();
            });
            if(bX[name]){

              ch = ch.map(function(i, ci){

                var ck = /\'.*\'/.test(i) || i.includes(N);
                var cl = /\[.*\]/.test(i);
                var cm = (ci === 0 || cl) && !ck;
                var cj = i;
                if(i.includes(N)){

                  cj = i.replace(N, j);
                };
                return ca(cj, bW, cm);
              });
              if(ch.includes(wialon.item.MUnitSensor.invalidValue)){

                throw Error(t);
              };
              cf = bX[name].apply(null, ch);
              if(cf === null){

                throw Error(B);
              };
            } else if(ch.length === 1){

              ch = ch.map(function(i){

                return ca(i, bW);
              });
              cf = ch[0];
            };
            if(wialon.util.Sensors.debug){

              console.log(cd, cf);
            };
            cb = cb.replace(cd, cf + N);
          });
        };
        return cb;
      }
    }
  });
})();
(function(){

  var a = '(',b = ']))([',c = '(?:(?<![',d = ' ',e = '^*/+-',f = '-',g = "wialon.util.Rpn",h = '',j = 'left',k = '\(\)])',l = '(\\d{1,}\\s?[',m = '\\',n = ')',o = '])(\\s?\\d{1,})',p = '+',q = 'right';
  var r = function(s){

    return Object.keys(s).map(function(v){

      return m + v;
    }).join(h);
  };
  qx.Class.define(g, {
    extend : qx.core.Object,
    construct : function(t){

      var self = this;
      qx.core.Object.call(this);
      if(t && t.skipOperators){

        t.skipOperators.forEach(function(u){

          if(u in self.operators){

            delete self.operators[u];
          };
        });
      };
      this.operands = {
        '*' : function(x, y){

          return x * y;
        },
        '/' : function(x, y){

          return x / y;
        }
      };
      [p, f].forEach(function(w){

        if(w in wialon.util.Sensors.operands){

          self.operands[w] = wialon.util.Sensors.operands[w];
        };
      });
      this.preparedOperands = r(this.operators);
      this.mathregexp = new RegExp(l + this.preparedOperands + o);
    },
    members : {
      operators : {
        '^' : {
          priority : 4,
          associativity : q
        },
        '/' : {
          priority : 3,
          associativity : j
        },
        '*' : {
          priority : 3,
          associativity : j
        },
        '+' : {
          priority : 2,
          associativity : j
        },
        '-' : {
          priority : 2,
          associativity : j
        }
      },
      clean : function(z){

        return z.filter(function(A){

          return A !== h;
        });
      },
      isNumeric : function(B){

        return !isNaN(parseFloat(B)) && isFinite(B);
      },
      convert : function(D){

        var E = h;
        var C = [];
        D = D.replace(/\s+/g, h);
        D = this.clean(D.split(new RegExp(c + this.preparedOperands + b + this.preparedOperands + k)));
        for(var i = 0;i < D.length;i++){

          var F = D[i];
          if(this.isNumeric(F)){

            E += F + d;
          } else if(e.indexOf(F) !== -1){

            var H = F;
            var G = C[C.length - 1];
            while(e.indexOf(G) !== -1 && ((this.operators[H].associativity === j && this.operators[H].priority <= this.operators[G].priority) || (this.operators[H].associativity === q && this.operators[H].priority < this.operators[G].priority))){

              E += C.pop() + d;
              G = C[C.length - 1];
            };
            C.push(H);
          } else if(F === a){

            C.push(F);
          } else if(F === n){

            while(C[C.length - 1] !== a){

              E += C.pop() + d;
            };
            C.pop();
          } else {

            return null;
          };;;
        };
        while(C.length > 0){

          E += C.pop() + d;
        };
        return E;
      },
      parse : function(I){

        var J = I.trim().split(d).map(function(i){

          return Number(i) ? Number(i) : i;
        });
        var K = [];
        var self = this;
        J.forEach(function(L){

          K.push(self.operands[L] ? self.operands[L].apply(null, K.splice(-2)) : L);
        });
        return K.pop();
      }
    }
  });
})();
(function(){

  var a = "wialon.util.String",b = '',c = "null",d = 'x',e = 'c',f = "",g = 'b',h = 'X',k = 'o',m = '-',n = 'f',o = ' ',p = "x",q = '%',r = ":",s = 's',t = 'd',u = "0",v = "undefined",w = "string",x = "static";
  qx.Class.define(a, {
    type : x,
    statics : {
      wrapString : function(y){

        if(typeof y == v || !y.length)y = f;
        return y;
      },
      xor : function(A, B){

        var z = [];
        for(var i = 0;i < A.length;i++)z.push(A.charCodeAt(i) ^ B.charCodeAt(i % B.length));
        return z.join(r);
      },
      unxor : function(D, E){

        var C = f;
        if(D == f)return D;
        D = D.split(r);
        for(var i = 0;i < D.length;i++)C += String.fromCharCode(D[i] ^ E.charCodeAt(i % E.length));
        return C;
      },
      isValidText : function(F){

        if(F === c)return false;
        var G = f + F;
        var H = /([\"\{\}\\])/i;
        return (G != null && typeof G === w && (!G.length || !H.test(G)));
      },
      isValidName : function(name, J){

        var K = f + name;
        if(J == null)return (K != null && this.isValidText(K) && K.length > 0 && K[0] != o && K[K.length - 1] != o);
        var L = (J.min != null ? J.min : 1);
        var I = (J.max != null ? J.max : 4096);
        return (K != null && this.isValidText(K) && K.length >= L && K.length <= I && K[0] != o && K[K.length - 1] != o);
      },
      isValidEmail : function(M){

        return (/^[^\s@]+@[^\s@]+\.[^\s@]{2,64}$/i).test(M);
      },
      isValidPhone : function(N){

        var O = f + N;
        return (O != null && this.isValidText(O) && (/^[+]{1,1}[\d]{7,16}$/i).test(O));
      },
      stringMatchTemplates : function(R, P, Q){

        if(typeof R != w || !R.length || !(P instanceof Array))return true;
        if(typeof Q != w || Q.length != 1)Q = p;
        for(var i = 0;i < P.length;i++){

          var S = P[i];
          if(typeof S != w || S.length != R.length)continue;
          var T = true;
          for(var j = 0;j < R.length;j++){

            if(R[j] != S[j] && S[j].toLowerCase() != Q[0]){

              T = false;
              break;
            };
          };
          if(T)return true;
        };
        return false;
      },
      sprintf : function(){

        if(typeof arguments == v){

          return null;
        };
        if(arguments.length < 1){

          return null;
        };
        if(typeof arguments[0] != w){

          return null;
        };
        if(typeof RegExp == v){

          return null;
        };
        var V = arguments[0];
        var ba = new RegExp(/(%([%]|(\-)?(\+|\x20)?(0)?(\d+)?(\.(\d+)?)?([bcdfosxX])))/g);
        var W = new Array();
        var be = new Array();
        var X = 0;
        var Y = 0;
        var bc = 0;
        var bg = 0;
        var bd = b;
        var bf = null;
        while(bf = ba.exec(V)){

          if(bf[9]){

            X += 1;
          };
          Y = bg;
          bc = ba.lastIndex - bf[0].length;
          be[be.length] = V.substring(Y, bc);
          bg = ba.lastIndex;
          W[W.length] = {
            match : bf[0],
            left : bf[3] ? true : false,
            sign : bf[4] || b,
            pad : bf[5] || o,
            min : bf[6] || 0,
            precision : bf[8],
            code : bf[9] || q,
            negative : parseFloat(arguments[X]) < 0 ? true : false,
            argument : String(arguments[X])
          };
        };
        be[be.length] = V.substring(bg);
        if(W.length == 0){

          return V;
        };
        if((arguments.length - 1) < X){

          return null;
        };
        var U = null;
        var bf = null;
        var i = null;
        var bb = null;
        for(i = 0;i < W.length;i++){

          if(W[i].code == q){

            bb = q;
          } else if(W[i].code == g){

            W[i].argument = String(Math.abs(parseInt(W[i].argument)).toString(2));
            bb = this.__fH(W[i], true);
          } else if(W[i].code == e){

            W[i].argument = String(String.fromCharCode(parseInt(Math.abs(parseInt(W[i].argument)))));
            bb = this.__fH(W[i], true);
          } else if(W[i].code == t){

            W[i].argument = String(Math.abs(parseInt(W[i].argument)));
            bb = this.__fH(W[i]);
          } else if(W[i].code == n){

            W[i].argument = String(Math.abs(parseFloat(W[i].argument)).toFixed(W[i].precision < 15 ? W[i].precision : 6));
            bb = this.__fH(W[i]);
          } else if(W[i].code == k){

            W[i].argument = String(Math.abs(parseInt(W[i].argument)).toString(8));
            bb = this.__fH(W[i]);
          } else if(W[i].code == s){

            W[i].argument = W[i].argument.substring(0, W[i].precision ? W[i].precision : W[i].argument.length);
            bb = this.__fH(W[i], true);
          } else if(W[i].code == d){

            W[i].argument = String(Math.abs(parseInt(W[i].argument)).toString(16));
            bb = this.__fH(W[i]);
          } else if(W[i].code == h){

            W[i].argument = String(Math.abs(parseInt(W[i].argument)).toString(16));
            bb = this.__fH(W[i]).toUpperCase();
          } else {

            bb = W[i].match;
          };;;;;;;;
          bd += be[i];
          bd += bb;
        };
        bd += be[i];
        return bd;
      },
      strspn : function(bi, bh){

        if(typeof bi != w || typeof bh != w)return 0;
        var i,j;
        for(i = 0;i < bi.length;i++){

          for(j = 0;j < bh.length;j++)if(bh[j] == bi[i])break;;
          if(j == bh.length && bh[j] != bi[i])break;
        };
        return i;
      },
      __fH : function(bl, bj){

        if(bj){

          bl.sign = b;
        } else {

          bl.sign = bl.negative ? m : bl.sign;
        };
        var l = bl.min - bl.argument.length + 1 - bl.sign.length;
        var bk = new Array(l < 0 ? 0 : l).join(bl.pad);
        if(!bl.left){

          if(bl.pad == u || bj){

            return bl.sign + bk + bl.argument;
          } else {

            return bk + bl.sign + bl.argument;
          };
        } else {

          if(bl.pad == u || bj){

            return bl.sign + bl.argument + bk.replace(/0/g, o);
          } else {

            return bl.sign + bl.argument + bk;
          };
        };
      }
    }
  });
})();
(function(){

  var a = "wialon.item.MUnitTripDetector",b = "unit/get_trip_detector",c = "unit/get_trips",d = "unit/update_trip_detector";
  qx.Mixin.define(a, {
    members : {
      getTripDetector : function(e){

        return wialon.core.Remote.getInstance().remoteCall(b, {
          itemId : this.getId()
        }, wialon.util.Helper.wrapCallback(e));
      },
      getTrips : function(g, i, h, f){

        return wialon.core.Remote.getInstance().remoteCall(c, {
          itemId : this.getId(),
          timeFrom : g,
          timeTo : i,
          msgsSource : h
        }, wialon.util.Helper.wrapCallback(f));
      },
      updateTripDetector : function(r, n, k, o, l, m, j, q, p){

        return wialon.core.Remote.getInstance().remoteCall(d, {
          itemId : this.getId(),
          type : r,
          gpsCorrection : n,
          minSat : k,
          minMovingSpeed : o,
          minStayTime : l,
          maxMessagesDistance : m,
          minTripTime : j,
          minTripDistance : q
        }, wialon.util.Helper.wrapCallback(p));
      }
    },
    statics : {
      tripDetectionType : {
        gpsSpeed : 1,
        gpsPosition : 2,
        ignitionSensor : 3,
        mileageSensorAbsolute : 4,
        mileageSensorRelative : 5
      }
    }
  });
})();
(function(){

  var a = "wialon.item.MUnitMessagesFilter",b = "undefined",c = "unit/get_messages_filter",d = "unit/update_messages_filter",e = "object";
  qx.Mixin.define(a, {
    members : {
      getMessagesFilter : function(f){

        return wialon.core.Remote.getInstance().remoteCall(c, {
          itemId : this.getId()
        }, wialon.util.Helper.wrapCallback(f));
      },
      updateMessagesFilter : function(l, h, k, g, i, n, j){

        var m;
        if(typeof l === e){

          m = l;
          j = h;
        } else {

          if(typeof j == b){

            j = n;
            n = 0;
          };
          m = {
            enabled : l,
            skipInvalid : h,
            minSats : k,
            maxHdop : g,
            maxSpeed : i,
            lbsCorrection : n
          };
        };
        m.itemId = this.getId();
        return wialon.core.Remote.getInstance().remoteCall(d, m, wialon.util.Helper.wrapCallback(j));
      }
    }
  });
})();
(function(){

  var a = "unit/registry_maintenance_event",b = "",c = "wialon.item.MUnitEventRegistrar",d = "unit/registry_status_event",e = "unit/registry_insurance_event",f = "unit/registry_custom_event",g = "unit/registry_fuel_filling_event";
  qx.Mixin.define(c, {
    members : {
      registryStatusEvent : function(h, k, j, i){

        return wialon.core.Remote.getInstance().remoteCall(d, {
          date : h,
          description : k,
          params : j,
          itemId : this.getId()
        }, wialon.util.Helper.wrapCallback(i));
      },
      registryInsuranceEvent : function(n, m, o, l){

        return wialon.core.Remote.getInstance().remoteCall(e, {
          type : m,
          case_num : o,
          description : n,
          itemId : this.getId()
        }, wialon.util.Helper.wrapCallback(l));
      },
      registryCustomEvent : function(q, r, x, y, s, t, u){

        var p = {
          date : q,
          x : x,
          y : y,
          description : r,
          violation : s,
          itemId : this.getId()
        };
        if(u && u.nt && u.nct){

          p.nt = u.nt + b;
          p.nct = u.nct + b;
        };
        return wialon.core.Remote.getInstance().remoteCall(f, p, wialon.util.Helper.wrapCallback(t));
      },
      registryFuelFillingEvent : function(w, z, x, y, location, A, C, v, B){

        return wialon.core.Remote.getInstance().remoteCall(g, {
          date : w,
          volume : A,
          cost : C,
          location : location,
          deviation : v,
          x : x,
          y : y,
          description : z,
          itemId : this.getId()
        }, wialon.util.Helper.wrapCallback(B));
      },
      registryMaintenanceEvent : function(F, G, x, y, location, D, K, J, E, L, H, I){

        return wialon.core.Remote.getInstance().remoteCall(a, {
          date : F,
          info : D,
          duration : K,
          cost : J,
          location : location,
          x : x,
          y : y,
          description : G,
          mileage : E,
          eh : L,
          done_svcs : H,
          itemId : this.getId()
        }, wialon.util.Helper.wrapCallback(I));
      }
    }
  });
})();
(function(){

  var a = "wialon.item.MUnitReportSettings",b = "unit/get_report_settings",c = "unit/update_report_settings";
  qx.Mixin.define(a, {
    members : {
      getReportSettings : function(d){

        return wialon.core.Remote.getInstance().remoteCall(b, {
          itemId : this.getId()
        }, wialon.util.Helper.wrapCallback(d));
      },
      updateReportSettings : function(f, e){

        return wialon.core.Remote.getInstance().remoteCall(c, {
          itemId : this.getId(),
          params : f
        }, wialon.util.Helper.wrapCallback(e));
      }
    }
  });
})();
(function(){

  var a = "wialon.item.MUnitDriveRankSettings",b = "unit/get_accelerometers_calibration",c = "unit/update_drive_rank_settings",d = "unit/update_accelerometers_calibration",e = "unit/get_drive_rank_settings";
  qx.Mixin.define(a, {
    members : {
      getDriveRankSettings : function(f){

        return wialon.core.Remote.getInstance().remoteCall(e, {
          itemId : this.getId()
        }, wialon.util.Helper.wrapCallback(f));
      },
      updateDriveRankSettings : function(h, g){

        return wialon.core.Remote.getInstance().remoteCall(c, {
          itemId : this.getId(),
          driveRank : h
        }, wialon.util.Helper.wrapCallback(g));
      },
      getAccelerometersCalibration : function(i){

        return wialon.core.Remote.getInstance().remoteCall(b, {
          itemId : this.getId()
        }, wialon.util.Helper.wrapCallback(i));
      },
      updateAccelerometersCalibration : function(k, l, j){

        return wialon.core.Remote.getInstance().remoteCall(d, {
          itemId : this.getId(),
          timeFrom : k,
          timeTo : l
        }, wialon.util.Helper.wrapCallback(j));
      },
      resetAccelerometersCalibration : function(m){

        return wialon.core.Remote.getInstance().remoteCall(d, {
          itemId : this.getId(),
          reset : 1
        }, wialon.util.Helper.wrapCallback(m));
      }
    }
  });
})();
(function(){

  var a = "function",b = "unit/update_fuel_rates_params",c = "unit/update_fuel_math_params",d = "unit/update_fuel_impulse_params",e = "wialon.item.MUnitFuelSettings",f = "unit/update_fuel_calc_types",g = "unit/get_fuel_settings",h = "unit/update_fuel_level_params",i = "object";
  qx.Mixin.define(e, {
    members : {
      getFuelSettings : function(j){

        return wialon.core.Remote.getInstance().remoteCall(g, {
          itemId : this.getId()
        }, wialon.util.Helper.wrapCallback(j));
      },
      updateFuelCalcTypes : function(l, k){

        return wialon.core.Remote.getInstance().remoteCall(f, {
          itemId : this.getId(),
          calcTypes : l
        }, wialon.util.Helper.wrapCallback(k));
      },
      updateFuelLevelParams : function(o, n){

        var m = {
        };
        if(o && typeof o == i){

          m = o;
        } else if(arguments.length > 2){

          m.flags = arguments[0];
          m.ignoreStayTimeout = arguments[1];
          m.minFillingVolume = arguments[2];
          m.minTheftTimeout = arguments[3];
          m.minTheftVolume = arguments[4];
          m.filterQuality = arguments[5];
          if(arguments.length > 7){

            m.fillingsJoinInterval = arguments[6];
            m.theftsJoinInterval = arguments[7];
            n = arguments[8];
          } else {

            m.fillingsJoinInterval = 300;
            m.theftsJoinInterval = 300;
            n = arguments[6];
          };
        };
        return wialon.core.Remote.getInstance().remoteCall(h, {
          itemId : this.getId(),
          flags : m.flags,
          ignoreStayTimeout : m.ignoreStayTimeout,
          minFillingVolume : m.minFillingVolume,
          minTheftTimeout : m.minTheftTimeout,
          minTheftVolume : m.minTheftVolume,
          filterQuality : m.filterQuality,
          fillingsJoinInterval : m.fillingsJoinInterval,
          theftsJoinInterval : m.theftsJoinInterval,
          extraFillingTimeout : m.extraFillingTimeout
        }, wialon.util.Helper.wrapCallback(n));
      },
      updateFuelConsMath : function(s, r){

        var t,p,q;
        if(arguments.length >= 4){

          t = arguments[0];
          p = arguments[1];
          q = arguments[2];
          r = arguments[4];
        } else if(s && typeof s === i){

          t = s.idling , p = s.urban;
          q = s.suburban;
        } else {

          if(typeof r === a)r(4);
          return;
        };
        return wialon.core.Remote.getInstance().remoteCall(c, {
          itemId : this.getId(),
          idling : t,
          urban : p,
          suburban : q
        }, wialon.util.Helper.wrapCallback(r));
      },
      updateFuelConsRates : function(u, w, v, y, x, A, C, B, z){

        return wialon.core.Remote.getInstance().remoteCall(b, {
          itemId : this.getId(),
          idlingSummer : u,
          idlingWinter : w,
          consSummer : v,
          consWinter : y,
          winterMonthFrom : x,
          winterDayFrom : A,
          winterMonthTo : C,
          winterDayTo : B
        }, wialon.util.Helper.wrapCallback(z));
      },
      updateFuelConsImpulse : function(D, E, F){

        return wialon.core.Remote.getInstance().remoteCall(d, {
          itemId : this.getId(),
          maxImpulses : D,
          skipZero : E
        }, wialon.util.Helper.wrapCallback(F));
      }
    },
    statics : {
      fuelCalcType : {
        math : 0x01,
        levelSensors : 0x02,
        levelSensorsMath : 0x04,
        absConsSensors : 0x08,
        impConsSensors : 0x10,
        instConsSensors : 0x20,
        rates : 0x40
      },
      fuelLevelFlag : {
        mergeSensors : 0x01,
        smoothData : 0x02,
        splitConsSensors : 0x04,
        requireStay : 0x08,
        calcByTime : 0x10,
        calcFillingsByRaw : 0x40,
        calcTheftsByRaw : 0x80,
        detectTheftsInMotion : 0x100,
        calcFillingsByTime : 0x200,
        calcTheftsByTime : 0x400,
        calcConsumptionByTime : 0x800
      }
    }
  });
})();
(function(){

  var a = "&v=1",b = "resource/upload_zone_image",c = "wialon.item.MZone",d = "",e = "number",f = "?b=",g = "undefined",h = "string",i = "object";
  qx.Mixin.define(c, {
    members : {
      getZoneImageUrl : function(j, k){

        if(typeof k == g || !k)k = 32;
        if(j.icon)return wialon.core.Session.getInstance().getBaseUrl() + j.icon + f + k + a;
        return d;
      },
      setZoneImage : function(m, l, n){

        if(typeof l == h)return wialon.core.Uploader.getInstance().uploadFiles([], b, {
          fileUrl : l,
          itemId : this.getId(),
          id : m.id
        }, n, true); else if(l === null || l === undefined)return wialon.core.Uploader.getInstance().uploadFiles([], b, {
          fileUrl : d,
          itemId : this.getId(),
          id : m.id
        }, n, true); else if(typeof l == i && typeof l.resId == e && typeof l.zoneId == e)return wialon.core.Remote.getInstance().remoteCall(b, {
          itemId : this.getId(),
          id : m.id,
          oldItemId : l.resId,
          oldZoneId : l.zoneId
        }, n);;;
        return wialon.core.Uploader.getInstance().uploadFiles([l], b, {
          itemId : this.getId(),
          id : m.id
        }, n, true);
      }
    },
    statics : {
      flags : {
        area : 0x00000001,
        perimeter : 0x00000002,
        boundary : 0x00000004,
        points : 0x00000008,
        base : 0x000000010
      }
    }
  });
})();
(function(){

  var a = "resource/cleanup_driver_interval",b = "changeDriverUnits",c = "wialon.item.MDriver",d = ".png",e = "say",f = "/1/",g = "/2/",h = "changeTrailerUnits",i = "resource/get_driver_bindings",j = "Array",k = "resource/update_trailer_units",l = "resource/upload_trailer_image",m = "/",n = "qx.event.type.Data",o = "resource/upload_driver_image",p = "number",q = "resource/bind_unit_driver",r = "driver/operate",s = "trlrun",t = "resource/cleanup_trailer_interval",u = "read",v = "resource/get_trailer_bindings",w = "drvrun",x = "resource/bind_unit_trailer",y = "/avl_driver_image/",z = "resource/update_driver_units",A = "undefined",B = "?sid=",C = "object";
  qx.Mixin.define(c, {
    construct : function(){

      var D = wialon.core.Session.getInstance();
      D.registerProperty(w, qx.lang.Function.bind(function(E, F){

        E.setDriverUnits(F);
      }, this));
      D.registerProperty(s, qx.lang.Function.bind(function(G, H){

        G.setTrailerUnits(H);
      }, this));
    },
    properties : {
      driverUnits : {
        init : null,
        check : j,
        event : b
      },
      trailerUnits : {
        init : null,
        check : j,
        event : h
      }
    },
    members : {
      updateDriverUnits : function(I, J){

        return wialon.core.Remote.getInstance().remoteCall(z, {
          itemId : this.getId(),
          units : I
        }, qx.lang.Function.bind(this._onUpdateProperties, this, wialon.util.Helper.wrapCallback(J)));
      },
      updateTrailerUnits : function(K, L){

        return wialon.core.Remote.getInstance().remoteCall(k, {
          itemId : this.getId(),
          units : K
        }, qx.lang.Function.bind(this._onUpdateProperties, this, wialon.util.Helper.wrapCallback(L)));
      },
      getDriverImageUrl : function(O, P){

        if(typeof P == A || !P)P = 32;
        var N = wialon.core.Session.getInstance();
        var M = N.getBaseUrl() + y + this.getId() + m + O.id + m + P + f + O.ck + d + B + N.getId();
        return M;
      },
      getTrailerImageUrl : function(S, T){

        if(typeof T == A || !T)T = 32;
        var R = wialon.core.Session.getInstance();
        var Q = R.getBaseUrl() + y + this.getId() + m + S.id + m + T + g + S.ck + d + B + R.getId();
        return Q;
      },
      setDriverImage : function(V, U, W){

        if(typeof U == C && typeof U.resId == p && typeof U.drvId == p)return wialon.core.Remote.getInstance().remoteCall(o, {
          itemId : this.getId(),
          driverId : V.id,
          oldItemId : U.resId,
          oldDrvId : U.drvId
        }, W);
        return wialon.core.Uploader.getInstance().uploadFiles([U], o, {
          itemId : this.getId(),
          driverId : V.id
        }, W);
      },
      setTrailerImage : function(Y, X, ba){

        if(typeof X == C && typeof X.resId == p && typeof X.trId == p)return wialon.core.Remote.getInstance().remoteCall(l, {
          itemId : this.getId(),
          trailerId : Y.id,
          oldItemId : X.resId,
          oldTrId : X.trId
        }, ba);
        return wialon.core.Uploader.getInstance().uploadFiles([X], l, {
          itemId : this.getId(),
          trailerId : Y.id
        }, ba);
      },
      bindDriverToUnit : function(bd, bh, bg, bf, be){

        var bb = 0;
        var bc = 0;
        if(bd)bb = bd.id;
        if(bh)bc = bh.getId();
        return wialon.core.Remote.getInstance().remoteCall(q, {
          resourceId : this.getId(),
          driverId : bb,
          time : bg,
          unitId : bc,
          mode : bf
        }, wialon.util.Helper.wrapCallback(be));
      },
      bindTrailerToUnit : function(bo, bl, bi, bm, bk){

        var bj = 0;
        var bn = 0;
        if(bo)bj = bo.id;
        if(bl)bn = bl.getId();
        return wialon.core.Remote.getInstance().remoteCall(x, {
          resourceId : this.getId(),
          trailerId : bj,
          time : bi,
          unitId : bn,
          mode : bm
        }, wialon.util.Helper.wrapCallback(bk));
      },
      cleanupDriverInterval : function(br, bq, bs, bt){

        var bp = 0;
        if(br)bp = br.id;
        return wialon.core.Remote.getInstance().remoteCall(a, {
          resourceId : this.getId(),
          driverId : bp,
          timeFrom : bq,
          timeTo : bs
        }, wialon.util.Helper.wrapCallback(bt));
      },
      cleanupTrailerInterval : function(bx, bw, by, bu){

        var bv = 0;
        if(bx)bv = bx.id;
        return wialon.core.Remote.getInstance().remoteCall(t, {
          resourceId : this.getId(),
          trailerId : bv,
          timeFrom : bw,
          timeTo : by
        }, wialon.util.Helper.wrapCallback(bu));
      },
      getDriverBindings : function(bF, bB, bz, bC, bD){

        var bA = 0;
        var bE = 0;
        if(bB)bA = bB.id;
        if(bF)bE = bF.getId();
        return wialon.core.Remote.getInstance().remoteCall(i, {
          resourceId : this.getId(),
          unitId : bE,
          driverId : bA,
          timeFrom : bz,
          timeTo : bC
        }, wialon.util.Helper.wrapCallback(bD));
      },
      getTrailerBindings : function(bM, bK, bG, bI, bJ){

        var bH = 0;
        var bL = 0;
        if(bK)bH = bK.id;
        if(bM)bL = bM.getId();
        return wialon.core.Remote.getInstance().remoteCall(v, {
          resourceId : this.getId(),
          unitId : bL,
          trailerId : bH,
          timeFrom : bG,
          timeTo : bI
        }, wialon.util.Helper.wrapCallback(bJ));
      },
      registerChatMessage : function(bP, bO, bN){

        return wialon.core.Remote.getInstance().remoteCall(r, {
          resourceId : this.getId(),
          driverId : bP.id,
          message : bO,
          callMode : e
        }, wialon.util.Helper.wrapCallback(bN));
      },
      getChatHistory : function(bS, bR, bT, bQ){

        return wialon.core.Remote.getInstance().remoteCall(r, {
          resourceId : this.getId(),
          driverId : bS.id,
          timeFrom : bR,
          timeTo : bT,
          callMode : u
        }, wialon.util.Helper.wrapCallback(bQ));
      }
    },
    statics : {
      registerDriverProperties : function(){

        var bU = wialon.core.Session.getInstance();
        bU.registerProperty(w, this.remoteUpdateDriverUnits);
        bU.registerProperty(s, this.remoteUpdateTrailerUnits);
      },
      remoteUpdateDriverUnits : function(bV, bW){

        bV.setDriverUnits(bW);
      },
      remoteUpdateTrailerUnits : function(bX, bY){

        bX.setTrailerUnits(bY);
      },
      flags : {
        driver : 0x01,
        trailer : 0x02,
        assignmentRestriction : 0x04
      }
    },
    events : {
      "changeDriverUnits" : n,
      "changeTrailerUnits" : n
    }
  });
})();
(function(){

  var a = "create_account",b = "function",c = "account/enable_account",d = "account/update_sub_plans",e = "account/get_account_history",f = "account/update_business_sphere",g = "update_account_min_days",h = "account/get_billing_plans",i = "account/update_dealer_rights",j = "account/create_account",k = "account/update_min_days",l = "switch_account",m = "update_account_history_period",n = "account/update_flags",o = "String",p = "account/do_payment",q = "wialon.item.MAccount",r = "update_account_flags",s = "number",t = "create_account_service",u = "account/delete_account",v = "update_dealer_rights",w = "update_account_service",x = "account/update_plan",y = "update_account_plan",z = "account/update_history_period",A = "delete_account_service",B = "account/get_account_data",C = "update_account_subplans",D = "sph",E = "account/update_billing_plan",F = "account/update_billing_service",G = "object";
  qx.Mixin.define(q, {
    construct : function(){

      var H = wialon.core.Session.getInstance();
      H.registerProperty(D, qx.lang.Function.bind(function(I, J){

        I.setBusinessSphere(J);
      }, this));
    },
    properties : {
      businessSphere : {
        init : null,
        check : o
      }
    },
    members : {
      getAccountData : function(L, K){

        if(typeof (L) == b){

          K = L;
          L = 2;
        };
        return wialon.core.Remote.getInstance().remoteCall(B, {
          itemId : this.getId(),
          type : L
        }, wialon.util.Helper.wrapCallback(K));
      },
      getAccountHistory : function(O, N, M){

        return wialon.core.Remote.getInstance().remoteCall(e, {
          itemId : this.getId(),
          days : O,
          tz : N
        }, wialon.util.Helper.wrapCallback(M));
      },
      updateDealerRights : function(Q, P){

        return wialon.core.Remote.getInstance().remoteCall(i, {
          itemId : this.getId(),
          enable : Q
        }, wialon.util.Helper.wrapCallback(P));
      },
      updatePlan : function(S, R){

        return wialon.core.Remote.getInstance().remoteCall(x, {
          itemId : this.getId(),
          plan : S
        }, wialon.util.Helper.wrapCallback(R));
      },
      updateFlags : function(U, T){

        var V = {
        };
        if(U && typeof U == G)V = U; else if(typeof U == s)V.flags = U;;
        return wialon.core.Remote.getInstance().remoteCall(n, {
          itemId : this.getId(),
          flags : V.flags,
          blockBalance : V.blockBalance,
          denyBalance : V.denyBalance
        }, wialon.util.Helper.wrapCallback(T));
      },
      updateMinDays : function(X, W){

        return wialon.core.Remote.getInstance().remoteCall(k, {
          itemId : this.getId(),
          minDays : X
        }, wialon.util.Helper.wrapCallback(W));
      },
      updateHistoryPeriod : function(ba, Y){

        return wialon.core.Remote.getInstance().remoteCall(z, {
          itemId : this.getId(),
          historyPeriod : ba
        }, wialon.util.Helper.wrapCallback(Y));
      },
      updateBillingService : function(name, bc, be, bd, bb){

        return wialon.core.Remote.getInstance().remoteCall(F, {
          itemId : this.getId(),
          name : name,
          type : bc,
          intervalType : be,
          costTable : bd
        }, wialon.util.Helper.wrapCallback(bb));
      },
      enableAccount : function(bg, bf){

        return wialon.core.Remote.getInstance().remoteCall(c, {
          itemId : this.getId(),
          enable : bg
        }, wialon.util.Helper.wrapCallback(bf));
      },
      updateSubPlans : function(bi, bh){

        return wialon.core.Remote.getInstance().remoteCall(d, {
          itemId : this.getId(),
          plans : bi
        }, wialon.util.Helper.wrapCallback(bh));
      },
      doPayment : function(bk, bl, bm, bj){

        return wialon.core.Remote.getInstance().remoteCall(p, {
          itemId : this.getId(),
          balanceUpdate : bk,
          daysUpdate : bl,
          description : bm
        }, wialon.util.Helper.wrapCallback(bj));
      },
      createAccount : function(bo, bn){

        return wialon.core.Remote.getInstance().remoteCall(j, {
          itemId : this.getId(),
          plan : bo
        }, wialon.util.Helper.wrapCallback(bn));
      },
      deleteAccount : function(bp){

        return wialon.core.Remote.getInstance().remoteCall(u, {
          itemId : this.getId()
        }, wialon.util.Helper.wrapCallback(bp));
      },
      getBillingPlans : function(bq){

        return wialon.core.Remote.getInstance().remoteCall(h, {
        }, wialon.util.Helper.wrapCallback(bq));
      },
      updateBillingPlan : function(br, bs, bt){

        bt = wialon.util.Helper.wrapCallback(bt);
        return wialon.core.Remote.getInstance().remoteCall(E, {
          callMode : br,
          plan : bs
        }, bt);
      },
      updateBusinessSphere : function(bu, bv){

        return wialon.core.Remote.getInstance().remoteCall(f, {
          itemId : this.getId(),
          sph : bu
        }, qx.lang.Function.bind(this._onUpdateProperties, this, wialon.util.Helper.wrapCallback(bv)));
      }
    },
    statics : {
      registerAccountProperties : function(){

        var bw = wialon.core.Session.getInstance();
        bw.registerProperty(D, this.remoteUpdateBusinessSphere);
      },
      remoteUpdateBusinessSphere : function(bx, by){

        bx.setBusinessSphere(by);
      },
      billingPlanFlag : {
        blockAccount : 0x1,
        denyServices : 0x2,
        allowUnknownServices : 0x4,
        restrictDeviceListedOnly : 0x8,
        restrictDeviceNotListedOnly : 0x10,
        subtractDays : 0x20,
        overridePlanFlags : 0x40
      },
      billingIntervalType : {
        none : 0,
        hourly : 1,
        daily : 2,
        weekly : 3,
        monthly : 4
      },
      billingServiceType : {
        onDemand : 1,
        periodic : 2
      },
      logMessageAction : {
        accountCreated : a,
        accountSwitched : l,
        accountUpdateDealerRights : v,
        accountUpdateFlags : r,
        accountUpdateMinDays : g,
        accountUpdatedHistoryPeriod : m,
        accountUpdatePlan : y,
        accountUpdateSubplans : C,
        accountCreatedService : t,
        accountUpdatedService : w,
        accountDeletedService : A
      }
    }
  });
})();
(function(){

  var a = "function",b = "report/abort_report",c = "wialon.item.MReport",d = "report/exec_report",e = "report/apply_report_result",f = "report/cleanup_result",g = "report/get_report_status",h = 'Invalid execReport additional id:';
  qx.Mixin.define(c, {
    members : {
      execReport : function(m, k, i, l, j){

        if(arguments.length <= 2 || (typeof k === a)){

          return this.__fI(m, k);
        };
        return this.__fI({
          report : m,
          objectId : k,
          objectSecondaryId : i,
          interval : l
        }, j);
      },
      getReportStatus : function(n){

        return wialon.core.Remote.getInstance().remoteCall(g, {
        }, wialon.util.Helper.wrapCallback(n));
      },
      abortReport : function(o){

        return wialon.core.Remote.getInstance().remoteCall(b, {
        }, wialon.util.Helper.wrapCallback(o));
      },
      applyReportResult : function(p){

        return wialon.core.Remote.getInstance().remoteCall(e, {
        }, qx.lang.Function.bind(this.__fJ, this, wialon.util.Helper.wrapCallback(p)));
      },
      cleanupResult : function(q){

        return wialon.core.Remote.getInstance().remoteCall(f, {
        }, qx.lang.Function.bind(this.__fK, this, wialon.util.Helper.wrapCallback(q)));
      },
      __fI : function(A, y){

        var B = A.report,t = A.objectId,u = A.additionalObjectsIds,C = A.objectSecondaryId,s = A.interval,w = A.remoteExec;
        var v = null;
        if(!B.id)v = B;
        var r = {
          reportResourceId : this.getId(),
          reportTemplateId : B.id,
          reportTemplate : v,
          reportObjectId : t,
          reportObjectSecId : C,
          interval : s
        };
        if(w)r.remoteExec = 1;
        if(Array.isArray(u)){

          var x = [],z = {
          };
          u.forEach(function(E){

            var F = parseInt(E, 10),D = isFinite(F) && F > 0;
            if(!D){

              console.warn(h, E);
              return;
            };
            if(!z.hasOwnProperty(F)){

              x.push(F);
              z[F] = true;
            };
          });
          r.reportObjectIdList = x;
        };
        return wialon.core.Remote.getInstance().remoteCall(d, r, qx.lang.Function.bind(this.__fJ, this, wialon.util.Helper.wrapCallback(y)), 180);
      },
      __fJ : function(G, H, K){

        var J = null;
        if(H == 0 && K){

          if(!K.reportResult){

            G(0, Object.assign(K, {
              remoteExec : true
            }));
            return;
          };
          J = new wialon.report.ReportResult(K);
          var I = wialon.core.Session.getInstance().getRenderer();
          if(I)I.setReportResult(J);
        };
        G(H, J);
      },
      __fK : function(L, M, N){

        var O = wialon.core.Session.getInstance().getRenderer();
        if(O)O.setReportResult(null);
        L(M);
      }
    },
    statics : {
      intervalFlag : {
        absolute : 0x00,
        useCurrentTime : 0x01,
        prevHour : 0x40,
        prevMinute : 0x80,
        prevDay : 0x02,
        prevWeek : 0x04,
        prevMonth : 0x08,
        prevYear : 0x10,
        currTimeAndPrev : 0x20,
        weekDayMask : 0x700
      },
      tableFlag : {
      },
      columnFlag : {
      },
      remoteExecFlag : {
        queued : 0x01,
        executing : 0x02,
        ready : 0x04,
        cancelled : 0x08,
        error : 0x10
      }
    }
  });
})();
(function(){

  var a = "report/get_result_subrows",b = "&svc=report/export_result&params=",c = "&svc=report/get_result_photo&params=",d = "report/select_result_rows",e = "wialon.report.ReportResult",f = "&svc=report/get_result_map&params=",g = "report/get_result_rows",h = "report/hittest_chart",i = "&svc=report/get_result_chart&params=",j = "report/render_json",k = "object",l = "?sid=",m = "report/get_result_video",n = "Object";
  qx.Class.define(e, {
    extend : qx.core.Object,
    construct : function(o){

      qx.core.Object.call(this, o);
      this._data = o;
    },
    properties : {
      layer : {
        init : null,
        check : n,
        nullable : true
      }
    },
    members : {
      _data : null,
      getTables : function(){

        return this._data.reportResult.tables;
      },
      isRendered : function(){

        return this._data.reportResult.msgsRendered;
      },
      isEmpty : function(){

        var p = 0,q = 0,r = 0;
        if(this._data.reportResult.tables)p = this._data.reportResult.tables.length;
        if(this._data.reportResult.stats)q = this._data.reportResult.stats.length;
        if(this._data.reportResult.attachments)r = this._data.reportResult.attachments.length;
        if(!p && !q && !r)return true;
        return false;
      },
      getTableRows : function(u, v, s, t){

        return wialon.core.Remote.getInstance().remoteCall(g, {
          tableIndex : u,
          indexFrom : v,
          indexTo : s
        }, wialon.util.Helper.wrapCallback(t));
      },
      getRowDetail : function(y, w, x){

        return wialon.core.Remote.getInstance().remoteCall(a, {
          tableIndex : y,
          rowIndex : w
        }, wialon.util.Helper.wrapCallback(x));
      },
      selectRows : function(A, B, z){

        return wialon.core.Remote.getInstance().remoteCall(d, {
          tableIndex : A,
          config : B
        }, wialon.util.Helper.wrapCallback(z));
      },
      renderJSON : function(D, C, G, F, H, E){

        return wialon.core.Remote.getInstance().remoteCall(j, {
          attachmentIndex : D,
          width : C,
          useCrop : G,
          cropBegin : F,
          cropEnd : H
        }, wialon.util.Helper.wrapCallback(E));
      },
      getMessages : function(K, I, J){

        var L = {
          index : 0,
          indexFrom : K,
          indexTo : I
        };
        this.getUnitMessages(L, J);
      },
      getUnitMessages : function(R, Q){

        Q = wialon.util.Helper.wrapCallback(Q);
        if(!R){

          Q(3);
          return;
        };
        var N = R.index;
        var P = R.indexFrom;
        var M = R.indexTo;
        var O = this.getLayer();
        if(O && O instanceof wialon.render.MessagesLayer)O.getMessages(N, P, M, Q); else Q(3);
      },
      getStatistics : function(){

        return this._data.reportResult.stats;
      },
      getAttachments : function(){

        return this._data.reportResult.attachments;
      },
      getChartUrl : function(U, ba, S, V, Y, W, bc, T){

        var bb = {
          reportResourceId : this._data.reportResourceId,
          attachmentIndex : U,
          action : ba,
          width : S,
          height : V,
          autoScaleY : Y,
          pixelFrom : W,
          pixelTo : bc,
          flags : T,
          rnd : (new Date).getTime()
        };
        var X = wialon.core.Session.getInstance();
        return X.getBaseUrl() + X.getApiPath() + l + X.getId() + i + encodeURIComponent(wialon.util.Json.stringify(bb));
      },
      hitTestChart : function(be, bd){

        var bf = {
        };
        if(be && typeof be == k){

          bf = be;
        } else if(arguments.length > 2){

          bf.attachmentIndex = arguments[0];
          bf.datasetIndex = arguments[1];
          bf.valueX = arguments[2];
          bf.valueY = arguments.length > 6 ? arguments[3] : 0;
          bf.flags = arguments.length > 6 ? arguments[4] : 0;
          bf.cropBegin = arguments.length > 6 ? arguments[5] : 0;
          bf.cropEnd = arguments.length > 6 ? arguments[6] : 0;
          bd = arguments[arguments.length - 1];
        };
        return wialon.core.Remote.getInstance().remoteCall(h, {
          attachmentIndex : bf.attachmentIndex,
          datasetIndex : bf.datasetIndex,
          valueX : bf.valueX,
          valueY : bf.valueY,
          flags : bf.flags,
          cropBegin : bf.cropBegin,
          cropEnd : bf.cropEnd
        }, wialon.util.Helper.wrapCallback(bd));
      },
      getExportUrl : function(bj, bi){

        var bh = qx.lang.Object.clone(bi);
        bh.format = bj;
        var bg = wialon.core.Session.getInstance();
        return bg.getBaseUrl() + bg.getApiPath() + l + bg.getId() + b + encodeURIComponent(wialon.util.Json.stringify(bh));
      },
      getMapUrl : function(bk, bn){

        var bm = {
          width : bk,
          height : bn,
          rnd : (new Date).getTime()
        };
        var bl = wialon.core.Session.getInstance();
        return bl.getBaseUrl() + bl.getApiPath() + l + bl.getId() + f + encodeURIComponent(wialon.util.Json.stringify(bm));
      },
      getPhotoUrl : function(br, bq, bs){

        var bo = {
          attachmentIndex : br,
          border : bq,
          rnd : (new Date).getTime(),
          type : bs || 0
        };
        var bp = wialon.core.Session.getInstance();
        return bp.getBaseUrl() + bp.getApiPath() + l + bp.getId() + c + encodeURIComponent(wialon.util.Json.stringify(bo));
      },
      getVideoUrl : function(bv, bt){

        var bu = {
          attachmentIndex : bv,
          rnd : (new Date).getTime()
        };
        return wialon.core.Remote.getInstance().remoteCall(m, bu, wialon.util.Helper.wrapCallback(bt));
      },
      getLayerData : function(){

        return this._data.reportLayer;
      }
    },
    statics : {
      chartFlag : {
        headerTop : 0x01,
        headerBottom : 0x02,
        headerNone : 0x04,
        axisUpDown : 0x40,
        axisDownUp : 0x80,
        legendTop : 0x100,
        legendBottom : 0x200,
        legendLeft : 0x400,
        legendShowAlways : 0x1000
      },
      exportFormat : {
        html : 0x1,
        pdf : 0x2,
        xls : 0x4,
        xlsx : 0x8,
        xml : 0x10,
        csv : 0x20
      }
    }
  });
})();
(function(){

  var a = "unit/get_events",b = "*",c = "unit/update_event_data",d = "sensors",e = "ignition",f = "trips",g = "wialon.item.MUnitEvents";
  qx.Mixin.define(g, {
    members : {
      getTripsHistory : function(k, i, j, h){

        return this.__fL(f, k, i, j, 0, 0, b, h);
      },
      getCurrentTrip : function(m, l){

        return this.__fL(f, 0, 0, 0, m, 0, b, l);
      },
      updateTripsData : function(q, r, o, p, n){

        return this.__fM(q, f, r, o, p, 0, b, n);
      },
      resetTrips : function(t, s){

        return this.__fL(f, t ? -1 : -2, 0, 0, 0, 0, b, s);
      },
      getIgnitionHistory : function(y, w, u, z, x, v){

        return this.__fL(e, y, w, u, 0, z, x, v);
      },
      getCurrentIgnition : function(A, B, C, D){

        return this.__fL(e, 0, 0, 0, C, A, B, D);
      },
      updateIgnitionData : function(H, I, F, G, E){

        return this.__fM(H, e, I, F, G, 0, b, E);
      },
      resetIgnition : function(K, J){

        return this.__fL(e, K ? -1 : -2, 0, 0, 0, 0, b, J);
      },
      getSensorsHistory : function(P, N, L, Q, O, M){

        return this.__fL(d, P, N, L, 0, Q, O, M);
      },
      getCurrentSensors : function(R, S, T, U){

        return this.__fL(d, 0, 0, 0, T, R, S, U);
      },
      updateSensorsData : function(Y, ba, W, X, V){

        return this.__fM(Y, d, ba, W, X, 0, b, V);
      },
      resetSensors : function(bc, bb){

        return this.__fL(e, bc ? -1 : -2, 0, 0, 0, 0, b, bb);
      },
      __fL : function(be, bj, bh, bd, bf, bi, bk, bg){

        return wialon.core.Remote.getInstance().remoteCall(a, {
          itemId : this.getId(),
          eventType : be,
          ivalType : bj,
          ivalFrom : bh,
          ivalTo : bd,
          diffOnly : bf,
          filter1 : bi,
          filter2 : bk
        }, wialon.util.Helper.wrapCallback(bg));
      },
      __fM : function(bs, bm, bq, bo, bl, bp, br, bn){

        return wialon.core.Remote.getInstance().remoteCall(c, {
          itemId : this.getId(),
          params : bs,
          eventType : bm,
          ivalType : bq,
          ivalFrom : bo,
          ivalTo : bl,
          filter1 : bp,
          filter2 : br
        }, wialon.util.Helper.wrapCallback(bn));
      }
    }
  });
})();
(function(){

  var a = "order/detach",b = "object",c = "wialon.item.MOrder",d = "assign",e = "register",f = "number",g = "&svc=order/get_attachment&params=",h = "order/update",i = "?sid=",j = "order/complete_from_history",k = "order/attach",l = "order/list_attachments",m = "order/optimize",n = "order/route_update",o = "undefined",p = "confirm",q = "reject";
  qx.Mixin.define(c, {
    members : {
      getOrderAttachments : function(s, r){

        return wialon.core.Remote.getInstance().remoteCall(l, {
          itemId : this.getId(),
          id : s.id
        }, wialon.util.Helper.wrapCallback(r));
      },
      attachToOrder : function(u, t, v){

        return wialon.core.Uploader.getInstance().uploadFiles([t], k, {
          itemId : this.getId(),
          id : u.id
        }, v, true);
      },
      rejectOrder : function(x, w){

        return wialon.core.Remote.getInstance().remoteCall(h, {
          callMode : q,
          itemId : this.getId(),
          id : x.id
        }, wialon.util.Helper.wrapCallback(w));
      },
      confirmOrder : function(z, y){

        return wialon.core.Remote.getInstance().remoteCall(h, {
          callMode : p,
          itemId : this.getId(),
          id : z.id
        }, wialon.util.Helper.wrapCallback(y));
      },
      detachFromOrder : function(B, C, A){

        return wialon.core.Remote.getInstance().remoteCall(a, {
          itemId : this.getId(),
          id : B.id,
          path : C
        }, wialon.util.Helper.wrapCallback(A));
      },
      getOrderAttachment : function(E, F){

        var D = wialon.core.Session.getInstance();
        return D.getBaseUrl() + D.getApiPath() + i + D.getId() + g + encodeURIComponent(wialon.util.Json.stringify({
          itemId : this.getId(),
          id : E.id,
          path : F
        }));
      },
      assignUnitToOrder : function(H, I, G){

        return wialon.core.Remote.getInstance().remoteCall(h, {
          callMode : d,
          itemId : this.getId(),
          id : H.id,
          u : I
        }, wialon.util.Helper.wrapCallback(G));
      },
      moveOrderToHistory : function(K, J){

        return wialon.core.Remote.getInstance().remoteCall(h, {
          callMode : e,
          itemId : this.getId(),
          id : K.id
        }, wialon.util.Helper.wrapCallback(J));
      },
      remoteOptimizeOrderDelivery : function(Q, P, O, L, N){

        if(typeof N == o){

          N = L;
          L = 0;
        };
        if(typeof L != b){

          L = {
            addPoints : L
          };
        };
        if(typeof P != f){

          var M = wialon.util.Helper.wrapCallback(N);
          return wialon.core.Remote.getInstance().remoteCall(m, {
            itemId : this.getId(),
            orders : Q,
            units : P,
            flags : O,
            gis : L
          }, M);
        } else {

          var M = wialon.util.Helper.wrapCallback(N);
          return wialon.core.Remote.getInstance().remoteCall(m, {
            itemId : this.getId(),
            orders : Q,
            unitCount : P,
            flags : O,
            gis : L
          }, M);
        };
      },
      remoteCompleteOrdersFromHistory : function(S, R){

        var T = wialon.util.Helper.wrapCallback(R);
        return wialon.core.Remote.getInstance().remoteCall(j, {
          itemId : this.getId(),
          orders : S
        }, T);
      },
      routeUpdate : function(X, Y, U, V){

        var W = wialon.util.Helper.wrapCallback(V);
        return wialon.core.Remote.getInstance().remoteCall(n, {
          itemId : this.getId(),
          orders : X,
          routeId : Y,
          callMode : U
        }, W);
      }
    },
    statics : {
      status : {
        inactive : 0,
        active : 1,
        completedInTime : 2,
        completedOverdue : 3,
        canceled : 4
      },
      trackingFlag : {
        stopRequired : 0x1
      },
      statusFlag : {
        rejected : 0x100
      }
    }
  });
})();
(function(){

  var a = "wialon.item.MOrderRoute",b = "order/route_update",c = "register";
  qx.Mixin.define(a, {
    members : {
      registerOrderRoute : function(f, d){

        var g = wialon.util.Helper.wrapCallback(d);
        var e = {
        };
        qx.lang.Object.mergeWith(e, f);
        qx.lang.Object.mergeWith(e, {
          itemId : this.getId(),
          callMode : c
        });
        return wialon.core.Remote.getInstance().remoteCall(b, e, g);
      }
    },
    statics : {
      statusMask : 0xFF,
      status : {
        notStarted : 0,
        started : 1,
        completed : 2,
        cancelled : 3
      },
      statusFlagsMask : 0xFFFFFF00,
      statusFlag : {
        expired : 0x100
      },
      trackingFlag : {
        strict : 0x01,
        fixed : 0x20
      }
    }
  });
})();
(function(){

  var a = "object",b = "qx.event.type.Data",c = "number",d = "Array",e = ".png",f = "driver/operate",g = "changeTagUnits",h = "resource/update_tag_units",i = "wialon.item.MTag",j = "/1/",k = "tagrun",l = "resource/bind_unit_tag",m = "say",n = "changeTagGroups",o = "/",p = "undefined",q = "resource/get_tag_bindings",r = "?sid=",s = "resource/upload_tag_image",t = "/avl_tag_image/";
  qx.Mixin.define(i, {
    construct : function(){

      var u = wialon.core.Session.getInstance();
      u.registerProperty(k, qx.lang.Function.bind(function(v, w){

        v.setTagUnits(w);
      }, this));
    },
    properties : {
      tagUnits : {
        init : null,
        check : d,
        event : g
      },
      tagGroups : {
        init : null,
        check : d,
        event : n
      }
    },
    members : {
      updateTagUnits : function(x, y){

        return wialon.core.Remote.getInstance().remoteCall(h, {
          itemId : this.getId(),
          units : x
        }, qx.lang.Function.bind(this._onUpdateProperties, this, wialon.util.Helper.wrapCallback(y)));
      },
      getTagImageUrl : function(A, C){

        if(typeof C == p || !C)C = 32;
        var B = wialon.core.Session.getInstance();
        var z = B.getBaseUrl() + t + this.getId() + o + A.id + o + C + j + A.ck + e + r + B.getId();
        return z;
      },
      setTagImage : function(E, D, F){

        if(typeof D == a && typeof D.resId == c && typeof D.tagId == c)return wialon.core.Remote.getInstance().remoteCall(s, {
          itemId : this.getId(),
          tagId : E.id,
          oldItemId : D.resId,
          oldTagId : D.tagId
        }, F);
        return wialon.core.Uploader.getInstance().uploadFiles([D], s, {
          itemId : this.getId(),
          tagId : E.id
        }, F);
      },
      bindTagToUnit : function(J, M, L, K, I){

        var G = 0;
        var H = 0;
        if(J)G = J.id;
        if(M)H = M.getId();
        return wialon.core.Remote.getInstance().remoteCall(l, {
          resourceId : this.getId(),
          tagId : G,
          time : L,
          unitId : H,
          mode : K
        }, wialon.util.Helper.wrapCallback(I));
      },
      getTagBindings : function(T, R, N, P, Q){

        var O = 0;
        var S = 0;
        if(R)O = R.id;
        if(T)S = T.getId();
        return wialon.core.Remote.getInstance().remoteCall(q, {
          resourceId : this.getId(),
          unitId : S,
          tagId : O,
          timeFrom : N,
          timeTo : P
        }, wialon.util.Helper.wrapCallback(Q));
      },
      registerChatMessage : function(W, V, U){

        return wialon.core.Remote.getInstance().remoteCall(f, {
          resourceId : this.getId(),
          driverId : W.id,
          message : V,
          callMode : m
        }, wialon.util.Helper.wrapCallback(U));
      }
    },
    statics : {
      registerTagProperties : function(){

        var X = wialon.core.Session.getInstance();
        X.registerProperty(k, this.remoteUpdateTagUnits);
      },
      remoteUpdateTagUnits : function(Y, ba){

        Y.setTagUnits(ba);
      },
      flags : {
        Passenger : 0x01
      }
    },
    events : {
      "changeTagUnits" : b
    }
  });
})();
(function(){

  var a = "apps/list",b = "apps/update",c = "apps/delete",d = "apps/check_top_service",e = "apps/create",f = "wialon.util.Apps",g = "static";
  qx.Class.define(f, {
    type : g,
    statics : {
      createApplication : function(name, o, i, l, n, m, j, h, k){

        k = wialon.util.Helper.wrapCallback(k);
        return wialon.core.Remote.getInstance().remoteCall(e, {
          name : name,
          description : o,
          url : i,
          flags : l,
          langs : n,
          sortOrder : m,
          requiredServicesList : j,
          billingPlans : h
        }, k);
      },
      updateApplication : function(x, name, q, r, u, w, v, s, p, t){

        t = wialon.util.Helper.wrapCallback(t);
        return wialon.core.Remote.getInstance().remoteCall(b, {
          id : x,
          name : name,
          description : q,
          url : r,
          flags : u,
          langs : w,
          sortOrder : v,
          requiredServicesList : s,
          billingPlans : p
        }, t);
      },
      deleteApplication : function(z, y){

        y = wialon.util.Helper.wrapCallback(y);
        return wialon.core.Remote.getInstance().remoteCall(c, {
          id : z
        }, y);
      },
      getApplications : function(C, A, B){

        B = wialon.util.Helper.wrapCallback(B);
        return wialon.core.Remote.getInstance().remoteCall(a, {
          manageMode : C,
          filterLang : A
        }, B);
      },
      remoteCheckTopService : function(D){

        D = wialon.util.Helper.wrapCallback(D);
        return wialon.core.Remote.getInstance().remoteCall(d, {
        }, D);
      },
      urlFlags : {
        sid : 0x00000001,
        user : 0x00000002,
        baseUrl : 0x00000004,
        hostUrl : 0x00000008,
        lang : 0x00000010,
        authHash : 0x00000020
      },
      appTypes : {
        reportsServer : 0x00010000
      }
    }
  });
})();
(function(){

  var a = "update_agro_machine",b = "plots",c = "agro/update_machine",d = "delete_agro_crop",e = "create_agro_machine",f = "agroUnit",g = "crop",h = "agro/update_plot_group",i = "agro/get_plot_data",j = "plotGroup",k = "create_agro_equip",l = "aplt",m = "machine",n = "delete_agro_cul_type",o = "delete_agro_machine",p = "update_agro_plot_group",q = "delete_agro_equip",r = "cultivationType",s = "acltt",t = "delete_agro_msg",u = "create_agro_plot_group",v = "plot",w = "agro/update_equipment",x = "wialon.agro.MAgro",y = "update_agro_crop",z = "amch",A = "update_agro_unit_cfg",B = "equipment",C = "update_agro_fuel",D = "cultivationTypes",E = "machines",F = "delete_agro_plot",G = "agro/update_crop",H = "apltg",I = "equipments",J = "plotGroups",K = "delete_agro_plot_group",L = "create_agro_cul_type",M = "import_agro_plots",N = "agro/update_plot",O = "agro/update_cultivation_type",P = "aequ",Q = "create_agro_crop",R = "fuelRates",S = "create_agro_plot",T = "update_agro_plot",U = "update_agro_props",V = "crops",W = "update_agro_equip",X = "update_agro_cul_type",Y = "undefined",bb = "aclt";
  qx.Mixin.define(x, {
    members : {
      loadAgroLibrary : function(bc){

        if(!this._libraries)return false;
        if(typeof this._libraries[bc] != Y)return true;
        if(bc == b)wialon.item.PluginsManager.bindPropItem(wialon.item.Resource, l, v, N, i); else if(bc == J)wialon.item.PluginsManager.bindPropItem(wialon.item.Resource, H, j, h); else if(bc == E)wialon.item.PluginsManager.bindPropItem(wialon.item.Resource, z, m, c); else if(bc == I)wialon.item.PluginsManager.bindPropItem(wialon.item.Resource, P, B, w); else if(bc == D)wialon.item.PluginsManager.bindPropItem(wialon.item.Resource, s, r, O); else if(bc == V)wialon.item.PluginsManager.bindPropItem(wialon.item.Resource, bb, g, G); else if(bc == R)qx.Class.include(wialon.item.Resource, wialon.agro.MFuelRates); else if(bc == f)qx.Class.include(wialon.item.Unit, wialon.agro.MAgroUnit); else return false;;;;;;;;
        this._libraries[bc] = 1;
        return true;
      },
      logMessageAction : {
        agroCreatedCrop : Q,
        agroUpdatedCrop : y,
        agroDeletedCrop : d,
        agroCreatedCultivationType : L,
        agroUpdatedCultivationType : X,
        agroDeletedCultivationType : n,
        agroCreatedEquipment : k,
        agroUpdatedEquipment : W,
        agroDeletedEquipment : q,
        agroCreatedMachine : e,
        agroUpdatedMachine : a,
        agroDeletedMachine : o,
        agroCreatedPlot : S,
        agroUpdatedPlot : T,
        agroDeletedPlot : F,
        agroCreatedPlotGroup : u,
        agroUpdatedPlotGroup : p,
        agroDeletedPlotGroup : K,
        agroDeletedMessage : t,
        agroUpdatedProperties : U,
        agroUpdatedUnitSettings : A,
        agroUpdatedFuelRates : C,
        agroImportedAgroPlots : M
      }
    }
  });
})();
(function(){

  var a = "wialon.agro.MFuelRates",b = "agro/get_fuel_rates",c = "agro/update_fuel_rates";
  qx.Mixin.define(a, {
    members : {
      getFuelRates : function(d){

        return wialon.core.Remote.getInstance().remoteCall(b, {
          itemId : this.getId()
        }, wialon.util.Helper.wrapCallback(d));
      },
      updateFuelRates : function(f, e){

        return wialon.core.Remote.getInstance().remoteCall(c, {
          itemId : this.getId(),
          rates : f
        }, wialon.util.Helper.wrapCallback(e));
      }
    }
  });
})();
(function(){

  var a = "agro/update_agro_props",b = "wialon.agro.MAgroUnit",c = "agro/get_agro_props";
  qx.Mixin.define(b, {
    members : {
      getAgroProps : function(d){

        return wialon.core.Remote.getInstance().remoteCall(c, {
          itemId : this.getId()
        }, wialon.util.Helper.wrapCallback(d));
      },
      updateAgroProps : function(f, e){

        return wialon.core.Remote.getInstance().remoteCall(a, {
          itemId : this.getId(),
          props : f
        }, wialon.util.Helper.wrapCallback(e));
      }
    }
  });
})();
(function(){

  var a = "function",b = "undefined",c = "wialon.util.MDataFlagsHelper",d = "*",e = "",f = 'number',g = "id",h = "type",j = "col",k = "qx.event.type.Event",l = "access",m = "Integer",n = "string",o = "object";
  qx.Mixin.define(c, {
    members : {
      properties : {
        newItemsCheckingTimeout : {
          init : 600,
          check : m
        }
      },
      startBatch : function(){

        if(this.__eb)return 0;
        this.__eb = new Array;
        return 1;
      },
      finishBatch : function(p){

        p = wialon.util.Helper.wrapCallback(p);
        if(!this.__eb){

          p(2);
          return;
        };
        if(!this.__eb.length){

          this.__eb = null;
          p(0);
          return;
        };
        this.__fT(this.__eb);
        this.__eb = null;
      },
      addItems : function(q, t, r){

        r = wialon.util.Helper.wrapCallback(r);
        if(typeof t != o)return r(2);
        var s = {
          owner : q,
          spec : t,
          callback : r,
          mode : 1
        };
        if(this.__eb)this.__eb.push(s); else this.__fT([s]);
      },
      removeItems : function(u, x, v){

        v = wialon.util.Helper.wrapCallback(v);
        if(typeof x != o)return v(2);
        var w = {
          owner : u,
          spec : x,
          callback : v,
          mode : 2
        };
        if(this.__eb)this.__eb.push(w); else this.__fT([w]);
      },
      getItemsByOwner : function(C, z){

        if(typeof C != n || !C.length)return [];
        var y = [];
        for(var D in this.__fQ){

          var B = false;
          var A = wialon.core.Session.getInstance().getItem(D);
          if(!A)continue;
          if(z && z != A.getType())continue;
          if(this.__fQ[D][C])y.push(A);
        };
        return y;
      },
      getItemDataFlags : function(E, F){

        if(typeof E != n || !E.length)return 0;
        var G = this.__fQ[F];
        if(!G || !G[E])return 0;
        return G[E];
      },
      getItemByOwner : function(H, I){

        if(typeof H != n || !H.length)return null;
        var J = this.__fQ[I];
        if(!J || !J[H])return null;
        return wialon.core.Session.getInstance().getItem(I);
      },
      startNewItemsChecking : function(M){

        if(this.__fN)return;
        if(M && typeof M == o){

          var K = wialon.core.Session.getInstance().getClasses();
          for(var L in M){

            if(L in K)this.__fO[L] = 1;
          };
        };
        wialon.core.Session.getInstance().updateDataFlags([{
          type : l,
          data : 1,
          flags : 0,
          mode : 0
        }], qx.lang.Function.bind(function(N){

          if(N)return;
          this.__fN = true;
        }, this));
      },
      stopNewItemsChecking : function(){

        if(!this.__fN)return;
        wialon.core.Session.getInstance().updateDataFlags([{
          type : l,
          data : 0,
          flags : 0,
          mode : 0
        }], qx.lang.Function.bind(function(O){

          if(O)return;
          this.__fO = {
          };
          this.__fN = false;
        }, this));
      },
      startItemsCreationChecking : function(P){

        if(typeof this.__fR[P] != b)return;
        this.__fR[P] = {
        };
        this.findNewItems(P, true);
      },
      finishItemsCreationChecking : function(Q){

        if(typeof this.__fR[Q] == b)return;
        delete this.__fR[Q];
      },
      findNewItems : function(T, U, X, V){

        clearTimeout(this.__fP);
        this.__fP = null;
        wialon.core.Remote.getInstance().startBatch();
        var R = 0;
        if(X && !(T in this.__fR)){

          this.__fR[T] = {
          };
          R = 1;
        };
        for(var W in this.__fR){

          if(T && T != W)continue;
          var S = qx.lang.Function.bind(function(bf, bb, bh){

            if(bb)return;
            var bd = [];
            var bc = [];
            for(var i = 0;i < bh.items.length;i++){

              var bj = bh.items[i].getId();
              if(this.__fR[bf.itemsType][bj] || wialon.core.Session.getInstance().getItem(bj))continue;
              this.__fR[bf.itemsType][bj] = 1;
              bd.push({
                type : g,
                data : bj,
                flags : 0,
                mode : 0
              });
              bd.push({
                type : g,
                data : bj,
                flags : wialon.item.Item.dataFlag.base,
                mode : 1
              });
              bc.push(bj);
            };
            var bg = !bf.skipEvent && bc.length > 0;
            if(bg){

              wialon.core.Session.getInstance().checkNewItems({
                ids : bc,
                updateDataFlagsSpec : bd
              }, V);
            };
            var Y = 0;
            for(var bi in this.__fR[bf.itemsType])Y++;
            if(Y > bh.items.length){

              for(var bi in this.__fR[bf.itemsType]){

                var ba = 0;
                for(var i = 0;i < bh.items.length;i++){

                  if(bh.items[i].getId() == bi){

                    ba = bi;
                    break;
                  };
                };
                if(ba)continue;
                delete this.__fR[bf.itemsType][bi];
                this._onItemDeleted(this.getItem(bi));
              };
            };
            for(var i = 0;i < bh.items.length;i++){

              var be = bh.items[i];
              if(be && typeof be.dispose != b)be.dispose();
            };
            if(!bg && typeof V === a){

              V(null);
            };
          }, this, {
            itemsType : W,
            skipEvent : U ? 1 : 0
          });
          wialon.core.Session.getInstance().searchItems({
            itemsType : W,
            propName : d,
            propValueMask : d,
            sortType : e
          }, 1, wialon.item.Item.dataFlag.base, 0, 0xFFFFFFFF, S);
        };
        wialon.core.Remote.getInstance().finishBatch(qx.lang.Function.bind(function(bm, bk, bl){

          if(bm && bk){

            delete this.__fR[bl];
          };
          if(!this.__fP && !bm)this.__fP = setTimeout(qx.lang.Function.bind(this.findNewItems, this), this.__fS * 1000);
        }, this, X, R, T));
      },
      __fQ : {
      },
      __eb : null,
      __fP : null,
      __fR : {
      },
      __fS : 600,
      __fN : false,
      __fO : {
      },
      __fT : function(bv){

        if(!bv instanceof Array)return;
        wialon.core.Remote.getInstance().startBatch();
        for(var i = 0;i < bv.length;i++){

          var bq = bv[i];
          if(typeof bq != o)continue;
          bq.spec.mode = bq.mode;
          if(bq.mode == 1){

            var bo = qx.lang.Function.bind(this.__fU, this, bq);
            wialon.core.Session.getInstance().updateDataFlags([bq.spec], bo);
          } else if(bq.mode == 2){

            var br = [];
            if(bq.spec.type == g)br.push(bq.spec.data); else if(bq.spec.type == j)br = br.concat(bq.spec.data); else if(bq.spec.type == h){

              for(var bz in this.__fQ){

                var bt = wialon.core.Session.getInstance().getItem(bz);
                if(bt && bt.getType() == bq.spec.data)br.push(bz);
              };
            };;
            if(!br.length)continue;
            var bn = {
            };
            var bu = bq.spec.flags;
            for(var i = 0;i < br.length;i++){

              var bp = this.__fQ[br[i]];
              if(!bp)continue;
              if(!bp[bq.owner])continue;
              var bs = bp[bq.owner];
              if(typeof bs !== f)bs = 0;
              var bx = wialon.util.Number.and(bs, bu);
              bp[bq.owner] = wialon.util.Number.exclude(bs, bx);
              if(bx){

                for(var bw in bp)if(Object.prototype.hasOwnProperty.call(bp, bw)){

                  var by = bp[bw];
                  bx = wialon.util.Number.exclude(bx, by);
                };
              };
              if(bx){

                if(!bn[br[i]]){

                  bn[br[i]] = {
                    type : g,
                    data : br[i],
                    flags : 0,
                    mode : 2
                  };
                };
                bn[br[i]].flags = wialon.util.Number.or(bn[br[i]].flags, bx);
              };
            };
            for(var bz in bn)if(bn.hasOwnProperty(bz))wialon.core.Session.getInstance().updateDataFlags([bn[bz]]);;
            if(bq.callback)bq.callback();
          };
        };
        wialon.core.Remote.getInstance().finishBatch();
      },
      __fU : function(bC, bA){

        var bE = (new Date()).getTime();
        if(!bC)return;
        if(bA)return bC.callback ? bC.callback() : null;
        var bD = [];
        if(bC.spec.type == g)bD.push(bC.spec.data); else if(bC.spec.type == j)bD = bD.concat(bC.spec.data); else if(bC.spec.type == h){

          var bB = wialon.core.Session.getInstance().getItems(bC.spec.data);
          for(var i = 0;i < bB.length;i++)bD.push(bB[i].getId());
        };;
        for(var i = 0;i < bD.length;i++){

          var bF = bD[i];
          if(!this.__fQ[bF])this.__fQ[bF] = {
          };
          if(!this.__fQ[bF][bC.owner])this.__fQ[bF][bC.owner] = 0;
          this.__fQ[bF][bC.owner] = wialon.util.Number.or(this.__fQ[bF][bC.owner], bC.spec.flags);
        };
        return bC.callback ? bC.callback() : null;
      }
    },
    events : {
      "itemCreated" : k
    }
  });
})();
(function(){

  var a = "file/write_file",b = "&svc=file/get_file&params=",c = "file/list_files",d = "wialon.util.File",e = "{}",f = "file/read_file",g = "file/put_file",h = "file/rm",i = "files",j = "?sid=",k = "static",l = "error";
  qx.Class.define(d, {
    type : k,
    statics : {
      fileStorageType : {
        publicType : 1,
        protectedType : 2
      },
      getFileURL : function(m, q, n){

        var p = {
          itemId : m,
          path : q,
          flags : n
        };
        var o = wialon.core.Session.getInstance();
        return o.getBaseUrl() + o.getApiPath() + j + wialon.core.Session.getInstance().getId() + b + wialon.util.Json.stringify(p);
      },
      listFiles : function(r, v, t, u, s){

        u = this.__fW(u);
        wialon.core.Remote.getInstance().remoteCall(c, {
          itemId : r,
          path : v,
          mask : t,
          flags : u
        }, wialon.util.Helper.wrapCallback(s));
      },
      rm : function(w, z, y, x){

        y = this.__fW(y);
        wialon.core.Remote.getInstance().remoteCall(h, {
          itemId : w,
          path : z,
          flags : y
        }, wialon.util.Helper.wrapCallback(x));
      },
      putFiles : function(A, F, B, E, G, C){

        G = this.__fW(G);
        var D = {
        };
        D.itemId = A;
        D.path = F;
        D.flags = G;
        wialon.core.Uploader.getInstance().uploadFiles(B, g, D, qx.lang.Function.bind(this.__fo, this, C), 1, E);
      },
      readFile : function(H, K, J, I){

        J = this.__fW(J);
        wialon.core.Remote.getInstance().remoteCall(f, {
          itemId : H,
          path : K,
          flags : J
        }, wialon.util.Helper.wrapCallback(I));
      },
      writeFile : function(L, P, O, N, M){

        O = this.__fW(O);
        wialon.core.Remote.getInstance().remoteCall(a, {
          itemId : L,
          path : P,
          flags : O,
          fileData : N
        }, wialon.util.Helper.wrapCallback(M));
      },
      __fo : function(Q, R, S){

        if(S && this.__fV(S, l) && this.__fV(S, i))Q(S.error, S.files); else Q(0, e);
      },
      __fV : function(U, V){

        if(U instanceof Object){

          var T = Object.keys(U);
          if(T.indexOf(V) !== -1)return true;
        };
        return false;
      },
      __fW : function(W){

        var X = W;
        if(!X)X = 0;
        return X;
      }
    }
  });
})();
(function(){

  var a = "route/optimize",b = "static",c = "wialon.util.Routing";
  qx.Class.define(c, {
    type : b,
    statics : {
      remoteOptimizeCourierRoute : function(d, f, e, g){

        g = wialon.util.Helper.wrapCallback(g);
        return wialon.core.Remote.getInstance().remoteCall(a, {
          pathMatrix : d,
          pointSchedules : f,
          flags : e
        }, g);
      },
      remoteOptimizeFlag : {
        fitSchedule : 0x1,
        optimizeDuration : 0x2,
        optimizeTime : 0x4,
        fixFirstPoint : 0x8,
        fixLastPoint : 0x10
      }
    }
  });
})();
(function(){

  var a = "plots",b = "Comic Sans MS",c = "agro/get_plots_by_point",d = "render",e = "wialon.agro.Helper",f = "agro/update_unit_settings",g = "agro/import_plots",h = "Courier New",j = "agro/upload_cultivation",k = "Arial Black",l = "static",m = "agro/get_units_in_plots",n = "DejaVuSans-BoldOblique",o = "Impact",p = "Arial",q = "Georgia",r = "DejaVuSans",s = "uploadTrack",t = "agro/delete_cultivation_msg",u = "Times New Roman",v = "Trebuchet MS",w = "",x = "register",y = "clear",z = "agro/upload_plot",A = "register_ex",B = "&svc=agro/export_plots&params=",C = "agro/convert_plots",D = "upload",E = "Verdana",F = "&svc=agro/print_plots&params=",G = "agro/update_cultivation_msg",H = "DejaVuSans-Oblique",I = "?sid=",J = "agro/get_cultivations",K = "DejaVuSans-Bold",L = "agro/create_plots_layer",M = "undefined",N = "agro/get_unit_settings",O = "object";
  qx.Class.define(e, {
    type : l,
    statics : {
      getPlotsInPoint : function(Q, P){

        return wialon.core.Remote.getInstance().remoteCall(c, {
          spec : Q
        }, wialon.util.Helper.wrapCallback(P));
      },
      getCultivations : function(ba, V, S, U, Y, T, W){

        var X = wialon.core.Session.getInstance().getRenderer();
        if(!X)return;
        var R = X.getLayers();
        for(var i = R.length - 1;i >= 0;i--){

          if(R[i].getName() == Y){

            R[i].dispose();
            qx.lang.Array.remove(R, R[i]);
          };
        };
        return wialon.core.Remote.getInstance().remoteCall(J, {
          plotItemId : ba,
          plotId : V,
          timeFrom : S,
          timeTo : U,
          layerName : typeof Y == M ? w : Y,
          paintingScheme : T ? T : null
        }, qx.lang.Function.bind(this.__fY, this, wialon.util.Helper.wrapCallback(W)), 300);
      },
      getCultivationsList : function(be, bb, bd, bf, bc){

        return wialon.core.Remote.getInstance().remoteCall(J, {
          plotItemId : be,
          plotId : bb,
          timeFrom : bd,
          timeTo : bf,
          layerName : w,
          paintingScheme : null
        }, wialon.util.Helper.wrapCallback(bc), 300);
      },
      uploadCultivation : function(bg, bi, bh, bj){

        wialon.core.Uploader.getInstance().uploadFiles(bg, j, {
          tzOffset : bi,
          color : bh,
          callMode : D
        }, qx.lang.Function.bind(this.__ga, this, wialon.util.Helper.wrapCallback(bj)), true);
      },
      updateCultivationLayer : function(bn, bm, bk, bl){

        return wialon.core.Remote.getInstance().remoteCall(j, {
          time : bn,
          action : bm,
          color : bk,
          callMode : d
        }, qx.lang.Function.bind(this.__gb, this, wialon.util.Helper.wrapCallback(bl)), 300);
      },
      uploadUnitCultivation : function(bx, bq, bt, bz, by, bw, bB, bs, br, bA, bo, bp, bu, bv){

        return wialon.core.Remote.getInstance().remoteCall(j, {
          unitId : bx,
          timeFrom : bq,
          timeTo : bt,
          switchSensorId : bz,
          widthSensorId : by,
          flags : bw,
          tzOffset : bB,
          color : bs,
          defaultWidth : br,
          plotItemId : bA,
          plotId : bo,
          withinPlot : bp ? 1 : 0,
          callMode : s,
          filter : bu
        }, qx.lang.Function.bind(this.__ga, this, wialon.util.Helper.wrapCallback(bv)), 300);
      },
      uploadPlot : function(bC, bE, bD){

        wialon.core.Uploader.getInstance().uploadFiles(bC, z, {
          tzOffset : bE,
          callMode : D
        }, wialon.util.Helper.wrapCallback(bD), true);
      },
      uploadUnitPlot : function(bJ, bH, bI, bF, bG){

        return wialon.core.Remote.getInstance().remoteCall(z, {
          unitId : bJ,
          timeFrom : bH,
          timeTo : bI,
          switchSensorId : bF,
          callMode : s
        }, wialon.util.Helper.wrapCallback(bG), 300);
      },
      clearUploadedCultivation : function(bK){

        return wialon.core.Remote.getInstance().remoteCall(j, {
          callMode : y
        }, qx.lang.Function.bind(this.__fX, this, wialon.util.Helper.wrapCallback(bK)), 300);
      },
      registerUploadedCultivation : function(bY, bS, bO, bX, bW, bQ, bP, bU, bN, bL, bR, bV, bM, bT){

        return wialon.core.Remote.getInstance().remoteCall(j, {
          plotItemId : bY,
          plotId : bS,
          ctypeItemId : bO,
          ctypeId : bX,
          machineItemId : bW,
          machineId : bQ,
          equipItemId : bP,
          equipId : bU,
          description : bN,
          timeFrom : bL,
          timeTo : bR,
          unitId : bV,
          fuelFlags : bM,
          callMode : x
        }, wialon.util.Helper.wrapCallback(bT), 300);
      },
      registerUnitCultivation : function(cn, ca, ce, cm, cl, cf, cc, cj, cd, cb, cg, co, ck, ch, ci){

        return wialon.core.Remote.getInstance().remoteCall(j, {
          plotItemId : cn,
          plotId : ca,
          ctypeItemId : ce,
          ctypeId : cm,
          machineItemId : cl,
          machineId : cf,
          equipItemId : cc,
          equipId : cj,
          description : cd,
          timeFrom : cb,
          timeTo : cg,
          tzOffset : co,
          unitId : ck,
          filter : ch,
          callMode : A
        }, wialon.util.Helper.wrapCallback(ci), 300);
      },
      createPlotsLayer : function(cu, ct, cr, cq){

        var cs = wialon.core.Session.getInstance().getRenderer();
        if(!cs)return;
        var cp = cs.getLayers();
        for(var i = cp.length - 1;i >= 0;i--){

          if(cp[i].getName() == cu){

            cp[i].dispose();
            qx.lang.Array.remove(cp, cp[i]);
          };
        };
        return wialon.core.Remote.getInstance().remoteCall(L, {
          layerName : cu,
          plots : ct,
          flags : cr
        }, qx.lang.Function.bind(this.__fv, this, wialon.util.Helper.wrapCallback(cq)), 300);
      },
      getPrintUrl : function(cv){

        var cx = {
        };
        if(cv && typeof cv == O){

          cx = cv;
        } else if(arguments.length > 8){

          cx.fileType = arguments[0];
          cx.isPlotGroup = arguments[1];
          cx.plots = arguments[2];
          cx.imageFlags = arguments[3];
          cx.plotFlags = arguments[4];
          if(arguments.length > 9){

            cx.mapScale = arguments[5];
            cx.font = arguments[6];
            cx.fontSize = arguments[7];
            cx.fontColor = arguments[8];
            cx.lang = arguments[9];
          } else {

            cx.font = arguments[5];
            cx.fontSize = arguments[6];
            cx.fontColor = arguments[7];
            cx.lang = arguments[8];
          };
          cx.rnd = (new Date).getTime();
        };
        var cw = wialon.core.Session.getInstance();
        return cw.getBaseUrl() + cw.getApiPath() + I + cw.getId() + F + wialon.util.Json.stringify(cx);
      },
      getUnitSettings : function(cz, cy){

        return wialon.core.Remote.getInstance().remoteCall(N, {
          itemId : this.getId()
        }, wialon.util.Helper.wrapCallback(cy), 300);
      },
      updateUnitSettings : function(cA, cD, cB, cE, cC){

        return wialon.core.Remote.getInstance().remoteCall(f, {
          unitId : cA,
          machineItemId : cD,
          machineId : cB,
          settings : cE
        }, wialon.util.Helper.wrapCallback(cC), 300);
      },
      convertPlots : function(cF, cG, cH){

        return wialon.core.Remote.getInstance().remoteCall(C, {
          resourceId : cF,
          plots : cG
        }, wialon.util.Helper.wrapCallback(cH), 300);
      },
      updateCultivationMsg : function(cO, cL, cI, cK, cJ, cN, cM){

        return wialon.core.Remote.getInstance().remoteCall(G, {
          plotItemId : cO,
          plotId : cL,
          timeFrom : cI,
          timeTo : cK,
          msgIndex : cJ,
          params : cN
        }, wialon.util.Helper.wrapCallback(cM), 300);
      },
      deleteCultivationMsg : function(cU, cS, cP, cR, cQ, cT){

        return wialon.core.Remote.getInstance().remoteCall(t, {
          plotItemId : cU,
          plotId : cS,
          timeFrom : cP,
          timeTo : cR,
          msgIndex : cQ
        }, wialon.util.Helper.wrapCallback(cT), 300);
      },
      getPlotsUrl : function(cW, cV, cY){

        var cX = wialon.core.Session.getInstance();
        return cX.getBaseUrl() + cX.getApiPath() + I + cX.getId() + B + wialon.util.Json.stringify({
          fileName : cW ? cW : a,
          plots : cV,
          tzOffset : cY
        });
      },
      importPlot : function(db, dc, da){

        wialon.core.Uploader.getInstance().uploadFiles([db], g, {
          tzOffset : dc,
          callMode : D
        }, wialon.util.Helper.wrapCallback(da), true);
      },
      registerPlots : function(dd, df, de, dg){

        return wialon.core.Remote.getInstance().remoteCall(g, {
          resourceId : dd,
          groupId : df,
          config : de,
          callMode : x
        }, wialon.util.Helper.wrapCallback(dg), 300);
      },
      getUnitsInPlots : function(dh){

        return wialon.core.Remote.getInstance().remoteCall(m, {
        }, wialon.util.Helper.wrapCallback(dh), 300);
      },
      print : {
        fileType : {
          svg : 0x01,
          png : 0x02
        },
        imageFlag : {
          a0 : 0x01,
          a1 : 0x02,
          a2 : 0x04,
          a3 : 0x08,
          a4 : 0x10,
          attachMap : 0x20,
          colored : 0x40
        },
        mapScale : {
          normal : 0x00,
          x2 : 0x01,
          x4 : 0x02,
          x6 : 0x03,
          x8 : 0x04,
          x10 : 0x05,
          x20 : 0x06,
          x50 : 0x07,
          x100 : 0x08,
          x200 : 0x09,
          x400 : 0x0A,
          x1000 : 0x0B
        },
        font : {
          dejaVuSans : r,
          dejaVuSansOblique : H,
          dejaVuSansBold : K,
          dejaVuSansBoldOblique : n,
          arial : p,
          arialBlack : k,
          courierNew : h,
          comicSansMS : b,
          georgia : q,
          impact : o,
          timesNewRoman : u,
          trebuchetMS : v,
          verdana : E
        },
        plotFlag : {
          placementHorizontal : 0x00,
          landscape : 0x01,
          rotate90CCW : 0x02,
          plotName : 0x04,
          plotDescription : 0x08,
          plotArea : 0x10,
          usefulPlotArea : 0x20,
          crop : 0x40,
          placementVertical : 0x80
        }
      },
      __fX : function(dk, dj, dm){

        var dl = wialon.core.Session.getInstance().getRenderer();
        if(!dl)return;
        if(dj == 0 && dm){

          var di = dl.getLayers();
          for(var i = di.length - 1;i >= 0;i--){

            if(di[i].getName() == dm.layerName){

              di[i].dispose();
              qx.lang.Array.remove(di, di[i]);
            };
          };
          dl.setVersion(dl.getVersion() + 1);
        };
        dk(dj, dm);
      },
      __fv : function(dn, dq, dr){

        var ds = wialon.core.Session.getInstance().getRenderer();
        if(!ds)return;
        var dp = null;
        if(dq == 0 && dr){

          if(typeof dr.name != M){

            dp = new wialon.render.Layer(dr);
            ds.getLayers().push(dp);
          };
          ds.setVersion(ds.getVersion() + 1);
        };
        dn(dq, dp);
      },
      __fY : function(dt, dv, dw){

        var dx = wialon.core.Session.getInstance().getRenderer();
        if(!dx)return;
        var du = null;
        if(dv == 0 && dw && dw.layer){

          if(typeof dw.layer.name != M){

            du = new wialon.render.Layer(dw.layer);
            dx.getLayers().push(du);
          };
          dx.setVersion(dx.getVersion() + 1);
        };
        dt(dv, {
          layer : du,
          cultivation : dw.cultivation
        });
      },
      __ga : function(dB, dA, dC){

        var dD = wialon.core.Session.getInstance().getRenderer();
        if(!dD)return;
        var dz = null;
        if(dA == 0 && dC && dC.data && dC.data.layer){

          var dy = dD.getLayers();
          for(var i = dy.length - 1;i >= 0;i--){

            if(dy[i].getName() == dC.data.layer.name){

              dy[i].dispose();
              qx.lang.Array.remove(dy, dy[i]);
            };
          };
          if(typeof dC.data.layer.name != M){

            dz = new wialon.render.Layer(dC.data.layer);
            dD.getLayers().push(dz);
          };
          dD.setVersion(dD.getVersion() + 1);
        };
        dB(dA, {
          layer : dz,
          registrar : (dC && dC.data) ? dC.data.registrar : []
        });
      },
      __gb : function(dE, dF, dG){

        var dH = wialon.core.Session.getInstance().getRenderer();
        if(!dH)return;
        dH.setVersion(dH.getVersion() + 1);
        dE(dF, dG);
      }
    }
  });
})();
(function(){

  var e = "-",h = "'",j = "0",m = "",n = "&deg;",q = "wialon.util.Geometry",t = "00",u = "render/calculate_polygon",w = " ",x = "render/calculate_polyline",y = "static",z = "object";
  qx.Class.define(q, {
    type : y,
    statics : {
      getDistance : function(I, L, J, M){

        var k = Math.PI / 180;
        var H = 1 / 298.257;
        var c,d,f,g,C,B,l,o,r,s,G,F,N,D,O,E,K,A;
        if(I == J && L == M)return 0;
        f = (I + J) / 2;
        g = (I - J) / 2;
        l = (L - M) / 2;
        N = Math.sin(g * k);
        D = Math.cos(g * k);
        O = Math.sin(f * k);
        E = Math.cos(f * k);
        K = Math.sin(l * k);
        A = Math.cos(l * k);
        G = Math.pow(N * A, 2);
        F = Math.pow(E * K, 2);
        s = G + F;
        G = Math.pow(D * A, 2);
        F = Math.pow(O * K, 2);
        c = G + F;
        o = Math.atan(Math.sqrt(s / c));
        r = Math.sqrt(s * c) / o;
        d = 2 * o * 6378.137;
        C = (3 * r - 1) / (2 * c);
        B = (3 * r + 1) / (2 * s);
        G = O * D;
        G = G * G * C * H + 1;
        F = E * N;
        F = F * F * B * H;
        return d * (G - F) * 1000;
      },
      getCoordDegrees : function(Q, R, P, T, S, U){

        if(!U)U = n;
        return Q.toFixed(6) + U;
      },
      getCoordMinutes : function(W, X, V, bb, Y, bc){

        if(!bc)bc = n;
        var v = Number(W);
        var ba = (v < 0) ? e : m;
        var be = v > 0 ? bb : Y;
        v = Math.abs(v);
        var bf = Math.floor(v);
        var bd = (v - bf) * 60.0;
        var p = String(bd);
        if(bd < 10)p = j + bd;
        var bg = m;
        if(X == 2){

          if(bf >= 0 && bf < 10)bg = j + bf; else bg = bf;
        } else if(X == 3){

          if(bf >= 0 && bf < 10)bg = t + bf; else if(bf >= 10 && bf < 100)bg = j + bf; else bg = bf;;
        };
        bg = ba + bg;
        return be + w + bg + bc + w + p.substr(0, V + 3) + h;
      },
      getCoord : function(bi, bj, bh, bl, bk, bm){

        return this.getCoordMinutes(bi, bj, bh, bl, bk, bm);
      },
      getDistanceToLine : function(br, bo, bt, bn, bw, bq, bp){

        var bu = {
        };
        if(br == bt && bo == bn)return this.getDistance(br, bo, bw, bq);
        var bv = 0;
        var bs = 0;
        if(bo != bn){

          var a = (br - bt) / (bo - bn);
          var b = br - bo * a;
          bv = (bq + a * bw - a * b) / (a * a + 1.0);
          bs = bv * a + b;
        } else {

          var a = (bo - bn) / (br - bt);
          var b = bo - br * a;
          bs = (bw + a * bq - a * b) / (a * a + 1.0);
          bv = bs * a + b;
        };
        if(!bp)return this.getDistance(bs, bv, bw, bq);
        if(bv < bo && bv < bn || bv > bo && bv > bn || bs < br && bs < bt || bs > br && bs > bt)return -1; else return this.getDistance(bs, bv, bw, bq);
      },
      pointInShape : function(bH, bI, bE, bz, bL){

        if(!bH || typeof bH != z)return false;
        var bA = bH.length;
        if(bH.length > 2 && bI == 0){

          if(bL && !(bz >= bL.min_y && bz <= bL.max_y && bE >= bL.min_x && bE <= bL.max_x))return;
          var bJ = 0;
          var bF = 0;
          var bD = 0;
          var bx = 0;
          var by = 0;
          var bB = 0;
          var bK = 0;
          var bM = 0;
          var bC = false;
          bD = bH[bA - 1].x;
          bx = bH[bA - 1].y;
          for(var i = 0;i < bA;i++){

            bJ = bH[i].x;
            bF = bH[i].y;
            if(bJ > bD){

              by = bD;
              bK = bJ;
              bB = bx;
              bM = bF;
            } else {

              by = bJ;
              bK = bD;
              bB = bF;
              bM = bx;
            };
            if((bJ < bE) == (bE <= bD) && (bz - bB) * (bK - by) < (bM - bB) * (bE - by)){

              bC = !bC;
            };
            bD = bJ;
            bx = bF;
          };
          return bC;
        } else if(bH.length > 1 && bI){

          if(bL && !(bz >= bL.min_y && bz <= bL.max_y && bE >= bL.min_x && bE <= bL.max_x))return;
          var bO = 0;
          var bN = 0;
          for(var i = 0;i < bA;i++){

            var bG = this.getDistance(bH[i].y, bH[i].x, bz, bE);
            if(bI && bG != -1 && bG <= bI)return true;
            if(bI){

              if(bG != -1 && bG <= bI / 2)return true;
              if(i > 0){

                var bG = this.getDistanceToLine(bH[i].y, bH[i].x, bO, bN, bz, bE, true);
                if(bG != -1 && bG <= bI / 2)return true;
              };
            };
            bO = bH[i].y;
            bN = bH[i].x;
          };
        } else if(bH.length == 1 && bI){

          var p = bH[0];
          bG = this.getDistance(p.y, p.x, bz, bE);
          if(bG != -1 && bG <= bI)return true;
        };;
        return false;
      },
      getShapeCenter : function(bT){

        if(!bT || typeof bT != z)return;
        var bU = bT.length;
        var bR = 0xFFFFFFFF;
        var bS = 0xFFFFFFFF;
        var bP = -0xFFFFFFFF;
        var bQ = -0xFFFFFFFF;
        for(var i = 0;i < bU;i++){

          if(bT[i].x < bR)bR = bT[i].x;
          if(bT[i].x > bP)bP = bT[i].x;
          if(bT[i].y < bS)bS = bT[i].y;
          if(bT[i].y > bQ)bQ = bT[i].y;
        };
        return {
          x : (bP + bR) / 2,
          y : (bQ + bS) / 2
        };
      },
      calculatePolygon : function(bW, bX, bV){

        wialon.core.Remote.getInstance().remoteCall(u, {
          p : bW,
          flags : bX
        }, wialon.util.Helper.wrapCallback(bV));
      },
      calculatePolyline : function(ca, cb, bY, cc){

        wialon.core.Remote.getInstance().remoteCall(x, {
          p : ca,
          flags : cb,
          w : bY
        }, wialon.util.Helper.wrapCallback(cc));
      },
      calculateBoundary : function(cj){

        var ci = 0;
        var cm = 0;
        var ch = 0;
        var co = 0;
        var cd = 0;
        if(!ci && !cm && !ch && !co){

          var cd = 0;
          for(var i = 0;i < cj.length;i++){

            var cn = cj[i];
            if(!ci && !cm && !ch && !co){

              ch = cn.y;
              ci = cn.y;
              co = cn.x;
              cm = cn.x;
              cd = cn.w;
            } else {

              if(co > cn.x)co = cn.x;
              if(cm < cn.x)cm = cn.x;
              if(ch > cn.y)ch = cn.y;
              if(ci < cn.y)ci = cn.y;
              if(cn.radius > cd)cd = cn.w;
            };
          };
          var ce = wialon.util.Geometry.getDistance(ch, co, ch + 1, co);
          var ck = wialon.util.Geometry.getDistance(ch, co, ch, co + 1);
          if(ce && ck){

            ch -= cd / ce;
            co -= cd / ck;
            ci += cd / ce;
            cm += cd / ck;
          };
        };
        return {
          min_y : ch,
          min_x : co,
          max_y : ci,
          max_x : cm
        };
      }
    }
  });
})();
(function(){

  var a = "resource/upload_tacho_file",b = "&svc=exchange/export_zones&params=",c = "wlb",d = "string",e = "static",f = "exchange/import_zones_save",g = ">",h = "<",i = "wln",j = "",k = "exchange/import_csv",l = "&svc=exchange/export_json&params=",m = "&svc=exchange/export_messages&params=",n = "exchange/import_json",o = "plt",p = "core/search_item",q = "txt",r = "kml",s = "exchange/import_xml",t = "exchange/import_pois_save",u = "&svc=exchange/export_pois&params=",v = "wialon.exchange.Exchange",w = "?sid=",x = ",";
  qx.Class.define(v, {
    type : e,
    statics : {
      msgExportFormat : {
        plt : o,
        nmea : q,
        kml : r,
        wln : i,
        wlb : c
      },
      getJsonExportUrl : function(z, B){

        if(typeof B != d || !B.length)B = (new Date()).getTime();
        var A = {
          json : z,
          fileName : B
        };
        var y = wialon.core.Session.getInstance();
        return y.getBaseUrl() + y.getApiPath() + w + y.getId() + l + encodeURI(qx.lang.Json.stringify(A).replace(/&lt;/g, h).replace(/&gt;/g, g));
      },
      importJson : function(C, D){

        wialon.core.Uploader.getInstance().uploadFiles(C, n, {
        }, D, true);
      },
      importXml : function(E, F){

        wialon.core.Uploader.getInstance().uploadFiles(E, s, {
        }, F, true);
      },
      importCsv : function(G, I, H){

        if(qx.lang.Type.isFunction(I))H = I;
        if(!qx.lang.Type.isString(I))I = x;
        H = wialon.util.Helper.wrapCallback(H);
        wialon.core.Uploader.getInstance().uploadFiles(G, k, {
          separator : I
        }, H, true);
      },
      getMessagesExportUrl : function(K, N, M){

        var J = {
          layerName : K,
          format : N,
          compress : M
        };
        var L = wialon.core.Session.getInstance();
        return L.getBaseUrl() + L.getApiPath() + w + L.getId() + m + qx.lang.Json.stringify(J);
      },
      getPOIsExportUrl : function(S, Q, R){

        if(!Q || !Q.length)return j;
        var P = {
          fileName : S,
          pois : Q,
          compress : R
        };
        var O = wialon.core.Session.getInstance();
        return O.getBaseUrl() + O.getApiPath() + w + O.getId() + u + qx.lang.Json.stringify(P);
      },
      getZonesExportUrl : function(X, T, W){

        if(!T || !T.length)return j;
        var U = {
          fileName : X,
          zones : T,
          compress : W
        };
        var V = wialon.core.Session.getInstance();
        return V.getBaseUrl() + V.getApiPath() + w + V.getId() + b + qx.lang.Json.stringify(U);
      },
      importPois : function(Y, ba, bb){

        return wialon.core.Remote.getInstance().remoteCall(t, {
          itemId : Y,
          pois : ba
        }, qx.lang.Function.bind(this.__gc, this, bb));
      },
      importZones : function(bd, bc, be){

        return wialon.core.Remote.getInstance().remoteCall(f, {
          itemId : bd,
          zones : bc
        }, qx.lang.Function.bind(this.__gc, this, be));
      },
      getItemJson : function(bf, bg){

        bg = wialon.util.Helper.wrapCallback(bg);
        return wialon.core.Remote.getInstance().remoteCall(p, {
          id : bf,
          flags : wialon.util.Number.umax()
        }, qx.lang.Function.bind(bg));
      },
      uploadTachoFile : function(bh, bj, bi){

        wialon.core.Uploader.getInstance().uploadFiles(bh, a, {
          outputFlag : bj
        }, bi, true);
      },
      __gc : function(bk, bl, bm){

        if(bl || !bm){

          bk(bl);
          return;
        };
        bk(0, bm);
      }
    }
  });
})();
(function(){

  var a = "/gis_many_searchintelli",c = "/gis_copyright",d = "/gis_get_route",e = "/gis_get_one_to_many_route",f = "",g = "/gis_geocode",h = "number",i = "search",j = "/gis_searchintelli",k = "string",l = "render",m = "/gis_check_point",n = "routing",o = "wialon.util.Gis",q = "/gis_get_route_via_waypoints",r = "[object Array]",s = "/gis_search",t = "/gis_get_many_to_many_route",u = "geocode",v = "static",w = "object";
  qx.Class.define(o, {
    type : v,
    statics : {
      geocodingFlags : {
        level_countries : 1,
        level_regions : 2,
        level_cities : 3,
        level_streets : 4,
        level_houses : 5
      },
      searchFlags : {
        search_countries : 0,
        search_regions : 1,
        search_cities : 2,
        search_streets : 3,
        search_houses : 4,
        search_full_path : 0x100,
        search_map_name : 0x200,
        search_coords : 0x400
      },
      searchByStringFlags : {
        search_countries : 0x1,
        search_regions : 0x2,
        search_cities : 0x4,
        search_streets : 0x8,
        search_houses : 0x10
      },
      geocodingParams : {
        flags : 0,
        city_radius : 0,
        dist_from_unit : 0,
        txt_dist : f,
        house_detect_radius : 0
      },
      routingFlags : {
        CH : 0x1
      },
      routingViaWaypointsFlags : {
        detailed_information_by_section : 0x1
      },
      decodePoly : function(E){

        E = String(E);
        var B = [];
        var x = 0;
        var z = E.length;
        var D = 0;
        var F = 0;
        while(x < z){

          var y = 0;
          var G = 0;
          var b = 0;
          do {

            b = E.charCodeAt(x++) - 63;
            G |= (b & 0x1f) << y;
            y += 5;
          }while((b >= 0x20));
          var A = ((G & 1) != 0 ? ~(G >> 1) : (G >> 1));
          D += A;
          y = 0;
          G = 0;
          do {

            b = E.charCodeAt(x++) - 63;
            G |= (b & 0x1f) << y;
            y += 5;
          }while((b >= 0x20));
          var C = ((G & 1) != 0 ? ~(G >> 1) : (G >> 1));
          F += C;
          var p = {
            lat : D / 100000,
            lon : F / 100000
          };
          B.push(p);
        };
        return B;
      },
      getRoute : function(H, L, I, M, K, J){

        return this.getRouteBetween({
          origin : {
            lat : H,
            lon : L
          },
          destination : {
            lat : I,
            lon : M
          },
          flags : K
        }, J);
      },
      getRouteBetween : function(T, S){

        var N = T.origin,Q = T.destination,R = T.waypoints,U = T.flags,P = T.params,V = T.searchProvider;
        var self = this;
        S = wialon.util.Helper.wrapCallback(S);
        if(!N || !Q){

          S ? S(2, null) : null;
          return;
        };
        if(R && R.length)O(); else W();
        function W(){

          var X = N.lat,bc = N.lon,Y = Q.lat,be = Q.lon;
          if(typeof X != h || typeof bc != h || typeof Y != h || typeof be != h){

            S(2, null);
            return;
          };
          if(typeof U != h || !U)U = 0x1;
          var bb = {
            lat1 : X,
            lon1 : bc,
            lat2 : Y,
            lon2 : be,
            flags : U
          };
          var ba = wialon.core.Session.getInstance().getGisSid();
          if(ba){

            bb.gis_sid = ba;
          };
          var bd = wialon.core.Session.getInstance().getCurrUser();
          if(bd)bb.uid = bd.getId();
          if(V)bb.search_provider = V;
          if(P)bb.params = P;
          wialon.core.Remote.getInstance().ajaxRequest(wialon.core.Session.getInstance().getBaseGisUrl(n) + d, bb, function(bf, bg){

            if(!bf){

              if(bg.points){

                bg.points = self.decodePoly(bg.points);
              };
              S(0, bg);
            } else S(bf, null);
          }, wialon.core.Remote.getInstance().getTimeout());
        };
        function O(){

          if(!R){

            S ? S(2, null) : null;
            return;
          };
          var bi = {
            data : {
              origin : N,
              destination : Q,
              waypoints : R,
              flags : (U ? U : 0)
            }
          };
          var bh = wialon.core.Session.getInstance().getGisSid();
          if(bh){

            bi.gis_sid = bh;
          };
          var bj = wialon.core.Session.getInstance().getCurrUser();
          if(bj)bi.uid = bj.getId();
          if(V)bi.search_provider = V;
          if(P)bi.params = P;
          wialon.core.Remote.getInstance().ajaxRequest(wialon.core.Session.getInstance().getBaseGisUrl(n) + q, bi, function(bk, bl){

            if(!bk){

              if(bl.points){

                bl.points = self.decodePoly(bl.points);
              };
              S(0, bl);
            } else S(bk, null);
          }, wialon.core.Remote.getInstance().getTimeout());
        };
      },
      getRouteViaWaypoints : function(bm, bo, bp, bq, br){

        bq = wialon.util.Helper.wrapCallback(bq);
        if(!bm || !bo || !bp){

          bq ? bq(2, null) : null;
          return;
        };
        var bs = {
          data : {
            origin : bm,
            destination : bo,
            waypoints : bp,
            flags : (br ? br : 0)
          }
        };
        var bn = wialon.core.Session.getInstance().getGisSid();
        if(bn){

          bs.gis_sid = bn;
        };
        var bt = wialon.core.Session.getInstance().getCurrUser();
        if(bt)bs.uid = bt.getId();
        var self = this;
        wialon.core.Remote.getInstance().ajaxRequest(wialon.core.Session.getInstance().getBaseGisUrl(n) + q, bs, function(bu, bv){

          if(!bu){

            if(bv.points){

              bv.points = self.decodePoly(bv.points);
            };
            bq(0, bv);
          } else bq(bu, null);
        }, wialon.core.Remote.getInstance().getTimeout());
      },
      getManyToManyRoute : function(bx, bw){

        return this.manyToManyRouting({
          points : bx
        }, bw);
      },
      manyToManyRouting : function(bA, bB){

        var bC = bA.points,bG = bA.searchProvider;
        bB = wialon.util.Helper.wrapCallback(bB);
        var by = [];
        var bz = Array.isArray(bC) && bC.every(function(bH){

          if(!bH || (typeof bH.lat !== h) || (typeof bH.lon !== h))return false;
          by.push({
            lat : bH.lat,
            lon : bH.lon
          });
          return true;
        });
        if(!bz){

          bB ? bB(2, null) : null;
          return;
        };
        var bD = {
          data : {
            points : by
          }
        };
        var bE = wialon.core.Session.getInstance().getGisSid();
        if(bE){

          bD.gis_sid = bE;
        };
        var bF = wialon.core.Session.getInstance().getCurrUser();
        if(bF)bD.uid = bF.getId();
        if(bG)bD.search_provider = bG;
        var self = this;
        wialon.core.Remote.getInstance().ajaxRequest(wialon.core.Session.getInstance().getBaseGisUrl(n) + t, bD, function(bI, bJ){

          if(!bI){

            if(bJ.points){

              bJ.points = self.decodePoly(bJ.points);
            };
            bB(0, bJ);
          } else bB(bI, null);
        }, wialon.core.Remote.getInstance().getTimeout());
      },
      getOneToManyRoute : function(bP, bL, bN, bM){

        bM = wialon.util.Helper.wrapCallback(bM);
        if(!bN || !bN.length || typeof bP != h || typeof bL != h){

          bM ? bM(2, null) : null;
          return;
        };
        var bO = {
          data : {
            lat : bP,
            lon : bL,
            points : bN
          }
        };
        var bK = wialon.core.Session.getInstance().getGisSid();
        if(bK){

          bO.gis_sid = bK;
        };
        var bQ = wialon.core.Session.getInstance().getCurrUser();
        if(bQ)bO.uid = bQ.getId();
        var self = this;
        wialon.core.Remote.getInstance().ajaxRequest(wialon.core.Session.getInstance().getBaseGisUrl(n) + e, bO, function(bR, bS){

          if(!bR){

            if(bS.points){

              bS.points = self.decodePoly(bS.points);
            };
            bM(0, bS);
          } else bM(bR, null);
        }, wialon.core.Remote.getInstance().getTimeout());
      },
      getLevelFlags : function(bY, bW, bX, bU, bV){

        if(bY < 1 || bY > 5)return 1255211008;
        var bT = bY << 28;
        if(bW > 0 || bW < 6)bT += bW << 25;
        if(bX > 0 || bX < 6)bT += bX << 22;
        if(bU > 0 || bU < 6)bT += bU << 19;
        if(bV > 0 || bV < 6)bT += bV << 16;
        return bT;
      },
      getLocations : function(cb, ca){

        return this.pointsToAddresses({
          positions : cb
        }, ca);
      },
      pointsToAddresses : function(ci, ce){

        ce = wialon.util.Helper.wrapCallback(ce);
        if(!ci || !ci.positions){

          ce(2, null);
          return;
        };
        var cf = qx.lang.Object.clone(this.geocodingParams);
        var cg = wialon.core.Session.getInstance().getGisSid();
        if(cg){

          cf.gis_sid = cg;
        };
        var cc = ci.lang;
        if(cc){

          cf.lang = cc;
        };
        var cd = ci.positions;
        if(Array.isArray(cd)){

          cd = cd.map(function(cj){

            return {
              lat : cj.lat,
              lon : cj.lon
            };
          });
        };
        cf.coords = wialon.util.Json.stringify(cd);
        if(ci.searchProvider)cf.search_provider = ci.searchProvider;
        var ch = wialon.core.Session.getInstance().getCurrUser();
        if(ch)cf.uid = ch.getId();
        wialon.core.Remote.getInstance().ajaxRequest(wialon.core.Session.getInstance().getBaseGisUrl(u) + g, cf, ce, wialon.core.Remote.getInstance().getTimeout());
      },
      searchByString : function(cl, ck){

        var cm = {
        };
        if(cl && typeof cl == w){

          cm = cl;
        } else if(arguments.length > 2){

          cm.phrase = arguments[0];
          cm.flags = arguments[1];
          cm.count = arguments[2];
          if(arguments.length > 4){

            cm.allow_irrelevant = arguments[3];
            ck = arguments[4];
          } else {

            ck = arguments[3];
          };
        };
        return this.addressToPoints(cm, ck);
      },
      addressToPoints : function(cx, ct){

        ct = wialon.util.Helper.wrapCallback(ct);
        var cs = cx.phrase,cn = cx.count,cu = cx.flags || 0,co = cx.lang,cp = cx.allow_irrelevant;
        var cq = typeof cs == k || (typeof cs == w && typeof cs.phrase == k);
        if(!cq || typeof cn != h){

          ct(2, null);
          return;
        };
        var cv = {
          phrase : cs,
          flags : cu,
          count : cn,
          allow_irrelevant : cp
        };
        if(co){

          cv.lang = co;
        };
        var cr = wialon.core.Session.getInstance().getGisSid();
        if(cr){

          cv.gis_sid = cr;
        };
        if(cx.searchProvider)cv.search_provider = cx.searchProvider;
        var cw = wialon.core.Session.getInstance().getCurrUser();
        if(cw)cv.uid = cw.getId();
        wialon.core.Remote.getInstance().ajaxRequest(wialon.core.Session.getInstance().getBaseGisUrl(i) + j, cv, ct, wialon.core.Remote.getInstance().getTimeout());
      },
      searchByStringArray : function(cC, cB){

        var cG = {
        };
        if(cC && typeof cC == w){

          cG = cC;
        } else if(arguments.length > 2){

          cG.phrases = arguments[0];
          cG.flags = arguments[1];
          cG.count = arguments[2];
          if(arguments.length > 4){

            cG.allow_irrelevant = arguments[3];
            cB = arguments[4];
          } else {

            cB = arguments[3];
          };
        };
        cB = wialon.util.Helper.wrapCallback(cB);
        if(Object.prototype.toString.call(cA) !== r || typeof cy != h){

          cB(2, null);
          return;
        };
        var cA = cG.phrases,cy = cG.count,cF = cG.flags || 0,cz = cG.allow_irrelevant,cE = wialon.core.Session.getInstance().getGisSid();
        var cC = {
          phrases : cA,
          flags : cF,
          count : cy,
          allow_irrelevant : cz
        };
        if(cE){

          cC.gis_sid = cE;
        };
        var cD = wialon.core.Session.getInstance().getCurrUser();
        if(cD)cC.uid = cD.getId();
        wialon.core.Remote.getInstance().ajaxRequest(wialon.core.Session.getInstance().getBaseGisUrl(i) + a, cC, cB, wialon.core.Remote.getInstance().getTimeout());
      },
      search : function(cJ, cK, cI, cM, cN, cH, cL){

        cL = wialon.util.Helper.wrapCallback(cL);
        if(typeof cJ != k || typeof cK != k || typeof cI != k || typeof cM != k){

          cL(2, null);
          return;
        };
        var cO = {
          country : cJ,
          region : cK,
          city : cI,
          street : cM,
          flags : cN,
          count : cH
        };
        var cP = wialon.core.Session.getInstance().getGisSid();
        if(cP){

          cO.gis_sid = cP;
        };
        var cQ = wialon.core.Session.getInstance().getCurrUser();
        if(cQ)cO.uid = cQ.getId();
        wialon.core.Remote.getInstance().ajaxRequest(wialon.core.Session.getInstance().getBaseGisUrl(i) + s, cO, cL, wialon.core.Remote.getInstance().getTimeout());
      },
      copyright : function(cR, cX, cS, da, cU, cV){

        cV = wialon.util.Helper.wrapCallback(cV);
        if(typeof cR != h || typeof cX != h || typeof cS != h || typeof da != h || typeof cU != h){

          cV(2, null);
          return;
        };
        var cW = {
          lat1 : cR,
          lon1 : cX,
          lat2 : cS,
          lon2 : da,
          zoom : cU
        };
        var cT = wialon.core.Session.getInstance().getGisSid();
        if(cT){

          cW.gis_sid = cT;
        };
        var cY = wialon.core.Session.getInstance().getCurrUser();
        if(cY)cW.uid = cY.getId();
        wialon.core.Remote.getInstance().ajaxRequest(wialon.core.Session.getInstance().getBaseGisUrl(l) + c, cW, cV, wialon.core.Remote.getInstance().getTimeout());
      },
      checkPointForObject : function(dk, df, dd, de, db, dh, dc, di, dg){

        dg = wialon.util.Helper.wrapCallback(dg);
        if(typeof dk != h || typeof df != h || typeof dd != k || typeof de != k || typeof db != k || typeof dh != k || typeof di != h){

          dg(2, null);
          return;
        };
        var dl = {
          lat : dk,
          lon : df,
          country : dd,
          region : de,
          city : db,
          street : dh,
          house : dc,
          radius : di
        };
        var dj = wialon.core.Session.getInstance().getGisSid();
        if(dj){

          dl.gis_sid = dj;
        };
        wialon.core.Remote.getInstance().ajaxRequest(wialon.core.Session.getInstance().getBaseGisUrl(u) + m, dl, dg, wialon.core.Remote.getInstance().getTimeout());
      }
    }
  });
})();
(function(){

  var a = "=",b = "data",c = "error",d = "",e = 'POST',f = "wialon.core.NodeHttp",g = "http",h = 'sid=',i = "utf8",j = 'application/x-www-form-urlencoded',k = '',l = "https",m = "sid",o = ":",p = "end",q = "&",r = "://",s = "object";
  qx.Class.define(f, {
    extend : qx.core.Object,
    construct : function(t){

      qx.core.Object.call(this);
      var u = wialon.core.Session.getInstance().getBaseUrl().split(r);
      if(u[0] == l){

        this._port = 443;
        this._http = require(l);
      } else {

        this._port = 80;
        this._http = require(g);
      };
      u = u[u.length - 1].split(o);
      if(u.length > 1)this._port = u[1];
      this._hostname = u[0];
      this._callbacks = {
      };
    },
    members : {
      send : function(x, y, w, A, z){

        var v = Buffer.from(this.__ek(y));
        var C = {
          method : e,
          host : this._hostname,
          port : this._port,
          path : x,
          headers : {
            'Content-Type' : j,
            'Content-Length' : v.length
          }
        };
        var B = {
          counter : ++this._counter,
          options : C,
          body : v
        };
        this._callbacks[this._counter] = [w, A, B, 0, z, null, d];
        this.__em(this._counter);
      },
      supportAsync : function(){

        return true;
      },
      _http : null,
      _hostname : d,
      _port : 80,
      _id : 0,
      _callbacks : {
      },
      _timeout : 0,
      _counter : 0,
      __ek : function(G){

        var D = [];
        var F = false;
        var E = wialon.core.Session.getInstance().getId();
        var H = E ? h + E : k;
        if(typeof G == s){

          for(var n in G){

            if(typeof G[n] == s)D.push(n + a + encodeURIComponent(wialon.util.Json.stringify(G[n]))); else D.push(n + a + encodeURIComponent(G[n]));
            if(n == m)F = true;
          };
          return D.join(q) + (!F ? H : k);
        };
        return !F ? H : k;
      },
      __el : function(J){

        var I = this._callbacks[J];
        if(!I)return;
        if(I[1])I[1]();
        delete this._callbacks[J];
      },
      __em : function(O){

        var K = this._callbacks[O];
        if(K[4])K.push(setTimeout(qx.lang.Function.bind(this.__el, this, O), K[4] * 1000));
        var N = qx.lang.Function.bind(this.__eo, this, O, 0, d);
        var M = qx.lang.Function.bind(function(P, Q){

          Q.setEncoding(i);
          Q.on(b, qx.lang.Function.bind(this.__en, this, P));
          Q.on(p, qx.lang.Function.bind(this.__eo, this, P));
        }, this, O);
        var L = this._http.request(K[2].options, M).on(c, N);
        L.write(K[2].body);
        L.end();
      },
      __en : function(S, T){

        var R = this._callbacks[S];
        if(!R || !T)return;
        R[6] += T;
      },
      __eo : function(V){

        var U = this._callbacks[V];
        if(!U)return;
        var W = wialon.util.Json.parse(U[6]);
        if(!W){

          U[1]();
          return;
        };
        if(W.error && W.error == 1003 && U[3] < 3){

          U[3]++;
          U[6] = d;
          if(U[4] && U[5]){

            clearTimeout(U[5]);
            U[5] = setTimeout(qx.lang.Function.bind(this.__el, this, V), U[4] * 1000);
          };
          setTimeout(qx.lang.Function.bind(function(X){

            this.__em(V);
          }, this, V), Math.random() * 1000);
          return;
        };
        if(U[0])U[0](W);
        if(U[4] && U[5])clearTimeout(U[5]);
        delete this._callbacks[V];
      }
    }
  });
})();
(function(){

  var a = "account/trash",b = "list",c = "wialon.util.Trash",d = "restore",e = "wialon",f = "admin/trash",g = "static",h = "object";
  qx.Class.define(c, {
    type : g,
    statics : {
      getDeletedItems : function(j){

        j = wialon.util.Helper.wrapCallback(j);
        var k = {
          callMode : b
        };
        var i = a;
        var l = wialon.core.Session.getInstance().isLocal();
        if(l){

          i = f;
          k.creator = e;
        };
        return wialon.core.Remote.getInstance().remoteCall(i, k, j);
      },
      restoreDeletedItems : function(q, n){

        n = wialon.util.Helper.wrapCallback(n);
        if(typeof q != h)return n(2);
        var p = {
          callMode : d,
          guids : q.guids
        };
        var m = a;
        var o = wialon.core.Session.getInstance().isLocal();
        if(o){

          m = f;
          p.creator = e;
        };
        return wialon.core.Remote.getInstance().remoteCall(m, p, n);
      }
    }
  });
})();
(function(){

  var a = "Error performing request",b = "Item with such unique property already exists",c = "Invalid result",d = "Authorization server is unavailable, please try again later",e = "Internal billing error",f = "static",g = "Destination resource is not an account",h = "Error getting creator of destination account",i = "Error getting source account",j = "Error changing account of the item",k = "Access denied",l = "Messages count has exceeded the limit",m = "Invalid service",n = "Invalid user name or password",o = "Only one request of given time is allowed at the moment",p = "No message for selected interval",q = "Error moving item on a tree parents",r = "Abort batch request",s = "Execution time has exceeded the limit",t = "",u = "Error changing creator of the item",v = "wialon.core.Errors",w = "Item already in the destination account",x = "Invalid user name or e-mail",y = "Subsystem not available",z = "Invalid input item or source account",A = "Item is locked",B = "Invalid input",C = "Creator of destination account no access to item",D = "Error operation in the billing",E = "Selected user is a creator for some system objects, thus this user cannot be bound to a new account",F = "Invalid session",G = "Account is blocked",H = "Unknown error";
  qx.Class.define(v, {
    type : f,
    statics : {
      getErrorText : function(I){

        switch(I){case 0:
        return t;case 1:
        return F;case 2:
        return m;case 3:
        return c;case 4:
        return B;case 5:
        return a;case 6:
        break;case 7:
        return k;case 8:
        return n;case 9:
        return d;case 10:
        return r;case 11:
        return x;case 12:
        return y;case 1001:
        return p;case 1002:
        return b;case 1003:
        return o;case 1004:
        return l;case 1005:
        return s;case 2001:
        return z;case 2002:
        return g;case 2003:
        return e;case 2004:
        return G;case 2005:
        return h;case 2006:
        return C;case 2007:
        return i;case 2008:
        return w;case 2009:
        return q;case 2010:
        return D;case 2011:
        return e;case 2012:
        return j;case 2013:
        return u;case 2014:
        return E;case 2015:
        return A;default:
        break;};
        return H;
      }
    }
  });
})();
(function(){

  var a = "mm",b = "%m",c = "Esfand",e = "Mar",f = "Aug",g = "%b",h = "%",j = "May",k = "December",l = "Thursday",m = "hh",n = "dddd",o = "%l",p = "Bahman",q = "Jun",r = 'day',s = "June",u = "Oct",v = "Tuesday",w = "Friday",x = "tt",y = "Feb",z = "%e",A = "Jan",B = "Azar",C = "July",D = "pm",E = "January",F = "dd",G = "MMMM",H = "Shahrivar",I = "am",J = "%P",K = "H:m:s",L = "string",M = "Mordad",N = "HH:mm",O = "%a",P = "October",Q = "Nov",R = "tz",S = "PC",T = "Thu",U = "November",V = "0",W = "%Y",X = "March",Y = "ddd",cf = "g",cg = "%I",ch = "d",cb = "Fri",cc = "%A",cd = "yyyy-MM-dd",ce = "Tue",cm = "Tir",cn = "ss",co = "Apr",cp = "Monday",ci = "static",cj = "Day",ck = "%H",cl = "wialon.util.DateTime",ct = "September",cS = "HH",cT = "April",cu = "%p",cq = "Dec",cr = "Mehr",cW = "Sunday",cs = "August",cv = "February",cw = "Wed",cx = "%y",cB = "MM",cX = "%B",cC = "yy",cy = "Mon",cz = "yyyy-MM-dd HH:mm:ss",cV = "Sun",cA = "Jul",cG = "Aban",cH = "%S",da = "%02d %s %04d %02d:%02d:%02d",cI = "Khordad",cD = "number",cE = "Sep",cY = "%E",cF = "",cN = "Saturday",cO = "Sat",db = "Farvardin",cP = "MMM",cJ = "M",cK = 'days',cL = "Ordibehest",cM = "%M",cQ = "Wednesday",cR = "yyyy",cU = "undefined";
  qx.Class.define(cl, {
    type : ci,
    statics : {
      formatTime : function(df, dc, dd){

        if(!df || typeof df != cD)return cF;
        var self = this;
        var dg = dd;
        df = this.userTime(df);
        var d = new Date(df * 1000);
        if(!dg || typeof dg != L){

          dg = cz;
          if(dc){

            var dj = new Date(this.userTime(wialon.core.Session.getInstance().getServerTime()) * 1000);
            if((d.getUTCFullYear() == dj.getUTCFullYear() && d.getUTCMonth() == dj.getUTCMonth() && d.getUTCDate() == dj.getUTCDate()) || dc == 2)dg = N;
          };
        };
        if(dg.indexOf(h) < 0)dg = this.convertFormat(dg);
        function di(dk){

          var dl = false;
          var dm;
          return function(){

            if(dl)return dm;
            dm = dk();
            dl = true;
            return dm;
          };
        };
        var de = {
          "%A" : di(function(){

            return self.__gh.days[d.getUTCDay()];
          }),
          "%a" : di(function(){

            return self.__gh.days_abbrev[d.getUTCDay()];
          }),
          "%E" : di(function(){

            return self.__gd(d.getUTCDate());
          }),
          "%e" : di(function(){

            return d.getUTCDate();
          }),
          "%I" : di(function(){

            return self.__gd((d.getUTCHours() % 12) ? (d.getUTCHours() % 12) : 12);
          }),
          "%M" : di(function(){

            return self.__gd(d.getUTCMinutes());
          }),
          "%S" : di(function(){

            return self.__gd(d.getUTCSeconds());
          }),
          "%p" : di(function(){

            return d.getUTCHours() >= 12 ? D : I;
          }),
          "%Y" : di(function(){

            return d.getUTCFullYear();
          }),
          "%y" : di(function(){

            return self.__gd(d.getUTCFullYear() % 100);
          }),
          "%H" : di(function(){

            return self.__gd(d.getUTCHours());
          }),
          "%B" : di(function(){

            return self.__gh.months[d.getUTCMonth()];
          }),
          "%b" : di(function(){

            return self.__gh.months_abbrev[d.getUTCMonth()];
          }),
          "%m" : di(function(){

            return self.__gd(d.getUTCMonth() + 1);
          }),
          "%l" : di(function(){

            return d.getUTCMonth() + 1;
          }),
          "%P" : di(function(){

            return self.persianFormatTime(self.absoluteTime(df));
          })
        };
        var dh = /%A|%a|%E|%e|%I|%M|%S|%p|%Y|%y|%H|%B|%b|%m|%l|%P/g;
        dg = dg.replace(dh, function(dn){

          return de[dn]();
        });
        return dg;
      },
      formatDate : function(dr, dp){

        if(!dr || typeof dr != cD)return cF;
        var ds = dp;
        if(!ds || typeof ds != L)ds = cd;
        dr = this.userTime(dr);
        var d = new Date(dr * 1000);
        if(ds.indexOf(h) < 0)ds = this.convertFormat(ds);
        var dq = {
          "%A" : this.__gh.days[d.getUTCDay()],
          "%a" : this.__gh.days_abbrev[d.getUTCDay()],
          "%E" : this.__gd(d.getUTCDate()),
          "%e" : d.getUTCDate(),
          "%Y" : d.getUTCFullYear(),
          "%y" : this.__gd(d.getUTCFullYear() % 100),
          "%B" : this.__gh.months[d.getUTCMonth()],
          "%b" : this.__gh.months_abbrev[d.getUTCMonth()],
          "%m" : this.__gd(d.getUTCMonth() + 1),
          "%l" : d.getUTCMonth() + 1,
          "%P" : this.persianFormatTime(this.absoluteTime(dr))
        };
        for(var i in dq)ds = ds.replace(new RegExp(i, cf), dq[i]);
        return ds;
      },
      formatDuration : function(dt, du){

        var dy = cF;
        if(typeof dt !== cD || dt < 0)return dy;
        if(!du || typeof du !== L)du = K;
        var dz = this.getAbsoluteDaysDuration(dt);
        var dw = {
          'd' : dz,
          'l' : this.getPluralForm(dz),
          'h' : this.__gd(this.getRelativeHoursDuration(dt)),
          'H' : this.__gd(this.getAbsoluteHoursDuration(dt)),
          'm' : this.__gd(this.getRelativeMinutesDuration(dt)),
          'M' : this.__gd(this.getAbsoluteHoursDuration(dt)),
          's' : this.__gd(this.getRelativeSecondsDuration(dt)),
          'S' : this.__gd(this.getAbsoluteSecondsDuration(dt))
        };
        for(var i = 0,dv = du.length;i < dv;i++){

          var dx = du[i];
          if(dw.hasOwnProperty(dx)){

            dy += dw[dx];
          } else {

            dy += dx;
          };
        };
        return dy;
      },
      getAbsoluteDaysDuration : function(dA){

        if(typeof dA !== cD || dA < 0)return 0;
        return Math.floor(dA / 86400);
      },
      getPluralForm : function(dB, dD){

        if(!dD)dD = this.__gh.days_plural;
        if(dD.length === 3){

          var dC = 0;
          if(dB % 10 === 1 && dB % 100 !== 11){

            dC = 0;
          } else if(dB % 10 >= 2 && dB % 10 <= 4 && (dB % 100 < 10 || dB % 100 >= 20)){

            dC = 1;
          } else {

            dC = 2;
          };
          return dD[dC];
        };
        return cF;
      },
      getAbsoluteHoursDuration : function(dE){

        if(typeof dE !== cD || dE < 0)return 0;
        return Math.floor(dE / 3600);
      },
      getRelativeHoursDuration : function(dF){

        if(typeof dF !== cD || dF < 0)return 0;
        return Math.floor((dF - this.getAbsoluteDaysDuration(dF) * 86400) / 3600);
      },
      getAbsoluteMinutesDuration : function(dG){

        if(typeof dG !== cD || dG < 0)return 0;
        return Math.floor(dG / 60);
      },
      getRelativeMinutesDuration : function(dH){

        if(typeof dH !== cD || dH < 0)return 0;
        var dI = this.getAbsoluteHoursDuration(dH);
        return Math.floor((dH - dI * 3600) / 60);
      },
      getAbsoluteSecondsDuration : function(dJ){

        if(typeof dJ !== cD || dJ < 0)return 0;
        return dJ;
      },
      getRelativeSecondsDuration : function(dL){

        if(typeof dL !== cD || dL < 0)return cF;
        var dK = this.getAbsoluteMinutesDuration(dL);
        return dL - dK * 60;
      },
      persianFormatTime : function(dS){

        if(!dS || typeof dS != cD)return cF;
        dS = this.userTime(dS);
        var d = new Date(dS * 1000);
        var dP = [db, cL, cI, cm, M, H, cr, cG, B, cj, p, c];
        var i = 0;
        var dT = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        var dQ = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
        var dR = d.getUTCFullYear() - 1600;
        var dM = 365 * dR + parseInt((dR + 3) / 4) - parseInt((dR + 99) / 100) + parseInt((dR + 399) / 400);
        for(i = 0;i < d.getUTCMonth();i++)dM += dT[i];
        if(d.getUTCMonth() > 1 && ((!(dR % 4) && (dR % 100)) || !(dR % 400)))dM++;
        dM += d.getUTCDate() - 1;
        var dU = dM - 79;
        var dN = parseInt(dU / 12053);
        dU %= 12053;
        var dO = 979 + 33 * dN + 4 * parseInt(dU / 1461);
        dU %= 1461;
        if(dU >= 366){

          dO += parseInt((dU - 1) / 365);
          dU = (dU - 1) % 365;
        };
        for(i = 0;i < 11 && dU >= dQ[i];i++)dU -= dQ[i];
        return wialon.util.String.sprintf(da, dU + 1, dP[i], dO, d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds());
      },
      setLocale : function(dX, dW, dY, dV, ea){

        if(dX instanceof Array)this.__gh.days = dX;
        if(dW instanceof Array)this.__gh.months = dW;
        if(dY instanceof Array)this.__gh.days_abbrev = dY;
        if(dV instanceof Array)this.__gh.months_abbrev = dV;
        if(ea instanceof Array)this.__gh.days_plural = ea;
      },
      convertFormat : function(eb, ee){

        var ed = {
          "HH" : ck,
          "MMMM" : cX,
          "MMM" : g,
          "MM" : b,
          "M" : o,
          "PC" : J,
          "dddd" : cc,
          "ddd" : O,
          "dd" : cY,
          "d" : z,
          "hh" : cg,
          "mm" : cM,
          "ss" : cH,
          "tt" : cu,
          "yyyy" : W,
          "yy" : cx
        };
        var eg = {
          "%H" : cS,
          "%B" : G,
          "%b" : cP,
          "%m" : cB,
          "%l" : cJ,
          "%P" : S,
          "%A" : n,
          "%a" : Y,
          "%E" : F,
          "%e" : ch,
          "%I" : m,
          "%M" : a,
          "%S" : cn,
          "%p" : x,
          "%Y" : cR,
          "%y" : cC
        };
        var ef = /HH|MMMM|MMM|MM|M|PC|dddd|ddd|dd|d|hh|mm|ss|tt|yyyy|yy/g,ec = /%H|%B|%b|%m|%l|%P|%A|%a|%E|%e|%I|%M|%S|%p|%Y|%y/g;
        if(!ee){

          eb = eb.replace(ef, function(eh){

            return ed[eh];
          });
        } else {

          eb = eb.replace(ec, function(ei){

            return eg[ei];
          });
        };
        return eb;
      },
      getTimezone : function(){

        var ej = -(new Date()).getTimezoneOffset() * 60;
        var ek = wialon.core.Session.getInstance().getCurrUser();
        if(!ek)return ej;
        return parseInt(ek.getCustomProperty(R, ej)) >>> 0;
      },
      getTimezoneOffset : function(){

        var el = this.getTimezone();
        if((el & this.__ge.TZ_TYPE_MASK) != this.__ge.TZ_TYPE_WITH_DST)return el & this.__ge.TZ_OFFSET_MASK;
        return parseInt(el & 0x80000000 ? ((el & 0xFFFF) | 0xFFFF0000) : (el & 0xFFFF));
      },
      getDSTOffset : function(ew){

        if(!ew)return 0;
        var ep = this.getTimezone();
        var et = ep & this.__ge.TZ_TYPE_MASK;
        var eA = this.getTimezoneOffset(ep);
        if((et == this.__ge.TZ_TYPE_WITH_DST && (ep & this.__ge.TZ_DST_TYPE_MASK) == this.__ge.TZ_DST_TYPE_NONE) || (et != this.__ge.TZ_TYPE_WITH_DST && (ep & this.__ge.TZ_DISABLE_DST_BIT)))return 0;
        if((et == this.__ge.TZ_TYPE_WITH_DST && (ep & this.__ge.TZ_DST_TYPE_MASK) == this.__ge.TZ_DST_TYPE_SERVER) || et != this.__ge.TZ_TYPE_WITH_DST){

          var em = new Date();
          em.setTime(ew * 1000);
          var eu = new Date();
          eu.setTime((ew - 90 * 86400) * 1000);
          var ev = new Date();
          ev.setTime((ew + 150 * 86400) * 1000);
          if(em.getTimezoneOffset() < eu.getTimezoneOffset() || em.getTimezoneOffset() < ev.getTimezoneOffset())return 3600;
          return 0;
        };
        var er = ep & this.__ge.TZ_CUSTOM_DST_MASK;
        var ez = new Date((ew + eA) * 1000);
        var eq = ez.getTime() / 1000;
        var ey = 0;
        var en = 0;
        var ex = ez.getUTCFullYear();
        if(typeof this.__gg.from[er | ex] == cU || typeof this.__gg.to[er | ex] == cU){

          switch(er){case this.__gf.DST_MAR2SUN2AM_NOV1SUN2AM:
          ey = this.getWdayTime(ex, 2, 2, 0, 0, 2);
          en = this.getWdayTime(ex, 10, 1, 0, 0, 1);
          break;case this.__gf.DST_MAR6SUN_OCT6SUN:
          ey = this.getWdayTime(ex, 2, 6, 0);
          en = this.getWdayTime(ex, 9, 6, 0);
          break;case this.__gf.DST_MAR6SUN1AM_OCT6SUN1AM:
          ey = this.getWdayTime(ex, 2, 6, 0, 0, 1);
          en = this.getWdayTime(ex, 9, 6, 0, 1);
          break;case this.__gf.DST_MAR6FRI_OCT6FRI:
          ey = this.getWdayTime(ex, 2, 6, 5);
          en = this.getWdayTime(ex, 9, 6, 5);
          break;case this.__gf.DST_MAR6SUN2AM_OCT6SUN2AM:
          ey = this.getWdayTime(ex, 2, 6, 0, 0, 2);
          en = this.getWdayTime(ex, 9, 6, 0, 0, 2);
          if(ew > 1414281600)return 0;
          return 3600;
          break;case this.__gf.DST_MAR6FRI_OCT6FRI_SYRIA:
          ey = this.getWdayTime(ex, 2, 6, 5);
          en = this.getWdayTime(ex, 9, 6, 5);
          if(ew > 1664841600){

            return 0;
          };
          break;case this.__gf.DST_APR1SUN2AM_OCT6SUN2AM:
          ey = this.getWdayTime(ex, 3, 1, 0, 0, 2);
          en = this.getWdayTime(ex, 9, 6, 0, 0, 2);
          break;case this.__gf.DST_MAR2SUN_NOV1SUN:
          ey = this.getWdayTime(ex, 2, 2, 0, 0, 0);
          en = this.getWdayTime(ex, 10, 1, 0, 0, 0);
          break;case this.__gf.DST_MAR21_22SUN_SEP20_21SUN:
          if(this.isLeapYear(ex)){

            ey = this.getWdayTime(ex, 2, 0, -1, 21);
            en = this.getWdayTime(ex, 8, 0, -1, 20, 23, 0, 0);
          } else {

            ey = this.getWdayTime(ex, 2, 0, -1, 22);
            en = this.getWdayTime(ex, 8, 0, -1, 21, 23, 0, 0);
          };
          break;case this.__gf.DST_SEP1SUN_APR1SUN:
          ey = this.getWdayTime(ex, 8, 1, 0);
          en = this.getWdayTime(ex, 3, 1, 0);
          break;case this.__gf.DST_SEP6SUN_APR1SUN:
          ey = this.getWdayTime(ex, 8, 6, 0, 0, 2);
          en = this.getWdayTime(ex, 3, 1, 0, 0, 2);
          break;case this.__gf.DST_AUG2SUN_MAY2SUN:
          if(ew > 1546315200){

            ey = this.getWdayTime(ex, 8, 1, 0, 0, 4);
            en = this.getWdayTime(ex, 3, 1, 0, 0, 4);
          } else {

            ey = this.getWdayTime(ex, 7, 2, 0);
            en = this.getWdayTime(ex, 4, 2, 0, 0, -1);
          };
          break;case this.__gf.DST_OCT3SUN_FEB3SUN:
          ey = this.getWdayTime(ex, 9, 3, 0);
          en = this.getWdayTime(ex, 1, 3, 0, 0, -1);
          break;case this.__gf.DST_OCT1SUN_MAR6SUN:
          ey = this.getWdayTime(ex, 9, 1, 0);
          en = this.getWdayTime(ex, 2, 6, 0);
          break;case this.__gf.DST_OCT1SUN_MAR2SUN:
          ey = this.getWdayTime(ex, 9, 1, 0);
          en = this.getWdayTime(ex, 2, 2, 0);
          break;case this.__gf.DST_OCT1SUN_APR1SUN:
          ey = this.getWdayTime(ex, 9, 1, 0, 0, 2);
          en = this.getWdayTime(ex, 3, 1, 0, 0, 2);
          break;case this.__gf.DST_NOV1SUN_JAN3SUN:
          ey = this.getWdayTime(ex, 10, 1, 0, 0, 2);
          en = this.getWdayTime(ex, 0, 3, 0, 0, 2);
          break;case this.__gf.DST_OCT1SUN_APR1SUN_TASMANIA:
          ey = this.getWdayTime(ex, 9, 1, 0);
          en = this.getWdayTime(ex, 0, 3, 0);
          break;case this.__gf.DST_MAR6FRI_OCT6SUN_ISRAEL:
          ey = this.getWdayTime(ex, 2, 6, 7, 0, 0, 0, 0, 2);
          en = this.getWdayTime(ex, 9, 6, 7);
          break;default:
          return 0;};
          this.__gg.from[er | ex] = ey;
          if(en % 2 == 0)en--;
          this.__gg.to[er | ex] = en;
        } else {

          ey = this.__gg.from[er | ex];
          en = this.__gg.to[er | ex];
        };
        var es = (ep & this.__ge.TZ_DST_TYPE_MASK) == this.__ge.TZ_DST_TYPE_CUSTOM_UTC ? ey : ey - eA;
        var eo = (ep & this.__ge.TZ_DST_TYPE_MASK) == this.__ge.TZ_DST_TYPE_CUSTOM_UTC ? en : en - eA;
        if(er >= this.__gf.DST_SOUTHERN_SEMISPHERE)return (ew <= es && ew >= eo) ? 0 : 3600;
        return (ew >= es && ew <= eo) ? 3600 : 0;
      },
      isLeapYear : function(eB){

        if(eB % 4 == 0 && eB % 100 != 0)return true; else if(eB % 4 == 0 && eB % 100 == 0 && eB % 400 == 0)return true;;
        return false;
      },
      getWdayTime : function(eJ, eF, eK, eI, eE, eG, eL, eD, eH){

        var eM = new Date();
        eM.setUTCFullYear(eJ);
        eM.setUTCMonth(eF);
        eM.setUTCDate(1);
        eM.setUTCHours(0);
        eM.setUTCMilliseconds(0);
        eM.setUTCMinutes(0);
        eM.setUTCSeconds(0);
        var eC = 0;
        if(eI == -1)eC = eE; else {

          if(eM.getUTCDay() <= eI)eC = (eI - eM.getUTCDay()) + 1; else eC = 8 - (eM.getUTCDay() - eI);
          if(eK < 6){

            if(eE){

              while(eC <= eE)eC += 7;
            } else if(eK)eC += 7 * (eK - 1);;
          } else {

            var eN = this.getMonthDays(eF, eJ);
            if(eC + 4 * 7 <= eN)eC += 4 * 7; else eC += 3 * 7;
          };
        };
        if(eH){

          eC -= eH;
        };
        eM.setUTCDate(eC);
        if(eG)eM.setUTCHours(eG);
        if(eL)eM.setUTCMinutes(eL);
        if(eD)eM.setUTCSeconds(eD);
        return parseInt(eM.getTime() / 1000);
      },
      getMonthDays : function(eP, eQ){

        if(eP < 0 || !eQ)return 0;
        var eO = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if(eP >= eO.length)return 0;
        if(eP == 1 && this.getYearDays(eQ) == 365)return 29;
        return eO[eP];
      },
      getYearDays : function(eR){

        if(!eR)return 0;
        if((eR % 4) == 0){

          if((eR % 100) == 0)return ((eR % 400) == 0) ? 365 : 364;
          return 365;
        };
        return 364;
      },
      userTime : function(eS){

        return eS + this.getDSTOffset(eS) + this.getTimezoneOffset();
      },
      absoluteTime : function(eU){

        var t = eU - this.getTimezoneOffset();
        var eT = this.getDSTOffset(t);
        var eV = this.getDSTOffset(t - 3600);
        if(eT == eV)return t - eT;
        return t;
      },
      calculateFlags : function(eW, eX){

        if(!eW || typeof eW != cD)eW = 0;
        if(!eX || eX < 1 || eX > 7)eX = 1;
        return (eX << 24) | eW;
      },
      calculateInterval : function(eY, fh, fk){

        var fg = wialon.item.MReport.intervalFlag;
        var ff = wialon.core.Session.getInstance().getServerTime();
        if(fk & fg.useCurrentTime)fh = ff;
        if(fk & (fg.prevMinute | fg.prevHour | fg.prevDay | fg.prevWeek | fg.prevMonth | fg.prevYear))eY = ff;
        var d = new Date(this.userTime(eY) * 1000);
        var fb = eY - d.getUTCSeconds() - 60 * d.getUTCMinutes() - 3600 * d.getUTCHours();
        if(fk & fg.prevMinute){

          if(fk & fg.currTimeAndPrev){

            var fj = ff;
            eY = fj - 60 * fh + 1;
            fh = fj;
          } else {

            var fj = fb + (3600 * d.getUTCHours()) + (60 * d.getUTCMinutes());
            eY = fj - 60 * fh;
            fh = fj - 1;
          };
        } else if(fk & fg.prevHour){

          if(fk & fg.currTimeAndPrev){

            var fj = ff - (ff % 60);
            eY = fj - 3600 * fh;
            fh = fj - 1;
          } else {

            var fj = fb + (3600 * d.getUTCHours());
            eY = fj - 3600 * fh;
            fh = fj - 1;
          };
        } else if(fk & fg.prevDay){

          if(fk & fg.currTimeAndPrev){

            eY = fb - 86400 * (fh - 1);
            fh = ff;
          } else {

            eY = fb - 86400 * fh;
            fh = fb - 1;
          };
        } else if(fk & fg.prevWeek){

          var fl = (fk & 0x7000000) >> 24;
          if(!fl)fl = 1;
          var fe = (d.getUTCDay() - fl);
          var fa = fb - 86400 * ((fe >= 0) ? fe : (7 - Math.abs(fe)));
          if(fk & fg.currTimeAndPrev){

            eY = fa - 86400 * 7 * (fh - 1);
            fh = ff;
          } else {

            eY = fa - 86400 * 7 * fh;
            fh = fa - 1;
          };
        } else if(fk & fg.prevMonth){

          var fi = d.getUTCMonth();
          var fm = d.getUTCFullYear();
          var fc = fb - 86400 * (d.getUTCDate() - 1);
          eY = fc;
          if(fk & fg.currTimeAndPrev)fh -= 1;
          while(fh-- > 0){

            if(--fi < 0){

              fi = 11;
              if(--fm == 0)return;
            };
            eY -= 86400 * this.getMonthDays(fi, fm);
          };
          if(fk & fg.currTimeAndPrev){

            fh = ff;
          } else {

            fh = fc - 1;
          };
        } else if(fk & fg.prevYear){

          var fm = 1970;
          var fn = Math.floor(fb / 86400);
          var fd = this.getYearDays(fm) + 1;
          while(fn >= fd){

            fn -= fd;
            fd = this.getYearDays(++fm) + 1;
          };
          var fo = fb - 86400 * (++fn);
          eY = fo;
          if(fk & fg.currTimeAndPrev)fh -= 1;
          while(fh-- > 0){

            if(--fm == 0)return;
            eY -= 86400 * (this.getYearDays(fm) + 1);
          };
          if(fk & fg.currTimeAndPrev){

            fh = ff;
          } else {

            fh = fo - 1;
          };
        };;;;;
        return {
          from : eY,
          to : fh
        };
      },
      __gd : function(i){

        if(i < 10)i = V + i;
        return i;
      },
      __ge : {
        TZ_DISABLE_DST_BIT : 0x00000001,
        TZ_TYPE_MASK : 0x0C000000,
        TZ_TYPE_WITH_DST : 0x08000000,
        TZ_DST_TYPE_MASK : 0x03000000,
        TZ_DST_TYPE_NONE : 0x00000000,
        TZ_DST_TYPE_SERVER : 0x01000000,
        TZ_DST_TYPE_CUSTOM : 0x02000000,
        TZ_CUSTOM_DST_MASK : 0x00FF0000,
        TZ_DST_TYPE_CUSTOM_UTC : 0x03000000,
        TZ_OFFSET_MASK : 0xFFFFFFFE
      },
      __gf : {
        DST_MAR2SUN2AM_NOV1SUN2AM : 0x00010000,
        DST_MAR6SUN_OCT6SUN : 0x00020000,
        DST_MAR6SUN1AM_OCT6SUN1AM : 0x00030000,
        DST_MAR6FRI_OCT6FRI : 0x00040000,
        DST_MAR6SUN2AM_OCT6SUN2AM : 0x00050000,
        DST_MAR6FRI_OCT6FRI_SYRIA : 0x00060000,
        DST_APR1SUN2AM_OCT6SUN2AM : 0x00070000,
        DST_MAR2SUN_NOV1SUN : 0x00080000,
        DST_APR6THU_SEP6THU : 0x00090000,
        DST_APR6THU_UNKNOWN : 0x000A0000,
        DST_MAR21_22SUN_SEP20_21SUN : 0x000C0000,
        DST_SOUTHERN_SEMISPHERE : 0x00200000,
        DST_MAR6FRI_OCT6SUN_ISRAEL : 0x000D0000,
        DST_SEP1SUN_APR1SUN : 0x00210000,
        DST_SEP6SUN_APR1SUN : 0x00220000,
        DST_AUG2SUN_MAY2SUN : 0x00230000,
        DST_OCT3SUN_FEB3SUN : 0x00240000,
        DST_OCT1SUN_MAR6SUN : 0x00250000,
        DST_OCT1SUN_MAR2SUN : 0x00260000,
        DST_OCT1SUN_APR1SUN : 0x00270000,
        DST_OCT1SUN_APR1SUN_TASMANIA : 0x00280000,
        DST_NOV1SUN_JAN3SUN : 0x00290000
      },
      __gg : {
        from : {
        },
        to : {
        }
      },
      __gh : {
        days : [cW, cp, v, cQ, l, w, cN],
        months : [E, cv, X, cT, j, s, C, cs, ct, P, U, k],
        days_abbrev : [cV, cy, ce, cw, T, cb, cO],
        months_abbrev : [A, y, e, co, j, q, cA, f, cE, u, Q, cq],
        days_plural : [r, cK, cK]
      }
    }
  });
})();

qx.$$loader.init();
