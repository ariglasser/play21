/*<link rel="import" href="../../bower_components/polymer/polymer.html">*/
/*<link rel="import" href="/src/cell/cell.html">*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/iron-location/iron-location.js';

Polymer(
    {
      _template: Polymer.html`
        <audio id="player">
      
	        <source src="[[_media2url(media)]]">

            
        </audio>
`,

      is: 'p21-audio',

      properties: {
          media: {
              type: String,
              value: undefined
          },
          audiostate:{
              type: Boolean,
              value: false,
              observer: '_audiostateChanged'
          },

       },

      play:function(){
          if (this.audiostate) 
              this.$.player.play()
      },

      _media2url:function(media){
          console.log("media="+window.location.origin+media)
          return window.location.origin+media
      },

      _audiostateChanged:function(){
         console.log("_audiostateChanged on tag "+this.audiostate)
     }
    }

);
