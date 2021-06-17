/*
 *   Selectables  
 *   
 *   v1.4.1
 *       
 *   https://github.com/p34eu/Selectables.git
 */

export class Selectables {
    constructor(opts) {
        let defaults = {
            zone: "#wrapper",
            elements: "a",
            selectedClass: 'active',
            key: false,
            moreUsing: 'shiftKey',
            enabled: true,
            start: null,
            stop: null,
            onSelect: null,
            onDeselect: null // event fired on every item when selected.
        };
        let extend = function extend(a, b) {
            for (let prop in b) {
                a[prop] = b[prop];
            }
            return a;
        };
        this.foreach = function (items, callback, scope) {
            if (Object.prototype.toString.call(items) === '[object Object]') {
                for (let prop in items) {
                    if (Object.prototype.hasOwnProperty.call(items, prop)) {
                        callback.call(scope, items[prop], prop, items);
                    }
                }
            } else {
                for (let i = 0, len = items.length; i < len; i++) {
                    callback.call(scope, items[i], i, items);
                }
            }
        };
        this.options = extend(defaults, opts || {});
        this.on = false;
        let self = this;
        this.enable = function () {
            if (this.on) {
                throw new Error(this.constructor.name + " :: is alredy enabled");
            }
            this.zone = document.querySelector(this.options.zone);
            if (!this.zone) {
                throw new Error(this.constructor.name + " :: no zone defined in options. Please use element with ID");
            }
            this.items = document.querySelectorAll(this.options.zone + ' ' + this.options.elements);
            this.disable();
            this.zone.addEventListener('mousedown', self.rectOpen);
            this.on = true;
            return this;
        };
        this.disable = function () {
            this.zone.removeEventListener('mousedown', self.rectOpen);
            this.on = false;
            return this;
        };
        let offset = function (el) {
            let r = el.getBoundingClientRect();
            return {
                top: r.top + document.body.scrollTop,
                left: r.left + document.body.scrollLeft
            };
        };
        this.suspend = function (e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        };
        this.rectOpen = function (e) {
            self.options.start && self.options.start(e);
            if (self.options.key && !e[self.options.key]) {
                return;
            }
            document.body.classList.add('s-noselect');
            self.foreach(self.items, function (el) {
                el.addEventListener('click', self.suspend, true); //skip any clicks
                if (!e[self.options.moreUsing]) {
                    const link = el.querySelector("a");
                    link.classList.remove(self.options.selectedClass);
                }
            });
            self.ipos = [e.pageX, e.pageY];
            if (!rb()) {
                let gh = document.createElement('div');
                gh.id = 's-rectBox';

                gh.style.left = e.pageX + 'px';
                gh.style.top = e.pageY + 'px';
                document.body.appendChild(gh);
            }
            document.body.addEventListener('mousemove', self.rectDraw);
            window.addEventListener('mouseup', self.select);
        };
        let rb = function () {
            return document.getElementById('s-rectBox');
        };
        let cross = function (a, b) {
            let aTop = offset(a).top,
                aLeft = offset(a).left,
                bTop = offset(b).top,
                bLeft = offset(b).left;
            return !(((aTop + a.offsetHeight) < (bTop)) || (aTop > (bTop + b.offsetHeight)) || ((aLeft + a.offsetWidth) < bLeft) || (aLeft > (bLeft + b.offsetWidth)));
        };
        this.select = function (e) {
            let a = rb();
            if (!a) {
                return;
            }
            delete (self.ipos);
            document.body.classList.remove('s-noselect');
            document.body.removeEventListener('mousemove', self.rectDraw);
            let s = self.options.selectedClass;
            self.foreach(self.items, function (el) {
                if (cross(a, el) === true) {
                    const link = el.querySelector("a");
                    if (link.classList.contains(s)) {
                        link.classList.remove(s);
                        self.options.onDeselect && self.options.onDeselect(el);
                    } else {
                        link.classList.add(s);
                        self.options.onSelect && self.options.onSelect(el);
                    }
                }
                setTimeout(function () {
                    el.removeEventListener('click', self.suspend, true);
                }, 100);
            });
            window.removeEventListener('mouseup', self.select);
            a.parentNode.removeChild(a);
            self.options.stop && self.options.stop(e);
        };
        let border = document.querySelector(this.options.zone);
        this.rectDraw = function (e) {
            let g = rb();
            if (!self.ipos || g === null) {
                return;
            }

            var tmp, x1 = self.ipos[0],
                y1 = self.ipos[1],
                x2 = e.pageX,
                y2 = e.pageY;
            if (x1 > x2) {
                tmp = x2;
                x2 = x1;
                x1 = tmp;
            }
            if (y1 > y2) {
                tmp = y2;
                y2 = y1;
                y1 = tmp;
            }

            let left = border.offsetLeft;


            if (x1 > left && y1 > border.offsetTop) {
                g.style.left = x1 + 'px';
                g.style.top = y1 + 'px';
                g.style.width = (x2 - x1) + 'px';
                g.style.height = (y2 - y1) + 'px';
            } else if (x1 < left && y1 < border.offsetTop) {
                g.style.left = left + 'px';
                g.style.top = border.offsetTop + 'px';
                g.style.width = (x2 - left) + 'px';
                g.style.height = (y2 - border.offsetTop) + 'px';
            } else if (x1 < left) {
                g.style.left = left + 'px';
                g.style.top = y1 + 'px';
                g.style.width = (x2 - left) + 'px';
                g.style.height = (y2 - y1) + 'px';
            } else if (y1 < border.offsetTop) {
                g.style.left = x1 + 'px';
                g.style.top = border.offsetTop + 'px';
                g.style.width = (x2 - x1) + 'px';
                g.style.height = (y2 - border.offsetTop) + 'px';
            }
        };
        this.options.selectables = this;
        if (this.options.enabled) {
            return this.enable();
        }
        return this;
    }
}