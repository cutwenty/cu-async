# cu-async
tj 大神有一个 co 库，依样画葫芦，我也根据 co 的使用方式，实现了这个异步方法。

## 使用方式
导入 cu-async 后，将 generator 函数传入 cuAsync 返回 promise 对象。

		const cuAsync = require('./cu-async.js');
		
		cuAsync(function* () {
    	  let i = yield 1;
     	  let name = yield fetch('./name.json').then(res => res.json());
     	  let age = yield fetch('./age.json').then(res => res.json());
     	  return name.name + ' ' + age.age;
     	})
     	.then(
     	  val => console.log('result is: ' + val)
     	);

## 实现思想

1. 将异步的操作放在 promise 中执行，并使用yield，在异步未执行结束前停住
	
		function* () {
			let val = yield (new Promise(xxx));
			return xxx;
		}
		
2. 将 next 函数，放在 promise 的 resolve 中执行。只有前一个异步执行完成，才跳过这个 yield 继续执行。

		function next (val) {
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
