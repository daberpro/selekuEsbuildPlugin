const { SelekuCompiler } = require("@selekudev/compiler");

let selekuPlugin = {
  name: 'seleku',
  setup(build) {
    let { SelekuCompiler } = require('@selekudev/compiler')
    let path = require('path')
    let fs = require('fs')

    build.onResolve({filter: /^lib/igm},async (args)=>{

      return {
        path: path.join(__dirname,args.path,"")
      }

    })

    build.onLoad({ filter: /\.seleku$/ }, async (args) => {

      // Load the file from the file system
      let source = await fs.promises.readFile(args.path, 'utf8')
      let filename = path.relative(process.cwd(), args.path)

      try {
        let { JS } = new SelekuCompiler(path.basename(args.path).replace(/\.seleku/igm,"")).compile(source, { filename })
        let contents = JS;
        
        return { contents }
      } catch (e) {
        return { errors: [(e)=>{}] }
      }
    })

  }
}

module.exports = selekuPlugin;