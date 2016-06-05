class EventEmitter {
    constructor(opts) {
        this.events = new Map();
    }

    on (e, fn) {
        var events = this.getEvents(e);
        if (!events) events = []; //Initialize events
        events.push({ cb: fn });
        this.events.set(e, events);
    }

    triggerEvent (e, args) {
        var events = this.getEvents(e);
        if (!events) return;
        var self = this;
        events.forEach(function (each, idx) {
            let result = each.cb.call(self, args);
            if (result === true) {
                //The event was handled, delete the current event
                self.deleteEvent(e, idx);
            }
        });
    }
    getEvents (event) {
        return this.events.get(event);
    }

    deleteEvent(e, i) {
        var events = this.getEvents(e);
        if (!events) return;
        events.splice(i, 1);
        this.events.set(e, events);
    }


    
    
}

module.exports = EventEmitter;