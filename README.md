# grunt-handlebars-static

Created at iCrossing 12.1.2012 by Arne Strout
Generate static HTML from handlebars templates as a part of the build process with this highly configurable plugin for Grunt. 

## Getting Started
Install this grunt plugin next to your project's [grunt.js gruntfile][getting_started] with: `npm install grunt-handlebars-static`

Then add this line to your project's `grunt.js` gruntfile:

```javascript
grunt.loadNpmTasks('grunt-handlebars-static');
```

[grunt]: http://gruntjs.com/
[getting_started]: https://github.com/gruntjs/grunt/blob/master/docs/getting_started.md

## Important note
This package makes some assumptions about the way you are using handlebars templates, it is intended only for backend use, and is not intended for situations in which the same template files are being shared between the front end and the back-end. I may include support for that in the future however, we shall see.
Also this plugin is built around Grunt ~0.3.18 and will require updating before it will be compatible with 0.4a when it becomes stable.

## Project configuration
The below example configuration is the scenario that has so far been developed for. It assumes there is a folder structure under 'app/' which contains many .HBT (partials) and .HBR (templates). The .HBR files will be compiled into HTML files in the same folder structure but under the 'dist/' folder. By default a folder named 'hbr-context' containing a .json file with the same name as the .HBR file will be used as the context. A custom handlebars directive has been added to include your context inline, or to specify it in the .HBR file.

_Note: The .HBR and .HBT extensions are my personal preference, you can use whatever extensions you like by just changing the wildcards._

```javascript
// Project configuration
grunt.initConfig({
	// configuration options
	'handlebars-static':{
		dev:{
			partials:'app/**/*.hbt', // Wildcard for partials to compile
			files:'app/**/*.hbt', // Wildcard for templates to compile into HTML
			data:'hbr-context/*.json', // Wildcard for default context JSON, will be ignored if inlined
			replaceDir:'app/', // The directory you are reading templates from
			withDir:'dist/' // The directory you are publishing to
		}
	}
});
```

## Usage examples
Once you have installed the NPM module, there will be an "examples" folder under the root. This folder contains a complete example project, including a helpful watch task, which demonstrates the use of the task.

## Inline context
You can specify the context for your .HBR template by using a custom comment directive which the module will read as a JSON object. It will also execute inline directives within that JSON object to allow you to specify external .json files to use as portions of the context for the given template. This allows for much greater sharing of data between templates, such as the way that the aforementioned example project includes the topnav data.

```javascript
{{! *** Handlebars Context Inline Configuration **** }}
{{! 
    context:{
        "page":"<context:hbr-json/index.json>",
        "topnav":"<context:common/hbr-json/topnav.json>"
    }
!}}
```
The important part is this directive:
```javascript
{{! context: {JSON DATA GOES HERE} }}
```
However also note the use of the context directive:
```javascript
context:{
	property:<context:path/to/my.file>
}
```
This will load that file inline and process it as a JSON file, then assign that object to the property.

## Referencing partials
Your partials will be given the name of the partial file, prefixed by the path delimited by _ rather than /, in a future build I plan to add a preprocessor so that you can use / instead since it is much more natural, using it without a preprocessor will crash handlebars.

```javascript
{{> common_topnav}}
```
This references the file app/common/topnav.hbt if using the configuration outlined above.
You can specify a context for the partial per usual Handlebars syntax:

```javascript
{{> path_to_my_partial context}}
```

## Contributing
Feel free to drop me a message if you see anything that you might find problematic or would like to see as a feature (but be considerate please) Thanks!

## Release History
0.1.1 - Initial release, still somewhat alpha, but growing quickly.

## License
Copyright (c) 2012 Arne G Strout
Licensed under the MIT license.
