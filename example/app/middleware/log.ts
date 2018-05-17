

export default () => {

    return async function (_, next) {
        console.log('this is log middleare');
        return next();
    };
}