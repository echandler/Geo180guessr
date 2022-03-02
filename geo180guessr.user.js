// ==UserScript==
// @name         Geo180guessr
// @namespace    GeoGuessr scripts
// @version      0.1
// @description  Flip geoguessr 180 degrees.
// @author       echandler
// @match        https://www.geoguessr.com/*
// @grant        none
// ==/UserScript==

(function () {
    "use strict";

    let btnXY = localStorage['geo180Btn']? JSON.parse(localStorage['geo180Btn']): {x: 10, y: 10};
    var btn = document.createElement("button");
    btn.innerText = "180";
    btn.style.position = "absolute";
    btn.style.zIndex = 9999999;
    btn.style.top = btnXY.y + "px";
    btn.style.left = btnXY.x + "px";
    document.body.appendChild(btn);

btn.addEventListener('mousedown', function(e){
    document.body.addEventListener('mousemove', mmove);
    document.body.addEventListener('mouseup', mup);
    let yy = btnXY.y - e.y;
    let xx = e.x - btnXY.x;
    let moved = false;

    function mmove(evt){
        if (Math.abs(evt.x - e.x) > 2 || Math.abs(evt.y - e.y) > 2){
           document.body.removeEventListener('mousemove', mmove);
           document.body.addEventListener('mousemove', _mmove);
            moved = true;
        }
    }

    function _mmove(evt){
        btn.style.top = evt.y + yy + "px";
        btn.style.left = evt.x - xx + "px";
    }

    function mup(evt){
        document.body.removeEventListener('mousemove', mmove);
        document.body.removeEventListener('mousemove', _mmove);
        document.body.removeEventListener('mouseup', mup);

        if (!moved){
            obj.flipIt();
            return;
        }

        btnXY.x = evt.x - xx;
        btnXY.y = evt.y + yy;
        localStorage['geo180Btn'] = JSON.stringify(btnXY);
    }
});

    let obj = {
        ptr: undefined,
        canvas: undefined,
        cHeight: 0,
        cWidth: 0,
        cOffSetTop: 0,

        flipIt: function(){
            if (this.canvas){
                this.unflip180();
            } else {
                 this.flip180();
            }
        },

        unflip180: function () {
            if (this.ptr){
                this.ptr.parentElement.removeChild(this.ptr);
            }

            this.ptr = undefined;

            if (!this.canvas) return;

            this.canvas.removeEventListener("mousemove", this.mousemove);
            this.canvas.style.transform = "rotate(0deg)";
            this.canvas = undefined;
        },

        flip180: function () {
            let c = document.querySelector('[aria-label="Street View"]');

            if (!c || !c.querySelector('canvas')) {
                return;
            }

            c = c.querySelector('canvas');

            this.canvas = c;

            c.addEventListener("mousemove", this.mousemove.bind(this));
            c.style.transform = "rotate(180deg)";
            c.style.transition = "all 1s ease";

            let rect = c.getBoundingClientRect();
            this.cWidth = rect.width;
            this.cHeight = rect.height;
            this.cOffSetTop = rect.top;

            this.makePtr(c.parentElement);
        },

        makePtr: function (parentElm) {
            var div = document.createElement("div");
            div.style.position = "absolute";
            div.style.width = "20px";
            div.style.height = "20px";
            div.style.border = "2px solid red";
            div.style.borderRadius = "10px";
            div.style.top = '100px';
            div.style.left = '-100px';
            div.style.zIndex = 9999999;
            div.style.pointerEvents = 'none';

            this.ptr = div;
            this.ptrWidth = 20;
            this.ptrHeight = 20;

            parentElm.appendChild(div);
        },

        mousemove: function (e) {
            this.ptr.style.top = this.cHeight - e.y + this.cOffSetTop - 2 - this.ptrHeight / 2 + "px";
            this.ptr.style.left = this.cWidth - e.x + 1 - this.ptrWidth / 2 + "px";
        },
    };
})();
