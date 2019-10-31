!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t(e.KeInputMask={})}(this,function(e){"use strict";var t={"#":{pattern:/\d/},X:{pattern:/[0-9a-zA-Z]/},S:{pattern:/[a-zA-Z]/},A:{pattern:/[a-zA-Z]/,transform:function(e){return e.toLocaleUpperCase()}},a:{pattern:/[a-zA-Z]/,transform:function(e){return e.toLocaleLowerCase()}},"!":{escape:!0}};function n(e,t){var n=!(arguments.length>2&&void 0!==arguments[2])||arguments[2],a=arguments[3];e=e||"",t=t||"";for(var s=0,r=0,i="",u="";s<t.length&&r<e.length;){var o=a[u=t[s]],l=e[r];o&&!o.escape?(o.pattern.test(l)&&(i+=o.transform?o.transform(l):l,s++),r++):(o&&o.escape&&(u=t[++s]),n&&(i+=u),l===u&&r++,s++)}for(var c="";s<t.length&&n;){if(a[u=t[s]]){c="";break}c+=u,s++}return i+c}function a(e,t,n){return t=t.slice().sort(function(e,t){return e.length-t.length}),function(a,s){for(var r=!(arguments.length>2&&void 0!==arguments[2])||arguments[2],i=0;i<t.length;){var u=t[i],o=t[++i];if(!(o&&e(a,o,!0,n).length>u.length))return e(a,u,r,n)}return""}}function s(e,t){var s=!(arguments.length>2&&void 0!==arguments[2])||arguments[2],r=arguments[3];return t?Array.isArray(t)?a(n,t,r)(e,t,s,r):n(e,t,s,r):e}function r(e){var t=document.createEvent("Event");return t.initEvent(e,!0,!0),t}function i(e,n){var a=n.value||"",i={masked:!0,mask:a,tokens:t},u="";if((Array.isArray(a)||"string"==typeof a)&&(a={masked:!0,mask:a,tokens:t}),a=Object.assign({},i,a),"INPUT"!==e.tagName.toLocaleUpperCase()){var o=e.getElementsByTagName("input");if(1!==o.length)throw new Error("v-mask directive requires 1 input, found "+o.length);e=o[0]}e.oninput=function(t){if(t.isTrusted){var n=e.selectionEnd,i=e.value[n-1];for(e.value=s(e.value,a.mask,a.masked,a.tokens);n<e.value.length&&e.value.charAt(n-1)!==i;)n++;e===document.activeElement&&(e.setSelectionRange(n,n),setTimeout(function(){var t=e.value.length-u.length;t-=Math.sign(t),n+=t,e.setSelectionRange(n,n),u=e.value},0)),e.dispatchEvent(r("input"))}};var l=s(e.value,a.mask,a.masked,a.tokens);l!==e.value&&(e.value=l,e.dispatchEvent(r("input")))}var u={render:function(){var e=this.$createElement;return(this._self._c||e)("input",this._g(this._b({directives:[{name:"mask",rawName:"v-mask",value:this.config,expression:"config"}],attrs:{type:"text"},domProps:{value:this.display}},"input",this.$attrs,!1),this.listeners))},staticRenderFns:[],name:"TheMask",props:{value:[String,Number],mask:{type:[String,Array],required:!0},masked:{type:Boolean,default:!1},tokens:{type:Object,default:function(){return t}}},directives:{mask:i},data:function(){return{lastValue:null,display:this.value}},watch:{value:function(e){e!==this.lastValue&&(this.display=e)},masked:function(){this.refresh(this.display)}},computed:{config:function(){return{mask:this.mask,tokens:this.tokens,masked:this.masked}},listeners:function(){var e=this;return Object.assign({},e.$listeners,{input:function(t){e.onInput(t)}})}},methods:{onInput:function(e){e.isTrusted||this.refresh(e.target.value)},refresh:function(e){this.display=e,(e=s(e,this.mask,this.masked,this.tokens))!==this.lastValue&&(this.lastValue=e,this.$emit("input",e))}}};function o(e){e.component(u.name,u),e.directive("mask",i)}"undefined"!=typeof window&&window.Vue&&window.Vue.use(o),e.default=o,e.TheMask=u,e.mask=i,e.tokens=t,e.dynamicMask=a,e.masker=s,e.maskit=n,Object.defineProperty(e,"__esModule",{value:!0})});
