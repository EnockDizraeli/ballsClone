function shakeCanvas(){
   var elt = Globals.get('bodyElt');
   elt.classList.add('shake');
   setTimeout(() => {
      elt.classList.remove('shake');
   },500)
}