/*function theme() {
	this.themes = [];
	
	this.add = function(title, path) {
		this.themes.push([title, path]);
	};	
};

*/
var themes = []
var theme = {
	add: function(title, path) {
		themes.push({name: title, url: path})
	}
}