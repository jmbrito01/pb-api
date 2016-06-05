
class Timer {
    constructor(interval, fn, self, args) {
        this.interval = interval;
        this.fn = fn;
        this.fnSelf = self;
        this.args = args;
    }

    onTick() {
        this.fn.call(this.fnSelf, this.args);
        if (this.running) setTimeout(this.onTick.bind(this), this.interval);
    }

    run() {
        this.running = true;
        setTimeout(this.onTick.bind(this), this.interval);
    }

    stop() {
        this.running = false;
    }
}

module.exports = Timer;