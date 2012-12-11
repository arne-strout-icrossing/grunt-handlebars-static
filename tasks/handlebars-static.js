/*
 * grunt-handlebars-static
 * https://github.com/icagstrout/grunt-handlebars-static
 *
 * Copyright (c) 2012 Arne G Strout
 * Licensed under the MIT license.
 */

 module.exports = function(grunt) {

  // ==========================================================================
  // TASKS
  // ==========================================================================

  grunt.registerMultiTask('handlebars-static', 'Compile static HTML from handlebars templates and JSON', function() {
    grunt.log.write('Compiling static HTML from handlebars templates...');

    this.data.files=grunt.template.process(this.data.files);
    this.data.withDir=grunt.template.process(this.data.withDir);
    this.data.replaceDir=grunt.template.process(this.data.replaceDir);
    this.data.data=grunt.template.process(this.data.data);
    this.data.partials=grunt.template.process(this.data.partials);


    var i,u,n,c,p,out,obj,parts;
    // PREPROCESS, CREATE LIST OF PARTIALS (.HBT)
    parts=grunt.file.expandFiles(this.data.partials);

    for(i=0;i<parts.length;i++){
      n=parts[i].substr(parts[i].lastIndexOf('/')+1).split('.')[0]; // just the filename
      p=parts[i].substr(0,parts[i].lastIndexOf('/')+1);
      grunt.helper('compile-handlebars-partial',{template:parts[i],name:p.split(this.data.replaceDir).join('').split('/').join('_')+n});
    }

    // PROCESS, ITERATE THROUGH TEMPLATES (.HBR)
    var internalJSON=false;
    var fileset=grunt.file.expandFiles(this.data.files);
    for(i=0;i<fileset.length;i++){
      internalJSON=false;
      n=fileset[i].substr(fileset[i].lastIndexOf('/')+1).split('.')[0]; // just the filename
      p=fileset[i].substr(0,fileset[i].lastIndexOf('/')+1); // just the path
      out=p.split(this.data.replaceDir).join(this.data.withDir)+n+'.html'; // the output file


      // Search the template file for embedded JSON object
      var tpl=grunt.file.read(fileset[i]);
      var ci=0,cu=0,cn=0,str='';
      while(ci>-1 && ci<tpl.length && !internalJSON){
        ci=tpl.indexOf('{{!',ci+1);
        cu=tpl.indexOf('!}}',cu);
        if(ci>-1 && cu>-1){
          cn=tpl.indexOf('json:',ci);
          if(cn>-1){
            cn+=5;
            str=tpl.substr(cn,cu-cn);
            obj=JSON.parse(str);
            internalJSON=true;
          }
        }
      }
      // If no embedded object, look for JSON file with the same name
      if(!internalJSON)obj=grunt.file.readJSON(p+this.data.data.split('*').join(n));

      var cwd=process.cwd();
      process.chdir(p);
      obj=processUnderscore(processDirectives(obj));
      process.chdir(cwd);

      grunt.log.write('Rendering template "'+n+'" to '+out+"...\n");
      c=grunt.helper('render-handlebars-template', {
        template: fileset[i],
        output: out,
        templateData: obj
      });
      grunt.file.write(out,c);
    }
  });

function processUnderscore(data){
  data= grunt.utils.recurse(data,function(value){
    if(typeof value !== 'string'){return value;}
    return grunt.template.process(value,data);
  });
  return data;
}

function processDirectives(data){
  var toProcess = ['config', 'json'];
  data = grunt.utils.recurse(data, function(value) {
    if (typeof value !== 'string') { return value; }
    var parts = grunt.task.getDirectiveParts(value) || [];
    return toProcess.indexOf(parts[0]) !== -1 ? grunt.task.directive(value) : value;
  });
  return data;
}

  // ==========================================================================
  // HELPERS
  // ==========================================================================
  grunt.registerHelper('compile-handlebars-partial',function(data){
    if(data){
      grunt.log.write("Compiling partial:"+data.name+"\n");
      var handlebars = require('handlebars');
      var template=grunt.file.read(data.template);
      handlebars.registerPartial(data.name,handlebars.compile(template));
    }
  });

  grunt.registerHelper('render-handlebars-template', function(data) {
    if (data) {
      var handlebars = require('handlebars');
      var template = grunt.file.read(data.template);
      var compiledTemplate = handlebars.compile(template);
      var html = '';

      html += compiledTemplate(data.templateData);

      return html;
    }
  });
};