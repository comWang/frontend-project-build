class FlexContainer {
    constructor({ rel, dir }) {
        // 水平方向还是竖直方向,默认竖直方向
        this.dir = dir === true ? 'x' : 'y';
        this.ele = FlexContainer.getRootElement(rel);
        // 触摸起始坐标
        this.start = {};
        this.end = {};
        this.shift = null;
        if (this.ele) this.target = this.ele.children && this.ele.children[0];
        // 元素原始状态
        if (this.target) {
            this.origin = {
                offsetLeft: this.target.offsetLeft,
                offsetTop: this.target.offsetTop,
            };
        }
        // 各位置下的钩子
        this.hooks = {
            pos1: {
                status: false,
                callback: {
                    up: null,
                    down: null,
                },
            },
            pos2: {
                status: false,
                callback: {
                    up: null,
                    down: null,
                },
            },
            pos3: {
                status: false,
                callback: {
                    up: null,
                    down: null,
                },
            },
        };
        this.bindEvent();
    }

    static getRootElement(rel) {
        const eles = document.querySelectorAll(`.flex-container[rel=${rel}]`);
        return eles[0];
    }

    static bound(n) {
        const { PI, sin, min } = Math;
        const value = 300 * sin(min(n, 2500) * PI / 5000);
        return value;
    }

    sayHi() {
        console.log(this.ele);
        console.log(this.target);
    }

    bindEvent() {
        const { target } = this;
        target.addEventListener('touchstart', (e) => {
            const touch = e.changedTouches[0];
            this.start.x = touch.pageX;
            this.start.y = touch.pageY;
        });

        target.addEventListener('touchmove', (e) => {
            const touch = e.changedTouches[0];
            this.end.x = touch.pageX;
            this.end.y = touch.pageY;
            const val = this.end[this.dir] - this.start[this.dir];
            const shift = val > 50 ? 50 + FlexContainer.bound(val - 50) : val;
            this.shift = this.changeRelPosition(shift);
        });

        target.addEventListener('touchend', (e) => {
            this.end.x = e.changedTouches[0].pageX;
            this.end.y = e.changedTouches[0].pageY;
            let timer = null;
            const back = () => {
                this.shift -= 20;
                if (this.shift <= -20) return cancelAnimationFrame(timer);
                this.changeRelPosition(this.shift >= 0 ? this.shift : 0);
                timer = requestAnimationFrame(back);
                return 0;
            };
            timer = requestAnimationFrame(back);
            // const end = this.end[this.dir];
            // const start = this.start[this.dir];
            // const timer = requestAnimationFrame(() => {
            //     if (end <= start) cancelAnimationFrame(timer);
            //     this.end[this.dir] = this.changeRelPosition(end, start);
            // });
        });
    }

    // 根据传入的偏移量改变目标相对于元素的位置
    changeRelPosition(shift) {
        const distance = this.dir === 'x' ? this.origin.offsetLeft : this.origin.offsetTop;
        const { pos1, pos2, pos3 } = this.hooks;
        if (shift >= 50 && shift < 100) {
            if (!pos1.status) {
                pos1.status = true;
                console.log('执行回调函数 1');
            }
        }
        if (shift >= 100 && shift < 150) {
            if (!pos2.status) {
                pos2.status = true;
                console.log('执行回调函数 2');
            }
        }
        if (shift >= 150) {
            if (!pos3.status) {
                pos3.status = true;
                console.log('执行回调函数 3');
            }
        }
        if (this.target) this.target.style = `position:relative;${this.dir === 'x' ? 'left' : 'top'}:${shift + distance}px`;
        return shift;
    }
}

export default FlexContainer;
