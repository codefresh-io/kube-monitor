'use strict';

const _ = require('lodash');

module.exports.getStatus = (object) => {
    if (_.isArray(object)) {
        return _.map(object, (o) => {
            return _.pick(o, ['status', 'metadata']);
        });
    } else  { return _.pick(object, ['status', 'metadata']) ;}
};
