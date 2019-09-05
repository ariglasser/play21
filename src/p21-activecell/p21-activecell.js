/*<link rel="import" href="/src/cell/cell.html">*/
/*<link rel="import" href="../../bower_components/iron-swipeable-container/iron-swipeable-container.html">*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

Polymer(
    {
      _template: Polymer.html`
        <style>
            :host {
                position: absolute;
                display: none;
            }
            #outercell {
                width: 100%;
                height: 100%;
            }

            #innercell {

                width: 80%;
                height: 80%;
                margin: auto;
                border-radius: 2vmin;
                border: 1px solid black;
                margin-top: 10%;
                margin-left: 10%;
                margin-bottom: 10%;
                margin-right: 10%;
                text-align: center;
                vertical-align: middle;
                font-weight: bolder;
                word-wrap: break-word;

            }
            .swiping{
                /*transition-property: transform;*/
                /*transition: 300ms ease-out ;*/
            }
            /*.toggeling{*/
                /*!*transition-property: background;*!*/
                /*!*transition: 500ms ease-out ;*!*/
                /*background: green;*/
                /*!*display: none;*!*/


            .toggeling{
                font-size: 4vmin;
                background: green;
            }
             .nottoggeling{
                  background: gray;
                font-size: 4vmin;
            }
        </style>

        <div id="outercell">
            <div id="innercell" class="nottoggeling"> {{valuestring}}</div>
        </div>
`,

      is: 'p21-activecell',

      properties: {
          origin: {
              type: Object,
              value: function () {
              },
              observer: 'originChanged'
          },
          target: {
              type: Object,
              value: function () {
              },
              observer: 'targetChanged'
          },

          valuestring: {
              type: String,
              value: undefined,
              observer: 'valuestringChanged'
          },
          lhs: {
              type: Number,
              value: undefined,
              observer: 'lhsChanged'
          },

          rhs: {
              type: Number,
              value: undefined,
              observer: 'rhsChanged'
          },

          opp: {
              type: Number,
              value: undefined,
          },

          val: {
              type: Number,
              value: undefined,
          },
          operators:{
              type: Array,
              value: ["+", "-", "*", "/"]
          },
          gameover: {
              type: Boolean,
              value: false,
              observer: 'ongameover'
          },
      },

      summ: function () {
                  return this.lhs + (this.rhs || 0)
              },

      subtract:function () {
              if (this.lhs == this.rhs) {
                  return undefined;
              }
              return Math.abs(this.lhs - (this.rhs || 0))
          },

      multiply:function () {
              return this.lhs * (this.rhs == undefined ? 1 : this.rhs)
          },

      devide:function () {
              if (this.rhs == undefined || this.lhs == undefined) {
                  return undefined;
              }
              var a = Math.max(this.rhs, this.lhs);
              var b = Math.min(this.lhs, this.rhs);
              if (a % b != 0)
                  return undefined;
              return Math.floor(a / b);
          },

      lhsChanged:function (n) {
          this.lhs = n;
          this.rhs = undefined
          this.val = n;
          this.opp = undefined;
          this.valuestring = "" + (n || "");
      },

      rhsChanged: function (n) {
          if (!n ) {
              this.val = this.lhs;
              this.valuestring = "" + (this.lhs || "")
          }
          else {
              var val;
              var opp;
              var d = Number.POSITIVE_INFINITY;
              var vals = [
                 this.summ(),
                 this.subtract(),
                 this.multiply(),
                 this.devide()
              ];
              for (var i = 0; i < 4; i++) {
                  if (vals[i] == undefined) {
                      continue;
                  }
                  if (Math.abs(21 - vals[i] ) < d) {
                      val = vals[i] ;
                      d = Math.abs(21 - val);
                      opp = i;
                  }
              }
              this.opp = opp;
              this.val = val;
              this.valuestring = "" + this.lhs + this.operators[this.opp] + this.rhs + " = " + this.val;
          }
     },

      valuestringChanged:function(newValuestring,oldValuestring) {
       console.log("active.valuestring=="+this.valuestring)
         this.fire('valuestringchanged', {valuestring:this.valuestring});
   },

      nextOperator: function (opp) {
          var opp = ((opp || (this.opp || 0 ) + 1)) % 4;

          var val;
          if (opp == 1)
              val = this.subtract();
          else if (opp == 2)
              val = this.multiply();
          else if (opp == 3)
              val = this.devide();
          else
              val = this.summ();
          if (val == undefined) {
              opp++;
              return this.nextOperator(opp);
          }
          this.opp = opp;
          this.val = val;

          this.valuestring = "" + this.lhs + this.operators[this.opp] + this.rhs + " = " + this.val;
      },

      reset:function(){
          this.lhs = undefined;
          this.rhs = undefined;
          this.val=undefined;
          this.opp = undefined;
          this.valuestring="";
      },

      //observers: [
      //    'originChanged(newOrigin,oldOrigin)',
      //    'targetChanged(newTarget,oldTarget)',
      //    'hoverChanged(newhover,oldhover)'
      //],



      originChanged: function (newOrigin,oldOrigin) {
          console.log("active.originChanged "+(newOrigin?newOrigin.id:"undefined"));

          if (newOrigin) {
              Polymer.dom(this.$.innercell).classList.remove("toggeling");
              Polymer.dom(this.$.innercell).classList.add("nottoggeling");

              this.unlisten(this, 'tap', '_onTap');
              this.transform('translate3d(0px,0px,0)', this);
              var boundingClientRect=this.origin.getBoundingClientRect();
              this.style.left = boundingClientRect.left + "px";
              this.style.top = boundingClientRect.top + "px";
              this.style.width = boundingClientRect.width + "px";
              this.style.height = boundingClientRect.height + "px";
              if (this.lhs == newOrigin.number)
                  this.reset()
              this.lhs = newOrigin.number;
              this.style.display = "block";
          }
          else if (this.target==undefined){
             this.style.display = "none";
             this.valuestring=""
          }
      },

      targetChanged: function (newTarget,oldTarget) {
          console.log("active.taragetChanged" +(newTarget?newTarget.id:"undefined"));
          this.transform('translate3d(0px,0px,0)', this);

          if (newTarget){
              var boundingClientRect=this.target.getBoundingClientRect();
              this.style.left = boundingClientRect.left + "px";
              this.style.top = boundingClientRect.top + "px";
              this.style.width = boundingClientRect.width + "px";
              this.style.height = boundingClientRect.height + "px";



              this.rhs =  this.origin == this.target?undefined:newTarget.number;
              if (this.origin != this.target){
                  if (newTarget.number){
                      Polymer.dom(this.$.innercell).classList.add("toggeling");
                      Polymer.dom(this.$.innercell).classList.remove("nottoggeling");
                      this.listen(this, 'tap', '_onTap');
                  }
                  this.target.dropOrigigenOnTarget(this.val,this.opp==undefined?undefined:this.operators[this.opp],this.origin);
                  console.log("needn to do a drop");
              }

          }else {
//                 this.style.display = "none";
//                 Polymer.dom(this.$.innercell).classList.remove("toggeling");
              console.log("_targetChanged changed to nothing");
          }
      },

      _onTap: function (newTarget) {
          if (this.gameover){return}
          console.log("ontap");
          //this.listen(this.$.cells, 'tap', '_onTap');

          //if (cell.isToggeling()) {
              this.nextOperator();
              this.target.dropOrigigenOnTarget(this.val,this.operators[this.opp]);
              //this.target.number = this.val;
          //}
       },

      //logic
      //;
      //isToggeling:function(){
      //    return Polymer.dom(this.$.innercell).classList.contains("toggeling");
      //},



      move: function (dx, dy,moveOver) {
//             console.log("active.move:"+ this.lhs + "  " +moveOver.number);
          this.moveOver = moveOver;
          this.transform('translate3d(' + dx + 'px , ' + dy + 'px , 0)', this);
          //logic
          this.rhs = this.origin==moveOver?undefined:moveOver.number;
      },

      ongameover:function(){
         if (this.gameover)
              this.style.display = "none";      
      }
    }
);
