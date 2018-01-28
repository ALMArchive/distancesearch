import is from 'is';

const CLASS_SYMBOL = Symbol('DistanceSearch Symbol');

export default class DistanceSearch {
  constructor(conObj) {
    this[CLASS_SYMBOL] = {
      CLASS_SYMBOL,
      data: conObj.data,
    };
  }

  static get symbol() {
    return CLASS_SYMBOL;
  }

  isClass(obj) {
    if (!is.object(obj)) return false;
    if (!obj[CLASS_SYMBOL]) return false;
    return (this[CLASS_SYMBOL].CLASS_SYMBOL === obj[CLASS_SYMBOL].CLASS_SYMBOL);
  }

  get symbol() {
    return this[CLASS_SYMBOL].CLASS_SYMBOL;
  }

  set symbol(e) {
    return this[CLASS_SYMBOL].CLASS_SYMBOL;
  }

  find(qOpts, comp) {
    return this.findN(qOpts, comp, 1)[0];
  }

  findN(qOpts, comp, n) {
    const finalN = parseInt(n, 10);

    let extVal;
    if (qOpts.minOrMax === 'max') {
      extVal = Number.MIN_SAFE_INTEGER;
    } else if (qOpts.minOrMax === 'min') {
      extVal = Number.MAX_SAFE_INTEGER;
    }

    const out = [];
    let tmpComp;
    const compType = (qOpts.minOrMax === 'max') ? (() => tmpComp >= extVal)
      : (() => tmpComp <= extVal);


    /* CAN CLEAN THIS UP USING A PRIORITY QUEUE */

    // For Every row of data
    this[CLASS_SYMBOL].data.map((obj) => {
      qOpts.search.map((sq) => {
        tmpComp = comp.comp(obj[sq], qOpts.minOrMax);
        // computing mins or maxs based on qOpts.minOrMax and comp set above
        if (compType()) {
          extVal = tmpComp;
          const tmpObj = {};
          qOpts.ret.map((pullProp) => {
            if (qOpts.ret.length === 1 && pullProp === '*') {
              /* eslint-disable no-return-assign */
              Reflect.ownKeys(obj).map(tmpProp => tmpObj[tmpProp] = obj[tmpProp]);
            } else {
              tmpObj[pullProp] = obj[pullProp];
            }
            return null;
          });
          out.unshift({ pri: extVal, data: tmpObj });
          if (out.length > finalN) out.pop();
        }
        return null;
      });
      return null;
    });
    // For every search column
    return out;
  }
}
