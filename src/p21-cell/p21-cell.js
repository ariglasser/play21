import '@polymer/polymer/polymer-legacy.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="p21-cell">
<dom-module id="p21-cell">
    <template>

        <style>
            :host {

            }
            #outercell {
                width: 100%;
                height: 100%;
            }

            #innercell {
                width: 80%;
                height: 80%;
                /*margin: auto;*/
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
                font-size: 8vmin;
                background: white;
            }
        </style>

        <div id="outercell">
            <div id="innercell">[[cellvalue]]</div>
        </div>
    </template>

    
</dom-module>
</dom-module>`;

document.head.appendChild($_documentContainer.content);
Polymer(
    {
        is: 'p21-cell',
        COLORS: ["#6200EA", "#0D47A1", "#1565C0",
        "#1976D2", "#1E88E5", "#2196F3",
        "#42A5F5", "#64B5F6", "#90CAF9",
        "#B39DDB"],
        properties: {
             c: {
                type: Number,
                value: -1
            },
            r: {
                type: Number,
                value: -1
            },
            number: {
                type: Number,
                value: undefined,
                observer: 'computeCellvalueg'
            },
            score: {
                type: Number,
                value: 0
            },
            chain: {
                type: Array,
                value: []
            },

            origin: {
                type: Object,
                value: undefined,
                 observer: 'computeCellvalueg'
            },
            target: {
                type: Object,
                value: undefined,
                 observer: 'computeCellvalueg'
            },


            cellvalue: {
                type: String,
                value: "",
                observer: 'cellvalueChanged'
            }


        },
        //valuestringChanged: function (newValuestring, oldValuestring) {
        //    console.log("cell.valuestring changed" + newValuestring);
        //    if(this == this.target) {
        //            this.cellvalue = newValuestring;
        //        }
        //},

        cellvalueChanged: function (newCellvalue, oldCellvalue) {
            console.log("cell.cellvalueChanged changed" + newCellvalue);
        },

        //observers: [
        //
        //    'computeCellvalueg(newNumber,oldNumber)'
        //],

        //originChanged: function (origin) {
        //    console.log("originChanged")
        //    if(this == origin) {
        //        console.log("this origin changed")
        //    }
        //    else {
        //
        //    }
        //    this.computeCellvalueg()
        //},
//         targetChanged: function (target) {
//            this.computeCellvalueg();
//            if (this != target) {
//                this.computeCellvalueg()
//            }

//         },






        createNummber: function () {
            var rnd = Math.floor((Math.random() * 10) + 1);
            this.number = rnd;
            this.score = 0;
            this.chain = [""+rnd];
            console.log("cell.new number added @ " + this.r + "," + this.c);
            this.fire('numbercreated', {cell:this});
            //this.computeCellvalueg();
        },


        reset: function () {
            this.number = undefined;
            this.score = 0;
            this.chain = [];
            //this.computeCellvalueg()
        },


        showChain:function(chain){
            if (chain==undefined)
                chain = this.chain
         
            if (Array.isArray(chain)){
                if (chain.length==1)
                   return this.showChain(chain[0])
                else{
                   var s = ""
                   for(var i=0;i<chain.length;i++){
                        s = s + this.showChain(chain[i])
                   }
                   return"("+ s+")"
                }
            }
            
            return chain
        },


        dropOrigigenOnTarget:function(number,operation,origin){
            this.number = number;
            if (origin){
                this.score= this.score+origin.score+1;

                if (operation){
                        this.chain = [[this.chain],operation,[origin.chain]]
                } else {
                        this.chain = origin.chain;
                }
                
                this.fire('opperationended', {number:this.number,score:this.score,chain:number==21?this.showChain():""});
            } else {
                    this.chain[this.chain.length-2]=operation
            }
        },

        computeCellvalueg: function (newNumber,oldNumber) {
            if (this == this.target || this == this.origin){
                if (this.number == undefined){
                    this.cellvalue = "";
                    this.$.innercell.style.background = "white"
                }

                else{
                    this.cellvalue = "";
                    this.$.innercell.style.background =  this == this.target?this.COLORS[Math.min(10, this.score)]:"white";
                }


            }
            else {
                //if(this.number == undefined){
                //    this.cellvalue = ""
                //}
                //else {
                this.cellvalue = ""+(this.number || "")
                this.$.innercell.style.background = this.number ==undefined?"white":this.COLORS[Math.min(10, this.score)];

                //}
            }

        }



//}

    }
);
