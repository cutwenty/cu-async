(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? module.exports = factory()
    : typeof define === 'function' && define.amd
      ? define(factory)
      : (global.cuAsync = factory());
})(this, function () {

  function cuAsync (gen) {
    let runner = gen();

    return new Promise((resolve, reject) => {
      try {
        next();
      } catch (ex) {
        reject(ex);
      }

      function next (val) {
        // yield 的作用对象是promise，也可以不是，但是不是异步就没有意义了
        // 在generator中，return也有yield的功能
        // 返回对象{ done, value }，value是Promise
        // gennerator 每次调用next传入参数val时，会将参数val作为上一个暂停yield的返回值
        let result = runner.next(val);

        if (result.done) {
          resolve(result.value);
        } else {
          thenable(result.value)
            ? result.value.then(
              (value) => next(value),
              (error) => {throw err;}
            )
            : next(result.value);
        }
      }
    });
  }

  function thenable (obj) {
    return Object.prototype.toString.call(obj.then) === '[object Function]';
  }

  return cuAsync;
});
