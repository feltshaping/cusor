function fileSaver(file) {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function (e) {
    const a = document.createElement("a");
    //如果reader使用readAsDataURL就不用new Blob了
    const arrayBuffer = e.target.result;
    const blob = new Blob([arrayBuffer], { type: file.type });
    a.href = URL.createObjectURL(blob);
    a.download = file.name;
    a.click();
  };
}
function fileUpload(file) {
  const formData = new FormData();
  formData.append("file", file);
  fetch("/upload", {
    method: "POST",
    body: formData,
  });
}
function imgCompress(file) {
  const reader = new FileReader();
  reader.onload = function (e) {
    const url = e.target.result;
    const img = new Image();
    img.src = url;
    img.onload = function () {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      ctx.toBlob(
        (blob) => {
          // 展示压缩后的图片
          const compressedUrl = URL.createObjectURL(compressedBlob);
          const newImg = document.createElement("img");
          newImg.src = compressedUrl;
          newImg.style.maxWidth = "400px";
          newImg.style.border = "2px solid green";
          preview.innerHTML = "";
          preview.appendChild(newImg);
        },
        "image/jpeg",
        0.6,
      );
    };
  };
  reader.readAsDataURL(file);
}
function canvasForHD(canvas) {
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const scale = window.devicePixelRatio;
  canvas.width = width * scale; //css比物理像素小
  canvas.height = height * scale;
  ctx.clearRect(0, 0, width, height);
  ctx.scale(scale, scale);
  return canvas;
}

/**
 * 检查指定端口是否被占用
 * @param {number} port - 要检查的端口号
 */
function checkPort(port) {
  const server = net.createServer();

  // 尝试监听该端口
  server.once("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`❌ 端口 ${port} 已被占用！`);

      // 尝试获取占用该端口的进程信息 (兼容 Windows 和 macOS/Linux)
      try {
        let pid;
        if (process.platform === "win32") {
          const cmd = `netstat -ano | findstr :${port} | findstr LISTENING`;
          const output = execSync(cmd).toString().trim();
          pid = output.split(/\s+/).pop();
        } else {
          const cmd = `lsof -ti tcp:${port}`;
          pid = execSync(cmd).toString().trim();
        }

        if (pid) {
          console.log(`🔍 占用该端口的进程 PID 是: ${pid}`);
          console.log(
            `💡 提示: 你可以使用 kill ${pid} (Mac/Linux) 或 taskkill /F /PID ${pid} (Windows) 来结束它。`,
          );
        }
      } catch (e) {
        console.log(
          "⚠️ 无法获取占用进程的详细信息，请手动使用 netstat -ano 或 lsof -i 检查。",
        );
      }
      process.exit(1);
    } else {
      console.error("发生未知错误:", err);
      process.exit(1);
    }
  });

  // 监听成功，说明端口空闲
  server.once("listening", () => {
    console.log(`✅ 端口 ${port} 是空闲的，可以安全使用！`);
    server.close(); // 释放端口
    process.exit(0);
  });

  server.listen(port);
}

// 获取命令行传入的端口号，默认检查 3000
const targetPort = parseInt(process.argv[2]) || 3000;
checkPort(targetPort);

//reduce与of各有设计初衷，累加用reduce.async在reduce内，在forof前。
arr
  .reduce(async (previousPromise, currentValue) => {
    const accumulator = await previousPromise; // 等待前一个 Promise 完成
    return new Promise((resolve) =>
      setTimeout(() => resolve(accumulator + currentValue * 2), 1000),
    );
  }, Promise.resolve(0))
  .then((finalResult) => {
    console.log("Final Result:", finalResult);
  });

(async () => {
  for (const currentValue of arr) {
    await new Promise((resolve) =>
      setTimeout(() => {
        console.log(currentValue * 2);
        resolve();
      }, 1000),
    );
  }
})();

//各部分不需要单独await，要保证执行完就需要收集起来并Promise.all()
async function processArrayWithLimit(arr, concurrencyLimit) {
  const activePromises = [];

  for (const item of arr) {
    // 创建一个包装 Promise，在 resolve/reject 时自动从数组中移除自己
    const task = new Promise((resolve, reject) => {
      setTimeout(() => resolve(item * 2), 1000);
    }).finally(() => {
      // 任务完成（无论成功失败）时，从活跃队列中移除
      const index = activePromises.indexOf(task);
      console.log("index:", index);

      if (index > -1) activePromises.splice(index, 1);
    });

    activePromises.push(task);

    // 如果达到并发上限，等待当前批次中任意一个任务完成
    if (activePromises.length >= concurrencyLimit) {
      await Promise.race(activePromises);
    }
  }

  // 等待所有剩余任务完成
  await Promise.all(activePromises);
  console.log("Finished");
}

//倒计时支持await化
async function timeoutAwait() {
  return new Promise((res) => {
    setTimeout(() => {
      console.log("每隔一秒");
      res();
    }, 1000);
  });
}
function timeoutNoLim() {
  timeoutAwait().then(f1);
}
async function timeoutLim(max) {
  for (i = 0; i < max; i++) {
    await timeoutAwait();
  }
  console.log("all done");
}
class Dog {
  constructor() {
    Animal.call(this);
  }
  sing() {
    Animal.prototype.sing.apply(this, []);
  }
}

function myNew(Constructor, ...args) {
  const obj = Object.create(Constructor.prototype); //尚未实例化，obj是函数
  const result = Constructor.apply(obj, args); //Constructor函数执行，把属性注入obj
  return result instanceof Object ? result : obj; //new函数只支持返回对象形式的数据，构造函数如果返回null，数字这些直接被无视。
}
//this最佳实践
class A {
  constructor() {
    this.f = () => {
      console.log(this);
    };
  }
}

const a = new A();
const { f } = a;
f(); // 👉 依然指向实例 a ！

setTimeout(a.f, 1000); // 👉 依然指向实例 a ！

class appFactory {
  constructor(app) {
    //参数无效显式传入，由init时脚手架内置函数生成
    this.app = app;
  }
  //类实例不直接使用，用的是它的属性app，所有才叫工厂函数，constructor，init，instance缺一不可
  get instance() {
    return this.app;
  }
  //类静态初始化返回实例
  static async init() {
    const app = await module.createNestApplication();
    return new appFactory(app);
  }
  async initDb() {
    if (!datasourve.isInitialized) {
      await datasource.initialize();
    }
    this.connection = datasource;
  }
}
//实际使用展示
(async () => {
  const appF = await appFactory.init();
  await appF.initDb(); //数据准备就绪才能使用
  const app = appF.instance;
})();

function curry(targetFunc) {
  // 获取目标函数的参数个数!!!!add的参数
  const argsLen = targetFunc.length; //与
  return function func(...rest) {
    //以下调用时，第一次rest是数字1
    return rest.length < argsLen
      ? func.bind(null, ...rest)
      : //或者(…newRest)=>func.apply(null,rest.concat(newRest))
        //(…newRest)=>func(…rest,…newRest)
        targetFunc.apply(null, rest);
  };
}

add = (a, b, c) => a + b + c;

curry(add)(1)(2)(3); //add.bind一次收集一个参数没有也没办法执行，只好保存了
curry(add)(1, 2)(3);

function composeMiddleware(...middlewares) {
  return function (context, next) {
    //dispatch是驱动器，使用i+1调用自己
    function dispatch(i) {
      console.log("i", i);
      const middleware = middlewares[i] || next;
      //middleware参数ctx，next由后面调用时提供
      Promise.resolve(middleware(context, () => dispatch(i + 1)));
    }
    dispatch(0);
  };
}

const log = async (ctx, next) => {
  await next();
};
const logA = async (ctx, next) => {
  await next();
};

const composedMiddleware = composeMiddleware(log, logA);
composedMiddleware(
  {},
  function core() {
    console.log("业务代码");
  }, //注意，此处core可以接受参数ctx，next；这里没有继续next(),深挖结束，从洋葱心往外出了。
);


