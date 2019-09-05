import '@polymer/polymer/polymer-legacy.js';
import '../p21-info/p21-info.js';
import '../p21-board/p21-board.js';
import '../p21-audio/p21-audio.js';
import '@polymer/iron-resizable-behavior/iron-resizable-behavior.js';
/**
 * Created by arig on 9/4/2016.
 */
Polymer({
  _template: Polymer.html`
    <style>
      :host {
        display: block;
      }
      div{
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-content: center;
    
        justify-content: center;

      }
      .gameitem{
        display: inline-flex;

      }
      p21-info{
        flex-grow: 1;
        width: 30vmin;
        min-width: 50vmin;
        /*height: 30vmin;*/
        /*max-height: 50vmax;*/
        max-width: 55vmax;;
        border-top-left-radius: 2vmin;
      }
      p21-board {
        width: 100vmin;
        height: 100vmin;
        max-height: 55vmax;
        max-width: 55vmax;
        border-bottom-left-radius: 2vmin;
      }

      .verticalborder p21-board {
        border-bottom: 1px solid black;
        border-left: 1px solid black;
        border-right: 1px solid black;
        border-bottom-right-radius: 2vmin;
      }

      .verticalborder p21-info{
        border-top: 1px solid black;
        border-left: 1px solid black;
        border-right: 1px solid black;
        border-top-right-radius: 2vmin;
      }

      .horizontalborder{
        border: 1px solid black;
        border-radius: 2vmin;
      }

    #floating{
            position: absolute;
            margin: 0 auto;
            overflow: hidden;
            white-space: nowrap;
            box-sizing: border-box;
            width: 80px;
            background: InfoBackground;
            border: solid 1px black;
            border-radius: 5px;
            font-size: 25px;


    }
/**/
     .scorechain{
              transition-property: transform, text-indent ;


            }


    /*.marquee:hover {*/
        /*animation-play-state: paused*/
    /*}*/

    /* Make it move */
    @keyframes marquee {
        0%   { text-indent: 0px; visibility: visible;}
        100% { }
      /*//visibility: hidden;*/
        }


    </style>
    <!--<h2>Hello [[prop1]]</h2>-->
    <div class\$="[[bordertype]]">
      <p21-info id="info" class="gameitem" valuestring="[[valuestring]]" score="[[score]]" audiostate="{{audiostate}}" gridsize="{{gridsize}}"></p21-info>
      <p21-board id="board" class="gameitem" gridsize="[[gridsize]]"></p21-board>
      <p id="floating"></p>
        <p21-audio id="newnumber" media="/media/newnumber.wav" audiostate="[[audiostate]]"></p21-audio>
        <p21-audio id="point" media="/media/point.wav" audiostate="{{audiostate}}"></p21-audio>
        <p21-audio id="gameover" media="/media/gameover.wav" audiostate="{{audiostate}}"></p21-audio>

    </div>
`,

  is: 'p21-app',

  behaviors: [
    Polymer.IronResizableBehavior
  ],

  properties: {
        gridsize:{
            type:Number,
            value:5,
            notify: true,
        },
      audiostate:{
            type: Boolean,
            value: false,
            notify: true,
            observer: '_audiostateChanged'
        },
    valuestring: {
            type: String,
            value:"",
            //observer: 'valuestringChanged'
        },
      score:{
          type:Number,
          value:0
      },
      bordertype:{
          type: String,
          value:"verticalborder",
      }
  },

  listeners: {
    'iron-resize': '_onIronResize'
  },

  _onIronResize: function() {
     if (this.$.board.getBoundingClientRect().left>250){
         this.bordertype="horizontalborder";
     }
     else{
       this.bordertype="verticalborder";
   }
 },

  ready: function() {
         this.listen(this.$.board, 'valuestringchanged', '_onValuestringchanged');
         this.listen(this, 'opperationended', '_onOpperationended');
         this.listen(this.$.board, 'numbercreated', '_onNumbercreated');
         this.listen(this.$.info, 'reset', '_onreset');
         this.listen(this.$.board, 'gameover', '_ongameover');
         this.listen(window,"orientationchange", '_onIronResize'     );
         this.addEventListener('transitionend', function (event) {
             if (event.path[0] == this.$.floating && event.propertyName == "transform"){
                 this.$.floating.style["text-indent"] = "0px";
                 this.$.floating.classList.remove("scorechain");
                 this.$.floating.style.transition = "none";
                 this.$.floating.style.display="none"
                 

             }
         });
         this.$.floating.style.display="none";

 },

  _onValuestringchanged:function(e){

      console.log("_onValuestringchanged " +e.detail.valuestring)

      this.valuestring = e.detail.valuestring;
  },

  _onOpperationended:function(e){
      if (e.detail.number == 21){
          this.score = this.score+5*Math.max(1,12- e.detail.score);
          this.$.floating.innerHTML = ""+e.detail.chain;
          var br = e.path[0].getBoundingClientRect();
          var to = this.$.info.$.score.getBoundingClientRect();
          this.$.floating.style.left = br.left+"px"
          this.$.floating.style.top= br.top+"px"


          this.transform('translate3d(0px,0px,0)', this.$.floating);
          var that =this
          this.$.floating.style.display="block"
          this.async(function () {
              Polymer.dom(that.$.floating).classList.add("scorechain");
              this.$.floating.style.transition = ((10-that.$.info.level)/6)+"s ease-out"



              that.$.floating.style["text-indent"] = (that.$.floating.innerHTML.length * -6)+"px"
              //that.$.floating.style["text-indent"] =-(-1*that.$.floating.clientWidth-5)+"px"
              //
              that.transform('translate3d('+(to.left - br.left + to.width/2 -40) + 'px,' + (to.top - br.top ) +'px,0)', that.$.floating);
          }, 50);
          this.$.point.play();
          


          //this.transform('translate3d(' + dx + 'px , ' + dy + 'px , 0)', this);

          //this.transform('translate3d(' + dx + 'px , ' + dy + 'px , 0)', this);

          //


      }
      this.$.board.createNummber();
      this.$.newnumber.play()

  },

  _onNumbercreated:function(){
       this.$.info.resettimer();
  },

  _ongameover:function(){
      this.$.gameover.play();
      console.log("game over")
  },

  _onreset:function(){
       this.$.board.reset();
  },

  _audiostateChanged:function(){
      console.log("_audiostateChanged")
  }
});
