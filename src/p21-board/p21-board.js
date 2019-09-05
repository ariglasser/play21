/*<link rel="import" href="../../bower_components/iron-swipeable-container/iron-swipeable-container.html">*/
/*<link rel="import" href="/src/cell/cell.html">*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import '../p21-cell/p21-cell.js';
import '../p21-activecell/p21-activecell.js';
Polymer(
    {
      _template: Polymer.html`
        <style>
             :host {
             /*width: 100%;*/
                /*height: 100%;*/
             }
            #cells{
                /*background: blue;*/
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
            }
            p21-cell{

            }
            .cell{
                display: inline-flex;
                background: pink;
            }

             .swiping{
                transition-property: transform;
                transition: 300ms ease-out ;
            }

             .botright{
                border-bottom-right-radius: 2vmin;
             }
             .botleft{
                border-bottom-left-radius: 2vmin;
             }

             .topleft{
                border-top-left-radius: 2vmin;
             }
             .topright{
                border-top-right-radius: 2vmin;
             }


        </style>
        <div id="cells">
            <p21-cell id="cell_0" class="cell" origin="[[origin]]" target="[[target]]"></p21-cell>
            <p21-cell id="cell_1" class="cell" origin="[[origin]]" target="[[target]]"></p21-cell>
            <p21-cell id="cell_2" class="cell" origin="[[origin]]" target="[[target]]"></p21-cell>
            <p21-cell id="cell_3" class="cell" origin="[[origin]]" target="[[target]]"></p21-cell>
            <p21-cell id="cell_4" class="cell" origin="[[origin]]" target="[[target]]"></p21-cell>
            <p21-cell id="cell_5" class="cell" origin="[[origin]]" target="[[target]]"></p21-cell>
            <p21-cell id="cell_6" class="cell" origin="[[origin]]" target="[[target]]"></p21-cell>
            <p21-cell id="cell_7" class="cell" origin="[[origin]]" target="[[target]]"></p21-cell>
            <p21-cell id="cell_8" class="cell" origin="[[origin]]" target="[[target]]"></p21-cell>
            <p21-cell id="cell_9" class="cell" origin="[[origin]]" target="[[target]]"></p21-cell>
            <p21-cell id="cell_10" class="cell" origin="[[origin]]" target="[[target]]"></p21-cell>
            <p21-cell id="cell_11" class="cell" origin="[[origin]]" target="[[target]]"></p21-cell>
            <p21-cell id="cell_12" class="cell" origin="[[origin]]" target="[[target]]"></p21-cell>
            <p21-cell id="cell_13" class="cell" origin="[[origin]]" target="[[target]]"></p21-cell>
            <p21-cell id="cell_14" class="cell" origin="[[origin]]" target="[[target]]"></p21-cell>
            <p21-cell id="cell_15" class="cell" origin="[[origin]]" target="[[target]]"></p21-cell>


            <!--<template is="dom-if" if="{{_isbig(gridsize)}}">-->
                <p21-cell id="cell_16" class="cell" origin="[[origin]]" target="[[target]]"></p21-cell>
                <p21-cell id="cell_17" class="cell" origin="[[origin]]" target="[[target]]"></p21-cell>
                <p21-cell id="cell_18" class="cell" origin="[[origin]]" target="[[target]]"></p21-cell>
                <p21-cell id="cell_19" class="cell" origin="[[origin]]" target="[[target]]"></p21-cell>
                <p21-cell id="cell_20" class="cell" origin="[[origin]]" target="[[target]]"></p21-cell>
                <p21-cell id="cell_21" class="cell" origin="[[origin]]" target="[[target]]"></p21-cell>
                <p21-cell id="cell_22" class="cell" origin="[[origin]]" target="[[target]]"></p21-cell>
                <p21-cell id="cell_23" class="cell" origin="[[origin]]" target="[[target]]"></p21-cell>
                <p21-cell id="cell_24" class="cell" origin="[[origin]]" target="[[target]]"></p21-cell>
                <!--<p21-cell id="cell_01" class="cell" origin="[[origin]]" target="[[target]]"></p21-cell>-->
                <!--<p21-cell id="cell_02" class="cell" origin="[[origin]]" target="[[target]]"></p21-cell>-->
                <!--<p21-cell id="cell_03" class="cell" origin="[[origin]]" target="[[target]]"></p21-cell>-->
                <!--&lt;!&ndash;<p21-cell id="cell_04" class=" cell" r="0" c="4" origin="[[origin]]" target="[[target]]"></p21-cell>&ndash;&gt;-->
            <!--</template>-->



            <!--<p21-cell id="cell_10" class="cell" r="1" c="0" origin="[[origin]]" target="[[target]]"></p21-cell>-->
            <!--<p21-cell id="cell_11" class="cell" r="1" c="1" origin="[[origin]]" target="[[target]]"></p21-cell>-->
            <!--<p21-cell id="cell_12" class="cell" r="1" c="2" origin="[[origin]]" target="[[target]]"></p21-cell>-->
            <!--<p21-cell id="cell_13" class="cell" r="1" c="3" origin="[[origin]]" target="[[target]]"></p21-cell>-->
            <!--&lt;!&ndash;<p21-cell id="cell_14" class="cell" r="1" c="4" origin="[[origin]]" target="[[target]]"></p21-cell>&ndash;&gt;-->


            <!--<p21-cell id="cell_20" class="cell" r="2" c="0" origin="[[origin]]" target="[[target]]"></p21-cell>-->
            <!--<p21-cell id="cell_21" class="cell" r="2" c="1" origin="[[origin]]" target="[[target]]"></p21-cell>-->
            <!--<p21-cell id="cell_22" class="cell" r="2" c="2" origin="[[origin]]" target="[[target]]"></p21-cell>-->
            <!--<p21-cell id="cell_23" class="cell" r="2" c="3" origin="[[origin]]" target="[[target]]"></p21-cell>-->
            <!--&lt;!&ndash;<p21-cell id="cell_24" class="cell" r="2" c="4" origin="[[origin]]" target="[[target]]"></p21-cell>&ndash;&gt;-->



            <!--<p21-cell id="cell_30" class="cell " r="3" c="0" origin="[[origin]]" target="[[target]]"></p21-cell>-->
            <!--<p21-cell id="cell_31" class="cell" r="3" c="1" origin="[[origin]]" target="[[target]]"></p21-cell>-->
            <!--<p21-cell id="cell_32" class="cell" r="3" c="2" origin="[[origin]]" target="[[target]]"></p21-cell>-->
            <!--<p21-cell id="cell_33" class="cell" r="3" c="3" origin="[[origin]]" target="[[target]]"></p21-cell>-->
            <!--&lt;!&ndash;<p21-cell id="cell_34" class="cell" r="3" c="4" origin="[[origin]]" target="[[target]]"></p21-cell>&ndash;&gt;-->



                <!--&lt;!&ndash;<p21-cell id="cell_40" class="cell " r="4" c="0" origin="[[origin]]" target="[[target]]"></p21-cell>&ndash;&gt;-->
                <!--&lt;!&ndash;<p21-cell id="cell_41" class="cell" r="4" c="1" origin="[[origin]]" target="[[target]]"></p21-cell>&ndash;&gt;-->
                <!--&lt;!&ndash;<p21-cell id="cell_42" class="cell" r="4" c="2" origin="[[origin]]" target="[[target]]"></p21-cell>&ndash;&gt;-->
                <!--&lt;!&ndash;<p21-cell id="cell_43" class="cell" r="4" c="3" origin="[[origin]]" target="[[target]]"></p21-cell>&ndash;&gt;-->
                <!--&lt;!&ndash;<p21-cell id="cell_44" class="cell " r="4" c="4" origin="[[origin]]" target="[[target]]"></p21-cell>&ndash;&gt;-->



        </div>
        <p21-activecell id="active" valuestring="{{valuestring}}" origin="[[origin]]" target="[[target]]" gameover="[[gameover]]"></p21-activecell>
`,

      is: 'p21-board',

      properties: {
          gridsize:{
              type: Number,
              value: undefined,
              observer: 'gridsizeChanged'
          },
          valuestring: {
              type: String,
              value: "",
              observer: 'valuestringChanged'
          },
          gameover: {
              type: Boolean,
              value: false
          },

          origin: {
              type: Object,
              value: undefined,
              observer: '_originChanged'
          },

          target: {
              type: Object,
              value: undefined,
              observer: '_targetChanged'
          },

          limits: {
              type: Object,
              value: undefined
          },

          trackStartTime: {
              type: Date,
              value: undefined

          },

          moventDirection: {//0-not set, 1-v,2-h
              type: Number,
              value: 0
          },

      },

      observers: [
          'valuestringChanged(newValuestring,oldValuestring)',
          //'_targetChanged(newTarget,oldTarget)'
      ],

      ready: function() {
          this.active = this.$.active;


//             this.listen(this.active, 'mouseup', '_onSelectTarget');
          this.listen(this.active, 'track', '_onTrack');
          this.listen(this.$.active, 'swipeend', '_onSelectTarget');


          this.listen(this.$.cells, 'touchstart', '_onSelectOrigin');
          this.listen(this.$.cells, 'mousedown', '_onSelectOrigin');


          this.listen(this.$.cells, 'track', '_onTrack');

          this.listen(this.$.cells, 'touchend', '_onSelectTarget');
          this.listen(this.$.cells, 'mouseup', '_onSelectTarget');

          this.listen(this.$.cells, 'opperationended', '_onOpperationended');


           this.addEventListener('transitionend', function (event) {
              console.log(event.type + " " + new Date().getTime());
              Polymer.dom(this.active).classList.remove("swiping");
              var tbr = this.active.$.innercell.getBoundingClientRect()
              console.log("swipe triggering swipeend " + this.moventDirection);
               this.active.fire('swipeend', {x:tbr.left,y:tbr.top,state:"swipeend"});
           });
          //this.listen(this.$.cells, 'operationEnd', '_onOperationEnd');

// document.addEventListener('transitionend', function (event) {
//     console.log(event.type + " " + new Date().getTime());
// });

// this.addEventListener('transitionend', function (event) {
//     console.log(event.type + " " + new Date().getTime());
// });

// this.listen(this, 'transitionend', function (event) {
//     console.log(event.type + " " + new Date().getTime());
// });




      },

      _calculateLimits: function () {
          var cells = [].slice.call(this.cells)
          var index = cells.indexOf(this.origin);
          var r = Math.floor(index/this.gridsize);
          var c = index%this.gridsize;

          var limits = {
              l: 0,
              r: this.gridsize-1,
              t: 0,
              b: this.gridsize-1,
              row:r,
              col:c
          };

          var index = c;
          while (index < this.gridsize*this.gridsize){
              var irow = Math.floor(index/this.gridsize);
              if (irow < r){
                  if (cells[index].number!=undefined)
                      limits.t = irow
              }
              else if (irow == r){
                  var icol =0;
                  while (icol< this.gridsize){
                      if (icol<c){
                          if (cells[(irow*this.gridsize)+icol].number!=undefined)
                              limits.l = icol
                      }
                      else if (icol>c){
                          if (cells[(irow*this.gridsize)+icol].number!=undefined){
                              limits.r = icol;
                              break
                          }
                      }
                      icol++
                  }
              }
              else { //irow > r
                  if (cells[index].number!=undefined){
                      limits.b = irow;
                      break
                  }
              }
              index+=this.gridsize
          }
          limits.tc=this.$["cell_"+(limits.t *this.gridsize+limits.col)];
          limits.bc=this.$["cell_"+(limits.b *this.gridsize+limits.col)];
          limits.lc=this.$["cell_"+(limits.row *this.gridsize+limits.l)];
          limits.rc=this.$["cell_"+(limits.row *this.gridsize+limits.r)];
          console.log("_calculateLimits" +
              " t="+ limits.t +
              " b="+ limits.b +
              " l="+ limits.l +
              " r="+ limits.r +
              " tc="+ limits.tc.id +
              " bc="+ limits.bc.id +
              " lc="+ limits.lc.id +
              " rc="+ limits.rc.id +
              " col="+ limits.col +
              " row="+ limits.row);

          return limits

      },

      _isbig:function(gridsize){
        return this.gridsize==5;
      },

      _issmall:function(gridsize) {
          return this.gridsize!=5;
      },

      _getCellAtPosition:function(x,y){
          var br = this.$.cells.getBoundingClientRect();
          var cbr = this.$.cell_0.getBoundingClientRect();
          var c = Math.floor(parseInt(x- br.left) / cbr.width);
          var r = Math.floor(parseInt(y - br.top) / cbr.height);
          return this.$["cell_"+(r*this.gridsize+c)]
      },

      _onSelectOrigin:function(event) {
          if (this.gameover){return}
          event.x = event.x  || event.changedTouches[0].clientX;
          event.y = event.y  || event.changedTouches[0].clientY;
          var cell = this._getCellAtPosition(event.x,event.y);
          this.target = undefined

          if (cell.number == undefined) {
              cell = undefined
              //cell.createNummber()
          }
          else
              console.log("_onSelectOrigin" + cell.id );
          //if (cell.isToggeling() && event.state != "start") {
          //    console.log("_onSelectOrigin exit durint toggle " + cell.id );
          //    return;
          //}

          this.origin = cell


      },

      _onSelectTarget:function(event) {
          if (this.gameover){return}
          if (this.origin == undefined){
              this.target = undefined;
              return
          }
          if (Polymer.dom(this.active).classList.contains("swiping")){
              console.log("_onSelectTarget ignore durint swipeing");
              return;
          }



          event.x = event.x  || (event.detail && event.detail.x) || event.changedTouches[0].clientX;
          event.y = event.y  || (event.detail && event.detail.y) || event.changedTouches[0].clientY;
          var cell = this._getCellAtPosition(event.x,event.y);
          //if (cell == this.origin){
          //    console.log("_onSelectTarget == origin exit" + cell.id);
          //    return;
          //}

          console.log("_onSelectTarget "+(cell?cell.id:"no cell") );
          var droplimits = this._calculateLimits();
          if (cell.c<droplimits.l || cell.c>droplimits.r || cell.r<droplimits.t || cell.r>droplimits.b){
              console.log("_onSelectTarget out of limits");
              cell = undefined;
          }
          if(!cell){
             this.origin = undefined;

          }
          this.target = cell;
      },

      valuestringChanged:function(newOrigin,oldOrigin) {
          console.log("value string changed in board:" +this.valuestring)
      },

      gridsizeChanged:function(newgrid,oldgrid) {
          var cells = this.querySelectorAll("p21-cell");
          this.cells = []
          var p = this._isbig(this.gridsize)?"20%":"25%"
          for (var r = 0; r < this.gridsize; r++) {
              for (var c = 0; c < this.gridsize; c++) {
                  console.log(cells[r * this.gridsize + c].id)
                  cells[r * this.gridsize + c].style.width = p;
                  cells[r * this.gridsize + c].style.height = p;
                  cells[r * this.gridsize + c].c = c
                  cells[r * this.gridsize + c].r = r;
                  cells[r * this.gridsize + c].style.display = "block";
                  cells[r * this.gridsize + c].classList.remove("topright")
                  cells[r * this.gridsize + c].classList.remove("botleft")
                  cells[r * this.gridsize + c].classList.remove("botright")
                  this.cells.push(cells[r * this.gridsize + c])
              }
          }
          if (!this._isbig(this.gridsize)){
              for (var r = 16; r < cells.length; r++) {
                  cells[r].style.display = "none";
              }
          }
          this.$["cell_"+(this.gridsize-1)].classList.add("topright")
          this.$["cell_"+((this.gridsize*this.gridsize)-this.gridsize)].classList.add("botleft")
          this.$["cell_"+((this.gridsize*this.gridsize)-1)].classList.add("botright")
          this.reset()
      },

      _originChanged:function(newOrigin,oldOrigin){
          if (newOrigin){
//                 if (!this.origin.getBoundingClientRect){
//                         if (this.origin==1)
//                         this.origin = 2;
//                         return;
//                 }    
              console.log("_originChanged changed");
              this.limits = this._calculateLimits();
              this.target = undefined;
          }
          else{
              console.log("_originChanged changed to nothing");

          }
          

      },

      _targetChanged:function(newTarget,oldTarget){
          if(newTarget && this.origin != this.target){
          //         this.createNummber();
          //    console.log("_targetChanged changed");
              //this.origin=undefined;
              //this.limits = undefined;

          }
          else {

          }
      },

      _onTrack: function(event) {
          if (this.gameover){return}

          var track = event.detail;
          if (track.state === 'start') {
              console.log("_onTrack start " + event.timeStamp);
              this._onSelectOrigin(track)
              this.trackStartTime = new Date();
              this.moventDirection = 0;
          } else if (track.state === 'track'){
                  this._trackMove(track);
          } else if (track.state === 'end' && this.trackStartTime) {
              var elapsedTime = new Date().getTime() - this.trackStartTime.getTime() ;// get time elapsed
              if (elapsedTime <= 300) {
//                         if(Math.max((Math.abs(track.dx),Math.abs(track.dy))<=90)){
                          console.log("_onTrack swipe " + event.timeStamp);
                          this._swipe(track);
                          return;
//                         }
              }
              console.log("_onTrack end");
              this._onSelectTarget(track)
          }
      },

      //_onOperationEnd:function(event) {
      //
      //    console.log("_onOperationEnd " + event.detail.state)
      //    if (event.detail.state == "move"){
      //        this.origin.reset();
      //        this.origin = undefined;
      //
      //    }
      //},
      _trackMove: function(event) {
          if (!this.origin){return;}
          var cell = this._getCellAtPosition(event.x,event.y);
          if (!cell){
              console.log("_trackMove exit");
              return
          }
          if (cell == this.origin){
              this.moventDirection  = -1*Math.abs(this.moventDirection);
          }
          else {
              if (cell.c != this.limits.col) {//motion should be in in row
                  if (cell.r != this.limits.row) {
                      console.log("_trackMove exit -changecol&row");
                      return;
                  }
                  if (this.moventDirection == 2){
                      console.log("_trackMove exit -cant change from V2H");
                      return;
                  }
                 
                  this.moventDirection = 1;
              } else {//moving in row
                  if (this.moventDirection == 1){
                      console.log("_trackMove exit -cant change from H2V");
                      return;
                  }
                
                  this.moventDirection = 2;
              }
          }
//             console.log("_trackMove direction="+this.moventDirection + " " + event.dy + "," + event.dx)
          var dx= event.dx;
          var dy= event.dy;

          if (this.moventDirection==0){
              if (Math.abs(dx)>Math.abs(dy)){this.moventDirection = -1;}
              else {this.moventDirection = -2;}
          }
          var obr = this.origin.getBoundingClientRect();
          if (Math.abs(this.moventDirection)== 1) {
              if (dx<0 && this.limits.lc.getBoundingClientRect().left > obr.left+event.dx){
                  console.log("_trackMove exit -out of limits -x");
                  this.limiton = true;
                  return;
              }
              if (dx>0 && this.limits.rc.getBoundingClientRect().right <= obr.right+event.dx){
                  console.log("_trackMove exit -out of limits +x");
                  this.limiton = true;
                  return;
              }
              dy=0;
         }
          else{
              if (dy<0 && this.limits.tc.getBoundingClientRect().top >= obr.top +event.dy){//
                  console.log("_trackMove exit -out of limits -y");
                  this.limiton = true;
                  return;
              }
              if (dy>0 && this.limits.bc.getBoundingClientRect().bottom <= obr.bottom+event.dy){
                  console.log("_trackMove exit -out of limits +y");
                  this.limiton = true;
                  return;
              }
              dx=0;
          }
          this.active.move(dx,dy,cell);


      },

      whichTransitionEvent:function(){
       var t,
           el = this.$.active;

       var transitions = {
         "transition"      : "transitionend",
         "OTransition"     : "oTransitionEnd",
         "MozTransition"   : "transitionend",
         "WebkitTransition": "webkitTransitionEnd"
       }

       for (t in transitions){
         if (el.style[t] !== undefined){
           return transitions[t];
         }
       }
     },

      //activeEnd:function(event){
      //    console.log("_---onActiveEnd " + event.detail.state);
      //    var needsNewNumber = this.origin != this.target && this.target!=undefined;
      //    if (event.detail.state != "cancel") {
      //        this.origin = undefined;
      //        this.target = undefined;
      //    }
      //    if (event.detail.newnumber)
      //         this.newNumber();
      //},
      _swipe:function(event){
          var cell;
          if (Math.abs(event.dx) >=Math.abs(event.dy)){
              cell = this.$["cell_"+(this.origin.r*this.gridsize +(event.dx< 0? this.limits.l : this.limits.r))];
          }
          else {
              cell = this.$["cell_"+((event.dy< 0? this.limits.t : this.limits.b)*this.gridsize+ this.origin.c)];
          }
          console.log("_swipe")
           //
           //swipe: function (target,track) {

          var abr = this.active.getBoundingClientRect();
          var obr = this.origin.getBoundingClientRect();
          var tbr = cell.getBoundingClientRect()
          var dx = tbr.left - abr.left;
          dx = dx + (abr.left - obr.left);
          var dy = tbr.top - abr.top;
          dy = dy + (abr.top - obr.top);




          

//             this.listen(this.$.active, this.whichTransitionEvent(), function(){
//     console.log("something")
// });

              Polymer.dom(this.active).classList.add("swiping");

          //this.active.transform('translate3d(' + dx + 'px,' + dy + 'px,0)', this);
          this.active.move(dx,dy,cell);

         

//            this.async(function () {
////                 Polymer.dom(this.active).classList.remove("swiping");
//                console.log("swipe triggering swipeend");
//               cell.fire('swipeend', {x:tbr.left+tbr.width/2,y:tbr.top+tbr.height/2,state:"swipeend"});
////                 this._trackMove(event);
//            }, 300);
       

      },

      _onOpperationended:function(e){
          this.origin.reset();
          if (e.detail.number == 21){
              this.target.reset()
              this.target=undefined;
              this.origin=undefined;
              
          }
      },

      createNummber: function () {
          var unused = [];
          var cells = this.cells;
          for (var r = 0; r < cells.length; r++) {
              if (cells[r].number == undefined)
                  unused.push(cells[r])
          }

          if (unused.length == 0) {
              this.gameover = true;
              this.target = undefined;
              this.origin = undefined;
              this.valuestring = "Game Over";
              this.fire('gameover', {gameover:"gameover"});
              return
          }
          var i = Math.floor((Math.random() * unused.length));
          unused[i].createNummber();
      },

      reset:function (){
          var cells = this.cells;    
          for (var r = 0; r < cells.length; r++) {
              cells[r].reset();
          }

          this.valuestring = "";
          this.gameover = false;
          this.target = undefined;
          this.origin= undefined;
          
          this.limits = undefined;
          this.trackStartTime = undefined;
          this.moventDirection = 0;
          for (var i = 0; i < 5; i++) {
              this.createNummber();
          }
      }
    }
);
