
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

var vertices = []; 
var indices = [];
var colors = [];
var num_vertices; 
var num_indices;
var num_colors;
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

    var min, max;
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
    console.log("min = "+min+" max = "+max);

    //	console.log(num_vertices+"  "+num_indices); 

    var h = 2/(3*num_bars+1); 
    var v_margin = 0.25; 
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
    squareVertexIndexBuffer.itemsize = 1;
    squareVertexIndexBuffer.numItems = num_indices; 
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

    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.identity(mvMatrix);
    console.log('Z angle = '+ Z_angle); 
    mvMatrix = mat4.rotate(mvMatrix, degToRad(Z_angle), [0, 0, 1]); 


    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,squareVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // draw elementary arrays - triangle indices 
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, squareVertexIndexBuffer); 
    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, squareVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    
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
}

function onDocumentMouseMove( event ) {
    var mouseX = event.clientX;
    var mouseY = event.ClientY; 

    var diffX = mouseX - lastMouseX;
    var diffY = mouseY - lastMouseY;

    Z_angle = Z_angle + diffX/5;

    lastMouseX = mouseX;
    lastMouseY = mouseY;

    drawScene();
 }

function onDocumentMouseUp( event ) {
    document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
    document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
    document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
}

function onDocumentMouseOut( event ) {
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


function redraw() {
    Z_angle = 0; 
    drawScene();
}


function geometry(type) {

    draw_type = type;
    drawScene();

} 
