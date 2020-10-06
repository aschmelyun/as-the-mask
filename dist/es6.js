var tokens = {
  '#': { pattern: /\d/ },
  X: { pattern: /[0-9a-zA-Z]/ },
  S: { pattern: /[a-zA-Z]/ },
  A: { pattern: /[a-zA-Z]/, transform: v => v.toLocaleUpperCase() },
  a: { pattern: /[a-zA-Z]/, transform: v => v.toLocaleLowerCase() },
  '!': { escape: true }

  // https://github.com/fernandofleury/vanilla-masker/blob/master/lib/vanilla-masker.js
  // DIGIT = "9",
  // ALPHA = "A",
  // ALPHANUM = "S"

  // https://github.com/niksmr/vue-masked-input
  // 1 - number
  // a - letter
  // A - letter, forced to upper case when entered
  // * - alphanumeric
  // # - alphanumeric, forced to upper case when entered
  // + - any character

  // https://github.com/probil/v-mask
  // #	Number (0-9)
  // A	Letter in any case (a-z,A-Z)
  // N	Number or letter
  // X	Any symbol

  // https://github.com/igorescobar/jQuery-Mask-Plugin/blob/master/src/jquery.mask.js#L518
  // '0': {pattern: /\d/},
  // '9': {pattern: /\d/, optional: true},
  // '#': {pattern: /\d/, recursive: true},
  // 'A': {pattern: /[a-zA-Z0-9]/},
  // 'S': {pattern: /[a-zA-Z]/}

  // https://github.com/the-darc/string-mask
  // 0	Any numbers
  // 9	Any numbers (Optional)
  // #	Any numbers (recursive)
  // A	Any alphanumeric character
  // a	Any alphanumeric character (Optional) Not implemented yet
  // S	Any letter
  // U	Any letter (All lower case character will be mapped to uppercase)
  // L	Any letter (All upper case character will be mapped to lowercase)
  // $	Escape character, used to escape any of the special formatting characters.

};

function maskit(value, mask, masked = true, tokens) {
  value = value || '';
  mask = mask || '';
  var iMask = 0;
  var iValue = 0;
  var output = '';
  var cMask = '';
  while (iMask < mask.length && iValue < value.length) {
    cMask = mask[iMask];
    var masker = tokens[cMask];
    var cValue = value[iValue];
    if (masker && !masker.escape) {
      if (masker.pattern.test(cValue)) {
        output += masker.transform ? masker.transform(cValue) : cValue;
        iMask++;
      }
      iValue++;
    } else {
      if (masker && masker.escape) {
        iMask++; // take the next mask char and treat it as char
        cMask = mask[iMask];
      }
      if (masked) output += cMask;
      if (cValue === cMask) iValue++; // user typed the same char
      iMask++;
    }
  }

  // fix mask that ends with a char: (#)
  var restOutput = '';
  while (iMask < mask.length && masked) {
    cMask = mask[iMask];
    if (tokens[cMask]) {
      restOutput = '';
      break;
    }
    restOutput += cMask;
    iMask++;
  }

  return output + restOutput;
}

function dynamicMask(maskit, masks, tokens) {
  masks = masks.slice().sort((a, b) => a.length - b.length);
  return function (value, mask, masked = true) {
    var i = 0;
    while (i < masks.length) {
      var currentMask = masks[i];
      i++;
      var nextMask = masks[i];
      if (!(nextMask && maskit(value, nextMask, true, tokens).length > currentMask.length)) {
        return maskit(value, currentMask, masked, tokens);
      }
    }
    return ''; // empty masks
  };
}

// Facade to maskit/dynamicMask when mask is String or Array
function masker (value, mask, masked = true, tokens) {
  // disable on empty mask 
  if (!mask) {
    return value;
  }
  return Array.isArray(mask) ? dynamicMask(maskit, mask, tokens)(value, mask, masked, tokens) : maskit(value, mask, masked, tokens);
}

// https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events#The_old-fashioned_way
function event(name) {
  var evt = document.createEvent('Event');
  evt.initEvent(name, true, true);
  return evt;
}

function mask (el, binding) {
  var config = binding.value || '';
  var defaults = {
    masked: true,
    mask: config,
    tokens: tokens
  };
  var oldValue = '';
  if (Array.isArray(config) || typeof config === 'string') {
    config = {
      masked: true,
      mask: config,
      tokens: tokens
    };
  }

  config = Object.assign({}, defaults, config);

  if (el.tagName.toLocaleUpperCase() !== 'INPUT') {
    var els = el.getElementsByTagName('input');
    if (els.length !== 1) {
      throw new Error("v-mask directive requires 1 input, found " + els.length);
    } else {
      el = els[0];
    }
  }

  el.oninput = function (evt) {
    if (!evt.isTrusted) return; // avoid infinite loop
    /* other properties to try to diferentiate InputEvent of Event (custom)
    InputEvent (native)
      cancelable: false
      isTrusted: true
       composed: true
      isComposing: false
      which: 0
     Event (custom)
      cancelable: true
      isTrusted: false
    */
    // by default, keep cursor at same position as before the mask
    var position = el.selectionEnd;
    // save the character just inserted
    var digit = el.value[position - 1];
    el.value = masker(el.value, config.mask, config.masked, config.tokens);
    // if the digit was changed, increment position until find the digit again
    while (position < el.value.length && el.value.charAt(position - 1) !== digit) {
      position++;
    }
    // fixes vue-the-mask original issue #87 with email input types
    if (el === document.activeElement && el.type !== 'email' && el.type !== 'number') {
      el.setSelectionRange(position, position);
      setTimeout(function () {
        // account for the caret jumping backwards, see issue #49
        // by substracting Math.sign, we decrement the absolute value by 1
        let lengthDiff = el.value.length - oldValue.length;
        lengthDiff = lengthDiff - Math.sign(lengthDiff);
        position = position + lengthDiff;
        el.setSelectionRange(position, position);
        oldValue = el.value;
      }, 0);
    }
    el.dispatchEvent(event('input'));
  };

  var newDisplay = masker(el.value, config.mask, config.masked, config.tokens);
  if (newDisplay !== el.value) {
    el.value = newDisplay;
    el.dispatchEvent(event('input'));
  }
}

var TheMask = {
  render: function () {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('input', _vm._g(_vm._b({ directives: [{ name: "mask", rawName: "v-mask", value: _vm.config, expression: "config" }], attrs: { "type": "text" }, domProps: { "value": _vm.display } }, 'input', _vm.$attrs, false), _vm.listeners));
  },
  staticRenderFns: [],
  name: 'TheMask',
  props: {
    value: [String, Number],
    mask: {
      type: [String, Array],
      required: true
    },
    masked: { // by default emits the value unformatted, change to true to format with the mask
      type: Boolean,
      default: false // raw
    },
    tokens: {
      type: Object,
      default: () => tokens
    }
  },
  directives: { mask },
  data() {
    return {
      lastValue: null, // avoid unecessary emit when has no change
      display: this.value
    };
  },
  watch: {
    value(newValue) {
      if (newValue !== this.lastValue) {
        this.display = newValue;
      }
    },
    masked() {
      this.refresh(this.display);
    }
  },
  computed: {
    config() {
      return {
        mask: this.mask,
        tokens: this.tokens,
        masked: this.masked
      };
    },
    listeners() {
      var vm = this;
      return Object.assign({}, vm.$listeners, {
        input(e) {
          vm.onInput(e);
        }
      });
    }
  },
  methods: {
    onInput(e) {
      if (e.isTrusted) return; // ignore native event
      this.refresh(e.target.value);
    },

    refresh(value) {
      this.display = value;
      var value = masker(value, this.mask, this.masked, this.tokens);
      if (value !== this.lastValue) {
        this.lastValue = value;
        this.$emit('input', value);
      }
    }
  }
};

function install(Vue) {
  Vue.component(TheMask.name, TheMask);
  Vue.directive("mask", mask);
}

// Install by default if included from script tag
if (typeof window !== "undefined" && window.Vue) {
  window.Vue.use(install);
}

export default install;
export { TheMask, mask, tokens, dynamicMask, masker, maskit };
