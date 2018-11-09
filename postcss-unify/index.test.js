var postcss = require('postcss');

var plugin = require('./index');

function run(input, output, opts) {
    return postcss([ plugin(opts) ]).process(input)
        .then(function(result) {
            expect(result.css).toEqual(output);
            expect(result.warnings().length).toBe(0);
        });
}


it('1', function () {
    return run('.a{ width:75 }', '.a{ width:10vw }', {});
});

it('2', function () {
    return run('.a{ width:150;height:750 }',
        '.a{ width:20vw;height:100vw }',
        {});
});

it('3', function () {
    return run('.a{width:750;height:30px }',
        '.a{width:100vw;height:30px }',
        {});
});

it('4', function () {
    return run('.a{width:0 }', '.a{width:0 }', {});
});

it('5', function () {
    return run('.a{padding:75; }', '.a{padding:10vw; }', {});
});

it('6', function () {
    return run('.a{margin-left:150 }', '.a{margin-left:20vw }', {});
});

it('7', function () {
    return run('.a{top:75 }', '.a{top:10vw }', {});
});

it('8', function () {
    return run('.a{top:75;padding-bottom:20% }',
        '.a{top:10vw;padding-bottom:20% }',
        {});
});
