# Painful Nuxt.js debugging in Webstorm
Setting up debugging in Nuxt.js for Webstorm IDE can be (read _is_) a painful experience. Especially if you use __Nuxt with typescript__.
Up to this point there is not an official nor unofficial fully bullet-proof manual how to proceed in order
to cover all the various Nuxt/Vue features (plugins, modules, components...) at the same time.

I've collected and tested about a dozen of ideas and hints how to set the debugger up, though not a single one of them
worked perfectly. Sadly, I have yet to find a way how to get all working. Therefore, __this post is not the one-to-rule-them-all__ 
guide that solves all the problems. It is a an overview of available options with an additional tip how to better debug nuxt modules.


## Debugging Nuxt modules
The first time I truly needed a better debugger than just _console.log_ was when I started developing a larger scale Nuxt module.
Basically, this implies that what is actually needed is to debug the underlying _Node_ process.

In the upper right corner, select `Edit configurations`, click on the plus (+) sign and select `Node.js`
Configure the Node debugger accordingly to the following screenshot.


__IMAGE__

Select the newly create configuration and run the application in debug mode (the 'bug' icon in the upper right corner).

Couple of notes:
- The javascript file is the relative path to the Nuxt's binary. In many guides on the internet, you'll find
that people use the file located in `node_modules/.bin/nuxt`. This SHOULD work on Mac and Linux, but likely not on Windows.
This configuration works on Windows and SHOULD also on other systems.
- The javascript file can be also classic Nuxt instance, not the Typescript version. Simply locate the binary you need.
- The application parameters are parameters for the Nuxt instance. In this case, the `nuxt.config.ts` is not located in root directory,
but in the `test/fixtures`. You can likely leave this input blank.
- All in all, the configuration above is roughly the same as the following NPM script
`node --debug node_modules/nuxt-ts/bin/nuxt-ts.js test/fixtures`. However, Webstorm needs to initialize the application through its own debugger.


## Caveats
This solution is faaar from perfect. As I've mentioned, my goal was to debug modules. And that's what it does. You see, it only debugs the initialization process, the assembly of the Node application.
That means that you need to rebuild the app in order to debug the assembly, which includes your custom modules as well. It __does not__ allow you to debug the runtime process, the Nuxt application while running.
In order to debug pages, components and so on, you'll need different setup. Sucks, but I have yet to find a better way to do this.

Additionally, this method does not work with module's templates (the lodash templates) which are used extensively when building a Nuxt module.

## Other options
Here is a brief overview of other options:

### Debugging SSR in VS code
- Give this [guide](https://codeburst.io/debugging-nuxt-js-with-visual-studio-code-724920140b8f) a shot.


### Debugging client side with Webstorm
- Here is the [GitHub discussion](https://github.com/nuxt/nuxt.js/issues/1577) and here a _potentional_ [solution](https://github.com/nuxt/nuxt.js/issues/2781)
- The most comprehensive debugging guide is likely [this one](https://medium.com/@fernalvarez/nuxt-js-debugging-for-webstorm-9b4ef5415a5)



