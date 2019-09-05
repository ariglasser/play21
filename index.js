import '/src/p21-app/p21-app.js';
import '@webcomponents/webcomponentsjs/webcomponents-bundle.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<style>
    body {
        -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none; /* Chrome/Safari/Opera */
        -khtml-user-select: none; /* Konqueror */
        -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
        user-select: none;
        cursor: pointer;
        }
</style><title>Play 21</title><p21-app></p21-app>`;

document.head.appendChild($_documentContainer.content);

/*<meta name="viewport" content="width=324">*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
;
