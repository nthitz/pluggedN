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

theme.add('Chillout Mixer Theme','nptZvUk');
theme.add('Chillout Mixer Theme II','mL0fuwb');
theme.add('Digital Dungeon Theme','WTylHRy');
theme.add('Digital Dungeon (Lite)','zSMRtE6');
theme.add('TT.fm Red Theme','u36VR4n');
theme.add('TT.fm After Party Theme','GZKgCpk');
theme.add('Red Rocks Theme','lK4GttQ');
theme.add('Fairy Tale Land','XZNVZmj');
theme.add('Mordor','9DVTnnW');
theme.add('Architect Chamber','8hfUntO');
theme.add('End of Line Club','6N7svVu');
theme.add('Off The Grid v1','JZjGLPH');
theme.add('Off The Grid v2','M4Z45oA');
theme.add('Digital Desert','tOEACrk');
theme.add('Ancient Ruins','HG8mqaM');
theme.add('Abandoned Ballroom','1aw3xcd');
theme.add('No Theme: Black','8G44P7F');
theme.add('No Theme: Plug','zuRZwYR');
theme.add('No Theme: Mixer','md2nlVM');
theme.add('Orbital Lounge','EFXFnql');
theme.add('Skygazer Theme (lite)','k9zVa92');
theme.add('Skygazer Theme','N82wzhY');
theme.add('Castleland (by Dionysu5)','jNRQXKZ');