
var gl;
var shaderProgram;
var draw_type=2;

//////////// Init OpenGL Context etc. ///////////////

function initGL(canvas) {
    try {
        gl = canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) {
    }
    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}


///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

var squareVertexPositionBuffer;
var squareVertexColorBuffer;
var squareVertexIndexBuffer;
var legendVertexPositionBuffer;
var legendVertexColorBuffer;
var lineVertexPositionBuffer;
var lineVertexColorBuffer;

var vertices = []; 
var indices = [];
var colors = [];
var legends = [];
var legendsColors = [];
var lines = [];
var linesColors = [];
var num_vertices; 
var num_indices;
var num_colors;
var num_legend;

var mode = 0;

var v_margin = 0.25; 
var min, max;

var colors_list = [26/256, 188/256, 156/256,1.0,
                   46/256, 204/256, 113/256,1.0,
                   52/256, 152/256, 219/256,1.0,
                   155/256, 89/256, 182/256,1.0,
                   52/256, 73/256, 94/256,1.0,
                   241/256, 196/256, 15/256,1.0,
                   230/256, 126/256, 34/256,1.0,
                   231/256, 76/256, 60/256,1.0];

function createBarVertices(avgs) {
    var num_bars = avgs.length * avgs[0].length;
    num_vertices = num_bars * 4;
    num_indices = num_bars * 6;
    num_colors = num_bars * 4;
    num_legend = avgs[0].length;

    var width; 
    min = avgs[0][0];
    max = avgs[0][0];
    // find min and max 
    for (var i=0; i<avgs.length; i++) {
        for (var j = 0; j < avgs[0].length; j++) {
            min = Math.min(avgs[i][j], min);
            max = Math.max(avgs[i][j], max);
        }
        // console.log( "val = " + avgs[i]); 
        // if (Number(avgs[i]) < min) min = Number(avgs[i]);
        // if (Number(avgs[i]) > max) max = Number(avgs[i]); 
    }
    // width = max-min; 
    // console.log("min = "+min+" max = "+max);

    //	console.log(num_vertices+"  "+num_indices); 

    var h = 2/(3*num_bars+1); 
    var width = (2 - v_margin * avgs.length) / avgs[0].length / avgs[0].length;
    for (var i = 0; i < avgs.length; i++) {
        for (var j = 0; j < avgs[0].length; j++) {
            // down left 
            vertices.push((i+1) * v_margin + (j + i*avgs.length) * width - 1);
            vertices.push(v_margin - 1);
            vertices.push(0.0);

            // upper left
            vertices.push((i+1) * v_margin + (j + i*avgs.length) * width - 1);
            vertices.push(avgs[i][j] / max * (2 - 2*v_margin) - 1 + v_margin);
            vertices.push(0.0);

            // down right
            vertices.push((i+1) * v_margin + ((j + i*avgs.length)+1) * width - 1);
            vertices.push(v_margin - 1);
            vertices.push(0.0);

            // upper right
            vertices.push((i+1) * v_margin + ((j + i*avgs.length)+1) * width - 1);
            vertices.push(avgs[i][j] / max * (2 - 2*v_margin) - 1 + v_margin);
            vertices.push(0.0);

            indices.push(0+4*(i*avgs[0].length+j));  indices.push(1+4*(i*avgs[0].length+j));  indices.push(2+4*(i*avgs[0].length+j));
            indices.push(1+4*(i*avgs[0].length+j));  indices.push(2+4*(i*avgs[0].length+j));  indices.push(3+4*(i*avgs[0].length+j));

            colors = colors.concat(colors_list.slice(j*4, j*4+4));
            colors = colors.concat(colors_list.slice(j*4, j*4+4));
            colors = colors.concat(colors_list.slice(j*4, j*4+4));
            colors = colors.concat(colors_list.slice(j*4, j*4+4));
        }
    }

    for (var i = 0; i < avgs[0].length; i++) {
        legends.push(0.7);
        legends.push(0.9-0.06*i);
        legends.push(0.0);
        legendsColors = legendsColors.concat(colors_list.slice(i*4, i*4+4));
    }

    lines = [v_margin/2 - 1, v_margin - 1, 0.0,
             1 - v_margin, v_margin - 1, 0.0,
             v_margin/2 - 1, v_margin - 1, 0.0,
             v_margin/2 - 1, 1 - v_margin, 0.0,];
    linesColors = [44/256, 62/256, 80/256, 1.0,
                  44/256, 62/256, 80/256, 1.0,
                  44/256, 62/256, 80/256, 1.0,
                  44/256, 62/256, 80/256, 1.0];


    
    // for (var i =0; i<num_bars; i++) {

    //     vertices.push(-1+(3*i+1)*h); vertices.push(-1+  v_margin); vertices.push(0.0);
    //     vertices.push(-1+(3*i+3)*h); vertices.push(-1+  v_margin); vertices.push(0.0);
    //     vertices.push(-1+(3*i+3)*h); vertices.push(-1+v_margin+(2-2*v_margin)*(avgs[i]-min)/width); vertices.push(0.0);
    //     vertices.push(-1+(3*i+1)*h); vertices.push(-1+v_margin+(2-2*v_margin)*(avgs[i]-min)/width); vertices.push(0.0);
        
    //     indices.push(0+4*i);  indices.push(1+4*i);  indices.push(2+4*i);
    //     indices.push(0+4*i);  indices.push(2+4*i);  indices.push(3+4*i); 	    
    // }

    initBuffers(); 

    drawScene();
} 

////////////////    Initialize VBO  ////////////////////////

function initBuffers() {

    squareVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    squareVertexPositionBuffer.itemSize = 3;
    squareVertexPositionBuffer.numItems = num_vertices;

    squareVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    squareVertexColorBuffer.itemSize = 4;
    squareVertexColorBuffer.numItems = num_colors; 

  	squareVertexIndexBuffer = gl.createBuffer();	
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, squareVertexIndexBuffer); 
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);  
    squareVertexIndexBuffer.itemSize = 1;
    squareVertexIndexBuffer.numItems = num_indices;

    legendVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, legendVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(legends), gl.STATIC_DRAW);
    legendVertexPositionBuffer.itemSize = 3;
    legendVertexPositionBuffer.numItems = num_legend;

    legendVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, legendVertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(legendsColors), gl.STATIC_DRAW);
    legendVertexColorBuffer.itemSize = 4;
    legendVertexColorBuffer.numItems = num_legend;

    lineVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, lineVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(lines), gl.STATIC_DRAW);
    lineVertexPositionBuffer.itemSize = 3;
    lineVertexPositionBuffer.numItems = lines.length / 3;

    lineVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, lineVertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(linesColors), gl.STATIC_DRAW);
    lineVertexColorBuffer.itemSize = 4;
    lineVertexColorBuffer.numItems = linesColors.length / 4;
}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////


var mvMatrix = mat4.create();
var Z_angle = 0.0;
var Xtranslate = 0.0, Ytranslate = 0.0; 

function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}

 function degToRad(degrees) {
    return degrees * Math.PI / 180;
 }

///////////////////////////////////////////////////////



function PushMatrix(stack, matrix) {
    var copy = mat4.create();
    mat4.set(matrix, copy);
    stack.push(copy);
}

function PopMatrix(stack, copy) {
    if (stack.length == 0) {
        throw "Invalid popMatrix!";
    }
    copy = stack.pop();
}

var mvMatrixStack = [];

///////////////////////////////////////////////////////////////////////

function drawScene() {
    var legendDiv = $("#legends")
    legendDiv.empty();
    for (var i = 1; i < titles.length; i++) {
        legendDiv.append("<div><span>" + titles[i] + "</span></div>")
    }
    
    var titlesDiv = $("#titles");
    titlesDiv.empty();
    var i = 0;
    for (var key in typesMap) {
        titleDiv = "<div style='left: "+i*170+"px; position:absolute;'>"+key+"</div>";
        // titleDiv.css({top: 600+'px', left: 200*i+'px', position: 'absolute'});
        titlesDiv.append(titleDiv);
        i++;
    }


    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.identity(mvMatrix);
    // console.log('Z angle = '+ Z_angle); 
    mvMatrix = mat4.rotate(mvMatrix, degToRad(Z_angle), [0, 0, 1]); 


    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,squareVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // draw elementary arrays - triangle indices 
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, squareVertexIndexBuffer); 
    setMatrixUniforms();
    switch(mode) {
        case 0: gl.drawElements(gl.TRIANGLES, squareVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0); break;
        case 1: gl.drawElements(gl.TRIANGLES, squareVertexIndexBuffer.numItems/3, gl.UNSIGNED_SHORT, 0); break;
        case 2: gl.drawElements(gl.TRIANGLES, squareVertexIndexBuffer.numItems/3, gl.UNSIGNED_SHORT, squareVertexIndexBuffer.numItems/3*2); break;
        case 3: gl.drawElements(gl.TRIANGLES, squareVertexIndexBuffer.numItems/3, gl.UNSIGNED_SHORT, squareVertexIndexBuffer.numItems/3*4); break;
    }
    
    // draw legends
    gl.bindBuffer(gl.ARRAY_BUFFER, legendVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, legendVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, legendVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, legendVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.POINTS, 0, legendVertexPositionBuffer.numItems);

    // draw lines
    gl.bindBuffer(gl.ARRAY_BUFFER, lineVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, lineVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, lineVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, lineVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.LINES, 0, lineVertexPositionBuffer.numItems);    
}

function removeHelpLines() {
    lines = lines.slice(0, 12);
    linesColors = linesColors.slice(0, 16);
    gl.bindBuffer(gl.ARRAY_BUFFER, lineVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(lines), gl.STATIC_DRAW);
    lineVertexPositionBuffer.itemSize = 3;
    lineVertexPositionBuffer.numItems = lines.length / 3;

    gl.bindBuffer(gl.ARRAY_BUFFER, lineVertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(linesColors), gl.STATIC_DRAW);
    lineVertexColorBuffer.itemSize = 4;
    lineVertexColorBuffer.numItems = linesColors.length / 4;
    drawScene();

    $("#height").empty();
}


function addHelpLines(mouseX, mouseY) {
    x = -1 + 2 * mouseX / gl.viewportWidth;
    y = -1 + 2 * (gl.viewportHeight - mouseY) / gl.viewportHeight;
    // y = 0;
    console.log("mouseX, mouseY:" + mouseX + mouseY);
    lines = lines.slice(0, 12).concat([v_margin/2 - 1, y, 0.0,
                                       x, y, 0.0,
                                       x, v_margin - 1, 0.0,
                                       x, y, 0.0,]);
    linesColors = linesColors.slice(0, 16).concat([149/256, 165/256, 166/256, 1.0,
                                                  149/256, 165/256, 166/256, 1.0,
                                                  149/256, 165/256, 166/256, 1.0,
                                                  149/256, 165/256, 166/256, 1.0]);

    gl.bindBuffer(gl.ARRAY_BUFFER, lineVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(lines), gl.STATIC_DRAW);
    lineVertexPositionBuffer.itemSize = 3;
    lineVertexPositionBuffer.numItems = lines.length / 3;

    gl.bindBuffer(gl.ARRAY_BUFFER, lineVertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(linesColors), gl.STATIC_DRAW);
    lineVertexColorBuffer.itemSize = 4;
    lineVertexColorBuffer.numItems = linesColors.length / 4;

    drawScene();

    var heightDiv = $("#height");
    heightDiv.empty();
    var h = (2*(gl.viewportHeight - mouseY) / gl.viewportHeight - v_margin) * max / (2 - 2*v_margin);
    heightDiv.append("<div><span>" + h.toFixed(2) + "</span></div>"); 
    console.log("heightDiv:" + heightDiv);
    // legendDiv.append("<div><span>" + h + "</span></div>")
    heightDiv.parent().css({position: 'relative'});
    heightDiv.css({top: mouseY+'px', left: mouseX+'px', position: 'absolute'});
}

///////////////////////////////////////////////////////////////

var lastMouseX = 0, lastMouseY = 0;


///////////////////////////////////////////////////////////////

function onDocumentMouseDown( event ) {
    event.preventDefault();
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'mouseup', onDocumentMouseUp, false );
    document.addEventListener( 'mouseout', onDocumentMouseOut, false );
    var mouseX = event.clientX;
    var mouseY = event.clientY;

    lastMouseX = mouseX;
    lastMouseY = mouseY; 

    addHelpLines(mouseX, mouseY);

}

function onDocumentMouseMove( event ) {
    var mouseX = event.clientX;
    var mouseY = event.clientY; 

    var diffX = mouseX - lastMouseX;
    var diffY = mouseY - lastMouseY;

    // Z_angle = Z_angle + diffX/5;

    lastMouseX = mouseX;
    lastMouseY = mouseY;

    addHelpLines(mouseX, mouseY);    
 }

function onDocumentMouseUp( event ) {
    removeHelpLines();
    document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
    document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
    document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
}

function onDocumentMouseOut( event ) {
    removeHelpLines();
    document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
    document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
    document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
}


function onKeyDown(event) {

  console.log(event.keyCode);
  switch(event.keyCode)  {
     case 65:
          if (event.shiftKey) {
            console.log('enter A');
            Xtranslate += .1;
          }
          else {
          console.log('enter a');
          Xtranslate -=.1; 
          }
     break;
     case 66:
          if (event.shiftKey) {
            console.log('enter B');
            Ytranslate += .1;
          }
          else {
          console.log('enter b');
          Ytranslate -=.1; 
          }
          break; 
   }
   drawScene();
}
///////////////////////////////////////////////////////////////

function webGLStart() {
    var canvas = document.getElementById("code05-canvas");
    initGL(canvas);
    initShaders();

    // shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    // gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);


    // shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
//        initBuffers(); 
    
    // shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
    // gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

    gl.clearColor(1.0, 1.0, 1.0, 1.0);

   document.addEventListener('mousedown', onDocumentMouseDown,false);
   document.addEventListener('keydown', onKeyDown, false); 

//        drawScene();
}

function BG(red, green, blue) {

    gl.clearColor(red, green, blue, 1.0);
    drawScene(); 

} 

function setMode(m) {
    mode = m;
    drawScene();
}


function redraw() {
    Z_angle = 0; 
    drawScene();
}


function geometry(type) {

    draw_type = type;
    drawScene();

} 
