class demo {
  constructor() {
    this.l1Promise = this.l1();
  }

  async l1() {
    let res = await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("1");
      }, 1000);
    });

    console.log('先执行');
  }

  f1() {
    console.log("再执行");
  }

  async run() {
    console.log(this.l1Promise, 'this.l1Promise');
    await this.l1Promise;
    this.f1();
  }
}

let d1 = new demo();
d1.run();
d1.run();
d1.run();