const _     = require('lodash');
const fp    = require('lodash/fp')
const chalk = require('chalk');
const debug = require('debug')('kube-utils');
const assert = require('assert');
const prettyjson = require('prettyjson');
const
    util = require('util'),
    Table = require('cli-table');
const logArray = (ar, options) => {
    console.log(`printing object ${_.get(ar, 'metadata.name')}\n`);
    _.forEach(ar, (v) => {
        console.log(`${JSON.stringify(v)}\n`);
    });
};
const logObj = (obj, options) => {
    console.log(`printing object ${_.get(obj, 'metadata.name')}\n`);
    _.forEach(obj, (v, k) => {
        toPrint = `${k}=${(!options.pretty)? JSON.stringify(v): prettyjson.render(v)}\n`;
        console.log(toPrint);
    });
};
const log = async (o, options)=> {
    debug(`printing ${JSON.stringify(o)}`);
    if (options.pretty)
    _.isArray(o) ? logArray(o, options) : logObj(o, options)

    return o;
};

const flattenEntityList = (o)=>{
    
    let kind = _.get(o, "kind")
    assert(kind);
    debug(`kind = ${kind}`)
    if ((index=kind.indexOf("List"))!=-1){
        let entity = _._.toLower(kind.slice(0, index))
        return  _.chain(o)
        .get("items").map((item)=>{
          
          return _.set(item, "kind", entity)
        }).value()
    }else 
     return o;
}

const labelsToString = (labels)=>{
    return _.map(labels, (v , k)=>{
      return `${k}=${v}`
    }).join(',')
}

const print = (entities , {
    title=["kind", "namespace", "name",  "labels", "status"],
    columns=["kind","metadata.namespace",
     "metadata.name", "metadata.labels", "status.phase"],
     colWidths=[10, 30, 30, 30, 60]
}={}
)=>{
 return tableFormatter({title, columns, colWidths}, entities);
  }

const tableFormatter = (function(){
        const CONFIG_PARSERS = [
            { test: _.isArray, parser: (config)=> ({ title: config.map(_.capitalize), column: config }) },
            { test: _.isObject, parser: (config)=> _.defaults(config, config["column"] && { title: config["column"].map(_.capitalize) }, config["title"] && { column: config["title"].map(_.toLower) })},
            { test: _.isNil, parser: (config, data)=> ((column)=> ({ title: column.map(_.capitalize), column }))(_(data).map(_.keys).flatten().uniq().value()) }
        ];

        return _.curry((config, data)=> {
          console.log('printing');
            let
                configuration = CONFIG_PARSERS.find(({ test })=> test(config)).parser(config, data),
                table = new Table({
                    head: configuration["title"].map(fp.unary(chalk.bold)),
                    chars: {
                        "top": "",
                        "top-mid": "",
                        "top-left": "",
                        "top-right": "",
                        "bottom": "",
                        "bottom-mid": "",
                        "bottom-left": "",
                        "bottom-right": "",
                        "left": "",
                        "left-mid": "",
                        "mid": "",
                        "mid-mid": "",
                        "right": "",
                        "right-mid": "",
                        "middle": ""
                    }
                });

            data.forEach((dataItem = [])=> {
                table.push(!_.isArray(dataItem)
                    ? _.at(dataItem, configuration["columns"]).map((data) => JSON.stringify(data) || "")
                    : dataItem.map((data) => data || "")
                )
            });

            return table.toString();
        }, 2);
    })();



module.exports.log = log;
module.exports.showInTable = tableFormatter ;
module.exports.flattenEntityList = flattenEntityList;
module.exports.labelsToString = labelsToString;
module.exports.printEntities = print;
module.exports.print  = print;
