var has_data = false;
var data;
var has_avgs = false;
var avgs = [];
var typesMap = {};
var sss;
var titles;

function set_data(lines) {
    data = lines;
    has_data = true;
}
    
function csv_draw_bars() {
    for (var i=0; i<data.length; i++) {
    	if (i != 0) {
    		if (typesMap.hasOwnProperty(data[i][0])) {
    			typesMap[data[i][0]]++;
    		}
    		else {
    			typesMap[data[i][0]] = 1;
    		}
    	}
    }

    // create avgs and fill it with 0
	for (var key in typesMap) {
		avgs_row = [];
		for (var j=0; j<data[0].length-1; j++) {
	    	avgs_row.push(0);
	    }
	    // console.log(avgs_row);
	    avgs.push(avgs_row);
	    // console.log(avgs);
	    // if (i==0) { 
	    // 	tmp = 0;
	    // 	avgs.push(tmp);
	    // }
	  //   else {
			// if (j==0) avgs[j] = 0; 
			// else avgs[j]+=Number(data[i][j]); 
	  //   } 
	}
	var t = 0; // t is type index
	titles = data.shift();
	for (var key in typesMap) 
	{
		// key = "virginica";
		for (var i = 0; i < Number(typesMap[key]); i++) {
			var row = data.shift();
			for (var j = 1; j < row.length; j++) {
				avgs[t][j-1] += Number(row[j]) / Number(typesMap[key]);
				// console.log('row[j]'+row[j]+' typesMap[key]'+typesMap[key] + ' Number(row[j]) / Number(typesMap[key]):'+Number(row[j]) / Number(typesMap[key]));
				// console.log('avgs[t][j-1]'+avgs[t][j-1]);
				// console.log('t='+t);
			}
		}
		t++;
	}
    
  //   for (var j = 0; j <data[0].length; j++) {
		// avgs[j] = avgs[j]/(data.length-1); 
		// console.log(" column "+j+" Avg = "+avgs[j]); 
  //   }

    has_avgs = true;
	sss = avgs;
    createBarVertices(avgs); 
}
