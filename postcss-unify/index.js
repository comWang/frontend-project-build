var postcss = require('postcss');

module.exports = postcss.plugin('postcss-unify', function (opts) {
    opts = opts || {};
    var size = opts.size || 750;
    return function (root) {
        root.walkRules(function (rule) {
            var filter = /.*(width)|(height)|(font-size)|(margin)|(padding)|(left)|(right)|(top)|(bottom).*/;
            rule.walkDecls(filter, function (decl) {
                var value = decl.value.replace(/\s/g, '');
                if (value * 1 !== 0 && !/\D/.test(value)) {
                    decl.value = value * 100 / size + 'vw';
                }
            });
        });
    };
});
