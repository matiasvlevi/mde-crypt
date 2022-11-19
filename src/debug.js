class Debug {
  static ENABLE = true;
  static error() {
    if (Debug.ENABLE) console.error(...arguments);
  }
  static log() {
    if (Debug.ENABLE) console.log(...arguments);
  }
};

module.exports = Debug;
