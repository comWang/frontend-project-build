module.exports = {
    plugins: [
        require('autoprefixer'),
        require('./postcss-unify')({ size: 750 }),
    ],
};
