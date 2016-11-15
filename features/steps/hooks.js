var myHooks = function() {
	this.setDefaultTimeout(600 * 1000);

    this.Before(function (scenario, callback) {
    	if (typeof browser == 'undefined') return;
        browser.clearMockModules();
        browser.manage().deleteAllCookies();
        callback();
    });
    
	this.registerHandler('AfterFeatures', function (event, callback) {
		if (typeof mutant == 'undefined') return;
		// clean up!
		// Be careful, there is no World instance available on `this` here
		// because all scenarios are done and World instances are long gone.

		mutant.mutate('off').then(callback, callback);
	});

	this.StepResult(function (event, callBack) {
		var stepResult, step, fs, dir;

		stepResult = event.getPayloadItem('stepResult');
		step = stepResult.getStep();

		if (stepResult.getFailureException()) {
			fs = require('fs');
			dir = '/screenShots/';
			if (typeof __base != 'undefined') dir = __base + dir;
			
			browser.takeScreenshot().then(function (png) {
				var stream, fname;

				fname = 'err_' + new Date().getTime() + '_' + step.getLine() + '_' + step.getName() + '_' + new Date().toISOString() + '.png';
				fname = fname.replace(/"|'|\//g, '').replace(/\s|:|>/g, '_');

				stream = fs.createWriteStream(dir + fname);
				stream.write(new Buffer(png, 'base64'));
				stream.end();
			}).then(callBack);
		} else callBack();
	});
};
module.exports = myHooks;