let Globals = {
   data: {},
   set(key, value){
      this.data[key] = value;
   },
   get(key){
      return this.data[key];
   }
}
Globals.set('bodyElt',document.getElementsByTagName('body')[0]);