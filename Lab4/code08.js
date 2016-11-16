
//////////////////////////////////////////////////////////////////
//
//  This example is similar to code03.html, but I am showing you how to
//  use gl elemenntary array, i.e, triangle indices, to draw faces 
//

var gl;
var shaderProgram;
var draw_type=2;


  // set up the parameters for lighting 
  var light_ambient = [1,1,1,1]; 
  var light_diffuse = [.8,.8,.8,1];
  var light_specular = [1,1,1,1]; 
  var light_pos = [0,0,0,1];   // eye space position 

  var mat_ambient = [0.1, 0.1, 0.1, 1]; 
  var mat_diffuse= [1, 1, 0, 1]; 
  var mat_specular = [.5, .5, .5,1]; 
  var mat_shine = [50]; 

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

    var cylinderVertexPositionBuffer;
    var cylinderVertexNormalBuffer;
    var cylinderVertexColorBuffer;
    var cylinderVertexIndexBuffer; 


////////////////    Initialize VBO  ////////////////////////

var cyverts = [];
var cynormals = []; 
var cycolors = []; 
var cyindicies = [];

function InitCylinder(nslices, nstacks,  r,  g,  b) 
{
  var nvertices = nslices * nstacks;
    
  var Dangle = 2*Math.PI/(nslices-1); 

  for (j =0; j<nstacks; j++)
    for (i=0; i<nslices; i++) {
      var idx = j*nslices + i; // mesh[j][i] 
      var angle = Dangle * i; 
      cyverts.push(Math.cos(angle)); 
      cyverts.push(Math.sin(angle)); 
      cyverts.push(j*3.0/(nstacks-1)-1.5);

      cynormals.push(Math.cos(angle)); 
      cynormals.push(Math.sin(angle));
      cynormals.push(0.0); 

      cycolors.push(Math.cos(angle)); 
      cycolors.push(Math.sin(angle)); 
      cycolors.push(j*1.0/(nstacks-1));	
      cycolors.push(1.0); 
    }
  // now create the index array 

  nindices = (nstacks-1)*6*(nslices+1); 

  for (j =0; j<nstacks-1; j++)
    for (i=0; i<=nslices; i++) {
      var mi = i % nslices;
      var mi2 = (i+1) % nslices;
      var idx = (j+1) * nslices + mi;	
      var idx2 = j*nslices + mi; // mesh[j][mi] 
      var idx3 = (j) * nslices + mi2;
      var idx4 = (j+1) * nslices + mi;
      var idx5 = (j) * nslices + mi2;
      var idx6 = (j+1) * nslices + mi2;
	
      cyindicies.push(idx); 
      cyindicies.push(idx2);
      cyindicies.push(idx3); 
      cyindicies.push(idx4);
      cyindicies.push(idx5); 
      cyindicies.push(idx6);
    }
}



var sphere;
var sylinder;
var cube;
var wheel;
var cannon;
var ground;
function initBuffers() {
    ground = new Plane(1, [0.2, 0.1, 0.13, 1.0]);
    sphere = new Sphere(0.4, 16, 16, [0.3, 0.6, 0.1, 1.0]);
    // sphere = new Sphere(4, 16, 16, [0.3, 0.6, 0.1, 1.0]);
    sylinder = new Sylinder(2, 3, 1.5, 6, 6, [0.3, 0.6, 0.1, 1.0]);
    cube = new Cube(1);
    wheel = new Sylinder(1, 1, 1, 12, 12, [0.3, 1, 0.3, 1.0]);
    cannon = new Sylinder(1, 1, 1, 12, 12, [0.3, 1, 0.3, 1.0]);
    
}

 var rPyramid = 0;
    var rsylinder = 0;
    var camPos = [0, 4, 8];
    var camTar = [0, 0, 0];
    var camUp = [0, 1, 0];
    var panDegree = 0;
    function moveCam(i, m) {
        if (i == "pos") {
            for (var i = 0; i < m.length; i++) {
                camPos[i] += m[i] / 10;
            }
        }
        if (i == "tar") {
            for (var i = 0; i < m.length; i++) {
                camTar[i] += m[i] / 10;
            }
        }
        if (i == "pan") {
            var panRad = degToRad(panDegree + 5);
            var x = camUp[0];
            var y = camUp[1];
            camUp[0] = x * Math.cos(panRad) - y * Math.sin(panRad);
            camUp[1] = y * Math.cos(panRad) + x * Math.sin(panRad);
        }
    }

function drawObject(obj) {
        gl.bindBuffer(gl.ARRAY_BUFFER, obj.vertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, obj.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, obj.vertexColorBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, obj.vertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, obj.vertexNormalBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, obj.vertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.vertexIndexBuffer); 
        setMatrixUniforms();
        gl.drawElements(gl.TRIANGLES, obj.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);


    }


function initCYBuffers() {

        var nslices = 10;
        var nstacks = 50; 
        InitCylinder(nslices,nstacks,1.0,1.0,0.0);
    
        cylinderVertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cylinderVertexPositionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cyverts), gl.STATIC_DRAW);
        cylinderVertexPositionBuffer.itemSize = 3;
        cylinderVertexPositionBuffer.numItems = nslices * nstacks;

        cylinderVertexNormalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cylinderVertexNormalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cynormals), gl.STATIC_DRAW);
        cylinderVertexNormalBuffer.itemSize = 3;
        cylinderVertexNormalBuffer.numItems = nslices * nstacks;    

      	cylinderVertexIndexBuffer = gl.createBuffer();	
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cylinderVertexIndexBuffer); 
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cyindicies), gl.STATIC_DRAW);  
        cylinderVertexIndexBuffer.itemsize = 1;
        cylinderVertexIndexBuffer.numItems = (nstacks-1)*6*(nslices+1);

        cylinderVertexColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cylinderVertexColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cycolors), gl.STATIC_DRAW);
        cylinderVertexColorBuffer.itemSize = 4;
        cylinderVertexColorBuffer.numItems = nslices * nstacks;

}


var sqvertices = [];
var sqindices = [];
var sqcolors = [];

function InitSquare()
{
        sqvertices = [
             0.5,  0.5,  -.5,
	    -0.5,  0.5,  -.5, 
	    - 0.5, -0.5,  -.5,
 	    0.5, -0.5,  -.5,
             0.5,  0.5,  .5,
	    -0.5,  0.5,  .5, 
            -0.5, -0.5,  .5,
	     0.5, -0.5,  .5,	    
	    
        ];
	sqindices = [0,1,2, 0,2,3, 0,3,7, 0, 7,4, 6,2,3,6,3,7,5,1,2, 5,2,6,5,1,0,5,0,4,5,6,7,5,7,4];
        sqcolors = [
            1.0, 0.0, 0.0, 1.0,
            0.0, 1.0, 0.0, 1.0,
            0.0, 0.0, 1.0, 1.0,
            1.0, 0.0, 0.0, 1.0,
            1.0, 0.0, 0.0, 1.0,
            0.0, 1.0, 0.0, 1.0,
            0.0, 0.0, 1.0, 1.0,
            1.0, 0.0, 0.0, 1.0,	    
        ];    
}


function initSQBuffers() {

        InitSquare(); 
        squareVertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sqvertices), gl.STATIC_DRAW);
        squareVertexPositionBuffer.itemSize = 3;
        squareVertexPositionBuffer.numItems = 8;

      	squareVertexIndexBuffer = gl.createBuffer();	
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, squareVertexIndexBuffer); 
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(sqindices), gl.STATIC_DRAW);  
        squareVertexIndexBuffer.itemsize = 1;
        squareVertexIndexBuffer.numItems = 36;  

        squareVertexColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sqcolors), gl.STATIC_DRAW);
        squareVertexColorBuffer.itemSize = 4;
        squareVertexColorBuffer.numItems = 8;

}

    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////

    var mMatrix = mat4.create();  // model matrix
    var vMatrix = mat4.create(); // view matrix
    var pMatrix = mat4.create();  //projection matrix
    var nMatrix = mat4.create();  // normal matrix
    var Z_angle = .0;

    var mMatrixStack = [];

    function mvPushMatrix() {
        var copy = mat4.create();
        mat4.set(mMatrix, copy);
        mMatrixStack.push(copy);
    }

    function mvPopMatrix() {
        if (mMatrixStack.length == 0) {
            throw "Invalid popMatrix!";
        }
        mMatrix = mMatrixStack.pop();
    }

    function setMatrixUniforms() {
        gl.uniformMatrix4fv(shaderProgram.mMatrixUniform, false, mMatrix);
        gl.uniformMatrix4fv(shaderProgram.vMatrixUniform, false, vMatrix);
        gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);

        mat4.identity(nMatrix); 
        nMatrix = mat4.multiply(nMatrix, vMatrix);
        nMatrix = mat4.multiply(nMatrix, mMatrix);  
        nMatrix = mat4.inverse(nMatrix);
        nMatrix = mat4.transpose(nMatrix); 


        gl.uniformMatrix4fv(shaderProgram.nMatrixUniform, false, nMatrix);	

        gl.uniform4f(shaderProgram.light_posUniform,light_pos[0], light_pos[1], light_pos[2], light_pos[3]);  
        gl.uniform4f(shaderProgram.ambient_coefUniform, mat_ambient[0], mat_ambient[1], mat_ambient[2], 1.0); 
        gl.uniform4f(shaderProgram.diffuse_coefUniform, mat_diffuse[0], mat_diffuse[1], mat_diffuse[2], 1.0); 
        gl.uniform4f(shaderProgram.specular_coefUniform, mat_specular[0], mat_specular[1], mat_specular[2],1.0); 
        gl.uniform1f(shaderProgram.shininess_coefUniform, mat_shine[0]); 

        gl.uniform4f(shaderProgram.light_ambientUniform, light_ambient[0], light_ambient[1], light_ambient[2], 1.0); 
        gl.uniform4f(shaderProgram.light_diffuseUniform, light_diffuse[0], light_diffuse[1], light_diffuse[2], 1.0); 
        gl.uniform4f(shaderProgram.light_specularUniform, light_specular[0], light_specular[1], light_specular[2],1.0); 

	
    }

     function degToRad(degrees) {
        return degrees * Math.PI / 180;
     }


     var currentlyPressedKeys = {};
    // var xPosition = 1;
    var moveRotation = 1;
    var moveDirection = 1;
    var rTri = 0;
    var rSquare = 0;
    var xSpeed = 0;
    var ySpeed = 0;
    var zSpeed = 0;
    // var xPosition = 0;
    // var yPosition = 0;
    var movePosition = 0.0;
    var moveDegree = 0.0;
    var moveMatrix = mat4.create();
    mat4.identity(moveMatrix);
    var cannonLR = 0.0;
    var cannonUD = 0.0;
    var starX = 0;
    var starY = 0;

    var xAutoSpeed = -3;
    var yAutoSpeed = 0;
    var bumbPosition = 10;

    var windowY = 0;

    function handleKeyDown(event) {
        currentlyPressedKeys[event.keyCode] = true;
    }

    function handleKeyUp(event) {
        currentlyPressedKeys[event.keyCode] = false;
    }

    function handleKeys() {
        if (currentlyPressedKeys[37]) {
            // Left cursor key
            // moveDegree += 1;
            mat4.rotate(moveMatrix, degToRad(1), [0, 1, 0]);
        }
        if (currentlyPressedKeys[39]) {
            // Right cursor key
            // moveDegree -= 1;
            mat4.rotate(moveMatrix, degToRad(-1), [0, 1, 0]);
        }
        if (currentlyPressedKeys[38]) {
            // Up cursor key
            // movePosition += 0.1;
            mat4.translate(moveMatrix, [0.1, 0, 0]);
        }
        if (currentlyPressedKeys[40]) {
            // Down cursor key
            // movePosition -= 0.1;
            mat4.translate(moveMatrix, [-0.1, 0, 0]);
        }
        if (currentlyPressedKeys[87]) {
            // w
            if (cannonUD < 70) {
                cannonUD += 1;
            }
        }
        if (currentlyPressedKeys[83]) {
            // s
            if (cannonUD > 0) {
                cannonUD -= 1;
            }
        }
        if (currentlyPressedKeys[65]) {
            // a
            cannonLR += 1;
        }
        if (currentlyPressedKeys[68]) {
            // d
            cannonLR -= 1;
        }

        if (currentlyPressedKeys[32]) {
            if (bumbPosition > 3) {
                bumbPosition = 0;
            }
        }

        // if (currentlyPressedKeys[85]) {
        //     // u
        //     if (windowY < 0.0) {
        //         windowY += 0.1;
        //     }
        // }

        // if (currentlyPressedKeys[74]) {
        //     // j
        //     if (windowY > -2.0) {
        //         windowY -= 0.1;
        //     }
        // }
    }

    var mouseDown = false;
    var lastMouseX = null;
    var lastMouseY = null;

    var sceneChangeMatrix = mat4.create();
    mat4.identity(sceneChangeMatrix);

    function handleMouseDown(event) {
      
        mouseDown = true;
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
    }


    function handleMouseUp(event) {

        mouseDown = false;
    }


    function handleMouseMove(event) {

        if (!mouseDown) {
            return;
        }
        var newX = event.clientX;
        var newY = event.clientY;

        var deltaX = newX - lastMouseX
        var deltaY = newY - lastMouseY;
        var newChangeMatrix = mat4.create();
        console.log(event.button);
        if (event.button == 0) {
            mat4.identity(newChangeMatrix);
            mat4.rotate(newChangeMatrix, degToRad(deltaX / 5), [0, 1, 0]);
            mat4.rotate(newChangeMatrix, degToRad(deltaY / 5), [1, 0, 0]);
            mat4.multiply(newChangeMatrix, sceneChangeMatrix, sceneChangeMatrix);
        }
        else if (event.button == 2) {
            mat4.identity(newChangeMatrix);
            mat4.scale(newChangeMatrix, [deltaX / 100 + 1, deltaX/100 + 1, 1.0]);
            mat4.scale(newChangeMatrix, [deltaY/100 + 1, deltaY/100 + 1, 1.0]);
            mat4.multiply(newChangeMatrix, sceneChangeMatrix, sceneChangeMatrix);
        }
        else if (event.button == 1) {
            mat4.identity(newChangeMatrix);
            mat4.translate(newChangeMatrix, [deltaX / 100, 0.0, 0.0]);
            mat4.translate(newChangeMatrix, [0.0, -deltaY / 100, 0.0]);
            mat4.multiply(newChangeMatrix, sceneChangeMatrix, sceneChangeMatrix);
        }

        lastMouseX = newX;
        lastMouseY = newY;
    }





    ///////////////////////////////////////////////////////////////

    function drawScene() {
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      	pMatrix = mat4.perspective(60, 1.0, 0.1, 100, pMatrix);  // set up the projection matrix 
      	mat4.lookAt(camPos, camTar, camUp, vMatrix);	// set up the view matrix, multiply into the modelview matrix

        mat4.identity(mMatrix);	
      	mat4.translate(mMatrix, [0.0, 0.0, -2.0]);
        // mMatrix = mat4.rotate(mMatrix, degToRad(90), [1, 0, 0]); 
        // mMatrix = mat4.rotate(mMatrix, degToRad(-Z_angle), [0, 0, 1]);   // now set up the model matrix
        mat4.translate(mMatrix, [0.0, 0.0, -5.0]);
        mat4.multiply(mMatrix, sceneChangeMatrix);

        
        
        // ground
        mvPushMatrix();
        mat4.translate(mMatrix, [0, -2, 0]);
        mat4.scale(mMatrix, [100, 1, 100]);
        drawObject(ground);
        mvPopMatrix();

        // // mat4.rotate(mMatrix, degToRad(moveDegree) [0, 1.0, 0]);
        // // mat4.rotate(mMatrix, degToRad(moveDegree), [0, 1, 0]);
        // // mat4.translate(mMatrix, [movePosition, 0.0, 0.0]);
        mat4.multiply(mMatrix, moveMatrix);

        // tank body
        mvPushMatrix();
        // mat4.rotate(mMatrix, degToRad(rsylinder), [1, 0, 0]);
        mvPushMatrix();
        mat4.translate(mMatrix, [0, 0.5, 0]);
        mat4.scale(mMatrix, [2, 2, 2]);
        drawObject(sphere);
        mvPopMatrix();
        mat4.scale(mMatrix, [5, 1, 3]);
        drawObject(cube);
        mvPopMatrix();

        // // base
        // mvPushMatrix();
        // mat4.rotate(mMatrix, degToRad(cannonLR), [0, 1, 0]);
        // mat4.translate(mMatrix, [0.0, 2.5/2, 0.0]);        
        // mat4.rotate(mMatrix, degToRad(30), [0, 1, 0]);
        // drawObject(sylinder);
        // mvPushMatrix();
        // mat4.rotate(mMatrix, degToRad(cannonUD), [0, 0, 1]);
        // mat4.rotate(mMatrix, degToRad(-80), [0, 0, 1]);
        // mat4.translate(mMatrix, [0.2, 2, 0]);
        // // mat4.rotate(mMatrix, degToRad(30), [0, -1, 0]);
        // // mat4.translate(mMatrix, [0, 0.5, 0]);
        // // mat4.rotate(mMatrix, degToRad(90 - 20), [0, 0, -1]);
        // // mat4.translate(mMatrix, [0, -0.5, 0]);
        // mat4.scale(mMatrix, [1, 3, 1]);
        // drawObject(cannon);
        // mat4.rotate(mMatrix, degToRad(90), [0, 0, 1]);
        // mvPushMatrix();
        // mat4.scale(mMatrix, [1/3, 1, 1]);
        // mat4.translate(mMatrix, [bumbPosition, 0, 0]);
        // mat4.rotate(mMatrix, degToRad(rPyramid), [0, 1, 0]);
        // drawObject(sphere);
        // mvPopMatrix();
        // mvPopMatrix();
        // mvPopMatrix();

        // wheels
        // for (var i = 0; i < 5; i++) {
        //     mvPushMatrix();
        //     // mat4.translate(mMatrix, [i, -1.0, 0.0]);
        //     mat4.rotate(mMatrix, degToRad(90), [1, 0, 0]);
        //     mat4.scale(mMatrix, [1.0, 3.0, 1.0]);
        //     drawObject(wheel);
        //     mvPopMatrix();
        // }       


	
	/*
        gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexColorBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,squareVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
	*/

       //  gl.bindBuffer(gl.ARRAY_BUFFER, cylinderVertexPositionBuffer);
       //  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cylinderVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

       //  gl.bindBuffer(gl.ARRAY_BUFFER, cylinderVertexNormalBuffer);
      	// gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, cylinderVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

       //  gl.bindBuffer(gl.ARRAY_BUFFER, cylinderVertexColorBuffer);
       //  gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,cylinderVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
      	// gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cylinderVertexIndexBuffer); 	

       setMatrixUniforms();   // pass the modelview mattrix and projection matrix to the shader 

	if (draw_type ==1) gl.drawArrays(gl.LINE_LOOP, 0, cylinderVertexPositionBuffer.numItems);	
        else if (draw_type ==0) gl.drawArrays(gl.POINTS, 0, cylinderVertexPositionBuffer.numItems);
	else if (draw_type==2) gl.drawElements(gl.TRIANGLES, cylinderVertexIndexBuffer.numItems , gl.UNSIGNED_SHORT, 0);
	
	/*
	if (draw_type ==1) gl.drawArrays(gl.LINE_LOOP, 0, squareVertexPositionBuffer.numItems);	
        else if (draw_type ==0) gl.drawArrays(gl.POINTS, 0, squareVertexPositionBuffer.numItems);
	else if (draw_type==2) gl.drawElements(gl.TRIANGLES, squareVertexIndexBuffer.numItems , gl.UNSIGNED_SHORT, 0);
	*/
	
    }


    ///////////////////////////////////////////////////////////////

    //  var lastMouseX = 0, lastMouseY = 0;

    // ///////////////////////////////////////////////////////////////

    //  function onDocumentMouseDown( event ) {
    //       event.preventDefault();
    //       document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    //       document.addEventListener( 'mouseup', onDocumentMouseUp, false );
    //       document.addEventListener( 'mouseout', onDocumentMouseOut, false );
    //       var mouseX = event.clientX;
    //       var mouseY = event.clientY;

    //       lastMouseX = mouseX;
    //       lastMouseY = mouseY; 

    //   }

    //  function onDocumentMouseMove( event ) {
    //       var mouseX = event.clientX;
    //       var mouseY = event.ClientY; 

    //       var diffX = mouseX - lastMouseX;
    //       var diffY = mouseY - lastMouseY;

    //       Z_angle = Z_angle + diffX/5;

    //       lastMouseX = mouseX;
    //       lastMouseY = mouseY;

    //       drawScene();
    //  }

    //  function onDocumentMouseUp( event ) {
    //       document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
    //       document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
    //       document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
    //  }

    //  function onDocumentMouseOut( event ) {
    //       document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
    //       document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
    //       document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
    //  }

    ///////////////////////////////////////////////////////////////

    function webGLStart() {
        var canvas = document.getElementById("code03-canvas");
        initGL(canvas);
        initShaders();

      	gl.enable(gl.DEPTH_TEST); 

        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

        shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
        gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);
	
        shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
        gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
	
        shaderProgram.mMatrixUniform = gl.getUniformLocation(shaderProgram, "uMMatrix");
        shaderProgram.vMatrixUniform = gl.getUniformLocation(shaderProgram, "uVMatrix");
      	shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
      	shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");	

        shaderProgram.light_posUniform = gl.getUniformLocation(shaderProgram, "light_pos");
        shaderProgram.ambient_coefUniform = gl.getUniformLocation(shaderProgram, "ambient_coef");	
        shaderProgram.diffuse_coefUniform = gl.getUniformLocation(shaderProgram, "diffuse_coef");
        shaderProgram.specular_coefUniform = gl.getUniformLocation(shaderProgram, "specular_coef");
        shaderProgram.shininess_coefUniform = gl.getUniformLocation(shaderProgram, "mat_shininess");

        shaderProgram.light_ambientUniform = gl.getUniformLocation(shaderProgram, "light_ambient");	
        shaderProgram.light_diffuseUniform = gl.getUniformLocation(shaderProgram, "light_diffuse");
        shaderProgram.light_specularUniform = gl.getUniformLocation(shaderProgram, "light_specular");	

        initBuffers();
        initSQBuffers();
      	initCYBuffers(); 

        gl.clearColor(0.2, 0.2, 0.2, 1.0);
        console.log('start! ');
        console.error('I hope no error ....');


       // document.addEventListener('mousedown', onDocumentMouseDown,false); 

        // drawScene();
        canvas.oncontextmenu = function (e) {e.preventDefault();};
        canvas.onmousedown = handleMouseDown;
        document.onmouseup = handleMouseUp;
        document.onmousemove = handleMouseMove;
        document.onkeydown = handleKeyDown;
        document.onkeyup = handleKeyUp;

        tick();
    }
var lastTime = 0;

    function animate() {
        var timeNow = new Date().getTime();
        if (lastTime != 0) {
            var elapsed = timeNow - lastTime;
            bumbPosition += 1/10;
            rPyramid += (90 * elapsed) / 1000.0;
            rsylinder -= (75 * elapsed) / 1000.0;
        }
        lastTime = timeNow;
    }
    function tick() {
        requestAnimFrame(tick);
        drawScene();
        animate();
        handleKeys();
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
