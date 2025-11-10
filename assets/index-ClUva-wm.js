const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/dataService-BGBWI4iz.js","assets/company.service-DzCL-Ehr.js","assets/company.model-CKmygYMs.js","assets/analytics.service-Clir5Z71.js","assets/gdocs.service-DOZdgRCe.js","assets/incident.service-STftVqO6.js","assets/inbox.service-QROSO0Ey.js","assets/outbox.service-CJrIXpLI.js","assets/cart.service-D-NMxOXL.js","assets/product.service-D2mQ2hSR.js","assets/product.model-uhuUaOub.js","assets/quote.service-CAdkjEqz.js","assets/quote.model-CvL1ADQq.js","assets/contract.service-CVf_rSeu.js","assets/contract.model-CkFP52sg.js","assets/pricelist.service-mNTFejRJ.js","assets/pricelist.model-B2sEL8yC.js"])))=>i.map(i=>d[i]);
(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function t(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(n){if(n.ep)return;n.ep=!0;const r=t(n);fetch(n.href,r)}})();window.__BASE_URL="/lit-spa/";window.withBase=s=>s?.startsWith("http")?s:"/lit-spa/"+(s||"").replace(/^\//,"");window.go=s=>{window.location.href=window.withBase(s)};const Ae=sessionStorage.redirect;Ae&&Ae!==location.href&&(sessionStorage.removeItem("redirect"),history.replaceState(null,null,Ae));/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Z=globalThis,ce=Z.ShadowRoot&&(Z.ShadyCSS===void 0||Z.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Ge=Symbol(),mt=new WeakMap;let Je=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==Ge)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(ce&&e===void 0){const i=t!==void 0&&t.length===1;i&&(e=mt.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&mt.set(t,e))}return e}toString(){return this.cssText}};const zt=s=>new Je(typeof s=="string"?s:s+"",void 0,Ge),Bt=(s,...e)=>{const t=s.length===1?s[0]:e.reduce((i,n,r)=>i+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+s[r+1],s[0]);return new Je(t,s,Ge)},Ft=(s,e)=>{if(ce)s.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const t of e){const i=document.createElement("style"),n=Z.litNonce;n!==void 0&&i.setAttribute("nonce",n),i.textContent=t.cssText,s.appendChild(i)}},Ue=ce?s=>s:s=>s instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return zt(t)})(s):s;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:si,defineProperty:ii,getOwnPropertyDescriptor:ni,getOwnPropertyNames:ri,getOwnPropertySymbols:oi,getPrototypeOf:ai}=Object,le=globalThis,ft=le.trustedTypes,ci=ft?ft.emptyScript:"",li=le.reactiveElementPolyfillSupport,q=(s,e)=>s,te={toAttribute(s,e){switch(e){case Boolean:s=s?ci:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,e){let t=s;switch(e){case Boolean:t=s!==null;break;case Number:t=s===null?null:Number(s);break;case Object:case Array:try{t=JSON.parse(s)}catch{t=null}}return t}},We=(s,e)=>!si(s,e),gt={attribute:!0,type:String,converter:te,reflect:!1,useDefault:!1,hasChanged:We};Symbol.metadata??=Symbol("metadata"),le.litPropertyMetadata??=new WeakMap;let T=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=gt){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),n=this.getPropertyDescriptor(e,i,t);n!==void 0&&ii(this.prototype,e,n)}}static getPropertyDescriptor(e,t,i){const{get:n,set:r}=ni(this.prototype,e)??{get(){return this[t]},set(o){this[t]=o}};return{get:n,set(o){const a=n?.call(this);r?.call(this,o),this.requestUpdate(e,a,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??gt}static _$Ei(){if(this.hasOwnProperty(q("elementProperties")))return;const e=ai(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(q("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(q("properties"))){const t=this.properties,i=[...ri(t),...oi(t)];for(const n of i)this.createProperty(n,t[n])}const e=this[Symbol.metadata];if(e!==null){const t=litPropertyMetadata.get(e);if(t!==void 0)for(const[i,n]of t)this.elementProperties.set(i,n)}this._$Eh=new Map;for(const[t,i]of this.elementProperties){const n=this._$Eu(t,i);n!==void 0&&this._$Eh.set(n,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const n of i)t.unshift(Ue(n))}else e!==void 0&&t.push(Ue(e));return t}static _$Eu(e,t){const i=t.attribute;return i===!1?void 0:typeof i=="string"?i:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ft(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),n=this.constructor._$Eu(e,i);if(n!==void 0&&i.reflect===!0){const r=(i.converter?.toAttribute!==void 0?i.converter:te).toAttribute(t,i.type);this._$Em=e,r==null?this.removeAttribute(n):this.setAttribute(n,r),this._$Em=null}}_$AK(e,t){const i=this.constructor,n=i._$Eh.get(e);if(n!==void 0&&this._$Em!==n){const r=i.getPropertyOptions(n),o=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:te;this._$Em=n;const a=o.fromAttribute(t,r.type);this[n]=a??this._$Ej?.get(n)??a,this._$Em=null}}requestUpdate(e,t,i){if(e!==void 0){const n=this.constructor,r=this[e];if(i??=n.getPropertyOptions(e),!((i.hasChanged??We)(r,t)||i.useDefault&&i.reflect&&r===this._$Ej?.get(e)&&!this.hasAttribute(n._$Eu(e,i))))return;this.C(e,t,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:n,wrapped:r},o){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,o??t??this[e]),r!==!0||o!==void 0)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),n===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[n,r]of this._$Ep)this[n]=r;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[n,r]of i){const{wrapped:o}=r,a=this[n];o!==!0||this._$AL.has(n)||a===void 0||this.C(n,void 0,r,a)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(t)):this._$EM()}catch(i){throw e=!1,this._$EM(),i}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};T.elementStyles=[],T.shadowRootOptions={mode:"open"},T[q("elementProperties")]=new Map,T[q("finalized")]=new Map,li?.({ReactiveElement:T}),(le.reactiveElementVersions??=[]).push("2.1.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ye=globalThis,se=Ye.trustedTypes,bt=se?se.createPolicy("lit-html",{createHTML:s=>s}):void 0,qt="$lit$",P=`lit$${Math.random().toFixed(9).slice(2)}$`,Ht="?"+P,di=`<${Ht}>`,N=document,G=()=>N.createComment(""),J=s=>s===null||typeof s!="object"&&typeof s!="function",Ke=Array.isArray,ui=s=>Ke(s)||typeof s?.[Symbol.iterator]=="function",xe=`[ 	
\f\r]`,B=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_t=/-->/g,yt=/>/g,k=RegExp(`>|${xe}(?:([^\\s"'>=/]+)(${xe}*=${xe}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),vt=/'/g,wt=/"/g,Vt=/^(?:script|style|textarea|title)$/i,hi=s=>(e,...t)=>({_$litType$:s,strings:e,values:t}),h=hi(1),A=Symbol.for("lit-noChange"),y=Symbol.for("lit-nothing"),$t=new WeakMap,U=N.createTreeWalker(N,129);function Gt(s,e){if(!Ke(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return bt!==void 0?bt.createHTML(e):e}const pi=(s,e)=>{const t=s.length-1,i=[];let n,r=e===2?"<svg>":e===3?"<math>":"",o=B;for(let a=0;a<t;a++){const c=s[a];let l,p,u=-1,b=0;for(;b<c.length&&(o.lastIndex=b,p=o.exec(c),p!==null);)b=o.lastIndex,o===B?p[1]==="!--"?o=_t:p[1]!==void 0?o=yt:p[2]!==void 0?(Vt.test(p[2])&&(n=RegExp("</"+p[2],"g")),o=k):p[3]!==void 0&&(o=k):o===k?p[0]===">"?(o=n??B,u=-1):p[1]===void 0?u=-2:(u=o.lastIndex-p[2].length,l=p[1],o=p[3]===void 0?k:p[3]==='"'?wt:vt):o===wt||o===vt?o=k:o===_t||o===yt?o=B:(o=k,n=void 0);const f=o===k&&s[a+1].startsWith("/>")?" ":"";r+=o===B?c+di:u>=0?(i.push(l),c.slice(0,u)+qt+c.slice(u)+P+f):c+P+(u===-2?a:f)}return[Gt(s,r+(s[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),i]};let Ne=class Jt{constructor({strings:e,_$litType$:t},i){let n;this.parts=[];let r=0,o=0;const a=e.length-1,c=this.parts,[l,p]=pi(e,t);if(this.el=Jt.createElement(l,i),U.currentNode=this.el.content,t===2||t===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(n=U.nextNode())!==null&&c.length<a;){if(n.nodeType===1){if(n.hasAttributes())for(const u of n.getAttributeNames())if(u.endsWith(qt)){const b=p[o++],f=n.getAttribute(u).split(P),v=/([.?@])?(.*)/.exec(b);c.push({type:1,index:r,name:v[2],strings:f,ctor:v[1]==="."?fi:v[1]==="?"?gi:v[1]==="@"?bi:ue}),n.removeAttribute(u)}else u.startsWith(P)&&(c.push({type:6,index:r}),n.removeAttribute(u));if(Vt.test(n.tagName)){const u=n.textContent.split(P),b=u.length-1;if(b>0){n.textContent=se?se.emptyScript:"";for(let f=0;f<b;f++)n.append(u[f],G()),U.nextNode(),c.push({type:2,index:++r});n.append(u[b],G())}}}else if(n.nodeType===8)if(n.data===Ht)c.push({type:2,index:r});else{let u=-1;for(;(u=n.data.indexOf(P,u+1))!==-1;)c.push({type:7,index:r}),u+=P.length-1}r++}}static createElement(e,t){const i=N.createElement("template");return i.innerHTML=e,i}};function D(s,e,t=s,i){if(e===A)return e;let n=i!==void 0?t._$Co?.[i]:t._$Cl;const r=J(e)?void 0:e._$litDirective$;return n?.constructor!==r&&(n?._$AO?.(!1),r===void 0?n=void 0:(n=new r(s),n._$AT(s,t,i)),i!==void 0?(t._$Co??=[])[i]=n:t._$Cl=n),n!==void 0&&(e=D(s,n._$AS(s,e.values),n,i)),e}let mi=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,n=(e?.creationScope??N).importNode(t,!0);U.currentNode=n;let r=U.nextNode(),o=0,a=0,c=i[0];for(;c!==void 0;){if(o===c.index){let l;c.type===2?l=new de(r,r.nextSibling,this,e):c.type===1?l=new c.ctor(r,c.name,c.strings,this,e):c.type===6&&(l=new _i(r,this,e)),this._$AV.push(l),c=i[++a]}o!==c?.index&&(r=U.nextNode(),o++)}return U.currentNode=N,n}p(e){let t=0;for(const i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}},de=class Wt{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,n){this.type=2,this._$AH=y,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=D(this,e,t),J(e)?e===y||e==null||e===""?(this._$AH!==y&&this._$AR(),this._$AH=y):e!==this._$AH&&e!==A&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):ui(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==y&&J(this._$AH)?this._$AA.nextSibling.data=e:this.T(N.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,n=typeof i=="number"?this._$AC(e):(i.el===void 0&&(i.el=Ne.createElement(Gt(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===n)this._$AH.p(t);else{const r=new mi(n,this),o=r.u(this.options);r.p(t),this.T(o),this._$AH=r}}_$AC(e){let t=$t.get(e.strings);return t===void 0&&$t.set(e.strings,t=new Ne(e)),t}k(e){Ke(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,n=0;for(const r of e)n===t.length?t.push(i=new Wt(this.O(G()),this.O(G()),this,this.options)):i=t[n],i._$AI(r),n++;n<t.length&&(this._$AR(i&&i._$AB.nextSibling,n),t.length=n)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const i=e.nextSibling;e.remove(),e=i}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}};class ue{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,n,r){this.type=1,this._$AH=y,this._$AN=void 0,this.element=e,this.name=t,this._$AM=n,this.options=r,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=y}_$AI(e,t=this,i,n){const r=this.strings;let o=!1;if(r===void 0)e=D(this,e,t,0),o=!J(e)||e!==this._$AH&&e!==A,o&&(this._$AH=e);else{const a=e;let c,l;for(e=r[0],c=0;c<r.length-1;c++)l=D(this,a[i+c],t,c),l===A&&(l=this._$AH[c]),o||=!J(l)||l!==this._$AH[c],l===y?e=y:e!==y&&(e+=(l??"")+r[c+1]),this._$AH[c]=l}o&&!n&&this.j(e)}j(e){e===y?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}let fi=class extends ue{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===y?void 0:e}},gi=class extends ue{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==y)}};class bi extends ue{constructor(e,t,i,n,r){super(e,t,i,n,r),this.type=5}_$AI(e,t=this){if((e=D(this,e,t,0)??y)===A)return;const i=this._$AH,n=e===y&&i!==y||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,r=e!==y&&(i===y||n);n&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}let _i=class{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){D(this,e)}};const Yt={I:de},yi=Ye.litHtmlPolyfillSupport;yi?.(Ne,de),(Ye.litHtmlVersions??=[]).push("3.3.1");const Kt=(s,e,t)=>{const i=t?.renderBefore??e;let n=i._$litPart$;if(n===void 0){const r=t?.renderBefore??null;i._$litPart$=n=new de(e.insertBefore(G(),r),r,void 0,t??{})}return n._$AI(s),n};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Xe=globalThis;let w=class extends T{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Kt(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return A}};w._$litElement$=!0,w.finalized=!0,Xe.litElementHydrateSupport?.({LitElement:w});const vi=Xe.litElementPolyfillSupport;vi?.({LitElement:w});(Xe.litElementVersions??=[]).push("4.2.1");const wi=Object.freeze(Object.defineProperty({__proto__:null,CSSResult:Je,LitElement:w,ReactiveElement:T,_$LH:Yt,adoptStyles:Ft,css:Bt,defaultConverter:te,getCompatibleStyle:Ue,html:h,noChange:A,notEqual:We,nothing:y,render:Kt,supportsAdoptingStyleSheets:ce,unsafeCSS:zt},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Et=new WeakMap,At=s=>{if((t=>t.pattern!==void 0)(s))return s.pattern;let e=Et.get(s);return e===void 0&&Et.set(s,e=new URLPattern({pathname:s.path})),e};let $i=class{constructor(e,t,i){this.routes=[],this.o=[],this.t={},this.i=n=>{if(n.routes===this)return;const r=n.routes;this.o.push(r),r.h=this,n.stopImmediatePropagation(),n.onDisconnect=()=>{this.o?.splice(this.o.indexOf(r)>>>0,1)};const o=xt(this.t);o!==void 0&&r.goto(o)},(this.l=e).addController(this),this.routes=[...t],this.fallback=i?.fallback}link(e){if(e?.startsWith("/"))return e;if(e?.startsWith("."))throw Error("Not implemented");return e??=this.u,(this.h?.link()??"")+e}async goto(e){let t;if(this.routes.length===0&&this.fallback===void 0)t=e,this.u="",this.t={0:t};else{const i=this.p(e);if(i===void 0)throw Error("No route found for "+e);const n=At(i).exec({pathname:e}),r=n?.pathname.groups??{};if(t=xt(r),typeof i.enter=="function"&&await i.enter(r)===!1)return;this.v=i,this.t=r,this.u=t===void 0?e:e.substring(0,e.length-t.length)}if(t!==void 0)for(const i of this.o)i.goto(t);this.l.requestUpdate()}outlet(){return this.v?.render?.(this.t)}get params(){return this.t}p(e){const t=this.routes.find(i=>At(i).test({pathname:e}));return t||this.fallback===void 0?t:this.fallback?{...this.fallback,path:"/*"}:void 0}hostConnected(){this.l.addEventListener(Le.eventName,this.i);const e=new Le(this);this.l.dispatchEvent(e),this._=e.onDisconnect}hostDisconnected(){this._?.(),this.h=void 0}};const xt=s=>{let e;for(const t of Object.keys(s))/\d+/.test(t)&&(e===void 0||t>e)&&(e=t);return e&&s[e]};let Le=class Xt extends Event{constructor(e){super(Xt.eventName,{bubbles:!0,composed:!0,cancelable:!1}),this.routes=e}};Le.eventName="lit-routes-connected";/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ei=location.origin||location.protocol+"//"+location.host;let St=class extends $i{constructor(){super(...arguments),this.m=e=>{const t=e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey;if(e.defaultPrevented||t)return;const i=e.composedPath().find(o=>o.tagName==="A");if(i===void 0||i.target!==""||i.hasAttribute("download")||i.getAttribute("rel")==="external")return;const n=i.href;if(n===""||n.startsWith("mailto:"))return;const r=window.location;i.origin===Ei&&(e.preventDefault(),n!==r.href&&(window.history.pushState({},"",n),this.goto(i.pathname)))},this.R=e=>{this.goto(window.location.pathname)}}hostConnected(){super.hostConnected(),window.addEventListener("click",this.m),window.addEventListener("popstate",this.R),this.goto(window.location.pathname)}hostDisconnected(){super.hostDisconnected(),window.removeEventListener("click",this.m),window.removeEventListener("popstate",this.R)}};const Ai="modulepreload",xi=function(s){return"/lit-spa/"+s},Rt={},g=function(e,t,i){let n=Promise.resolve();if(t&&t.length>0){document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),a=o?.nonce||o?.getAttribute("nonce");n=Promise.allSettled(t.map(c=>{if(c=xi(c),c in Rt)return;Rt[c]=!0;const l=c.endsWith(".css"),p=l?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${p}`))return;const u=document.createElement("link");if(u.rel=l?"stylesheet":Ai,l||(u.as="script"),u.crossOrigin="",u.href=c,a&&u.setAttribute("nonce",a),document.head.appendChild(u),l)return new Promise((b,f)=>{u.addEventListener("load",b),u.addEventListener("error",()=>f(new Error(`Unable to preload CSS for ${c}`)))})}))}function r(o){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=o,window.dispatchEvent(a),!a.defaultPrevented)throw o}return n.then(o=>{for(const a of o||[])a.status==="rejected"&&r(a.reason);return e().catch(r)})},Si=300,Zt=!0,Ri=()=>(window.__BASE_URL||"/").replace(/\/$/,"")+"/mocks",Ci=Ri();async function he(s,e={}){try{Zt&&await new Promise(r=>setTimeout(r,Si));const t=`${Ci}${s}`,i=localStorage.getItem("auth_token"),n=await fetch(t,{...e,headers:{"Content-Type":"application/json",Authorization:i?`Bearer ${i}`:"",...e.headers}});if(!n.ok)throw new Error(`API Error: ${n.status} ${n.statusText}`);return await n.json()}catch(t){throw console.error("API Request Error:",t),t}}async function pe(s){return he(s,{method:"GET"})}async function Oi(s,e){return he(s,{method:"POST",body:JSON.stringify(e)})}async function Ii(s,e){return he(s,{method:"PUT",body:JSON.stringify(e)})}async function Pi(s){return he(s,{method:"DELETE"})}const Qt=s=>new Promise(e=>setTimeout(e,s));function ki(){return Zt}const Mi=Object.freeze(Object.defineProperty({__proto__:null,del:Pi,delay:Qt,get:pe,isMockMode:ki,post:Oi,put:Ii},Symbol.toStringTag,{value:"Module"}));class Ti extends Error{}Ti.prototype.name="InvalidTokenError";var ie=(s=>(s[s.NONE=0]="NONE",s[s.ERROR=1]="ERROR",s[s.WARN=2]="WARN",s[s.INFO=3]="INFO",s[s.DEBUG=4]="DEBUG",s))(ie||{});(s=>{function e(){}s.reset=e;function t(n){if(!(0<=n&&n<=4))throw new Error("Invalid log level")}s.setLevel=t;function i(n){}s.setLogger=i})(ie||(ie={}));ie.reset();function Ui(){return null}function Ni(){return Ui()}async function Li(){const s=Ni();if(!s)throw new Error("OIDC is not enabled");return await s.signinRedirectCallback()}function Di(s){if(!s)return null;const e=s.profile;return{id:e.sub||e.user_id||e.id,username:e.preferred_username||e.username||e.email,email:e.email,name:e.name||e.given_name+" "+e.family_name,role:e.role||e.roles?.[0]||"user",assignedRoles:e.roles||e.role?[e.role]:[],oidcProfile:e,accessToken:s.access_token,idToken:s.id_token,tokenType:s.token_type,expiresAt:s.expires_at}}const Ze="auth_token",Qe="auth_user";let Se=null;async function ji(){return Se||(Se=await pe("/authUsers.json")),Se}function zi(s){const e=btoa(JSON.stringify({alg:"HS256",typ:"JWT"})),t=btoa(JSON.stringify({userId:s.id,username:s.username,email:s.email,role:s.role,name:s.name,exp:Date.now()+24*60*60*1e3})),i=btoa("mock-signature");return`${e}.${t}.${i}`}function Bi(s){try{const e=s.split(".");if(e.length!==3)return null;const t=JSON.parse(atob(e[1]));return t.exp&&t.exp<Date.now()?null:t}catch{return null}}async function Fi(s,e){const i=(await ji()).find(f=>f.username===s&&f.password===e);if(!i)throw new Error("Invalid username or password");const{getUsers:n}=await g(async()=>{const{getUsers:f}=await Promise.resolve().then(()=>Ys);return{getUsers:f}},void 0),r=await n(),a=r.find(f=>f.id===i.id)?.assignedRoles||[],c=zi(i),l={id:i.id,username:i.username,email:i.email,role:i.role,name:i.name,assignedRoles:a};localStorage.setItem(Ze,c),localStorage.setItem(Qe,JSON.stringify(l));const{getRoles:p}=await g(async()=>{const{getRoles:f}=await Promise.resolve().then(()=>Js);return{getRoles:f}},void 0),{initializePermissionCache:u}=await g(async()=>{const{initializePermissionCache:f}=await Promise.resolve().then(()=>Fe);return{initializePermissionCache:f}},void 0),b=await p();return await u(r,b),{token:c,user:l}}async function qi(){try{localStorage.removeItem("impersonation_state")}catch{}localStorage.removeItem(Ze),localStorage.removeItem(Qe)}function Hi(){return localStorage.getItem(Ze)}function S(){try{const t=localStorage.getItem("impersonation_state");if(t){const i=JSON.parse(t);if(i.isImpersonating&&i.impersonatedUser)return i.impersonatedUser}}catch{}const s=localStorage.getItem(Qe);if(!s)return null;try{return JSON.parse(s)}catch{return null}}async function go(){return S()}function me(){const s=Hi();return s?Bi(s)!==null:!1}async function bo(){return me()}function _o(){return!!me()}async function Vi(){return S()}let es=class{constructor(e,t){this.operator=e,this.value=t,Object.defineProperty(this,"t",{writable:!0})}get notes(){return this.t}addNote(e){this.t=this.t||[],this.t.push(e)}},et=class extends es{},fe=class extends et{constructor(e,t){if(!Array.isArray(t))throw new Error(`"${e}" operator expects to receive an array of conditions`);super(e,t)}};const W="__itself__";let ge=class extends es{constructor(e,t,i){super(e,i),this.field=t}};const ts=new et("__null__",null),De=Object.prototype.hasOwnProperty.call.bind(Object.prototype.hasOwnProperty);function Gi(s,e){return e instanceof fe&&e.operator===s}function ss(s,e){return e.length===1?e[0]:new fe(s,function t(i,n,r){const o=r||[];for(let a=0,c=n.length;a<c;a++){const l=n[a];Gi(i,l)?t(i,l.value,o):o.push(l)}return o}(s,e))}const Ji=s=>s,is=()=>Object.create(null),ns=Object.defineProperty(is(),"__@type@__",{value:"ignore value"});function Wi(s,e,t=!1){if(!s||s&&s.constructor!==Object)return!1;for(const i in s)if(De(s,i)&&De(e,i)&&(!t||s[i]!==ns))return!0;return!1}function Yi(s){const e=[];for(const t in s)De(s,t)&&s[t]!==ns&&e.push(t);return e}function Re(s,e){e!==ts&&s.push(e)}const rs=s=>ss("and",s),os={compound(s,e,t){const i=(Array.isArray(e)?e:[e]).map(n=>t.parse(n));return new fe(s.name,i)},field:(s,e,t)=>new ge(s.name,t.field,e),document:(s,e)=>new et(s.name,e)};let Ki=class{constructor(e,t=is()){this.o=void 0,this.s=void 0,this.i=void 0,this.u=void 0,this.h=void 0,this.parse=this.parse.bind(this),this.u={operatorToConditionName:t.operatorToConditionName||Ji,defaultOperatorName:t.defaultOperatorName||"eq",mergeFinalConditions:t.mergeFinalConditions||rs},this.o=Object.keys(e).reduce((i,n)=>(i[n]=Object.assign({name:this.u.operatorToConditionName(n)},e[n]),i),{}),this.s=Object.assign({},t.fieldContext,{field:"",query:{},parse:this.parse,hasOperators:i=>Wi(i,this.o,t.useIgnoreValue)}),this.i=Object.assign({},t.documentContext,{parse:this.parse,query:{}}),this.h=t.useIgnoreValue?Yi:Object.keys}setParse(e){this.parse=e,this.s.parse=e,this.i.parse=e}parseField(e,t,i,n){const r=this.o[t];if(!r)throw new Error(`Unsupported operator "${t}"`);if(r.type!=="field")throw new Error(`Unexpected ${r.type} operator "${t}" at field level`);return this.s.field=e,this.s.query=n,this.parseInstruction(r,i,this.s)}parseInstruction(e,t,i){return typeof e.validate=="function"&&e.validate(e,t),(e.parse||os[e.type])(e,t,i)}parseFieldOperators(e,t){const i=[],n=this.h(t);for(let r=0,o=n.length;r<o;r++){const a=n[r];if(!this.o[a])throw new Error(`Field query for "${e}" may contain only operators or a plain object as a value`);Re(i,this.parseField(e,a,t[a],t))}return i}parse(e){const t=[],i=this.h(e);this.i.query=e;for(let n=0,r=i.length;n<r;n++){const o=i[n],a=e[o],c=this.o[o];if(c){if(c.type!=="document"&&c.type!=="compound")throw new Error(`Cannot use parsing instruction for operator "${o}" in "document" context as it is supposed to be used in  "${c.type}" context`);Re(t,this.parseInstruction(c,a,this.i))}else this.s.hasOperators(a)?t.push(...this.parseFieldOperators(o,a)):Re(t,this.parseField(o,this.u.defaultOperatorName,a,e))}return this.u.mergeFinalConditions(t)}};function Ce(s,e){const t=s[e];if(typeof t!="function")throw new Error(`Unable to interpret "${e}" condition. Did you forget to register interpreter for it?`);return t}function Xi(s){return s.operator}function Zi(s,e){const t=e,i=t&&t.getInterpreterName||Xi;let n;switch(t?t.numberOfArguments:0){case 1:n=o=>{const a=i(o,t);return Ce(s,a)(o,r)};break;case 3:n=(o,a,c)=>{const l=i(o,t);return Ce(s,l)(o,a,c,r)};break;default:n=(o,a)=>{const c=i(o,t);return Ce(s,c)(o,a,r)}}const r=Object.assign({},t,{interpret:n});return r.interpret}function Qi(s,e){return(t,...i)=>{const n=s(t,...i),r=e.bind(null,n);return r.ast=n,r}}function as(s,e){if(!Array.isArray(e))throw new Error(`"${s.name}" expects value to be an array`)}function cs(s,e){if(as(s,e),!e.length)throw new Error(`"${s.name}" expects to have at least one element in array`)}const tt=s=>(e,t)=>{if(typeof t!==s)throw new Error(`"${e.name}" expects value to be a "${s}"`)},ls={type:"compound",validate:cs,parse(s,e,{parse:t}){const i=e.map(n=>t(n));return ss(s.name,i)}},en=ls,tn={type:"compound",validate:cs},sn={type:"field",validate(s,e){if(!(e&&(e instanceof RegExp||e.constructor===Object)))throw new Error(`"${s.name}" expects to receive either regular expression or object of field operators`)},parse(s,e,t){const i=e instanceof RegExp?new ge("regex",t.field,e):t.parse(e,t);return new fe(s.name,[i])}},ds={type:"field",validate(s,e){if(!e||e.constructor!==Object)throw new Error(`"${s.name}" expects to receive an object with nested query or field level operators`)},parse(s,e,{parse:t,field:i,hasOperators:n}){const r=n(e)?t(e,{field:W}):t(e);return new ge(s.name,i,r)}},us={type:"field",validate:tt("number")},be={type:"field",validate:as},hs=be,ps=be,nn={type:"field",validate(s,e){if(!Array.isArray(e)||e.length!==2)throw new Error(`"${s.name}" expects an array with 2 numeric elements`)}},ms={type:"field",validate:tt("boolean")},st={type:"field",validate:function(s,e){if(!(typeof e=="string"||typeof e=="number"||e instanceof Date))throw new Error(`"${s.name}" expects value to be comparable (i.e., string, number or date)`)}},_e=st,fs=_e,gs=_e,it={type:"field"},bs=it,_s={type:"field",validate(s,e){if(!(e instanceof RegExp)&&typeof e!="string")throw new Error(`"${s.name}" expects value to be a regular expression or a string that represents regular expression`)},parse(s,e,t){const i=typeof e=="string"?new RegExp(e,t.query.$options||""):e;return new ge(s.name,t.field,i)}},ys={type:"field",parse:()=>ts},rn={type:"document",validate:tt("function")};var on=Object.freeze({__proto__:null,$and:ls,$or:en,$nor:tn,$not:sn,$elemMatch:ds,$size:us,$in:be,$nin:hs,$all:ps,$mod:nn,$exists:ms,$gte:st,$gt:_e,$lt:fs,$lte:gs,$eq:it,$ne:bs,$regex:_s,$options:ys,$where:rn});let an=class extends Ki{constructor(e){super(e,{defaultOperatorName:"$eq",operatorToConditionName:t=>t.slice(1)})}parse(e,t){return t&&t.field?rs(this.parseFieldOperators(t.field,e)):super.parse(e)}};const je=on;function nt(s,e,t){for(let i=0,n=s.length;i<n;i++)if(t(s[i],e)===0)return!0;return!1}function rt(s,e){return Array.isArray(s)&&Number.isNaN(Number(e))}function Ct(s,e,t){if(!rt(s,e))return t(s,e);let i=[];for(let n=0;n<s.length;n++){const r=t(s[n],e);r!==void 0&&(i=i.concat(r))}return i}function L(s){return(e,t,i)=>{const n=i.get(t,e.field);return Array.isArray(n)?n.some(r=>s(e,r,i)):s(e,n,i)}}const cn=(s,e)=>s[e];function vs(s,e,t){const i=e.lastIndexOf(".");return i===-1?[s,e]:[t(s,e.slice(0,i)),e.slice(i+1)]}function ln(s,e,t=cn){if(e===W)return s;if(!s)throw new Error(`Unable to get field "${e}" out of ${String(s)}.`);return function(i,n,r){if(n.indexOf(".")===-1)return Ct(i,n,r);const o=n.split(".");let a=i;for(let c=0,l=o.length;c<l;c++)if(a=Ct(a,o[c],r),!a||typeof a!="object")return a;return a}(s,e,t)}function ws(s,e){return s===e?0:s>e?1:-1}function $s(s,e={}){return Zi(s,Object.assign({get:ln,compare:ws},e))}const Es=(s,e,{interpret:t})=>s.value.some(i=>t(i,e)),dn=(s,e,t)=>!Es(s,e,t),As=(s,e,{interpret:t})=>s.value.every(i=>t(i,e)),un=(s,e,{interpret:t})=>!t(s.value[0],e),ot=(s,e,{compare:t,get:i})=>{const n=i(e,s.field);return Array.isArray(n)&&!Array.isArray(s.value)?nt(n,s.value,t):t(n,s.value)===0},xs=(s,e,t)=>!ot(s,e,t),Ss=L((s,e,t)=>{const i=t.compare(e,s.value);return i===0||i===-1}),Rs=L((s,e,t)=>t.compare(e,s.value)===-1),Cs=L((s,e,t)=>t.compare(e,s.value)===1),Os=L((s,e,t)=>{const i=t.compare(e,s.value);return i===0||i===1}),Is=(s,e,{get:t})=>{if(s.field===W)return e!==void 0;const[i,n]=vs(e,s.field,t),r=o=>o==null?!!o===s.value:o.hasOwnProperty(n)===s.value;return rt(i,n)?i.some(r):r(i)},hn=L((s,e)=>typeof e=="number"&&e%s.value[0]===s.value[1]),Ps=(s,e,{get:t})=>{const[i,n]=vs(e,s.field,t),r=o=>{const a=t(o,n);return Array.isArray(a)&&a.length===s.value};return s.field!==W&&rt(i,n)?i.some(r):r(i)},ks=L((s,e)=>typeof e=="string"&&s.value.test(e)),ye=L((s,e,{compare:t})=>nt(s.value,e,t)),Ms=(s,e,t)=>!ye(s,e,t),Ts=(s,e,{compare:t,get:i})=>{const n=i(e,s.field);return Array.isArray(n)&&s.value.every(r=>nt(n,r,t))},Us=(s,e,{interpret:t,get:i})=>{const n=i(e,s.field);return Array.isArray(n)&&n.some(r=>t(s.value,r))},pn=(s,e)=>s.value.call(e);var mn=Object.freeze({__proto__:null,or:Es,nor:dn,and:As,not:un,eq:ot,ne:xs,lte:Ss,lt:Rs,gt:Cs,gte:Os,exists:Is,mod:hn,size:Ps,regex:ks,within:ye,nin:Ms,all:Ts,elemMatch:Us,where:pn});const at=Object.assign({},mn,{in:ye});$s(at);function Ot(s){return s===null||typeof s!="object"?s:s instanceof Date?s.getTime():s&&typeof s.toJSON=="function"?s.toJSON():s}const fn=(s,e)=>ws(Ot(s),Ot(e));function ct(s,e,t){const i=new an(s),n=$s(e,Object.assign({compare:fn},t));if(t&&t.forPrimitives){const r={field:W},o=i.parse;i.setParse(a=>o(a,r))}return Qi(i.parse,n)}ct(je,at);ct(["$and","$or"].reduce((s,e)=>(s[e]=Object.assign({},s[e],{type:"field"}),s),Object.assign({},je,{$nor:Object.assign({},je.$nor,{type:"field",parse:os.compound})})),at,{forPrimitives:!0});function ze(s){return Array.isArray(s)?s:[s]}const It="__caslSubjectType__",Q=s=>{const e=typeof s;return e==="string"||e==="function"},gn=s=>s.modelName||s.name;function Ns(s){return Object.hasOwn(s,It)?s[It]:gn(s.constructor)}const Pt={function:s=>s.constructor,string:Ns};function kt(s,e,t){for(let i=t;i<e.length;i++)s.push(e[i])}function Mt(s,e){if(!s||!s.length)return e||[];if(!e||!e.length)return s||[];let t=0,i=0;const n=[];for(;t<s.length&&i<e.length;)s[t].priority<e[i].priority?(n.push(s[t]),t++):(n.push(e[i]),i++);return kt(n,s,t),kt(n,e,i),n}function X(s,e,t){let i=s.get(e);return i||(i=t(),s.set(e,i)),i}const bn=s=>s;function _n(s,e){if(Array.isArray(s.fields)&&!s.fields.length)throw new Error("`rawRule.fields` cannot be an empty array. https://bit.ly/390miLa");if(s.fields&&!e.fieldMatcher)throw new Error('You need to pass "fieldMatcher" option in order to restrict access by fields');if(s.conditions&&!e.conditionsMatcher)throw new Error('You need to pass "conditionsMatcher" option in order to restrict access by conditions')}class yn{constructor(e,t,i=0){_n(e,t),this.action=t.resolveAction(e.action),this.subject=e.subject,this.inverted=!!e.inverted,this.conditions=e.conditions,this.reason=e.reason,this.origin=e,this.fields=e.fields?ze(e.fields):void 0,this.priority=i,this.t=t}i(){return this.conditions&&!this.o&&(this.o=this.t.conditionsMatcher(this.conditions)),this.o}get ast(){const e=this.i();return e?e.ast:void 0}matchesConditions(e){return this.conditions?!e||Q(e)?!this.inverted:this.i()(e):!0}matchesField(e){return this.fields?e?(this.u||(this.u=this.t.fieldMatcher(this.fields)),this.u(e)):!this.inverted:!0}}function vn(s,e){const t={value:s,prev:e,next:null};return e&&(e.next=t),t}function wn(s){s.next&&(s.next.prev=s.prev),s.prev&&(s.prev.next=s.next),s.next=s.prev=null}const $n=s=>({value:s.value,prev:s.prev,next:s.next}),Tt=()=>({rules:[],merged:!1}),Ut=()=>new Map;class En{constructor(e=[],t={}){this.h=!1,this.l=new Map,this.p={conditionsMatcher:t.conditionsMatcher,fieldMatcher:t.fieldMatcher,resolveAction:t.resolveAction||bn},this.$=t.anyAction||"manage",this.A=t.anySubjectType||"all",this.m=e,this.M=!!t.detectSubjectType,this.j=t.detectSubjectType||Ns,this.v(e)}get rules(){return this.m}detectSubjectType(e){return Q(e)?e:e?this.j(e):this.A}update(e){const t={rules:e,ability:this,target:this};return this._("update",t),this.m=e,this.v(e),this._("updated",t),this}v(e){const t=new Map;let i;for(let n=e.length-1;n>=0;n--){const r=e.length-n-1,o=new yn(e[n],this.p,r),a=ze(o.action),c=ze(o.subject||this.A);!this.h&&o.fields&&(this.h=!0);for(let l=0;l<c.length;l++){const p=X(t,c[l],Ut);i===void 0&&(i=typeof c[l]),typeof c[l]!==i&&i!=="mixed"&&(i="mixed");for(let u=0;u<a.length;u++)X(p,a[u],Tt).rules.push(o)}}if(this.l=t,i!=="mixed"&&!this.M){const n=Pt[i]||Pt.string;this.j=n}}possibleRulesFor(e,t=this.A){if(!Q(t))throw new Error('"possibleRulesFor" accepts only subject types (i.e., string or class) as the 2nd parameter');const i=X(this.l,t,Ut),n=X(i,e,Tt);if(n.merged)return n.rules;const r=e!==this.$&&i.has(this.$)?i.get(this.$).rules:void 0;let o=Mt(n.rules,r);return t!==this.A&&(o=Mt(o,this.possibleRulesFor(e,this.A))),n.rules=o,n.merged=!0,o}rulesFor(e,t,i){const n=this.possibleRulesFor(e,t);if(i&&typeof i!="string")throw new Error("The 3rd, `field` parameter is expected to be a string. See https://stalniy.github.io/casl/en/api/casl-ability#can-of-pure-ability for details");return this.h?n.filter(r=>r.matchesField(i)):n}actionsFor(e){if(!Q(e))throw new Error('"actionsFor" accepts only subject types (i.e., string or class) as a parameter');const t=new Set,i=this.l.get(e);i&&Array.from(i.keys()).forEach(r=>t.add(r));const n=e!==this.A?this.l.get(this.A):void 0;return n&&Array.from(n.keys()).forEach(r=>t.add(r)),Array.from(t)}on(e,t){this.F=this.F||new Map;const i=this.F,n=i.get(e)||null,r=vn(t,n);return i.set(e,r),()=>{const o=i.get(e);!r.next&&!r.prev&&o===r?i.delete(e):r===o&&i.set(e,r.prev),wn(r)}}_(e,t){if(!this.F)return;let i=this.F.get(e)||null;for(;i!==null;){const n=i.prev?$n(i.prev):null;i.value(t),i=n}}}class An extends En{can(e,t,i){const n=this.relevantRuleFor(e,t,i);return!!n&&!n.inverted}relevantRuleFor(e,t,i){const n=this.detectSubjectType(t),r=this.rulesFor(e,n,i);for(let o=0,a=r.length;o<a;o++)if(r[o].matchesConditions(t))return r[o];return null}cannot(e,t,i){return!this.can(e,t,i)}}const xn={$eq:it,$ne:bs,$lt:fs,$lte:gs,$gt:_e,$gte:st,$in:be,$nin:hs,$all:ps,$size:us,$regex:_s,$options:ys,$elemMatch:ds,$exists:ms},Sn={eq:ot,ne:xs,lt:Rs,lte:Ss,gt:Cs,gte:Os,in:ye,nin:Ms,all:Ts,size:Ps,regex:ks,elemMatch:Us,exists:Is,and:As},Rn=ct(xn,Sn),Cn=/[-/\\^$+?.()|[\]{}]/g,On=/\.?\*+\.?/g,In=/\*+/,Pn=/\./g;function kn(s,e,t){const i=t[0]==="*"||s[0]==="."&&s[s.length-1]==="."?"+":"*",n=s.indexOf("**")===-1?"[^.]":".",r=s.replace(Pn,"\\$&").replace(In,n+i);return e+s.length===t.length?`(?:${r})?`:r}function Mn(s,e,t){return s==="."&&(t[e-1]==="*"||t[e+1]==="*")?s:`\\${s}`}function Tn(s){const e=s.map(i=>i.replace(Cn,Mn).replace(On,kn)),t=e.length>1?`(?:${e.join("|")})`:e[0];return new RegExp(`^${t}$`)}const Un=s=>{let e;return t=>(typeof e>"u"&&(e=s.every(i=>i.indexOf("*")===-1)?null:Tn(s)),e===null?s.indexOf(t)!==-1:e.test(t))};function Nn(s=[],e={}){return new An(s,Object.assign({conditionsMatcher:Rn,fieldMatcher:Un},e))}function Ln(s){return s.prototype!==void 0&&typeof s.prototype.possibleRulesFor=="function"}class Dn{constructor(e){this.O=e}because(e){return this.O.reason=e,this}}class jn{constructor(e){this.rules=[],this.C=e,this.can=(t,i,n,r)=>this.R(t,i,n,r,!1),this.cannot=(t,i,n,r)=>this.R(t,i,n,r,!0),this.build=t=>Ln(this.C)?new this.C(this.rules,t):this.C(this.rules,t)}R(e,t,i,n,r){const o={action:e};return r&&(o.inverted=r),t&&(o.subject=t,Array.isArray(i)||typeof i=="string"?o.fields=i:typeof i<"u"&&(o.conditions=i),typeof n<"u"&&(o.conditions=n)),this.rules.push(o),new Dn(o)}}const m={CREATE:"create",READ:"read",UPDATE:"update",DELETE:"delete",MANAGE:"manage",EXECUTE:"execute",EXPORT:"export",IMPORT:"import",APPROVE:"approve",REJECT:"reject",PUBLISH:"publish"},d={USER:"User",ROLE:"Role",PERMISSION:"Permission",CUSTOMER:"Customer",ORGANIZATION:"Organization",ORDER:"Order",PRODUCT:"Product",INVOICE:"Invoice",QUOTE:"Quote",CONTRACT:"Contract",PRICELIST:"PriceList",PURCHASE_ORDER:"PurchaseOrder",INCIDENT:"Incident",SLA_METRIC:"SLAMetric",REPORT:"Report",DASHBOARD:"Dashboard",ANALYTICS:"Analytics",DOCUMENT:"Document",INBOX:"Inbox",OUTBOX:"Outbox",SETTINGS:"Settings",MODULE:"Module",ALL:"all"};function ne(s,e=[]){const{can:t,cannot:i,build:n}=new jn(Nn);if(!s)return t(m.READ,d.PRODUCT),n();if(s.role==="Super Admin"||s.isSuperAdmin)return t(m.MANAGE,d.ALL),n();switch(e.forEach(r=>{!r||!r.permissions||Object.entries(r.permissions).forEach(([o,a])=>{const c=zn(o);a.forEach(l=>{t(l==="manage"?m.MANAGE:l,c)})})}),s.role){case"Admin":t(m.MANAGE,[d.USER,d.CUSTOMER,d.ORDER,d.PRODUCT,d.INCIDENT]),t(m.READ,d.SETTINGS);break;case"Manager":t([m.READ,m.UPDATE],[d.CUSTOMER,d.ORDER,d.PRODUCT,d.INCIDENT]),t(m.CREATE,[d.ORDER,d.INCIDENT]),t(m.APPROVE,d.ORDER);break;case"User":t(m.READ,[d.CUSTOMER,d.ORDER,d.PRODUCT,d.REPORT]),t([m.CREATE,m.UPDATE],d.INCIDENT);break;case"Customer":t(m.READ,[d.PRODUCT,d.ORDER,d.INVOICE]),t(m.CREATE,[d.ORDER,d.QUOTE]),t(m.UPDATE,d.ORDER,{status:"draft"});break}return t(m.UPDATE,d.USER,{id:s.id}),s.role==="User"&&(t(m.READ,d.INCIDENT,{assignedTo:s.id}),t(m.READ,d.INCIDENT,{reportedBy:s.id})),n()}function zn(s){return{users:d.USER,roles:d.ROLE,permissions:d.PERMISSION,settings:d.SETTINGS,customers:d.CUSTOMER,customer_orgs:d.ORGANIZATION,orders:d.ORDER,products:d.PRODUCT,incidents:d.INCIDENT,reports:d.REPORT,analytics:d.ANALYTICS,documents:d.DOCUMENT,invoices:d.INVOICE,quotes:d.QUOTE,contracts:d.CONTRACT,pricelists:d.PRICELIST,purchase_orders:d.PURCHASE_ORDER,sla_metrics:d.SLA_METRIC,inbox:d.INBOX,outbox:d.OUTBOX,dashboards:d.DASHBOARD,modules:d.MODULE}[s]||s}class Bn{constructor(){this._ability=null,this._user=null}init(e,t=[]){this._user=e,this._ability=ne(e,t)}get ability(){return this._ability||(this._ability=ne(null)),this._ability}can(e,t,i){return this.ability.can(e,t,i)}cannot(e,t,i){return this.ability.cannot(e,t,i)}update(e,t=[]){this.init(e,t)}clear(){this._ability=null,this._user=null}getRules(){return this.ability.rules}isAdmin(){return this.can(m.MANAGE,d.ALL)}canAccessRoute(e){const t={"/users":{action:m.READ,subject:d.USER},"/users/new":{action:m.CREATE,subject:d.USER},"/users/edit":{action:m.UPDATE,subject:d.USER},"/roles":{action:m.READ,subject:d.ROLE},"/roles/new":{action:m.CREATE,subject:d.ROLE},"/roles/edit":{action:m.UPDATE,subject:d.ROLE},"/customers":{action:m.READ,subject:d.CUSTOMER},"/customers/new":{action:m.CREATE,subject:d.CUSTOMER},"/customers/edit":{action:m.UPDATE,subject:d.CUSTOMER},"/orders":{action:m.READ,subject:d.ORDER},"/orders/new":{action:m.CREATE,subject:d.ORDER},"/products":{action:m.READ,subject:d.PRODUCT},"/sla/incidents":{action:m.READ,subject:d.INCIDENT},"/sla/incidents/new":{action:m.CREATE,subject:d.INCIDENT},"/reports":{action:m.READ,subject:d.REPORT},"/analytics":{action:m.READ,subject:d.ANALYTICS}},i=Object.keys(t).find(o=>e.startsWith(o));if(!i)return!0;const{action:n,subject:r}=t[i];return this.can(n,r)}getPermissionsSummary(){return{canManageUsers:this.can(m.MANAGE,d.USER),canManageRoles:this.can(m.MANAGE,d.ROLE),canManageCustomers:this.can(m.MANAGE,d.CUSTOMER),canManageOrders:this.can(m.MANAGE,d.ORDER),canManageProducts:this.can(m.MANAGE,d.PRODUCT),canManageIncidents:this.can(m.MANAGE,d.INCIDENT),canViewReports:this.can(m.READ,d.REPORT),canViewAnalytics:this.can(m.READ,d.ANALYTICS),isAdmin:this.isAdmin()}}}const _=new Bn,Fn=Object.freeze(Object.defineProperty({__proto__:null,Actions:m,Subjects:d,_defineAbilityFor:ne,abilityService:_,defineAbilityFor:ne},Symbol.toStringTag,{value:"Module"})),xo=Qt,Be=[{id:"admin",name:"Admin",icon:"shield-lock",color:"danger",description:"System administration and user management",requiredRoles:[1],entities:["users","roles"]},{id:"sla",name:"SLA",icon:"speedometer2",color:"primary",description:"Service Level Agreement monitoring and incident management",requiredRoles:[1,2],entities:["incidents"]},{id:"sales",name:"Sales",icon:"cart-check",color:"success",description:"Sales and order management",requiredRoles:[1,3],entities:["orders","customers","products"]},{id:"analytics",name:"Analytics",icon:"graph-up",color:"info",description:"Business intelligence and reports",requiredRoles:[1,2],entities:["reports"]},{id:"gdocs",name:"Gdocs",icon:"file-earmark-text",color:"secondary",description:"Document management and collaboration",requiredRoles:[1,2],entities:["gdocs"]},{id:"commerce",name:"Commerce",icon:"shop",color:"success",description:"Unified B2C and B2B e-commerce platform",requiredRoles:[1,2],entities:["products","orders","customers","quotes"]},{id:"customers",name:"Customers",icon:"building",color:"success",description:"Customer and organization management",requiredRoles:[1,2],entities:["customers","customer_orgs"]},{id:"companies",name:"Companies",icon:"building",color:"primary",description:"B2B companies and business partners",requiredRoles:[1,2],entities:["companies"]}],Ls=[{id:"users",name:"Users",icon:"people",description:"User accounts and profiles"},{id:"incidents",name:"Incidents",icon:"exclamation-triangle",description:"SLA incident tracking and management"},{id:"products",name:"Products",icon:"box",description:"Product catalog management"},{id:"orders",name:"Orders",icon:"cart",description:"Order processing and tracking"},{id:"customers",name:"Customers",icon:"person-badge",description:"Customer relationship management"},{id:"customer_orgs",name:"Customer Organizations",icon:"building",description:"Customer organization management (multi-tenant)"},{id:"companies",name:"Companies",icon:"building",description:"B2B companies and business partners"},{id:"quotes",name:"Quotes",icon:"file-earmark-text",description:"B2B quotes and RFQs"},{id:"purchase_orders",name:"Purchase Orders",icon:"receipt",description:"B2B purchase orders"},{id:"reports",name:"Reports",icon:"file-earmark-bar-graph",description:"Analytics and reporting"},{id:"settings",name:"Settings",icon:"gear",description:"System configuration"},{id:"gdocs",name:"Gdocs",icon:"file-earmark-text",description:"Document management and collaboration"},{id:"pages",name:"Pages",icon:"file-earmark",description:"Website page management"},{id:"blog",name:"Blog",icon:"journal-text",description:"Blog post management"},{id:"media",name:"Media",icon:"image",description:"Media file management"}],qn=[{id:"create",name:"Create",icon:"plus-circle",color:"success"},{id:"read",name:"Read",icon:"eye",color:"info"},{id:"update",name:"Update",icon:"pencil",color:"warning"},{id:"delete",name:"Delete",icon:"trash",color:"danger"}];async function Hn(){return{title:"Welcome",intro:"This data is provided by the service layer.",items:[{id:1,text:"Lit components render fast"},{id:2,text:"Routing via @lit-labs/router"},{id:3,text:"Vite for dev and build"}]}}async function So(){return{framework:"Lit",version:"3.x",features:["Web Components based","Small and fast","Declarative templates"],links:[{label:"Docs",href:"https://lit.dev"},{label:"Router",href:"https://github.com/lit/lit/tree/main/packages/labs/router"}]}}async function lt(s,e=[]){_.init(s,e),typeof window<"u"&&(window.__ability=_.ability)}function R(s,e,t=null){const i=Vn(s);return _.can(e,i,t)}function Ds(s,e){return e.some(t=>R(s,t))}function js(s,e){return e.every(t=>R(s,t))}function Y(s){return _.canAccessRoute(s)}function zs(){return _.isAdmin()}function Bs(){return _.getPermissionsSummary()}function Vn(s){return{users:d.USER,roles:d.ROLE,permissions:d.PERMISSION,settings:d.SETTINGS,customers:d.CUSTOMER,customer_orgs:d.ORGANIZATION,orders:d.ORDER,products:d.PRODUCT,incidents:d.INCIDENT,reports:d.REPORT,analytics:d.ANALYTICS}[s]||s}function Gn(s,e){return function(t){return function(...i){if(!R(s,e))throw new Error(`Permission denied: ${e} ${s}`);return t.apply(this,i)}}}function Jn(s,e){return function(t,i,n){const r=n.value;return n.value=function(...o){if(!R(s,e))throw new Error(`Permission denied: ${e} ${s}`);return r.apply(this,o)},n}}function Wn(){return _.ability}function Yn(s,e=[]){_.update(s,e)}function Fs(){_.clear()}function Kn(s){const e={};return Object.entries(s).forEach(([t,[i,n]])=>{e[t]=R(i,n)}),e}function Xn(s,e=null){const t=Y(s);return!t&&e&&e("/access-denied"),t}class qs{constructor(){this._listeners=new Set}can(e,t,i){const n=()=>R(e,t);return i&&(this._listeners.add(i),i(n())),n()}notifyChange(){this._listeners.forEach(e=>e())}clear(){this._listeners.clear()}}const Zn=new qs;function Hs(){const s=S();if(!s)return{};const t=JSON.parse(localStorage.getItem("users_cache")||"[]").find(r=>r.id===s.id);if(!t||!t.assignedRoles)return{};const i=JSON.parse(localStorage.getItem("roles_cache")||"[]"),n={};return t.assignedRoles.forEach(r=>{const o=i.find(a=>a.id===r);o&&o.permissions&&Object.keys(o.permissions).forEach(a=>{n[a]||(n[a]=[]),o.permissions[a].forEach(c=>{n[a].includes(c)||n[a].push(c)})})}),n}async function Qn(s,e){try{s&&e&&(localStorage.setItem("users_cache",JSON.stringify(s)),localStorage.setItem("roles_cache",JSON.stringify(e)))}catch(t){console.error("Failed to initialize permission cache:",t)}}const Fe=Object.freeze(Object.defineProperty({__proto__:null,Actions:m,PermissionChecker:qs,RequirePermission:Jn,Subjects:d,canAccessRoute:Y,checkPermissions:Kn,clearAbilities:Fs,entities:Ls,getAbility:Wn,getUserPermissions:Hs,getUserPermissionsSummary:Bs,guardRoute:Xn,hasAllPermissions:js,hasAnyPermission:Ds,hasPermission:R,initializeAbilities:lt,initializePermissionCache:Qn,isAdmin:zs,permissionChecker:Zn,permissionTypes:qn,requirePermission:Gn,updateAbilities:Yn},Symbol.toStringTag,{value:"Module"})),Vs="current_module";function j(){const s=S();if(!s)return[];const t=JSON.parse(localStorage.getItem("users_cache")||"[]").find(l=>l.id===s.id);if(!t)return[];const i=t.assignedRoles||[];if(i.length===0)return[];const n=JSON.parse(localStorage.getItem("roles_cache")||"[]"),r={};i.forEach(l=>{const p=n.find(u=>u.id===l);p&&p.permissions&&Object.assign(r,p.permissions)});const o=new Set;o.add("core");const a={users:"admin",roles:"admin",permissions:"admin",audit:"admin",security:"admin",sessions:"admin",incidents:"sla",orders:"sales",products:"sales",customers:"commerce",customer_orgs:"commerce",companies:"companies",quotes:"commerce",purchase_orders:"commerce",reports:"analytics",analytics:"analytics",gdocs:"gdocs",commerce:"commerce",inventory:"commerce"};Object.keys(r).forEach(l=>{const p=a[l];p&&o.add(p)});const c=Be.filter(l=>o.has(l.id));return console.log("🧭 getUserModules accessibleModuleIds:",Array.from(o)),console.log("🧭 getUserModules result:",c.map(l=>l.id)),c}function Nt(){const s=localStorage.getItem(Vs);return s?j().find(i=>i.id===s)||Be.find(i=>i.id==="core"):Be.find(i=>i.id==="core")}function er(s){return j().find(i=>i.id===s)?(localStorage.setItem(Vs,s),!0):!1}function Gs(s){return j().some(t=>t.id===s)}function tr(){const s=S();if(!s)return!1;const e=JSON.parse(localStorage.getItem("users_cache")||"[]"),t=JSON.parse(localStorage.getItem("roles_cache")||"[]"),i=e.find(n=>n.id===s.id);return!i||!i.assignedRoles?!1:i.assignedRoles.some(n=>{const r=t.find(o=>o.id===n);return r&&(r.category==="system"||r.name.includes("Super Admin"))})}function Ro(){return j()}let x=[],sr=5;async function K(){return x.length===0&&(x=await pe("/roles.json")),x}async function ve(){const s=await K();return localStorage.setItem("roles_cache",JSON.stringify(s)),[...s]}async function ir(s){return(await K()).find(t=>t.id===s)||null}async function nr(s){await K();const e={id:sr++,name:s.name,description:s.description||"",permissions:s.permissions||[],userCount:0};return x.push(e),localStorage.setItem("roles_cache",JSON.stringify(x)),e}async function rr(s,e){await K();const t=x.findIndex(i=>i.id===s);return t!==-1?(x[t]={...x[t],...e,id:s},localStorage.setItem("roles_cache",JSON.stringify(x)),x[t]):null}async function or(s){await K();const e=x.findIndex(t=>t.id===s);return e!==-1?(x.splice(e,1),localStorage.setItem("roles_cache",JSON.stringify(x)),!0):!1}const Js=Object.freeze(Object.defineProperty({__proto__:null,createRole:nr,deleteRole:or,getRoleById:ir,getRoles:ve,updateRole:rr},Symbol.toStringTag,{value:"Module"}));let $=[],ar=7;async function z(){return $.length===0&&($=await pe("/users.json")),$}async function cr(){const s=await z();return localStorage.setItem("users_cache",JSON.stringify(s)),[...s]}async function Ws(s){return(await z()).find(t=>t.id===s)||null}async function lr(s){await z();const e={id:ar++,name:s.name,email:s.email,username:s.username||"",role:s.role||"User",status:s.status||"Active",active:(s.status||"Active")==="Active",organizationId:s.organizationId||"",departmentId:s.departmentId||"",teamId:s.teamId||"",permissionScope:s.permissionScope||"own",mfaEnabled:!!s.mfaEnabled,accountLocked:!!s.accountLocked,passwordExpires:s.passwordExpires!==!1,sessionTimeout:s.sessionTimeout||60,assignedRoles:s.assignedRoles||[]};return $.push(e),localStorage.setItem("users_cache",JSON.stringify($)),e}async function dr(s,e){await z();const t=$.findIndex(i=>i.id===s);return t!==-1?($[t]={...$[t],...e,id:s},localStorage.setItem("users_cache",JSON.stringify($)),$[t]):null}async function ur(s,e){await z();const t=$.find(i=>i.id===s);return t?(t.assignedRoles=e,localStorage.setItem("users_cache",JSON.stringify($)),t):null}async function hr(s){await z();const e=$.findIndex(t=>t.id===s);return e!==-1?($.splice(e,1),localStorage.setItem("users_cache",JSON.stringify($)),!0):!1}const Ys=Object.freeze(Object.defineProperty({__proto__:null,assignRolesToUser:ur,createUser:lr,deleteUser:hr,getUserById:Ws,getUsers:cr,updateUser:dr},Symbol.toStringTag,{value:"Module"}));class pr{constructor(){this._authenticated=!1,this._user=null,this._lastCheck=0,this._checkInterval=1e3,this._listeners=new Set,this._updateState(),window.addEventListener("user-logged-in",()=>this._updateState()),window.addEventListener("user-logged-out",()=>this._updateState()),window.addEventListener("oidc-token-expired",()=>this._updateState())}get authenticated(){return this._checkCache(),this._authenticated}get user(){return this._checkCache(),this._user}canAccess(e){return this._checkCache(),this._authenticated?Y(e,this._user):!1}refresh(){this._updateState()}subscribe(e){return this._listeners.add(e),()=>this._listeners.delete(e)}_checkCache(){Date.now()-this._lastCheck>this._checkInterval&&this._updateState()}_updateState(){const e=this._authenticated,t=this._user;this._authenticated=me(),this._user=this._authenticated?S():null,this._lastCheck=Date.now(),(e!==this._authenticated||t!==this._user)&&this._notifyListeners()}_notifyListeners(){this._listeners.forEach(e=>{try{e({authenticated:this._authenticated,user:this._user})}catch(t){console.error("Error in auth state listener:",t)}})}}const E=new pr,mr=Object.freeze(Object.defineProperty({__proto__:null,authState:E,default:E},Symbol.toStringTag,{value:"Module"}));class fr{constructor(e,t=null){this.key=e,this._value=t,this._listeners=new Set}get value(){return this._value}set value(e){this._value!==e&&(this._value=e,this._notifyListeners())}subscribe(e){return this._listeners.add(e),()=>this._listeners.delete(e)}_notifyListeners(){this._listeners.forEach(e=>e(this._value))}}function dt(s,e=null){return new fr(s,e)}const Co=s=>class extends s{constructor(){super(),this._contextSubscriptions=new Map}consumeContext(e,t){this._contextSubscriptions.has(e)&&this._contextSubscriptions.get(e)();const i=e.subscribe(n=>{t&&t(n),this.requestUpdate()});return this._contextSubscriptions.set(e,i),e.value}disconnectedCallback(){super.disconnectedCallback?.(),this._contextSubscriptions.forEach(e=>e()),this._contextSubscriptions.clear()}},Ks=dt("user-context",{user:null,isAuthenticated:!1,isLoading:!1,error:null});class gr{constructor(){this._context=Ks,this._updateContext()}get context(){return this._context}_updateContext(){try{const e=S(),t=me();this._context.value={user:e,isAuthenticated:t,isLoading:!1,error:null}}catch(e){this._context.value={user:null,isAuthenticated:!1,isLoading:!1,error:e.message}}}setUser(e){this._context.value={...this._context.value,user:e,isAuthenticated:!!e,error:null}}clearUser(){this._context.value={user:null,isAuthenticated:!1,isLoading:!1,error:null}}setLoading(e){this._context.value={...this._context.value,isLoading:e}}setError(e){this._context.value={...this._context.value,error:e?.message||e,isLoading:!1}}async refresh(){this.setLoading(!0);try{this._updateContext()}catch(e){this.setError(e)}}}const qe=new gr,Xs=dt("permission-context",{ability:null,isInitialized:!1,summary:null});class br{constructor(){this._context=Xs,this._updateContext()}get context(){return this._context}_updateContext(){this._context.value={ability:_.ability,isInitialized:!!_.ability,summary:_.ability?Bs():null}}async initialize(e,t=[]){try{_.init(e,t),this._updateContext()}catch(i){console.error("Failed to initialize permissions:",i)}}update(e,t=[]){_.update(e,t),this._updateContext()}clear(){_.clear(),this._context.value={ability:null,isInitialized:!1,summary:null}}refresh(){this._updateContext()}can(e,t,i=null){return R(e,t,i)}canAny(e,t){return Ds(e,t)}canAll(e,t){return js(e,t)}canAccessRoute(e){return Y(e)}isAdmin(){return zs()}}const He=new br,Zs=dt("app-context",{theme:"light",sidebarCollapsed:!1,notifications:[],loading:!1,currentModule:null,breadcrumbs:[],pageTitle:"",metadata:{}});class _r{constructor(){this._context=Zs,this._loadPersistedState()}get context(){return this._context}_loadPersistedState(){try{const e=localStorage.getItem("app-theme"),t=localStorage.getItem("sidebar-collapsed");this._context.value={...this._context.value,theme:e||"light",sidebarCollapsed:t==="true"}}catch(e){console.error("Failed to load persisted app state:",e)}}setTheme(e){this._context.value={...this._context.value,theme:e},localStorage.setItem("app-theme",e)}toggleTheme(){const e=this._context.value.theme==="light"?"dark":"light";this.setTheme(e)}setSidebarCollapsed(e){this._context.value={...this._context.value,sidebarCollapsed:e},localStorage.setItem("sidebar-collapsed",e.toString())}toggleSidebar(){this.setSidebarCollapsed(!this._context.value.sidebarCollapsed)}addNotification(e){const t=[...this._context.value.notifications];t.push({id:Date.now(),timestamp:new Date,...e}),this._context.value={...this._context.value,notifications:t}}removeNotification(e){const t=this._context.value.notifications.filter(i=>i.id!==e);this._context.value={...this._context.value,notifications:t}}clearNotifications(){this._context.value={...this._context.value,notifications:[]}}setLoading(e){this._context.value={...this._context.value,loading:e}}setCurrentModule(e){this._context.value={...this._context.value,currentModule:e}}setBreadcrumbs(e){this._context.value={...this._context.value,breadcrumbs:e}}setPageTitle(e){this._context.value={...this._context.value,pageTitle:e},document.title=e}setMetadata(e){this._context.value={...this._context.value,metadata:{...this._context.value.metadata,...e}}}reset(){this._context.value={theme:"light",sidebarCollapsed:!1,notifications:[],loading:!1,currentModule:null,breadcrumbs:[],pageTitle:"",metadata:{}}}}const Ve=new _r,Oo=Ks,Io=Xs,Po=Zs;function yr(){return{user:qe.context,permission:He.context,app:Ve.context}}const C={GLOBAL:"global",ORGANIZATION:"organization",DEPARTMENT:"department",TEAM:"team",OWN:"own",CUSTOM:"custom"};function vr(s){return _.can(s,"Application")}function wr(s,e){return vr("manage")?!0:_.can(e,`Module:${s}`)}function ut(s,e,t=null){return _.can(e,s,t)}function $r(s,e,t,i=null){if(!ut(s,t,i))return!1;const n=ht();if(!n)return!1;const r=Sr(n,s);if(r&&r[e]){const o=r[e];if(t==="read")return o.readable!==!1;if(t==="write"||t==="update")return o.writable!==!1}return!0}function Qs(s,e,t,i=C.GLOBAL){const n=ht();if(!n||!ut(s,e))return!1;switch(i){case C.GLOBAL:return!0;case C.ORGANIZATION:return t.organizationId===n.organizationId;case C.DEPARTMENT:return t.departmentId===n.departmentId;case C.TEAM:return t.teamId===n.teamId;case C.OWN:return t.ownerId===n.id||t.createdBy===n.id||t.assignedTo===n.id;case C.CUSTOM:return Ar(s,t,n);default:return!1}}function Er(s,e,t){return ht()?s.filter(n=>Qs(e,"read",n,t)):[]}function Ar(s,e,t){const i=Rr(t,s);return!i||i.length===0?!1:i.every(n=>xr(e,n.condition,t))}function xr(s,e,t){const{field:i,operator:n,value:r}=e,o=s[i];switch(n){case"equals":return o===r;case"notEquals":return o!==r;case"in":return Array.isArray(r)&&r.includes(o);case"notIn":return Array.isArray(r)&&!r.includes(o);case"contains":return String(o).includes(r);case"startsWith":return String(o).startsWith(r);case"endsWith":return String(o).endsWith(r);case"greaterThan":return o>r;case"lessThan":return o<r;case"isCurrentUser":return o===t.id;case"isInUserTeam":return t.teamMembers&&t.teamMembers.includes(o);default:return!1}}function Sr(s,e){const i=JSON.parse(localStorage.getItem("roles_cache")||"[]").filter(r=>s.assignedRoles?.includes(r.id)),n={};return i.forEach(r=>{r.fieldPermissions&&r.fieldPermissions[e]&&Object.assign(n,r.fieldPermissions[e])}),n}function Rr(s,e){const i=JSON.parse(localStorage.getItem("roles_cache")||"[]").filter(r=>s.assignedRoles?.includes(r.id)),n=[];return i.forEach(r=>{r.scopeRules&&r.scopeRules[e]&&n.push(...r.scopeRules[e])}),n}function ht(){try{const s=localStorage.getItem("currentUser");return s?JSON.parse(s):null}catch(s){return console.error("Failed to get current user:",s),null}}class Cr{constructor(){this._user=null,this._roles=[],this._permissions={},this._initialized=!1,this._auditLog=[]}async initialize(e=null,t=[]){e||(e=S()),this._user=e,this._roles=t,this._initialized=!0,_.init(e,t),this._buildPermissionCache(),this._logAudit("SECURITY_CONTEXT_INITIALIZED",{userId:e?.id,roleIds:t.map(i=>i.id)})}_buildPermissionCache(){this._user&&(this._permissions={app:{},modules:{},entities:{}},this._roles.forEach(e=>{e.moduleAccess&&Object.entries(e.moduleAccess).forEach(([t,i])=>{this._permissions.modules[t]=i}),e.permissions&&Object.entries(e.permissions).forEach(([t,i])=>{this._permissions.entities[t]||(this._permissions.entities[t]=new Set),i.forEach(n=>this._permissions.entities[t].add(n))})}))}isAuthenticated(){return this._initialized&&this._user!==null}getUser(){return this._user}getRoles(){return this._roles}getSecurityContext(){return this._user?{userId:this._user.id,username:this._user.username,roles:this._roles.map(e=>e.id),roleNames:this._roles.map(e=>e.name),scope:this._user.permissionScope||C.OWN,organizationId:this._user.organizationId,departmentId:this._user.departmentId,teamId:this._user.teamId,attributes:this._user.attributes||{},mfaEnabled:this._user.mfaEnabled||!1}:null}can(e,t,i=null){this._ensureInitialized();const n=_.can(e,t,i);return n&&this._logAudit("PERMISSION_GRANTED",{action:e,subject:t,conditions:i}),n}cannot(e,t,i=null){return!this.can(e,t,i)}canAccessModule(e){return this._ensureInitialized(),wr(e,"read")}canAccessEntity(e,t){return this._ensureInitialized(),ut(e,t)}canAccessField(e,t,i){return this._ensureInitialized(),$r(e,t,i)}canAccessRecord(e,t,i){this._ensureInitialized();const n=this._user?.permissionScope||C.OWN;return Qs(e,t,i,n)}filterRecords(e,t){this._ensureInitialized();const i=this._user?.permissionScope||C.OWN;return Er(e,t,i)}isAdmin(){return this._ensureInitialized(),_.isAdmin()}hasRole(e){return this._ensureInitialized(),this._roles.some(t=>t.name===e)}hasAnyRole(e){return this._ensureInitialized(),e.some(t=>this.hasRole(t))}hasAllRoles(e){return this._ensureInitialized(),e.every(t=>this.hasRole(t))}getPermissionSummary(){return this._ensureInitialized(),_.getPermissionsSummary()}requiresMfa(e,t){this._ensureInitialized();const i=["delete","manage"],n=["User","Role","Permission","Settings"];return i.includes(e)||n.includes(t)}async validateMfa(e,t){if(!this.requiresMfa(e,t))return!0;if(!this._user?.mfaEnabled)throw new Error("MFA is required for this action but not enabled for user");return!0}_logAudit(e,t={}){const i={timestamp:new Date().toISOString(),event:e,userId:this._user?.id,username:this._user?.username,details:t,ip:this._user?.lastLoginIp||"unknown"};this._auditLog.push(i),this._auditLog.length>1e3&&this._auditLog.shift(),this._sendToAuditService(i)}_sendToAuditService(e){console.log("[AUDIT]",e)}getAuditLog(e=100){return this._auditLog.slice(-e)}_ensureInitialized(){if(!this._initialized)throw new Error("Security context not initialized. Call initialize() first.")}clear(){this._logAudit("SECURITY_CONTEXT_CLEARED",{userId:this._user?.id}),this._user=null,this._roles=[],this._permissions={},this._initialized=!1,_.clear()}async refresh(){this._user&&await this.initialize(this._user)}}const re=new Cr;async function Or(){try{console.log("[Security Init] Starting security initialization...");const s=S();if(!s)return console.warn("[Security Init] No authenticated user found"),!1;console.log("[Security Init] Current user:",s.name);const e=await ve();console.log("[Security Init] Loaded roles:",e.length);const t=await Ws(s.id);if(!t)return console.error("[Security Init] User profile not found"),!1;const i=t.assignedRoles||[],n=e.filter(r=>i.includes(r.id));return console.log("[Security Init] User roles:",n.map(r=>r.name)),await re.initialize(t,n),console.log("[Security Init] ✓ Security context initialized successfully"),console.log("[Security Init] User scope:",t.permissionScope),console.log("[Security Init] Is Admin:",re.isAdmin()),Pr(t,n),!0}catch(s){return console.error("[Security Init] Failed to initialize security:",s),!1}}function Ir(){console.log("[Security Init] Clearing security context..."),re.clear(),kr(),console.log("[Security Init] ✓ Security context cleared")}function Pr(s,e){try{const t={userId:s.id,userName:s.name,userEmail:s.email,roles:e.map(i=>({id:i.id,name:i.name,priority:i.priority})),scope:s.permissionScope,organizationId:s.organizationId,departmentId:s.departmentId,teamId:s.teamId,isAdmin:re.isAdmin(),cachedAt:new Date().toISOString()};localStorage.setItem("security_info",JSON.stringify(t))}catch(t){console.error("[Security Init] Failed to cache security info:",t)}}function kr(){try{localStorage.removeItem("security_info")}catch(s){console.error("[Security Init] Failed to clear security cache:",s)}}class H{constructor(){if(H.instance)return H.instance;this.routeLoaders=new Map,this.loadedRoutes=new Map,H.instance=this}register(e,t){this.routeLoaders.set(e,t)}async get(e){if(this.loadedRoutes.has(e))return this.loadedRoutes.get(e);const t=this.routeLoaders.get(e);if(!t)return console.warn(`RouterProvider: No loader registered for "${e}"`),[];try{const i=await t();return this.loadedRoutes.set(e,i),i}catch(i){return console.error(`RouterProvider: Failed to load routes for "${e}"`,i),[]}}async getMultiple(e){return(await Promise.all(e.map(i=>this.get(i)))).flat()}async getAll(){const e=Array.from(this.routeLoaders.keys());return this.getMultiple(e)}clearCache(){this.loadedRoutes.clear()}unregister(e){this.routeLoaders.delete(e),this.loadedRoutes.delete(e)}}const ei=new H;function Mr(s){Object.entries(s).forEach(([e,t])=>{ei.register(e,t)})}Mr({public:async()=>{const{publicRoutes:s}=await g(async()=>{const{publicRoutes:e}=await import("./public.routes-D3tKzuDt.js");return{publicRoutes:e}},[]);return s},protected:async()=>{const{protectedRoutes:s}=await g(async()=>{const{protectedRoutes:e}=await import("./protected.routes-BHl8CEH4.js");return{protectedRoutes:e}},[]);return s},admin:async()=>{const{createAdminRoutes:s}=await g(async()=>{const{createAdminRoutes:e}=await import("./admin.router-CwvMjzYo.js");return{createAdminRoutes:e}},[]);return s()},sla:async()=>{const{createSLARoutes:s}=await g(async()=>{const{createSLARoutes:e}=await import("./sla.router-qVGyMpig.js");return{createSLARoutes:e}},[]);return s()},sales:async()=>{const{createSalesRoutes:s}=await g(async()=>{const{createSalesRoutes:e}=await import("./sales.router-C45WLmqP.js");return{createSalesRoutes:e}},[]);return s()},analytics:async()=>{const{createAnalyticsRoutes:s}=await g(async()=>{const{createAnalyticsRoutes:e}=await import("./analytics.router-DgxY1ghk.js");return{createAnalyticsRoutes:e}},[]);return s()},commerce:async()=>{const{createCommerceRoutes:s}=await g(async()=>{const{createCommerceRoutes:e}=await import("./commerce.router-BKu0yEM4.js");return{createCommerceRoutes:e}},[]);return s()},b2bManagement:async()=>{const{createB2BManagementRoutes:s}=await g(async()=>{const{createB2BManagementRoutes:e}=await import("./b2b-management.router-BnqLJhoq.js");return{createB2BManagementRoutes:e}},[]);return s()},b2bStorefront:async()=>{const{createB2BStorefrontRoutes:s}=await g(async()=>{const{createB2BStorefrontRoutes:e}=await import("./b2b-storefront.router-CxS6KrYG.js");return{createB2BStorefrontRoutes:e}},[]);return s()},gdocs:async()=>{const{createGDocsRoutes:s}=await g(async()=>{const{createGDocsRoutes:e}=await import("./gdocs.router-C7rBXg-4.js");return{createGDocsRoutes:e}},[]);return s()},fallback:async()=>{const{html:s}=await g(async()=>{const{html:e}=await Promise.resolve().then(()=>wi);return{html:e}},void 0);return[{path:"/*",render:()=>s`<not-found></not-found>`}]}});class V{constructor(){if(V.instance)return V.instance;this.services=new Map,this.singletons=new Map,this.factories=new Map,V.instance=this}singleton(e,t){this.services.set(e,{type:"singleton",value:t})}factory(e,t){this.services.set(e,{type:"factory",value:t})}lazy(e,t){this.services.set(e,{type:"lazy",value:t})}async get(e){const t=this.services.get(e);if(!t)throw new Error(`ServiceProvider: Service "${e}" not registered`);switch(t.type){case"singleton":return this._resolveSingleton(e,t);case"factory":return t.value();case"lazy":return this._resolveLazy(e,t);default:throw new Error(`ServiceProvider: Unknown service type "${t.type}"`)}}async _resolveSingleton(e,t){if(this.singletons.has(e))return this.singletons.get(e);const i=typeof t.value=="function"?new t.value:t.value;return this.singletons.set(e,i),i}async _resolveLazy(e,t){if(this.singletons.has(e))return this.singletons.get(e);const i=await t.value(),n=i.default||i;return this.singletons.set(e,n),n}has(e){return this.services.has(e)}remove(e){this.services.delete(e),this.singletons.delete(e)}clear(){this.services.clear(),this.singletons.clear()}getRegistered(){return Array.from(this.services.keys())}}const Oe=new V;function Tr(s){Object.entries(s).forEach(([e,t])=>{t.type==="singleton"?Oe.singleton(e,t.value):t.type==="factory"?Oe.factory(e,t.value):t.type==="lazy"&&Oe.lazy(e,t.value)})}Tr({authState:{type:"singleton",value:()=>g(()=>Promise.resolve().then(()=>mr),void 0).then(s=>s.authState)},dataService:{type:"lazy",value:()=>g(()=>import("./dataService-BGBWI4iz.js"),__vite__mapDeps([0,1,2,3,4,5,6,7]))},apiService:{type:"lazy",value:()=>g(()=>Promise.resolve().then(()=>Mi),void 0)},abilityService:{type:"singleton",value:()=>g(()=>Promise.resolve().then(()=>Fn),void 0).then(s=>s.abilityService)},caslPermissionService:{type:"lazy",value:()=>g(()=>Promise.resolve().then(()=>Fe),void 0)},cartService:{type:"lazy",value:()=>g(()=>import("./cart.service-D-NMxOXL.js"),__vite__mapDeps([8,9,10]))},orderService:{type:"lazy",value:()=>g(()=>import("./order.service-BgwN3DuJ.js"),[])},productService:{type:"lazy",value:()=>g(()=>import("./product.service-D2mQ2hSR.js"),__vite__mapDeps([9,10]))},companyService:{type:"lazy",value:()=>g(()=>import("./company.service-DzCL-Ehr.js"),__vite__mapDeps([1,2]))},quoteService:{type:"lazy",value:()=>g(()=>import("./quote.service-CAdkjEqz.js"),__vite__mapDeps([11,12]))},contractService:{type:"lazy",value:()=>g(()=>import("./contract.service-CVf_rSeu.js"),__vite__mapDeps([13,14]))},pricelistService:{type:"lazy",value:()=>g(()=>import("./pricelist.service-mNTFejRJ.js"),__vite__mapDeps([15,16]))},purchaseOrderService:{type:"lazy",value:()=>g(()=>import("./purchaseorder.service-CgBVHEwP.js"),[])},incidentService:{type:"lazy",value:()=>g(()=>import("./incident.service-STftVqO6.js"),[])},gdocsService:{type:"lazy",value:()=>g(()=>import("./gdocs.service-DOZdgRCe.js"),[])},inboxService:{type:"lazy",value:()=>g(()=>import("./inbox.service-QROSO0Ey.js"),__vite__mapDeps([6,1,2]))},outboxService:{type:"lazy",value:()=>g(()=>import("./outbox.service-CJrIXpLI.js"),[])},analyticsService:{type:"lazy",value:()=>g(()=>import("./analytics.service-Clir5Z71.js"),[])},userService:{type:"lazy",value:()=>g(()=>Promise.resolve().then(()=>Ys),void 0)},roleService:{type:"lazy",value:()=>g(()=>Promise.resolve().then(()=>Js),void 0)},permissionService:{type:"lazy",value:()=>g(()=>Promise.resolve().then(()=>Fe),void 0)}});class Ur extends w{static properties={username:{type:String},password:{type:String},loading:{type:Boolean},error:{type:String},showPassword:{type:Boolean}};createRenderRoot(){return this}constructor(){super(),this.username="",this.password="",this.loading=!1,this.error="",this.showPassword=!1}async _handleSubmit(e){e.preventDefault(),this.error="",this.loading=!0;try{await Fi(this.username,this.password),window.location.href=window.withBase?.("/")||"/"}catch(t){this.error=t.message||"Login failed"}finally{this.loading=!1}}_togglePasswordVisibility(){this.showPassword=!this.showPassword}render(){return h`
      <div class="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-md-5 col-lg-4">
              <!-- Logo/Brand -->
              <div class="text-center mb-4">
                <div class="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center" style="width: 80px; height: 80px;">
                  <i class="bi bi-shield-lock fs-1"></i>
                </div>
                <h1 class="h3 mt-3 fw-bold">Lit SPA Dashboard</h1>
                <p class="text-muted">Sign in to your account</p>
              </div>

              <!-- Login Card -->
              <div class="card shadow-lg border-0">
                <div class="card-body p-4">
                  ${this.error?h`
                    <div class="alert alert-danger alert-dismissible fade show" role="alert">
                      <i class="bi bi-exclamation-triangle me-2"></i>
                      ${this.error}
                      <button type="button" class="btn-close" @click=${()=>this.error=""}></button>
                    </div>
                  `:""}

                  <form @submit=${this._handleSubmit}>
                    <!-- Username -->
                    <div class="mb-3">
                      <label for="username" class="form-label fw-semibold">
                        <i class="bi bi-person me-1"></i>Username
                      </label>
                      <input
                        type="text"
                        id="username"
                        class="form-control form-control-lg"
                        .value=${this.username}
                        @input=${e=>this.username=e.target.value}
                        placeholder="Enter your username"
                        required
                        ?disabled=${this.loading}
                      />
                    </div>

                    <!-- Password -->
                    <div class="mb-3">
                      <label for="password" class="form-label fw-semibold">
                        <i class="bi bi-lock me-1"></i>Password
                      </label>
                      <div class="input-group">
                        <input
                          type="${this.showPassword?"text":"password"}"
                          id="password"
                          class="form-control form-control-lg"
                          .value=${this.password}
                          @input=${e=>this.password=e.target.value}
                          placeholder="Enter your password"
                          required
                          ?disabled=${this.loading}
                        />
                        <button 
                          class="btn btn-outline-secondary" 
                          type="button"
                          @click=${this._togglePasswordVisibility}
                          ?disabled=${this.loading}
                        >
                          <i class="bi bi-eye${this.showPassword?"-slash":""}"></i>
                        </button>
                      </div>
                    </div>

                    <!-- Remember Me & Forgot Password -->
                    <div class="d-flex justify-content-between align-items-center mb-4">
                      <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="rememberMe">
                        <label class="form-check-label" for="rememberMe">
                          Remember me
                        </label>
                      </div>
                      <a href="#" class="text-decoration-none small">Forgot password?</a>
                    </div>

                    <!-- Submit Button -->
                    <button 
                      type="submit" 
                      class="btn btn-primary btn-lg w-100"
                      ?disabled=${this.loading}
                    >
                      ${this.loading?h`<span class="spinner-border spinner-border-sm me-2"></span>Signing in...`:h`<i class="bi bi-box-arrow-in-right me-2"></i>Sign In`}
                    </button>
                  </form>
                </div>
              </div>

              <!-- Demo Credentials -->
              <div class="card mt-3 border-info">
                <div class="card-body">
                  <h6 class="card-title text-info">
                    <i class="bi bi-info-circle me-1"></i>Demo Credentials by Module
                  </h6>
                  <div class="small">
                    <div class="mb-2">
                      <strong>Super Admin:</strong> 
                      <code class="ms-2">admin / admin123</code>
                      <button class="btn btn-sm btn-outline-info ms-2" @click=${()=>{this.username="admin",this.password="admin123"}}>
                        Use
                      </button>
                      <div class="text-muted small">All modules (admin)</div>
                    </div>
                    <div class="mb-2">
                      <strong>Manager:</strong> 
                      <code class="ms-2">manager / manager123</code>
                      <button class="btn btn-sm btn-outline-info ms-2" @click=${()=>{this.username="manager",this.password="manager123"}}>
                        Use
                      </button>
                      <div class="text-muted small">Inventory, Analytics, Gdocs (admin)</div>
                    </div>
                    <div class="mb-2">
                      <strong>Sales:</strong> 
                      <code class="ms-2">user / user123</code>
                      <button class="btn btn-sm btn-outline-info ms-2" @click=${()=>{this.username="user",this.password="user123"}}>
                        Use
                      </button>
                      <div class="text-muted small">Sales (admin), CRM, Gdocs (user)</div>
                    </div>
                    <div class="mb-2">
                      <strong>Analyst:</strong> 
                      <code class="ms-2">analyst / analyst123</code>
                      <button class="btn btn-sm btn-outline-info ms-2" @click=${()=>{this.username="analyst",this.password="analyst123"}}>
                        Use
                      </button>
                      <div class="text-muted small">Analytics (admin), Gdocs (user)</div>
                    </div>
                    <div class="mb-2">
                      <strong>Inventory:</strong> 
                      <code class="ms-2">inventory / inventory123</code>
                      <button class="btn btn-sm btn-outline-info ms-2" @click=${()=>{this.username="inventory",this.password="inventory123"}}>
                        Use
                      </button>
                      <div class="text-muted small">Inventory (admin), Gdocs (user)</div>
                    </div>
                    <div>
                      <strong>CRM:</strong> 
                      <code class="ms-2">crm / crm123</code>
                      <button class="btn btn-sm btn-outline-info ms-2" @click=${()=>{this.username="crm",this.password="crm123"}}>
                        Use
                      </button>
                      <div class="text-muted small">CRM (admin), Sales, Gdocs (user)</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Footer -->
              <div class="text-center mt-4 text-muted small">
                <p class="mb-0">&copy; 2024 Lit SPA Dashboard. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `}}customElements.define("login-page",Ur);class Nr extends w{static properties={loading:{type:Boolean},error:{type:String}};createRenderRoot(){return this}constructor(){super(),this.loading=!0,this.error=null}connectedCallback(){super.connectedCallback(),this._handleCallback()}async _handleCallback(){try{const e=await Li(),t=Di(e);localStorage.setItem("auth_user",JSON.stringify(t)),localStorage.setItem("auth_token",e.access_token),window.location.href="/"}catch(e){console.error("OIDC callback error:",e),this.error=e.message||"Authentication failed",this.loading=!1}}render(){return this.loading?h`
        <div class="container mt-5">
          <div class="row justify-content-center">
            <div class="col-md-6 text-center">
              <div class="spinner-border text-primary mb-3" role="status" style="width: 3rem; height: 3rem;">
                <span class="visually-hidden">Loading...</span>
              </div>
              <h4>Completing authentication...</h4>
              <p class="text-muted">Please wait while we sign you in.</p>
            </div>
          </div>
        </div>
      `:this.error?h`
        <div class="container mt-5">
          <div class="row justify-content-center">
            <div class="col-md-6">
              <div class="alert alert-danger">
                <h4 class="alert-heading">
                  <i class="bi bi-exclamation-triangle me-2"></i>Authentication Failed
                </h4>
                <p>${this.error}</p>
                <hr>
                <a href="/login" class="btn btn-primary">
                  <i class="bi bi-arrow-left me-2"></i>Back to Login
                </a>
              </div>
            </div>
          </div>
        </div>
      `:h``}}customElements.define("oidc-callback",Nr);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const I={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4},we=s=>(...e)=>({_$litDirective$:s,values:e});class $e{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,i){this._$Ct=e,this._$AM=t,this._$Ci=i}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}}/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{I:Lr}=Yt,Dr=s=>s.strings===void 0,Lt=()=>document.createComment(""),F=(s,e,t)=>{const i=s._$AA.parentNode,n=e===void 0?s._$AB:e._$AA;if(t===void 0){const r=i.insertBefore(Lt(),n),o=i.insertBefore(Lt(),n);t=new Lr(r,o,s,s.options)}else{const r=t._$AB.nextSibling,o=t._$AM,a=o!==s;if(a){let c;t._$AQ?.(s),t._$AM=s,t._$AP!==void 0&&(c=s._$AU)!==o._$AU&&t._$AP(c)}if(r!==n||a){let c=t._$AA;for(;c!==r;){const l=c.nextSibling;i.insertBefore(c,n),c=l}}}return t},M=(s,e,t=s)=>(s._$AI(e,t),s),jr={},ti=(s,e=jr)=>s._$AH=e,zr=s=>s._$AH,Ie=s=>{s._$AR(),s._$AA.remove()};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Dt=(s,e,t)=>{const i=new Map;for(let n=e;n<=t;n++)i.set(s[n],n);return i},Br=we(class extends $e{constructor(s){if(super(s),s.type!==I.CHILD)throw Error("repeat() can only be used in text expressions")}dt(s,e,t){let i;t===void 0?t=e:e!==void 0&&(i=e);const n=[],r=[];let o=0;for(const a of s)n[o]=i?i(a,o):o,r[o]=t(a,o),o++;return{values:r,keys:n}}render(s,e,t){return this.dt(s,e,t).values}update(s,[e,t,i]){const n=zr(s),{values:r,keys:o}=this.dt(e,t,i);if(!Array.isArray(n))return this.ut=o,r;const a=this.ut??=[],c=[];let l,p,u=0,b=n.length-1,f=0,v=r.length-1;for(;u<=b&&f<=v;)if(n[u]===null)u++;else if(n[b]===null)b--;else if(a[u]===o[f])c[f]=M(n[u],r[f]),u++,f++;else if(a[b]===o[v])c[v]=M(n[b],r[v]),b--,v--;else if(a[u]===o[v])c[v]=M(n[u],r[v]),F(s,c[v+1],n[u]),u++,v--;else if(a[b]===o[f])c[f]=M(n[b],r[f]),F(s,n[u],n[b]),b--,f++;else if(l===void 0&&(l=Dt(o,f,v),p=Dt(a,u,b)),l.has(a[u]))if(l.has(a[b])){const O=p.get(o[f]),Ee=O!==void 0?n[O]:null;if(Ee===null){const pt=F(s,n[u]);M(pt,r[f]),c[f]=pt}else c[f]=M(Ee,r[f]),F(s,n[u],Ee),n[O]=null;f++}else Ie(n[b]),b--;else Ie(n[u]),u++;for(;f<=v;){const O=F(s,c[v+1]);M(O,r[f]),c[f++]=O}for(;u<=b;){const O=n[u++];O!==null&&Ie(O)}return this.ut=o,ti(s,c),A}});/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Fr=we(class extends $e{constructor(s){if(super(s),s.type!==I.ATTRIBUTE||s.name!=="class"||s.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(s){return" "+Object.keys(s).filter(e=>s[e]).join(" ")+" "}update(s,[e]){if(this.st===void 0){this.st=new Set,s.strings!==void 0&&(this.nt=new Set(s.strings.join(" ").split(/\s/).filter(i=>i!=="")));for(const i in e)e[i]&&!this.nt?.has(i)&&this.st.add(i);return this.render(e)}const t=s.element.classList;for(const i of this.st)i in e||(t.remove(i),this.st.delete(i));for(const i in e){const n=!!e[i];n===this.st.has(i)||this.nt?.has(i)||(n?(t.add(i),this.st.add(i)):(t.remove(i),this.st.delete(i)))}return A}});/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const qr=we(class extends $e{constructor(s){if(super(s),s.type!==I.PROPERTY&&s.type!==I.ATTRIBUTE&&s.type!==I.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!Dr(s))throw Error("`live` bindings can only contain a single expression")}render(s){return s}update(s,[e]){if(e===A||e===y)return e;const t=s.element,i=s.name;if(s.type===I.PROPERTY){if(e===t[i])return A}else if(s.type===I.BOOLEAN_ATTRIBUTE){if(!!e===t.hasAttribute(i))return A}else if(s.type===I.ATTRIBUTE&&t.getAttribute(i)===e+"")return A;return ti(s),e}});/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Hr(s,e,t){return s?e(s):t?.(s)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class oe extends $e{constructor(e){if(super(e),this.it=y,e.type!==I.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(e){if(e===y||e==null)return this._t=void 0,this.it=e;if(e===A)return e;if(typeof e!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(e===this.it)return this._t;this.it=e;const t=[e];return t.raw=t,this._t={_$litType$:this.constructor.resultType,strings:t,values:[]}}}oe.directiveName="unsafeHTML",oe.resultType=1;const Vr=we(oe);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class jt extends oe{}jt.directiveName="unsafeSVG",jt.resultType=2;const ko=Br,Mo=Fr,To=qr,Uo=Hr,Gr=Vr;class Jr extends w{static properties={title:{type:String,reflect:!0},highlight:{type:Boolean,reflect:!0},items:{type:String,reflect:!0},autoincrement:{type:Boolean,reflect:!0}};createRenderRoot(){return this}constructor(){super(),this.data=null,this.allRoles=[]}connectedCallback(){super.connectedCallback(),this._load()}async _load(){this.data=await Hn(),this.allRoles=await ve(),this._applyPropsToData(),this.requestUpdate()}_applyPropsToData(){if(this.data&&(this.title&&(this.data.title=this.title),this.highlight!==void 0&&(this.data.highlight=this.highlight),this.items))try{this.data.items=JSON.parse(this.items)}catch(e){console.error("Invalid items JSON:",e)}}render(){const e=S(),t=Hs(),i=Object.values(t).reduce((l,p)=>l+p.length,0),n=j(),r=tr(),o=(e?.assignedRoles||[]).map(l=>this.allRoles.find(p=>p.id===l)?.name).filter(l=>l),c={global:"Global Access",organization:"Organization",own:"Own Data Only"}[e?.permissionScope]||e?.permissionScope||"Not Set";return h`
      <div>
        <!-- Welcome Banner -->
        <div class="alert alert-light border-0 shadow-sm mb-4">
          <div class="d-flex align-items-center">
            <div class="flex-shrink-0">
              <i class="bi bi-house-door fs-1 text-primary"></i>
            </div>
            <div class="flex-grow-1 ms-3">
              <h4 class="alert-heading mb-1">Welcome back, ${e?.name}!</h4>
              <p class="mb-0 text-muted">You have access to ${n.length} modules with ${i} permissions across ${Object.keys(t).length} entities.</p>
            </div>
            ${r?h`
              <div class="flex-shrink-0">
                <span class="badge bg-danger fs-6 px-3 py-2">
                  <i class="bi bi-star-fill me-1"></i>Super Admin
                </span>
              </div>
            `:""}
          </div>
        </div>

        <!-- User Info & Stats -->
        <div class="row g-3 mb-4">
          <!-- User Profile Card -->
          <div class="col-md-3">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-body text-center">
                <i class="bi bi-person-circle fs-1 text-primary mb-2"></i>
                <h6 class="card-title mb-1">${e?.name}</h6>
                <p class="text-muted small mb-3">${e?.email}</p>
                <div class="d-flex flex-column gap-2">
                  <div class="d-flex align-items-center justify-content-between">
                    <small class="text-muted">Scope:</small>
                    <span class="badge bg-secondary">${c}</span>
                  </div>
                  <div class="d-flex align-items-center justify-content-between">
                    <small class="text-muted">Roles:</small>
                    <span class="badge bg-primary">${o.length||0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Permissions Card -->
          <div class="col-md-3">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-body text-center">
                <i class="bi bi-key fs-1 text-success mb-2"></i>
                <h2 class="mb-1">${i}</h2>
                <p class="text-muted mb-3">Total Permissions</p>
                <div class="d-flex flex-wrap gap-1 justify-content-center">
                  ${o.map(l=>h`
                    <span class="badge bg-success-subtle text-success border border-success" style="font-size: 0.7rem;">${l}</span>
                  `)}
                </div>
              </div>
            </div>
          </div>

          <!-- Entities Card -->
          <div class="col-md-3">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-body text-center">
                <i class="bi bi-grid-3x3-gap fs-1 text-info mb-2"></i>
                <h2 class="mb-1">${Object.keys(t).length}</h2>
                <p class="text-muted mb-3">Accessible Entities</p>
                <small class="text-muted">You can access ${Object.keys(t).length} different entity types</small>
              </div>
            </div>
          </div>

          <!-- Modules Card -->
          <div class="col-md-3">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-body text-center">
                <i class="bi bi-grid-3x3 fs-1 text-warning mb-2"></i>
                <h2 class="mb-1">${n.length}</h2>
                <p class="text-muted mb-3">Active Modules</p>
                <small class="text-muted">Access to ${n.length} modules via role permissions</small>
              </div>
            </div>
          </div>
        </div>

        <!-- Available Modules -->
        ${n.length>0?h`
          <div class="card border-0 shadow-sm mb-4">
            <div class="card-header bg-gradient bg-primary text-white">
              <h5 class="card-title mb-0">
                <i class="bi bi-grid-3x3 me-2"></i>Your Modules
              </h5>
              <small>Click any module to access its features</small>
            </div>
            <div class="card-body p-4">
              <div class="row g-4">
                ${n.map(l=>h`
                  <div class="col-md-4 col-lg-3">
                    <a href="/module/${l.id}" class="text-decoration-none">
                      <div class="card h-100 border-0 shadow-sm position-relative overflow-hidden" 
                           style="transition: all 0.3s ease;"
                           onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 8px 16px rgba(0,0,0,0.15)'"
                           onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.1)'">
                        <div class="position-absolute top-0 start-0 w-100 h-25 bg-${l.color}" style="opacity: 0.1;"></div>
                        <div class="card-body text-center position-relative">
                          <div class="mb-3">
                            <i class="bi bi-${l.icon} fs-1 text-${l.color}"></i>
                          </div>
                          <h5 class="card-title mb-2">${l.name}</h5>
                          <p class="text-muted small mb-3" style="min-height: 40px;">${l.description}</p>
                          <div class="btn btn-${l.color} btn-sm w-100">
                            <i class="bi bi-arrow-right-circle me-1"></i>Open
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                `)}
              </div>
            </div>
          </div>
        `:h`
          <div class="alert alert-warning border-0 shadow-sm mb-4">
            <div class="d-flex align-items-center">
              <i class="bi bi-exclamation-triangle fs-3 me-3"></i>
              <div>
                <h5 class="alert-heading mb-1">No Modules Available</h5>
                <p class="mb-0">You don't have access to any modules. Please contact your administrator to assign roles with appropriate permissions.</p>
              </div>
            </div>
          </div>
        `}

        <!-- Permissions by Entity -->
        ${i>0?h`
          <div class="card border-0 shadow-sm mb-4">
            <div class="card-header bg-gradient bg-success text-white">
              <h5 class="card-title mb-0">
                <i class="bi bi-shield-check me-2"></i>Your Permissions
              </h5>
              <small>Detailed breakdown of your access rights by entity</small>
            </div>
            <div class="card-body p-4">
              <div class="row g-3">
                ${Ls.map(l=>{const p=t[l.id]||[];if(p.length===0)return"";const u=p.length,b=p.includes("manage");return h`
                    <div class="col-md-6 col-lg-4">
                      <div class="card h-100 border-0 shadow-sm">
                        <div class="card-body">
                          <div class="d-flex align-items-start justify-content-between mb-2">
                            <div class="d-flex align-items-center">
                              <div class="bg-primary bg-opacity-10 rounded p-2 me-2">
                                <i class="bi bi-${l.icon} fs-5 text-primary"></i>
                              </div>
                              <div>
                                <h6 class="card-title mb-0">${l.name}</h6>
                                <small class="text-muted">${u} permission${u!==1?"s":""}</small>
                              </div>
                            </div>
                            ${b?h`
                              <span class="badge bg-danger">Full Access</span>
                            `:""}
                          </div>
                          <p class="text-muted small mb-3">${l.description}</p>
                          <div class="d-flex flex-wrap gap-1">
                            ${p.includes("create")?h`<span class="badge bg-success-subtle text-success border border-success"><i class="bi bi-plus-circle me-1"></i>Create</span>`:""}
                            ${p.includes("read")?h`<span class="badge bg-info-subtle text-info border border-info"><i class="bi bi-eye me-1"></i>Read</span>`:""}
                            ${p.includes("update")?h`<span class="badge bg-warning-subtle text-warning border border-warning"><i class="bi bi-pencil me-1"></i>Update</span>`:""}
                            ${p.includes("delete")?h`<span class="badge bg-danger-subtle text-danger border border-danger"><i class="bi bi-trash me-1"></i>Delete</span>`:""}
                            ${p.includes("manage")?h`<span class="badge bg-danger"><i class="bi bi-shield-check me-1"></i>Manage</span>`:""}
                            ${p.includes("export")?h`<span class="badge bg-secondary"><i class="bi bi-download me-1"></i>Export</span>`:""}
                            ${p.includes("approve")?h`<span class="badge bg-primary"><i class="bi bi-check-circle me-1"></i>Approve</span>`:""}
                          </div>
                        </div>
                      </div>
                    </div>
                  `})}
              </div>
            </div>
          </div>
        `:h`
          <div class="alert alert-info border-0 shadow-sm mb-4">
            <div class="d-flex align-items-center">
              <i class="bi bi-info-circle fs-3 me-3"></i>
              <div>
                <h5 class="alert-heading mb-1">No Permissions Assigned</h5>
                <p class="mb-0">You don't have any permissions assigned yet. Contact your administrator to get access.</p>
              </div>
            </div>
          </div>
        `}
      </div>
    `}}customElements.define("home-page",Jr);class Wr extends w{static properties={xml:{type:String},error:{type:String},mode:{type:String}};static styles=Bt`
    :host { display: block; padding: 16px; }
    h2 { margin: 0 0 12px; font-size: 18px; }
    .container { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    textarea { width: 100%; min-height: 280px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; font-size: 13px; padding: 10px; border: 1px solid #ddd; border-radius: 8px; }
    .viewer { border: 1px solid #ddd; border-radius: 8px; background: #0b1020; color: #e6edf3; padding: 12px; overflow: auto; min-height: 280px; }
    pre { margin: 0; white-space: pre; }
    .tag { color: #7ee787; }
    .name { color: #79c0ff; }
    .attr { color: #c9d1d9; }
    .value { color: #a5d6ff; }
    .text { color: #e6edf3; }
    .error { color: #b42318; background: #fee4e2; border: 1px solid #fda29b; padding: 8px 10px; border-radius: 8px; margin-top: 8px; }
    .toolbar { display: flex; gap: 8px; margin-bottom: 8px; align-items: center; }
    .grow { flex: 1; }
    button { cursor: pointer; border: 1px solid #ddd; background: #fff; padding: 6px 10px; border-radius: 6px; font-size: 13px; }
    button:hover { background: #f5f5f5; }
    select { border: 1px solid #ddd; background: #fff; padding: 6px 10px; border-radius: 6px; font-size: 13px; }
    table { width: 100%; border-collapse: collapse; background: #fff; color: #222; }
    th, td { border: 1px solid #e5e7eb; padding: 8px 10px; font-size: 13px; }
    th { background: #f9fafb; text-align: left; }
    .cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; }
    .card { border: 1px solid #e5e7eb; border-radius: 10px; background: #fff; padding: 12px; }
    .card h4 { margin: 0 0 8px; font-size: 14px; }
    .kv { display: grid; grid-template-columns: 120px 1fr; gap: 6px 10px; font-size: 13px; }
    .kv div { padding: 4px 0; }
    .block { border: 1px dashed #d1d5db; border-radius: 10px; background: #fafafa; color: #111; padding: 12px; }
  `;constructor(){super(),this.xml=`<catalog>
  <book id="bk101">
    <author>Gambardella, Matthew</author>
    <title>XML Developer's Guide</title>
    <genre>Computer</genre>
    <price currency="USD">44.95</price>
    <publish_date>2000-10-01</publish_date>
    <description>An in-depth look at creating applications with XML.</description>
  </book>
  <book id="bk102">
    <author>Ralls, Kim</author>
    <title>Midnight Rain</title>
    <genre>Fantasy</genre>
    <price currency="USD">5.95</price>
    <publish_date>2000-12-16</publish_date>
  </book>
</catalog>`,this.error="",this.mode="viewer"}updated(e){e.has("xml")&&(this.error="")}_format(e){try{const i=new DOMParser().parseFromString(e,"application/xml"),n=i.getElementsByTagName("parsererror")[0];if(n){const c=n.textContent||"Invalid XML";throw new Error(c)}const o=new XMLSerializer().serializeToString(i),a=this._prettify(o);return this._highlight(this._escape(a))}catch(t){return this.error=t.message,this._highlight(this._escape(this.xml))}}_prettify(e){const t="  ",i=/(>)(<)(\/*)/g;let n="",r=0;return e=e.replace(i,`$1
$2$3`),e.split(`
`).forEach(o=>{if(!o)return;let a=0;o.match(/^<\//)?r=Math.max(r-1,0):o.match(/<.*?>.*<\/.+>/)||o.match(/<.*?\/>/)?a=0:o.match(/^<[^!?].*?>$/)?a=1:a=0;const c=t.repeat(r);n+=c+o+`
`,r+=a}),n.trim()}_escape(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/\'/g,"&#39;")}_highlight(e){let t=e;return t=t.replace(/(&lt;\/?)([\w:-]+)([^&]*?)(&gt;)/g,(i,n,r,o,a)=>{const c=o.replace(/([\w:-]+)(=)(&quot;.*?&quot;)/g,'<span class="attr">$1</span>$2<span class="value">$3</span>');return`<span class="tag">${n}</span><span class="name">${r}</span>${c}<span class="tag">${a}</span>`}).replace(/(^|\n)([^<\n][^\n]*)/g,(i,n,r)=>`${n}<span class="text">${r}</span>`),t}_onSample(){this.xml=`<order id="PO-1001">
  <buyer>Acme Corp</buyer>
  <items>
    <item sku="ABC123" qty="2">Widget</item>
    <item sku="XYZ999" qty="5">Gadget</item>
  </items>
</order>`}_onFormat(){this.requestUpdate()}_onInput(e){this.xml=e.target.value}_toJson(e){try{const i=new DOMParser().parseFromString(e,"application/xml"),n=i.getElementsByTagName("parsererror")[0];if(n)throw new Error(n.textContent||"Invalid XML");const r=a=>{if(a.nodeType===3)return a.nodeValue.trim()?a.nodeValue:null;if(a.nodeType!==1)return null;const c={_name:a.nodeName};if(a.attributes&&a.attributes.length){c._attrs={};for(const p of a.attributes)c._attrs[p.name]=p.value}const l=[];for(const p of a.childNodes){const u=r(p);u!=null&&!(typeof u=="string"&&u==="")&&l.push(u)}if(l.length===1&&typeof l[0]=="string")c._text=l[0];else if(l.length){c._children=l.filter(u=>typeof u=="object");const p=l.filter(u=>typeof u=="string");p.length&&(c._text=p.join(" "))}return c},o=Array.from(i.childNodes).find(a=>a.nodeType===1);return r(o)}catch(t){return this.error=t.message,null}}_asCollection(e){if(!e)return{items:[],fields:[]};const i=(r=>{const o={};(r._children||[]).forEach(c=>{o[c._name]=o[c._name]||[],o[c._name].push(c)});const a=Object.entries(o).sort((c,l)=>l[1].length-c[1].length)[0];return a&&a[1].length>1?a[1]:r._children&&r._children.length?r._children:[r]})(e),n=new Set;return i.forEach(r=>{r._attrs&&Object.keys(r._attrs).forEach(o=>n.add("@"+o)),(r._children||[]).forEach(o=>n.add(o._name)),r._text&&n.add("#text")}),{items:i,fields:Array.from(n)}}_renderTable(e){const t=e.fields,i=e.items.map(n=>t.map(r=>{if(r==="#text")return n._text||"";if(r.startsWith("@"))return(n._attrs||{})[r.slice(1)]||"";const o=(n._children||[]).find(a=>a._name===r);return o&&o._text||""}));return h`
      <table>
        <thead><tr>${t.map(n=>h`<th>${n}</th>`)}</tr></thead>
        <tbody>
          ${i.map(n=>h`<tr>${n.map(r=>h`<td>${r}</td>`)}</tr>`)}
        </tbody>
      </table>
    `}_renderCards(e){return h`
      <div class="cards">
        ${e.items.map((t,i)=>h`
          <div class="card">
            <h4>${t._name} ${i+1}</h4>
            <div class="kv">
              ${e.fields.map(n=>h`
                <div><strong>${n}</strong></div>
                <div>${n==="#text"?t._text||"":n.startsWith("@")?(t._attrs||{})[n.slice(1)]||"":(t._children||[]).find(r=>r._name===n)&&(t._children||[]).find(r=>r._name===n)._text||""}</div>
              `)}
            </div>
          </div>
        `)}
      </div>
    `}_renderBlocks(e){return h`
      <div class="block">
        ${e.items.map(t=>h`
          <div style="margin-bottom:12px;">
            <div style="font-weight:600; margin-bottom:6px;">${t._name}</div>
            ${e.fields.map(i=>h`<div><span style="color:#6b7280;">${i}:</span> <span>${i==="#text"?t._text||"":i.startsWith("@")?(t._attrs||{})[i.slice(1)]||"":(t._children||[]).find(n=>n._name===i)&&(t._children||[]).find(n=>n._name===i)._text||""}</span></div>`)}
          </div>
        `)}
      </div>
    `}_renderMode(){if(this.mode==="table"){const e=this._toJson(this.xml),t=this._asCollection(e);return this._renderTable(t)}if(this.mode==="cards"){const e=this._toJson(this.xml),t=this._asCollection(e);return this._renderCards(t)}if(this.mode==="blocks"){const e=this._toJson(this.xml),t=this._asCollection(e);return this._renderBlocks(t)}return h`<div class="viewer"><pre><code>${Gr(this._format(this.xml))}</code></pre></div>`}render(){return h`
      <h2>XML Viewer</h2>
      <div class="toolbar">
        <button @click=${this._onSample}>Load sample</button>
        <button @click=${this._onFormat}>Format</button>
        <div class="grow"></div>
        <label>Mode:</label>
        <select .value=${this.mode} @change=${e=>this.mode=e.target.value}>
          <option value="viewer">Viewer</option>
          <option value="table">Table</option>
          <option value="cards">Cards</option>
          <option value="blocks">Blocks</option>
        </select>
      </div>
      ${this.error?h`<div class="error">${this.error}</div>`:""}
      <div class="container">
        <textarea .value=${this.xml} @input=${this._onInput}></textarea>
        ${this._renderMode()}
      </div>
    `}}customElements.define("xml-viewer-page",Wr);class Yr extends w{createRenderRoot(){return this}_goBack(){window.history.back()}_goHome(){window.history.pushState({},"","/"),window.dispatchEvent(new PopStateEvent("popstate"))}render(){return h`
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-6 text-center">
            <div class="py-5">
              <div class="mb-4">
                <i class="bi bi-shield-x text-danger" style="font-size: 120px;"></i>
              </div>
              
              <h1 class="display-4 fw-bold text-danger mb-3">Access Denied</h1>
              <p class="lead text-muted mb-4">
                You don't have permission to access this page.
              </p>
              
              <div class="alert alert-warning">
                <i class="bi bi-exclamation-triangle me-2"></i>
                <strong>Insufficient Permissions</strong>
                <p class="mb-0 mt-2 small">
                  This page requires specific permissions that are not assigned to your role.
                  Please contact your administrator if you believe you should have access.
                </p>
              </div>

              <div class="d-flex gap-2 justify-content-center mt-4">
                <button @click=${this._goBack} class="btn btn-outline-secondary">
                  <i class="bi bi-arrow-left me-1"></i>Go Back
                </button>
                <button @click=${this._goHome} class="btn btn-primary">
                  <i class="bi bi-house me-1"></i>Go to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `}}customElements.define("access-denied",Yr);class Kr extends w{static properties={message:{type:String,reflect:!0}};createRenderRoot(){return this}render(){return h`
      <div class="card shadow text-center">
        <div class="card-body">
          <h1 class="card-title display-4">Not Found</h1>
          <p class="card-text">${this.message||"The page you requested could not be found."}</p>
          <a href="/" class="btn btn-primary">Go home</a>
        </div>
      </div>
    `}}customElements.define("not-found",Kr);const Xr=[{id:"home",name:"Home",path:"/",icon:"house",keywords:["home"]}],Zr={admin:{items:[{id:"admin-dashboard",name:"Dashboard",path:"/module/admin",icon:"speedometer2",iconColor:"danger",keywords:["dashboard"]},{id:"users",name:"Users",path:"/users",icon:"people",iconColor:"primary",keywords:["users"],permission:"users.read"},{id:"roles",name:"Roles",path:"/roles",icon:"shield-check",iconColor:"success",keywords:["roles"],permission:"roles.read"},{id:"permissions",name:"Permissions",path:"/permissions",icon:"gear-wide-connected",iconColor:"warning",keywords:["permissions"],permission:"permissions.read"},{id:"impersonate",name:"Impersonate User",path:"/users/impersonate",icon:"incognito",iconColor:"warning",keywords:["impersonate","support","troubleshoot"]}],sections:[{id:"security",title:"SECURITY",keywords:["security","audit","settings","activity","sessions"],items:[{id:"audit-log",name:"Audit Log",path:"/security/audit-log",icon:"clock-history",iconColor:"danger",keywords:["audit","log"],permission:"security.read"},{id:"security-settings",name:"Security Settings",path:"/security/settings",icon:"gear",iconColor:"warning",keywords:["settings","security"],permission:"security.manage"},{id:"user-activity",name:"User Activity",path:"/security/activity",icon:"activity",iconColor:"info",keywords:["activity","monitor"],permission:"security.read"},{id:"sessions",name:"Sessions",path:"/security/sessions",icon:"pc-display",iconColor:"success",keywords:["sessions"],permission:"security.manage"},{id:"security-demo",name:"Security Demo",path:"/admin/security-demo",icon:"shield-lock",iconColor:"primary",keywords:["demo","security"],permission:"module.admin"}]}]},sla:{items:[{id:"sla-dashboard",name:"Dashboard",path:"/sla/dashboard",icon:"speedometer2",iconColor:"primary",keywords:["dashboard"]},{id:"incidents",name:"Incidents",path:"/sla/incidents",icon:"exclamation-triangle",iconColor:"danger",keywords:["incidents"]}]},sales:{items:[{id:"sales-dashboard",name:"Dashboard",path:"/module/sales",icon:"speedometer2",iconColor:"success",keywords:["dashboard"]}]},analytics:{items:[{id:"analytics-dashboard",name:"Dashboard",path:"/module/analytics",icon:"speedometer2",iconColor:"info",keywords:["dashboard"]},{id:"forecast",name:"Forecast",path:"/module/analytics/forecast",icon:"graph-up-arrow",keywords:["forecast"]}]},gdocs:{items:[{id:"inbox",name:"Inbox",path:"/gdocs/inbox",icon:"inbox",iconColor:"primary",keywords:["inbox"],children:[{id:"inbox-purchase-orders",name:"Inbox POs",path:"/gdocs/inbox/purchase-orders",icon:"clipboard-check",keywords:["inbox","purchase"],indent:!0},{id:"inbox-invoices",name:"Inbox Invoices",path:"/gdocs/inbox/invoices",icon:"receipt",keywords:["inbox","invoice"],indent:!0},{id:"inbox-acknowledgements",name:"Inbox ACKs",path:"/gdocs/inbox/acknowledgements",icon:"check-circle",keywords:["inbox","acknowledgement"],indent:!0}]},{id:"outbox",name:"Outbox",path:"/gdocs/outbox",icon:"send",iconColor:"success",keywords:["outbox"],children:[{id:"outbox-purchase-orders",name:"Outbox POs",path:"/gdocs/outbox/purchase-orders",icon:"clipboard-check",keywords:["outbox","purchase"],indent:!0},{id:"outbox-invoices",name:"Outbox Invoices",path:"/gdocs/outbox/invoices",icon:"receipt",keywords:["outbox","invoice"],indent:!0},{id:"open-po-search",name:"Open PO Search",path:"/gdocs/outbox/open-po-search",icon:"search",iconColor:"info",keywords:["outbox","open","search"],indent:!0},{id:"open-invoice-search",name:"Open Invoice Search",path:"/gdocs/outbox/open-invoice-search",icon:"search",iconColor:"warning",keywords:["outbox","open","search"],indent:!0}]},{id:"invoice-reports",name:"Invoice Reports",path:"/gdocs/reports/invoices",icon:"file-bar-graph",keywords:["reports"]},{id:"open-orders-reports",name:"Open Orders Reports",path:"/gdocs/reports/open-orders",icon:"bar-chart-line",keywords:["reports","orders"]}]},commerce:{items:[{id:"commerce-dashboard",name:"Dashboard",path:"/website/ecommerce",icon:"speedometer2",iconColor:"success",keywords:["dashboard"]}],sections:[{id:"b2b-management",title:"B2B MANAGEMENT",keywords:["b2b","business"],items:[{id:"b2b-dashboard",name:"B2B Dashboard",path:"/website/b2b",icon:"building-gear",iconColor:"info",keywords:["b2b","dashboard"]},{id:"products",name:"Products",path:"/website/products",icon:"box-seam",keywords:["products","catalog"]},{id:"categories",name:"Categories",path:"/website/categories",icon:"tags",keywords:["categories","catalog"]},{id:"inventory",name:"Inventory",path:"/website/inventory",icon:"boxes",keywords:["inventory","stock"]},{id:"quotes",name:"Quotes",path:"/website/b2b/quotes",icon:"file-earmark-text",keywords:["quotes","rfq","b2b"]},{id:"pricelists",name:"Price Lists",path:"/website/b2b/pricelists",icon:"cash-stack",keywords:["pricelists","pricing","b2b"]},{id:"contracts",name:"Contracts",path:"/website/b2b/contracts",icon:"file-earmark-ruled",keywords:["contracts","b2b"]},{id:"purchase-orders",name:"Purchase Orders",path:"/website/b2b/purchase-orders",icon:"clipboard-check",keywords:["purchase","po","b2b"]}]},{id:"customer-portal",title:"CUSTOMER PORTAL",keywords:["storefront","portal"],items:[{id:"storefront",name:"Storefront",path:"/b2b-store",icon:"shop-window",iconColor:"info",keywords:["storefront","portal","dashboard"]},{id:"catalog",name:"Catalog",path:"/b2b-store/catalog",icon:"grid",keywords:["catalog","storefront"]},{id:"quick-order",name:"Quick Order",path:"/b2b-store/quick-order",icon:"lightning",iconColor:"warning",keywords:["quick","order","storefront"]},{id:"shopping-cart",name:"Shopping Cart",path:"/b2b-store/cart",icon:"cart3",iconColor:"primary",keywords:["cart","storefront"]},{id:"order-history",name:"Order History",path:"/b2b-store/orders",icon:"box-seam",iconColor:"info",keywords:["orders","storefront"]},{id:"purchased-products",name:"Purchased Products",path:"/b2b-store/purchased-products",icon:"cart-check",iconColor:"success",keywords:["purchased","purchase history","storefront"]},{id:"invoice-history",name:"Invoice History",path:"/b2b-store/invoices",icon:"receipt",iconColor:"success",keywords:["invoices","storefront"]},{id:"my-account",name:"My Account",path:"/b2b-store/account",icon:"person-circle",keywords:["account","storefront"],children:[{id:"address-book",name:"Address Book",path:"/b2b-store/account/addresses",icon:"geo-alt",iconColor:"primary",keywords:["address","account","storefront"],indent:!0},{id:"payment-methods",name:"Payment Methods",path:"/b2b-store/account/payment-methods",icon:"credit-card",iconColor:"success",keywords:["payment","account","storefront"],indent:!0}]},{id:"approvals",name:"Approvals",path:"/b2b-store/approvals",icon:"check-circle",iconColor:"warning",keywords:["approval","storefront"],children:[{id:"my-requests",name:"My Requests",path:"/b2b-store/approvals/requests",icon:"send",iconColor:"primary",keywords:["approval","request","storefront"],indent:!0},{id:"approval-rules",name:"Approval Rules",path:"/b2b-store/approvals/rules",icon:"gear",iconColor:"secondary",keywords:["approval","rules","storefront"],indent:!0}]},{id:"keepstock",name:"KeepStock",path:"/b2b-store/keepstock",icon:"boxes",iconColor:"info",keywords:["keepstock","reorder","replenishment","storefront"]},{id:"punchout-inbound",name:"Punchout (Inbound)",path:"/b2b-store/punchout",icon:"link-45deg",iconColor:"primary",keywords:["punchout","procurement","storefront"]},{id:"external-suppliers",name:"External Suppliers",path:"/b2b-store/external-punchout",icon:"box-arrow-up-right",iconColor:"success",keywords:["external","supplier","storefront"]}]}]},companies:{items:[{id:"companies",name:"Companies",path:"/companies",icon:"building",iconColor:"primary",keywords:["companies"]},{id:"add-company",name:"Add Company",path:"/companies/new",icon:"plus-circle",keywords:["add","company"]}]}},Qr={staticMenuItems:Xr,moduleSubmenus:Zr},Pe="impersonation_state",ke="impersonation_audit";class eo{constructor(){this._originalUser=null,this._impersonatedUser=null,this._isImpersonating=!1,this._listeners=new Set,this._restoreState()}canImpersonate(){try{const e=Gs("admin"),t=R("users","read"),i=e&&t;return i||console.log("🎭 canImpersonate check:",{hasAdminAccess:e,hasUsersPermission:t,result:i}),i}catch(e){return console.error("🎭 Error in canImpersonate:",e),!1}}async startImpersonation(e){if(!this.canImpersonate())throw new Error("Permission denied: Only admins can impersonate users");const t=S();if(t.id===e.id)throw new Error("Cannot impersonate yourself");this._isImpersonating||(this._originalUser=t),this._impersonatedUser=e,this._isImpersonating=!0,this._saveState(),this._logImpersonation(t,e,"START"),await this._updatePermissions(),this._notifyListeners(),window.dispatchEvent(new CustomEvent("impersonation-started",{detail:{originalUser:this._originalUser,impersonatedUser:this._impersonatedUser}})),console.log(`🎭 Impersonation started: ${t.name} -> ${e.name}`)}async stopImpersonation(){if(!this._isImpersonating)return;const e=this._originalUser,t=this._impersonatedUser;this._isImpersonating=!1,this._impersonatedUser=null,this._originalUser=null,this._clearState(),this._logImpersonation(e,t,"STOP"),await this._updatePermissions(),this._notifyListeners(),window.dispatchEvent(new CustomEvent("impersonation-stopped",{detail:{originalUser:e,impersonatedUser:t}})),console.log(`🎭 Impersonation stopped: ${e.name} resumed control`),window.location.reload()}getEffectiveUser(){return this._isImpersonating&&this._impersonatedUser?this._impersonatedUser:S()}getOriginalUser(){return this._originalUser}isImpersonating(){return this._isImpersonating}getStatus(){return{isImpersonating:this._isImpersonating,originalUser:this._originalUser,impersonatedUser:this._impersonatedUser}}subscribe(e){return this._listeners.add(e),()=>this._listeners.delete(e)}getAuditLog(){try{return JSON.parse(localStorage.getItem(ke)||"[]")}catch(e){return console.error("Failed to load impersonation audit log:",e),[]}}clearAuditLog(){if(!this.canImpersonate())throw new Error("Permission denied");localStorage.removeItem(ke)}_saveState(){try{const e={isImpersonating:this._isImpersonating,originalUser:this._originalUser,impersonatedUser:this._impersonatedUser,timestamp:Date.now()};localStorage.setItem(Pe,JSON.stringify(e))}catch(e){console.error("Failed to save impersonation state:",e)}}_restoreState(){try{const e=localStorage.getItem(Pe);if(!e)return;const t=JSON.parse(e),i=24*60*60*1e3;if(Date.now()-t.timestamp>i){this._clearState();return}this._isImpersonating=t.isImpersonating,this._originalUser=t.originalUser,this._impersonatedUser=t.impersonatedUser,this._isImpersonating&&(console.log("🎭 Restored impersonation session"),this._updatePermissions())}catch(e){console.error("Failed to restore impersonation state:",e),this._clearState()}}_clearState(){localStorage.removeItem(Pe)}_logImpersonation(e,t,i){try{const n=this.getAuditLog(),r={id:Date.now()+Math.random().toString(36),timestamp:new Date().toISOString(),action:i,adminId:e.id,adminName:e.name,adminEmail:e.email,targetUserId:t.id,targetUserName:t.name,targetUserEmail:t.email,userAgent:navigator.userAgent,ip:"client-side"};n.unshift(r);const o=n.slice(0,100);localStorage.setItem(ke,JSON.stringify(o))}catch(n){console.error("Failed to log impersonation:",n)}}async _updatePermissions(){const e=this.getEffectiveUser(),i=JSON.parse(localStorage.getItem("users_cache")||"[]").find(o=>o.id===e.id),n=JSON.parse(localStorage.getItem("roles_cache")||"[]"),r=(i?.assignedRoles||[]).map(o=>n.find(a=>a.id===o)).filter(Boolean);await lt(e,r),console.log(`🔐 Permissions updated for: ${e.name}`)}_notifyListeners(){const e=this.getStatus();this._listeners.forEach(t=>{try{t(e)}catch(i){console.error("Error in impersonation listener:",i)}})}}const ee=new eo;class ae extends w{static properties={menuOpen:{type:Boolean},menuPinned:{type:Boolean},menuFilter:{type:String},expandedModules:{type:Object},userModules:{type:Array},currentPath:{type:String}};static menuConfig=Qr;constructor(){super(),this._handleRouteChange=this._handleRouteChange.bind(this),this._handleLinkClick=this._handleLinkClick.bind(this)}connectedCallback(){super.connectedCallback(),window.addEventListener("popstate",this._handleRouteChange),this.addEventListener("click",this._handleLinkClick)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("popstate",this._handleRouteChange),this.removeEventListener("click",this._handleLinkClick)}_handleRouteChange(){this.requestUpdate()}_handleLinkClick(e){e.target.closest('a[href^="/"]')&&setTimeout(()=>this.requestUpdate(),10)}createRenderRoot(){return this}_toggleMenuPin(){this.menuPinned=!this.menuPinned,localStorage.setItem("menu_pinned",this.menuPinned.toString()),this.dispatchEvent(new CustomEvent("menu-pin-changed",{detail:{pinned:this.menuPinned},bubbles:!0,composed:!0}))}_handleMenuFilter(e){this.dispatchEvent(new CustomEvent("menu-filter-changed",{detail:{filter:e.target.value.toLowerCase()},bubbles:!0,composed:!0}))}_clearMenuFilter(){this.dispatchEvent(new CustomEvent("menu-filter-cleared",{bubbles:!0,composed:!0}))}_handleMenuMouseLeave(){this.menuPinned||(this.menuOpen=!1,this.dispatchEvent(new CustomEvent("menu-close",{bubbles:!0,composed:!0})))}_toggleModuleExpansion(e,t){t.preventDefault(),this.dispatchEvent(new CustomEvent("module-toggled",{detail:{moduleId:e},bubbles:!0,composed:!0}))}_isActive(e){const t=window.__BASE_URL||"/",i=window.location.pathname,n=typeof window.withBase=="function"?window.withBase(e):t.replace(/\/$/,"")+e;return i===n?"active":""}_moduleMatchesFilter(e){if(!this.menuFilter)return!0;const t=this.menuFilter;if(e.name.toLowerCase().includes(t))return!0;const i=ae.menuConfig.moduleSubmenus[e.id];if(!i)return!1;const n=r=>r.some(o=>o.includes(t));if(i.items?.some(r=>n(r.keywords)))return!0;if(i.sections){for(const r of i.sections)if(n(r.keywords)||r.items.some(o=>n(o.keywords)))return!0}return!1}render(){return!this.menuOpen&&!this.menuPinned?h``:h`
      <div class="top-menu-popover ${this.menuPinned?"menu-pinned":""} bg-white border shadow-lg" 
           @mouseleave=${this._handleMenuMouseLeave}>
        <div class="p-3">
          <!-- Pin Button -->
          <div class="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
            <h6 class="mb-0 fw-bold">Navigation Menu</h6>
            <button class="btn btn-sm btn-outline-secondary" 
                    @click=${this._toggleMenuPin}
                    title="${this.menuPinned?"Unpin menu":"Pin menu"}">
              <i class="bi bi-${this.menuPinned?"pin-fill":"pin-angle"}"></i>
            </button>
          </div>
          
          <!-- Menu Filter -->
          <div class="mb-3">
            <div class="input-group input-group-sm">
              <span class="input-group-text bg-white">
                <i class="bi bi-search text-muted"></i>
              </span>
              <input 
                type="text" 
                class="form-control" 
                placeholder="Filter menu..."
                .value=${this.menuFilter}
                @input=${this._handleMenuFilter}
              />
              ${this.menuFilter?h`
                <button class="btn btn-outline-secondary" @click=${this._clearMenuFilter} type="button">
                  <i class="bi bi-x"></i>
                </button>
              `:""}
            </div>
          </div>
          
            <ul class="nav flex-column">
              <li class="nav-item">
                <a class="nav-link ${this._isActive("/")}" href="/" data-title="Home">
                  <i class="bi bi-house me-2"></i><span>Home</span>
                </a>
              </li>

              <!-- Business Modules -->
              ${this.userModules.length>0?h`
                ${this.userModules.filter(e=>this._moduleMatchesFilter(e)).map(e=>h`
                  <li class="nav-item">
                    <a class="nav-link d-flex justify-content-between align-items-center" 
                       href="#"
                       data-title="${e.name}"
                       @click=${t=>this._toggleModuleExpansion(e.id,t)}>
                      <span>
                        <i class="bi bi-${e.icon} me-2 text-${e.color}"></i><span>${e.name}</span>
                      </span>
                      <i class="bi bi-chevron-${this.expandedModules[e.id]?"down":"right"} text-muted"></i>
                    </a>
                    
                    ${this.renderModuleSubmenu(e)}
                  </li>
                `)}
              `:""}
            </ul>

            <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
              <span>Reports</span>
            </h6>
            <ul class="nav flex-column mb-2">
              <li class="nav-item">
                <a class="nav-link" href="#" data-title="Analytics">
                  <i class="bi bi-graph-up me-2"></i><span>Analytics</span>
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#" data-title="Reports">
                  <i class="bi bi-file-earmark-text me-2"></i><span>Reports</span>
                </a>
              </li>
            </ul>
        </div>
      </div>
    `}renderModuleSubmenu(e){if(!this.expandedModules[e.id])return"";const t=ae.menuConfig.moduleSubmenus[e.id];return t?h`
      <ul class="nav flex-column ms-3">
        ${this.renderMenuItems(t.items||[])}
        ${t.sections?t.sections.map(i=>this.renderSection(i)):""}
      </ul>
    `:""}renderSection(e){return!this.menuFilter||e.keywords.some(i=>i.includes(this.menuFilter))||e.items.some(i=>i.keywords.some(n=>n.includes(this.menuFilter)))?h`
      <li class="nav-item">
        <hr class="my-2 text-muted">
        <div class="text-muted small px-3 mb-1">${e.title}</div>
      </li>
      ${this.renderMenuItems(e.items)}
    `:""}renderMenuItems(e){return e.map(t=>{if(!(!this.menuFilter||t.keywords.some(o=>o.includes(this.menuFilter))))return"";if(t.id==="impersonate")try{if(!ee.canImpersonate())return console.log("🎭 Hiding impersonate menu - user lacks admin access or users.read permission"),""}catch(o){return console.error("🎭 Error checking impersonation permission:",o),""}if(t.permission){const[o,a]=t.permission.split(".");if(o&&a&&!R(o,a))return""}const n=t.iconColor?`text-${t.iconColor}`:"",r=t.indent?"ps-4":"";return h`
        <li class="nav-item">
          <a class="nav-link ${this._isActive(t.path)} py-1 ${r}" 
             href="${t.path}"
             data-title="${t.name}">
            <i class="bi bi-${t.icon} me-2 ${n}"></i><span>${t.name}</span>
          </a>
        </li>
        ${t.children?this.renderMenuItems(t.children):""}
      `})}}customElements.define("side-nav",ae);class to{constructor(){this._listeners=new Map}on(e,t){return this._listeners.has(e)||this._listeners.set(e,new Set),this._listeners.get(e).add(t),()=>this.off(e,t)}once(e,t){const i=n=>{t(n),this.off(e,i)};return this.on(e,i)}off(e,t){this._listeners.has(e)&&(this._listeners.get(e).delete(t),this._listeners.get(e).size===0&&this._listeners.delete(e))}emit(e,t){this._listeners.has(e)&&this._listeners.get(e).forEach(i=>{try{i(t)}catch(n){console.error(`Error in event listener for "${e}":`,n)}}),window.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0}))}clear(e){e?this._listeners.delete(e):this._listeners.clear()}listenerCount(e){return this._listeners.has(e)?this._listeners.get(e).size:0}eventNames(){return Array.from(this._listeners.keys())}}const Me=new to,Te={AUTH_LOGIN:"auth:login",AUTH_LOGOUT:"auth:logout",AUTH_TOKEN_EXPIRED:"auth:token-expired",AUTH_TOKEN_REFRESHED:"auth:token-refreshed",AUTH_STATE_CHANGED:"auth:state-changed",NAV_MENU_TOGGLE:"nav:menu-toggle",NAV_MENU_PIN:"nav:menu-pin",NAV_MENU_UNPIN:"nav:menu-unpin",NAV_MODULE_SWITCH:"nav:module-switch",NAV_ROUTE_CHANGED:"nav:route-changed",USER_CREATED:"user:created",USER_UPDATED:"user:updated",USER_DELETED:"user:deleted",USER_PROFILE_UPDATED:"user:profile-updated",ROLE_CREATED:"role:created",ROLE_UPDATED:"role:updated",ROLE_DELETED:"role:deleted",ROLE_ASSIGNED:"role:assigned",ROLE_REVOKED:"role:revoked",PERMISSION_GRANTED:"permission:granted",PERMISSION_REVOKED:"permission:revoked",CUSTOMER_CREATED:"customer:created",CUSTOMER_UPDATED:"customer:updated",CUSTOMER_DELETED:"customer:deleted",DATA_LOADED:"data:loaded",DATA_SAVED:"data:saved",DATA_ERROR:"data:error",DATA_REFRESHED:"data:refreshed",UI_LOADING_START:"ui:loading-start",UI_LOADING_END:"ui:loading-end",UI_NOTIFICATION:"ui:notification",UI_ERROR:"ui:error",UI_SUCCESS:"ui:success",UI_WARNING:"ui:warning",FORM_SUBMIT:"form:submit",FORM_CANCEL:"form:cancel",FORM_RESET:"form:reset",FORM_VALIDATION_ERROR:"form:validation-error",MODAL_OPEN:"modal:open",MODAL_CLOSE:"modal:close",MODAL_CONFIRM:"modal:confirm",MODAL_CANCEL:"modal:cancel"};class so extends w{static properties={currentUser:{type:Object},currentModule:{type:Object},userModules:{type:Array},menuPinned:{type:Boolean}};constructor(){super(),this.currentUser=null,this.currentModule=null,this.userModules=[],this.menuPinned=!1}createRenderRoot(){return this}_toggleMenu(){Me.emit(Te.NAV_MENU_TOGGLE,{menuPinned:this.menuPinned}),this.dispatchEvent(new CustomEvent("menu-toggle",{bubbles:!0,composed:!0}))}_handleModuleSwitch(e){Me.emit(Te.NAV_MODULE_SWITCH,{moduleId:e}),this.dispatchEvent(new CustomEvent("module-switch",{detail:{moduleId:e},bubbles:!0,composed:!0}))}_handleLogout(e){e.preventDefault(),Me.emit(Te.AUTH_LOGOUT,{user:this.currentUser}),this.dispatchEvent(new CustomEvent("user-logout",{bubbles:!0,composed:!0}))}render(){return h`
      <nav class="navbar navbar-expand-lg navbar-dark bg-primary sticky-top shadow-sm">
        <div class="container-fluid">
          <!-- Menu Toggle Button -->
          <button class="btn ${this.menuPinned?"btn-secondary":"btn-light"} me-3 menu-toggle-btn" 
                  @click=${this._toggleMenu}
                  title="${this.menuPinned?"Menu is pinned - unpin from menu":"Toggle menu"}">
            <i class="bi bi-${this.menuPinned?"pin-fill":"list"} fs-4"></i>
          </button>

          <a class="navbar-brand fw-bold" href="/">
            <i class="bi bi-lightning-charge-fill me-2"></i>Lit SPA Dashboard
          </a>
          
          <!-- User Info & Logout -->
          <div class="d-flex align-items-center gap-3">
            <!-- Module Switcher -->
            ${this.userModules.length>1?h`
              <div class="dropdown">
                <button class="btn btn-light dropdown-toggle" type="button" id="moduleDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                  <i class="bi bi-${this.currentModule?.icon} text-${this.currentModule?.color} me-1"></i>
                  ${this.currentModule?.name}
                </button>
                <ul class="dropdown-menu" aria-labelledby="moduleDropdown">
                  <li><h6 class="dropdown-header">Switch Module</h6></li>
                  <li><hr class="dropdown-divider"></li>
                  ${this.userModules.map(e=>h`
                    <li>
                      <a class="dropdown-item ${e.id===this.currentModule?.id?"active":""}" 
                         href="#" 
                         @click=${t=>{t.preventDefault(),this._handleModuleSwitch(e.id)}}>
                        <i class="bi bi-${e.icon} text-${e.color} me-2"></i>
                        ${e.name}
                        <br>
                        <small class="text-muted">${e.description}</small>
                      </a>
                    </li>
                  `)}
                </ul>
              </div>
            `:""}

            <!-- User Menu -->
            <div class="dropdown">
              <button class="btn btn-primary dropdown-toggle" type="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="bi bi-person-circle me-1"></i>
                ${this.currentUser?.name||"User"}
              </button>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                <li>
                  <h6 class="dropdown-header">
                    <i class="bi bi-person-badge me-1"></i>
                    ${this.currentUser?.username}
                  </h6>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li>
                  <span class="dropdown-item-text">
                    <small class="text-muted">Role:</small>
                    <span class="badge bg-primary ms-1">${this.currentUser?.role}</span>
                  </span>
                </li>
                <li>
                  <span class="dropdown-item-text">
                    <small class="text-muted">${this.currentUser?.email}</small>
                  </span>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li>
                  <a class="dropdown-item text-danger" href="#" @click=${this._handleLogout}>
                    <i class="bi bi-box-arrow-right me-2"></i>Logout
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    `}}customElements.define("top-nav",so);class io extends w{static properties={requiredModule:{type:String},requiredPermission:{type:String},permissionEntity:{type:String},permissionAction:{type:String},canAccess:{type:Boolean,state:!0},isChecking:{type:Boolean,state:!0}};constructor(){super(),this.requiredModule="",this.requiredPermission="",this.permissionEntity="",this.permissionAction="",this.canAccess=!1,this.isChecking=!0}createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),this._checkAccess()}updated(e){(e.has("requiredModule")||e.has("requiredPermission")||e.has("permissionEntity")||e.has("permissionAction"))&&this._checkAccess()}_checkAccess(){if(this.isChecking=!0,!E.authenticated){this.canAccess=!1,this.isChecking=!1;return}if(this.requiredModule){const e=this.requiredModule.split("/").pop();if(!Gs(e)){this.canAccess=!1,this.isChecking=!1,console.warn(`❌ Access denied to module: ${this.requiredModule} (${e})`);return}}if(this.permissionEntity&&this.permissionAction){this.canAccess=R(this.permissionEntity,this.permissionAction),this.isChecking=!1,this.canAccess||console.warn(`❌ Permission denied: ${this.permissionEntity}.${this.permissionAction}`);return}if(this.requiredPermission){const[e,t]=this.requiredPermission.split(".");if(e&&t){this.canAccess=R(e,t),this.isChecking=!1,this.canAccess||console.warn(`❌ Permission denied: ${this.requiredPermission}`);return}}if(window.location.pathname){this.canAccess=Y(window.location.pathname),this.isChecking=!1,this.canAccess||console.warn(`❌ Access denied to route: ${window.location.pathname}`);return}this.canAccess=!0,this.isChecking=!1}render(){return this.isChecking?h``:this.canAccess?h`<slot></slot>`:h`<access-denied></access-denied>`}}customElements.define("route-wrapper",io);class no extends w{static properties={isImpersonating:{type:Boolean,state:!0},originalUser:{type:Object,state:!0},impersonatedUser:{type:Object,state:!0}};constructor(){super(),this.isImpersonating=!1,this.originalUser=null,this.impersonatedUser=null,this._unsubscribe=null}createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),this._updateStatus(),this._unsubscribe=ee.subscribe(e=>{this._updateStatus()}),window.addEventListener("impersonation-started",this._handleImpersonationChange),window.addEventListener("impersonation-stopped",this._handleImpersonationChange)}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribe&&this._unsubscribe(),window.removeEventListener("impersonation-started",this._handleImpersonationChange),window.removeEventListener("impersonation-stopped",this._handleImpersonationChange)}_updateStatus(){const e=ee.getStatus();this.isImpersonating=e.isImpersonating,this.originalUser=e.originalUser,this.impersonatedUser=e.impersonatedUser}_handleImpersonationChange=()=>{this._updateStatus()};async _handleStopImpersonation(){if(confirm("Stop impersonating and return to your account?"))try{await ee.stopImpersonation()}catch(e){console.error("Failed to stop impersonation:",e),alert("Failed to stop impersonation: "+e.message)}}render(){return this.isImpersonating?h`
      <div class="alert alert-warning mb-0 rounded-0 d-flex align-items-center justify-content-between py-2 px-3" 
           role="alert"
           style="position: sticky; top: 0; z-index: 1030; border-left: none; border-right: none;">
        <div class="d-flex align-items-center gap-3">
          <div class="d-flex align-items-center gap-2">
            <i class="bi bi-incognito fs-5 text-warning"></i>
            <strong>Impersonation Mode</strong>
          </div>
          <div class="vr"></div>
          <div class="small">
            <span class="text-muted">You (${this.originalUser?.name}) are viewing as:</span>
            <strong class="ms-1">${this.impersonatedUser?.name}</strong>
            <span class="text-muted ms-1">(${this.impersonatedUser?.email})</span>
          </div>
        </div>
        
        <button class="btn btn-sm btn-outline-danger" @click=${this._handleStopImpersonation}>
          <i class="bi bi-x-circle me-1"></i>
          Stop Impersonation
        </button>
      </div>
    `:h``}}customElements.define("impersonation-banner",no);class ro extends w{static properties={currentUser:{type:Object},currentModule:{type:Object},userModules:{type:Array},menuOpen:{type:Boolean},menuPinned:{type:Boolean},expandedModules:{type:Object},menuFilter:{type:String}};createRenderRoot(){return this}constructor(){super(),this.currentUser=E.user,this.currentModule=Nt(),this.userModules=j(),this.menuOpen=!1,this.menuPinned=localStorage.getItem("menu_pinned")==="true",this.menuFilter="",this.menuPinned&&(this.menuOpen=!0),this.expandedModules=JSON.parse(localStorage.getItem("expanded_modules")||"{}"),this.currentModule&&!this.expandedModules.hasOwnProperty(this.currentModule.id)&&(this.expandedModules[this.currentModule.id]=!0),this.router=new St(this,[]),this._routesReady=!1,this._navigationReady=!1,this._routesPromise=this._initializeRoutes()}async _initializeRoutes(){try{const e=await ei.getMultiple(["public","protected","admin","customers","sla","sales","analytics","commerce","b2bManagement","b2bStorefront","gdocs","fallback"]);this.router=new St(this,e),this._routesReady=!0,window.dispatchEvent(new PopStateEvent("popstate")),this.requestUpdate()}catch(e){console.error("❌ Failed to initialize routes:",e),this._routesReady=!0}}async connectedCallback(){super.connectedCallback(),await this._routesPromise,this._initializeContexts(),await Vi(),this._checkAuth(),await this._initializePermissions(),this.addEventListener("click",this._handleClick.bind(this)),window.addEventListener("popstate",this._handlePopState.bind(this)),document.addEventListener("click",this._handleClickOutside.bind(this));const e=this._toInternal(window.location.pathname)+window.location.search+window.location.hash;this.router&&typeof this.router.goto=="function"&&this.router.goto(e),this._navigationReady=!0,this.requestUpdate()}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("click",this._handleClickOutside.bind(this))}_initializeContexts(){yr(),Ve.setCurrentModule(this.currentModule?.id||null)}_checkAuth(){const e=r=>r?r.endsWith("/")&&r!=="/"?r.replace(/\/+$/,""):r:"/",t=e(window.location.pathname),i=r=>{try{const o=typeof window.withBase=="function"?window.withBase(r):r;return new URL(o,window.location.origin).pathname}catch{return r}};if(![i("/login"),i("/callback"),i("/access-denied")].map(e).includes(t)){if(!E.authenticated){const r=i("/login");e(t)!==e(r)&&(window.location.href=r);return}this.currentUser=E.user,qe.setUser(E.user)}}async _initializePermissions(){if(!(!E.authenticated||!E.user))try{const e=await ve(),t=E.user.assignedRoles||[],i=e.filter(n=>t.includes(n.id));await lt(E.user,i),await Or(),await He.initialize(E.user,i),console.log("✅ CASL permissions initialized for:",E.user.name),console.log("✅ Enterprise security context initialized")}catch(e){console.error("❌ Failed to initialize permissions:",e)}}_handleLogout(e){e.preventDefault(),qi(),Fs(),Ir(),qe.clearUser(),He.clear(),Ve.clearNotifications(),this.currentUser=null,window.location.href=window.withBase("/login")}_toggleMenu(){this.menuPinned||(this.menuOpen=!this.menuOpen)}_toggleMenuPin(){this.menuPinned=!this.menuPinned,localStorage.setItem("menu_pinned",this.menuPinned),this.menuPinned?this.menuOpen=!0:this.menuOpen=!1}_handleMenuMouseLeave(){}_handleMenuPinChanged(e){this.menuPinned=e.detail.pinned}_handleMenuClose(){this.menuOpen=!1}_handleMenuFilterChanged(e){if(this.menuFilter=e.detail.filter,this.menuFilter){const t={};this.userModules.forEach(i=>{this._moduleMatchesFilter(i)&&(t[i.id]=!0)}),this.expandedModules=t}}_handleMenuFilterCleared(){this.menuFilter=""}_handleModuleToggled(e){const t=e.detail.moduleId;this.expandedModules={...this.expandedModules,[t]:!this.expandedModules[t]},localStorage.setItem("expanded_modules",JSON.stringify(this.expandedModules))}_handleClickOutside(e){if(!this.menuPinned&&this.menuOpen){const t=this.querySelector(".top-menu-popover"),i=this.querySelector(".menu-toggle-btn");t&&!t.contains(e.target)&&!i.contains(e.target)&&(this.menuOpen=!1)}}_handleModuleSwitch(e){er(e)&&(this.currentModule=Nt(),window.history.pushState({},"",`/module/${e}`),window.dispatchEvent(new PopStateEvent("popstate")))}_toggleModuleExpansion(e,t){t.preventDefault(),t.stopPropagation(),this.expandedModules={...this.expandedModules,[e]:!this.expandedModules[e]},localStorage.setItem("expanded_modules",JSON.stringify(this.expandedModules))}_moduleMatchesFilter(e){if(!this.menuFilter)return!0;const t=this.menuFilter;return e.name.toLowerCase().includes(t)?!0:({admin:["dashboard","users","roles","permissions"],sla:["dashboard","incidents","tickets","agreements","metrics","reports","escalations","performance"],sales:["dashboard","orders","products","reports"],analytics:["dashboard","forecast"],gdocs:["inbox","outbox","reports","purchase orders","invoices","acknowledgements"],commerce:["dashboard","products","orders","cart","categories","discounts","inventory","companies","quotes","pricelists","contracts","purchase orders","storefront","catalog","quick order","account","punchout","external suppliers"],customers:["organizations","add organization"]}[e.id]||[]).some(r=>r.includes(t))}_menuItemMatchesFilter(e){return this.menuFilter?e.toLowerCase().includes(this.menuFilter):!0}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("click",this._handleClick),window.removeEventListener("popstate",this._handlePopState)}_toInternal(e){try{const t=window.__BASE_URL||"/";return t!=="/"&&e.startsWith(t)?e.substring(t.length-1)||"/":e}catch{return e}}_handlePopState(){const e=this._toInternal(window.location.pathname)+window.location.search+window.location.hash;this.router&&typeof this.router.goto=="function"&&this.router.goto(e)}_handleClick(e){const t=e.target.closest("a");if(t&&t.getAttribute("href")?.startsWith("/")){e.preventDefault();const i=t.getAttribute("href"),n=window.withBase?window.withBase(i):i;window.history.pushState({},"",n);const r=this._toInternal(n)+window.location.search+window.location.hash;this.router&&typeof this.router.goto=="function"&&this.router.goto(r)}}render(){if(!this._routesReady||!this._navigationReady)return h`
        <div class="d-flex justify-content-center align-items-center" style="min-height: 100vh;">
          <div class="text-center">
            <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3 text-muted">Loading application...</p>
          </div>
        </div>
      `;const e=r=>r?r.endsWith("/")&&r!=="/"?r.replace(/\/+$/,""):r:"/",t=e(window.location.pathname),i=r=>{try{const o=typeof window.withBase=="function"?window.withBase(r):r;return new URL(o,window.location.origin).pathname}catch{return r}};return[i("/login"),i("/callback"),i("/access-denied")].map(e).includes(t)?h`${this.router.outlet()}`:E.authenticated?h`
      <!-- Top Navigation -->
      <top-nav
        .currentUser=${this.currentUser}
        .currentModule=${this.currentModule}
        .userModules=${this.userModules}
        .menuPinned=${this.menuPinned}
        @menu-toggle=${this._toggleMenu}
        @module-switch=${r=>this._handleModuleSwitch(r.detail.moduleId)}
        @user-logout=${this._handleLogout}
      ></top-nav>

      <!-- Impersonation Banner -->
      <impersonation-banner></impersonation-banner>

      <!-- Side Navigation -->
      <side-nav
        .menuOpen=${this.menuOpen}
        .menuPinned=${this.menuPinned}
        .menuFilter=${this.menuFilter}
        .expandedModules=${this.expandedModules}
        .userModules=${this.userModules}
        @menu-pin-changed=${this._handleMenuPinChanged}
        @menu-close=${this._handleMenuClose}
        @menu-filter-changed=${this._handleMenuFilterChanged}
        @menu-filter-cleared=${this._handleMenuFilterCleared}
        @module-toggled=${this._handleModuleToggled}
      ></side-nav>

      <!-- Main Content -->
      <main class="container-fluid px-4 py-4 ${this.menuPinned?"content-pushed":""}">
        ${this.router.outlet()}
      </main>
    `:h``}_isActive(e){return location.pathname===e?"active":""}}customElements.define("app-shell",ro);export{Mo as $,tr as A,Ro as B,ve as C,ir as D,nr as E,rr as F,or as G,cr as H,Ws as I,lr as J,dr as K,ur as L,hr as M,h as N,E as O,Qt as P,pe as Q,Me as R,Te as S,w as T,ee as U,re as V,Bt as W,To as X,Uo as Y,ko as Z,g as _,qi as a,Oe as a0,Oo as a1,Io as a2,Po as a3,Co as a4,S as b,go as c,bo as d,_o as e,Vi as f,Hi as g,Hs as h,me as i,R as j,Ds as k,Fi as l,js as m,Y as n,zs as o,Qn as p,xo as q,Be as r,Ls as s,qn as t,Hn as u,So as v,j as w,Nt as x,er as y,Gs as z};
