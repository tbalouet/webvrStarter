module.exports = function(){
    switch(process.env.NODE_ENV){
        case 'dev':
            return {
                mainFile   : "_dev.js",
                aFrameFile : "/public/aframe.js",
                maxAge     : 1,//Set short maxage to allow no cache
                port       : 3000
            };

        case 'prod':
            return {
                mainFile   : "_prod.js",
                aFrameFile : "/public/aframe.min.js",
                maxAge     : 86400000,//One day cache
                port       : 80
            };

        default:
            return {error : true};
    }
};