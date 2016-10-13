
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

////////////////    Initialize VBO  ////////////////////////
var vertices = []
var colors = []
function initBuffers() {

    squareVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
    var totalSubs = 36;
    var r =0.5;
    // vertices = [
    //     0.0,  0.0,  0.0,
    // ];
    vertices.push(0.0,  0.0,  0.0);
    for (var i = 0; i < totalSubs; i++) {
      var d = degToRad(360/totalSubs) * i;
      vertices.push(r*Math.cos(d), r*Math.sin(d), 0.0);
    }
    d = 0;
    vertices.push(r*Math.cos(d), r*Math.sin(d), 0.0);
    // vertices.push(0.0,  0.0,  0.0);
    // vertices = [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0];
    // vertices = [
    //     0,  0,  0.0,
    //     0,  1,  0.0, 
    //     0, 1,  0.0,
    //     0.5, -0.5,  0.0,
    // ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    squareVertexPositionBuffer.itemSize = 3;
    squareVertexPositionBuffer.numItems = totalSubs+2;

    squareVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexColorBuffer);
    colors = [
        1.0, 1.0, 0.0, 1.0,
        // 0.0, 1.0, 0.0, 1.0,
        // 0.0, 0.0, 1.0, 1.0,
        // 1.0, 0.0, 0.0, 1.0,
        // 1.0, 0.0, 0.0, 1.0,
    ];
    for (var i = 0; i < totalSubs+1; i++) {
      colors.push(1.0, 0.0, 0.0, 1.0);
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    squareVertexColorBuffer.itemSize = 4;
    squareVertexColorBuffer.numItems = totalSubs+2;

}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////


var mvMatrix = mat4.create();
var Z_angle = 0.0;
var Z_Rad = 0.0;

function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}

function degToRad(degrees) {
  return degrees * Math.PI / 180;
}

function rad(x, y) {
  return Math.atan2(y,x);
}

///////////////////////////////////////////////////////////////

function drawScene() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.identity(mvMatrix);
    // mvMatrix = mat4.rotate(mvMatrix, degToRad(Z_angle), [0, 0, 1]); 
    // console.log('Z_rad = ' + Z_Rad*180/Math.PI);
    mvMatrix = mat4.rotate(mvMatrix, Z_Rad, [0, 0, 1]);

    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,squareVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

   setMatrixUniforms(); 

if (draw_type==2) gl.drawArrays(gl.TRIANGLE_FAN, 0, squareVertexPositionBuffer.numItems);
else if (draw_type ==1) gl.drawArrays(gl.LINE_LOOP, 0, squareVertexPositionBuffer.numItems);	
    else if (draw_type ==0) gl.drawArrays(gl.POINTS, 0, squareVertexPositionBuffer.numItems);

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
      console.log('screenY = ' + event.screenY + ' clientY' + event.clientY);
      lastMouseX = mouseX;
      lastMouseY = mouseY; 

  }

 function onDocumentMouseMove( event ) {
      var mouseX = event.clientX;
      var mouseY = event.clientY; 

      var diffX = mouseX - lastMouseX;
      var diffY = mouseY - lastMouseY;

      Z_angle = Z_angle + diffX/5;
      x = -1 + 2 * mouseX / gl.viewportWidth;
      y = -1 + 2 * (gl.viewportHeight - mouseY) / gl.viewportHeight;
      x0 = -1 + 2 * lastMouseX / gl.viewportWidth;
      y0 = -1 + 2 * (gl.viewportHeight - lastMouseY) / gl.viewportHeight;
      Z_Rad += rad(x, y) - rad(x0, y0);
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

///////////////////////////////////////////////////////////////

function webGLStart() {
    var canvas = document.getElementById("code03-canvas");
    initGL(canvas);
    initShaders();

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
    shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");

    initBuffers(); 

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    console.log('*****');
    console.error('nuuuuuuu');


   document.addEventListener('mousedown', onDocumentMouseDown,
   false); 

    drawScene();
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
