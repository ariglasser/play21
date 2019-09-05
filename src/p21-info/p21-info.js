/*<link rel="import" href="../../bower_components/paper-toolbar/paper-toolbar.html">*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icons/av-icons.js';
import '../p21-audio/p21-audio.js';
Polymer(
    {
      _template: Polymer.html`
        <style>

            :host {

            }

            #contaner {
                width: 100%;
                display: flex;
                flex-direction: column;
            }

            #div1 {
                display: flex;
                flex-direction: row;
                /*background: red;*/
                width: 100%;
                /*height: 19vw;*/
                /*max-height: 18vmin;*/
                justify-content: space-between;
                align-items: center;
            }

            #div2 {
                /*display: inline-flex;*/
                /*background: orange;*/
                width: 100%;
                height: 18vmin;

                /*border: 1px solid red;*/
                display: flex;
                /*background: orange;*/
                flex-direction: row;
                justify-content: space-around;
                align-items: center;
                align-content: space-between;
                /*padding-left: .5ex;*/
                /*padding-right: .5ex;*/
                /*padding-top: 5px;*/
            }

            #timerouter {
                display: flex;
                flex-direction: column-reverse;
                /* flex-grow: 0; */
                /* width: 100%; */
                height: 100%;
                /*background: green;*/
                /* align-items: baseline; */
                /* justify-content: initial; */
            }

            #timerinner {
                width: 100%;
                background: red;
                /* float: initial; */
                /* position: static; */
                /* bottom: 133px; */
                /* align-items: flex-end; */
                /* top: 12vmin; */
                display: inline-flex;
                /* align-self: flex-end; */
                align-self: center;
            }


           .timerstart{
                height: 100%;
            }
            .timertick{
                transition-property:height;
                height: 1%;
            }

            .infosection{
                margin-left: 4px;
                margin-right: 4px;
                border-radius: 10px;
                background: gray;
                height:100%;
            }

            .levelgroup {
                display: flex;
                /*height: 85%;*/
                align-items: stretch;
                justify-content: space-between;


            }
            .infogroup {
                display: flex;
                flex-direction: column;
                /*height: 85%;*/
                flex-grow: 1;
                align-items: stretch;
                justify-content: space-between;


            }
            .scoregroup {

                flex-grow: 3;
            }
            .infogroup span{
                padding-left: 5px;
            }


            #timerdiv {
                display: flex;
                flex-direction: column;
                height: 16vmin;
                align-items: stretch;
                justify-content: space-between;
                flex-grow: 0;
                height: 100%;
                width: 6vmin;
                    /* background: gray; */
                padding-left: 4px;
                padding-right: 4px;
            }

            .scorevalue {
                display: inline-flex;
                /* height: 5vmin; */
                font-size: 10vmin;
                flex-grow: 1;
                align-items: center
            }

            .scoretitle {
                /*line-height: 2ex;*/
                /*vertical-align: middle;*/
                /*padding: .5ex;*/
                display: inline-flex;
                /*padding-left: 2ex;*/
                /*padding-right: .3ex;*/
            }

            #div3 {
                display: inline-flex;
                /*background: green;*/
                width: 100%;
                height: 12vmin;
                /*max-height: 18vmin;*/
                font-size: 8vmin;
                /* text-align: center; */
                font-weight: bold;
                /* vertical-align: middle; */
                justify-content: center;
                align-items: center;
            }

            span {
                /*display: inline-flex;*/
            }

            #instructions {
                font-size: 5vmin;
                display: inline-flex;
            }

            #logo {
                display: inline-flex;
                /* transform: scale(6, 3); */
                font-size: 17vmin;
                font-weight: bolder;
            }
            #toolbar{
                display: flex;
                width: 90%;
                flex-direction: row;
                align-items: stretch;
                justify-content: flex-start;
            }

            paper-icon-button{
                display: inline-flex;
            }

             #toolbar div{
                 display: inline-flex;
                 flex-grow: 1;
             }

            .circles{
                display: flex;
                flex-direction: column;
                /*height: 100%;*/
                /*background: blue;*/
            }
            .circle{
                display: inline-flex;
                width: 1.6vmin;
                height: 1.6vmin;
                border-radius: 50%;
                background: none;
                border: 2px solid pink;
            }


        </style>
        <!--<paper-toolbar>-->
          <!--<span class="title">Title</span>-->

        <!--</paper-toolbar>-->


        <p21-audio id="gamestart" media="/media/gamestart.wav" audiostate="[[audiostate]]"></p21-audio>
        <p21-audio id="levelchanged" media="/media/levelchanged.wav" audiostate="[[audiostate]]"></p21-audio>
        <p21-audio id="pausestate" media="/media/pausestate.wav" audiostate="[[audiostate]]"></p21-audio>

        <p21-audio id="drip" media="/media/point.wav" audiostate="[[audiostate]]"></p21-audio>
        <div id="contaner">
            <div id="div1">
                <div id="div11">
                    <div id="toolbar">

                        <paper-icon-button id="playstate" icon="[[playstate ]]"></paper-icon-button>

                        <paper-icon-button id="resetgame" icon="av:replay">+</paper-icon-button>

                        <paper-icon-button id="setgridsize" icon="icons:aspect-ratio">+</paper-icon-button>

                        <div> </div>
                        <paper-icon-button id="audioonoff" icon="[[audioicon]]">+</paper-icon-button>
                        <!--<paper-icon-button icon="av:album"></paper-icon-button>-->
                    </div>

                    <span id="instructions">move the numbers to make</span>
                </div>
                <span id="logo">21</span>

            </div>





            <div id="div2">
                <div class="infosection levelgroup">
                    <div class="infogroup ">
                        <span class="scoretitle ">Level:</span>
                            <span id="level" class="scorevalue">[[level]]</span>
                            <div class="circles">
                                <div id="c5" class="circle">  </div>
                                <div id="c4" class="circle">  </div>
                                <div id="c3" class="circle">  </div>
                                <div id="c2" class="circle">  </div>
                                <div id="c1" class="circle">  </div>
                            </div>
                   </div>
                </div>
                <div class="infosection infogroup scoregroup">
                    <span class="scoretitle">Score:</span>
                    <span id="score" class="scorevalue">{{score}}</span>
                </div>
                <!--<div class="infogroup">-->
                    <!--<span class="scoretitle">Goal:</span>-->
                    <!--<span id="goal" class="scorevalue">[[goal]]</span>-->
                <!--</div>-->
                <div id="timerdiv">
                    <div id="timerouter">
                        <!--<span class="scoretitle">Time </span>-->
                        <div id="timerinner" class\$="[[timerclass]]"> </div>
                    </div>
                </div>
            </div>
            <div id="div3">
                {{valuestring}}
            </div>
        </div>
`,

      is: 'p21-info',

      //if (origin) {
      //                   this.toggelingValues.opp = undefined;
      //                   this.toggelingValues.lhs = undefined;
      //                   this.toggelingValues.rhs = undefined;
      //                   this.toggelingValues.val = undefined;
      //               }
      //
      //        this.toggelingValues.opp = undefined;
      //               this.toggelingValues.lhs = undefined;
      //               this.toggelingValues.rhs = undefined;
      //               this.toggelingValues.val = undefined;
      properties: {
//             leveltime: {
//                 type: Number,
//                 value: 7000,
//                 //observer: 'levelChanged'
//             },
          gridsize:{
              type:Number,
              value:5,
              notify: true,
          },
          level: {
              type: Number,
              value: 1,
              //observer: 'levelChanged'
          },
          goal: {
              type: Number,
              value: 1,
              observer: 'goalChanged'
          },
          score: {
              type: Number,
              value: 0,
              observer: 'scoreChanged'
          },
          valuestring: {
              type: String,
              value: undefined,
              observer: 'valuestringChanged'
          },
          timerclass:{
              type: String,
              value: "timerstart",
          },
          nextEndtime :{
              type: Number,
              value: undefined,
          },
          playstate:{
              type: String,
              value: "av:play-arrow",
              observer: 'playstateIconChanged'
          },
          audiostate:{
              type: Boolean,
              value: undefined,
              notify: true
          },
          audioicon:{
              type: String,
              value: "av:volume-up"
          },
      },

      valuestringChanged: function (newValuestring, oldValuestring) {
          console.log("info.valuestring changed" + newValuestring)
      },

      scoreChanged: function (newScore, oldScore) {
          if (oldScore != undefined && newScore - (oldScore || 0) < 40)
              this.goal++;
      },

      //levelChanged: function () {
      //    console.log("levelChanged")
      //},
      goalChanged: function () {
           if (this.goal == 6) {
              this.goal = 1;
              this.level++
              this.$.levelchanged.play()
           }
          this.$.c1.style.background = this.goal>=1?"pink":"none";
          this.$.c2.style.background = this.goal>=2?"pink":"none";
          this.$.c3.style.background = this.goal>=3?"pink":"none";
          this.$.c4.style.background = this.goal>=4?"pink":"none";
          this.$.c5.style.background = this.goal>=5?"pink":"none";
      },

      resettimer: function () {
          var that = this;
          this.playstate = "av:pause"
          var leveltime = Math.max(((11-this.level)*1000),100)

          this.$.timerinner.style.transition = "none"
          this.$.timerinner.style.height = "100%";
          this.timerclass = "timerstart"

          //transition:10000ms ease-out;

          setTimeout(function() {

              that.$.timerinner.style.height = "1%";
              that.$.timerinner.style.transition = leveltime +"ms ease-out"
              that.nextEndtime = new Date().getTime() + leveltime ;
              that.timerclass = "timertick"
          }, 1)

      },

      ready: function () {
          this.addEventListener('transitionend', function (event) {
              if (event.srcElement == this.$.timerinner){
                      console.log(event.type + " " + new Date().getTime());
                      console.log("timer end");
                      this.fire('opperationended', {reason:"timeout"});        
              }

              
          });
          this.listen(this.$.timerouter, 'tap', '_onplaystateChange');
          this.listen(this.$.playstate, 'tap', '_onplaystateChange');
          this.listen(this.$.logo, 'tap', '_onreset');
          this.listen(this.$.resetgame, 'tap', '_onreset');
          this.listen(this.$.setgridsize, 'tap', '_onsetgridsize');
          this.listen(this.$.audioonoff, 'tap', '_audioonoff');



      },

      _onplaystateChange:function(){
          if (this.nextEndtime  == undefined){

              this.resettimer();
          }
          else if (this.$.timerinner.style.transition=="none"){
              this.$.timerinner.style.height = "1%";
              var leveltime = Math.max(((11-this.level)*1000),100)
              if (this.remainingTime){
                  leveltime = this.remainingTime;
                  this.remainingTime = undefined;
              }
              this.$.timerinner.style.transition = leveltime +"ms ease-out"
              this.timerclass = "timertick"
               this.playstate = "av:pause" //,""av:play-arrow
          }
          else {
              var computedStyle = window.getComputedStyle(this.$.timerinner);
              var height = computedStyle.getPropertyValue('height');
              this.$.timerinner.style.height = height;
              this.$.timerinner.style.transition = "none";
              this.remainingTime = this.nextEndtime - new Date().getTime();
              this.timerclass = ""
              this.playstate = "av:play-arrow" //,""
          }
      },

      _onreset:function(){
          this.$.timerinner.style.transition = "none";
          this.fire('reset', {reason:"reset"});
          this.score=0;
          this.level=1;
          this.goal=1;
          this.score = 0;
          this.valuestring = undefined;
          this.timerclass = "timerstart";
          this.nextEndtime = undefined;
          this.playstate = "av:pause" //,""
          this.$.gamestart.play()
      },

      playstateIconChanged:function(){
         console.log("playstateIconChanged = "+this.audiostate)
      },

      _audioonoff:function(){
          this.audiostate=!this.audiostate
          this.audioicon = !this.audiostate? "av:volume-up":"av:volume-off"
      },

      _onsetgridsize:function(){
          if(this.gridsize==4)
              this.gridsize=5;
          else{
              this.gridsize=4;
          }
      }
    }
);
