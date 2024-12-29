
class PromisedTimeout {
    constructor(millisec) {
        this.ms = millisec;
        this.timer = null;
    }

    wait(promiseArg) {
        const tmo =  new Promise((_, reject) => {
            this.timer = setTimeout(() => reject(`Timed out at ${this.ms}ms`), this.ms);
        })
            .finally(() => clearTimeout(this.timer));
        return Promise.race([promiseArg, tmo]);
    }

    cancel() {
        clearTimeout(this.timer);
    }
}
export default PromisedTimeout
