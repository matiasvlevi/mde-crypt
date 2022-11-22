class Debug {
  static ERROR_ENABLE = true;
  static ENABLE = false;
  static error() {
    if (Debug.ERROR_ENABLE) {
      
      console.error(...arguments)
      console.trace();
    };
  }
  static log() {
    if (Debug.ENABLE) console.log(...arguments);
  }
};

module.exports = Debug;
